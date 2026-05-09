# 천기망(天機網) — 비전 / 정체성 / 로드맵

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> 본 문서는 천기망 프로젝트의 **비전·정체성·로드맵 헌장 (charter)** 이다. 모든 후속 사이클 (도메인 설계 / 화면 설계 / 요구사항 / 구현) 은 본 문서를 *상위 SSOT* 로 참조한다.
> 본 문서 자체의 변경은 [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) §3 을 따른다. 변경 시 §8 변경 이력에 기록.
> **선행 핸드오프**: [`2026-05-09-planning-cycle-trigger.md`](../handoff/2026-05-09-planning-cycle-trigger.md)

## 1. 한 문장 비전

> *"나만의 무협 세계관을 만들고, 그 세계관을 **대화형 RPG · 외부 IP 랭킹 · 2D RPG** 세 가지 형태의 콘텐츠로 확장한다. 이 모든 것은 하나의 도메인 언어를 공유한다."*

## 2. 정체성 — "콘텐츠 IP 확장" 패턴

천기망은 **단일 무협 세계관 IP 를 코어 자산** 으로 삼고, 그 IP 를 다중 콘텐츠 형태로 확장하는 구조를 따른다.

| 정체성 가설 | 채택 여부 | 사유 |
|---|---|---|
| 데이터 플랫폼 (CMS / 카탈로그) | ❌ 부분 | 세계관 사전 = 코어 자산이지만 *목적이 아닌 토대* |
| 다중 서비스 플랫폼 (Discord-like) | ❌ | 사용자 비전과 결 다름 (커뮤니티 = 본 사이클 범위 외) |
| 무협 RPG 단일 게임 | ❌ | 4 Phase 콘텐츠 확장이므로 단일 게임 X |
| **콘텐츠 IP 확장 (Disney-like / Pokémon-like 패턴)** | ✅ | 하나의 세계관 → 다중 콘텐츠 형태 (사전·RPG·랭킹·2D RPG). *하나의 도메인 언어 공유* |

> ※ "데이터 플랫폼" 과의 차이: 데이터 플랫폼은 *데이터 자체가 목적*. 천기망은 *데이터가 토대 + 콘텐츠 경험이 목적*.

## 3. 4 Phase 로드맵

| Phase | 이름 | 정의 | 성공 지표 |
|---|---|---|---|
| 1 | **세계관 사전** | 나무위키 → 구조화된 도메인 모델 + 불변식 + 편집 UI | 도메인 불변식이 서버에서 강제됨 |
| 2 | **대화형 RPG** | 세계관 데이터를 컨텍스트로 주입한 LLM 플레이 (셀프 호스팅 LLM) | 캐릭터 생성 → 경지 돌파 E2E 1회 |
| 3 | **외부 IP 랭킹 시스템** (OP.gg 스타일) | 외부 IP 캐릭터의 전적/투표 기반 레이팅 | 작품 1개 · 캐릭터 10인 · 전적 · 레이팅 |
| 4 | **2D RPG** | 세계관 기반 타일형 2D RPG (PoC) | 단일 맵 · 이동 · NPC · 무공 1종 시전 |

> ※ 본 4 Phase 는 *프로젝트 전체* 단위. 각 Phase 안의 *기획 사이클 Phase 1-5* (비전 / 요구 / 도메인 / 행위 / 화면) 와 구분.

### 3.1 Phase 의존 그래프

```
Phase 1 (세계관 사전)
 ├──▶ Phase 2 (대화형 RPG)
 ├──▶ Phase 3 (외부 IP 랭킹)
 └──▶ Phase 4 (2D RPG)

Phase 2 ── 캐릭터/세션 모델 재사용 ──▶ Phase 4
```

- Phase 1 = 모든 후속 Phase 의 전제
- Phase 2/4 = 캐릭터 모델 공유 가능성 → Phase 2 설계 시 *재사용성 최소 고려* (과설계 금지)
- Phase 3 = 독립성 가장 높음. 단 도메인 용어(경지/세력/무공) 는 Phase 1 에서 차용

### 3.2 Phase 경계 판정 원칙

- Phase 진행 전 Exit Criteria 체크리스트 *전부 통과*
- 미통과는 *이월 금지*, 현 Phase 내 이슈로 재분할
- *"일단 넘어가고 나중에 고친다" 금지*
- 1인 사이드 프로젝트 — *작게 시작 + 점진 추가* (애자일)

## 4. 핵심 아키텍처 결정

본 결정들은 *4 Phase 전체* 에 적용되는 *횡단 결정* 이다.

### 4.1 데이터 모델 — 베이스 / 커스텀 / 온라인

| 데이터 종류 | 위치 | 사용처 | 동기화 | 비고 |
|---|---|---|---|---|
| **베이스 데이터** | 서버 (단일 진실) | Phase 1·2·3·4 모든 서비스 | 단방향 (서버 → 사용자) | 천기망 IP. 운영자 관리 |
| **커스텀 데이터** | 사용자 로컬 only | **Phase 2 대화형 RPG 한정** | 동기화 X (본인만) | LLM 컨텍스트 오버라이드 — 도메인 진실이 아닌 BC 내부 관심사 |
| **온라인 데이터** (랭킹) | 서버 | Phase 3 랭킹 점수 only | REST API (점수 read/write) | 데이터 동기화 없음 — 점수만 |

**의의**: 사용자 커스텀이 *대화형 RPG 한정* 이므로 Phase 1 도메인 모델은 *베이스만* 다룬다. 커스텀 메커니즘은 Phase 2 BC 내부 설계 (도메인 모델 외부 영향 X).

### 4.2 싱글 플레이 우선 — 멀티 동기화 회피

천기망은 **싱글 플레이 모델** 을 채택한다. *실제 게임 데이터 / 세계 상태* 는 멀티 동기화하지 않는다 (LoL / 메이플 같은 *실시간 동기화* 영역 회피).

**근거**:
- 1인 사이드 프로젝트 + 도메인 복잡도 → 멀티 동기화 인프라는 프로젝트 자살 위험
- 사용자 명시 — *"실제 데이터가 공유되는 순간 너무 복잡"*
- 베이스 = 서버 마스터 / 클라이언트 = 읽기 전용 사본 → CDN + 정적 파일로도 충분
- 점수만 온라인 = REST API 1개 (Phase 3 BC) 로 충분

**주의 영역** (지금 결정 X — 메모만):
1. 치팅 방지 — 싱글 점수는 클라이언트 조작 가능. Phase 3 진입 시 무결성 검증 메커니즘 결정
2. 베이스 업데이트 전파 — 오프라인 사용자가 *언제 새 베이스를 받는가* (단순 버전 체크면 충분)
3. 외부 IP 데이터 진입 — Phase 3 베이스가 *지속 성장* 영역. 운영자 큐레이션 vs 사용자 제출 (Phase 3 진입 시 결정)

### 4.3 LLM 전략 — 셀프 호스팅

Phase 2 대화형 RPG 의 LLM 은 **셀프 호스팅 (자체 서버 운영)** 을 채택한다.

| 축 | 결정 |
|---|---|
| 호스팅 | **자체 서버** (사용자 디바이스 X / 외부 API X) |
| 추론 엔진 후보 | Ollama / vLLM / llama.cpp 서버 사이드 (Phase 2 진입 시 결정) |
| 모델 | 강호 IP 파인튜닝 가능 모델 (Phase 2 진입 시 결정) |
| 외부 의존 | 없음 (OpenAI / Anthropic API 의존 회피) |

**근거**:
- ✅ 외부 API 비용 0 / 데이터 프라이버시 / 강호 IP 파인튜닝 자유 / 검열 없음
- ⚠️ GPU 서버 인프라 비용 (Phase 2 진입 시점 인프라 결정)

### 4.4 모바일 전략 — Phase 별 차등 + PWA 출발

| Phase | 웹 적합도 | 모바일 앱 적합도 | 권장 출발 |
|---|---|---|---|
| **Phase 1 세계관 사전** | ✅ 최적 — 위키/카탈로그 = 검색·링크·SEO = 웹 본진 | △ 가능하나 웹이 더 자연스러움 | **웹 only** |
| **Phase 2 대화형 RPG** | ✅ 가능 | ✅ 더 자연스러움 — 미연시 결 / 틈새 시간 / 채팅 UX | **PWA 출발 → 정식 앱 검토** |
| **Phase 3 랭킹** | ✅ 최적 — OP.gg = 웹 우선 | ✅ 가능 (모바일 알림 결) | **웹 우선 + PWA** |
| **Phase 4 2D RPG** | ✅ 웹만 (Phaser/Pixi/Godot HTML5) | △ Capacitor 가능 / 본격은 네이티브 우월 | **웹 출발 → 본격화 시 네이티브 분리** |

**3단 진화**:
```
[현재]  웹 (React + Vite) + PWA 최소 추가
   ↓ (Phase 1 → Phase 2 진입 시점)
[중기]  PWA 검증 → 한계 발견 시 Capacitor 도입 (1코드베이스 유지)
   ↓ (Phase 4 본격화 시점)
[장기]  게임은 네이티브 / RN — 별도 사이클 분리
```

**원칙**:
- *비전에 모바일 명시* — 모든 화면 설계는 *반응형 + 터치 친화*
- *프로젝트 분리 X* — 모노레포 (`backend/` + `frontend/`) 유지. 웹/모바일 별도 repo = 1인 작업자에게 자살 행위
- *iOS PWA 제약* (푸시 / Service Worker / App Store 노출) = 정식 앱 도입 시점 트리거

## 5. DDD 적용 원칙

### 5.0 핵심 용어 풀이 (1인 작업자 컨텍스트 복원용)

> 본 § 이하에서 사용되는 DDD 용어 정의. 한 달 후 본인이 다시 읽었을 때 즉시 이해 가능하도록 *천기망 예시* 와 함께 표기.

| 용어 | 한 문장 풀이 | 천기망 예시 |
|---|---|---|
| **Subdomain** (하위 도메인) | 비즈니스를 의미적으로 나눈 큰 영역 | "세계관 사전" / "대화형 RPG" 각각이 하나의 Subdomain |
| **Core Domain** | 차별점 — 이게 없으면 천기망이 아닌 영역 | 무협 세계관 IP (Phase 1 세계관 사전) |
| **Supporting Subdomain** | Core 를 받쳐주는 영역 — 자체 차별점은 X | 대화형 RPG / 외부 IP 랭킹 / 2D RPG |
| **Generic Subdomain** | 어디서나 같은 일반 영역 — 직접 만들 가치 낮음 | 인증 / 검색 / 권한 |
| **Bounded Context** (BC) | 같은 용어가 *같은 의미* 로 쓰이는 경계 | "캐릭터" 가 사전·RPG·랭킹에서 *다른 모양* 일 수 있음 → 각각 별도 BC |
| **Ubiquitous Language** (UL) | 기획·화면·코드·DB 가 *동일 단어* 사용 | "경지" 는 항상 "경지" (≠ "등급" / "레벨" / "랭크") |
| **Aggregate** | 함께 변경되어야 하는 객체 묶음 + 일관성 단위 | "캐릭터 + 배운 무공 목록 + 현재 경지" 가 한 묶음 |
| **불변식 (Invariant)** | Aggregate 가 *항상* 만족해야 하는 규칙 | *"검도 경지가 무공의 요구 검도 경지 미만이면 그 무공을 배울 수 없다"* |
| **Domain Event** | 도메인에서 발생한 사실 (과거형 PascalCase) | `ArtAssigned` (무공이 부여됨) / `LevelAdvanced` (경지가 돌파됨) |
| **Strategic Design** | *큰 그림* — Subdomain / BC / UL 식별 | Phase 1 본 사이클의 *주 작업* |
| **Tactical Design** | *세부 구현* — Entity / VO / Repository 모델링 | 도메인 복잡 시 점진 도입 (MVP 단계 = 보류) |

> ※ 본 표는 [Vaughn Vernon, "IDDD"] 의 정의를 *천기망 컨텍스트* 로 압축한 것. 정확한 표준 정의는 원전 참조.

### 5.1 핵심 원칙

본 사이클 및 후속 사이클은 [`2026-05-09-planning-cycle-trigger.md`](../handoff/2026-05-09-planning-cycle-trigger.md) §"DDD 적용 원칙" 을 단일 출처로 따른다. 핵심:

- **Strategic Design 우선** — Bounded Context / Ubiquitous Language / Subdomain (Core/Supporting/Generic). Tactical Design 은 도메인 복잡 시 점진
- **Event Storming 1인 변형** — 시간순 이벤트 마크다운 → Aggregate 후보 → BC 식별
- **Top-Down + Bottom-Up 혼합** — 비전 → Subdomain → BC. 현 prototype entities 는 *Bottom-Up 검증 재료* 만
- **행위 명세 정말 중요** (사용자 명시) — Aggregate 행위 카탈로그 (명령 + 이벤트 + 불변식) + BDD `Given/When/Then`. BE BDD 컨벤션 (`should_X_when_Y` + Testcontainers) 의 직접 입력
- **Ubiquitous Language 강제** — 강호 용어 (경지 / 심법 / 문파 / 기연 / 칭호 등) 는 기획 / 화면 / 코드 / DB 모두 동일 표기

### 5.2 4 Phase ↔ DDD Subdomain 매핑 (가설)

| Phase | Subdomain 분류 | 이유 |
|---|---|---|
| Phase 1 세계관 사전 | **Core Domain** | 천기망 IP 자체 — Differentiator |
| Phase 2 대화형 RPG | **Supporting Subdomain** | 코어 IP 위에서 동작하는 *체험 형태 1* |
| Phase 3 외부 IP 랭킹 | **Supporting Subdomain** + 부분 Generic (Elo/Glicko-2) | 코어 IP 의 *언어 차용* + 외부 IP 통합 레이어 |
| Phase 4 2D RPG | **Supporting Subdomain** | 코어 IP 위에서 동작하는 *체험 형태 2* |
| 인증·검색·권한 | **Generic Subdomain** | 차별점 없는 인프라 |

> ※ 본 매핑은 *가설*. Phase 1 Strategic Design 사이클에서 검증.

## 6. Deferred 결정 (지금 결정 X)

본 사이클 (또는 후속 사이클) 에서 다룰 결정 영역:

| 영역 | 결정 시점 | 비고 |
|---|---|---|
| **Phase 1 Bounded Context / UL / Aggregate 식별** | 본 사이클 후속 | DDD Strategic Design 본격 진입 — 다음 티키타카 |
| **외부 IP 랭킹 데이터 진입 메커니즘** | Phase 3 진입 시 | 운영자 큐레이션 / 사용자 제출 → 운영자 승인 / 위키 형태 |
| **Local LLM 추론 엔진 / 모델** | Phase 2 진입 시 | Ollama / vLLM / llama.cpp + 강호 IP 파인튜닝 |
| **GPU 서버 인프라** | Phase 2 진입 시 | 비용·동시성·배포 형태 |
| **모바일 정식 앱 도입** | Phase 2 검증 후 | Capacitor / RN / Flutter |
| **2D RPG 게임 엔진** | Phase 4 진입 시 | Phaser / Pixi / Godot HTML5 / Native 분리 |
| **에셋 제작 파이프라인** | Phase 4 진입 시 | 오픈 에셋 활용 전제 |
| **외부 IP 저작권 검토** | Phase 3 진입 전 | 법적 검토 별도 |
| **수익화 / 사업화** | 범위 외 | 본 비전에서 미정 |
| **인증 / 권한 정책** | 본 사이클 후속 또는 Phase 1 진입 시 | Generic Subdomain — Spring Security / JWT / OAuth2 |

## 7. 참고

- 선행 핸드오프: [`2026-05-09-planning-cycle-trigger.md`](../handoff/2026-05-09-planning-cycle-trigger.md)
- BE 단일 기준점: [`be_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) *(private)*
- FE 단일 기준점: [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)*
- 메타 워크플로우 SSOT: [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)*
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 사례: OP.gg (전적 UX) / 바람의 나라 · 동물의 숲 (2D RPG) / 미연시 (대화형 RPG) / 아이작 (2D 게임)
- 레이팅: Elo / Glicko-2
- DDD: Vaughn Vernon, "IDDD"

## 8. 변경 이력

> **운영 규칙**: 본 헌장의 모든 변경은 본 표에 기록한다. 변경 시 [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) §3.3 Synchronous Update 절차로 영향 받는 참조처를 동기화한다.
>
> **자동 최적화**: 본 표는 [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) §4 정책에 따라 30행 초과 시 자동 압축 (최근 10행 보존, 그 이전 1줄 요약 — 상세는 git log 위임).

| 날짜 | 변경 내용 | 사유 |
|------|----------|------|
| 2026-05-09 | **본 문서 신규** — 비전 1문장·정체성 (콘텐츠 IP 확장 패턴)·4 Phase 로드맵·Phase 의존 그래프·핵심 아키텍처 결정 4건 (베이스/커스텀/온라인 데이터 모델 / 싱글 플레이 / 셀프 호스팅 LLM / 모바일 PWA 출발) · DDD 적용 원칙 · 4 Phase ↔ Subdomain 매핑 가설 · Deferred 결정 10건 | 기획 사이클 trigger 진입 후 사용자 티키타카 결과 SSOT 화 — 대화 휘발 방지. 본 헌장이 모든 후속 사이클 (도메인 / 화면 / 요구사항 / 구현) 의 상위 SSOT |
| 2026-05-09 | **v1 다듬기 (검토 후속)** — §5.0 *핵심 용어 풀이* 박스 신규 (DDD 11개 용어 천기망 예시 동반) + §5.1 *핵심 원칙* / §5.2 *Subdomain 매핑* 재번호 + §4.3 *LLM 오해 정정* 단락 삭제 (메타 history 는 git log + harness-state.md 에 위임) | 사용자 검토 — "어려운 용어로 잘 이해 안 됨 / 초기 문서로 나쁘지 않음". 1인 작업자 컨텍스트 복원 (한 달 후 본인 이해도) + 노이즈 제거. MVP 범위·톤 일관성은 후속 사이클에 자연 해소 |
