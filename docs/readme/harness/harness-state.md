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

> 다음 진화 트리거: 사용자 결정 영역 — 다수 후보. **`backend/` 첫 셋업** (settings.gradle / buildSrc / app / core — 도메인 설계 별도) / **TanStack Query** + **Tailwind CSS** 도입 (FE SSOT §1 ⏳ → ✅) / **App.tsx CRA 템플릿 정리** (test 실패 해소) / **TypeScript v5 업그레이드** (`bundler` moduleResolution 전환) / **ESLint 재설정** / **`agent-fe-tester`** 시범 생성 / **통합 코디네이터 `agent-reviewer.md`** 도입 / **claude code hook 자동화** (vibe-coding-flow §4 자동 강제) / **도메인 설계 사이클** / **보안 정책 사이클** / **`.github/` CI/CD 도입**.

## 참고

- 메타 워크플로우: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- 에이전트 디렉토리: [`.claude/agents/`](../../../.claude/agents/) (symlink → `.private-config/claude/claude-agents/`)
- 코드 아키텍처: [fe-architecture.md](../fe-architecture.md)
- 프라이빗 설정 관리: [private-config.md](../private-config.md)
- Harness 도입 가이드: [harness-integration.md](./harness-integration.md)
- Harness 설치·적용 가이드: [harness-setup.md](./harness-setup.md)