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

## 콘텐츠 추가

학습 콘텐츠는 `content/docs/<section>/<document>.mdx`에 있습니다. 같은 폴더의 기존 문서를 복사해 frontmatter의 섹션 정보와 순서를 지정한 뒤 Markdown으로 내용을 작성하면, 내비게이션과 검색 인덱스에 자동 반영됩니다.

이 프로젝트는 Fumadocs의 Vite MDX 컴파일러와 구조화 데이터를 콘텐츠 계층으로 사용합니다. 기존 HashRouter와 맞춤 UI는 유지하므로 GitHub Pages 배포 경로와 화면 구성을 바꾸지 않고 문서만 독립적으로 확장할 수 있습니다.

````mdx
---
title: "Part 1. 문서 제목"
description: "문서 요약"
section: "example"
sectionTitle: "Example"
sectionOrder: 7
order: 1
---

## 첫 번째 주제

설명 본문입니다.

```ts
const example = true;
```
````
