# 저장소 가이드

## 문서 역할

- README: 프로젝트 소개와 로컬 사용 방법
- AGENTS: 변경 작업의 구조·스타일·검증·제출 규칙
- 명령어와 기본 구조는 두 문서에 함께 둔다.

## 구조

- DevNote는 Vite 기반 React 19·TypeScript 정적 앱이다.
- 주요 구조는 다음과 같다.

```text
.
├── src/
│   ├── main.tsx            # 해시 라우팅 초기화
│   ├── App.tsx             # 라우트 정의
│   ├── components/         # 공용 UI
│   ├── hooks/              # 재사용 상태 로직
│   ├── content.ts          # Fumadocs 콘텐츠 로더
│   ├── index.css           # 전역 스타일
│   └── test/               # 테스트 설정
├── content/
│   ├── meta.json           # 섹션 순서
│   └── <section>/
│       ├── meta.json       # 섹션 표시 이름
│       └── <note>.mdx      # 학습 노트
├── source.config.ts        # Fumadocs MDX·스키마 설정
├── vite.config.ts          # 빌드 설정
└── public/                 # 필요 시 정적 자산 추가
```

- 테스트는 컴포넌트 옆의 `ComponentName.test.tsx` 또는 `src/__tests__/`에 둔다.
- 섹션은 기술별 폴더, 노트는 MDX 파일, 토픽은 노트의 `##` 제목이다.
- `content/meta.json`의 `pages`는 Fumadocs 스키마 필드다. 화면·라우트 외에는 “page”라는 표현을 쓰지 않는다.
- `.source/`는 생성물이다. 커밋하지 않는다.

## 명령어

- `npm install`: 잠긴 의존성 설치
- `npm run dev`: 포트 3000에서 개발 서버 실행
- `npm run lint`: TypeScript 타입 검사
- `npm test`: jsdom에서 Vitest 1회 실행
- `npm run build`: `dist/`에 프로덕션 빌드
- `npm run preview`: 빌드 결과 로컬 확인
- `npm run clean`: 생성물 삭제
- 제출 전 `npm run lint && npm test && npm run build`를 실행한다.

## 코드 스타일

- TypeScript, ES 모듈, React 함수 컴포넌트, 2칸 들여쓰기를 사용한다.
- 기존 세미콜론·작은따옴표 스타일을 따른다.
- 컴포넌트 파일은 PascalCase: `SearchModal.tsx`
- 훅은 `use` 접두사의 camelCase: `useDarkMode.ts`
- 변수·함수는 camelCase를 사용한다.
- 재사용 가능한 상태 로직은 훅으로 분리한다.
- 기존 Tailwind·다크 모드 패턴을 유지한다.
- 자동 포매터와 ESLint 설정은 없다. 변경 범위를 좁히고 `npm run lint`를 실행한다.

## 학습 노트

- 콘텐츠 추가·수정은 AI 에이전트가 수행한다.
- TypeScript에 내용을 넣지 말고 `content/<section>/<note>.mdx`를 추가·수정한다.
- frontmatter에는 `title` 등 노트 전용 메타데이터만 둔다. 섹션·순서는 중복하지 않는다.
- 파일명 숫자 순서가 노트 순서다. 탐색·검색 데이터는 자동 생성되므로 별도 인덱스를 만들지 않는다.
- 검색 토픽에는 `##` 제목을 사용하고, 코드 블록에는 언어 식별자를 지정한다.
- 새 섹션은 다음 순서로 추가한다.
  1. `content/<section>/` 폴더를 만든다.
  2. 표시 이름을 담은 `meta.json`을 추가한다.
  3. `content/meta.json`의 `pages`에 섹션을 원하는 순서로 추가한다.
- `pages`는 Fumadocs 필드명이며, 문서에서는 섹션 순서로 부른다.

````mdx
---
title: 'Part 1. 노트 제목'
---

## 첫 번째 주제

설명 본문입니다.

```ts
const example = true;
```
````

## 테스트

- Vitest, Testing Library, jsdom을 사용한다.
- UI 변경 시 데스크톱·모바일, 검색, 탐색, 코드 복사, 라이트·다크 모드를 수동 확인한다.
- 커버리지 기준은 없다.

## 커밋·PR

- 짧은 명령형 커밋 메시지를 쓴다.
  - 예: `fix: preserve search navigation`
  - 예: `docs: update contributor guide`
- PR에는 변경 내용, 검증 명령어, 관련 이슈를 적는다.
- UI 변경 PR에는 전·후 스크린샷을 넣는다.
- `dist/`, 환경 파일, 자격 증명, 생성 로그는 커밋하지 않는다.

## 배포

- GitHub Pages를 위해 Vite의 `base: './'`와 `HashRouter`를 유지한다.
- 배포 구조가 바뀔 때만 변경한다.
