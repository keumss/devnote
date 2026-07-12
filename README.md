# DevNote

개발 지식과 학습 내용을 정리한 정적 React 웹 앱입니다.

## 로컬 실행

Node.js가 필요합니다.

```bash
npm install
npm run dev
```

## 빌드

```bash
npm run build
```

정적 빌드 결과는 `dist/`에 생성됩니다. GitHub Pages에서 저장소 하위 경로와 클라이언트 라우팅이 모두 동작하도록 상대 자산 경로와 해시 라우팅을 사용합니다.

## 검증

```bash
npm run lint
npm test
npm run build
```

## 콘텐츠 추가

학습 콘텐츠는 `content/docs/<section>/<document>.mdx`에 있습니다. 같은 폴더에 제목 frontmatter를 가진 문서를 추가하면 파일명의 숫자를 인식하는 이름순으로 정렬되고, 내비게이션과 검색 인덱스에 자동 반영됩니다. 섹션 표시 이름은 각 폴더의 `meta.json`, 섹션 순서는 `content/docs/meta.json`에서 관리합니다.

새 섹션을 추가할 때는 섹션 폴더에 표시 이름을 가진 `meta.json`을 만들고, 원하는 위치를 최상위 `content/docs/meta.json`의 `pages`에 추가합니다.

이 프로젝트는 Fumadocs의 Vite MDX 컴파일러와 구조화 데이터를 콘텐츠 계층으로 사용합니다. 기존 HashRouter와 맞춤 UI는 유지하므로 GitHub Pages 배포 경로와 화면 구성을 바꾸지 않고 문서만 독립적으로 확장할 수 있습니다.

````mdx
---
title: "Part 1. 문서 제목"
---

## 첫 번째 주제

설명 본문입니다.

```ts
const example = true;
```
````
