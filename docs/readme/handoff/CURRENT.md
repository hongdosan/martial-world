# Handoff — 2026-05-10 — 기획 사이클 Phase 1·2 closure (vision + requirements)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 *fact* 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 기획 사이클 Phase 1·2 (비전 / 요구사항) closure ✅** / Phase 3 (DDD Strategic) ⏳ 대기
>
> **2026-05-16 점검 사이클 추가**: 결정 #13/14/15 흡수 + vision.md §3.3 narrative 신규 + 병행 트랙 메모 (`.private-config` = 천기망 + 히리즈 공유 저장소 — 천기망 측 작업 0)
>
> **선행 사이클 history**: `git log -p docs/readme/handoff/CURRENT.md` (본문) + [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력 (인덱스). *dated 파일 정책 폐기 — 2026-05-16~*

## Summary

천기망 기획 사이클 진입 후 **Phase 1 (비전 / 정체성) + Phase 2 (요구사항 명세) closure**. 사용자 티키타카 대화로 *"플랫폼 / 단일 게임 / 데이터 사전"* 가설 모두 폐기 → **"콘텐츠 IP 확장 패턴"** 정체성 확립 (4 Phase 로드맵 흡수). vision.md §5.1 *천기망 DDD 적용 정의* (3단계 헌법 — 요구사항 → 행위 중심 → 도메인) SSOT 화. requirements-phase-1.md = MVP 행위 ~40건 명세.

**2026-05-16 점검 추가 결정 3건 (vision.md 갱신 흡수)**:
- 결정 #13 모바일 앱스토어 등록 = 확정 (Google Play 우선 / Apple 후속) / 시점·기술만 deferred
- 결정 #14 점수/진행도 공유 = Phase 2 부터 / 프로필 노출 우선 / 1차 메트릭 = 도달 최고 경지
- 결정 #15 BC 가설 5 → 6 (Ranking BC Supporting 추가)

추가로 vision.md §3.3 *Phase 1·2 사용자 흐름* narrative 신규 — *읽기만 해도 흐름이 그려지게*. 다음 진화 트리거 = **Phase 3 도메인 모델링 (DDD Strategic Design)**.

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
| 13 | 2026-05-16 | **모바일 앱스토어 등록 = 확정 진행 (시점·기술만 deferred)** | 사용자 명시 — *"모바일의 경우 추후 앱 스토어 다운로드도 진행되어야 함"*. 권장안 채택 — **Google Play 우선** (TWA / PWABuilder = PWA 그대로 등록, 래퍼 코드 0) / **Apple App Store 후속** (Capacitor 등 별도 래퍼 필요 — Phase 2 검증 + iOS Web Push 제약 도달 시 트리거). 도입 자체는 확정, 기술 선택만 §6 deferred |
| 14 | 2026-05-16 | **점수/진행도 공유 = Phase 2 부터 활성** | 사용자 명시 — *"각 플레이어들의 점수 혹은 어디까지 갔는지에 대한 랭킹 지표는 서로 볼 수 있었으면"*. 권장안 채택 — **Phase 2 부터** (Phase 1 사전은 점수 의미 약함) / **프로필 노출 우선 + 랭킹 보드 후속** / **1차 메트릭 = 도달 최고 경지** (IP 정합도 가장 높음 — "검도 5단"). 추가 메트릭 (학습 무공 / 기연 / 플레이 시간) = §6 deferred. 싱글 플레이 원칙 (§4.2) 과 충돌 X — 점수만 read, 세계 상태 동기화 X |
| 15 | 2026-05-16 | **BC 가설 5개 → 6개 (Ranking BC 추가)** | 결정 #14 의 도메인 시사점 — Phase 2 점수/진행도 영역이 별도 BC 후보. **Ranking BC (Supporting Subdomain)** — User Aggregate 와 별개 / Phase 2 진입 시 정식화. Phase 3 도메인 사이클에서 5개 BC 와 함께 검증 대상 |

## 산출물

### 신규 파일

| 파일 | 분량 | 위치 |
|---|---|---|
| `docs/readme/planning/vision.md` | ~310 줄 (8 § + 5 회 갱신 — §3.3 신규 + 결정 #13/14/15 흡수) | 메인 |
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
- §3.3 Phase 1·2 사용자 흐름 (narrative) — 신규
- §4.1 데이터 모델 (베이스 / 커스텀 / 온라인 점수·진행도 / 커뮤니티) + §4.1.1 편집 모델 + §4.1.2 수동 공유 + §4.1.3 Phase 1·2 단방향 의존 + §4.1.4 BC 가설 6개 (Phase 1: BaseWorldview / CustomWorldview / User / Community / Feedback + Phase 2: Ranking)
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
| **Phase 1·2 BC / UL / Aggregate 식별** | **Phase 3 도메인 사이클** ← 다음 진화 트리거 | DDD Strategic 본격. 가설 6개 검증 (Phase 1 BC 5 + Phase 2 Ranking) |
| **공유 파일 형식 확정** | Phase 1 진입 시 또는 후속 | JSON 우선 권장. MD / CSV / SQL 후속 |
| **인증 방식 / 운영자 권한 분리** | Phase 1 진입 시 | 이메일 / OAuth / Magic Link / JWT — Phase 1 plan 단계 |
| **외부 IP 랭킹 진입 메커니즘** | Phase 3 (4 Phase) 진입 시 | 운영자 큐레이션 / 사용자 제출 → 승인 / 위키 |
| **Local LLM 추론 엔진 / 모델** | Phase 2 (4 Phase) 진입 시 | Ollama / vLLM / llama.cpp + 강호 IP 파인튜닝 |
| **GPU 서버 인프라** | Phase 2 (4 Phase) 진입 시 | 비용·동시성·배포 |
| **모바일 정식 앱** | Phase 2 (4 Phase) 검증 후 | Capacitor / RN / Flutter |
| **2D RPG 게임 엔진** | Phase 4 (4 Phase) 진입 시 | Phaser / Pixi / Godot HTML5 |
| **외부 IP 저작권 검토** | Phase 3 (4 Phase) 진입 전 | 법적 검토 별도 |

> ⚠️ 4 Phase ≠ 기획 사이클 Phase. *4 Phase* = 프로젝트 전체 (사전/RPG/랭킹/2D). *기획 사이클 Phase 1-5* = 비전/요구/도메인/행위/화면. 본 핸드오프 closure = *기획 사이클 Phase 1-2 완료*.

## 병행 트랙 — `H-eries` 프로젝트 `.private-config` 공유 (2026-05-16 사실 메모)

> 본 트랙은 *천기망 기획 사이클과 무관* — **천기망 측 추가 작업 없음**. 사용자의 별도 프로젝트 *H-eries* (한글 발음 "히리즈") 가 천기망의 `.private-config` 서브모듈 (`martial-arts-config`) 을 *함께 사용* 하고 있다는 *사실 메모*.

### 현재 상태 (사용자 명시)

- **GitHub `martial-arts-config/heries/` 폴더는 H-eries 측에서 진행 중** — 천기망 측 작업 0
- **격리 보장됨** — H-eries 측은 *`heries/` 폴더만 생성* (자체 README 포함). 천기망 영역 (`claude/` / `shared/` 등) 무변경
- 폴더 URL: `https://github.com/hongdosan/martial-arts-config/tree/main/heries`

```
.private-config/  (martial-arts-config — 단일 저장소, 천기망+H-eries 공유)
├── claude/                  ← 천기망 (H-eries 측 무변경)
├── shared/                  ← 천기망 (H-eries 측 무변경)
├── frontend/                ← 천기망
├── backend/                 ← 천기망
└── heries/                  ← H-eries 측 자체 관리 (천기망 측 무관, 자체 README)
```

### 천기망 측 알아둘 점

- *`heries/`* 디렉토리는 **무시 + 건드리지 않음** — 천기망 SSOT (`be_reference_prompt.md` / `vision.md` / 에이전트 정의) 가 *`heries/`* 를 참조하면 결합 발생 → 금지
- **의존 방향 = 상호 참조 X** — 호스팅 공유만, 도메인 결합 금지
- `.private-config` 가 *단일 GitHub 저장소* 라는 점 변동 X (서브모듈 포인터 갱신 패턴 그대로)

### 사전 방어 조치 ✅ (2026-05-16 적용 — *지금 문제 발생 전 미리 처리*)

| 영역 | 조치 | 위치 |
|---|---|---|
| **LLM 컨텍스트 오염 방지** | Serena `ignored_paths` 에 `.private-config/heries` + `Heries` (대소문자 안전 마진) 추가 — Serena MCP 가 `heries/` 를 인덱싱하지 않음 | `.serena/project.yml` |
| **작업 절차 — `pull` 먼저** | 천기망 + H-eries 두 작업자가 같은 저장소에 push 하므로 `.private-config` 진입 시 `git pull` 권장 | `docs/readme/private-config.md §1.2` |
| **천기망 외 영역 명시 (천기망 측)** | 저장소 구조 표 + §1.1 격리 원칙 표 (디렉토리 / 작업 주체 / 상호 참조 / LLM 인덱싱) | `docs/readme/private-config.md §1·§1.1` |
| **공유 저장소 README 갱신 (서브모듈 측)** | `.private-config/README.md` — 첫 단락 *공유 저장소* 톤 / 디렉토리 구조에 `heries/` 추가 / 디렉토리 용도 표 *소유자* 컬럼 + `heries/` 행 / §격리 원칙 표 / §개발 워크플로우 pull-first / §주의사항 *상대 영역 무관* / §관련 문서 분리 | `.private-config/README.md` |

## Traps to Avoid

- **vision.md §5.1 헌법 (행위 → 도메인) 위반 금지** — Phase 3 진입 시 *DB 스키마 → 도메인 도출* / *화면 → 도메인 도출* 금지. 행위가 먼저
- **BC 가설 6개 = *최종* 으로 가정 X** — 합침 / 분리 / 추가 가능. 가설 검증이 Phase 3 핵심 작업. Ranking BC 는 Phase 2 진입 시 정식화 (Phase 1 명세에는 미포함)
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

- `vision.md §4.1.4` — Phase 1·2 BC 가설 6개 (검증 대상) — Phase 1 BC 5 + Ranking (Phase 2)
- `vision.md §3.3` — Phase 1·2 사용자 흐름 narrative (Event Storming 입력 보조 자료)
- `vision.md §5.1` — DDD 적용 정의 (3단계 헌법)
- `vision.md §5.0` — DDD 용어 풀이 (11개)
- `requirements-phase-1.md §3` — FR 7 영역 40+ 건 (행위 → BC 도출 입력)
- `requirements-phase-1.md §6` — 영역 ↔ BC 가설 매핑

### Prototype 코드 (Bottom-Up 검증 재료 only — *결정 권한 X*)

- `frontend/src/entities/{character,level,art,faction,fortune,misc,title}/` — 7종
- `frontend/src/pages/codex/` — 메인 페이지 (511 LOC)
- `frontend/src/features/{codex-export,defaults-restore,entry-edit,entry-filter,entry-reorder}/`

### 선행 사이클 history

> 2026-05-16~ *롤링 단일 파일 정책* 으로 dated 파일 폐기. 직전 사이클 본문은 `git log -p docs/readme/handoff/CURRENT.md` / 사이클 인덱스는 [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력.

## 다음 세션 진입 절차 — Phase 3 도메인 모델링 (DDD Strategic Design)

### 검증 단계

1. **vision.md §4.1.4 BC 가설 6개** 를 직접 Read 도구로 읽고 *현 시점에서도 합리적인지* 사용자와 재확인 (Phase 1: BaseWorldview / CustomWorldview / User / Community / Feedback + Phase 2: Ranking)
2. **requirements-phase-1.md §3 FR 7 영역 40+ 건** 을 직접 Read 도구로 읽고 *Phase 3 입력 으로 사용*
3. **vibe-coding-flow §4 정책 사전 검토** — 새 plan 디렉토리 생성 시 임계값 (3개) 도달

### Phase 3 본격 진입 절차 (DDD Strategic Design)

> vision.md §5.1 헌법 (행위 → 도메인) 비협상 준수.

1. **Event Storming 1인 변형** — requirements-phase-1.md §3 FR 40+ 건을 *시간순 이벤트* 로 재배열 (`사용자 → 행위 (DomainEvent)` 형태)
2. **Aggregate 후보 식별** — 이벤트 묶음 → Aggregate 경계 도출
3. **Bounded Context 식별** — Aggregate 묶음 → BC 경계. *vision.md §4.1.4 가설 6개와 비교 검증* (합침 / 분리 / 추가). 단 Phase 1 명세 범위는 BC 5개 검증만 — Ranking BC 는 Phase 2 진입 시 별도
4. **Ubiquitous Language 사전 작성** — 강호 용어 (경지 / 심법 / 문파 / 기연 / 칭호 / ...) 정의 + 동의어 금지
5. **Aggregate 행위 카탈로그** — 각 Aggregate 의 *명령 (Command)* + *이벤트 (Event)* + *불변식 (Invariant)*
6. **Subdomain 분류** — Core / Supporting / Generic (vision.md §5.3 가설 검증)
7. **산출물**: `docs/readme/planning/domain-phase-1.md` (vision.md §5.1.3 표 정합)

### Deferred 결정 (Phase 3 안에서 또는 후속)

- 인증 방식 (이메일 / OAuth / JWT) — Phase 1 plan 단계
- 공유 파일 형식 (JSON 우선 권장)
- BC 가설 6개 vs 실제 도출 BC 의 차이 — 합침 / 분리 결정

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

[2단계] BC 가설 6개 사용자 재확인:
  · Phase 1: BaseWorldview / CustomWorldview / User / Community / Feedback
  · Phase 2: Ranking (Supporting Subdomain — Phase 2 진입 시 정식화)
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

병행 트랙 (Phase 3 와 무관 — 천기망 측 작업 없음, 알아두기만):
  · `.private-config/` 는 천기망 + 히리즈 (Heries) 공유 저장소 (martial-arts-config 단일 GitHub repo)
  · 히리즈는 `.private-config/히리즈/` 폴더만 자체 관리 — 천기망 영역 무변경
  · 천기망 SSOT 가 히리즈/ 를 *참조 금지* (도메인 결합 X / 호스팅만 공유)
  · 상세: CURRENT.md §"병행 트랙"
```

## 참고

- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 본 사이클 헌장: [`vision.md`](../planning/vision.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
