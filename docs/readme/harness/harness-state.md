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
| Vite | `react-scripts@5.0.1` (CRA) | ❌ |
| TanStack Query | 의존성 0 | ❌ |
| Tailwind CSS | 의존성 0 | ❌ |
| TypeScript Strict | `strict: true` | ✅ |
| FSD 레이어 | `processes/` 미사용, 나머지 존재 | △ |
| `frontend/` 디렉토리 | 천기망 root 직속 (`src/`, `package.json` 등) | ❌ — 모노레포 구조 결정 (2026-05-01) 후 `frontend/` 이전 별도 사이클 |
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

| 날짜 | 변경 내용 | 대상 | 사유 |
|------|----------|------|------|
| 2026-04-26 | 공용 프롬프트 템플릿 천기망 맞춤 최소 개선 | `prompt/read_only/{backend,frontend,common}/*` | mk119 잔재 제거, 천기망 BE/FE 분담 placeholder 도입 |
| 2026-04-26 | FE 단일 기준점(SSOT) 결정·작성 | `fe_reference_prompt.md` | TS Strict / React / Vite / TanStack Query / Tailwind / FSD 표준 확정 |
| 2026-04-28 | FE 정보 README 반영 | `README.md`, `fe-architecture.md` | 결정된 FE 표준 공개 문서화 |
| 2026-04-28 | FE 리뷰어 에이전트 작성 | `agent-frontend-reviewer.md` | FE 사이클 닫힌 루프 완성 |
| 2026-04-28 | 본 하네스 분석 문서 작성 | `harness-state.md` | 현 상태 사실 기반 정의 |
| 2026-04-29 | Harness 도입 가이드 작성 | `harness-integration.md` | 도입 절차·BE/FE/기타 분담 원칙 명시 |
| 2026-04-29 | Harness 플러그인 설치·적용 가이드 작성 | `harness-setup.md` | 실제 설치~첫 적용 절차 정형화 |
| 2026-04-29 | 하네스 관련 문서를 `docs/readme/harness/` 로 그룹화 | 디렉토리 재구성 | 주제별 문서 묶음 |
| 2026-04-29 | BE 사이클 보류 결정 | 본 문서 결론 | 사용자가 BE 방향성을 직접 제시 예정 |
| 2026-04-30 | 세션 Context Handoff 4-Tier 전략 도입 | `docs/readme/handoff/README.md` + `2026-04-30-harness-install.md` | 세션 재기동 전 컨텍스트 보존 — codex.epril.com 4계층 전략 차용 |
| 2026-04-30 | harness 플러그인 설치 (Marketplace 옵션 A) | `~/.claude/plugins/installed_plugins.json`, 마켓플레이스 등록명 `harness-marketplace` | 천기망 첫 plugin 도입 — 글로벌 스킬로 로드되어 root 디렉토리 영향 없음 확인 |
| 2026-04-30 | `harness-setup.md` §2 install 명령·§2.1 가설 정정 | `docs/readme/harness/harness-setup.md` | 실측에 따른 SSOT 동기화 — 마켓플레이스 등록명 일치, root 자동 생성 가설 무효화 |
| 2026-04-30 | `agent-frontend.md` 정합성 보강 (Symlink/SSOT 헤더, §1 SSOT 확정값 반영, §2.4 OpenAPI 어댑터, §8 SSOT 동기화 체크, §10 도구 우선순위, §11 메타 워크플로우 신설) | `.private-config/claude/claude-agents/agent-frontend.md` | 하네스 감사 결과 Major 4건·Minor 4건 일괄 보정 |
| 2026-04-30 | LICENSE 표기 표준 확정 (옵션 A) — agent/skill .md frontmatter 다음 HTML 주석 1줄 | 4개 agent .md + `harness-integration.md §3` + `harness-setup.md §5` | 체크 항목 #7 의 사문(死文) 상태 해소, harness 자동 생성물 포함 강제력 확보 |
| 2026-04-30 | `agent-frontend-reviewer.md` 정합성 보강 (Symlink target 헤더, §1 표 절대경로→상대경로 + 표기 통일, §5 vibe-coding-flow 정렬·도구 우선순위) | `.private-config/claude/claude-agents/agent-frontend-reviewer.md` | 하네스 감사 결과 Major 1건(이식성 자기모순)·Minor 4건 보정 |
| 2026-04-30 | `agent-game-master.md` 정합성 보강 (Symlink target + 메타 워크플로우 헤더, JSON 정본 위치 placeholder 명시) | `.private-config/claude/claude-agents/agent-game-master.md` | 하네스 감사 결과 Major 1건(자체 SSOT 위치 불명) placeholder 명시·Minor 보정. 사용자 확정 시 (a)/(b) 모델 결정 |
| 2026-04-30 | `.claude/CLAUDE.md` 정합성 보강 8건 일괄 (H1, LICENSE, Symlink target, 변경 사이클, 빈 링크 2건, 도메인 분석 placeholder, agent-game-master 트리거, 변경 이력 H2) | `.private-config/claude/CLAUDE.md` | 협업자 가이드 SSOT 로 정체성 재정의 — 매 세션 자동 로드 + 천기망 내부 개발자 공용 문서 관점 반영 |
| 2026-04-30 | `.private-config/README.md` 디렉토리 트리 정합성 정정 — FE/BE 표준 프롬프트 8개 (`*_reference/develop/improvement/review_prompt.md`), placeholder README 4개, `frontend/env/.gitkeep` 트리 반영 | `.private-config/README.md` (L23-51) | 디렉토리 정합성 — 트리 SSOT 가 실제 파일 시스템과 일치. 단일 파일 점검 사이클 진입 전 선행 정정 |
| 2026-04-30 | `.private-config/README.md` 단일 파일 정합성 보강 (git commit 예시 → 천기망 표준 prefix `[<TICKET-KEY>]`, Closure Discipline + Synchronous Update 콜아웃, 관련 문서에 prompt 4쌍 위계 1줄 추가, LICENSE 헤더 옵션 A 확장 적용) | `.private-config/README.md` (L3, L113-127, L196-201) | 하네스 감사 결과 Minor 5건 보정 — vibe-coding-flow §6 정렬 + SSOT 역전파 명시 + 협업자 가이드 .md 까지 LICENSE 표기 표준 확장 |
| 2026-04-30 | `vibe-coding-flow.md` (천기망 메타 SSOT) 보강 4건 — LICENSE 헤더, 천기망 메타 SSOT 정체성 헤더, L19 References 직접 링크화, 변경 이력 H2 신설 | `.private-config/shared/prompt/read_only/vibe-coding-flow.md` | 하네스 감사 결과 Minor 4건 보정 — 모든 에이전트 참조 SSOT 의 변경 추적성 확보 |
| 2026-04-30 | `fe_reference_prompt.md` (FE SSOT) 보강 6건 — LICENSE 헤더, SSOT 변경 영향 범위 헤더, 절대경로 3건 → 상대경로 (Major), §11 번호 부여 + Closure Discipline 인용, §12 변경 이력 H2 신설 | `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` | 하네스 감사 결과 Major 1건(이식성 자기모순)·Minor 6건 보정 |
| 2026-04-30 | `fe_develop_prompt.md` 보강 3건 — LICENSE 헤더, 절대경로 3건 → 상대경로 (Major), DoD 에 Synchronous Update + Closure Discipline 항목 2개 추가 | `.private-config/shared/prompt/read_only/frontend/fe_develop_prompt.md` | 하네스 감사 결과 Major 1건(이식성 자기모순)·Minor 3건 보정 |
| 2026-04-30 | `fe_improvement_prompt.md` 보강 3건 — 동일 패턴 (LICENSE / 절대경로 3건 → 상대경로 / DoD 에 Synchronous Update + Closure Discipline 항목 2개 추가) | `.private-config/shared/prompt/read_only/frontend/fe_improvement_prompt.md` | 하네스 감사 결과 Major 1건·Minor 3건 보정 |
| 2026-04-30 | `fe_review_prompt.md` 보강 4건 — LICENSE 헤더, 절대경로 5건 → 상대경로, **임시 위임처 정정 (`agent-frontend.md` → `agent-frontend-reviewer.md`)**, 리뷰 SSOT 결함 명시·Closure Discipline 인용 | `.private-config/shared/prompt/read_only/frontend/fe_review_prompt.md` | 하네스 감사 결과 Major 2건(이식성 + 위임처 stale)·Minor 2건 보정 |
| 2026-04-30 | BE 4개 prompt (`be_reference / be_develop / be_improvement / be_review`) 표면 정합성만 보강 — LICENSE 헤더 + 절대경로 → 상대경로 (각 파일 2~5건). 옵션 B 적용 (BE 도메인 결정 영역은 미접근) | `.private-config/shared/prompt/read_only/backend/be_*.md` | BE 표준이 사용자 직영 영역이라 도메인 결정 사항 (DoD Synchronous Update / Closure Discipline 인용 / 변경 이력 H2 등) 은 BE 표준 결정 사이클로 분리 |
| 2026-04-30 | placeholder README 2개 (`shared/guideline/README.md`, `shared/issue/README.md`) LICENSE 헤더 추가 | `.private-config/shared/{guideline,issue}/README.md` | 옵션 A 확장 일관 적용 — 두 README 는 절대경로 부재로 헤더 외 수정 불필요 |
| 2026-04-30 | placeholder README 2개 (`shared/prompt/custom/README.md`, `shared/prompt/plan/README.md`) LICENSE 헤더 추가 | `.private-config/shared/prompt/{custom,plan}/README.md` | 옵션 A 확장 일관 적용 — 두 README 는 절대경로 부재 + vibe-coding-flow/Closure Discipline 이미 인용 ✓ |
| 2026-04-30 | `docs/issue` symlink 폐기 — issue 영역을 `.private-config/shared/issue/` 단일 위치로 통일 | 메인 `.gitignore` (L49 `/docs/issue` 제거), `docs/readme/private-config.md` (3곳 정정), `docs/issue/` symlink 제거 | 협업자 혼선 방지 — 두 위치 (docs/issue ↔ .private-config/shared/issue) 가 같은 README 보유로 모호. private-config.md 의 `rm symlink/file` 함정 가이드 추가 (symlink target 파일 삭제 위험 경고) |
| 2026-04-30 | `docs/readme/README.md` + `docs/readme/harness/README.md` 신설 — 디렉토리 진입점 일관 회복 | `docs/readme/README.md`, `docs/readme/harness/README.md` (둘 다 신규) | 디렉토리 정합성 — `git/`, `handoff/` 와 동일 패턴 (각 디렉토리에 README.md 진입점). docs/readme/README.md 는 카테고리별 인덱스, harness/README.md 는 3종 문서 진입 순서 안내 |
| 2026-04-30 | `docs/readme/` 단일 파일 점검 사이클 — 16개 .md 모두 LICENSE 헤더 적용 + 잔존 절대경로 정정 (`private-config.md` L264) | `docs/readme/**/*.md` (16개 — architecture, private-config, getting-started, env-var-convention, data, claude-artifact, harness 3종, handoff 2종, git 5종) | 옵션 A 표준 적용 범위를 `docs/readme/` 전체 가이드 .md 까지 확장 — 협업자 가이드 일관성 완성 |
| 2026-04-30 | `agent-harness.md` → **`harness-state.md`** rename — 명명 컨벤션 충돌 해소 | 본 파일 (rename) + 23개 인용 위치 일괄 정정 (메인 `README.md` · `vibe-coding-flow.md` · `handoff/` 2종 · `docs/readme/README.md` · `harness/{README,setup,integration}.md` · 본 파일 자체 변경 이력) | `agent-` prefix 는 천기망에서 *Claude 에이전트 정의* (`.claude/agents/agent-*.md`) 에 일관 사용되는데, 본 문서는 *하네스 분석/변경 이력 SSOT* 로 카테고리가 다름. 협업자가 파일명만 보고 *에이전트 정의* 로 오해할 위험 차단 |
| 2026-04-30 | A 사이클 — 미점검 영역 보강 (메인 `README.md` LICENSE 헤더 / `scripts/init-private.sh` LICENSE 주석) + LICENSE 파일 점검 (실질 결함 없음, `©` vs `(c)` 미세 표기 차이는 별도 사이클로 분리) | `README.md` (L7) · `scripts/init-private.sh` (L4) · `LICENSE` (점검만) | 옵션 A 표준의 적용 범위를 *프로젝트 root 진입점* 까지 확장 — 협업자가 처음 보는 README/스크립트도 일관 표기 |
| 2026-05-01 | `architecture.md` → **`fe-architecture.md`** rename — 명명 일반/특정 정합 | 본 파일 (rename) + 7개 인용 위치 일괄 정정 (메인 `README.md` L58 · `env-var-convention.md` L212 · `docs/readme/README.md` L12 · `handoff/README.md` ×2 · `harness-state.md` ×2 자체 변경 이력) | 본문이 *FE 한정* (FSD/Vite/TanStack/Tailwind) 인데 명칭이 *전체 아키텍처* 같은 인상 → BE 합류 시 명명 충돌 우려. `fe-architecture.md` 로 명명하여 향후 `be-architecture.md` 대칭 확보 |
| 2026-05-01 | BE 표준 정의 사이클 핸드오프 작성 — 별도 세션 진행 결정 | `docs/readme/handoff/2026-05-01-be-harness-trigger.md` (하네스 호출 입력) + `docs/readme/handoff/2026-05-01-be-harness-cycle.md` (Tier 2 핸드오프) | 사용자 결정 — "이 모든 건 하네스가 직접 설계한다". 분담 매트릭스 변경 (BE: 사용자 직영 → 하네스 자동, 방향성은 사용자). 사이클 변경량이 매우 클 것으로 예상되어 별도 세션으로 분리 |
| 2026-05-01 | **BE 표준 정의 사이클 실행** — 9 Phase 완료. 사용자 결정 6항목 (멀티 모듈 분리=혼합 / 횡단 관심사=매트릭스 v2 / BDD=JUnit5+AssertJ / DB 마이그레이션=Liquibase / 진입점 모듈=`app` / 통합 테스트=Testcontainers MariaDB) + 보조 정정 1건 (Gradle DSL: Kotlin → **Groovy** — Java only 컨벤션 친화). 모노레포 구조 결정 (`backend/` + `frontend/`) — FE 디렉토리 이전은 별도 사이클 신규 발의. 보안 정책 = 미정 placeholder (추후 사이클) | 산출물 11종: `agent-backend.md` (골격 47행 → 본문 391행) + `agent-backend-reviewer.md` (신규 ~200행) + `be_reference_prompt.md` (§1 TBD 4건 + §2 매트릭스 v2 + §4-10 placeholder 7개 + §13 변경 이력) + `be_{develop,improvement,review}_prompt.md` (영향 범위 / DoD / 리뷰 체크리스트 보강) + `docs/readme/be-architecture.md` (신규) + `docs/readme/be-multimodule-guide.md` (신규 — Groovy DSL 예시 + buildSrc convention plugin + ArchUnit 룰 + 도메인 추가 절차) + `.private-config/claude/CLAUDE.md` (BE 위임 본문 보강) + 본 문서 (인벤토리·정량 측정값·결론·변경 이력) | 사용자 결정 — "이 모든 건 하네스가 직접 설계한다" (방향성은 사용자, 세부는 하네스). 천기망 BE 가 *문서 기반 프로세스 하네스* 로 닫힌 루프 형성 |
| 2026-05-01 | 모노레포 구조 결정 → **FE 디렉토리 이전 사이클 신규 발의** | 별도 사이클 산출물 (본 사이클 미포함) — `src/`, `public/`, `package.json`, `tsconfig.json` 등 root 직속 → `frontend/` 하위 이전. `fe-architecture.md` / `fe_reference_prompt.md` / `agent-frontend.md` / `agent-frontend-reviewer.md` / 메인 `README.md` / `private-config.md` / `env-var-convention.md` / root 빌드 명령 / `.gitignore` / `.claude/CLAUDE.md` 등 경로 인용 일괄 갱신 대상 | BE 사이클의 모노레포 구조 결정 (`backend/` + `frontend/`) 으로 FE 디렉토리 이전 필요. 본 사이클은 BE 한정이라 FE 이전은 별도 트랙으로 분리 |
| 2026-05-01 | 참고안 3개 사용자 직접 제거 + 핸드오프 2종에 STATUS 헤더·체크박스 갱신 | `.claude/1_백엔드_아키텍처_참고_문서.md` (제거) + `.claude/2_백엔드_아키텍처_참고_문서.md` (제거) + `.claude/3_백엔드_아키텍처_참고_문서.md` (제거) + `docs/readme/handoff/2026-05-01-be-harness-cycle.md` (STATUS + Open Work 갱신) + `docs/readme/handoff/2026-05-01-be-harness-trigger.md` (STATUS + 사이클 후 처리 체크박스 갱신) | BE 사이클 종료 후 사용자 결정 — 본 사이클 산출물 어디에도 인용 링크 없어 dead link 위험 없이 안전 제거. 핸드오프 2종은 *역사 기록* 차원에서 유지하되 STATUS 헤더로 사이클 종료 명시 |
| 2026-05-01 | **FE 디렉토리 이전 + 기본 프로젝트 구조 셋팅 = 다음 세션 진행 결정** (사용자 결정) | 본 사이클은 BE 한정 — FE 이전은 별도 세션 핸드오프 작성 + 새 트리거 프롬프트 + 영향 범위 큰 작업 (FE SSOT 4종 / FE 에이전트 2종 / docs 6종 + 메인 README / package.json 위치 / tsconfig 경로 / .gitignore) | 사용자 결정 — 본 사이클 변경량 이미 큼. FE 이전은 영향 범위가 또 다른 사이클 분량이라 분리 |
| 2026-05-03 | **매트릭스 v2 → v3 정정 사이클** — `<domain>:infra` 정의 좁힘 (외부 시스템 통신 코드 *전용*) + AOP 도메인별 공통 횡단 / DataSource·EntityManagerFactory bean / `@EnableJpaAuditing`·JpaAuditingConfig / DataSourceConfig 류 → `<domain>:infra` 에서 **`app` (모듈 공용)** 으로 재배치 + FeignClient·Mapper·Liquibase 위치 명시 + RestTemplate 금지 | 본 사이클 정정 8파일: `be_reference_prompt.md` (§2.3 매트릭스 v3 + §2.4 D1-D5 신규 + §13 변경 이력) + `agent-backend.md` (§2.3 패키지 트리 + §2.4 매트릭스 + §3 도메인 규칙 §3.6-§3.9 신규) + `agent-backend-reviewer.md` (§2.2 매트릭스 v3 + §2.2A D1-D5 카테고리) + `be_review_prompt.md` (D1-D5 체크리스트) + `be_develop_prompt.md` / `be_improvement_prompt.md` (DoD D1-D5 항목) + `be-architecture.md` (매트릭스 v3 + D1-D5 표) + `be-multimodule-guide.md` (infra build.gradle 의존성 + 패키지 트리 + app build.gradle AOP/Liquibase/Validation 추가) + 본 문서 (인벤토리·정량 측정값·변경 이력) | **사용자 정정** — "infra 에 공통이 들어간다는 잘못된 정보". 새 참고 문서 (`.claude/백엔드_참고용_문서.md`) 기준으로 `<domain>:infra` = 외부 시스템 *통신 코드 전용*, 횡단 설정·도구 설정 = `app` (모듈 공용 진입점, 외부 참고 문서의 `config/` 패키지와 등가). 추가 5개 패턴 (D1-D5: CQRS Port / Port 반환 도메인 / adaptor 금지 / Validator 3패턴 / infra 서브도메인별 소유) 도 함께 보강 |
| 2026-05-03 | **모듈 분리 4-sub → 3-sub 정정 사이클** — `:<domain>:adapter-inbound` + `:<domain>:adapter-outbound` 별도 모듈 → `:<domain>:adapter` 단일 모듈 + 내부 `inbound/`·`outbound/` 패키지 분리. 도메인 N=6 가정 시 모듈 수 25 → 19. inbound ↛ outbound / inbound ↛ infra 차단은 ArchUnit 패키지 룰로 보강 (Gradle 차원 차단 대신) | 본 사이클 정정 9파일: `agent-backend.md` (§0·§2.1·§2.2·§2.3·§2.4·§3·§4·§7.4·§10) + `agent-backend-reviewer.md` (§2.1·§2.2·§2.7·§3·§4) + `be_reference_prompt.md` (§2.1·§2.2·§2.3·§3·§13 변경 이력) + `be_{develop,improvement,review}_prompt.md` (모듈 표기 + DoD + 체크리스트) + `be-architecture.md` (모듈 트리·의존성·매트릭스) + `be-multimodule-guide.md` (settings.gradle / 의존성 / `:<domain>:adapter/build.gradle` 통합 + ArchUnit 룰 강화 + 도메인 추가 절차 3-sub 화) + `.claude/CLAUDE.md` (모노레포 구조 표기 + 변경 이력) + 본 문서 (변경 이력) + harness-integration.md (§2 BE 행 본문) | 사용자 합리적 의문 제기 — "adapter 가 adapter 모듈 내부에 inbound/outbound 패키지가 있는 것이 아닌, inbound/outbound 모듈이 분리된 이유?". 검토 결과 새 참고 문서 (`.claude/백엔드_참고용_문서.md`) 와 산업 관행이 *3-sub* 패턴이며, 4-sub 의 *Gradle 차원 strict 강제* 는 *통상 발생하지 않을 위반* 을 막기 위한 과도한 보험으로 판단. 3-sub + ArchUnit 보강으로 충분 |
| 2026-05-06 | **JPA 설정 위치 일관화 사이클** (Phase 13) — DataSource bean / JPA properties / `@EnableJpaAuditing` / JpaAuditingConfig (Auditor) 위치를 `app` → `<domain>:infra/jpa/` 로 이동. *JPA = infra* 완전 일관. 도메인별 DataSource (URL = `jdbc:mariadb://host:3306/martialarts_<domain>`) + 도메인별 HikariCP 풀. Phase 12 의 *단일 DataSource (no default DB)* 결정을 *도메인별 DataSource* 로 갱신. MSA 전환 시 도메인 모듈 그대로 분리 | 본 사이클 정정 9파일: `be_reference_prompt.md` (§2.3·§5.3·§13) + `agent-backend.md` (§2.3·§2.4) + `agent-backend-reviewer.md` + `be_{develop,review}_prompt.md` + `be-architecture.md` + `be-multimodule-guide.md` (`<domain>:infra/build.gradle` JPA 의존 + 패키지 트리) + `.claude/CLAUDE.md` (변경 이력) + 본 문서 + `harness-integration.md` | 사용자 지적 — "JPA 설정은 infra 영역 아냐?". 매트릭스 v3 의 JPA 분산 (app 일부 / infra 일부) 일관성 의문 정당. Phase 7 *횡단 = app* 진짜 의도는 *AOP 같은 횡단 정정* — JPA 는 *외부 시스템 연결 자체* 라 infra 가 자연스러움 |
| 2026-05-06 | **DB 스키마 분리 사이클** (Phase 12) — (1) 단일 MariaDB instance + 도메인별 database (`martialarts_<domain>`). (2) DataSource = 단일 (no default DB), `jdbc:mariadb://host:3306/`. (3) 도메인별 EntityManagerFactory + `hibernate.default_catalog = martialarts_<domain>` + `@Table(catalog="martialarts_<domain>")`. (4) Liquibase = 도메인별 자체 master + Bean (각 database 독립 마이그레이션). (5) 테이블 명명 prefix 부재 (database 가 namespace). (6) cross-database JOIN·트랜잭션 금지 (이벤트/saga 권장). (7) ArchUnit 룰: entity catalog 일치 / cross-database query 금지. (8) MSA 전환 시: database 단위 dump/restore 만으로 분리 | 본 사이클 정정 9파일: `be_reference_prompt.md` (§2.0·§5.1-§5.4·§13) + `agent-backend.md` (§1·§2.4·§3.4) + `agent-backend-reviewer.md` (§DB 스키마 분리 체크리스트) + `be_{develop,improvement,review}_prompt.md` (DB 영역) + `be-architecture.md` (구조도·DB 영역·§DB 스키마 분리 신규) + `be-multimodule-guide.md` (도메인 추가 절차에 database 생성 / EntityManagerFactory + catalog / ArchUnit 룰) + `.claude/CLAUDE.md` (모노레포 구조 + 변경 이력) + 본 문서 (변경 이력) + `harness-integration.md` (§2 BE 행) | 사용자 결정 — "디비는 하나지만 스키마는 분리" → 옵션 2 채택 (단일 instance + 도메인별 database). MSA 전환 비용 최소화 + *수술적 분리* 강제 + 도메인 격리 물리적 강화 |
| 2026-05-06 | **모듈러 모놀리스 + BFF 통합 사이클** (Phase 11) — (1) **4축 정의 명시** (멀티모듈 + 헥사고날 + 모듈러 모놀리스 + BFF — *Modular Monolith* 는 *Monolith* 와 다름, 단일 배포·단일 DB *지만* 도메인 모듈 명확 분리 + 미래 수술적 분리 가능). (2) `:app` 의 책임 = *Composition Root + 전사 횡단 + 게이트웨이 + BFF* 통합 (별도 `:bff` 모듈 불요 — 사용자 합리적 지적: "`:app` 이 게이트웨이 역할이 아닌가?"). (3) BFF 위치 = `:app/.../bff/{controller,assembler,dto}/` 패키지. (4) BFF 호출 대상 = 도메인의 Inbound Port (Handler) *직접 인메모리 호출* (FeignClient·HTTP 아님). (5) BFF 금지 = 비즈니스 로직·DB 직접 접근·`<domain>:adapter`/`<domain>:infra` 직접 의존·internaladaptor 사용. (6) ArchUnit 룰 추가 = `bff` 패키지가 `domain.port.inbound` 만 의존, `..adapter..`·`..infra..` 의존 금지. 모듈 수 변경 X (`3N+1+K` 유지) | 본 사이클 정정 10파일: `be_reference_prompt.md` (§2.0 4축 정의 + §2.1 비협상 원칙 + §13 변경 이력) + `agent-backend.md` (§0·§1·§2.3·§2.4) + `agent-backend-reviewer.md` (§2 BFF 체크리스트) + `be_{develop,improvement,review}_prompt.md` (영향 범위·DoD·체크리스트의 BFF 항목) + `be-architecture.md` (§4축 정의 + §아키텍처 구조도 + §BFF 신규 + 목차) + `be-multimodule-guide.md` (`app/build.gradle` BFF 의존 영역 주석 + ArchUnit 룰 BFF 2개 추가) + `.claude/CLAUDE.md` (모노레포 구조 4축 + 변경 이력) + 본 문서 (변경 이력 + 결론) + `harness-integration.md` (§2 BE 행 + §4.1 BE 코드 위치) | 사용자 *통합 아키텍처 가이드 도입* — "모듈러 모놀리스 + 헥사고날 + BFF" 채택. 합리적 지적 ("`:app` 이 게이트웨이 역할이 아닌가?") 으로 BFF 별도 모듈 불요, `:app` 안 패키지로 통합. *모놀리스 ≠ 모듈러 모놀리스* 차이 강조 |
| 2026-05-06 | **common 용어 제거 정정 사이클** — `:<common-N>` placeholder + 예시 `common-spring`/`common-test`/`common-time` → `:<role>` 책임명 직접 (예: `:spring-support`, `:test-fixtures`, `:time-util`). 영문 `common-*` 접두사가 *모든 모듈에서 사용 가능* 으로 오해 야기 → 책임명 직접 표기 강제. 한국어 *공통 모듈* 일부는 *라이브러리 모듈* / *공유 책임* 으로 갱신 (정책명 *공통 모듈 정책* 은 인용 정합성 위해 유지) | 본 사이클 정정 9파일: `agent-backend.md` (§1·§2.1·§2.4) + `agent-backend-reviewer.md` (§2.2·§2.7) + `be_reference_prompt.md` (§2.1·§2.2·§2.3·§7·§13) + `be_{develop,improvement}_prompt.md` (영향 범위) + `be-architecture.md` (모듈 트리·매트릭스·정책 표) + `be-multimodule-guide.md` (settings.gradle / 의존성 표 / ArchUnit 룰 / 도메인·라이브러리 모듈 추가 절차 + §섹션명 정정) + `.claude/CLAUDE.md` (모노레포 구조 + 변경 이력) + 본 문서 (변경 이력) + harness-integration.md (§2 + §4.1) | 사용자 정정 — "common 명칭이 들어가면 모두 사용 가능하다고 오해할 수 있음". 영문 `common-*` 모듈명 일괄 제거, 책임명 직접 표기로 명확성 확보 |
| 2026-05-06 | **공통 모듈 정책 최종 정의 + `:core` 신규 도입 사이클** — (1) `:core` (기본 공통 모듈) = 순수 Java 유틸·generic 타입, 의존 0. (2) **책임별 별도 공통 모듈** 도입 가능 (core 가 책임 못 지는 영역 — `:<common-N>`). (3) **선택적 의존 (라이브러리 형식)** — 모든 모듈이 의존 X, 필요한 모듈만. (4) **공통 모듈 → 다른 모듈 의존 금지** (단방향, ArchUnit 강제). (5) **공통 모듈 내부 스파게티 금지** — SRP 엄격. "공통 모듈 금지" 원칙은 *도메인/framework 결합 공통* 에 한정. 도메인 N=6 + 공통 K=1 시 모듈 수 19→20 (`3N+1+K`) | 본 사이클 정정 11파일: `be_reference_prompt.md` (§2.1·§2.2·§2.3·§7·§13) + `agent-backend.md` (§0·§1·§2.1·§2.2·§2.4) + `agent-backend-reviewer.md` (§2.1·§2.2·§2.7) + `be_{develop,improvement,review}_prompt.md` (영향 범위·DoD·체크리스트의 공통 모듈 표기) + `be-architecture.md` (모듈 트리·의존성·매트릭스 + §공통 모듈 정책 신규 + 목차) + `be-multimodule-guide.md` (settings.gradle 에 :core 추가 + `:core/build.gradle` 신규 + 의존성 표 + ArchUnit 룰 강화 (core 의존 0 / JDK 외 import 금지) + 공통 모듈 추가 절차 §신규) + `.claude/CLAUDE.md` (모노레포 구조 + 변경 이력) + 본 문서 (변경 이력 + 결론) + `harness-integration.md` (§2 BE 행 + §4.1 BE 코드 위치) | 사용자 *최종 정의* (2026-05-06) — "core 모듈은 모든 모듈이 가지고 있지 않으며 필요한 도메인에서만 갖는 라이브러리 형식. core 로 둘 수 없는 공통은 또 다른 공통 모듈. 공통 책임을 가진 모듈 내부에서 스파게티 코드가 만들어지면 안됨". 이전 *공통 모듈 금지* 원칙은 *도메인/framework 결합* 공통 모듈에 한정 — 책임별 분리 + 선택적 의존 + SRP + 단방향 = 헥사고날 + DDD 정합 |

| 2026-05-07 | **BE 문서 11종 정합성 정정 사이클** — (1) Critical 자체 모순 제거: `be_review_prompt.md` / `agent-backend-reviewer.md` / `be-architecture.md` / `be_reference_prompt.md` / `agent-backend.md` 의 *Phase 13 잔재* (`app` 표기 / "단일 DataSource 금지") 를 모두 `<domain>:infra/jpa/` 일관·"도메인별 DataSource 필수" 로 정정. (2) SSOT 단일화: `CLAUDE.md` / `harness-integration.md` / `harness-state.md` 의 BE 표준 본문 ~150자 자구 중복 → SSOT (`be_reference_prompt.md`) 단일 출처 포인터로 압축. (3) 역할 경계: `be-multimodule-guide.md` 표현 통일 ("자체 database" → "도메인 전담 database"). (4) `harness-integration.md` 의 *하네스 Phase 0-7* vs *BE 사이클 Phase 6-13* 구분 1줄 명시. (5) 3 prompt (`be_{develop,improvement,review}_prompt.md`) 의 DoD/체크리스트에 SSOT § 번호 인용 보강. (6) `harness-state.md` 의 "ArchUnit 도입 예정" / "4-sub" 구식 문구 갱신 | 본 사이클 정정 11파일: `be_reference_prompt.md` (§2.1·§2.3 본문 정의 + 매트릭스 + 금지 통합) + `agent-backend.md` (§0·§2.4 매트릭스 일관성) + `agent-backend-reviewer.md` (§2.2 매트릭스·§2.6 DB) + `be_review_prompt.md` (DataSource 정정·매트릭스 정정·SSOT § 인용) + `be_develop_prompt.md` / `be_improvement_prompt.md` (DoD 에 SSOT § 인용) + `be-architecture.md` (매트릭스·도메인 격리 단락 Phase 13 일관) + `be-multimodule-guide.md` (표현 통일) + `CLAUDE.md` (§백엔드 위임 본문 압축 + 변경 이력 압축) + `harness-integration.md` (Phase 0-7 vs Phase 6-13 구분, BE 표준 본문 → SSOT 포인터) + `harness-state.md` (구식 문구 갱신 + 본 사이클 누적) | 사용자 판단 — "정보 중구난방으로 인해 에이전트의 로직 혼선 및 오작동 우려, 정보 단일화 및 명확화 필요". 11개 문서를 LLM 에이전트 컨텍스트 입력으로 사용하기에 자체 모순·SSOT 위반·역할 경계 침범 다수 발견 → 일괄 정정 |
| 2026-05-07 | **35파일 audit-only 라운드 + Major 2건 후속 정정** — BE 11파일 외 docs / .private-config / .claude / 메인 README 검토. Critical 0 / Major 2 / Minor 다수 식별. Major 정정: `.private-config/README.md` (BE SSOT "(작성 중)" → "(SSOT — Phase 6-13 확정)" + agent-backend-reviewer.md 트리 누락 추가) + 메인 `README.md` ("설계" 섹션에 BE 아키텍처 + BE 멀티 모듈 가이드 행 추가, "FE 아키텍처" 명시) | 본 라운드 정정 2파일 + audit 보고만: `.private-config/README.md`·메인 `README.md` (정정) / 그 외 33파일 (audit 결과만 — 정정 보류) | 사용자 결정 — "BE 11파일 외 영역에도 같은 패턴 audit-only 라운드 진행". 결과 BE 가 가장 큰 변경량이었고 그 외 영역은 비교적 깨끗 |
| 2026-05-07 | **Phase A: Minor 정합성 마무리 정정** — `harness-setup.md:72` (검증 시점에 "(2026-05-07 현재까지 유효 ✓)" 추가) + `harness-setup.md:93-94` (init-private.sh 라인 미추가 상태 명시) + `fe_review_prompt.md:5-7` (위임처 표기 BE 일관 — 4줄 구조). `commit-convention.md:70` 은 audit 재검토 결과 SKIP (현 표기 OK) | 본 라운드 정정 3파일 | 가벼운 마무리 정정 — audit 보류했던 Minor 5건 중 실질 3건만 |
| 2026-05-07 | **Phase B: FE 영역 deep audit + Major 6건 정정** — Critical 0 / Major 6 / Minor 7 식별. Major 정정: (1) `fe_reference_prompt.md §1` 기술 스택 표에 *현재 상태* 컬럼 추가 (Vite·TanStack·Tailwind ⏳ 미도입 + FE 이전 사이클 일정 명시) + "현 상태 vs 표준 괴리" 주석. (2) `fe_reference_prompt.md §12` 변경 이력 운영 규칙 명시 (BE SSOT §13 동일 형식). (3) `agent-frontend.md §1` 본문 중복 → SSOT 인용으로 압축 (BE 정정 패턴 FE 적용). (4) `agent-frontend.md §2.1` 에 frontend/ 이전 현황 표기 ("현재 src/ root 직속, 다음 사이클에서 frontend/src/ 로 이전 예정"). Minor 7건은 다음 *FE 이전 사이클* 에서 통합 처리 | 본 라운드 정정 2파일: `fe_reference_prompt.md` (§1·§12) + `agent-frontend.md` (§1·§2.1) | 사용자 결정 — "BE 와 같은 깊이로 FE 도 검토". 결과 FE 는 80% 수준으로 BE 정정 패턴 준수 중이었고, Major 6건만 보강해 BE-FE 대칭성 완성. 표준 vs 코드 괴리 (CRA·TanStack·Tailwind 미설치) 를 SSOT 자체에 명시해 LLM 에이전트 컨텍스트 혼선 차단 |

> 다음 진화 트리거: **FE 디렉토리 이전 + `backend/` 첫 셋업** (다음 세션 — 사용자 결정 2026-05-01). 진입점 = [`docs/readme/handoff/2026-05-06-be-cycle-closure.md`](../handoff/2026-05-06-be-cycle-closure.md). FE 이전 후 영향받는 SSOT·에이전트·docs 일괄 동기화 + `backend/` 첫 셋업 (Phase 6-13 표준 적용 — settings.gradle / build.gradle / buildSrc / app / core). 본 문서 *표준-코드 정합* 표에서 `frontend/` ❌ → ✅, `backend/` △ → ✅ 갱신 예정. `agent-fe-tester` 시범 생성 / 도메인 설계 / 보안 정책 사이클은 별도 트랙.

## 참고

- 메타 워크플로우: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- 에이전트 디렉토리: [`.claude/agents/`](../../../.claude/agents/) (symlink → `.private-config/claude/claude-agents/`)
- 코드 아키텍처: [fe-architecture.md](../fe-architecture.md)
- 프라이빗 설정 관리: [private-config.md](../private-config.md)
- Harness 도입 가이드: [harness-integration.md](./harness-integration.md)
- Harness 설치·적용 가이드: [harness-setup.md](./harness-setup.md)