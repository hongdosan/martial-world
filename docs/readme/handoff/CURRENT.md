# Handoff — 2026-05-17 — 2026-05-16/17 점검 라운드 closure (도메인 점검 + 히리즈 격리)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 *fact* 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 기획 사이클 Phase 1·2 closure ✅ + 2026-05-16/17 점검 라운드 closure ✅** / Phase 3 (DDD Strategic) ⏳ 대기
>
> **선행 사이클 history**: `git log -p docs/readme/handoff/CURRENT.md` (본문) + [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력 (인덱스). *dated 파일 정책 폐기 — 2026-05-16~*

## Summary

Phase 1·2 closure (2026-05-10) 직후 사용자 점검 요청 + 히리즈 발의 흡수. **2 사이클 / 4 commits** 누적 후 closure.

**(1) 도메인 점검 사이클** — `vision.md §3.3` *Phase 1·2 사용자 흐름* narrative 신규 + 결정 3건 흡수:
- **#13** 모바일 앱스토어 등록 = 확정 (Google Play 우선 TWA / Apple 후속 Capacitor)
- **#14** 점수/진행도 공유 = Phase 2 부터 (프로필 노출 우선 → 랭킹 보드 후속 / 1차 메트릭 = 도달 최고 경지)
- **#15** BC 가설 5→6 (Ranking BC Supporting 추가, Phase 2 진입 시 정식화)

**(2) 히리즈 격리 사이클** — `.private-config` 가 천기망 + **H-eries** (`heries/` 폴더) 공유 저장소라는 사실 확인 후:
- 사전 방어 4건 — Serena LLM 격리 / `.private-config` pull-first / 천기망 측 §1.1 격리 원칙 / 서브모듈 README 7건 개선
- 폴더명 정확 표기 `heries` (소문자) 통일 — GitHub URL 단서 확정
- 저장소 이름 `martial-arts-config` 그대로 유지 (서브모듈 URL/SHA 안정성)

다음 진화 트리거 = **Phase 3 도메인 모델링 (DDD Strategic Design)** — 변동 없음. BC 가설 6개 + §3.3 narrative 가 Event Storming 입력으로 보강됨.

## Key Decisions (2026-05-16/17 신규 — #13~#18)

> ※ 과거 #1~#12 (Phase 1·2 closure 핸드오프) 은 `git log -p docs/readme/handoff/CURRENT.md` 위임.

| # | 일자 | 결정 | 근거 |
|---|------|------|------|
| 13 | 2026-05-16 | **모바일 앱스토어 등록 = 확정 (시점·기술만 deferred)** | 사용자 명시 — *"앱스토어 다운로드도 진행되어야 함"*. Google Play 우선 (TWA / PWABuilder = 래퍼 코드 0) / Apple 후속 (Capacitor — Phase 2 검증 + iOS Web Push 제약 도달 시) |
| 14 | 2026-05-16 | **점수/진행도 공유 = Phase 2 부터** | 사용자 명시 — *"플레이어 점수/어디까지 갔는지 랭킹 지표는 서로 볼 수 있게"*. Phase 1 사전은 점수 의미 약함. 프로필 노출 우선 + 랭킹 보드 후속. 1차 메트릭 = 도달 최고 경지 (IP 정합도 최고). 싱글 플레이 §4.2 충돌 X — *점수 read* 만, *세계 상태 동기화* X |
| 15 | 2026-05-16 | **BC 가설 5→6 (Ranking BC Supporting 추가)** | 결정 #14 의 도메인 시사점 — Phase 2 점수/진행도 별도 BC 후보. Phase 2 진입 시 정식화. Phase 3 도메인 사이클에서 6개 가설 검증 (Phase 1 명세 범위는 BC 5개) |
| 16 | 2026-05-16 | **미래 처리보다 지금 사전 방지** *(feedback memory 영구 저장)* | 사용자 명시 — *"미래에 생길 때 처리하는 것보다 지금 미리 방지를 하는게 맞다"*. 1회성 사전 박음 = 영구 방어. 비용 작고 효과 명확하면 *deferred* 하지 말 것 |
| 17 | 2026-05-16 | **히리즈 격리 = 사전 방어 4건** | 결정 #16 적용 — `.private-config` 공유 사실 확인 후: (a) Serena `ignored_paths` (b) `.private-config` 작업 시 `git pull` 먼저 (c) 천기망 측 `private-config.md §1.1` 격리 원칙 (d) 서브모듈 `.private-config/README.md` *공유 저장소* 톤 |
| 18 | 2026-05-17 | **공유 저장소 (`.private-config`) README 개선 7건 + 저장소 이름 유지** | 사용자 발의 + URL 단서로 폴더명 `heries` 확정. 첫 단락 톤 / 디렉토리 구조 `heries/` / 소유자 컬럼 / §격리 원칙 표 / §개발 워크플로우 pull-first / §주의사항 상대 영역 무관 / §관련 문서 분리. 저장소 이름 = 그대로 (서브모듈 URL/SHA 안정성) |

## 산출물

### Commits 본 라운드 (4건)

```
# 메인 (martial-arts develop)
8cc4b11  docs: heries 정확 표기 정정 + 공유 저장소 README 동반 갱신
69f2824  docs: 도메인 점검 + 히리즈 사전 방어 (2026-05-16 점검 라운드)

# 서브모듈 (.private-config main)
78fd23e  docs: README 공유 저장소 톤 개선 + heries 폴더 명시 (천기망 ↔ H-eries 격리)
b28c17c  docs: CLAUDE.md 변경 이력 2행 — 2026-05-16 점검 라운드
```

### 신규 / 갱신 파일

| 파일 | 변경 |
|---|---|
| `docs/readme/planning/vision.md` | ~310줄 — §3.3 신규 + §4.1·§4.1.4·§4.2·§4.4·§6·§8 갱신 |
| `docs/readme/private-config.md` | §1·§1.1·§1.2 신규 + 목차 2행 (천기망 측 협업 가이드) |
| `docs/readme/handoff/CURRENT.md` | 본 핸드오프 (롤링 덮어쓰기) |
| `docs/readme/harness/harness-state.md` | 변경 이력 3행 (도메인 점검 / 히리즈 사전 방어 / README 개선) |
| `.private-config/README.md` | 7건 개선 (첫 단락 / 디렉토리 구조 / 용도 표 / 격리 원칙 / 워크플로우 / 주의사항 / 관련 문서) |
| `.private-config/martial-world/claude/CLAUDE.md` | 변경 이력 3행 |
| `.serena/project.yml` | `ignored_paths` 신규 (`.private-config/heries` + `Heries`) |

### 메모리 (영구 — 사용자 행동 원칙)

- `~/.claude/projects/.../memory/feedback_preventive_over_reactive.md` — 미래 처리보다 지금 사전 방지

## 결정된 핵심 영역

### vision.md (헌장 — 모든 후속 사이클의 상위 SSOT)

- **§3.3 Phase 1·2 사용자 흐름 (신규)** — Visitor / 사용자 / 운영자 시나리오 + ASCII 흐름도 + Phase 1→2 데이터 흐름 + 한눈 요약 표
- §4.1 데이터 모델 — 베이스 / 커스텀 / **온라인 점수·진행도 (Phase 2·3·4 확장)** / 커뮤니티
- §4.1.4 **BC 가설 6개**:
  - Phase 1: BaseWorldview (Core) / CustomWorldview (Core) / User (Generic) / Community / Feedback
  - Phase 2: **Ranking (Supporting)** ← Phase 2 진입 시 정식화
- §4.2 싱글 플레이 + **점수/진행도 공유 정책** (프로필 노출 우선 / 1차 메트릭 = 도달 경지)
- §4.4 모바일 = PWA 출발 + **앱스토어 등록 확정** (Google Play 우선 / Apple 후속)
- §5.0 DDD 용어 풀이 (11개)
- §5.1 천기망 DDD 적용 정의 (3단계 헌법 — 비협상)
- §6 Deferred 12건

### requirements-phase-1.md (Phase 2 산출물 — Phase 3 도메인 모델링 직접 입력)

(변동 없음 — Phase 1 한정 명세. 점수/랭킹은 Phase 2 영역이라 본 라운드에서 변경 X)

- §3 FR 7영역 40+ 건 (베이스 조회 / 인증 / 커스텀 편집 / 내보내기·가져오기 / 의견 / 커뮤니티 / 운영자 관리)
- §4 NFR 9건
- §6 영역 ↔ Phase 1 BC 가설 5개 매핑

### 히리즈 격리 (병행 트랙 — 사전 방어 ✅ 완료)

```
.private-config/  (martial-arts-config — 단일 저장소, 천기망+H-eries 공유)
├── claude/      ← 천기망 (H-eries 측 무변경)
├── shared/      ← 천기망 (H-eries 측 무변경)
├── frontend/    ← 천기망
├── backend/     ← 천기망
└── heries/      ← H-eries 자체 관리 (천기망 측 무관, 자체 README)
```

- 천기망 측 작업 0 / 격리 4건 적용 완료
- 폴더 URL: `https://github.com/hongdosan/martial-arts-config/tree/main/heries`

## Phase 3 진입 절차 (DDD Strategic Design)

> vision.md §5.1 헌법 (행위 → 도메인) 비협상 준수.

### 검증 단계

1. **vision.md §3.3 narrative + §4.1.4 BC 가설 6개** 직접 Read → 사용자 재확인
2. **requirements-phase-1.md §3 FR 40+ 건** 직접 Read → Phase 3 입력
3. **vibe-coding-flow §4 정책 사전 검토** — 새 plan 디렉토리 생성 시 임계값 (3개)

### Phase 3 본격 진입

1. **Event Storming 1인 변형** — FR 40+ 건을 시간순 이벤트로 재배열 (`사용자 → 행위 (DomainEvent)` 형태). §3.3 narrative = 흐름 검증 자료
2. **Aggregate 후보 식별** — 이벤트 묶음 → Aggregate 경계
3. **Bounded Context 식별** — Aggregate 묶음 → BC 경계. §4.1.4 가설 6개와 비교 검증 (합침 / 분리 / 추가). Phase 1 명세 범위 = BC 5개만 / Ranking 은 Phase 2 별도
4. **Ubiquitous Language 사전 작성** — 강호 용어 (경지 / 심법 / 문파 / 기연 / 칭호 / ...) 정의 + 동의어 금지
5. **Aggregate 행위 카탈로그** — 명령 (Command) + 이벤트 (Event) + 불변식 (Invariant)
6. **Subdomain 분류** — Core / Supporting / Generic (vision.md §5.3 가설 검증)
7. **산출물**: `docs/readme/planning/domain-phase-1.md` (vision.md §5.1.3 표 정합)

## 미결정 / Deferred (vision.md §6 인용)

| 영역 | 결정 시점 | 비고 |
|---|---|---|
| **Phase 1·2 BC / UL / Aggregate 식별** | **Phase 3 ← 다음 진화 트리거** | DDD Strategic 본격. 가설 6개 검증 |
| 공유 파일 형식 확정 | Phase 1 진입 시 | JSON 우선 권장 |
| 인증 방식 / 운영자 권한 분리 | Phase 1 plan 단계 | 이메일 / OAuth / JWT |
| 외부 IP 랭킹 진입 메커니즘 | Phase 3 (4 Phase) | 큐레이션 / 사용자 제출 |
| Local LLM 추론 엔진 / 모델 | Phase 2 (4 Phase) | Ollama / vLLM / llama.cpp |
| GPU 서버 인프라 | Phase 2 (4 Phase) | 비용·동시성·배포 |
| **모바일 정식 앱 *기술 선택*** *(도입 확정)* | Phase 2 검증 후 | Google Play TWA / Apple Capacitor / RN / Flutter |
| 2D RPG 게임 엔진 | Phase 4 (4 Phase) | Phaser / Pixi / Godot HTML5 |
| 외부 IP 저작권 검토 | Phase 3 (4 Phase) 전 | 법적 검토 |
| **Phase 2 점수 메트릭 추가** | Phase 2 진입 시 | 학습 무공 / 기연 / 플레이 시간 |
| **랭킹 보드 인프라** | Phase 2 검증 후 | 정렬·필터·페이지네이션 |
| **H-eries 영어 표기 변형** | GitHub repo 확정 시 | 현재 `heries` (정확) + `Heries` (안전 마진) ignore |

> ⚠️ 4 Phase ≠ 기획 사이클 Phase. *4 Phase* = 프로젝트 전체 (사전/RPG/랭킹/2D). *기획 사이클 Phase 1-5* = 비전/요구/도메인/행위/화면.

## Traps to Avoid

- **vision.md §5.1 헌법 위반 금지** — Phase 3 진입 시 *DB → 도메인* / *화면 → 도메인* 금지. 행위가 먼저
- **BC 가설 6개 = *최종* 으로 가정 X** — 합침 / 분리 / 추가 가능. Ranking 은 Phase 2 진입 시 정식화 (Phase 1 명세는 BC 5개)
- **prototype entities 7종 (character/level/art/faction/fortune/misc/title) 을 *최종 도메인* 으로 가정 X** — *Bottom-Up 검증 재료* only
- **User BC + CustomWorldview BC 분리 유지** — Generic ≠ Core
- **싱글 플레이 / 수동 공유 흔들기 금지** — 단 *점수/진행도 read* 는 예외 허용 (§4.2 명시)
- **MVP 범위 확장 금지** — 댓글 / 좋아요 / 의견 워크플로우 / 가져오기 병합 = Phase 1 비범위
- **SSOT 갱신 사이클 선행** — vision.md / requirements 와 반대 결정 시도 시 그냥 코드 X
- **"잘 모르겠다" 답변 = 정상** — 명시적 deferred 로 박기
- **`.private-config/heries/` 무관** — 천기망 SSOT (BE/FE reference / 에이전트 정의) 가 참조하면 *도메인 결합* 발생

## vibe-coding-flow §4 정책 사전 검토

| 대상 | 현재 | 임계값 | 새 세션 진입 시 |
|---|---|---|---|
| `harness-state.md` 변경 이력 | ~28행 | X=30 | ❌ 미트리거 |
| `vision.md §8` | 6행 | X=30 | ❌ 미트리거 |
| `requirements-phase-1.md §8` | 1행 | X=30 | ❌ 미트리거 |
| `CLAUDE.md` 변경 이력 | ~20행 | X=30 | ❌ 미트리거 |
| `plan/<topic>/` | 2개 (`fe-stack-closure` / `fe-vite-migration`) | M=3 | ❌ 미트리거 (새 plan 생성 시 임계값) |
| `custom/<topic>/` | 0개 | M=3 | ❌ 미트리거 |

→ 새 세션 진입 시 *별도 정리 X*. Phase 3 진입하면서 새 plan 디렉토리 (`planning-phase-3-domain/` 권장) 생성 시 3개 → 임계값 도달.

## Working Agreements (선행 핸드오프 상속 + 본 라운드 신규 2건)

- 명시적 지시는 **우회 없이 직접 실행**
- 외부 글은 **원본 URL 만** (verbatim 사본 금지)
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정** 순차 진행
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 *제안 커밋 메시지 초안*
- **Synchronous Update** — SSOT 변경 시 영향 받는 참조처 동기화
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 단일 출처
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지
- **`agent-game-master` 사용자 직영 트랙**
- **DDD 도메인 중심** — vision.md §5.1 헌법 비협상
- **행위 명세 = 정말 중요** — Aggregate 행위 카탈로그 + BDD `Given/When/Then`
- **Ubiquitous Language 강제** — 강호 용어 통일 (기획/화면/코드/DB)
- **Phase 5 화면 = Claude 디자인 적극 활용**
- **티키타카 대화 우선** — 옵션 다지선다 X
- **모호함은 명시적 deferred 로 박기**
- **🆕 미래 처리보다 지금 사전 방지** (2026-05-16) — 잠재 리스크는 deferred 하지 말고 비용 작으면 사전 박기 (LLM ignore / 작업 절차 / 영역 명시 등)
- **🆕 `.private-config` 작업 시 `git pull` 먼저** (2026-05-16) — 천기망 + H-eries 두 작업자 공유 저장소

## Relevant Files

### 단일 출처 (SSOT)

- [`vision.md`](../planning/vision.md) — **헌장**. 모든 후속 사이클 (Phase 3-5 / 4 Phase 구현) 의 상위 SSOT
- [`requirements-phase-1.md`](../planning/requirements-phase-1.md) — Phase 2 산출물. Phase 3 도메인 모델링 직접 입력
- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT (Phase 6-13 완료)
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§1 모두 ✅, Storybook ⏳)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT
- [`private-config.md`](../private-config.md) — 서브모듈 운영 가이드 (천기망 측 §1.1 격리 원칙 / §1.2 pull-first)
- [`.private-config/README.md`](../../../.private-config/README.md) *(submodule)* — 공유 저장소 안내 (천기망 + H-eries §격리 원칙)

### Phase 3 도메인 모델링 입력

- `vision.md §3.3` — Phase 1·2 사용자 흐름 narrative (Event Storming 입력 보조 자료)
- `vision.md §4.1.4` — BC 가설 6개 (검증 대상)
- `vision.md §5.1` — DDD 적용 정의 (3단계 헌법)
- `vision.md §5.0` — DDD 용어 풀이 (11개)
- `requirements-phase-1.md §3` — FR 7영역 40+ 건 (행위 → BC 도출 입력)
- `requirements-phase-1.md §6` — 영역 ↔ BC 가설 매핑

### Prototype 코드 (Bottom-Up 검증 재료 only — *결정 권한 X*)

- `frontend/src/entities/{character,level,art,faction,fortune,misc,title}/` — 7종
- `frontend/src/pages/codex/` — 메인 페이지 (511 LOC)
- `frontend/src/features/{codex-export,defaults-restore,entry-edit,entry-filter,entry-reorder}/`

### 선행 사이클 history

> 2026-05-16~ *롤링 단일 파일 정책*. 직전 사이클 본문 = `git log -p docs/readme/handoff/CURRENT.md` / 사이클 인덱스 = [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력.

## Prompt for New Chat

```
천기망 기획 사이클 — Phase 3 도메인 모델링 (DDD Strategic Design) 을 시작한다.

먼저 다음 파일을 Read 도구로 읽고 본 핸드오프의 주장을 검증해:

1. docs/readme/handoff/CURRENT.md (본 핸드오프 — SSOT)
2. docs/readme/planning/vision.md (헌장 — §3.3 narrative / §4.1.4 BC 가설 6개 / §5.0 용어 / §5.1 헌법 / §5.3 매핑)
3. docs/readme/planning/requirements-phase-1.md (Phase 3 입력 — §3 FR 7영역 / §6 BC 매핑)
4. docs/readme/harness/harness-state.md (변경 이력 단일 출처)
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
  · vision.md §3.3 narrative 시나리오 = 흐름 검증 자료
  · Aggregate 후보 식별 → BC 경계 도출
  · Ubiquitous Language 사전 시작 (강호 용어)
  · Aggregate 행위 카탈로그 (명령 + 이벤트 + 불변식)

[4단계] 산출물:
  · docs/readme/planning/domain-phase-1.md (vision.md §5.1.3 표 정합)

원칙 (반드시 준수):
  · vision.md §5.1 헌법 비협상 — 행위 → 도메인 (역방향 금지)
  · DB / 화면 → 도메인 도출 = 금지
  · prototype entities 7종 = Bottom-Up 검증 재료 only (결정 권한 X)
  · 모호함 = 명시적 deferred 로 박기 (휘발 방지)
  · 티키타카 우선 (옵션 다지선다 X)
  · agent-game-master 사용자 직영 트랙
  · 미래 처리보다 지금 사전 방지 — 잠재 리스크 deferred 금지 (비용 작으면 사전 박기)
  · .private-config/heries/ 무관 — 천기망 SSOT 참조 금지 (H-eries 영역)
  · .private-config 작업 시 git pull 먼저 (두 작업자 공유 저장소)

병행 트랙 (Phase 3 와 무관 — 자동 처리됨):
  · .private-config = 천기망 + H-eries 공유 저장소 (heries/ 폴더 = H-eries 자체 관리)
  · 격리 사전 방어 완료 (Serena ignored_paths / pull-first / 천기망 측 §1.1 / 서브모듈 README)
  · 천기망 측 작업 0
```

## 참고

- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 본 사이클 헌장: [`vision.md`](../planning/vision.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- 공유 저장소 안내: `.private-config/README.md` *(submodule)*
