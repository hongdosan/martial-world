# BE 아키텍처

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

천기망(天機網) 백엔드는 **Gradle 멀티모듈 + 헥사고날 + 모듈러 모놀리스 + BFF** 4축 직교 조합을 채택한다. 도메인 코어는 Spring·JPA·외부 라이브러리에 무지(framework-agnostic) 하며, 외부 시스템은 어댑터를 통해 격리하여 이식 가능하다. FE 의 [`fe-architecture.md`](./fe-architecture.md) 와 대칭 구조다.

## 4축 정의 (Phase 11 — 2026-05-06)

| 축 | 차원 | 천기망 적용 |
|---|---|---|
| **멀티모듈** | 빌드 차원 (Gradle) | settings.gradle 의 sub-module 분리 + buildSrc convention plugin + 의존 그래프 컴파일 타임 강제 |
| **헥사고날** | 도메인 차원 | 각 도메인 = 헥사곤 (3-sub: `adapter` / `domain` / `infra`) + Inbound·Outbound Port + Aggregate |
| **모듈러 모놀리스** | 배포 차원 | 단일 프로세스·단일 DB + 논리적 도메인 모듈 + 인메모리 호출 (`internaladaptor`) + 미래 수술적 분리 가능성 |
| **BFF** | 통합 차원 | `:app` 안 `bff/` 패키지 — 프론트엔드 화면 단위 통합 endpoint + 여러 도메인 Handler 조립 |

> *Modular Monolith* 는 *Monolith* (구조 분리 없는 단일 모듈) 와 다르다. 단일 배포·단일 DB *지만* 모듈 경계가 명확 분리되어 있어 *수술적 분리* 가 가능하다.

## 아키텍처 구조도

```
            프론트엔드
                ↓
     [:app — 게이트웨이 + Composition Root + BFF]
        /        |        \
       ↓         ↓         ↓
   <도메인1>  <도메인2>  <도메인N>      (각 도메인 = 헥사곤, 3-sub)
    헥사곤    헥사곤    헥사곤
        \       |       /
         \      |      /
          ↓    ↓    ↓
         단일 MariaDB instance (Phase 12 (2026-05-06) — 도메인별 database 분리)
         ├── martialarts_<domain1>      (각 database = 도메인 1개 소유)
         ├── martialarts_<domain2>
         └── martialarts_<domainN>
        ※ cross-database 직접 접근 금지 (internaladaptor + ArchUnit catalog 검증)
        ※ MSA 전환 시: database 단위 dump/restore 만으로 분리
```

| 차원 | 채택 | 비고 |
|---|---|---|
| 헥사고날 아키텍처 | ✅ | 도메인별 분리 (Phase 6-10 확정) |
| BFF 통합 계층 | ✅ | `:app/bff/` 패키지 (Phase 11) |
| 도메인별 별도 instance | ❌ | 단일 MariaDB instance 유지 |
| **도메인별 별도 database (스키마 분리)** | ✅ Phase 12 | `martialarts_<domain>` — 단일 instance 안에서 database 단위 분리 |
| 도메인 간 직접 접근 | ❌ 금지 | `internaladaptor` + ArchUnit 강제 |
| 카프카 / ES | ❌ | 본 사이클 placeholder, 별도 사이클 도입 |

## 목차

- [모노레포 구조](#모노레포-구조)
- [모듈 구조](#모듈-구조)
- [의존성 방향](#의존성-방향)
- [기술 스택](#기술-스택)
- [도메인 격리 (Hexagonal Pattern)](#도메인-격리-hexagonal-pattern)
- [4축 정의 (Phase 11 — 2026-05-06)](#4축-정의-phase-11--2026-05-06)
- [아키텍처 구조도](#아키텍처-구조도)
- [횡단 관심사 매트릭스 v3](#횡단-관심사-매트릭스-v3)
- [공통 모듈 정책 (Phase 9 — 2026-05-06 최종 정의)](#공통-모듈-정책-phase-9--2026-05-06-최종-정의)
- [DB 스키마 분리 — Phase 12](#db-스키마-분리--phase-12)
- [BFF (Backend for Frontend) — Phase 11](#bff-backend-for-frontend--phase-11)
- [도메인 모듈 추가 패턴 (D1-D5)](#도메인-모듈-추가-패턴-d1-d5)
- [현재 상태 / 도입 예정](#현재-상태--도입-예정)

## 모노레포 구조

천기망은 FE + BE 모노레포로, 천기망 root 안에 `frontend/` + `backend/` 가 분리되어 공존한다.

```
martial-arts/                    # git root
├── frontend/                    # FE (FSD 기반 — fe-architecture.md 참조)
│   ├── src/
│   ├── package.json
│   └── ...
├── backend/                     # BE (본 문서)
│   ├── settings.gradle
│   ├── build.gradle
│   ├── buildSrc/
│   ├── app/
│   └── <domain>/...
├── docs/
├── .private-config/             # private 서브모듈 (공용 SSOT)
└── .claude/                     # Claude 협업 SSOT (공용)
```

> 본 문서 작성 시점에 `frontend/` 디렉토리 이전은 별도 사이클로 분리되어 있다 ([`harness/harness-state.md`](./harness/harness-state.md) 변경 이력 참조).

## 모듈 구조

**Gradle 멀티 모듈 — 혼합 (도메인별 3-sub + app + 라이브러리 모듈 N개) / Groovy DSL**

```
backend/
├── settings.gradle              # include 25개 수준 (도메인 6개 가정 시 4*6 + app)
├── build.gradle                 # 루트 (allprojects / subprojects 공통)
├── buildSrc/                    # convention plugin (Groovy)
│   └── src/main/groovy/
│       ├── martial-arts.java-conventions.gradle
│       ├── martial-arts.spring-conventions.gradle
│       └── martial-arts.test-conventions.gradle
├── app/                         # Composition Root — Spring Boot main + 전사 횡단
│   └── src/main/java/.../MartialArtsApplication.java
├── core/                        # 기본 공통 모듈 — 순수 Java 유틸·generic 타입 (의존 0)
│   └── src/main/java/com/martialarts/core/{util,type}/
├── <role>/                      # (도입 시) 책임별 라이브러리 모듈 — 책임명 직접 (예: spring-support, test-fixtures). common-* 접두사 금지
└── <domain>/                    # 도메인별 모듈 그룹 (도메인 미확정 — 플레이스홀더)
    ├── adapter/                 # adapter 단일 모듈
    │   └── src/main/java/.../<domain>/adapter/
    │       ├── inbound/         # HTTP·Handler·DTO·도메인 정책 AOP
    │       └── outbound/        # Port 구현·Mapper·persistence·외부 호출
    ├── domain/                  # Aggregate·Entity·VO·Port·Domain Service (순수 Java)
    └── infra/                   # 외부 시스템 통신 코드 *전용* (Entity/Repository/FeignClient/Kafka 메시지/Liquibase partial)
```

> **도메인 미확정** — `<domain>/` 은 *플레이스홀더*. 추후 도메인 설계 사이클에서 확정. `frontend/src/entities/` 의 6개 (level/art/faction/title/fortune/misc) 는 *FE 데이터 구조* 일 뿐 BE 도메인 확정안이 아니다.

상세는 [`be-multimodule-guide.md`](./be-multimodule-guide.md) 참조.

## 의존성 방향

```
:app
  ├──→ :<domain>:adapter
  │       ├──→ :<domain>:domain
  │       └──→ :<domain>:infra
  ├──→ :<domain>:domain
  └──→ :<domain>:infra
            (※ :<domain>:domain 은 어디에도 의존하지 않는 순수 모듈)
```

- `:<domain>:domain` 은 Spring·JPA·MariaDB 의존 **금지** (순수 Java POJO)
- `:<domain>:adapter` 는 `:<domain>:domain` (Port 구현·호출) + `:<domain>:infra` (outbound 패키지에서 Repository/Client 호출) 의존
- adapter 모듈 *내부* 의 inbound/outbound 패키지 차단은 ArchUnit 룰 (inbound ↛ outbound / inbound ↛ infra) 로 보강
- `:<domain>:infra` 는 `:<domain>:domain` 의존 **금지** (infra=domain 모름 원칙)
- `:app` 은 모든 도메인의 3개 sub-module 을 의존 (Composition Root)
- **공통 모듈 (`:core` 등)** — *필요한 모듈만 선택적으로* 의존 (라이브러리 형식). 모든 모듈이 의존하지 않음. 공통 모듈은 어떤 모듈도 의존하지 않음 (단방향, ArchUnit 강제). 공통 모듈끼리도 *원칙적으로* 의존 금지 (SRP)
- 같은 도메인 내 sub-module 간만 의존 — 다른 도메인의 sub-module 직접 import 금지 (도메인 간 통신은 `internaladaptor` 패턴)

**컴파일 타임 강제**: Gradle 의존성 그래프 + ArchUnit (`SlicesShouldOnlyDependOnPackages`) 으로 위반 자동 탐지.

## 기술 스택

| 항목 | 선택 |
|------|------|
| Language | Java 21 LTS (latest patch) |
| Framework | Spring Boot 3.4.x (latest patch) |
| ORM | JPA (Hibernate) |
| DB | MariaDB 11 |
| DB 마이그레이션 | Liquibase (YAML changeset) |
| Build Tool | Gradle 8.x (Groovy DSL `*.gradle`) |
| Test (Unit·BDD) | JUnit5 + AssertJ + Mockito |
| Test (Integration) | Testcontainers MariaDB |
| Architecture Test | ArchUnit |
| Module 진입점 | `app/` (Composition Root) |
| Security | (미정 — 추후 사이클) |

> **Stable Latest** — 실험적 API 금지. 검증된 최신 안정 패턴(Stable Best Practice) 적용.

## 도메인 격리 (Hexagonal Pattern)

외부 시스템·라이브러리는 비즈니스 로직과 직접 결합하지 않고 **포트 + 어댑터** 를 거친다. **외부 라이브러리 교체 시 도메인 코드 변경이 없어야 한다.**

- **Inbound Port (`Handler` 인터페이스)** — 도메인이 *외부에서 받는* 행위 정의. Domain Service 가 구현. Controller 는 Handler 만 호출 (직접 Domain Service 호출 금지).
- **Outbound Port** — 도메인이 *외부에 요청하는* 행위 정의. 어댑터가 구현.
- **Outbound Adapter (`*Adaptor`)** — Port 구현체. 인프라별 분리 (`*PersistenceAdaptor`, `*KafkaAdaptor`, `*RestApiAdaptor` 등).
- **internaladaptor** — 도메인 간 통신용 어댑터. 호출 받는 측 = `<domain>:adapter/inbound/internaladaptor/` 의 internal 포트, 호출하는 측 = `<domain>:adapter/outbound/internaladaptor/` 의 internal 어댑터. **도메인 모듈 직접 import 금지**.
- **infra** (v3 정의 + Phase 13 일관화) — 외부 시스템과의 *통신 코드 전용* (JPA Entity / Spring Data Repository / Kafka 메시지 DTO / Redis DAO / FeignClient + Configuration / Liquibase 도메인별 partial changelog) **+ JPA 도구 설정 (Phase 13)** — DataSource·EMF·JPA properties·`@EnableJpaAuditing`·Auditor 모두 `<domain>:infra/jpa/`. **AOP·Filter 등 도구 설정 외 횡단은 `app` (모듈 공용 진입점) 에 둔다.** infra 는 domain 을 컴파일 타임 의존하지 않으며, 서브도메인별로 소유한다 (도메인 간 공유 금지).

**도메인 간 통신 시**: 도메인 A 가 도메인 B 의 데이터를 필요로 하면, B 의 internal inbound port 를 통해 호출. 직접 `B.domain` 을 import 하지 않는다.

**코드만 있으면 어디서든 실행 가능** — `git clone` 후 `./gradlew build` → `./gradlew bootRun` 표준 명령으로 동작. 환경 변수만 주입하면 OS·IDE 무관 실행.

## 횡단 관심사 매트릭스 v3 (Phase 7 정정 + Phase 13 일관화)

**`<domain>:infra` 정의** = 외부 시스템과의 *통신 코드 전용* (Entity / Repository / FeignClient / Kafka 메시지 / Redis DAO / Liquibase partial) **+ JPA 도구 설정 일관 (Phase 13 — 2026-05-06)** — DataSource·EMF·JPA properties·`@EnableJpaAuditing`·Auditor. **AOP 횡단·HTTP 진입 정책 등 도구 설정 외 횡단은 `app` (모듈 공용 진입점)**.

**3축 분류 원칙**: 단일 위치 정책이 아닌, 카테고리별 분산 배치.
- `app` ← 전사 글로벌 + 모듈 공용 (HTTP 진입 정책 + 글로벌·모듈 공용 AOP + 글로벌 예외 매핑 + Web 설정)
- `<domain>:adapter-{inbound,outbound}` ← 도메인 정책 AOP / HTTP DTO·검증 / Port 구현 변환 (Mapper)
- `<domain>:domain` ← 도메인 invariant / 도메인 어노테이션 / Aggregate
- `<domain>:infra` ← 외부 시스템 통신 코드 *전용* + **JPA 도구 설정 (Phase 13)**

| 카테고리 | 위치 |
|---|---|
| 인증/인가 (`SecurityConfig`, JWT/OAuth Filter) | (미정 — 추후 사이클) |
| 글로벌 예외 매핑 (`@RestControllerAdvice`) | `app` |
| Servlet Filter / WebMvcConfig | `app` |
| **DataSource / EntityManagerFactory / JPA properties / `<Domain>JpaConfig`** | **`<domain>:infra/jpa/`** ★ Phase 13 정정 (이전 v3 = `app`) |
| **`@EnableJpaAuditing` / JpaAuditingConfig / Auditor** | **`<domain>:infra/jpa/auditing/`** ★ Phase 13 정정 (이전 v3 = `app`) |
| Liquibase 도메인별 partial changelog | `<domain>:infra/liquibase/` |
| **Liquibase 도메인별 master changelog** | **`<domain>:infra/liquibase/db.changelog-<domain>.yaml`** ★ Phase 12 (도메인별 자체 master) |
| AOP — 진짜 글로벌 (전 도메인) | `app` |
| **AOP — 모듈 공용 횡단** | **`app`** ★ v3 정정 |
| AOP — 트랜잭션 (`@Transactional`) | Spring 자동 |
| **AOP — 도메인 정책** | `<domain>:adapter/inbound` 또는 `<domain>:adapter/outbound` |
| Bean Validation — 도메인 invariant | `<domain>:domain` |
| Bean Validation — 입력 DTO syntactic | `<domain>:adapter/inbound` |
| 도메인 커스텀 Annotation | `<domain>:domain` |
| HTTP 진입점 어노테이션 (예: `@InternalApi`) | `app` |
| HTTP 도메인 어노테이션 (예: `@CurrentUser`) | `<domain>:adapter/inbound` |
| JPA Entity / Spring Data Repository | `<domain>:infra/jpa/` |
| Kafka 메시지 DTO | `<domain>:infra/kafka/message/` |
| FeignClient + YAML 설정 (RestTemplate **금지**) | `<domain>:infra/restapi/<service>/` |
| Mapper (Entity ↔ 도메인 변환) | `<domain>:adapter/outbound/mapper/` |
| **순수 Java 유틸리티 / generic 타입** | `:core/{util,type}/` (의존 0, 선택적 의존) |
| **core 가 책임 못 지는 다른 공유 책임** | `:<role>/` (필요 시 도입, 책임명 직접 — 예: `:spring-support`, `:test-fixtures`. common-* 금지, SRP) |
| **도메인 결합 유틸** | `<domain>:domain/util/` (공통 아님) |

**금지** (Phase 9 — 2026-05-06 최종 정의):
- **도메인/framework 결합 공통 모듈** 금지. 단 다음은 허용:
  - 진입점 모듈 (`app`) — Composition Root
  - 책임별 공통 모듈 (`:core` 등) — *의존 0* (core), 도메인·framework 무지, *선택적 의존*, *SRP 준수*, *공통 모듈 → 다른 모듈 의존 금지*
- infra 가 domain 을 *컴파일 타임 의존* 하는 것 금지.
- infra 에 횡단 설정·도구 설정 두는 것 금지 (v3 정정).
- **infra 서브도메인별 소유** — 도메인 간 infra 코드 공유 금지.
- **공통 모듈 내부 스파게티 코드** 금지 — 책임 다양해지면 별도 공통 모듈 분리.

## 공통 모듈 정책 (Phase 9 — 2026-05-06 최종 정의)

| 원칙 | 내용 |
|---|---|
| **책임별 분리** | `:core` = 순수 Java 유틸·generic. core 가 책임 못 지는 다른 공유 책임 → 책임명 직접 표기 라이브러리 모듈 (`:<role>` — 예: `:spring-support`, `:test-fixtures`). **common-* 접두사 금지** (모든 모듈 사용 가능 오해 방지) |
| **선택적 의존** | 모든 모듈이 의존 X — *필요한 모듈만 라이브러리 형식으로* 선택 의존 |
| **단방향 의존** | 공통 모듈 → 다른 모듈 의존 금지 (ArchUnit 강제). 공통 모듈끼리도 *원칙적으로* 의존 금지 |
| **의존 0 (`:core` 한정)** | `:core` 는 어떤 라이브러리·모듈·framework 의존 없음 (build.gradle 검증 + ArchUnit) |
| **SRP 엄격** | 공통 모듈 내부 스파게티 코드 금지. 책임 다양해지면 별도 모듈 분리 |
| **도메인 모델 / 횡단 / 비즈니스 로직 부재** | 도메인 모델은 `<domain>:domain`, 횡단은 매트릭스 v3 |

## DB 스키마 분리 — Phase 12

**단일 MariaDB instance + 도메인별 database** 채택. MSA 전환 비용 최소화 + 강한 물리적 도메인 격리.

```
┌───────────────────────────────────────────────┐
│  MariaDB instance 1개 (jdbc:mariadb://host:3306/) │
│                                                │
│  ├── database: martialarts_<domain1>          │
│  │     ├── (테이블 prefix 없음 — database = namespace) │
│  │     └── ...                                 │
│  ├── database: martialarts_<domain2>          │
│  └── database: martialarts_<domainN>          │
└───────────────────────────────────────────────┘
```

### 운영 원칙

| 원칙 | 내용 |
|---|---|
| **database 명명** | `martialarts_<domain>` (예: `martialarts_order`, `martialarts_user`) |
| **테이블 명명** | prefix 없음 — database 가 namespace 역할 (`orders`, `users` 등 단순) |
| **DataSource** (Phase 13 정정) | **도메인별** (`<domain>:infra/jpa/`) — URL = `jdbc:mariadb://host:3306/martialarts_<domain>` + HikariCP 풀 도메인별 |
| **EntityManagerFactory** | 도메인별 (`<domain>:infra/jpa/`) — `hibernate.default_catalog = martialarts_<domain>` |
| **JPA properties / @EnableJpaAuditing** (Phase 13) | 도메인별 (`<domain>:infra/jpa/`, `<domain>:infra/jpa/auditing/`) — JPA = infra 일관 |
| **JPA Entity catalog** | `@Table(catalog = "martialarts_<domain>")` 또는 EMF default_catalog 설정 |
| **Liquibase** | 도메인별 자체 master + Bean (`<domain>:infra/.../db/changelog/<domain>/db.changelog-<domain>.yaml`) |
| **권한 분리** (운영) | database 별 GRANT (`GRANT ALL ON martialarts_<domain>.* TO ...`) |

### 금지 사항

- **cross-database JOIN** — JPQL/Querydsl/Native query 에서 다른 도메인 database 직접 참조 금지
- **cross-database 트랜잭션** — 같은 instance 라 기술적으론 가능하나 *원칙적 금지* (MSA 전환 시 깨짐). 도메인 간 일관성은 *이벤트/saga* 패턴
- **도메인 간 직접 접근** — `internaladaptor` 패턴으로만 통신 (Inbound Port 호출)
- **Entity 의 다른 도메인 catalog 매핑** — ArchUnit 룰로 검증

### MSA 전환 시 절차 (수술적 분리)

1. 분리 대상 도메인의 database dump (`mysqldump martialarts_<domain>`)
2. 별도 instance 에 restore
3. 도메인의 DataSource endpoint 만 변경 (`jdbc:mariadb://<new-host>:3306/martialarts_<domain>`)
4. 도메인 모듈을 별도 Spring Boot 서비스로 분리 (Composition Root 분리)

→ 데이터 분리 마이그레이션 (테이블 단위 추출) 불요.

## BFF (Backend for Frontend) — Phase 11

`:app` 안의 `bff/` 패키지로 구현. 별도 `:bff` 모듈 부재 — `:app` 이 *Composition Root + 게이트웨이 + BFF* 통합.

```
backend/app/src/main/java/com/martialarts/
├── MartialArtsApplication.java     # Spring Boot main
├── config/                         # 전사 횡단 (Security·Web·Jpa·Filter·AOP — 매트릭스 v3)
└── bff/                            # 화면 단위 통합 (Phase 11)
    ├── controller/                 # /api/screen/<feature>/... endpoint
    ├── assembler/                  # 여러 Handler 호출 결과 조립
    └── dto/                        # 화면 단위 응답 DTO
```

| 원칙 | 내용 |
|---|---|
| **책임** | 프론트엔드 화면 단위 endpoint + 여러 도메인 Handler 호출 + 응답 조립 |
| **호출 대상** | 도메인의 Inbound Port (`<domain>:domain/port/inbound/<Xxx>Handler` 인터페이스 *직접 호출* — 인메모리, FeignClient·HTTP 호출 아님) |
| **금지** | (1) 비즈니스 판정·필터·계산·정책 분기 (도메인 모듈 위임) / (2) DB 직접 접근 (Repository·Entity import 금지) / (3) `<domain>:adapter`·`<domain>:infra` 직접 의존 / (4) `internaladaptor` 사용 (도메인 간 통신용) |
| **응답 DTO** | 화면 단위 DTO. 도메인 model 직접 노출 지양 — Assembler 가 도메인 model → 화면 DTO 변환 |
| **endpoint 패턴** | `/api/screen/<feature>/...` (도메인별 endpoint 와 별개 그룹) |
| **ArchUnit 강제** | `bff` 패키지가 `domain.port.inbound` 만 의존, `..adapter..`·`..infra..` 의존 금지 |

> *프론트엔드는 BFF 만 바라봄* — 가이드 본문 정신. 도메인별 직접 endpoint (셀러센터·관리자 백오피스 등) 는 별도 결정 영역 (추후 사이클).

## 도메인 모듈 추가 패턴 (D1-D5)

| # | 패턴 | 핵심 |
|---|---|---|
| **D1** | Port 분리 (CQRS-style) | Outbound Port = `<Xxx>QueryPort` / `<Xxx>PersistencePort` / `<Xxx>CommandPort` 분리. 읽기·쓰기 혼재 금지 |
| **D2** | Port 반환 = 도메인 모델 원칙 | primitive / `String` / Entity 직접 반환 금지. 단일 식별자만 필요해도 도메인 객체 반환 |
| **D3** | adaptor 비즈니스 로직 금지 | 판정·필터·계산·정책 분기는 `domain/{service,validate,model}` 에. Adapter 는 I/O + 변환만 |
| **D4** | Validator 입력 3패턴 | A (Port Query DTO) / B (파라미터 data class) / C (도메인 입력 — default 권장) 중 1개 |
| **D5** | infra 서브도메인별 소유 | 도메인 간 infra 코드 공유 금지 (중복 코드 발생해도 격리 우선) |

> 상세 규칙은 [`be_reference_prompt.md §2.4`](../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md) 참조.

> 결정 표준의 상세 규칙(매트릭스 카테고리 전체·BDD 컨벤션·OpenAPI 운영·테스트 전략·AI 행동 지침 등)은 프라이빗 서브모듈([`prompt/read_only/backend/be_reference_prompt.md`](../../.private-config/shared/prompt/read_only/backend/be_reference_prompt.md))에 단일 기준점으로 관리한다. 접근 권한이 있는 협업자만 열람 가능.

## 현재 상태 / 도입 예정

상기 기술 스택은 천기망 BE 의 **결정된 표준** 이다. 현재 BE 는 **신규 도입 단계** 이며, 본 사이클(2026-05-01) 에서 표준·아키텍처·에이전트·SSOT 가 일괄 정의되었다.

| 항목 | 결정 표준 | 현재 구현 | 상태 |
|------|-----------|-----------|------|
| `backend/` 디렉토리 | `settings.gradle` 기반 멀티 모듈 | 미존재 | **신규 도입 예정** (도메인 설계 사이클 후) |
| Java / Spring Boot | 21 LTS / 3.4.x | 미설치 | 도입 예정 |
| MariaDB | 11 | 미설치 | 도입 예정 |
| Liquibase | YAML changeset | 미도입 | 도입 예정 |
| Testcontainers | MariaDB | 미도입 | 도입 예정 |
| ArchUnit | 헥사고날 의존 / BDD 컨벤션 검증 | 미도입 | 도입 예정 |
| 보안 | (미정) | (미정) | **추후 사이클** — 로그인·사용자 정책 기획 후 결정 |

> ※ 도메인 설계 사이클이 완료되어야 첫 도메인 모듈 3-sub (`adapter` / `domain` / `infra`) 를 실제로 생성할 수 있다 (현 상태는 *구조·표준* 확정 단계).
