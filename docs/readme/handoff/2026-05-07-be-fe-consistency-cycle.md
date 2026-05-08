# Handoff — 2026-05-07 — BE-FE 정합성 정정 사이클 종료 + FE 마이그레이션 트리거

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 fact 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 2026-05-07 BE-FE 정합성 정정 사이클 전체 종료 ✅** (직전 핸드오프 [`2026-05-06-be-cycle-closure.md`](./2026-05-06-be-cycle-closure.md) 의 후속 정정 사이클)

## Summary

이전 BE 표준 정의 사이클(Phase 6-13) commit 직전 상태에서 *11파일 LLM 컨텍스트 입력 시 자체 모순·중구난방* 우려로 정합성 정정 라운드 진행. BE 11파일 정정 → 35파일 audit-only → Major 2건 후속 정정 → Phase A·B·C·D 순차 정정. **결과**: BE-FE 대칭성 80%→100%, frontend/src/ 코드 표준 준수율 95%, 다음 *FE 디렉토리 이전 + Vite 마이그레이션* 사이클이 깨끗한 컨텍스트로 시작 가능 상태.

## Key Decisions

| # | 일자 | 결정 | 근거 |
|---|------|------|------|
| 1 | 2026-05-07 | BE 11파일 정합성 정정 — *Phase 13 잔재* (`app` 표기 / "단일 DataSource 금지") 모두 `<domain>:infra/jpa/` 일관·"도메인별 DataSource 필수" 로 정정 | 자체 모순이 LLM 에이전트 컨텍스트에서 혼선 유발 |
| 2 | 2026-05-07 | SSOT 단일 출처화 — `CLAUDE.md` / `harness-integration.md` / `harness-state.md` 의 BE 표준 본문 ~150자 자구 중복 → SSOT 포인터로 압축 | "정보 단일화·명확화" 사용자 판단 |
| 3 | 2026-05-07 | audit-only 라운드 분리 — 대규모 영역(35파일) 은 audit 결과 받은 후 정정 범위 결정 | 변경량 제어, 사용자 결정 단위 분리 |
| 4 | 2026-05-07 | Phase B FE 영역 Major 6건 정정 — BE 정정 패턴(SSOT 단일 출처화 / 변경 이력 운영) FE 적용. 표준 vs 코드 괴리(CRA·TanStack·Tailwind 미설치) 를 SSOT 자체에 명시 | BE-FE 대칭성 + LLM 컨텍스트 혼선 차단 |
| 5 | 2026-05-07 | Phase C frontend/src/ audit-only — 코드 변경은 *Vite 마이그레이션 사이클* 로 이월 | 사이클 분리 — 문서 정정 vs 코드 변경은 성격 다름 |
| 6 | 2026-05-07 | 가벼운 문서 작업 본 세션 / 구조 변경 다음 세션 | 컨텍스트 윈도우·핸드오프 단위 효율 |
| 7 | 2026-05-07 | Push 는 사용자 직영 — develop 가 origin/develop 보다 8 commit 앞섬 | 사용자 결정 영역 |

## Traps to Avoid

- **Phase 13 정정 후에도 매트릭스 본문과 표 사이 모순 가능** — JPA = `<domain>:infra/jpa/` 가 정설. `app` 표기 발견 시 잔재 (이전 v3 문구) 일 가능성. 변경 이력 마지막(`be_reference_prompt.md §13` 2026-05-07 행) 가 단일 진실
- **CLAUDE.md / harness-integration.md / harness-state.md 의 BE 표준 본문 재추가 금지** — 이들은 *포인터* 만 보유. 표준 본문은 SSOT(`be_reference_prompt.md`) 1곳만
- **FE Minor 7건 정정 시도 금지 (본 세션 SKIP 결정)** — fe_develop/improvement 템플릿은 BE 만큼의 본문이 미작성 상태. 보강은 *FE 이전 + Vite 마이그레이션* 사이클의 일부로 통합 처리해야 영향 범위 일관
- **frontend/src/ 코드는 깨끗** — 새 세션이 "코드 정리 필요할 듯" 같은 추측으로 만지지 말 것. audit 95% 통과. 마이그레이션 영향 5건 외 변경 불요
- **`agent-game-master.md` / 게임 도메인 파일은 사용자 직영** — 협업자가 임의 변경 X
- **handoff 디렉토리 파일은 역사 기록** — 본문 갱신 신중. STATUS 헤더만 정정 가능
- **`.claude/skills/` 부재 vs init-private.sh 라인 미추가** — `harness-setup.md:93-94` 주석에 명시. 다음 harness 산출물 발생 시 라인 추가 + 주석 "이미 추가됨" 으로 갱신해야 함

## Working Agreements

- 명시적 지시는 **우회 없이 직접 실행** — 대안 제시·허가 확인 없이
- 외부 글은 **원본 URL 로만 참조** (verbatim 사본 repo 저장 금지 — 저작권)
- **2단계 commit** — 서브모듈(`.private-config/`) 먼저 commit, 메인 저장소가 포인터 갱신
- **제안 → 확인 → 수정 의 순차 진행** (일괄 수정 금지)
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안"
- **Synchronous Update** — 변경 시 SSOT 역전파
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 변경 이력 표에 누적 (단일 출처)
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지만

## Relevant Files

### 본 사이클 정정 (commit 8건, develop 가 origin 보다 8 앞섬)

**서브모듈 `.private-config/`** (4 commit):
- `c86d24f` BE 표준 정의 (Phase 6-13) + 정합성 정정 — 7파일 (+1421/-103)
- `9452179` README BE SSOT 상태 갱신 (Major M1)
- `8240cde` fe_review_prompt.md 위임처 표기 (Phase A)
- `419ad2b` Phase B FE 영역 Major 6건 — 3파일 (+34/-28)
- `88df12f` Phase D agent-frontend-reviewer 도구 우선순위

**메인 저장소** (4 commit + Phase D 1건):
- `3693991` BE 산출물 + 정합성 정정 (Phase 6-13) — 5파일 (+963/-23)
- `6c43471` 메인 README BE 인덱스 (Major M2)
- `0db90ce` Phase A 마무리 — 2파일
- `d16b1ec` Phase B 메인 동기화
- `f6c2e23`/`d991fb8` Phase C audit 결과 누적
- `7e78a85` Phase D 마무리

### 단일 출처 (Single Source of Truth)

- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT (§13 변경 이력 = 단일 진실)
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§12 변경 이력 = 단일 진실, §1 *현재 상태* 컬럼 = 표준 vs 코드 괴리 기록)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처 (모든 사이클 누적)
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT

### 주요 정정 위치 (참고용)

- `be-architecture.md:174-200` — 매트릭스 v3 (Phase 13 일관)
- `be_reference_prompt.md:152-170` — 매트릭스 v3 표 (Phase 13 ★ 표시)
- `be_reference_prompt.md:166-169` — DataSource·EMF·JPA properties·`@EnableJpaAuditing` 모두 `<domain>:infra/jpa/`
- `agent-backend.md:175-180` — JPA = infra 일관 주석
- `fe_reference_prompt.md:11-19` — 기술 스택 표 (현재 상태 컬럼 + 마이그레이션 일정)
- `agent-frontend.md:34-50` — SSOT 인용으로 압축 (본문 중복 제거)
- `agent-frontend.md:57-72` — frontend/ 이전 현황 표기

## Open Work

### 다음 사이클 트리거 — *FE 디렉토리 이전 + Vite 마이그레이션*

이전 BE closure 핸드오프(`2026-05-06-be-cycle-closure.md`)의 "다음 세션" 항목에 본 사이클 audit 결과가 추가 입력으로 합쳐진 상태.

**핵심 입력 (다음 사이클이 처리할 작업)**:

1. **FE 디렉토리 이전** — `src/`, `public/`, `package.json`, `tsconfig.json`, `node_modules/` 등 root 직속을 `frontend/` 하위로 이전 (이전 closure 핸드오프 명시)
2. **Phase C audit Major 5건** (`harness-state.md` 2026-05-07 변경 이력 — Phase C 행에 모두 명시):
   - `public/index.html` → root 이동 + `%PUBLIC_URL%` 참조 제거
   - `react-app-env.d.ts` → `vite-env.d.ts` 교체
   - `package.json` scripts (`react-scripts` → `vite` + `vitest`)
   - `setupTests.ts` (jest → vitest)
   - build 출력 (`build/` → `dist/`)
3. **Phase B Minor 7건** (FE 영역 표기 정합·템플릿 보강):
   - `fe_develop_prompt.md` / `fe_improvement_prompt.md` 템플릿 본문 보강 (BE 깊이로)
   - 3 prompt DoD 에 SSOT § 번호 인용 보강
   - 그 외 표기 정합 잔여 (audit 결과는 `harness-state.md` 2026-05-07 Phase B 행 참조)
4. **TanStack Query / Tailwind CSS 도입** (FE SSOT §1 ⏳ 항목)
5. **`backend/` 첫 셋업** (이전 closure 핸드오프 — 도메인 설계 사이클은 별도 트랙이라 *구조 셋업만*: `settings.gradle` / `buildSrc` / `app` / `core`)

### 별도 트랙 (시점 사용자 결정)

- **도메인 설계 사이클** — 천기망 도메인 확정 (현 placeholder `<domain>` → 실제 도메인명)
- **보안 정책 사이클** — 인증/인가 (Spring Security / JWT / OAuth2) 결정
- **`.github/` CI/CD 도입** — 현재 부재
- **`.gitattributes` 보강** — 부재 (macOS/Linux 전제로 동작은 OK)
- `agent-fe-tester` 시범 생성 (`harness-setup.md §4`)
- 통합 코디네이터 `agent-reviewer.md` 도입 검토

## Prompt for New Chat

```
천기망 FE 디렉토리 이전 + Vite 마이그레이션 사이클을 시작한다.

다음 파일을 실제로 Read 도구로 읽고 본 핸드오프의 주장을 코드/실제 상태와
대조 검증한 후 작업 계획을 안내해:

1. docs/readme/handoff/2026-05-07-be-fe-consistency-cycle.md (본 핸드오프 — SSOT)
2. docs/readme/handoff/2026-05-06-be-cycle-closure.md (직전 BE 사이클 closure — 다음 세션 트리거 명시)
3. docs/readme/harness/harness-state.md (변경 이력 단일 출처 — 2026-05-07 Phase B·C 행이 본 사이클 핵심 입력)
4. docs/readme/fe-architecture.md (FE 아키텍처 — 이전 후 경로 갱신 대상)
5. .private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md (FE SSOT, §1 현재 상태 컬럼 / §12 변경 이력)
6. .private-config/claude/claude-agents/agent-frontend.md (FE 코디네이터, §2.1 frontend/ 이전 현황)
7. package.json (CRA scripts — react-scripts → vite 마이그레이션 대상)
8. public/index.html (Vite 마이그레이션 시 root 이동 대상)
9. src/react-app-env.d.ts (CRA 전용 — vite-env.d.ts 로 교체)

CLAUDE.md 에 이미 적힌 내용은 재기술 금지.

검증 후 사용자에게 다음 안내:
(a) FE 이전 영향 범위 확인 (경로 인용 / 빌드 명령 / .gitignore / 메인 README + private-config.md 등)
(b) Vite 마이그레이션 단계 (Phase C audit Major 5건 + Phase B Minor 7건 통합 처리)
(c) TanStack Query / Tailwind 도입 시점 (FE 이전과 통합 vs 별도 사이클)
(d) backend/ 첫 셋업은 별도 트랙 — FE 이전 후 진행 vs 동시 진행
(e) 영향 받는 산출물 변경 이력 누적 (harness-state.md 단일 출처)
```

## 참고

- 이전 사이클 핸드오프: [`2026-05-06-be-cycle-closure.md`](./2026-05-06-be-cycle-closure.md) — BE 표준 정의 사이클 closure
- 이전 핸드오프: [`2026-05-01-be-harness-cycle.md`](./2026-05-01-be-harness-cycle.md), [`2026-05-01-be-harness-trigger.md`](./2026-05-01-be-harness-trigger.md), [`2026-04-30-harness-install.md`](./2026-04-30-harness-install.md)
- 4-Tier 가이드: [`README.md`](./README.md)
- 하네스 현 상태 + 변경 이력: [`../harness/harness-state.md`](../harness/harness-state.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*