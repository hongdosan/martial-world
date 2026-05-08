# Handoff — 2026-05-08~09 — FE 디렉토리 이전 + Vite 마이그레이션 사이클 종료

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 fact 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — FE 디렉토리 이전 + Vite 마이그레이션 사이클 (3단계) 전체 종료 ✅**
>
> **선행 핸드오프**: [`2026-05-07-be-fe-consistency-cycle.md`](./2026-05-07-be-fe-consistency-cycle.md)

## Summary

천기망 FE 표준 ↔ 코드 정합 사이클 종료. **모노레포 구조 (`backend/` + `frontend/`)** + **Vite 5.x + Vitest** + **FE 프롬프트 BE 깊이 정합** 3단계 일괄 처리. 단계 1 (디렉토리 이전) + 단계 2 (Vite 마이그레이션) + 단계 3 (Phase B Minor 7건 보강) 모두 commit 완료. 다음 진화 트리거는 사용자 결정 (**메타 정책** / **backend/ 첫 셋업** / **TanStack·Tailwind 도입** / **App.tsx CRA 잔재 정리** 등 다수 후보).

## Key Decisions

| # | 일자 | 결정 | 근거 |
|---|------|------|------|
| 1 | 2026-05-08 | 사이클 범위 = FE 이전 + Vite 마이그레이션만 (TanStack/Tailwind/backend 셋업 제외) | 사용자 선택 — 변경량·리스크 통제 |
| 2 | 2026-05-08 | 3단계 분할 (이전 → Vite → 의존성) | 사용자 선택 — 각 단계 독립 검증·rollback 가능 |
| 3 | 2026-05-08 | `backend/.gitkeep` placeholder 만 단계 1 commit 에 포함 | 사용자 선택 — 모노레포 정합 맥락 동행, backend 첫 셋업은 별도 사이클 |
| 4 | 2026-05-08 | `.env*` 파일은 `frontend/` 하위로 이동 (root 유지 X) | 사용자 선택 — Vite 기본값 정합 |
| 5 | 2026-05-08 | Phase B Minor 7건 출처 보완 = 새 audit 라운드로 재식별 | 사용자 선택 — 선행 핸드오프 순환 참조 발견, 정확한 목록 확보 |
| 6 | 2026-05-09 | `tsconfig.json` `moduleResolution: bundler` → `node` 유지 | ts4.9.5 가 `bundler` 미지원 — TypeScript v5 업그레이드는 별도 사이클 |
| 7 | 2026-05-09 | `@types/node` v16 → v22 동반 업그레이드 | vite peer 요구 — Plan 02 §2.2.1 누락분 보강 |
| 8 | 2026-05-09 | `App.test.tsx` 의 `learn react` 검색 실패는 별도 사이클로 분리 | 기존 CRA 템플릿 잔재 — Vite 전환과 무관, *App.tsx 정리* 사이클로 이월 |
| 9 | 2026-05-09 | 메타 정책 (누적 문서 자동 압축) = 자동 트리거 정책 채택 | 사용자 명시 — "특정 양 누적되면 알아서". Task #8 description 보강 |

## Cycle Commits (총 6개)

| 단계 | 메인 | 서브모듈 |
|---|---|---|
| 1/3 — 디렉토리 이전 | `41d7de1` (128 files +342/-41) | `53b9824` (5 files +153/-9) |
| 2/3 — Vite 마이그레이션 | `8bb3633` (16 files +2478/-16514) | `c8d874d` (3 files +241/-2) |
| 3/3 — Phase B Minor 보강 | `659c61b` (2 files +4/-2) | `d0ec879` (6 files +235/-31) |

> 메인 단계 2 의 큰 deletions 은 `package-lock.json` 재생성 (CRA → Vite 의존성 트리 전면 교체) 로 인한 정상 차이.

## Traps to Avoid

- **`tsconfig.json moduleResolution: node` 는 임시** — Vite 권장은 `bundler`. TypeScript v5 업그레이드 사이클 진입 시 `bundler` 로 전환 필요. 그 전까진 `node` 유지가 정설
- **`App.test.tsx` 가 vitest 에서 실패** — 기존 CRA 잔재 (`learn react` 텍스트 검색). 본 사이클 책임 아님. *App.tsx CRA 템플릿 정리* 별도 사이클에서 처리
- **`fe_reference_prompt.md §1` Build Tool ✅ — Data Fetching/Styling 은 여전히 ⏳** — TanStack Query / Tailwind CSS 도입은 별도 사이클. SSOT 표가 진행 상황 단일 출처
- **`backend/.gitkeep` 는 placeholder** — backend/ 첫 셋업 사이클에서 settings.gradle / buildSrc / app / core 추가될 때 .gitkeep 제거
- **`.private-config/frontend/env/.env.dev` 는 미작성 (gitkeep 만)** — 사용자 권한 보유라도 실제 비밀 값 미등록. 환경 변수 도입 시점에 작성
- **handoff 디렉토리 파일은 역사 기록** — 본 closure 핸드오프도 STATUS 외 본문 갱신 신중. 일시정지 핸드오프 (`2026-05-08-fe-vite-migration-step1-pause.md`) 는 본 commit 에서 *삭제* (사용자 결정 — 임시 메모)
- **변경 이력 자동 압축은 미정 (Task #8)** — 본 사이클 변경 이력 줄들 (단계 1·2·3) 은 *현 상세 형식* 으로 작성됨. 메타 정책 사이클 후 일괄 압축 가능

## Working Agreements (선행 핸드오프 상속)

- 명시적 지시는 **우회 없이 직접 실행**
- 외부 글은 **원본 URL 로만 참조**
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정의 순차 진행**
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안"
- **Synchronous Update** — 변경 시 SSOT 역전파
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 변경 이력 표에 누적
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지만

## Relevant Files

### 본 사이클 산출물 (commit 6개)

**서브모듈 `.private-config/`** (3 commits):
- `53b9824` 단계 1 — Plan 01 신규 + agent-frontend.md / agent-frontend-reviewer.md / fe_reference_prompt.md / CLAUDE.md
- `c8d874d` 단계 2 — Plan 02 신규 + fe_reference_prompt.md / CLAUDE.md
- `d0ec879` 단계 3 — Plan 03 신규 + fe_{develop,improvement,review}_prompt.md 3종 + fe_reference_prompt.md / CLAUDE.md

**메인 저장소** (3 commits):
- `41d7de1` 단계 1 — git mv 110+ + .gitignore + 5 docs + scripts/init-private.sh + backend/.gitkeep + 일시정지 핸드오프 (본 closure 에서 삭제)
- `8bb3633` 단계 2 — vite.config.ts / tsconfig.node.json / index.html / vite-env.d.ts 신규, package*.json / tsconfig.json / .env* / 4 docs 갱신
- `659c61b` 단계 3 — harness-state.md 변경 이력 + closure 트리거 + 서브모듈 포인터

### 단일 출처 (Single Source of Truth)

- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§1 Build Tool ✅)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처 (단계 1·2·3 누적)
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT

### Plan 디렉토리 (사이클 입력)

- [`01-fe-directory-relocation.md`](../../../.private-config/shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md)
- [`02-fe-vite-config-migration.md`](../../../.private-config/shared/prompt/plan/fe-vite-migration/02-fe-vite-config-migration.md)
- [`03-fe-prompt-templates-deepening.md`](../../../.private-config/shared/prompt/plan/fe-vite-migration/03-fe-prompt-templates-deepening.md)

## Open Work

### 다음 진화 트리거 (사용자 결정 영역 — 다수 후보)

#### A. 메타 정책 사이클 (Task #8 — 사용자 명시 우선)

**자동 트리거 정책** — "특정 양 누적되면 알아서". 정책 후보:
1. 임계값 정의 (행 수 / 분량 / 사이클 수 / 묵은 기간)
2. 트리거 주체 (사이클 closure LLM 에이전트 자동 검토 vs 별도 hook)
3. 압축 방식 (N개 → 요약 1줄 / archive 디렉토리 / git history 위임)
4. 적용 범위 (변경 이력 / handoff / plan / custom)

**대상**: `harness-state.md` (30+ 행 누적), `fe·be_reference_prompt.md §12·§13`, `agent.md`, `CLAUDE.md`, `docs/readme/handoff/` (6개), `.private-config/shared/{issue,prompt/{plan,custom}}/`.

#### B. 코드 영역 후속 사이클

| 후속 | 트리거 |
|---|---|
| `App.tsx` / `App.test.tsx` CRA 템플릿 정리 | vitest `learn react` 검색 실패 (단계 2 발견) |
| `App.css` / `index.css` CRA 잔재 정리 | 천기망 디자인 토큰 도입 시 |
| TypeScript v4.9.5 → v5.x 업그레이드 | `tsconfig.json moduleResolution: bundler` 전환 동반 |
| ESLint 재설정 | 단계 2 에서 `react-app/jest` 제거 후 lint 부재 상태 (선언적) |
| TanStack Query 도입 | `fe_reference_prompt.md §1` ⏳ → ✅ + `shared/lib/query/*` 어댑터 |
| Tailwind CSS 도입 | `fe_reference_prompt.md §1` ⏳ → ✅ + `tailwind.config` 토큰 |

#### C. backend/ 영역

- **backend/ 첫 셋업** — `settings.gradle` / `buildSrc` / `app` / `core` (`be_reference_prompt.md §2` 표준 적용). 도메인 모듈은 *도메인 설계 사이클* 후
- **도메인 설계 사이클** — `<domain>` placeholder → 실제 도메인명
- **보안 정책 사이클** — Spring Security / JWT / OAuth2

#### D. 기타 트랙

- `.github/` CI/CD 도입 (현재 부재)
- `.gitattributes` 보강 (현재 부재 — macOS/Linux 전제 동작)
- `agent-fe-tester` 시범 생성 (`harness-setup.md §4`)
- 통합 코디네이터 `agent-reviewer.md` 도입 검토

## Prompt for New Chat

```
천기망 다음 사이클을 시작한다.

먼저 다음 파일을 Read 도구로 읽고 본 핸드오프의 주장을 코드/실제 상태와
대조 검증한 후 작업 계획을 안내해:

1. docs/readme/handoff/2026-05-08-fe-vite-migration-cycle.md (본 closure 핸드오프 — SSOT)
2. docs/readme/handoff/2026-05-07-be-fe-consistency-cycle.md (선행 사이클)
3. docs/readme/harness/harness-state.md (변경 이력 단일 출처 — 2026-05-08·09 단계 1·2·3 누적)
4. .private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md §1
   (Build Tool ✅ / Data Fetching·Styling ⏳ — 진행 상황 단일 출처)

CLAUDE.md 에 이미 적힌 내용은 재기술 금지.

검증 후 사용자에게 다음 사이클 트리거 결정 옵션 제시:
(A) 메타 정책 사이클 — 자동 트리거 정책 (Task #8 — 사용자 명시 우선)
(B) 코드 영역 — App.tsx CRA 잔재 / TypeScript v5 / ESLint / TanStack / Tailwind
(C) backend/ 첫 셋업 (구조만 — 도메인 설계 별도)
(D) 기타 — .github/ / .gitattributes / agent-fe-tester / agent-reviewer

사용자 선택 후 해당 사이클 plan 작성 진입.
```

## 참고

- 직전 사이클 핸드오프: [`2026-05-07-be-fe-consistency-cycle.md`](./2026-05-07-be-fe-consistency-cycle.md)
- BE 사이클 closure: [`2026-05-06-be-cycle-closure.md`](./2026-05-06-be-cycle-closure.md)
- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
