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

DevNote의 콘텐츠 용어는 다음과 같습니다.

| 용어 | 역할 |
| --- | --- |
| 섹션 | 기술별 노트를 묶는 폴더 (`content/<section>/`) |
| 노트 | 하나의 MDX 파일이자 내비게이션·검색·이동의 단위 (`<note>.mdx`) |
| 주제 | 노트 내부의 `##` 제목 단위이며 검색 결과의 단위 |
| 페이지 | 인덱스나 노트 상세처럼 화면·라우트 자체를 가리킬 때만 사용 |

학습 노트는 `content/<section>/<note>.mdx`에 있습니다. 같은 폴더에 제목 frontmatter를 가진 노트를 추가하면 파일명의 숫자를 인식하는 이름순으로 정렬되고, 내비게이션과 검색 인덱스에 자동 반영됩니다. 섹션 표시 이름은 각 폴더의 `meta.json`, 섹션 순서는 `content/meta.json`에서 관리합니다.

새 섹션을 추가할 때는 섹션 폴더에 표시 이름을 가진 `meta.json`을 만들고, 원하는 위치를 최상위 `content/meta.json`의 `pages`에 추가합니다.

`pages`는 Fumadocs 메타 스키마가 요구하는 필드명이며, 이 프로젝트에서는 섹션 순서를 담는 예외적인 이름입니다. 애플리케이션 코드와 작성 문서에서는 이를 섹션 순서로 부릅니다.

이 프로젝트는 Fumadocs의 Vite MDX 컴파일러와 구조화 데이터를 콘텐츠 계층으로 사용합니다. 기존 HashRouter와 맞춤 UI는 유지하므로 GitHub Pages 배포 경로와 화면 구성을 바꾸지 않고 노트를 독립적으로 확장할 수 있습니다.

````mdx
---
title: "Part 1. 노트 제목"
---

## 첫 번째 주제

설명 본문입니다.

```ts
const example = true;
```
````
