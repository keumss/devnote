import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(projectRoot, 'dist');
const manifestPath = resolve(outputRoot, '.vite/manifest.json');

const budgets = {
  home: 200_000,
  note: 210_000,
  shared: 100_000,
  search: 250_000,
};

const manifest = JSON.parse(await readFile(manifestPath, 'utf8'));

function requireEntry(key) {
  if (!manifest[key]) {
    throw new Error(`Vite manifest entry not found: ${key}`);
  }

  return key;
}

function collectStaticEntries(initialKeys) {
  const collected = new Set();
  const pending = [...initialKeys];

  while (pending.length > 0) {
    const key = pending.pop();

    if (!key || collected.has(key)) {
      continue;
    }

    const entry = manifest[key];

    if (!entry) {
      throw new Error(`Imported Vite manifest entry not found: ${key}`);
    }

    collected.add(key);
    pending.push(...(entry.imports ?? []));
  }

  return collected;
}

function collectFiles(entryKeys) {
  const files = new Set();

  for (const key of entryKeys) {
    const entry = manifest[key];

    files.add(entry.file);

    for (const file of entry.css ?? []) {
      files.add(file);
    }

    for (const file of entry.assets ?? []) {
      files.add(file);
    }
  }

  return files;
}

function union(...sets) {
  return new Set(sets.flatMap((set) => [...set]));
}

function difference(source, excluded) {
  return new Set([...source].filter((value) => !excluded.has(value)));
}

function intersection(left, right) {
  return new Set([...left].filter((value) => right.has(value)));
}

async function getTransferSize(file) {
  const filePath = resolve(outputRoot, file);
  const extension = extname(file);

  if (extension === '.js' || extension === '.css') {
    const contents = await readFile(filePath);
    return gzipSync(contents).byteLength;
  }

  return (await stat(filePath)).size;
}

async function getFilesSize(files) {
  const sizes = await Promise.all([...files].map(getTransferSize));
  return sizes.reduce((total, size) => total + size, 0);
}

function formatSize(bytes) {
  return `${(bytes / 1000).toFixed(1)} kB`;
}

const entryKey = requireEntry('index.html');
const indexPageKey = requireEntry('src/components/IndexPage.tsx');
const notePageKey = requireEntry('src/components/NotePage.tsx');
const searchKey = requireEntry('src/search.ts');
const noteKeys = Object.keys(manifest).filter(
  (key) => key.startsWith('content/') && key.includes('?collection=docs'),
);

if (noteKeys.length === 0) {
  throw new Error('No note chunks were found in the Vite manifest.');
}

const entryEntries = collectStaticEntries([entryKey]);
const indexPageEntries = collectStaticEntries([indexPageKey]);
const notePageEntries = collectStaticEntries([notePageKey]);
const homeEntries = union(entryEntries, indexPageEntries);
const sharedEntries = difference(
  intersection(indexPageEntries, notePageEntries),
  entryEntries,
);
const eagerBaseEntries = union(entryEntries, sharedEntries);
const searchEntries = collectStaticEntries([searchKey]);

const homeFiles = collectFiles(homeEntries);
const sharedFiles = collectFiles(sharedEntries);
const eagerBaseFiles = collectFiles(eagerBaseEntries);
const searchFiles = difference(collectFiles(searchEntries), eagerBaseFiles);

let largestNote = { key: '', files: new Set(), size: 0 };

for (const noteKey of noteKeys) {
  const noteEntries = collectStaticEntries([noteKey]);
  const files = collectFiles(union(entryEntries, notePageEntries, noteEntries));
  const size = await getFilesSize(files);

  if (size > largestNote.size) {
    largestNote = { key: noteKey, files, size };
  }
}

const measurements = [
  {
    label: 'Home initial assets',
    size: await getFilesSize(homeFiles),
    budget: budgets.home,
  },
  {
    label: `Largest note initial assets (${largestNote.key.split('/').at(-1)})`,
    size: largestNote.size,
    budget: budgets.note,
  },
  {
    label: 'Eager shared chunk',
    size: await getFilesSize(sharedFiles),
    budget: budgets.shared,
  },
  {
    label: 'Lazy search chunk',
    size: await getFilesSize(searchFiles),
    budget: budgets.search,
  },
];

let hasFailure = false;

for (const measurement of measurements) {
  const passed = measurement.size <= measurement.budget;
  const marker = passed ? '\u2713' : '\u2717';

  console.log(
    `${marker} ${measurement.label}: ${formatSize(measurement.size)} / ${formatSize(measurement.budget)}`,
  );

  hasFailure ||= !passed;
}

if (hasFailure) {
  process.exitCode = 1;
}
