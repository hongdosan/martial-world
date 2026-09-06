# Handoff — 2026-09-06 — 네임스페이스 마이그레이션 closure + 우산 저장소 submodule 편입

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 *fact* 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 네임스페이스 마이그레이션 완전 closure ✅ + 우산 저장소 (`hongdosan/martial-arts`) submodule 편입 ✅** / Phase 3 (DDD Strategic) ⏳ 대기 (변동 없음)
>
> **⚠️ 워킹 카피 위치 변경** — 새 권장 경로 = `~/hongdosan-workspace/martial-arts/martial-world/` (우산 저장소 하위 submodule). 이전 위치 `~/IdeaProjects/martial-world/` 는 *stale* — 사용자 판단으로 삭제 또는 유지 (동일 저장소 duplicate clone).
>
> **선행 사이클 history**: `git log -p docs/readme/handoff/CURRENT.md` (본문) + [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력 (인덱스). *dated 파일 정책 폐기 — 2026-05-16~*

## Summary

`hongdosan/martial-arts` → `hongdosan/martial-world` GitHub 리네임 후속 정합화 **3 세션 총괄 closure**. 어제 (09-05) §Deferred 5건 오늘 순차 실행 완료. **배포 복구 확인** (https://hongdosan.github.io/martial-world/ 200 OK, asset 경로 `/martial-world/` prefix 정합).

**추가 사이클 (2026-09-06 오후) — 우산 저장소 편입**: `hongdosan/martial-arts` (무협 통합 서비스 우산, Gradle Composite Build) 하위에 `martial-world` 를 git submodule 로 등록 (`a55ad62 @ umbrella main`). Composite Build 등록 (`includeBuild('martial-world')` in `settings.gradle`) 은 `martial-world/backend/` Gradle 셋업 완료 후 별도 사이클 (현재 backend/ 는 도메인 미확정 빈 폴더 → 지금 추가 시 빌드 실패). **martial-world 저장소 자체는 완전 독립 유지** (배포 workflow / git 이력 / release 브랜치 그대로).

기획 사이클 Phase 3 (DDD Strategic Design) 진입 절차는 **변동 없음** — 2026-05-17 closure 상태 그대로 대기.

## Key Decisions (본 마이그레이션 사이클 — 참고)

> 기획 사이클 Key Decisions #1~#18 은 `git log -p docs/readme/handoff/CURRENT.md` 위임 (마이그레이션은 정합화 작업 — 헌장 무관).

| # | 일자 | 결정 | 근거 |
|---|------|------|------|
| M1 | 2026-09-05 | **저장소 이름 `martial-arts-config` 유지** | 서브모듈 URL / SHA / clone 명령 안정성 (결정 #18 재확인). GitHub repo 만 리네임 (`martial-arts` → `martial-world`), 서브모듈 저장소는 그대로 |
| M2 | 2026-09-05 | **`.private-config/martial-arts/README.md` 스텁은 다른 프로젝트 예약** | `hongdosan/martial-arts` (무협 통합 서비스 우산 — martial-life 등) 예약 스텁. 천기망 = `martial-world/`. 우산 스텁은 건드리지 X |
| M3 | 2026-09-05 | **`shared/` 는 `martial-world/` 아래로 이동하지 않고 root 유지** | c11f8e7 이동 scope 준수 (`claude/frontend/backend` 만). `shared/` 는 향후 다른 프로젝트와의 진짜 공용 자료 가능성 여지 |
| M4 | 2026-09-06 | **release 브랜치 fast-forward push = 워크트리 손대지 않고 `git push origin develop:release`** | 로컬 checkout 불필요. release 가 develop 조상 확인 (`git log --left-right origin/release...origin/develop` 좌측 0건) 후 remote-only fast-forward |
| M5 | 2026-09-06 | **우산 저장소 편입 방식 = git submodule (Option B)** | martial-life 는 monorepo 흡수 (Option A) 방식이지만 martial-world 는 이력이 무겁고 배포 workflow (GH Pages release) 도 별개라 submodule 이 더 자연스러움. 독립 저장소 유지 = 배포/이력 완전 보존. destructive 최소 |
| M6 | 2026-09-06 | **`master` 브랜치는 legacy 봉인 유지** | 룰셋 15185865 이 update/creation/deletion 자체 차단 + 15185892 가 github-pages 배포 요구. bypass 불가. 활성 워크플로우 = `develop` (default) + `release` (배포). master 는 사용되지 않음 → 룰셋 삭제 (destructive/영구) 하지 않고 그대로 |
| M7 | 2026-09-06 | ~~Gradle Composite Build 등록은 backend/ Gradle 셋업 후 별도 사이클~~ → **번복 (M8 로 재결정)** | 사용자 재검토 (*"모듈로 안되어 있고 그냥 단순히 폴더로 구성되어 있는 것 같은데"*) 후 결정 재고 |
| M8 | 2026-09-06 | **최소 Gradle 스켈레톤 즉시 셋업 (M7 번복)** — martial-world 에 `settings.gradle` (`rootProject.name = 'martial-world'` + 도메인 미확정 주석) + 우산 `includeBuild('martial-world')` 추가 | 사용자 실제 관찰 (우산 IDE 에서 폴더로 보임) 후 지시 위임 → 스켈레톤 비용 거의 0, subproject 없어도 Composite Build 인식 (`./gradlew projects` 검증: `Included build ':martial-world'`). 도메인 확정 후 `include(':backend', ...)` 만 추가 = 재구조 비용 0 |
| M9 | 2026-09-06 | **`.private-config` 서브 서비스 스텁 root-level 배치 관행 확립** | martial-life 편입 검토 결과 — sub-service (`martial-life`) 도 우산 폴더 (`.private-config/martial-arts/martial-life/`) 하위가 아닌 root-level (`.private-config/martial-life/`) 로 배치. 근거: (1) `martial-world` 도 root-level (2) `heries` 도 root-level (3) 격리 원칙 = 각 서비스가 자체 소유 영역. 앞으로 추가 sub-service (예: martial-legend) 도 root-level 스텁 |

## 산출물

### Commits 본 라운드 (3 세션 총괄)

```
# 이전 세션 (2026-05-16/17 이전, 서브모듈 이동 완료 상태)
c11f8e7 (submodule)  chore: namespace martial-world config under martial-world/ (was repo root)
864661a (main)       chore: bump .private-config submodule to c11f8e7 (martial-world namespace)
99c0f48 (main)       chore: update .private-config path references for martial-world/ namespace migration

# 2026-09-05 (develop)
16fe702  chore: martial-arts → martial-world 네임스페이스 마이그레이션 잔여 정리
503d84d  chore: .serena/project.yml — project_name 갱신 + Serena 스키마 자동 업그레이드
966ea51 (submodule)  chore: martial-world/ 하위 self-reference + ../shared/ 상대경로 정정
d18a865  chore: bump .private-config submodule to 966ea51 (agent self-reference 정정)
e2b7fdc  docs: 네임스페이스 마이그레이션 부분 완료 핸드오프 (CURRENT.md 롤링 + harness-state.md 1행)

# 2026-09-06 오전 (develop)
8a74be7 (submodule)     docs: README.md 네임스페이스 마이그레이션 정합 + CLAUDE.md 변경 이력 1행
3403cd4                 chore: 네임스페이스 마이그레이션 마무리 — vite base + .private-config bump
5ba815b                 docs: 네임스페이스 마이그레이션 완전 closure — CURRENT.md 롤링 + harness-state.md 1행

# 2026-09-06 오후 (umbrella main = hongdosan/martial-arts)
a55ad62 (umbrella)      chore: add martial-world as submodule (multi-module 편입 진입)

# 본 커밋 = 우산 편입 사이클 closure (CURRENT 갱신 + harness-state.md 1행)
```

### 배포 인프라 상태 변경

- GH Pages `build_type`: `legacy` → `workflow` (2026-09-06 `gh api` 로 전환)
- `release` 브랜치: `origin/develop` fast-forward push 로 develop 과 동기화 (bypass protected refs)
- Workflow: `Deploy Vite + React to Pages` 성공 (34006608606 / 39s)
- 배포 URL: https://hongdosan.github.io/martial-world/ (200 OK, HTML asset 경로 `/martial-world/` prefix)

### 워킹 카피 위치 (2026-09-06 오후 변경)

| 경로 | 상태 | 용도 |
|---|---|---|
| `~/hongdosan-workspace/martial-arts/martial-world/` | **✅ 권장** — 우산 저장소 submodule | 앞으로 모든 개발 여기서 |
| `~/IdeaProjects/martial-world/` | ⚠️ *stale duplicate* — 현재 세션 cwd | 사용자 판단으로 삭제 or 유지 (동일 저장소 clone) |

> 두 경로 모두 동일 `hongdosan/martial-world` 저장소 워킹 카피. push/pull 은 어디서 하든 원격 통해 sync. Bash cwd 무효화 방지 위해 현재 세션은 IdeaProjects 위치 유지, 다음 세션은 우산 하위 사용 권장.

### 신규 / 갱신 파일 (본 사이클 총괄)

| 파일 | 변경 |
|---|---|
| 로컬 폴더 | `martial-arts/` → `martial-world/` (Bash cwd 무효화로 세션 교체 트리거) |
| `.idea/vcs.xml` | 원복 (상위 `$PROJECT_DIR$` Git 매핑 복구) |
| `.idea/modules.xml` | `martial-world.iml` 포인터 |
| `martial-world.iml` | rename from `martial-arts.iml` |
| `.gitignore` | `/node_modules` 추가 (root 레벨 재발 방지) |
| `.serena/project.yml` | `project_name: martial-world` + Serena 스키마 자동 업그레이드 |
| `docs/readme/harness/harness-state.md` | stale 경로 1건 + 변경 이력 2행 (09-05 부분 완료 + 09-06 closure) |
| `frontend/.env.example` | `.private-config/martial-world/frontend/` |
| `frontend/vite.config.ts` | base `/martial-arts/` → `/martial-world/` |
| `.private-config` 포인터 | `c11f8e7 → 966ea51 → 8a74be7` (3회 bump) |
| `.private-config/README.md` | 대량 정정 (트리 재구조 / 용도 표 / symlink 표 / 워크플로우 / 관련 문서 URL) |
| `.private-config/martial-world/claude/CLAUDE.md` | self-reference + `../shared/` 상대경로 + 변경 이력 1행 |
| `.private-config/martial-world/claude/claude-agents/*.md` | 5개 파일 self-reference + `../../shared/` |
| `docs/readme/handoff/CURRENT.md` | 본 핸드오프 (롤링 덮어쓰기) |

## Phase 3 진입 절차 (변동 없음 — 2026-05-17 상태 상속)

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

## Traps to Avoid

- **`.private-config/martial-arts/README.md` 스텁 건드리지 X** — 별도 프로젝트 (`hongdosan/martial-arts` 우산) 예약 (M2). *단 2026-09-06 부로 우산 저장소가 실제 활성화되었고 martial-world 를 submodule 로 참조 (M5). 스텁 README 는 여전히 우산 소유 — 우산 저장소 쪽에서 관리*
- **우산 저장소 (`hongdosan/martial-arts`) 는 별도 프로젝트** — martial-world 는 submodule 참조되지만 소유는 우산 소유자. 우산의 `.gitmodules` / `settings.gradle` / `.idea/*` 등 파일은 우산 소유자 결정 (M5)
- **`martial-world/backend/` 하위 도메인 모듈 = Phase 3 도메인 식별 후** — 지금은 스켈레톤 (`settings.gradle` root only, `include` 라인 없음, M8). Phase 3 후 `include(':backend:<domain>:adapter', ...)` 추가
- **`master` 룰셋 삭제 금지** — 봉인된 legacy 브랜치. 룰셋 삭제는 destructive/영구 (M6)
- **`shared/` 를 `martial-world/` 아래로 옮기지 X** — c11f8e7 이동 scope 벗어남 (M3)
- **release 브랜치 force push 금지** — fast-forward push 만 사용 (M4). release 는 항상 develop 조상이어야 함
- **vision.md §5.1 헌법 위반 금지** — Phase 3 진입 시 *DB → 도메인* / *화면 → 도메인* 금지. 행위가 먼저
- **BC 가설 6개 = *최종* 으로 가정 X** — 합침 / 분리 / 추가 가능. Ranking 은 Phase 2 진입 시 정식화 (Phase 1 명세는 BC 5개)
- **prototype entities 7종 = *최종 도메인* 으로 가정 X** — Bottom-Up 검증 재료 only
- **User BC + CustomWorldview BC 분리 유지** — Generic ≠ Core
- **싱글 플레이 / 수동 공유 흔들기 금지** — 단 *점수/진행도 read* 는 예외 허용 (§4.2 명시)
- **MVP 범위 확장 금지** — 댓글 / 좋아요 / 의견 워크플로우 / 가져오기 병합 = Phase 1 비범위
- **SSOT 갱신 사이클 선행** — vision.md / requirements 와 반대 결정 시도 시 그냥 코드 X
- **"잘 모르겠다" 답변 = 정상** — 명시적 deferred 로 박기
- **`.private-config/heries/` 무관** — 천기망 SSOT (BE/FE reference / 에이전트 정의) 가 참조하면 *도메인 결합* 발생
- **`.private-config` 작업 시 `git pull` 먼저** — 두 작업자 공유 저장소

## Working Agreements (선행 상속)

- 명시적 지시는 우회 없이 직접 실행
- 외부 글은 원본 URL 만 (verbatim 사본 금지)
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **제안 → 확인 → 수정** 순차 진행
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 *제안 커밋 메시지 초안*
- **Synchronous Update** — SSOT 변경 시 영향 받는 참조처 동기화
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 단일 출처
- Push 는 **사용자 본인 진행** — Claude 는 commit 까지 (단 서브모듈 push / 배포 trigger 는 태스크 요구에 따라 진행)
- **`agent-game-master` 사용자 직영 트랙**
- **DDD 도메인 중심** — vision.md §5.1 헌법 비협상
- **행위 명세 = 정말 중요** — Aggregate 행위 카탈로그 + BDD `Given/When/Then`
- **Ubiquitous Language 강제** — 강호 용어 통일 (기획/화면/코드/DB)
- **Phase 5 화면 = Claude 디자인 적극 활용**
- **티키타카 대화 우선** — 옵션 다지선다 X
- **모호함은 명시적 deferred 로 박기**
- **미래 처리보다 지금 사전 방지** (2026-05-16) — 잠재 리스크는 deferred 하지 말고 비용 작으면 사전 박기
- **`.private-config` 작업 시 `git pull` 먼저** (2026-05-16) — 천기망 + H-eries 두 작업자 공유 저장소

## Relevant Files

### 단일 출처 (SSOT)

- [`vision.md`](../planning/vision.md) — **헌장**. 모든 후속 사이클 (Phase 3-5 / 4 Phase 구현) 의 상위 SSOT
- [`requirements-phase-1.md`](../planning/requirements-phase-1.md) — Phase 2 산출물. Phase 3 도메인 모델링 직접 입력
- [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)* — BE SSOT (Phase 6-13 완료)
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE SSOT (§1 모두 ✅, Storybook ⏳)
- [`harness-state.md`](../harness/harness-state.md) — 변경 이력 단일 출처
- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT
- [`private-config.md`](../private-config.md) — 서브모듈 운영 가이드 (천기망 측 §1.1 격리 원칙 / §1.2 pull-first)
- [`.private-config/README.md`](../../../.private-config/README.md) *(submodule)* — 공유 저장소 안내 (본 사이클 정정 완료)

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
  · release 브랜치 = fast-forward push 만 (force push 금지)

병행 트랙 (Phase 3 와 무관 — 자동 처리됨):
  · .private-config = 천기망 + H-eries 공유 저장소 (heries/ 폴더 = H-eries 자체 관리)
  · 격리 사전 방어 완료 (Serena ignored_paths / pull-first / 천기망 측 §1.1 / 서브모듈 README)
  · 천기망 측 작업 0
  · 네임스페이스 마이그레이션 완전 closure (2026-09-06 오전) — 배포 정상 (https://hongdosan.github.io/martial-world/ 200 OK)
  · 우산 저장소 (hongdosan/martial-arts) submodule 편입 (2026-09-06 오후) — 95966df @ umbrella main (pointer bump 후)
  · 워킹 카피 권장 경로 = ~/hongdosan-workspace/martial-arts/martial-world/ (우산 하위)
  · Gradle Composite Build 등록 완료 (settings.gradle 스켈레톤 + includeBuild — M8) — ./gradlew projects 에서 Included build ':martial-world' 인식
  · backend/ 하위 도메인 모듈은 Phase 3 도메인 식별 후 include (재구조 비용 0)
  · .private-config/martial-life/ 스텁 편입 완료 (c396cac @ submodule main — 트리 + 용도 표 + 격리 원칙 각주 정합화). 우산 저장소 .private-config pointer bump 는 우산 소유자 결정 영역
  · Sub-service 스텁 배치 관행 = root-level (M9)
```

## 참고

- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 본 사이클 헌장: [`vision.md`](../planning/vision.md) (마이그레이션은 헌장 무관 — 정합화 작업)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- 공유 저장소 안내: `.private-config/README.md` *(submodule — 본 사이클 정정 완료)*
