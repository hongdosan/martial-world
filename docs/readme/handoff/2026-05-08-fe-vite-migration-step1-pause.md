# Handoff — 2026-05-08 — FE Vite Migration 사이클 단계 1 일시정지 (commit 직전 롤백)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 fact 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 단계 1 (FE 디렉토리 이전) 작업 완료 + 검증 통과 + commit 직전 롤백 ⏸️**
>
> **선행 핸드오프**: [`2026-05-07-be-fe-consistency-cycle.md`](./2026-05-07-be-fe-consistency-cycle.md)

## Summary

FE 디렉토리 이전 + Vite 마이그레이션 사이클 (3단계) 의 **단계 1 (디렉토리 이전)** 을 stage 단계까지 마치고 commit 시점만 18시 이후로 미룬 상태. 모든 git mv (110+ 파일), 경로 인용 갱신 12파일, 검증 (`npm install` exit 0 / `npx tsc --noEmit` 에러 0) 완료. **commit 메시지 2종은 본 문서에 보존** — 18시 이후 그대로 복사/실행하면 즉시 재진행 가능.

## 즉시 재실행 명령 (18시 이후)

> 본 명령들은 **현재 stage 상태가 그대로 유지된 전제** 에서 동작한다. 만약 stage 가 풀렸다면 [§Stage 복원](#stage-복원-stage-가-풀렸을-경우만) 절차 먼저.

### 1단계 — 서브모듈 commit 먼저

```bash
git -C .private-config commit -m "$(cat <<'EOF'
[NO-TICKET] FE 디렉토리 이전 사이클 (1/3) — 경로 인용 갱신

- shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md (신규)
- agent-frontend.md §2.1·§9: 위치 박스 + 아티팩트 동기화 src/ → frontend/src/
- agent-frontend-reviewer.md §2.10: src/artifact/ → frontend/src/artifact/
- fe_reference_prompt.md §1·§12: Build Tool 행 + 변경 이력 단계 1
- claude/CLAUDE.md: 변경 이력 (2026-05-08 단계 1)

본 commit 은 단계 1 (이전) 한정 — Vite 전환 (단계 2) 및 Phase B Minor 보강 (단계 3) 은 후속 commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### 2단계 — 메인 commit

```bash
git commit -m "$(cat <<'EOF'
[NO-TICKET] FE 디렉토리 이전 (1/3) — root → frontend/

- src/, public/, package.json, package-lock.json, tsconfig.json → frontend/
- .env, .env.example, .env.dev → frontend/
- node_modules → frontend/ (gitignore, 재설치)
- docs/readme/fe-architecture.md §폴더 구조: src/ → frontend/src/
- docs/readme/getting-started.md: 빌드 명령에 cd frontend && 추가
- docs/readme/env-var-convention.md: 파일 계층 표 + symlink 다이어그램
- docs/readme/private-config.md: 3-tier 표 + symlink 다이어그램
- docs/readme/harness/harness-state.md: 정합성 표 (frontend/ ❌ → ✅) + 변경 이력
- .gitignore: /node_modules → /frontend/node_modules 등
- scripts/init-private.sh: env_fallback 경로 + link target → frontend/.env.dev
- backend/.gitkeep 추가 (모노레포 placeholder)
- 서브모듈 포인터 갱신 (.private-config)

본 commit 은 단계 1 (이전) 한정 — Vite 전환 (단계 2) 및 Phase B Minor 보강 (단계 3) 은 후속 commit.

Co-Authored-By: Claude Opus 4.7 (1M context) <noreply@anthropic.com>
EOF
)"
```

### 3단계 — 검증 + push 보류

```bash
# 두 commit 확인
git -C .private-config log -1 --oneline
git log -1 --oneline

# push 는 사용자 직영 — Working Agreements (선행 핸드오프 §)
# 메인 + 서브모듈 모두 사용자가 직접 진행
```

## 현재 Stage 상태 (롤백 직후 보존)

### 메인 저장소 (127 entries)

- `M  .gitignore`
- `A  backend/.gitkeep` *(사용자가 사전 추가, 단계 1 commit 에 포함하기로 결정)*
- `M  .private-config` (서브모듈 포인터)
- `M  docs/readme/env-var-convention.md`
- `M  docs/readme/fe-architecture.md`
- `M  docs/readme/getting-started.md`
- `M  docs/readme/harness/harness-state.md`
- `M  docs/readme/private-config.md`
- `M  scripts/init-private.sh`
- `R  .env → frontend/.env`
- `R  .env.example → frontend/.env.example`
- `RM package-lock.json → frontend/package-lock.json` *(npm install 로 lock 갱신 동반)*
- `R  package.json → frontend/package.json`
- `R  tsconfig.json → frontend/tsconfig.json`
- `R  public/* → frontend/public/*` (6 entries)
- `R  src/** → frontend/src/**` (109 entries)

> `.env.dev` 와 `node_modules/` 는 gitignore — git rename 없음. 실제 파일은 `frontend/` 에 이동 완료.

### 서브모듈 (`.private-config/`)

- `A  shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md` (신규)
- `M  claude/CLAUDE.md`
- `M  claude/claude-agents/agent-frontend.md`
- `M  claude/claude-agents/agent-frontend-reviewer.md`
- `M  shared/prompt/read_only/frontend/fe_reference_prompt.md`

## 검증 결과 (롤백 전 통과)

| 검증 | 결과 |
|---|---|
| 디렉토리 이전 후 `cd frontend && npm install` | ✅ exit 0 (26 vulnerabilities 는 CRA `react-scripts` 알려진 이슈, 단계 2 Vite 전환으로 자동 해소) |
| `cd frontend && npx tsc --noEmit` | ✅ 에러 0 (TypeScript strict 통과) |
| `git status` 추적 무결성 | ✅ git mv 110+ rename 자동 detect |

## Stage 복원 (stage 가 풀렸을 경우만)

> 만약 사용자가 다른 작업으로 stage 영역을 건드렸다면 — 기본 시나리오는 stage 그대로 유지.

```bash
# 1. 서브모듈 stage 재구성
git -C .private-config add \
  claude/CLAUDE.md \
  claude/claude-agents/agent-frontend.md \
  claude/claude-agents/agent-frontend-reviewer.md \
  shared/prompt/read_only/frontend/fe_reference_prompt.md \
  shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md

# 2. 메인 stage 재구성 (rename 들은 자동 detect)
git add \
  .gitignore \
  backend/.gitkeep \
  docs/readme/env-var-convention.md \
  docs/readme/fe-architecture.md \
  docs/readme/getting-started.md \
  docs/readme/harness/harness-state.md \
  docs/readme/private-config.md \
  scripts/init-private.sh \
  frontend/ \
  .private-config

# 3. 검증
git -C .private-config status --short  # 5 entries 예상
git status --short | wc -l             # 약 127 entries 예상
```

## 다음 작업 (commit 후 진행 순서)

### 단계 2 — Vite 마이그레이션 (Plan 02 작성 → 구현)

**Plan 작성 위치**: `.private-config/shared/prompt/plan/fe-vite-migration/02-fe-vite-config-migration.md`

**핵심 변경** (Plan 01 §6 비범위 + Phase C audit Major 5건):

1. `frontend/package.json`:
   - scripts: `react-scripts start/test/eject/build` → `vite`/`vitest`/`vite build`
   - `homepage: "https://hongdosan.github.io/martial-arts/"` 제거 → `vite.config.ts:base` 로 매핑
   - `eslintConfig` 의 `react-app/jest` 제거
   - dependencies: `react-scripts`, `@testing-library/jest-dom` 등 → `vite`, `@vitejs/plugin-react`, `vitest`, `@vitest/ui`
2. `frontend/vite.config.ts` 신규 — `base: '/martial-arts/'`, `plugins: [react()]`, `test: { globals, environment: 'jsdom', setupFiles }`
3. `frontend/public/index.html` → `frontend/index.html` 로 root 이동 + `%PUBLIC_URL%` 제거 + `<script type="module" src="/src/index.tsx">` 추가
4. `frontend/src/react-app-env.d.ts` → `frontend/src/vite-env.d.ts` 교체 (`/// <reference types="vite/client" />`)
5. `frontend/src/setupTests.ts` (jest → vitest API)
6. `frontend/tsconfig.json` 갱신 — `moduleResolution: "bundler"`, Vite 호환 옵션
7. `docs/readme/env-var-convention.md` 갱신 — `process.env.REACT_APP_*` → `import.meta.env.VITE_*`, CRA 로딩 우선순위 → Vite 로딩 우선순위
8. `frontend/.env*` 키 prefix `REACT_APP_*` → `VITE_*` (실제 환경 변수 코드 참조 0건이라 영향 적음 — `env-var-convention.md` L68 참조)
9. `frontend/.gitignore` (또는 root `.gitignore`) `frontend/build` → `frontend/dist` (이미 단계 1 에서 dist 추가했음)
10. `package.json` build hack `&& rm -rf dist && mv build dist` 제거

**검증**: `cd frontend && npm install && npm run dev` 로 dev server 기동 + `npm run build` 로 dist 생성

### 단계 3 — Phase B Minor 7건 보강 (Plan 03 작성 → 구현)

**Plan 작성 위치**: `.private-config/shared/prompt/plan/fe-vite-migration/03-fe-prompt-templates-deepening.md`

**audit 결과 7건** (이미 식별 완료 — 본 핸드오프의 §audit 결과 표 참조):

| # | 위치 | 변경 |
|---|---|---|
| M1 | `fe_develop_prompt.md` DoD 11개 | 각 항목에 ` — SSOT §X` 추가 |
| M2 | `fe_improvement_prompt.md` DoD 11개 | M1 동일 |
| M3 | `fe_review_prompt.md` 검토 포커스 12개 | M1 동일 |
| M4 | `fe_develop_prompt.md` / `fe_improvement_prompt.md` DoD 헤더 | "각 항목은 SSOT § 번호 인용. 표준 갱신 시 SSOT 우선 갱신 후 본 체크리스트 갱신" 운영 헤더 추가 |
| M5 | `fe_develop_prompt.md` 영향 범위 | 4 항목 → 8 항목 (라이브러리 어댑터 / OpenAPI / 환경 변수 / 아티팩트 동기화 추가) |
| M6 | `fe_improvement_prompt.md` 영향 범위 | M5 동일 |
| M7 | `fe_develop_prompt.md` DoD | 아티팩트 동기화 항목 추가 (`agent-frontend.md §9` 인용) |

### Closure — 사이클 종료 핸드오프

**위치**: `docs/readme/handoff/2026-05-08-fe-vite-migration-cycle.md` (단계 1·2·3 종료 후 작성)

**갱신 대상**:
- `harness-state.md` 변경 이력 표 (단계 2·3 행 누적)
- 표준-코드 정합 표 (Vite ❌ → ✅)
- 본 일시정지 핸드오프의 STATUS 를 "최종 commit 완료 ✅" 로 정정 가능 (또는 단순 종결)

## Traps to Avoid

- **stage 상태가 며칠 갈 수 있음** — IDE 가 며칠 후 보면 혼선 가능. 사용자가 다른 작업으로 stage 풀면 §Stage 복원 절차 사용
- **`backend/.gitkeep` 는 단계 1 commit 에 동반** (사용자 결정) — backend/ 첫 셋업은 별도 사이클이지만 placeholder 만 동행
- **단계 1 commit 후 단계 2 진행 전 `frontend/` 에서 `npm start` 1회 수동 검증 권장** — CRA 가 새 위치에서 정상 기동하는지 확인 후 Vite 전환
- **메타 정책 사이클은 별도** — Task #8 (누적 문서 요약/아카이브 정책) 발의됨. 본 사이클 단계 3 종료 후 진행
- **handoff 디렉토리 파일은 역사 기록** — 본 일시정지 문서도 역사 기록. 단계 1 commit 완료 후 STATUS 만 갱신 (본문은 그대로 보존)

## Working Agreements (선행 핸드오프 상속)

- 명시적 지시는 **우회 없이 직접 실행**
- 외부 글은 **원본 URL 로만 참조**
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정의 순차 진행**
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안" + 본 핸드오프의 §즉시 재실행 명령
- **Synchronous Update** — 변경 시 SSOT 역전파
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 변경 이력 표에 누적
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지만

## Relevant Files

### 본 사이클 단계 1 산출물 (stage 완료, commit 보류)

**서브모듈 `.private-config/`** (5 entries):
- `shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md` (신규)
- `claude/CLAUDE.md` (변경 이력 단계 1)
- `claude/claude-agents/agent-frontend.md` (§2.1 위치 박스 + §9 아티팩트 경로)
- `claude/claude-agents/agent-frontend-reviewer.md` (§2.10 아티팩트 경로)
- `shared/prompt/read_only/frontend/fe_reference_prompt.md` (§1 Build Tool + §12 변경 이력)

**메인 저장소** (127 entries):
- 110+ git mv (`src/**`, `public/**`, `package*.json`, `tsconfig.json`, `.env`, `.env.example` → `frontend/` 하위)
- `.gitignore`, `scripts/init-private.sh`, 5 docs (env-var-convention, fe-architecture, getting-started, private-config, harness-state)
- `backend/.gitkeep` (모노레포 placeholder)
- `.private-config` 포인터 갱신

### 단일 출처 (Single Source of Truth)

- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT

### Plan 디렉토리

- [`01-fe-directory-relocation.md`](../../../.private-config/shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md) — 단계 1 plan (작성 완료, 본 commit 의 SSOT)
- `02-fe-vite-config-migration.md` — 단계 2 plan (미작성)
- `03-fe-prompt-templates-deepening.md` — 단계 3 plan (미작성)

## Open Work

### 즉시 — 18시 이후

1. §즉시 재실행 명령 의 2단계 commit 실행
2. (선택) `cd frontend && npm start` 수동 검증 — CRA 가 새 위치에서 정상 기동 확인

### 본 사이클 잔여

3. **단계 2 Plan 작성** (`02-fe-vite-config-migration.md`) → 사용자 승인 → 구현 + commit
4. **단계 3 Plan 작성** (`03-fe-prompt-templates-deepening.md`) → 사용자 승인 → 구현 + commit
5. **사이클 closure 핸드오프** (`docs/readme/handoff/2026-05-08-fe-vite-migration-cycle.md`) + `harness-state.md` 변경 이력 누적

### 별도 트랙 (다음 사이클들)

- **메타 정책 사이클** (Task #8) — 누적 문서 요약/아카이브 정책 결정 (변경 이력 / handoff / issue / plan / custom 의 LLM 컨텍스트 토큰 부하 차단). 본 사이클 종료 후 진행.
- **`backend/` 첫 셋업** — settings.gradle / buildSrc / app / core (도메인 설계 사이클은 별도)
- **TanStack Query / Tailwind CSS 도입** — Vite 마이그레이션 후 별도 사이클
- **도메인 설계 사이클** — 천기망 도메인 확정 (`<domain>` placeholder → 실제 도메인명)
- **보안 정책 사이클** — 인증/인가 결정
- **`.github/` CI/CD 도입**
- `agent-fe-tester` 시범 생성

## Prompt for New Chat (18시 이후 동일 세션 재개 또는 새 세션)

```
천기망 FE 디렉토리 이전 + Vite 마이그레이션 사이클 단계 1 commit 을 재진행한다.

먼저 다음 파일을 Read 도구로 읽고 현재 상태를 검증해:

1. docs/readme/handoff/2026-05-08-fe-vite-migration-step1-pause.md (본 핸드오프 — SSOT)
2. .private-config/shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md (단계 1 plan)

그 다음 다음 명령으로 현재 stage 상태가 보존되어 있는지 확인:
- git status --short | wc -l  (약 127 entries 예상)
- git -C .private-config status --short  (5 entries 예상)

stage 가 정상이면 §즉시 재실행 명령 의 2단계 commit 을 실행.
stage 가 풀렸으면 §Stage 복원 절차 먼저 실행.

commit 후:
(a) 두 commit log 출력으로 확인
(b) 단계 2 (Vite 마이그레이션) 진행 여부 사용자에게 확인
(c) 단계 2 진행 시 02-fe-vite-config-migration.md plan 부터 작성
```

## 참고

- 직전 사이클 핸드오프: [`2026-05-07-be-fe-consistency-cycle.md`](./2026-05-07-be-fe-consistency-cycle.md)
- BE 사이클 closure: [`2026-05-06-be-cycle-closure.md`](./2026-05-06-be-cycle-closure.md)
- 4-Tier 가이드: [`README.md`](./README.md)
- 단계 1 plan: [`01-fe-directory-relocation.md`](../../../.private-config/shared/prompt/plan/fe-vite-migration/01-fe-directory-relocation.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
