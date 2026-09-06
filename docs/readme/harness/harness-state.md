# AI 에이전트 하네스 (Agent Harness)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

천기망(天機網) 프로젝트의 AI 협업 구조를 정의하는 메타 레이어 문서. 본 프로젝트가 어떤 형태의 하네스를 도입했는지 사실 기반으로 정의한다.

## 목차

- [정의](#정의)
- [구성 요소](#구성-요소)
- [정량 측정값](#정량-측정값)
- [비판적 사실 분석](#비판적-사실-분석)
- [결론](#결론)
- [참고](#참고)

## 정의

천기망은 자체 런타임을 구축하지 않고 [Claude Code](https://claude.com/claude-code) 런타임 위에 **문서 기반 프로세스 하네스 (Documentation-Driven Process Harness)** 를 얹은 구조다.

| 층위 | 정의 | 본 프로젝트 |
|---|---|---|
| Runtime Harness | LLM 호출·도구 디스패치·상태·실행 흐름을 코드로 묶은 시스템 | Claude Code (재사용) |
| Process / Documentation Harness | 페르소나·SSOT·워크플로우·산출물 형식을 문서로 강제하는 메타 레이어 | **본 프로젝트가 정의** |

## 구성 요소

천기망 하네스를 구성하는 12개 요소.

| # | 요소 | 위치 |
|---|------|------|
| 1 | 페르소나/역할 정의 | 각 에이전트 frontmatter + §0 |
| 2 | 다중 전문 에이전트 분리 | `.claude/agents/agent-{backend,frontend,game-master,frontend-reviewer}.md` |
| 3 | 단일 기준점 (SSOT) | `prompt/read_only/{backend,frontend}/*_reference_prompt.md` *(private)* |
| 4 | 단계별 워크플로우 | `prompt/read_only/vibe-coding-flow.md` Step 01–06 *(private)* |
| 5 | 템플릿 계층화 | `read_only/` → `custom/` → `plan/` |
| 6 | AI 자가 검증 절차 | `agent-frontend-reviewer.md §3` |
| 7 | 산출물 스키마 | DoD 체크박스, Critical/Major/Minor 보고 형식, "제안 커밋 메시지 초안" |
| 8 | 핸드오프 프로토콜 | "제안 → 확인 → 수정의 순차 진행" |
| 9 | 역전파 (Synchronous Update) | vibe-coding-flow 핵심 원칙 §3 |
| 10 | Closure Discipline | 커밋 메시지 SSOT (vibe-coding-flow 핵심 원칙 §4) |
| 11 | 도구 우선순위 | `.claude/CLAUDE.md` Tooling (Serena MCP 우선) |
| 12 | Adapter Pattern | FE 라이브러리 격리 (TanStack/HTTP/Tailwind/OpenAPI 어댑터 위치 명시) |

> *(private)* 표시 항목은 프라이빗 서브모듈(`.private-config/`)에 위치하며 접근 권한이 있는 협업자만 열람 가능.

## 정량 측정값

### 에이전트 인벤토리

| 에이전트 | 상태 | 분량 |
|---------|------|------|
| `agent-backend.md` | **완성** (BE 사이클 본문 채움) | ~14 KB / 391행 |
| `agent-frontend.md` | 완성 | 11,257 B / ~250행 |
| `agent-game-master.md` | 완성 (게임 도메인) | 21,515 B |
| `agent-frontend-reviewer.md` | 완성 | 8,450 B / 159행 |
| `agent-backend-reviewer.md` | **완성** (BE 사이클 신규) | ~10 KB / ~200행 |
| `agent-reviewer.md` (통합 코디네이터) | 미작성 | — (BE/FE 리뷰어 분담으로 운영, 향후 도입 검토) |
| `agent-tester.md` | 미작성 | — (harness 시범 생성 예정 — `agent-fe-tester` 별도 트랙) |

작성률: 5/7 (71%) — BE 사이클 (2026-05-01) 으로 `agent-backend.md` 본문 + `agent-backend-reviewer.md` 신규 추가.

### SSOT 완성도

| 문서 | 완성률 |
|------|--------|
| `fe_reference_prompt.md` | 91% (10/11 섹션) |
| `be_reference_prompt.md` | **100%** (14/14 섹션 — BE 사이클 2026-05-01 + **매트릭스 v3 정정 사이클 2026-05-03**: §1 TBD 4건 채움 + §2.3 매트릭스 v3 (infra 정의 좁힘 + AOP/Auditing/DataSource 재배치) + §2.4 D1-D5 신규 5패턴 (CQRS Port / Port 반환 도메인 모델 / adaptor 비즈니스 로직 금지 / Validator 3패턴 / infra 서브도메인별 소유) + §4-10 placeholder 7개 + §13 변경 이력) |

### 자동 강제 메커니즘

| 항목 | 존재 |
|------|------|
| FSD 레이어 lint (`eslint-plugin-boundaries` 등) | 없음 |
| Pre-commit hook (`husky` / `lint-staged`) | 없음 |
| 출력 스키마 검증 | 없음 |
| 슬라이스 public API import 가드 | 없음 |
| TypeScript Strict (`tsconfig.json:9`) | **유일한 LLM-외부 강제 장치** |

자동 강제: 1건 (TS Strict). 그 외 모든 규칙은 LLM 순응에 의존.

### 표준-코드 정합성

| 결정 표준 | 현재 코드 | 정합 |
|----------|---------|------|
| Vite | Vite 5.x + Vitest (2026-05-09 적용) | ✅ |
| TanStack Query | 의존성 0 | ❌ |
| Tailwind CSS | 의존성 0 | ❌ |
| TypeScript Strict | `strict: true` | ✅ |
| FSD 레이어 | `processes/` 미사용, 나머지 존재 | △ |
| `frontend/` 디렉토리 | `frontend/src/`, `frontend/package.json` 등 (2026-05-08 이전 완료) | ✅ — FE 디렉토리 이전 사이클 단계 1 commit. Vite 마이그레이션은 단계 2 진행 |
| `backend/` 디렉토리 | 미존재 | △ — 표준 확정 (2026-05-01), 도메인 설계 사이클 후 첫 모듈 생성 |
| Java / Spring Boot / MariaDB / Liquibase / Testcontainers / ArchUnit | 미설치 | ❌ — 표준 확정 (2026-05-01), 도입 예정 |

5개 핵심 FE 항목 중 1개 완전 일치 (20%). BE 항목 모두 *표준 확정 후 도입 예정* 단계.

## 비판적 사실 분석

### 내부 모순

1. **FE 리뷰어 가동 시 거의 모든 파일이 위반 보고 대상**.
   - `agent-frontend-reviewer.md §2.2` 는 TanStack Query 어댑터 경유를 검토하나, `package.json` 에 의존성 0 → 어댑터 자체가 존재할 수 없음.
   - §2.5 Tailwind 검토도 동일한 코드-표준 충돌.
2. **vibe-coding-flow.md 가 자기 디렉토리(`read_only/`) 안에 위치**. 상대경로 References 가 디렉토리 재구성에 취약 (이전 1회 깨진 전례).

### 비대칭

1. **FE/BE 비대칭**: FE 는 표준 → 참고서 → 개발자/리뷰어 → 템플릿 → README 까지 닫힌 루프. BE 는 골격 단계.
2. **참고서 비대칭**: FE 91% vs BE 42%. BE 결정 시 §4~§10 7개 영역(API·DB·테스트·도메인 상수·보안·성능·코드 스타일) 표준 결정 필요.
3. **코디네이터 부재**: 분기 대상이 FE 1개라 현 시점은 정당화 가능. BE 합류 시 도입 필수.

### 강제력 부재

모든 규칙이 LLM 순응에 의존. 사람이 표준 위반 코드를 직접 PR 하면 막을 자동 장치 부재. 리뷰어 출력 형식 위반조차 자동 검출 불가.

## 결론

| 차원 | 상태 |
|------|------|
| 설계 | 도입 완료 (12개 요소 모두 정의) |
| FE 사이클 | 표준-에이전트-리뷰어까지 닫힌 루프 |
| BE 사이클 | **표준-에이전트-리뷰어 닫힌 루프** (Phase 6-13 통합 완료, 2026-05-01 ~ 2026-05-06). 표준 본문은 SSOT [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* 단일 출처. 첫 도메인 모듈 3-sub 생성은 도메인 설계 사이클 후 |
| 강제력 | LLM 순응 의존 (TS Strict 외 자동화 0). BE 코드 도입 시 ArchUnit + Gradle 의존성 검증 task 작동 예정 (표준 정의는 Phase 6-13 사이클로 완료됨) |
| 표준-코드 정합 | FE 20% (1/5), BE 0% (표준만 확정, 코드 미존재) |

천기망 하네스는 **설계 차원에서 도입 완료된 문서 기반 프로세스 하네스**다. 다음 강화 우선순위는:

1. **Harness 플러그인 설치** ([revfactory/harness](https://github.com/revfactory/harness)) — [harness-setup.md](./harness-setup.md) 절차에 따라 설치 → 환경 플래그 활성화 → 디렉토리 정합화
2. **시범 생성 — `agent-fe-tester`** — harness Phase 1–6 자동 실행으로 FE BDD E2E 테스트 에이전트 생성, [harness-integration.md Phase 3](./harness-integration.md#phase-3--산출물-검토-정합성-확인) 정합성 체크 7항목 통과
3. **표준-코드 정합화** — CRA → Vite 마이그레이션, TanStack Query / Tailwind CSS 도입
4. **자동 강제 도입** — `eslint-plugin-boundaries` (FSD 레이어 lint), `husky` + `lint-staged` (pre-commit), PR 템플릿에 리뷰 체크리스트 박기

> **BE 사이클 완료** — Phase 6-13 사이클로 표준-에이전트-리뷰어 닫힌 루프 형성 (2026-05-01 ~ 2026-05-06). 첫 도메인 모듈 3-sub 생성은 도메인 설계 사이클 후. 변경 이력 표 참조.

## 변경 이력 (Change History)

harness Phase 7 패턴을 차용한 변경 이력. 모든 진화 변경은 *날짜 / 변경 내용 / 대상 / 사유* 4컬럼으로 기록.

> **자동 최적화**: 본 표는 [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) §4 정책에 따라 30행 초과 시 자동 압축 (최근 10행 보존, 그 이전 1줄 요약 — 상세는 git log 위임).

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-26 ~ 2026-05-06 | (이전 43개 항목 압축) — 하네스 도입 (4-Tier 전략 / plugin / harness-state·integration·setup 가이드) + FE SSOT 정의 + LICENSE/symlink/디렉토리 정합 + `agent-harness.md` → `harness-state.md` rename + `architecture.md` → `fe-architecture.md` rename + BE 표준 정의 사이클 (Phase 6-13: 모노레포 `backend/`+`frontend/` / Java 21 + Spring Boot 3.4 / Gradle Groovy DSL 멀티모듈 / 헥사고날 + DDD / 매트릭스 v3 / D1-D5 / 3-sub / 모듈러 모놀리스 + BFF / DB 스키마 분리 `martialarts_<domain>` / JPA = `<domain>:infra/jpa/`). 상세는 `git log --follow docs/readme/harness/harness-state.md` 참조 | 다수 (`.claude/CLAUDE.md` / `.private-config/` / `docs/readme/` / agents / SSOT / 본 문서 자체 변경 이력) | `vibe-coding-flow.md §4` 자동 최적화 정책 *첫 적용* (X=30, Y=10) — 누적 43개 행 → 1줄 요약 |
| 2026-05-07 | **BE 문서 11종 정합성 정정 사이클** — (1) Critical 자체 모순 제거: `be_review_prompt.md` / `agent-backend-reviewer.md` / `be-architecture.md` / `be_reference_prompt.md` / `agent-backend.md` 의 *Phase 13 잔재* (`app` 표기 / "단일 DataSource 금지") 를 모두 `<domain>:infra/jpa/` 일관·"도메인별 DataSource 필수" 로 정정. (2) SSOT 단일화: `CLAUDE.md` / `harness-integration.md` / `harness-state.md` 의 BE 표준 본문 ~150자 자구 중복 → SSOT (`be_reference_prompt.md`) 단일 출처 포인터로 압축. (3) 역할 경계: `be-multimodule-guide.md` 표현 통일 ("자체 database" → "도메인 전담 database"). (4) `harness-integration.md` 의 *하네스 Phase 0-7* vs *BE 사이클 Phase 6-13* 구분 1줄 명시. (5) 3 prompt (`be_{develop,improvement,review}_prompt.md`) 의 DoD/체크리스트에 SSOT § 번호 인용 보강. (6) `harness-state.md` 의 "ArchUnit 도입 예정" / "4-sub" 구식 문구 갱신 | 본 사이클 정정 11파일: `be_reference_prompt.md` (§2.1·§2.3 본문 정의 + 매트릭스 + 금지 통합) + `agent-backend.md` (§0·§2.4 매트릭스 일관성) + `agent-backend-reviewer.md` (§2.2 매트릭스·§2.6 DB) + `be_review_prompt.md` (DataSource 정정·매트릭스 정정·SSOT § 인용) + `be_develop_prompt.md` / `be_improvement_prompt.md` (DoD 에 SSOT § 인용) + `be-architecture.md` (매트릭스·도메인 격리 단락 Phase 13 일관) + `be-multimodule-guide.md` (표현 통일) + `CLAUDE.md` (§백엔드 위임 본문 압축 + 변경 이력 압축) + `harness-integration.md` (Phase 0-7 vs Phase 6-13 구분, BE 표준 본문 → SSOT 포인터) + `harness-state.md` (구식 문구 갱신 + 본 사이클 누적) | 사용자 판단 — "정보 중구난방으로 인해 에이전트의 로직 혼선 및 오작동 우려, 정보 단일화 및 명확화 필요". 11개 문서를 LLM 에이전트 컨텍스트 입력으로 사용하기에 자체 모순·SSOT 위반·역할 경계 침범 다수 발견 → 일괄 정정 |
| 2026-05-07 | **35파일 audit-only 라운드 + Major 2건 후속 정정** — BE 11파일 외 docs / .private-config / .claude / 메인 README 검토. Critical 0 / Major 2 / Minor 다수 식별. Major 정정: `.private-config/README.md` (BE SSOT "(작성 중)" → "(SSOT — Phase 6-13 확정)" + agent-backend-reviewer.md 트리 누락 추가) + 메인 `README.md` ("설계" 섹션에 BE 아키텍처 + BE 멀티 모듈 가이드 행 추가, "FE 아키텍처" 명시) | 본 라운드 정정 2파일 + audit 보고만: `.private-config/README.md`·메인 `README.md` (정정) / 그 외 33파일 (audit 결과만 — 정정 보류) | 사용자 결정 — "BE 11파일 외 영역에도 같은 패턴 audit-only 라운드 진행". 결과 BE 가 가장 큰 변경량이었고 그 외 영역은 비교적 깨끗 |
| 2026-05-07 | **Phase A: Minor 정합성 마무리 정정** — `harness-setup.md:72` (검증 시점에 "(2026-05-07 현재까지 유효 ✓)" 추가) + `harness-setup.md:93-94` (init-private.sh 라인 미추가 상태 명시) + `fe_review_prompt.md:5-7` (위임처 표기 BE 일관 — 4줄 구조). `commit-convention.md:70` 은 audit 재검토 결과 SKIP (현 표기 OK) | 본 라운드 정정 3파일 | 가벼운 마무리 정정 — audit 보류했던 Minor 5건 중 실질 3건만 |
| 2026-05-07 | **Phase B: FE 영역 deep audit + Major 6건 정정** — Critical 0 / Major 6 / Minor 7 식별. Major 정정: (1) `fe_reference_prompt.md §1` 기술 스택 표에 *현재 상태* 컬럼 추가 (Vite·TanStack·Tailwind ⏳ 미도입 + FE 이전 사이클 일정 명시) + "현 상태 vs 표준 괴리" 주석. (2) `fe_reference_prompt.md §12` 변경 이력 운영 규칙 명시 (BE SSOT §13 동일 형식). (3) `agent-frontend.md §1` 본문 중복 → SSOT 인용으로 압축 (BE 정정 패턴 FE 적용). (4) `agent-frontend.md §2.1` 에 frontend/ 이전 현황 표기 ("현재 src/ root 직속, 다음 사이클에서 frontend/src/ 로 이전 예정"). Minor 7건은 다음 *FE 이전 사이클* 에서 통합 처리 | 본 라운드 정정 2파일: `fe_reference_prompt.md` (§1·§12) + `agent-frontend.md` (§1·§2.1) | 사용자 결정 — "BE 와 같은 깊이로 FE 도 검토". 결과 FE 는 80% 수준으로 BE 정정 패턴 준수 중이었고, Major 6건만 보강해 BE-FE 대칭성 완성. 표준 vs 코드 괴리 (CRA·TanStack·Tailwind 미설치) 를 SSOT 자체에 명시해 LLM 에이전트 컨텍스트 혼선 차단 |
| 2026-05-07 | **Phase C: frontend/src/ 코드 audit (audit-only — 코드 변경 X)** — 표준 준수율 95% 로 우수. **Critical 0 / Major 5 / Minor 0**. 코드 자체는 매우 깨끗 (FSD 의존 방향 위반 / 라이브러리 누수 / `any` / 절대경로 / cross-import 모두 0건). Major 5건 모두 *CRA → Vite 마이그레이션 영향 범위*: (1) `public/index.html` → root 이동 + `%PUBLIC_URL%` 참조 제거. (2) `react-app-env.d.ts` → `vite-env.d.ts` 교체. (3) `package.json` scripts (`react-scripts` → `vite` + `vitest`). (4) `setupTests.ts` (jest → vitest). (5) build 출력 (`build/` → `dist/`). 다음 *FE 디렉토리 이전 + Vite 마이그레이션* 사이클의 입력으로 보존 | audit 보고만 — 코드 변경 0파일. 변경 이력 1줄 누적 (본 항목) | 사용자 결정 — 코드 정합성도 검증. 결과 코드는 우수, 마이그레이션 준비도 높음 (환경변수 하드코딩 0건 / FSD 깨끗). audit 결과는 다음 사이클 입력으로 사용 |
| 2026-05-08 | **FE 디렉토리 이전 + Vite 마이그레이션 사이클 — 단계 1 (FE 디렉토리 이전)** — `src/`, `public/`, `package.json`, `package-lock.json`, `tsconfig.json`, `node_modules/`, `.env*` (`/.env`, `/.env.example`, `/.env.dev`) 모두 root → `frontend/` 하위 이전 (`git mv` 5건 + `mv` 2건). 경로 인용 갱신 12파일: `docs/readme/fe-architecture.md` (§폴더 구조) / `docs/readme/getting-started.md` (빌드 명령 `cd frontend &&`) / `docs/readme/private-config.md` (3-tier 표 + symlink 다이어그램) / `docs/readme/env-var-convention.md` (파일 계층 표 + 권한 시나리오) / `.gitignore` (`/frontend/node_modules`, `/frontend/dist` 등) / `scripts/init-private.sh` (env_fallback example/envdev 경로 + link target `frontend/.env.dev`) / `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` (§1·§12) / `.private-config/claude/claude-agents/agent-frontend.md` (§2.1·§9 1·9.2·9.3) / `.private-config/claude/claude-agents/agent-frontend-reviewer.md` (§2.10) / `.private-config/claude/CLAUDE.md` (변경 이력) / 본 문서 (정합성 표 `frontend/` ❌ → ✅ + 변경 이력) | 본 라운드 정정 12파일 (코드 0 + docs 7 + .private-config 5) — FE 코드 자체 변경 0건 (이전 + 경로 인용 갱신만) | BE 사이클 (Phase 6-13) 모노레포 결정 후속 + 핸드오프 `2026-05-07-be-fe-consistency-cycle.md` Open Work §1. CRA 빌드 명령은 단계 1 시점에 그대로 동작. Vite 마이그레이션은 단계 2 (`react-scripts` → `vite`/`vitest` + `vite.config.ts` + `index.html` root 이동), Phase B Minor 7건 보강은 단계 3 |
| 2026-05-09 | **단계 2 (Vite 마이그레이션)** — `react-scripts` (CRA) → Vite 5.x + Vitest. Phase C audit Major 5건 일괄 + 동반 변경 (`vite.config.ts`/`tsconfig.node.json` 신규, `@types/node` v16→v22, env prefix `REACT_APP_*`→`VITE_*`, env-var-convention.md 전면 갱신). 본 라운드 정정 13파일, FE 코드 자체 변경 0건. App.test.tsx CRA 잔재는 별도 사이클 | 13파일 (코드 0 + docs 5 + .private-config 3 + frontend 5) | Phase C audit Major 5건 일괄 처리 |
| 2026-05-09 | **단계 3 (Phase B Minor 보강)** — `fe_{develop,improvement,review}_prompt.md` DoD/검토 포커스 SSOT § 인용 (BE 22/22 패턴 정합) + 영향 범위 4→8 + 아티팩트 동기화 DoD. **본 commit 으로 FE 디렉토리 이전 + Vite 마이그레이션 사이클 (1+2+3) 전체 종료** | 6파일 (.private-config 4 + docs 2) | Phase B audit Minor 7건 일괄 (BE 깊이 정합) |
| 2026-05-09 | **메타 정책 사이클 — 누적 문서 자동 최적화 정책 명문화** — `vibe-coding-flow.md §4` 신규 (X=30 행 초과 트리거 / Y=10 보존 / M=3 사이클 보존). 변경 이력 = 1줄 요약 (git log 위임), `plan/`·`custom/` = M=3 사이클 후 자동 삭제, `handoff/`·`issue/` = 보존. 모든 사이클 closure (Step 06) 단계에서 LLM 에이전트 자체 검토 강제. 인용 추가: `CLAUDE.md` / `harness-state.md` / `fe_reference_prompt §12` / `be_reference_prompt §13`. 본 표 *첫 적용* — 누적 43개 행 → 1줄 요약 (이전 행 참조) | `vibe-coding-flow.md §4` 신규 + 4개 SSOT 인용 + 본 표 첫 압축 적용 | 사용자 명시 — "특정 양 누적되면 알아서 최적화" + "강제했으면 함" (vibe-coding-flow.md §4 SSOT 강제 메커니즘 도입) |
| 2026-05-09 | **중간 점검 정정 사이클** — Critical 1 + Major 4 일괄: (C1) `.github/workflows/static.yml` Vite + frontend/ 정합 — `defaults.run.working-directory: ./frontend` + `cache-dependency-path: ./frontend/package-lock.json` + `path: './frontend/dist'` + `name: Deploy Vite + React to Pages`. (M1·M2) `private-config.md:521·539` `npm start` → `npm run dev` + `REACT_APP_*` → `VITE_*`. (M3) `.github/ISSUE_TEMPLATE/{bug,chore,design,docs,feature,refactor}.md` 6개 LICENSE 헤더. (M4) `static.yml` LICENSE 주석 1줄 | 8파일 (.github 7 + docs 1) | 본 사이클들 (FE 이전 + Vite + Phase B + 메타 정책) 후 누락된 정합성 — C1 은 release 브랜치 push 시점에 즉시 빌드 실패 (단계 1·2 검증 시 누락). 8개 영역 audit (`.private-config` / `.claude` / `.github` / `.serena` / `docs` / `scripts` / `LICENSE` / `README`) 으로 검출 |
| 2026-05-09 | **FE 프로토타입 명시 사이클** — `frontend/src/` ~2183 LOC 코드 = *기획 사이클 부재 시점 prototype* 명시. 5곳 SSOT 표기: `fe_reference_prompt.md` 헤더 ⚠️ 박스 + `fe-architecture.md §"현재 상태"` 단락 + `agent-frontend.md §0.6` 신규 핵심 원칙 + `fe_reference_prompt.md §12` / 본 문서 / `CLAUDE.md` 변경 이력. 코드 변경 0건 (표기만) | 5파일 (.private-config 3 + docs 2) | 사용자 명시 — "현재 코드는 프로토타입으로 실제 서비스 수준 아님 / 초반 기획 매우 중요 / 애자일 진행". 아키텍처/스택은 표준 준수 (FSD/Vite/TS Strict 95%) 이나 도메인/화면/사용자 흐름은 공식 기획 부재 |
| 2026-05-09 | **FE 스택 closure 사이클 단계 1 (TypeScript v5 업그레이드)** — `typescript ^4.9.5 → ^5.6.x` + `tsconfig.json moduleResolution: node → bundler` + `verbatimModuleSyntax: true` + `useUnknownInCatchVariables: true` + `tsconfig.node.json bundler`. 호환성 검증 1건 정정 (`reportWebVitals.ts` `import` → `import type`). 검증: tsc strict ✅ / vite build ✅ (133 modules, 81KB gzip) | 5파일 (frontend 4 + .private-config 3 + docs 1) | 사용자 결정 — "아키텍처/스택 끝내고 싶음". FE 스택 closure 사이클 1/5 (TS5 → ESLint → Tailwind → TanStack → App.tsx) |
| 2026-05-09 | **FE 스택 closure 사이클 단계 2 (ESLint 재설정)** — ESLint 9 flat config + typescript-eslint v8 + react/react-hooks (recommended-latest)/react-refresh (Vite HMR). `eslint.config.js` 신규 + `package.json` scripts (`lint`/`lint:fix`) + devDeps 7개 추가 (`eslint`/`@eslint/js`/`typescript-eslint`/`eslint-plugin-react`/`react-hooks`/`react-refresh`/`globals`). 검증: 0 errors / 6 warnings (`react-refresh/only-export-components` — `card.tsx` sub-component 패턴 prototype 수용) / tsc strict ✅ / vite build ✅ | 5파일 (frontend 3 + .private-config 3 + docs 1) | 단계 1 (Vite 마이그레이션) 에서 `react-app/jest` 제거 후 lint 부재 상태 해소. 2/5. FSD 의존성 lint(`eslint-plugin-boundaries`) / pre-commit hook / Prettier 별도 사이클 |
| 2026-05-09 | **FE 스택 closure 사이클 단계 3 (Tailwind v4 도입)** — `tailwindcss^4` + `@tailwindcss/vite^4` (Lightning CSS 기반 native Vite plugin, PostCSS 우회). `vite.config.ts` plugins 배열에 `tailwindcss()` 추가 + `src/index.css` 첫 줄 `@import "tailwindcss";` (v4 신문법, v3 의 `@tailwind base/components/utilities` 대체). 디자인 토큰 (`@theme`/`theme.extend`) 은 디자인 시스템 사이클 별도 — 기본 Tailwind 토큰 유지. 검증: vite build ✅ (CSS 0.29 → 6.20KB, preflight + utility tree-shake) / tsc strict ✅ / lint 0 errors 보존 | 5파일 (frontend 3 + .private-config 3 + docs 2) | SSOT §1 Tailwind ⏳ → ✅. *Stable Latest* 원칙 준수 (`fe_reference_prompt.md §1` 주석). utility 본격 적용은 단계 5 (App.tsx 정리) + 기획 사이클 후 점진적. 3/5 |
| 2026-05-09 | **FE 스택 closure 사이클 단계 4 (TanStack Query v5 도입)** — `@tanstack/react-query^5.59` + `@tanstack/react-query-devtools^5.59`. `frontend/src/shared/lib/query/` 4파일 신규 (`query-client.ts` 기본 옵션 staleTime 1m + gcTime 5m / `provider.tsx` `QueryClientProvider` + DevTools 조건부 / `cache-keys.ts` placeholder / `index.ts` public API). `src/index.tsx` `<App>` 외부에 `<QueryProvider>` 래핑. SSOT §4 라이브러리 격리 정합 (entities/features/pages 직접 호출 금지, 어댑터 경유). 실제 query 사용 = BE 도입 + 기획 사이클 후. 검증: tsc strict ✅ / vite build ✅ (191 modules, 89KB gzip — TanStack +8KB / DevTools production tree-shake) / lint 0 errors 보존 | 7파일 (frontend 6 + .private-config 3 + docs 2) | **SSOT §1 모든 항목 ✅** (TS Strict / React / Vite / Tailwind / TanStack) — FE 스택 마지막 ⏳ 해소. 4/5. 단계 5 (App.tsx 정리) 후 사이클 종결 |
| 2026-05-09 | **FE 스택 closure 사이클 단계 5 (App.tsx CRA 잔재 정리)** — 4파일 git rm: `App.css` / `logo.svg` / `reportWebVitals.ts` / `App.test.tsx`. `App.test.tsx` 천기망 smoke 테스트 재작성 (`QueryProvider` 래핑 + `render` 후 `container` 확인). `index.tsx` reportWebVitals import + 호출 + CRA 주석 제거. `package.json` `dependencies.web-vitals` 제거. 검증: tsc strict ✅ / vite build ✅ (189 modules, 89KB gzip — *modules -2*) / **vitest run ✅ App.test.tsx (1 test) passed** (이전 `learn react` 실패 해소) / lint 0 errors 보존 | 7파일 (frontend 5 삭제/수정/신규 + .private-config 3 + docs 2) | **본 commit 으로 FE 스택 closure 사이클 (1+2+3+4+5) 전체 종료**. CRA 보일러플레이트 완전 폐기. **SSOT §1 모든 항목 ✅** (TS Strict / React / Vite / Tailwind / TanStack). 5/5 |

| 2026-05-09 | **FE 스택 closure 사이클 closure** — 핸드오프 (`docs/readme/handoff/2026-05-09-fe-stack-closure-cycle.md`) 신규 작성 + 본 문서 다음 진화 트리거 갱신. 사용자 검증 3가지 답변: (1) FE prototype 인지 ✅ (5곳 SSOT 표기 완료) (2) FE 기술 스택 §1 모두 ✅ + 아키텍처 일부 placeholder (`shared/api/http.ts` / `shared/config/env.ts` / 디자인 토큰 미정 — 실 사용 시점 도입) (3) 권장 = 🥇 기획 먼저 (BE 도메인 모듈 + FE prototype 정합성 결정) | docs/readme/handoff/2026-05-09-fe-stack-closure-cycle.md (신규) + 본 문서 변경 이력 + 다음 진화 트리거 갱신 | FE 스택 영역 closure. 다음 진화 트리거 = 기획 사이클 우선 |
| 2026-05-09 | **Storybook 미도입 SSOT 표기 사이클** — 사용자 발의 ("FE에 스토리북이 반영되어 있지 않은 것 같은데 비교 분석") 후 검증 결과 Storybook 완전 부재 (frontend/package.json 의존성 0건 / .storybook/ 0개 / *.stories.* 0건 / FE SSOT §1 미정의). 4가지 결정 옵션 (1: 즉시 도입 / 2: 기획 후 / 3: Artifact 만 / 4: SSOT 표기만) 중 사용자 선택 = **4 (SSOT 표기만)**. 변경: `fe_reference_prompt.md §1` Component Catalog 행 추가 (⏳ 미도입 / Phase 6 디자인 시스템 사이클 예정) + §8 placeholder 갱신 (Claude Artifact 패턴 임시 활용) + §12 변경 이력 1행. `agent-frontend.md §1` 운영 디테일 표 ※ 주석 추가 (SSOT 인용). `CLAUDE.md` / 본 문서 변경 이력 동반. 코드 변경 0건 — SSOT 표기만 | 4파일 (.private-config 3 + docs 1) | 기획 사이클 trigger 진입 전 SSOT 정합 — Storybook 미도입이 *의도적 유보* 임을 LLM 에이전트 컨텍스트에 명시 (prototype ~2183 LOC 재구조 대상 → 조기 도입 시 stories 폐기 비용 방지). Phase 6 디자인 시스템 사이클 진입 신호로 도입 |
| 2026-05-16 | **핸드오프 전략 변경 — `<YYYY-MM-DD>-<topic>.md` → `CURRENT.md` 롤링 단일 파일** — 사용자 명시 "앞으로 핸드오프 전략은 항상 CURRENT 갱신 진행". 갱신 4파일: (1) `docs/readme/handoff/README.md` Tier 2 § 구조·즉시 적용 사례·디렉토리 매핑·End-of-Session 프롬프트 (2) `vibe-coding-flow.md §4.1` (보존 → 롤링 덮어쓰기) + `§4.5` (압축 제외 사유 갱신) + `§5` 변경 이력 1행 (3) dangling 링크 정정: `CURRENT.md` 선행 핸드오프 + 선행 사이클 핸드오프 3건 / `vision.md` 3건 / `requirements-phase-1.md` 1건 — 모두 `git log -p` + `harness-state.md` 변경 이력 위임 형태로 | 4파일 (.private-config 1 + docs 3) | 사용자 사유: (1) 새 세션은 *마지막* 만 필요 — 과거 dated 파일은 컨텍스트 노이즈 (2) 사이클 history 는 `harness-state.md` + `git log` 단일 출처 (3) 파일 누적 → 정합성 동기화 부담 (4) "어느 파일이 최신인지" 판단 비용 제거. 선행 stage 상태로 있던 8개 dated 파일 삭제 + `2026-05-10-planning-phase-1-2-closure.md → CURRENT.md` rename 을 본 commit 에 동반 — 정책 SSOT 화 + 물리적 적용 원자 commit |
| 2026-05-16 | **vision.md §4.4 원칙 2건 명시화 (모바일/PWA 오해 방지)** — 사용자 질문 ("PWA = 앱스토어 제공인지 / 모바일 화면 최적화인지 / PC·모바일 둘 다인지") 후속. §4.4 *원칙* §에 2건 박음: (1) *PC·모바일 = 단일 반응형 코드* (별도 페이지/라우트 X / Phase 별 주력 디바이스 가중치만 다름) (2) *PWA ≠ 앱스토어 즉시 등록* (PWA 핵심 가치 4건 명시 + Google Play TWA / Apple App Store Capacitor 차등). §8 변경 이력 1행 동반 | 2파일 (vision.md + 본 문서) | §4.4 본문 (Phase 표 + 3단 진화) 은 충분하나 *원칙* §에 명시되지 않아 LLM 컨텍스트 입력 시 오해 여지 (사용자 본인이 헷갈렸음). 명시화로 휘발 방지 |
| 2026-05-16 | **도메인 점검 사이클 — vision.md §3.3 신규 narrative + 결정 3건 흡수** — 사용자 점검 요청 ("페이즈 1·2 어떻게 흘러갈지 읽기 편하게 문서화") 후속. (1) **§3.3 *Phase 1·2 사용자 흐름* 신규** — 시나리오 (Visitor / 사용자 / 운영자) + ASCII 흐름도 + Phase 1→2 데이터 흐름 + 한눈 요약 표. (2) **결정 #13 모바일 앱스토어 등록 = 확정 진행** — Google Play 우선 (TWA) / Apple 후속 (Capacitor) — §4.4 톤 변경 + §6 deferred *기술 선택만* 으로 좁힘. (3) **결정 #14 점수/진행도 공유 = Phase 2 부터** — §4.1 표 *온라인 랭킹 → 온라인 점수/진행도* (Phase 2·3·4) + §4.2 *점수/진행도 공유 정책* 단락 신규 (프로필 노출 우선 / 1차 메트릭 = 도달 최고 경지). (4) **결정 #15 BC 가설 5→6** — Ranking BC (Supporting) 추가 (Phase 2 진입 시 정식화). §8 변경 이력 1행 + §6 Deferred 신규 3행 (모바일 기술 / 점수 메트릭 추가 / 랭킹 보드 인프라) | 3파일 (vision.md + CURRENT.md + 본 문서) | 사용자 점검 결과 — 휘발 방지를 위해 결정 3건 SSOT 갱신 + narrative 형태로 *읽기만 해도 흐름이 그려지게* (사용자 명시). 싱글 플레이 원칙 (§4.2) 과 점수 공유는 충돌 X — *세계 상태* 가 아닌 *지표 read* 만 |
| 2026-05-16 | **`H-eries` 프로젝트 `.private-config` 공유 — 사전 방어 조치** — 사용자 명시 *"미래에 생길 때 처리하는 것보다 지금 미리 방지를 하는게 맞다"*. 천기망 + H-eries 두 프로젝트가 `martial-arts-config` 단일 저장소를 공유하는 사실에 대해 3가지 사전 방어: (1) **Serena LLM 컨텍스트 격리** — `.serena/project.yml` `ignored_paths` 에 `.private-config/heries` + `Heries` 추가 (2) **작업 절차 — pull-first** — `private-config.md §1.2` 신규 (H-eries 측 변경 가능성 → `.private-config` 진입 시 `git pull` 권장) (3) **천기망 외 영역 명시** — `private-config.md §1` 저장소 구조 표 + `§1.1` 격리 원칙 표 (디렉토리 / 작업 주체 / 상호 참조 / LLM 인덱싱). CURRENT.md §"병행 트랙" *Deferred → 사전 방어 조치 ✅* 로 갱신 | 3파일 (`.serena/project.yml` + `docs/readme/private-config.md` + `docs/readme/handoff/CURRENT.md`) + 본 문서 | 사용자 명시 — *"방어는 발생 후 처리보다 사전 처리"*. 비용 작고 효과 명확 (LLM 컨텍스트 오염 / push 거부 / 영역 혼선 — 모두 1회성 박아두면 영구 방어). 천기망 SSOT 와 H-eries 영역 *도메인 결합 금지* 원칙 박힘 |
| 2026-05-16 | **공유 저장소 README 개선 + 폴더명 정확 표기 정정** — 사용자 발의 *"`martial-arts-config` README 도 개선해야할 듯"* + URL 통해 정확 폴더명 `heries` (소문자) 확정. (1) `.private-config/README.md` 7개 영역 갱신: 첫 단락 *공유 저장소* 톤 / 디렉토리 구조에 `heries/` 추가 + 천기망 영역 `[천기망]` 주석 / 디렉토리 용도 표 *소유자* 컬럼 + `heries/` 행 / **§격리 원칙** 표 신규 / §개발 워크플로우 *0단계 pull-first* / §주의사항 *상대 영역 무관* 2건 / §관련 문서 *천기망 / H-eries* 분리 (2) 천기망 측 폴더명 정정: `히리즈/` → `heries/` (실제 GitHub 폴더명 영어 소문자) — `private-config.md §1·§1.1·§1.2` + CURRENT.md §"병행 트랙" 전체 (3) `.serena/project.yml` `ignored_paths` 정확 표기 정정 — `히리즈` 행 제거 (실제 폴더명 아님), `heries` + `Heries` (안전 마진) 유지. 저장소 이름 = *그대로 유지* (사용자 결정 — 서브모듈 URL / SHA 안정성) | 5파일 (`.private-config/README.md` 서브모듈 + `.serena/project.yml` + `private-config.md` + `CURRENT.md` + 본 문서) | 사용자 발의 + URL 단서 (github.com/hongdosan/martial-arts-config/tree/main/heries) 확보. *호스팅 공유 ✅ / 도메인 결합 ❌* 원칙을 서브모듈 README 자체에도 박아둠 — H-eries 측 작업자 컨텍스트에서도 천기망 영역 격리 인지. 폴더명 표기 통일 (`heries` 소문자) 로 LLM/문서/코드 불일치 0 |
| 2026-05-17 | **2026-05-16/17 점검 라운드 closure — CURRENT.md 핸드오프 롤링 덮어쓰기** — 본 점검 라운드 (2 사이클 / 4 commits) 마무리. Phase 1·2 closure 핸드오프 (2026-05-10) 본문 → `git log -p` 위임. 신규 CURRENT.md 작성: STATUS (Phase 1·2 + 본 라운드 closure ✅) / Summary (4 commits 누적) / **Key Decisions #13~#18** (모바일 앱스토어 / 점수·진행도 / BC 5→6 / 사전 방지 원칙 / 히리즈 격리 4건 / README 개선 7건) / 산출물 / 결정된 핵심 영역 (vision.md §3.3 + §4.1.4 BC 6개 등) / Phase 3 진입 절차 (BC 6개 + §3.3 narrative 입력 보강) / Deferred 12건 / Traps to Avoid (`heries/` 무관 추가) / Working Agreements **2건 신규** (미래 처리보다 사전 방지 / `.private-config` pull-first) / Relevant Files / Prompt for New Chat. 다음 진화 트리거 = Phase 3 DDD Strategic Design (변동 X) | 1파일 (`CURRENT.md` 롤링 덮어쓰기) + 본 문서 변경 이력 + 다음 진화 트리거 갱신 | 사용자 명시 — *"여기까지 한 작업 핸두오프하고 종료"*. CURRENT.md 롤링 단일 파일 정책 (2026-05-16~) 충실 적용. 본 라운드 핵심 정보 보존 + 과거 정보 git log 위임 |
| 2026-05-10 | **기획 사이클 Phase 1·2 closure (vision + requirements)** — 핸드오프 (`docs/readme/handoff/2026-05-10-planning-phase-1-2-closure.md`) 신규. Key Decisions 12건 / 산출물 (vision.md ~270줄 + requirements-phase-1.md ~190줄) / Deferred 9건 / Phase 3 진입 절차 / Prompt for New Chat. Push 는 사용자 본인 — Claude commit 까지 (총 8 commits + 4 서브모듈) | 1파일 신규 (handoff) + 본 문서 변경 이력 + 다음 진화 트리거 갱신 | vibe-coding-flow §4 Closure Discipline. 본 세션 작업량 누적 (8 commits) — Phase 3 도메인 모델링은 또 다른 큰 티키타카 → 다음 세션에서 진입. 컨텍스트 휘발 방지 |
| 2026-05-10 | **Phase 2 요구사항 명세서 작성 — `requirements-phase-1.md` 신규** — vision.md §5.1 헌법 (요구사항 → 행위 중심 → 도메인) 2단계 산출물. 8 §: 목적·범위 / 액터 3종 (Visitor·사용자·운영자) / FR 7 영역 40여 건 (베이스 조회 / 인증 / 커스텀 편집 / 내보내기·가져오기 / 의견 / 커뮤니티 / 운영자 관리) / NFR 9건 / 범위 밖 / BC 매핑 가설 / 참고 / 변경 이력. 선행: vision.md §4.1 데이터 모델 큰 갱신 (커스텀 위치 = 서버 / Phase 1·2 마스터·컨텍스트 관계 / 수동 공유 / Phase 1 BC 가설 5개) | 2파일 (docs/readme/planning/requirements-phase-1.md 신규 + 본 문서 변경 이력) | 사용자 명시 — "(가) Phase 1 만 / 읽기·검색·편집·인증·내보내기·가져오기 / 단순 행위 목록 / 권장 위치 / 바로 작성". 본 명세된 행위가 Phase 3 도메인 모델링 사이클 직접 입력 |
| 2026-05-09 | **기획 사이클 진입 — vision.md 헌장 SSOT 화 (티키타카 1차 산출물)** — 사용자 옵션 4 (SSOT 표기) 후 핸드오프 절차 진입. [1단계] vibe-coding-flow §4 선제 정리 (`plan/meta-history-optimization` 삭제 — 6b2d336). [2단계 대체] 정체성 결정을 A/B/C/D 옵션 선택 X → **티키타카 대화** 로 전환 (사용자 명시 "순차적으로 모든걸 결정 X / 티키타카 필요"). 대화 결과 5건 결정: (1) 비전 1문장 = "나만의 무협 세계관 → 대화형 RPG/외부 IP 랭킹/2D RPG 3 콘텐츠 확장 + 하나의 도메인 언어" (2) 정체성 = *콘텐츠 IP 확장 패턴* (플랫폼 X / 단일 게임 X) (3) 4 Phase 로드맵 흡수 — 사용자 기존 정리본 (Phase 1 세계관 사전 → 2 대화형 RPG → 3 외부 IP 랭킹 → 4 2D RPG) (4) 데이터 모델 = 베이스(서버) / 커스텀(로컬, RPG 전용) / 온라인(점수만) — 싱글 플레이 우선 (멀티 동기화 회피) (5) LLM = 셀프 호스팅 (사용자 명시 정정 — 클라이언트 LLM 가설은 오해) (6) 모바일 = Phase 별 차등 + PWA 출발 (Phase 1 웹 only / Phase 2 PWA 우선 / Phase 4 본격화 시 네이티브 분리). 산출물: `docs/readme/planning/vision.md` 신규 (8 §) — 헌장 = (β) 기획 사이클 전체 SSOT (Phase 1-5 의 상위) | 1파일 신규 (`docs/readme/planning/vision.md`) + 본 문서 변경 이력 + `CLAUDE.md` 변경 이력 | 사용자 명시 — "데이터 정확도를 위해 일단 지금 대화 결과를 기록해야할 것 같다". 티키타카 대화 휘발 방지. 본 헌장이 모든 후속 사이클 (DDD Strategic Design / Phase 1-5 / 4 Phase 구현) 의 상위 SSOT |
| 2026-09-05 | **`martial-arts` → `martial-world` 네임스페이스 마이그레이션 (부분 완료)** — GitHub 저장소 리네임 (`hongdosan/martial-arts` → `hongdosan/martial-world`) 후속 정합화. **2 세션 누적**. 이전 세션: 로컬 폴더 rename / `.idea/vcs.xml` 원복 / `/node_modules` gitignore / 서브모듈 `martial-world/{claude,frontend,backend}` 이동 (`c11f8e7`) + 포인터 bump (`864661a`). 본 세션 4 commits: (1) `16fe702` 잔여 정리 (.iml rename / .idea/modules.xml / docs stale 2건) (2) `503d84d` .serena/project.yml (project_name + 스키마 자동 업그레이드) (3) 서브모듈 `966ea51` `martial-world/` 하위 6개 파일 self-reference `.private-config/claude/...` → `.private-config/martial-world/claude/...` + `../shared/` 상대경로 1레벨 상향 (c11f8e7 이동 후 broken 링크 복구) (4) `d18a865` 포인터 bump. **Deferred**: `.private-config/README.md` 대량 정정 (트리 재구조 + URL / symlink 표 갱신) / `frontend/vite.config.ts` base `/martial-arts/` → `/martial-world/` / GH Pages source legacy → workflow 전환 / develop → release fast-forward merge push / https://hongdosan.github.io/martial-world/ 접속 확인. 상세는 handoff `CURRENT.md` §"Deferred" 참조 | 6파일 메인 (`martial-world.iml` rename / .idea/modules.xml / .gitignore / .serena/project.yml / docs/readme/harness/harness-state.md 경로 정정 / frontend/.env.example) + 서브모듈 6파일 (CLAUDE.md + agent-{backend,backend-reviewer,frontend,frontend-reviewer,game-master}.md) | 2 세션 사이 Bash cwd 무효화로 강제 종료 → 이어받아 서브모듈 잔여 self-reference 우선 처리. 본 세션 종료 시점 = 사용량 여유 부족 → README.md 대량 정정 + GH Pages 복구 + release merge 는 다음 사이클. `martial-arts-config` 저장소 이름은 유지 (결정 #18 — 서브모듈 URL/SHA 안정성). `.private-config/martial-arts/README.md` 스텁은 별도 프로젝트 (`hongdosan/martial-arts` 우산 예약) — 건드리지 X |
| 2026-09-06 | **네임스페이스 마이그레이션 closure — 남은 Deferred 5건 처리 + 배포 복구** — 어제 (09-05) 핸드오프 §Deferred 5건 순차 실행: (1) `.private-config/README.md` 대량 정정 — 첫 단락 URL / 디렉토리 트리 재구조 (`martial-world/{claude,frontend,backend}/` + `martial-arts/` 스텁 행 / `shared/` root 유지) / 용도 표 소유자 컬럼 / 격리 원칙 표 / symlink 표 4행 / 워크플로우 예시 (git clone URL / cd / 파일 경로) / 신규 설정 추가 절차 3 § headings / 주의사항 line 220 / 관련 문서 URL 2건 (2) `martial-world/claude/CLAUDE.md` 변경 이력 1행 (동일 서브모듈 커밋에 묶음 — `8a74be7`) (3) `frontend/vite.config.ts` base `/martial-arts/` → `/martial-world/` (4) GH Pages `build_type: legacy → workflow` 전환 (`gh api ... -X PUT -f build_type=workflow`) (5) `develop → release` fast-forward push (`git push origin develop:release` — bypass protected refs) → workflow trigger 성공 (39s / 34006608606) → https://hongdosan.github.io/martial-world/ 200 OK 확인 (asset 경로 `/martial-world/` prefix 정합). 메인 2 commits (`3403cd4` vite + submodule bump + push 완료) + 서브모듈 1 commit (`8a74be7` push 완료) | 메인 2파일 (`frontend/vite.config.ts` + `.private-config` 포인터) + 서브모듈 2파일 (`README.md` + `martial-world/claude/CLAUDE.md`) + `harness-state.md` (본 행) | 사용자 명시 — "어제 작업 이어서 진행". CURRENT.md 어제 §Deferred + Prompt for New Chat 그대로 실행. 마이그레이션 사이클 완전 closure. 다음 진화 트리거 = Phase 3 DDD Strategic Design (변동 X) |
| 2026-09-06 | **우산 저장소 (`hongdosan/martial-arts`) submodule 편입 사이클** — 사용자 지시 *"martial-world 는 이제 `/Users/hongyeongjune/hongdosan-workspace/martial-arts/` 하위로 들어가서 martial-arts 저장소에서 멀티모듈로 관리되어야 해"* + *"알아서"* 위임. 우산 저장소 구조 파악 (Gradle Composite Build / `includeBuild('martial-life')` monorepo 폴더 / `.gitmodules` = `.private-config` 만) 후 3옵션 (A monorepo 흡수 / B submodule / C 로컬만) 중 **Option B (submodule)** 판단 (근거: martial-world 이력 무거움 + 배포 workflow 독립 + destructive 최소 — M5). 실행: `git submodule add https://github.com/hongdosan/martial-world.git martial-world` (우산 root 에서) → 중첩 submodule `.private-config` recursive init (자동 8a74be7 매칭) → `.gitmodules` + `martial-world` (160000 pointer = 5ba815b) 만 staged 커밋 → 우산 origin/main push. 우산 pre-existing 미커밋 (`.idea/{gradle,vcs}.xml` + `.private-config` new commits) 은 우산 소유자 결정 영역 → 건드리지 X. **Gradle Composite Build 등록 (`includeBuild('martial-world')`) 은 backend/ Gradle 셋업 완료 후 별도 사이클** (지금 추가 시 martial-world/settings.gradle 부재로 빌드 실패 — M7). `master` 브랜치는 룰셋 15185865 로 update 자체 차단 + 15185892 배포 요구 → legacy 봉인 유지 결정 (M6). 워킹 카피 권장 경로 = `~/hongdosan-workspace/martial-arts/martial-world/` (우산 하위) / 이전 `~/IdeaProjects/martial-world/` = stale duplicate (사용자 판단 삭제 or 유지) | 우산 저장소 2파일 (`.gitmodules` + `martial-world` submodule pointer) — `a55ad62 @ umbrella main` + 본 저장소 2파일 (`CURRENT.md` 갱신 + `harness-state.md` 본 행) | 사용자 지시 완수 — martial-world 는 이제 우산 저장소가 인지하는 submodule. 배포/이력/release 브랜치 완전 독립 유지. Phase 3 진입 절차 변동 X — 새 워킹 카피 경로만 반영 |
| 2026-09-06 | **M7 번복 → M8 최소 Gradle 스켈레톤 즉시 셋업** — 사용자 재검토 *"이동된 martial-world 가보면 모듈로 안되어 있고 그냥 단순히 폴더로 구성되어 있는 것 같은데, 검토해줘"* → 진단: git submodule 관점 완벽하나 개발 도구 (Gradle/IntelliJ) 관점 미인식 (martial-world 자체가 Gradle 프로젝트 아님 + 우산 `includeBuild` 없음 + `.idea/modules.xml` 미등록). 4옵션 (A 스켈레톤 / B IntelliJ 만 / C Phase 3 대기 / D 유지) 중 사용자 *"알아서"* 위임 → **A (스켈레톤)** 판단 (근거: 사용자 실제 불만 표명 → C 부적절 / 스켈레톤 비용 거의 0 / 도메인 확정 후 `include` 라인만 추가 = 재구조 비용 0). 실행: martial-world `settings.gradle` 신규 (`fed948e` — `rootProject.name = 'martial-world'` + 도메인 미확정 주석) → 우산 `settings.gradle` 에 `includeBuild('martial-world')` 추가 + submodule pointer bump → `613da63 @ umbrella main`. 검증: `./gradlew projects` 결과 `Included build ':martial-world'` 확인 (BUILD SUCCESSFUL). backend/ 하위 도메인 모듈은 Phase 3 도메인 식별 후 `include(':backend:<domain>:adapter', ...)` 추가로 자연스럽게 확장 | martial-world 2파일 (`settings.gradle` 신규 — `fed948e` + 본 문서/CURRENT.md 갱신) + 우산 2파일 (`settings.gradle` includeBuild 1행 + `martial-world` submodule pointer — `613da63`) | 사용자 지시 (멀티모듈 관리) 를 저장소 + 개발 도구 양쪽에서 성립. Composite Build 로 우산에서 martial-world 인식 (real). 재구조 비용 0 원칙 (스켈레톤이 도메인 확정 후 그대로 확장). M7 폐기 근거 = 사용자 실제 관찰 |

> 다음 진화 트리거: **🥇 우선순위 1 = 기획 사이클 Phase 3 — DDD Strategic Design 본격** — `vision.md` 헌장 + `requirements-phase-1.md` Phase 2 산출물 closure 완료 + 2026-05-16/17 점검 라운드 closure 완료 (BC 가설 5→6 / §3.3 narrative 입력 보강 / 히리즈 격리 사전 방어 완료). 다음 결정 영역 (handoff `CURRENT.md` §"Phase 3 진입 절차" 인용): (1) **Event Storming 1인 변형** — requirements-phase-1.md §3 FR 40+ 건을 *시간순 이벤트* 로 재배열. vision.md §3.3 narrative = 흐름 검증 자료 (2) **Aggregate 후보 식별** (3) **Bounded Context 식별** — vision.md §4.1.4 BC 가설 6개 (Phase 1: BaseWorldview/CustomWorldview/User/Community/Feedback + Phase 2: Ranking Supporting) 검증 — Phase 1 명세 범위는 BC 5개만 / Ranking 은 Phase 2 진입 시 별도 정식화 (4) **Ubiquitous Language 사전** — 강호 용어 (5) **Aggregate 행위 카탈로그** — 명령 + 이벤트 + 불변식 (사용자 명시 "행위 명세 정말 중요") (6) **Subdomain 분류** — Core/Supporting/Generic (7) 산출물 = `docs/readme/planning/domain-phase-1.md`. **🥈 BE 영역**: `backend/` 첫 구조 셋업 — Phase 1 도메인 식별 후 첫 도메인 모듈 생성 / 보안 정책 (Spring Security / JWT / OAuth2). **🥉 인프라 영역** (Phase 2 진입 시): GPU 서버 / 셀프 호스팅 LLM 추론 엔진 (Ollama/vLLM/llama.cpp) / 강호 IP 파인튜닝. **🟢 FE 후속** (Phase 1 화면 설계 후): `shared/api/http.ts` 도입 (BE OpenAPI 명세 후) / `shared/config/env.ts` / 디자인 토큰 / prototype 코드 본격 정리 / `card.tsx` lint 6 warnings 해소 / `eslint-plugin-boundaries` / pre-commit hook / Prettier / PWA 최소 추가 (manifest + service worker). **🟪 메타 도구** (별도 트랙): `agent-fe-tester` 시범 생성 / 통합 코디네이터 `agent-reviewer.md` / claude code hook 자동화 / `.github/` CI/CD 보강. **⚪ Deferred** (vision.md §6): 외부 IP 저작권 검토 / 모바일 정식 앱 *기술 선택* (도입 확정) / 점수 메트릭 추가 / 랭킹 보드 인프라 / 게임 엔진 / H-eries 영어 표기 변형. **⚫ 병행 트랙 (자동 처리)**: `.private-config` = 천기망 + H-eries 공유 저장소 — 격리 사전 방어 완료 (Serena `ignored_paths` / pull-first / `private-config.md §1.1` / 서브모듈 README), 천기망 측 작업 0.

## 참고

- 메타 워크플로우: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- 에이전트 디렉토리: [`.claude/agents/`](../../../.claude/agents/) (symlink → `.private-config/martial-world/claude/claude-agents/`)
- 코드 아키텍처: [fe-architecture.md](../fe-architecture.md)
- 프라이빗 설정 관리: [private-config.md](../private-config.md)
- Harness 도입 가이드: [harness-integration.md](./harness-integration.md)
- Harness 설치·적용 가이드: [harness-setup.md](./harness-setup.md)