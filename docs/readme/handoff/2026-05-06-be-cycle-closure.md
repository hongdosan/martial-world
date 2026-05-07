# Handoff — 2026-05-06 — BE 표준 정의 사이클 종료 + 다음 세션 트리거

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear) 적용. 본 문서는 fact 가 아닌 **hypothesis** 로 다룬다 — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 2026-05-06 BE 표준 정의 사이클 (Phase 6-13) 전체 종료 ✅**

## Summary

천기망 BE 표준 정의 사이클 8개 (Phase 6-13) 완전 종료. **Gradle 멀티모듈 + 헥사고날 + 모듈러 모놀리스 + BFF + 도메인별 database (`martialarts_<domain>`) + JPA = infra 일관** 4축 통합 아키텍처 확정. 산출물 12파일 (서브모듈 7 + 메인 5) commit 가능 상태. 다음 세션 = **FE 디렉토리 이전 + `backend/` 첫 셋업** (사용자 결정 — 2026-05-01).

## Key Decisions (Phase 6-13 누적)

| Phase | 일자 | 결정 |
|---|---|---|
| 6 | 2026-05-01 | BE 표준 정의 (Java 21 LTS / Spring Boot 3.4.x / JPA / MariaDB 11 / Liquibase YAML / Gradle Groovy DSL / JUnit5+AssertJ / Testcontainers / ArchUnit / DDD·헥사고날 / 모노레포 `frontend+backend`) |
| 7 | 2026-05-03 | 매트릭스 v2 → v3 (`<domain>:infra` = 외부 시스템 통신 코드 *전용*) + D1-D5 5패턴 (CQRS Port / Port 반환 도메인 / adaptor 비즈니스 금지 / Validator 3패턴 / infra 서브도메인별 소유) |
| 8 | 2026-05-03 | 4-sub → 3-sub (`adapter` 단일 모듈 + 내부 `inbound/`·`outbound/` 패키지 + ArchUnit 패키지 룰) |
| 9 | 2026-05-06 | 공통 모듈 정책 (`:core` 의존 0 + 책임별 분리 + 선택적 의존 + SRP + 단방향) |
| 10 | 2026-05-06 | common 용어 제거 (`:<role>` 책임명 직접 — 예: `:spring-support`, `:test-fixtures`. common-* 접두사 금지) |
| 11 | 2026-05-06 | 모듈러 모놀리스 + BFF 통합 (`:app/bff/` 패키지 — Composition Root + 게이트웨이 + BFF 통합) |
| 12 | 2026-05-06 | DB 스키마 분리 (단일 instance + 도메인별 database `martialarts_<domain>` + 도메인별 Liquibase master) |
| 13 | 2026-05-06 | **JPA 설정 위치 일관화** (DataSource·EMF·JPA properties·`@EnableJpaAuditing` 모두 `<domain>:infra/jpa/` — JPA = infra 완전 일관) |

## 4축 통합 정의 (최종)

| 축 | 차원 | 천기망 적용 |
|---|---|---|
| 멀티모듈 | 빌드 (Gradle) | settings.gradle + buildSrc convention plugin + 컴파일 타임 의존 강제 |
| 헥사고날 | 도메인 | 도메인별 헥사곤 (3-sub: `adapter` / `domain` / `infra`) + Port + Aggregate |
| 모듈러 모놀리스 | 배포 | 단일 프로세스·단일 instance + 도메인별 database + internaladaptor + 수술적 분리 가능 |
| BFF | 통합 | `:app/bff/` 패키지 — 프론트엔드 화면 단위 통합 |

## Traps to Avoid

- **`:app` 안에 비즈니스 로직 두기 금지** — Composition Root + 게이트웨이 + BFF (조립자) 만. 비즈니스 판정·필터·계산은 도메인 모듈 (D3 정합)
- **BFF 가 `<domain>:adapter`/`<domain>:infra` 직접 의존 금지** — `domain.port.inbound` (Handler 인터페이스) 만 의존
- **`:<domain>:domain` 에 Spring/JPA 의존 금지** — 순수 Java POJO. Application Service `@Service`·`@Transactional` 정도만 허용
- **`:<domain>:infra` 가 `:<domain>:domain` 컴파일 의존 금지** — infra=domain 모름 원칙
- **공통 모듈 의존 금지** — `:core` / `:<role>` 등 공통 모듈은 어떤 모듈도 의존하지 않음 (단방향)
- **`common-*` 접두사 금지** — 책임명 직접 (모든 모듈 사용 가능 오해 방지)
- **cross-database JOIN/트랜잭션 금지** — 같은 instance 라 기술적으론 가능하나 *원칙적 금지* (이벤트/saga 권장)
- **internaladaptor 와 BFF 혼동 금지** — internaladaptor = *도메인 간* 통신, BFF = *프론트엔드 → 도메인* 통합. 별개 패턴
- **adapter 모듈 *내부* `inbound` ↛ `outbound` / `inbound` ↛ `infra`** — Gradle 차원 차단 부재 (3-sub 단일 adapter 모듈), ArchUnit 패키지 룰로만 강제
- **모놀리스 ≠ 모듈러 모놀리스** — *Modular Monolith* 는 단일 배포·단일 DB *지만* 도메인 모듈 명확 분리 + 미래 수술적 분리 가능

## Working Agreements

- 명시적 지시는 **우회 없이 직접 실행** — 대안 제시·허가 확인 없이.
- 외부 글은 **원본 URL 로만 참조** (verbatim 사본 repo 저장 금지 — 저작권).
- **2단계 커밋** — 서브모듈(`.private-config`) 먼저 커밋·푸시, 메인 저장소가 포인터 갱신.
- **제안 → 확인 → 수정의 순차 진행** (일괄 수정 금지).
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 "제안 커밋 메시지 초안" (`vibe-coding-flow.md §6`).
- **Synchronous Update** — 변경 시 SSOT 역전파 (`vibe-coding-flow.md §3.3`).
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 의 표에 누적.

## Relevant Files

### 본 사이클 산출물 12파일 (commit 대상)

**서브모듈 `.private-config/` (7파일, +1412 lines)**:
- `claude/CLAUDE.md` — §백엔드 위임 본문 + 변경 이력 (Phase 6-13 7건)
- `claude/claude-agents/agent-backend.md` — 코디네이터 (Phase 6 골격 → 본문 519행)
- `claude/claude-agents/agent-backend-reviewer.md` — 리뷰어 (신규 290행)
- `shared/prompt/read_only/backend/be_reference_prompt.md` — BE SSOT (§1-§13, +427행)
- `shared/prompt/read_only/backend/be_develop_prompt.md` — DoD 보강
- `shared/prompt/read_only/backend/be_improvement_prompt.md` — DoD 회복 보강
- `shared/prompt/read_only/backend/be_review_prompt.md` — 9 카테고리 체크리스트

**메인 저장소 (5파일, +952 lines)**:
- `docs/readme/be-architecture.md` — 신규 (4축 + 구조도 + 매트릭스 v3 + BFF + DB + D1-D5)
- `docs/readme/be-multimodule-guide.md` — 신규 (Gradle Groovy DSL + 3-sub + ArchUnit + 도메인 추가 절차)
- `docs/readme/harness/harness-state.md` — 인벤토리·변경 이력·결론
- `docs/readme/harness/harness-integration.md` — §2 BE 행 + §4.1 BE 코드 위치
- `.private-config` — 서브모듈 포인터 갱신

### 메타·정합성 참조

- [`vibe-coding-flow.md`](../../../.private-config/shared/prompt/read_only/vibe-coding-flow.md) *(private)* — 메타 워크플로우 SSOT
- [`harness-setup.md §5`](../harness/harness-setup.md#5-결과-검증-정합성-체크) — 산출물 정합성 7항목
- [`fe_reference_prompt.md`](../../../.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md) *(private)* — FE 대칭 (변경 금지, 본 사이클에서 미변경 ✓)
- [`fe-architecture.md`](../fe-architecture.md) — FE 아키텍처

## Open Work (다음 세션 / 별도 트랙)

### 다음 세션 — FE 디렉토리 이전 + `backend/` 첫 셋업

**FE 디렉토리 이전** (사용자 결정 2026-05-01):
- `src/`, `public/`, `package.json`, `tsconfig.json`, `node_modules/` 등 root 직속 → `frontend/` 하위 이전
- 영향받는 산출물 일괄 갱신:
  - `fe-architecture.md` 의 폴더 구조 (`src/...` → `frontend/src/...`)
  - `fe_reference_prompt.md` 경로 인용
  - `agent-frontend.md` / `agent-frontend-reviewer.md` 경로 인용
  - 메인 `README.md`, `private-config.md`, `env-var-convention.md`
  - root 빌드 명령 (`package.json` scripts)
  - `.gitignore` 규칙
  - `.claude/CLAUDE.md`

**`backend/` 첫 셋업** (본 사이클 표준 적용):
- `backend/{settings.gradle, build.gradle, buildSrc/, app/, core/}` 신규 생성
- `app/build.gradle` (전사 횡단 + BFF 의존 — 모든 도메인 `:domain` 모듈 의존)
- `core/build.gradle` (의존 0)
- 첫 도메인 sub-module 4-sub 의 실제 코드 생성은 *도메인 설계 사이클 후*

### 별도 트랙 (시점 사용자 결정)

- **도메인 설계 사이클** — 천기망 도메인 확정 (현 placeholder `<domain>` → 실제 도메인명)
- **보안 정책 사이클** — 인증/인가 (Spring Security / JWT / OAuth2) 결정 (Phase 6-13 placeholder)
- `agent-fe-tester` 시범 생성 (`harness-setup.md §4`)
- 통합 코디네이터 `agent-reviewer.md` 도입 검토

## 2단계 커밋 가이드 (본 사이클 commit 시)

### 서브모듈 (`.private-config/`)
```
[<TICKET-KEY>] BE 표준 정의 사이클 (Phase 6-13)

- agent-backend.md (519행) / agent-backend-reviewer.md (신규 290행)
- be_reference_prompt.md 100% 완성 (§1-§13, +427행)
- be_{develop,improvement,review}_prompt.md 보강
- 4축: 멀티모듈 + 헥사고날 + 모듈러 모놀리스 + BFF
- 매트릭스 v3 / D1-D5 / 3-sub / :core 의존 0 / :<role> 책임명 직접
- BFF: :app/bff/ 패키지 (도메인 Inbound Port 만 의존)
- DB: 단일 instance + martialarts_<domain> database
- JPA = infra 완전 일관 (DataSource·EMF·properties·Auditing 모두 :<domain>:infra/jpa/)
- CLAUDE.md §백엔드 위임 트리거 + 변경 이력 (Phase 6-13)
```

### 메인 저장소
```
[<TICKET-KEY>] BE 산출물 + harness 메타 (Phase 6-13)

- docs/readme/be-architecture.md 신규 (+325행)
- docs/readme/be-multimodule-guide.md 신규 (+580행)
- harness-state.md / harness-integration.md (§2·§4.1)
- 서브모듈 포인터 갱신
```

## Prompt for New Chat (다음 세션 — FE 디렉토리 이전 + `backend/` 첫 셋업)

```
천기망 FE 디렉토리 이전 + `backend/` 첫 셋업 사이클을 시작한다.

다음 파일을 실제로 Read 도구로 읽고 본 핸드오프의 주장을 코드/실제 상태와
대조 검증한 후 작업 계획을 안내해:

1. docs/readme/handoff/2026-05-06-be-cycle-closure.md (본 핸드오프 — SSOT)
2. docs/readme/be-architecture.md (BE 표준 — backend/ 첫 셋업 적용 대상)
3. docs/readme/be-multimodule-guide.md (Gradle 멀티 모듈 가이드)
4. docs/readme/fe-architecture.md (FE 아키텍처 — 이전 후 경로 갱신 대상)
5. .private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md (FE SSOT)
6. .claude/CLAUDE.md (협업자 가이드 — 모노레포 구조 반영 확인)
7. README.md (메인 README — 모노레포 진입점, 갱신 대상)

CLAUDE.md 에 이미 적힌 내용은 다시 설명하지 마.

검증 후 사용자에게 다음 안내:
(a) FE 이전 영향 범위 확인 + 일괄 정정 계획 (경로 인용 / 빌드 명령 / .gitignore)
(b) backend/ 첫 셋업 단계 (settings.gradle / build.gradle / buildSrc / app / core)
(c) 도메인 설계 사이클은 별도 — 본 사이클은 *구조 셋업* 만
(d) 영향 받는 산출물 변경 이력 누적 (harness-state.md)
```

## 참고

- 이전 사이클 핸드오프: [`2026-05-01-be-harness-cycle.md`](./2026-05-01-be-harness-cycle.md), [`2026-05-01-be-harness-trigger.md`](./2026-05-01-be-harness-trigger.md)
- 4-Tier 가이드: [`README.md`](./README.md)
- 하네스 현 상태 + 변경 이력: [`../harness/harness-state.md`](../harness/harness-state.md)
- 하네스 도입 가이드: [`../harness/harness-integration.md`](../harness/harness-integration.md)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
