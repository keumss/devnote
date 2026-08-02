import { readFile, stat } from 'node:fs/promises';
import { dirname, extname, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

const projectRoot = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const outputRoot = resolve(projectRoot, 'dist');
const manifestPath = resolve(outputRoot, '.vite/manifest.json');

const budgets = {
  homeCore: 130_000,
  noteCore: 170_000,
  shared: 50_000,
  codeFont: 45_000,
  search: 230_000,
};

const coreExtensions = new Set(['.js', '.css']);
const fontExtensions = new Set(['.woff', '.woff2']);

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

function filterFiles(files, extensions) {
  return new Set([...files].filter(file => extensions.has(extname(file))));
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
const codeFontFiles = filterFiles(homeFiles, fontExtensions);

let largestNote = { key: '', files: new Set(), size: 0 };

for (const noteKey of noteKeys) {
  const noteEntries = collectStaticEntries([noteKey]);
  const files = filterFiles(
    collectFiles(union(entryEntries, notePageEntries, noteEntries)),
    coreExtensions,
  );
  const size = await getFilesSize(files);

  if (size > largestNote.size) {
    largestNote = { key: noteKey, files, size };
  }
}

const measurements = [
  {
    label: 'Home core JS/CSS',
    size: await getFilesSize(filterFiles(homeFiles, coreExtensions)),
    budget: budgets.homeCore,
  },
  {
    label: `Largest fully rendered note JS/CSS (${largestNote.key.split('/').at(-1)})`,
    size: largestNote.size,
    budget: budgets.noteCore,
  },
  {
    label: 'Eager shared JS/CSS',
    size: await getFilesSize(filterFiles(sharedFiles, coreExtensions)),
    budget: budgets.shared,
  },
  {
    label: 'Conditional code font',
    size: await getFilesSize(codeFontFiles),
    budget: budgets.codeFont,
  },
  {
    label: 'On-demand search JS/CSS',
    size: await getFilesSize(filterFiles(searchFiles, coreExtensions)),
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
