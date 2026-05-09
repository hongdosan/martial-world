# Handoff — 2026-05-09 — 기획 사이클 trigger (도메인 / 화면 / 요구사항)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear) — *trigger* 핸드오프. 본 문서는 *fact* 가 아닌 *분석 + 결정 옵션* — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 사용자에게 결정 옵션 제시 + 진행.
>
> **STATUS — 기획 사이클 ⏳ 대기** (사용자 결정 필요 → 새 세션에서 진입)
>
> **선행 핸드오프**: [`2026-05-09-fe-stack-closure-cycle.md`](./2026-05-09-fe-stack-closure-cycle.md) (FE 스택 closure 종료)

## Summary

천기망의 *모든 사이클의 우선순위 1* 진화 트리거 = **기획 사이클** (도메인 설계 / 화면 설계 / 요구사항 정의서). 본 핸드오프는 새 세션이 진입할 때 즉시 활용 가능한 **컨텍스트 분석 + 권장 순서 + 결정 옵션** 모두 보존. 사용자 명시:
- *"초반 기획 매우 중요 / rough X / 애자일 진행"*
- **"모든 기획 설계는 DDD 관점에서 도메인 중심으로 진행"** — BE Phase 6-13 표준과 정합 + 도메인이 *축* / 화면·요구사항이 *표현*
- **"도메인 중심으로 기획을 설계하는 만큼 행위 명세가 정말 중요"** — Aggregate 행위 카탈로그 + BDD `Given/When/Then` 시나리오. 천기망 BE BDD 컨벤션 (`should_X_when_Y`) 와 직결 → 구현·테스트 정합
- **"화면 설계는 Claude 디자인을 적극 활용"** — Phase 5 와이어프레임 / mockup / Claude artifact 패턴 (`frontend/src/artifact/codex-artifact.tsx`) iteration

## 가장 큰 발견 — 천기망 정체성 2-track

기획 *시작 전* 반드시 결정해야 할 핵심 — 모든 후속 산출물 (도메인 / 화면 / 요구사항) 이 이 결정에 종속.

| 트랙 | 출처 | 성격 |
|---|---|---|
| **A. 데이터 플랫폼** | 메인 [`README.md`](../../../README.md) — *"강호 데이터를 체계적으로 수집·분석·조회하는 레퍼런스 플랫폼"* | 카탈로그 / CMS / DB |
| **B. 무협 강호 RPG** | [`agent-game-master.md`](../../../.claude/agents/agent-game-master.md) — *"역할극 스타일의 스토리 중심 게임"* | 게임 / 인터랙션 |

### 결정 옵션

| # | 정체성 | 의미 |
|---|---|---|
| **A** | 데이터 플랫폼 (README 트랙) | 카탈로그 / 레퍼런스 / CMS. 현 prototype `pages/codex` 와 정합. RPG 는 다른 프로젝트 |
| **B** | 무협 강호 RPG (game-master 트랙) | 역할극 게임. 데이터는 게임 세계관 렌더링 재료. 복잡도 ↑ + 희망성 ↑ |
| **C** | 통합 — 데이터 기반 RPG | 데이터 플랫폼이 RPG 의 세계관 레퍼런스 + 콘텐츠 소스. 두 Bounded Context 공존 |
| **D** | 추가 탐색 필요 | 정체성 결정 자체를 별도 사이클로 분리 |

**권장**: 사용자가 직접 결정 — 협업자가 추정 X. `agent-game-master` 가 *사용자 직영 트랙* 명시되어 있어 본 결정도 사용자 영역.

## DDD 적용 원칙 (사용자 명시 2026-05-09)

> **모든 기획 설계는 DDD 관점 / 도메인 중심**. 천기망 BE Phase 6-13 표준과 정합 + 도메인이 *진실*, 화면 / 요구사항 / 사용자 스토리는 *도메인 행위의 표현*.

### 천기망 컨텍스트 맞춤 조정 (3가지)

| # | 원칙 | 상세 |
|---|---|---|
| 1 | **Strategic Design 우선** | Bounded Context / Ubiquitous Language / Subdomain (Core/Supporting/Generic) — 본 사이클 핵심. **Tactical Design (Aggregate/VO/Repository)** 은 *도메인 복잡 시 점진* (애자일 정합 — Phase 별도 트랙) |
| 2 | **Event Storming 1인 변형** | 다수 참여 워크숍 → 시간순 이벤트 마크다운 (`사용자 → 행위 (DomainEvent)` 나열) → Aggregate 후보 → Bounded Context 식별 |
| 3 | **Top-Down + Bottom-Up 혼합** | Top-Down: 비전 → Subdomain → BC. Bottom-Up 보조: 현 prototype entities (character/level/art/faction/fortune/misc/title) 를 BC 후보 *검증* 재료. 코드가 도메인 *재발견* 가능 |

### DDD 정합 매핑

| 기획 산출물 | DDD 개념 | BE 모듈 정합 |
|---|---|---|
| Phase 1 비전 | **Core Domain** 식별 (천기망 Differentiator) | — |
| Phase 2 요구사항 | **도메인 행위** 우선 | — |
| Phase 3 도메인 모델 | **Ubiquitous Language / Bounded Context / Subdomain** + **Aggregate 행위 카탈로그** | `<domain>` placeholder → 실제 도메인명 (`martialarts_<domain>` DB) |
| Phase 4 행위 명세 / 사용자 스토리 | **BDD `Given/When/Then`** (Domain Event 시나리오) | BE BDD 테스트 (`should_X_when_Y` + Testcontainers) 와 1:1 매핑 |
| Phase 5 화면 (와이어프레임) | **BC 의 표면** (BC 단위 = 화면 단위 권장) | — |
| (별도) Tactical Design | Aggregate / VO / Repository / Domain Event | `<domain>:domain` 모듈 내부 |

### 행위 명세 형식 (사용자 명시 2026-05-09 — *정말 중요*)

| 형식 | 역할 |
|---|---|
| **Aggregate 행위 카탈로그** (Phase 3) | 각 Aggregate 가 처리 가능한 *명령 (Command)* 와 발생시키는 *이벤트 (Event)* 목록. 예: `Character.assignArt(artId)` → `ArtAssigned` |
| **BDD Given/When/Then** (Phase 4) | 시나리오별 행위 명세. 예: `Given 무공이 등록되어 있음 / When 캐릭터에 무공 부여 / Then ArtAssigned 이벤트 발생 + 캐릭터 무공 목록에 추가` |
| **Domain Event 카탈로그** | 시스템에서 발생 가능한 모든 도메인 이벤트 (PascalCase 과거형) |
| **불변식 (Invariant)** | Aggregate 가 *항상* 만족해야 하는 규칙 (e.g. *캐릭터의 검도 경지는 무공 검도 경지를 초과 불가*) |

**천기망 BE BDD 컨벤션 정합** — 본 행위 명세가 BE Phase 6-13 의 BDD 테스트 (`should_X_when_Y` + `// given/when/then` + Testcontainers) 의 *직접 입력*. 즉 기획 → BDD 시나리오 → BE 통합 테스트 → 구현 검증의 자연스러운 흐름.

## 권장 기획 순서 — Top-Down DDD (1인 + prototype 활용)

### 🥇 Phase 1: 비전 + 정체성 (1-2 페이지)

> *"왜 만드는가 / 누가 쓰는가 / 어떤 가치"*

- 정체성 트랙 결정 (위 §결정 옵션 A/B/C/D)
- 핵심 가치 제안 (Value Proposition)
- 타겟 사용자 / 페르소나
- **이 결정이 모든 후속 산출물의 축**

### 🥈 Phase 2: 요구사항 명세서 (2-3 페이지, MVP 한정)

> *"무엇을 할 수 있어야 하는가"*

- **기능 요구사항 (FR)** — 사용자 행위 목록 (e.g. *캐릭터 등록/검색/편집/관계 그래프 조회*)
- **비기능 요구사항 (NFR)** — 성능 / 보안 / 가용성 (1인 프로젝트라 간소)
- **MVP 범위** — 1차 출시 vs 후속 (애자일)

### 🥉 Phase 3: 도메인 모델링 (DDD **Strategic Design**) — *BE 도메인 모듈명 확정 직결 / 본 사이클의 축*

> *"비즈니스의 핵심 개념과 룰"* — 모든 기획의 *진실*. 후속 Phase 4-5 는 본 산출물의 *표현*.

**Strategic Design (본 Phase 핵심)**:
- **Subdomain 분류** — Core (천기망 Differentiator) / Supporting / Generic
- **Ubiquitous Language** — 강호 용어 정의 (경지/검도/심법/문파/기연 등) → 기획·코드·DB 모두 통일
- **Bounded Context 식별** — 현 prototype entities (`character`/`level`/`art`/`faction`/`fortune`/`misc`/`title`) 가 *후보* — Event Storming 1인 변형으로 검증
- **Context Map** — BC 간 관계 (Partnership / Customer-Supplier / Conformist / ACL 등)

**Aggregate 행위 카탈로그** (Phase 3 의 *행위 측면* — 사용자 명시 *정말 중요*):
- 각 Aggregate 가 처리 가능한 **명령 (Command)** 목록 — e.g. `Character.assignArt(artId)`
- 각 명령이 발생시키는 **도메인 이벤트 (Domain Event)** — e.g. `ArtAssigned`
- **불변식 (Invariant)** — Aggregate 가 *항상* 만족해야 하는 규칙
- → Phase 4 의 BDD 시나리오 입력

**Tactical Design (별도 트랙 — 점진 도입)**:
- Entity / Value Object / Repository 의 *세부 구현* 정의
- 도메인 *복잡* 시점에 도입 (애자일 — 1차 MVP 후 또는 BE 도메인 모듈 작성 시)
- 단 *Aggregate 식별 + 행위 카탈로그* 는 Phase 3 에서 진행 (Strategic 의 일부로)

→ **BE Phase 6-13 의 `<domain>` placeholder 치환** + `martialarts_<domain>` DB 명명 + `<domain>:adapter/domain/infra` 모듈 구조 자동 결정

### Phase 4: 행위 명세 (BDD) + 사용자 스토리 — *정말 중요* (사용자 명시)

> 도메인 중심 설계의 핵심 산출물. Phase 3 Aggregate 행위 카탈로그를 *시나리오 단위* 로 풀어냄. 천기망 BE BDD 테스트 (`should_X_when_Y` + Testcontainers) 의 직접 입력.

**행위 명세 (BDD `Given/When/Then`)**:
```
시나리오: 캐릭터에 무공 부여
  Given 캐릭터 "독고구패" 가 등록되어 있고
    And  무공 "독고구검" 이 존재하며
    And  독고구패의 검도 경지가 무공의 요구 검도 경지 이상이다
  When  사용자가 독고구패에게 독고구검 무공을 부여하면
  Then  독고구패의 무공 목록에 독고구검이 추가되고
    And  ArtAssigned 도메인 이벤트가 발생한다

시나리오: 검도 경지 미달 시 무공 부여 거부
  Given ...
  When  ...
  Then  ArtAssignmentRejected 도메인 이벤트 발생 / IllegalDomainStateException 발생
```

**사용자 스토리** (보조):
- *As a [페르소나], I want [행위], so that [가치]* 형식
- BDD 시나리오의 *왜 (Why)* 측면 명시

**화면 ↔ 도메인 매핑**:
- 각 BDD 시나리오 = 화면의 *특정 인터랙션* + Aggregate 의 *특정 행위*
- Phase 5 와이어프레임의 직접 입력

### Phase 5: 정보 구조 (IA) + 와이어프레임 — **Claude 디자인 적극 활용** (사용자 명시)

- 사이트맵 / 라우팅 트리
- 화면 ~10개 와이어프레임
- **BC 단위 = 화면 단위 권장** (DDD 정합)
- **현 prototype 활용 가능** — `pages/codex/`, `widgets/codex-*`, `features/entry-*` 가 출발점

#### Claude 디자인 활용 정책 (사용자 명시 2026-05-09)

| 활용 방식 | 산출물 | 위치 |
|---|---|---|
| **ASCII / 마크다운 와이어프레임** | 화면별 텍스트 mockup (Claude 가 즉시 생성 가능) | `docs/readme/planning/wireframes/` 또는 `.private-config/shared/issue/` |
| **HTML / Tailwind mockup** | 화면별 HTML 단일 파일 (브라우저 즉시 렌더 가능) | 동일 |
| **Claude Artifact 패턴** | React + Tailwind 단일 파일 번들 (`agent-frontend.md §9` 동기화 의무) — *iteration* 빠름 | `frontend/src/artifact/<screen>-artifact.tsx` |
| **시각 디자인 prompt iteration** | 사용자 → "이런 화면" 설명 → Claude → mockup → 사용자 피드백 → 재생성 (반복) | 채팅 세션 |

**원칙**: Claude 가 *디자인 산출물 초안* 생성 → 사용자 결정 → SSOT 화 → 본격 구현 (Phase 6 디자인 시스템 + Phase 7 코드).

### Phase 6: 화면 설계 (별도 사이클 — *디자인 시스템*)

- 와이어프레임 (Phase 5) → 시각 디자인 → Tailwind 토큰 (`@theme`) 정의
- Claude 디자인 활용 지속 (디자인 토큰도 Claude 가 제안 가능)

### Phase 7: API 명세 OpenAPI (별도 사이클 — *BE 합류 시점*)

- BE 도메인 모듈 → 엔드포인트 → FE 어댑터 (`shared/api/http.ts`)

> ⚠️ **Phase 1-5 = 본 기획 사이클 핵심**. Phase 6-7 = 후속 사이클 (디자인 시스템 / BE 합류).

## 결정 분기 (사용자 결정 필요 — 새 세션에서)

### ⓐ 정체성 트랙 (위 §결정 옵션) — 가장 먼저

### ⓑ 산출물 위치

| 옵션 | 위치 | 장점 | 단점 |
|---|---|---|---|
| 1 | 신규 `docs/readme/planning/` (공개) | 협업자 접근 가능 | 게임 시나리오 (`agent-game-master` 트랙) 가 공개 영역 |
| 2 | `.private-config/shared/issue/` (현재 빈 placeholder 활용) | 게임 시나리오 안전 | 공개 공유 수단 부재 |
| 3 | 분산 — 도메인/요구사항 = 공개 / 게임 시나리오·세계관 = 프라이빗 | 정확한 권한 분리 | 복잡도 ↑ |

→ **권장 = 3 (분산)** — `agent-game-master` 트랙은 *사용자 직영 + 프라이빗* 일관 + 공개 가능한 도메인/요구사항은 외부 협업 가능

### ⓒ 진행 단위

| 옵션 | 패턴 |
|---|---|
| 1 (권장) | Phase 별 5 사이클 분할 — 이전 fe-stack-closure 패턴 동일 |
| 2 | Phase 1 먼저 + Phase 2-5 술파이스 |
| 3 | Phase 1+2 (비전+요구) 먼저 + 도메인/스토리/화면 분리 |

→ **권장 = 1** — 각 Phase 마다 plan + 승인 + 산출물 + commit. 검증·rollback 단위.

## 자산 현황 (새 세션 진입 검증용)

### ✅ 완료된 영역

| 영역 | 상태 |
|---|---|
| FE 기술 스택 | TS5 / React 19 / Vite 5 / Tailwind v4 / TanStack v5 — SSOT §1 모두 ✅ |
| FE 아키텍처 | FSD / 어댑터 격리 — SSOT §2-§4 ✅ (코드 95% 준수) |
| BE 표준 | Phase 6-13 — 모노레포 / 헥사고날 / 모듈러 모놀리스 / BFF / DDD / 매트릭스 v3 / D1-D5 / DB 스키마 분리 / JPA = infra |
| 메타 정책 | vibe-coding-flow §4 자동 최적화 (X=30 / Y=10 / M=3) |

### ⚠️ Prototype 영역 (기획 사이클 후 정합성 결정)

- `frontend/src/{entities,features,widgets,pages}/` ~2183 LOC — *기획 부재 시점 prototype* 명시 (5곳 SSOT)
- 7개 임시 entities (character/level/art/faction/fortune/misc/title) — Bounded Context *후보*
- 5곳 SSOT 표기 (`fe_reference_prompt.md` 헤더 ⚠️ / `fe-architecture.md §"현재 상태"` / `agent-frontend.md §0.6` / 변경 이력 2곳)

### ❌ 미존재 (기획 후 도입)

- `backend/` 첫 구조 셋업 (현 `backend/.gitkeep` placeholder)
- BE 도메인 모듈 (`<domain>` placeholder)
- `shared/api/http.ts` (BE OpenAPI 후)
- `shared/config/env.ts` (첫 환경 변수 도입 시)
- 디자인 토큰 (`@theme` directive)

## Traps to Avoid

- **정체성 결정 SKIP 금지** — A/B/C 모두 도메인 / 화면 / 요구사항이 *완전히 다름*. 추정 진행 시 후속 폐기 위험
- **현 prototype entities 를 *최종 도메인* 으로 가정 금지** — 7개 entities 는 *비공식 prototype*. DDD Strategic Design 검증 후 채택/통합/분할/폐기
- **`agent-game-master` 사용자 직영 트랙** — 게임 도메인 시나리오/세계관은 사용자 결정 영역. 협업자 임의 변경 X
- **DDD 표면적 적용 금지** — Bounded Context / Aggregate 가 *형식적 분류* 가 아닌 *의미적 단위*. 기획 부족 시 후속 모듈 분리 비용 ↑
- **DDD Tactical Design 조기 도입 금지** — VO / Repository 의 *세부 구현* 모델링은 *도메인 복잡 시점* 에. MVP 단계 = Strategic Design + **Aggregate 식별 + 행위 카탈로그** 만 충분 (Eric Evans 권장)
- **행위 명세 누락 금지** — Aggregate / Bounded Context 식별만 하고 *행위 (명령 + 이벤트 + 불변식)* 명세 없으면 도메인 모델 = 빈 껍데기. Phase 3 + Phase 4 는 *분리 불가능*
- **Ubiquitous Language 일관성 강제** — 한 번 정의한 강호 용어 (`경지`/`심법`/`문파`) 는 기획 / 화면 / 코드 / DB 모두 동일. 동의어 (`등급`/`내공법`) 도입 금지
- **MVP 범위 명시 필수** — 모든 기능을 한 번에 정의 시 사이클 종결 불가. *애자일* 원칙 — 작게 시작 + 점진 추가
- **화면 설계가 도메인 결정 X** — 도메인이 화면을 결정 (Top-Down). 화면을 보고 도메인을 추론 (Bottom-Up) 은 *prototype 활용 보조* 만
- **Claude 디자인 산출물 = 초안** — Claude 가 생성한 mockup / artifact 는 *iteration 시작점*. 사용자 결정 + SSOT 화 후 본격 구현 (자동 채택 X)
- **handoff 파일 = 역사 기록** — 본 trigger 핸드오프는 새 세션 진입 후 STATUS 만 갱신 가능, 본문 갱신 신중

## vibe-coding-flow §4 정책 사전 검토 (새 세션 진입 시)

| 대상 | 현재 | 임계값 | 새 세션 진입 시 |
|---|---|---|---|
| `harness-state.md` 변경 이력 | 20행 | X=30 | ❌ 미트리거 |
| `plan/` 디렉토리 사이클 | 3개 (`meta-history-optimization` / `fe-vite-migration` / `fe-stack-closure`) | M=3 | ⚠️ **임계값 도달** — 기획 사이클 첫 plan 작성 시 4개가 되므로 가장 오래된 1개 (`meta-history-optimization`) 자동 삭제 검토 트리거 |

**새 세션 진입 첫 단계** = 본 정책 검토 + 사용자에게 `meta-history-optimization/` 삭제 제안 (또는 보류) → 결정 후 기획 사이클 진입.

## Working Agreements (선행 핸드오프 상속 + 본 사이클 추가)

- 명시적 지시는 **우회 없이 직접 실행**
- 외부 글은 **원본 URL 로만 참조** (verbatim 사본 repo 저장 금지 — 저작권)
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정의 순차 진행**
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안"
- **Synchronous Update** — 변경 시 SSOT 역전파
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 변경 이력 표에 누적
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지만
- **`agent-game-master` 사용자 직영 트랙** — 협업자가 임의 변경 X
- **DDD 도메인 중심 (사용자 명시 2026-05-09)** — 모든 기획 산출물은 도메인 모델 (Strategic Design) 의 표현. 화면 / 요구사항 / 사용자 스토리는 *도메인 행위의 시점 변경*
- **행위 명세 (사용자 명시 *정말 중요* 2026-05-09)** — Phase 3 Aggregate 행위 카탈로그 + Phase 4 BDD `Given/When/Then` 시나리오. 천기망 BE BDD 컨벤션 (`should_X_when_Y` + Testcontainers) 의 직접 입력. 행위 명세 부재 = 도메인 모델 부재
- **Ubiquitous Language 강제** — 한 번 정의된 강호 용어는 기획 / 화면 / 코드 / DB 모두 동일 표기 (동의어 도입 금지)
- **Claude 디자인 활용 (사용자 명시 2026-05-09)** — Phase 5 화면 설계는 Claude 의 ASCII / HTML mockup / Tailwind / Artifact 패턴 (`frontend/src/artifact/`) 적극 활용. 산출물은 *iteration 초안* — 사용자 결정 후 SSOT 화

## Relevant Files (새 세션 검증 대상)

### 단일 출처 (Single Source of Truth)

- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT (Phase 6-13 완료, `<domain>` placeholder)
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§1 모두 ✅, 헤더 ⚠️ prototype 표기)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT (§4 자동 최적화)

### 정체성 분석 인용

- [`README.md`](../../../README.md) — A 트랙 (데이터 플랫폼)
- [`agent-game-master.md`](../../../.claude/agents/agent-game-master.md) — B 트랙 (RPG)

### Prototype 코드 검증

- `frontend/src/entities/{character,level,art,faction,fortune,misc,title}/` — Bounded Context 후보
- `frontend/src/pages/codex/` — 메인 페이지 (511 LOC)
- `frontend/src/features/{codex-export,defaults-restore,entry-edit,entry-filter,entry-reorder}/` — 사용자 행위

### 선행 사이클 핸드오프

- [`2026-05-09-fe-stack-closure-cycle.md`](./2026-05-09-fe-stack-closure-cycle.md) — 직전 (FE 스택 closure)
- [`2026-05-08-fe-vite-migration-cycle.md`](./2026-05-08-fe-vite-migration-cycle.md) — FE Vite 마이그레이션
- [`2026-05-07-be-fe-consistency-cycle.md`](./2026-05-07-be-fe-consistency-cycle.md) — BE-FE 정합성 정정
- [`2026-05-06-be-cycle-closure.md`](./2026-05-06-be-cycle-closure.md) — BE 표준 정의 종료

## Prompt for New Chat

```
천기망 기획 사이클을 시작한다.

먼저 다음 파일을 Read 도구로 읽고 본 핸드오프의 주장을 코드/실제 상태와
대조 검증해:

1. docs/readme/handoff/2026-05-09-planning-cycle-trigger.md (본 trigger — SSOT)
2. docs/readme/handoff/2026-05-09-fe-stack-closure-cycle.md (선행 closure)
3. docs/readme/harness/harness-state.md (변경 이력)
4. README.md + .claude/agents/agent-game-master.md (정체성 2-track 출처)
5. .private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md §1 (FE 스택)
6. frontend/src/entities/* (Bounded Context 후보 — character/level/art/faction/fortune/misc/title)

CLAUDE.md 에 이미 적힌 내용은 재기술 금지.

검증 후 다음 순서로 진행:

[1단계] vibe-coding-flow §4 정책 사전 검토:
  · plan/ 디렉토리 사이클 3개 (M=3 임계값) → 가장 오래된 'meta-history-optimization/'
    자동 삭제 제안 (사용자 결정)

[2단계] 사용자에게 정체성 트랙 결정 옵션 제시 (A/B/C/D):
  · A. 데이터 플랫폼 (README 트랙)
  · B. 무협 강호 RPG (game-master 트랙)
  · C. 통합 — 데이터 기반 RPG
  · D. 추가 탐색 필요 — 정체성 결정 별도 사이클

[3단계] 산출물 위치 결정 (분산 권장)

[4단계] 진행 단위 결정 (Phase별 5 사이클 권장)

[5단계] Phase 1 plan 작성 진입
  · 비전 + 정체성 문서 작성 (Core Domain 식별 — DDD)
  · 페르소나 / 핵심 가치 / 트랙 결정 명문화

원칙 (반드시 준수):
  · DDD 도메인 중심 — Strategic Design (BC / UL / Subdomain / Aggregate 식별)
    Phase 3 우선, Tactical Design (VO / Repository 세부) 점진
  · 행위 명세 정말 중요 — Phase 3 Aggregate 행위 카탈로그 (명령 + 이벤트 + 불변식)
    + Phase 4 BDD Given/When/Then. 천기망 BE BDD 컨벤션과 직결
  · Ubiquitous Language 강제 — 강호 용어 통일 (기획/화면/코드/DB)
  · Phase 5 화면 = Claude 디자인 적극 활용 (ASCII / HTML mockup / Artifact)
  · agent-game-master 사용자 직영 트랙 — 협업자 임의 변경 X
```

## 참고

- 직전 사이클 closure: [`2026-05-09-fe-stack-closure-cycle.md`](./2026-05-09-fe-stack-closure-cycle.md)
- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
