# Handoff — 2026-05-10 — 기획 사이클 Phase 1·2 closure (vision + requirements)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 *fact* 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 기획 사이클 Phase 1·2 (비전 / 요구사항) closure ✅** / Phase 3 (DDD Strategic) ⏳ 대기
>
> **선행 핸드오프**: [`2026-05-09-planning-cycle-trigger.md`](./2026-05-09-planning-cycle-trigger.md)

## Summary

천기망 기획 사이클 진입 후 **Phase 1 (비전 / 정체성) + Phase 2 (요구사항 명세) closure**. 사용자 티키타카 대화로 *"플랫폼 / 단일 게임 / 데이터 사전"* 가설 모두 폐기 → **"콘텐츠 IP 확장 패턴"** 정체성 확립 (4 Phase 로드맵 흡수). vision.md §5.1 *천기망 DDD 적용 정의* (3단계 헌법 — 요구사항 → 행위 중심 → 도메인) SSOT 화. requirements-phase-1.md = MVP 행위 ~40건 명세. 다음 진화 트리거 = **Phase 3 도메인 모델링 (DDD Strategic Design)**.

## Key Decisions

| # | 일자 | 결정 | 근거 |
|---|------|------|------|
| 1 | 2026-05-09 | **정체성 = 콘텐츠 IP 확장 패턴** (Disney-like / Pokémon-like) | 사용자 비전 — *"하나의 무협 세계관 → 대화형 RPG · 외부 IP 랭킹 · 2D RPG 3 콘텐츠 확장"*. 핸드오프 §결정 옵션 A/B/C/D 모두 부분 일치 X — 새 카테고리 |
| 2 | 2026-05-09 | **4 Phase 로드맵 흡수** (사용자 기존 정리본) | Phase 1 세계관 사전 → 2 대화형 RPG → 3 외부 IP 랭킹 → 4 2D RPG. *프로젝트 전체* 단위 (기획 사이클 *Phase 1-5* 와 구분) |
| 3 | 2026-05-09 | **데이터 모델 = 베이스(서버) / 커스텀(서버, 사용자 계정 연동) / 온라인(점수만)** | 초기 가설 *"커스텀 = 로컬 only / Phase 2 한정"* 사용자 결정으로 갱신 — *Phase 1 마스터 + Phase 2 LLM 컨텍스트 입력* (단방향) |
| 4 | 2026-05-09 | **싱글 플레이 우선 — 멀티 동기화 회피** | 사용자 명시 — *"실제 데이터가 공유되는 순간 너무 복잡"*. CAP / Eventual / 실시간 동기화 = 영구 비범위. 점수만 REST API 1개 |
| 5 | 2026-05-09 | **셀프 호스팅 LLM** (외부 API 의존 X) | 사용자 명시 정정 — *"내 서버에 로컬 LLM 학습/배포"* (클라이언트 LLM 가설 폐기). Ollama / vLLM / llama.cpp 후보 — Phase 2 진입 시 결정 |
| 6 | 2026-05-09 | **모바일 = Phase 별 차등 + PWA 출발** | Phase 1 웹 only / Phase 2 PWA 우선 (미연시 결) / Phase 3 웹 우선 + PWA / Phase 4 본격화 시 네이티브 분리 |
| 7 | 2026-05-09 | **§5.1 천기망 DDD 적용 정의 — 헌법급 SSOT** | 사용자 명시 3단계 — *"1. 요구사항 명세서 / 2. 행위 중심 / 3. 행위 → 도메인"*. 본 정의가 모든 후속 사이클 (Phase 2-5) 의 절차적 SSOT |
| 8 | 2026-05-09 | **공유 모델 = 수동 only** (커뮤니티 게시글 + 내보내기/가져오기) | 사용자 명시 — *"링크든 뭐든 제공되는 순간 복잡"*. 자동 동기화 X. 천기망 = *공유 채널* 만 제공, *데이터 동기화* X |
| 9 | 2026-05-09 | **Phase 1 = 세계관 사전 + 커뮤니티 부속** | 사용자 통찰 — *"커뮤니티는 비교적 간단한 온라인 기능"*. 게시판 = post/read 모델 = 동기화 복잡도 없음. 4 Phase 외 5번째 X — Phase 1 안에 포함 |
| 10 | 2026-05-10 | **Phase 1 BC 가설 5개** (BaseWorldview / CustomWorldview / User / Community / Feedback) | User BC ≠ CustomWorldview BC 의도적 분리 (사용자 우려 *"프로필과 도메인 영역이 멀다"* 정합). Generic Subdomain (User) ↔ Core Domain (Worldview) — 별개 BC, *소유 관계* (User → 0..N CustomWorldview). 가설 — Phase 3 검증 |
| 11 | 2026-05-10 | **요구사항 명세 형식 = 단순 행위 목록** | (가) 단순 / (나) User Story / (다) Use Case 중 (가) — *비전 = WHY*, *명세 = WHAT*. User Story 의 *so that* 노이즈 회피 |
| 12 | 2026-05-10 | **Phase 1 MVP = 읽기 + 검색 + 편집 + 인증 + 내보내기 + 가져오기 + 의견 + 커뮤니티** | 사용자 결정. *"처음부터 다 만들지 말 것"* 원칙 — 댓글 / 좋아요 / 알림 / 의견 워크플로우 / 가져오기 병합 = 비범위 |

## 산출물

### 신규 파일

| 파일 | 분량 | 위치 |
|---|---|---|
| `docs/readme/planning/vision.md` | ~270 줄 (8 § + 4 회 갱신) | 메인 |
| `docs/readme/planning/requirements-phase-1.md` | ~190 줄 (8 § + FR 40+) | 메인 |

### 갱신 파일

| 파일 | 변경 |
|---|---|
| `.private-config/claude/CLAUDE.md` | 변경 이력 3행 (Storybook / vision / requirements) |
| `docs/readme/harness/harness-state.md` | 변경 이력 3행 + 다음 진화 트리거 갱신 |
| `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` | §1 Component Catalog 행 + §8 placeholder 갱신 + §12 변경 이력 |
| `.private-config/claude/claude-agents/agent-frontend.md` | §1 ※ 주석 (Storybook SSOT 인용) |

### 정리

| 작업 | 산출 |
|---|---|
| `plan/meta-history-optimization/` 삭제 | vibe-coding-flow §4 (M=3) 선제 정리 — Phase 1 plan 디렉토리 진입 전 |

### Commit 이력 (본 사이클 — 8개)

```
bc174f4  docs: Phase 2 requirements-phase-1.md 신규 — 행위 중심 명세 (vision §5.1 2단계)
d9f4114  docs: vision.md §4.1 데이터 모델 큰 갱신 + Phase 1 BC 가설 (Phase 2 요구사항 진입 전)
66869d9  docs: vision.md §5.1 천기망 DDD 적용 정의 SSOT 화 (사용자 헌법급)
52c7556  docs: vision.md v1 다듬기 — DDD 용어 풀이 + LLM 오해 단락 정리
b1ba587  docs: 기획 사이클 vision.md 헌장 신규 — 천기망 비전·정체성·로드맵 SSOT
d2b24bb  chore: 서브모듈 포인터 갱신 — plan/meta-history-optimization 자동 정리
ee3d59c  docs: FE Storybook 미도입 SSOT 표기 사이클
(서브모듈 commits: 7ba3f44 / bf00de2 / 6b2d336 / 628cf09)
```

## 결정된 핵심 영역

### vision.md (헌장 — 모든 후속 사이클의 상위 SSOT)

- §1 비전 1문장 — *"나만의 무협 세계관 → 대화형 RPG · 외부 IP 랭킹 · 2D RPG 3 콘텐츠 확장 + 하나의 도메인 언어"*
- §2 정체성 — 콘텐츠 IP 확장 패턴 (플랫폼 X / 단일 게임 X / 데이터 사전 X)
- §3 4 Phase 로드맵 + 의존 그래프 (Phase 1 = 모든 후속 전제)
- §4.1 데이터 모델 (베이스 / 커스텀 / 온라인 / 커뮤니티) + §4.1.1 편집 모델 + §4.1.2 수동 공유 + §4.1.3 Phase 1·2 단방향 의존 + §4.1.4 BC 가설 5개
- §4.2 싱글 플레이 / §4.3 셀프 호스팅 LLM / §4.4 모바일 PWA 출발
- §5.0 DDD 핵심 용어 풀이 (11개 + 천기망 예시)
- §5.1 천기망 DDD 적용 정의 (3단계 헌법 — 헌법급 SSOT)
- §5.2 부속 핵심 원칙 / §5.3 4 Phase ↔ Subdomain 매핑 가설
- §6 Deferred 12건

### requirements-phase-1.md (Phase 2 산출물 — Phase 3 도메인 모델링 직접 입력)

- §1 범위 — 포함 6 (읽기·검색·편집·인증·내보내기·가져오기·의견·커뮤니티) / 비범위 8
- §2 액터 3종 (Visitor / 사용자 / 운영자)
- §3 기능 요구사항 — 7 영역 40+ 건:
  - §3.1 베이스 사전 조회 (FR-3.1.1 ~ 5)
  - §3.2 사용자 인증 (FR-3.2.1 ~ 6)
  - §3.3 커스텀 강호 편집 (FR-3.3.1 ~ 10)
  - §3.4 커스텀 가져오기 / 내보내기 (FR-3.4.1 ~ 3)
  - §3.5 베이스 수정 의견 (FR-3.5.1 ~ 4)
  - §3.6 커뮤니티 게시판 (FR-3.6.1 ~ 8)
  - §3.7 운영자 베이스 관리 (FR-3.7.1 ~ 4)
- §4 NFR 9건 (성능 / 가용성 / 보안 / 접근성 / 영속성 / 언어 / 백업)
- §5 범위 밖 10건
- §6 영역 ↔ BC 가설 매핑

## 미결정 / Deferred (vision.md §6 인용)

| 영역 | 결정 시점 | 비고 |
|---|---|---|
| **Phase 1 BC / UL / Aggregate 식별** | **Phase 3 도메인 사이클** ← 다음 진화 트리거 | DDD Strategic 본격. 가설 5개 검증 |
| **공유 파일 형식 확정** | Phase 1 진입 시 또는 후속 | JSON 우선 권장. MD / CSV / SQL 후속 |
| **인증 방식 / 운영자 권한 분리** | Phase 1 진입 시 | 이메일 / OAuth / Magic Link / JWT — Phase 1 plan 단계 |
| **외부 IP 랭킹 진입 메커니즘** | Phase 3 (4 Phase) 진입 시 | 운영자 큐레이션 / 사용자 제출 → 승인 / 위키 |
| **Local LLM 추론 엔진 / 모델** | Phase 2 (4 Phase) 진입 시 | Ollama / vLLM / llama.cpp + 강호 IP 파인튜닝 |
| **GPU 서버 인프라** | Phase 2 (4 Phase) 진입 시 | 비용·동시성·배포 |
| **모바일 정식 앱** | Phase 2 (4 Phase) 검증 후 | Capacitor / RN / Flutter |
| **2D RPG 게임 엔진** | Phase 4 (4 Phase) 진입 시 | Phaser / Pixi / Godot HTML5 |
| **외부 IP 저작권 검토** | Phase 3 (4 Phase) 진입 전 | 법적 검토 별도 |

> ⚠️ 4 Phase ≠ 기획 사이클 Phase. *4 Phase* = 프로젝트 전체 (사전/RPG/랭킹/2D). *기획 사이클 Phase 1-5* = 비전/요구/도메인/행위/화면. 본 핸드오프 closure = *기획 사이클 Phase 1-2 완료*.

## Traps to Avoid

- **vision.md §5.1 헌법 (행위 → 도메인) 위반 금지** — Phase 3 진입 시 *DB 스키마 → 도메인 도출* / *화면 → 도메인 도출* 금지. 행위가 먼저
- **Phase 1 BC 가설 5개 = *최종* 으로 가정 X** — 합침 / 분리 / 추가 가능. 가설 검증이 Phase 3 핵심 작업
- **현 prototype entities 7종 (character/level/art/faction/fortune/misc/title) 을 *최종 도메인* 으로 가정 X** — *Bottom-Up 검증 재료* 만. *결정 권한* 은 행위 → BC 도출에 있음
- **User BC + CustomWorldview BC 분리 유지** — 합치면 사용자 우려 *"프로필과 도메인 영역이 멀다"* 위반. Generic ≠ Core
- **싱글 플레이 / 수동 공유 원칙 흔들기 금지** — 자동 동기화 / 실시간 / 멀티 = 영구 비범위
- **MVP 범위 확장 금지** — 댓글 / 좋아요 / 의견 워크플로우 / 가져오기 병합 = Phase 1 비범위. 추가 시 사이클 증가
- **vision.md / requirements 와 *반대 결정* 시도 시 — SSOT 갱신 사이클 선행** — 그냥 코드 작성 X. SSOT → 코드 단방향
- **"잘 모르겠다 / 더 설명" 답변 = 정상** — 사용자 명시 *"처음부터 완벽 X / 애자일"*. 모호함은 *명시적 deferred* 로 박아둠 (휘발 방지)

## vibe-coding-flow §4 정책 사전 검토

| 대상 | 현재 | 임계값 | 새 세션 진입 시 |
|---|---|---|---|
| `harness-state.md` 변경 이력 | ~25행 | X=30 | ❌ 미트리거 |
| `vision.md §8` | 5행 | X=30 | ❌ 미트리거 |
| `requirements-phase-1.md §8` | 1행 | X=30 | ❌ 미트리거 |
| `CLAUDE.md` 변경 이력 | ~17행 | X=30 | ❌ 미트리거 |
| `plan/<topic>/` | **2개** (`fe-stack-closure` / `fe-vite-migration`) | M=3 | ❌ 미트리거 (현재 임계값 미만) |
| `custom/<topic>/` | 0개 | M=3 | ❌ 미트리거 |

→ 새 세션 진입 시 *별도 정리 X*. Phase 3 진입하면서 *새 plan 디렉토리* (`planning-phase-3-domain/` 또는 유사 명) 생성 시 3개 → 임계값 도달.

## Working Agreements (선행 핸드오프 상속 + 본 사이클 추가)

- 명시적 지시는 **우회 없이 직접 실행**
- 외부 글은 **원본 URL 로만 참조** (verbatim 사본 repo 저장 금지 — 저작권)
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정** 순차 진행
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안"
- **Synchronous Update** — SSOT 변경 시 영향 받는 참조처 동기화
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 단일 출처
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지만
- **`agent-game-master` 사용자 직영 트랙** — 협업자 임의 변경 X
- **DDD 도메인 중심** — vision.md §5.1 헌법 (3단계) 비협상
- **행위 명세 = 정말 중요** — Phase 3 Aggregate 행위 카탈로그 + Phase 4 BDD `Given/When/Then` (사용자 명시 *"정말 중요"*)
- **Ubiquitous Language 강제** — 강호 용어 통일 (기획/화면/코드/DB)
- **Phase 5 화면 = Claude 디자인 적극 활용** (ASCII / HTML mockup / Artifact 패턴)
- **티키타카 대화 우선** (사용자 명시 *"순차적으로 모든걸 결정 X / 티키타카 필요"*) — 옵션 다지선다 X, 자유 대화 후 결정 흡수
- **모호함은 명시적 deferred 로 박기** (사용자 명시 *"완벽 해소 X 라도 진행"*) — 휘발 방지

## Relevant Files

### 단일 출처 (Single Source of Truth)

- [`vision.md`](../planning/vision.md) — **본 사이클 헌장**. 모든 후속 사이클 (Phase 3-5 / 4 Phase 구현) 의 상위 SSOT
- [`requirements-phase-1.md`](../planning/requirements-phase-1.md) — Phase 2 산출물. Phase 3 도메인 모델링 직접 입력
- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT (Phase 6-13 완료)
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§1 모두 ✅, Storybook ⏳)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT

### Phase 3 도메인 모델링 입력

- `vision.md §4.1.4` — Phase 1 BC 가설 5개 (검증 대상)
- `vision.md §5.1` — DDD 적용 정의 (3단계 헌법)
- `vision.md §5.0` — DDD 용어 풀이 (11개)
- `requirements-phase-1.md §3` — FR 7 영역 40+ 건 (행위 → BC 도출 입력)
- `requirements-phase-1.md §6` — 영역 ↔ BC 가설 매핑

### Prototype 코드 (Bottom-Up 검증 재료 only — *결정 권한 X*)

- `frontend/src/entities/{character,level,art,faction,fortune,misc,title}/` — 7종
- `frontend/src/pages/codex/` — 메인 페이지 (511 LOC)
- `frontend/src/features/{codex-export,defaults-restore,entry-edit,entry-filter,entry-reorder}/`

### 선행 사이클 핸드오프

- [`2026-05-09-planning-cycle-trigger.md`](./2026-05-09-planning-cycle-trigger.md) — 직전 (기획 사이클 trigger)
- [`2026-05-09-fe-stack-closure-cycle.md`](./2026-05-09-fe-stack-closure-cycle.md) — FE 스택 closure
- [`2026-05-08-fe-vite-migration-cycle.md`](./2026-05-08-fe-vite-migration-cycle.md) — FE Vite

## 다음 세션 진입 절차 — Phase 3 도메인 모델링 (DDD Strategic Design)

### 검증 단계

1. **vision.md §4.1.4 BC 가설 5개** 를 직접 Read 도구로 읽고 *현 시점에서도 합리적인지* 사용자와 재확인
2. **requirements-phase-1.md §3 FR 7 영역 40+ 건** 을 직접 Read 도구로 읽고 *Phase 3 입력 으로 사용*
3. **vibe-coding-flow §4 정책 사전 검토** — 새 plan 디렉토리 생성 시 임계값 (3개) 도달

### Phase 3 본격 진입 절차 (DDD Strategic Design)

> vision.md §5.1 헌법 (행위 → 도메인) 비협상 준수.

1. **Event Storming 1인 변형** — requirements-phase-1.md §3 FR 40+ 건을 *시간순 이벤트* 로 재배열 (`사용자 → 행위 (DomainEvent)` 형태)
2. **Aggregate 후보 식별** — 이벤트 묶음 → Aggregate 경계 도출
3. **Bounded Context 식별** — Aggregate 묶음 → BC 경계. *vision.md §4.1.4 가설 5개와 비교 검증* (합침 / 분리 / 추가)
4. **Ubiquitous Language 사전 작성** — 강호 용어 (경지 / 심법 / 문파 / 기연 / 칭호 / ...) 정의 + 동의어 금지
5. **Aggregate 행위 카탈로그** — 각 Aggregate 의 *명령 (Command)* + *이벤트 (Event)* + *불변식 (Invariant)*
6. **Subdomain 분류** — Core / Supporting / Generic (vision.md §5.3 가설 검증)
7. **산출물**: `docs/readme/planning/domain-phase-1.md` (vision.md §5.1.3 표 정합)

### Deferred 결정 (Phase 3 안에서 또는 후속)

- 인증 방식 (이메일 / OAuth / JWT) — Phase 1 plan 단계
- 공유 파일 형식 (JSON 우선 권장)
- BC 가설 5개 vs 실제 도출 BC 의 차이 — 합침 / 분리 결정

## Prompt for New Chat

```
천기망 기획 사이클 — Phase 3 도메인 모델링 (DDD Strategic Design) 을 시작한다.

먼저 다음 파일을 Read 도구로 읽고 본 핸드오프의 주장을 검증해:

1. docs/readme/handoff/2026-05-10-planning-phase-1-2-closure.md (본 핸드오프 — SSOT)
2. docs/readme/planning/vision.md (헌장 — 특히 §4.1.4 BC 가설 / §5.0 용어 / §5.1 헌법 / §5.3 매핑)
3. docs/readme/planning/requirements-phase-1.md (Phase 3 입력 — 특히 §3 FR 7영역 / §6 BC 매핑)
4. docs/readme/harness/harness-state.md (변경 이력)
5. .private-config/shared/prompt/read_only/vibe-coding-flow.md §4 (메타 정책)

CLAUDE.md 에 이미 적힌 내용은 재기술 금지.

검증 후 다음 순서로 진행:

[1단계] vibe-coding-flow §4 정책 사전 검토:
  · plan/ 2개 (fe-stack-closure / fe-vite-migration) — 새 plan 생성 시 3개 = 임계값
  · 새 plan 디렉토리 명명 (planning-phase-3-domain/ 권장)

[2단계] BC 가설 5개 사용자 재확인:
  · BaseWorldview / CustomWorldview / User / Community / Feedback
  · 합침 / 분리 / 추가 가능 여부 티키타카

[3단계] Phase 3 본격 진입 — Event Storming 1인 변형:
  · requirements-phase-1.md §3 FR 40+ 건 → 시간순 이벤트 재배열
  · Aggregate 후보 식별
  · BC 경계 도출
  · Ubiquitous Language 사전 시작 (강호 용어)
  · Aggregate 행위 카탈로그 (명령 + 이벤트 + 불변식)

[4단계] 산출물:
  · docs/readme/planning/domain-phase-1.md (vision.md §5.1.3 표 정합)

원칙 (반드시 준수):
  · vision.md §5.1 헌법 비협상 — 행위 → 도메인 (역방향 금지)
  · DB / 화면 → 도메인 도출 = 금지
  · prototype entities 7종 = Bottom-Up 검증 재료 only (결정 권한 X)
  · 모호함 = 명시적 deferred 로 박기 (휘발 방지)
  · 티키타카 우선 (옵션 다지선다 X, 자유 대화 후 결정 흡수)
  · agent-game-master 사용자 직영 트랙 — 협업자 임의 변경 X
```

## 참고

- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 본 사이클 헌장: [`vision.md`](../planning/vision.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
