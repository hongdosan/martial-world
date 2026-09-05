# BE 멀티 모듈 가이드 (Gradle)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

천기망(天機網) 백엔드의 **Gradle 멀티 모듈 분리 단위**, **참조 방향 컴파일 타임 강제 방법**, **`settings.gradle` / `build.gradle` 예시**를 정의한다. 본 문서는 [`be-architecture.md`](./be-architecture.md) 의 모듈 구조 결정을 *어떻게 구현할지* 의 실무 가이드다.

## 목차

- [원칙](#원칙)
- [모듈 분리 단위](#모듈-분리-단위)
- [참조 방향 강제 방법](#참조-방향-강제-방법)
- [Gradle 설정 예시](#gradle-설정-예시)
- [convention plugin (buildSrc/)](#convention-plugin-buildsrc)
- [도메인 추가 절차](#도메인-추가-절차)
- [참고](#참고)

## 원칙

1. **혼합 분리** — 도메인별 3-sub (`adapter` / `domain` / `infra`) + `app` 진입점 + **책임별 라이브러리 모듈 N개 (`:core` + `:<role>` 책임명 직접)**. adapter 모듈 *내부* 에 `inbound/`·`outbound/` 패키지 분리
2. **단방향 의존** — `:app → :<domain>:adapter → :<domain>:domain` + `:<domain>:adapter → :<domain>:infra` (모듈 차원). adapter 내부 inbound ↛ outbound / inbound ↛ infra 차단은 ArchUnit 패키지 룰
3. **공통 모듈 정책** (Phase 9 — 2026-05-06 최종 정의):
   - `:core` (기본) = 순수 Java 유틸·generic 타입, 의존 0
   - core 가 책임 못 지는 영역 → 책임별 라이브러리 모듈 (`:<role>` — 책임명 직접, 예: `:spring-support`, `:test-fixtures`) 도입 가능, SRP 준수. **common-* 접두사 금지** (모든 모듈 사용 가능 오해 방지)
   - **선택적 의존** — 모든 모듈이 의존 X, 필요한 모듈만 라이브러리 형식으로 의존
   - 공통 모듈 → 다른 모듈 의존 금지 (단방향, ArchUnit 강제)
   - 공통 모듈 내부 *스파게티 코드 금지* — SRP 엄격
3. **infra=domain 모름** — `:<domain>:infra` 가 `:<domain>:domain` 컴파일 타임 의존 금지
4. **도메인/framework 결합 공통 모듈 금지** — 비즈니스 로직이나 도메인 의존 보유 공통 모듈은 안티패턴. 단 `app` 진입점 + 책임별 공통 모듈 (`:core` 등) 은 §원칙 3 정책 따라 허용
5. **도메인 간 직접 의존 금지** — 도메인 A 가 도메인 B 의 모듈을 직접 의존하지 않음. `internaladaptor` 패턴으로 통신
6. **Groovy DSL** — `*.gradle` 파일 사용 (Java only 프로젝트 컨벤션 친화)

## 모듈 분리 단위

도메인 N 개 + 공통 모듈 K개 시 모듈 수 = `3N + 1 + K`. 본 사이클 default = K=1 (`:core` 만), 도메인 6개 가정 시 **20개**. 천기망 도메인 미확정 단계라 *플레이스홀더* 표기.

```
backend/
├── settings.gradle              # include 모든 모듈
├── build.gradle                 # 루트 (allprojects / subprojects 공통 설정)
├── gradle.properties            # Gradle 옵션 (parallel, caching, JVM args)
├── gradle/
│   └── wrapper/
├── buildSrc/                    # convention plugin (java/spring/test)
│   └── src/main/groovy/
│       ├── martial-arts.java-conventions.gradle
│       ├── martial-arts.spring-conventions.gradle
│       └── martial-arts.test-conventions.gradle
├── app/                         # Composition Root
│   ├── build.gradle
│   └── src/main/java/com/martialarts/
│       └── MartialArtsApplication.java
├── core/                        # 기본 공통 모듈 — 순수 Java 유틸·generic 타입 (의존 0)
│   ├── build.gradle
│   └── src/main/java/com/martialarts/core/
│       ├── util/                # StringUtils / DateUtils / CollectionUtils 등
│       └── type/                # Result<T> / Either<L,R> / Pair<A,B> 등 generic
├── <role>/                      # (도입 시) 책임별 라이브러리 모듈 — 책임명 직접 (예: spring-support, test-fixtures, time-util)
│   ├── build.gradle             # ※ common-* 접두사 금지 (모든 모듈 사용 가능 오해 방지)
│   └── src/main/java/com/martialarts/<role>/
└── <domain>/                    # 도메인 그룹 디렉토리 (예: order/, user/)
    ├── adapter/                  # 단일 모듈 — 내부에 inbound/outbound 패키지 분리
    │   ├── build.gradle
    │   └── src/main/java/com/martialarts/<domain>/adapter/
    │       ├── inbound/          # HTTP·Handler·DTO·도메인 정책 AOP·Kafka Consumer·internaladaptor inbound
    │       └── outbound/         # Port 구현·Mapper·persistence·외부 호출·internaladaptor outbound
    ├── domain/
    │   ├── build.gradle
    │   └── src/main/java/com/martialarts/<domain>/domain/
    └── infra/
        ├── build.gradle
        └── src/main/java/com/martialarts/<domain>/infra/
```

## 참조 방향 강제 방법

### 1. Gradle 의존성 (1차 강제 — 컴파일 타임)

각 sub-module 의 `build.gradle` 에서 *허용된* 의존만 선언:

| 모듈 | 의존 가능 |
|---|---|
| `:<domain>:domain` | (없음). 단 *필요 시* `:core` / `:<role>` 선택 의존 가능 |
| `:<domain>:adapter` | `:<domain>:domain`, `:<domain>:infra`. *필요 시* `:core` / `:<role>` 선택 의존 |
| `:<domain>:infra` | (없음 — domain 의존 금지). *필요 시* `:core` / `:<role>` 선택 의존 |
| `:app` | 모든 도메인의 3-sub (`adapter` / `domain` / `infra`). *필요 시* `:core` / `:<role>` 선택 의존 |
| `:core` | **(없음 — 의존 0)** ★ ArchUnit 강제 |
| `:<role>` | (없음 — 단방향, 다른 모듈 의존 금지). 단 *원칙적으로* `:core` 도 의존하지 않음 (SRP) |

위반 시 컴파일 실패.

### 2. 의존성 검증 task (2차 강제 — 빌드 시)

루트 `build.gradle` 에 의존성 검증 task 추가 (예시):

```groovy
subprojects {
    afterEvaluate {
        if (project.path.endsWith(':domain')) {
            // domain 모듈은 Spring/JPA 의존 금지
            configurations.all { config ->
                config.dependencies.all { dep ->
                    if (dep.group?.startsWith('org.springframework')
                        || dep.group?.startsWith('jakarta.persistence')
                        || dep.group?.startsWith('org.hibernate')) {
                        throw new GradleException(
                            "${project.path} 은 도메인 모듈로 ${dep.group}:${dep.name} 의존 금지")
                    }
                }
            }
        }
        if (project.path.endsWith(':infra')) {
            // infra 모듈은 같은 도메인의 domain 모듈 의존 금지
            def domainPath = project.path.replace(':infra', ':domain')
            configurations.all { config ->
                config.dependencies.all { dep ->
                    if (dep instanceof ProjectDependency
                        && dep.dependencyProject.path == domainPath) {
                        throw new GradleException(
                            "${project.path} (infra) 은 ${domainPath} (domain) 의존 금지 — infra=domain 모름 원칙")
                    }
                }
            }
        }
    }
}
```

### 3. ArchUnit (3차 강제 — 테스트 시)

`app/src/test/java/.../architecture/ArchitectureTest.java` 에서 패키지 차원 검증:

```java
@AnalyzeClasses(packages = "com.martialarts")
class ArchitectureTest {

    @ArchTest
    static final ArchRule domain_should_not_depend_on_spring =
        noClasses().that().resideInAPackage("..domain..")
            .should().dependOnClassesThat().resideInAnyPackage(
                "org.springframework..",
                "jakarta.persistence..",
                "org.hibernate.."
            );

    @ArchTest
    static final ArchRule infra_should_not_depend_on_domain =
        noClasses().that().resideInAPackage("..infra..")
            .should().dependOnClassesThat().resideInAnyPackage("..domain..");

    // 3-sub 모듈에서 핵심 — adapter 모듈 *내부* 패키지 차단 (Gradle 차원 차단 대신)
    @ArchTest
    static final ArchRule adapter_inbound_should_not_depend_on_outbound =
        noClasses().that().resideInAPackage("..adapter.inbound..")
            .should().dependOnClassesThat().resideInAPackage("..adapter.outbound..");

    @ArchTest
    static final ArchRule adapter_outbound_should_not_depend_on_inbound =
        noClasses().that().resideInAPackage("..adapter.outbound..")
            .should().dependOnClassesThat().resideInAPackage("..adapter.inbound..");

    @ArchTest
    static final ArchRule adapter_inbound_should_not_depend_on_infra =
        noClasses().that().resideInAPackage("..adapter.inbound..")
            .should().dependOnClassesThat().resideInAPackage("..infra..");

    @ArchTest
    static final ArchRule bdd_test_method_naming =
        methods().that().areAnnotatedWith(Test.class)
            .should().haveNameMatching("should_[a-zA-Z0-9]+_when_[a-zA-Z0-9]+");

    // 공통 모듈 정책 (Phase 9 — 2026-05-06 최종 정의)
    @ArchTest
    static final ArchRule core_should_not_depend_on_anything_external =
        noClasses().that().resideInAPackage("com.martialarts.core..")
            .should().dependOnClassesThat().resideInAnyPackage(
                "org.springframework..",
                "jakarta..",
                "org.hibernate..",
                "com.martialarts.<domain>..",  // 도메인 모듈 의존 금지
                "com.martialarts.<other-role>.."   // 다른 라이브러리 모듈 의존 금지
            );

    @ArchTest
    static final ArchRule core_should_only_contain_pure_java =
        classes().that().resideInAPackage("com.martialarts.core..")
            .should().onlyDependOnClassesThat().resideInAnyPackage(
                "java..",                       // JDK 표준만 허용
                "com.martialarts.core.."       // 자기 자신 패키지
            );

    // BFF 정책 (Phase 11 — 2026-05-06)
    // BFF 는 도메인의 Inbound Port (Handler 인터페이스) 만 의존, adapter·infra 직접 의존 금지
    @ArchTest
    static final ArchRule bff_should_only_depend_on_domain_inbound_port =
        noClasses().that().resideInAPackage("com.martialarts.bff..")
            .should().dependOnClassesThat().resideInAnyPackage(
                "com.martialarts..adapter..",      // 도메인 adapter 직접 의존 금지
                "com.martialarts..infra.."         // 도메인 infra 직접 의존 금지
            );

    // DB 스키마 분리 정책 (Phase 12 — 2026-05-06)
    // 도메인 A 의 Entity 가 도메인 B 의 catalog 매핑 금지
    @ArchTest
    static final ArchRule entity_catalog_should_match_domain =
        classes().that().resideInAPackage("com.martialarts.<domain>.infra.jpa.entity..")
            .and().areAnnotatedWith(Table.class)
            .should(haveCatalogMatching("martialarts_<domain>"));
    // (haveCatalogMatching 은 custom ArchCondition — domain placeholder 와 catalog 일치 검증)

    @ArchTest
    static final ArchRule no_cross_database_join_in_repository =
        // Native query 에 다른 도메인 database 참조 금지
        noClasses().that().resideInAPackage("com.martialarts.<domain>.infra.jpa.repository..")
            .should().beAnnotatedWith(annotationContainsCrossCatalogQuery("martialarts_"));

    @ArchTest
    static final ArchRule bff_assembler_should_not_contain_business_logic =
        // BFF assembler 는 *조립만* 수행 — 외부 라이브러리 의존도 최소
        classes().that().resideInAPackage("com.martialarts.bff.assembler..")
            .should().onlyDependOnClassesThat().resideInAnyPackage(
                "java..",
                "com.martialarts.bff..",           // 자기 자신 (controller, dto)
                "com.martialarts..domain.model..", // 도메인 model (Handler 반환값 받기 위함)
                "com.martialarts..domain.port.inbound..",  // Handler 인터페이스
                "com.martialarts.core.."           // 라이브러리 모듈 (선택 의존)
            );
}
```

> **3-sub ArchUnit 룰의 의미**: adapter 가 단일 Gradle 모듈이라 inbound/outbound 가 *컴파일 의존* 가능하다. 따라서 inbound 패키지에서 outbound 클래스를 import 하거나, inbound 패키지에서 infra 클래스를 직접 import 하는 *위반* 을 ArchUnit 으로 사후 검출한다 (4-sub 에서 Gradle 차원이 막아주던 것을 패키지 차원으로 강제).
>
> **공통 모듈 ArchUnit 룰의 의미** (Phase 9): `:core` 가 *의존 0* 임을 빌드 차원 + 테스트 차원 양쪽으로 강제. build.gradle 의 dependencies 가 비어있어야 하고, 코드 차원에서도 JDK 외의 어떤 패키지도 import 하지 않아야 한다. `:<role>` 추가 도입 시 동일 패턴으로 룰 추가.

## Gradle 설정 예시

### `settings.gradle`

```groovy
rootProject.name = 'martial-arts-backend'

include ':app'
include ':core'                              // 기본 공통 모듈 (Phase 9 — 의존 0)
// include ':<role>'                         // (도입 시) 책임명 직접 — 예: ':spring-support', ':test-fixtures'

// 도메인 추가 시 아래 3줄 패턴으로 추가
include ':<domain>:adapter'
include ':<domain>:domain'
include ':<domain>:infra'

// kebab-case 모듈 경로 → 디렉토리 매핑
project(':<domain>:adapter').projectDir = file('<domain>/adapter')
project(':<domain>:domain').projectDir = file('<domain>/domain')
project(':<domain>:infra').projectDir = file('<domain>/infra')

// 종속성 잠금 파일 검증 (reproducible build)
dependencyResolutionManagement {
    repositoriesMode = RepositoriesMode.FAIL_ON_PROJECT_REPOS
    repositories {
        mavenCentral()
    }
}
```

### 루트 `build.gradle`

```groovy
plugins {
    id 'java'
}

allprojects {
    group = 'com.martialarts'
    version = '0.0.1-SNAPSHOT'
}

subprojects {
    apply plugin: 'java'

    java {
        toolchain {
            languageVersion = JavaLanguageVersion.of(21)
        }
    }

    repositories {
        mavenCentral()
    }

    tasks.withType(Test).configureEach {
        useJUnitPlatform()
    }
}

// §참조 방향 강제 §2 의 의존성 검증 task 를 여기에 둘 수 있음
```

### `:<domain>:domain` 의 `build.gradle`

```groovy
plugins {
    id 'martial-arts.java-conventions'
    id 'java-test-fixtures'
}

dependencies {
    // 순수 Java POJO — Spring/JPA/외부 의존 금지

    // 테스트 도구만 testImplementation 허용
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.assertj:assertj-core:3.24.2'
    testImplementation 'org.mockito:mockito-core:5.7.0'

    // 픽스처는 별도 source set
    testFixturesImplementation 'org.junit.jupiter:junit-jupiter-api:5.10.0'
}
```

### `:<domain>:adapter` 의 `build.gradle`

```groovy
plugins {
    id 'martial-arts.spring-conventions'
}

dependencies {
    implementation project(':<domain>:domain')   // Port 호출 (inbound) + Port 구현 (outbound)
    implementation project(':<domain>:infra')    // outbound 패키지에서 Repository/Client 호출

    // inbound 패키지 (HTTP/Validation/OpenAPI)
    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'

    // outbound 패키지 (Spring 기본 컴포넌트)
    implementation 'org.springframework.boot:spring-boot-starter'

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation testFixtures(project(':<domain>:domain'))
}

// adapter 모듈 내부 패키지 차단 ArchUnit 룰은 :app 의 ArchitectureTest 에서 검증
// (inbound ↛ outbound / inbound ↛ infra / outbound ↛ inbound)
```

> **adapter 단일 모듈 정합성**: inbound 패키지에서 `org.springframework.boot:spring-boot-starter` 의존을 활용해도 됨 (outbound 가 같은 모듈이라 의존성 풀 공유). ArchUnit 룰로 *패키지 차원* 분리 강제.

### `:core` 의 `build.gradle` (Phase 9 — 2026-05-06 최종 정의)

```groovy
plugins {
    id 'martial-arts.java-conventions'  // ※ spring-conventions 사용 금지 (Spring 의존 도입)
}

dependencies {
    // ※ 의존 0 — 어떤 라이브러리·모듈·framework 도 의존하지 않는다 (순수 Java)
    // ※ Spring·JPA·외부 라이브러리·다른 모듈 의존 금지 — ArchUnit 으로 강제

    // 테스트 도구만 testImplementation 허용
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.assertj:assertj-core:3.24.2'
}
```

> **`:core` 의존 0 강제 메커니즘**:
> 1. `build.gradle` 검증: `dependencies { ... }` 블록에 `implementation` 의존이 0건 (테스트 도구는 testImplementation 만 허용)
> 2. ArchUnit 룰 (위 §3 참조) — `core` 패키지가 JDK 외 어떤 패키지도 import 하지 못하게 검증
>
> **(도입 시) `:<role>/build.gradle`** (예: `:spring-support`, `:test-fixtures`): 동일 패턴 (java-conventions + 의존 0 또는 책임에 맞는 최소 의존). 단 *다른 모듈 의존 금지* 는 항상 유지. **common-* 접두사 사용 금지**.

### `:<domain>:infra` 의 `build.gradle`

```groovy
plugins {
    id 'martial-arts.spring-conventions'
}

dependencies {
    // ※ project(':<domain>:domain') 의존 금지 — infra=domain 모름 원칙
    // ※ infra = 외부 시스템 *통신 코드 전용* + JPA 전체 도구 설정 (Phase 13)
    // ※ AOP / 글로벌 횡단 만 app 모듈로 (매트릭스 v3 — JPA 는 Phase 13 으로 infra 통일)

    implementation 'org.springframework.boot:spring-boot-starter-data-jpa'  // Entity·Repository·DataSource·EMF
    implementation 'org.springframework.cloud:spring-cloud-starter-openfeign'  // FeignClient (RestTemplate 금지)
    implementation 'org.mariadb.jdbc:mariadb-java-client:3.3.0'
    implementation 'com.zaxxer:HikariCP'  // Connection pool (도메인별 풀, Phase 13)
    implementation 'org.liquibase:liquibase-core:4.25.0'  // 도메인별 partial changelog

    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.testcontainers:junit-jupiter:1.19.3'
    testImplementation 'org.testcontainers:mariadb:1.19.3'
}
```

#### `:<domain>:infra` 패키지 트리 (매트릭스 v3 기준)

```
<domain>/infra/src/main/java/com/martialarts/<domain>/infra/
├── jpa/
│   ├── <Domain>JpaConfig.java  # 도메인별 DataSource + EMF + JPA properties (Phase 13)
│   ├── entity/                 # JPA Entity 정의
│   │   └── base/               # Base Entity (공통 컬럼)
│   ├── repository/             # Spring Data Repository
│   └── auditing/               # @EnableJpaAuditing + Auditor (Phase 13)
├── kafka/
│   └── message/                # Kafka 메시지 DTO (순수 — 도메인 모름)
├── redis/                      # Redis DAO (도입 시)
├── opensearch/                 # OpenSearch Document (도입 시)
├── restapi/                    # FeignClient
│   └── <service>/
│       ├── <Service>Client.java          # @FeignClient interface
│       ├── <Service>ClientConfiguration.java  # @EnableFeignClients
│       └── resource/
│           ├── <Service>Request.java
│           └── <Service>Response.java
└── liquibase/                  # 도메인별 partial changelog
                                # (또는 src/main/resources/db/changelog/<domain>/)

# ※ 매트릭스 v3 — 다음은 infra 가 아닌 `:app` 모듈에 위치:
#    DataSourceConfig / EntityManagerFactory bean / JpaAuditingConfig / @EnableJpaAuditing
#    AOP 글로벌·모듈 공용 / GlobalExceptionHandler / WebMvcConfig / Servlet Filter
# ※ Mapper (Entity ↔ 도메인 변환) 는 `:<domain>:adapter/outbound/mapper/` 위치 (infra 는 도메인 모름)
```

### `app/build.gradle`

```groovy
plugins {
    id 'martial-arts.spring-conventions'
    id 'org.springframework.boot' version '3.4.0'
    id 'io.spring.dependency-management' version '1.1.4'
}

dependencies {
    // 모든 도메인의 3-sub 의존 (Composition Root + BFF — Phase 11)
    // ※ :<domain>:domain 의존이 BFF 가 Inbound Port (Handler) 호출하기 위한 핵심 영역
    implementation project(':<domain>:adapter')
    implementation project(':<domain>:domain')        // BFF 가 Handler 인터페이스 의존
    implementation project(':<domain>:infra')

    implementation 'org.springframework.boot:spring-boot-starter-web'
    implementation 'org.springframework.boot:spring-boot-starter-actuator'
    implementation 'org.springframework.boot:spring-boot-starter-aop'  // 글로벌·모듈 공용 AOP (매트릭스 v3)
    implementation 'org.springframework.boot:spring-boot-starter-validation'
    implementation 'org.springdoc:springdoc-openapi-starter-webmvc-ui:2.2.0'  // OpenAPI 명세 export
    // ※ JPA 의존은 :<domain>:infra 에 위치 (Phase 13 — JPA = infra 일관)
    // ※ Liquibase 의존도 :<domain>:infra 에 위치 (도메인별 자체 master)

    // ArchUnit 아키텍처 테스트
    testImplementation 'com.tngtech.archunit:archunit-junit5:1.2.1'
    testImplementation 'org.springframework.boot:spring-boot-starter-test'
    testImplementation 'org.testcontainers:junit-jupiter:1.19.3'
    testImplementation 'org.testcontainers:mariadb:1.19.3'
    testImplementation 'io.rest-assured:rest-assured:5.4.0'
}

bootJar {
    enabled = true
    mainClass = 'com.martialarts.MartialArtsApplication'
}

// OpenAPI 명세 export
tasks.register('exportOpenApi', JavaExec) {
    group = 'documentation'
    classpath = sourceSets.main.runtimeClasspath
    mainClass = 'org.springdoc.openapi.gradle.plugin.OpenApiGenerator'
    // 빌드 후 app/build/openapi/openapi.json 으로 export
}
build.finalizedBy 'exportOpenApi'
```

## convention plugin (buildSrc/)

### `buildSrc/build.gradle`

```groovy
plugins {
    id 'groovy-gradle-plugin'
}

repositories {
    gradlePluginPortal()
    mavenCentral()
}
```

### `buildSrc/src/main/groovy/martial-arts.java-conventions.gradle`

```groovy
plugins {
    id 'java'
}

java {
    toolchain {
        languageVersion = JavaLanguageVersion.of(21)
    }
}

tasks.withType(JavaCompile).configureEach {
    options.encoding = 'UTF-8'
    options.compilerArgs << '-parameters'
}

tasks.withType(Test).configureEach {
    useJUnitPlatform()
}
```

### `buildSrc/src/main/groovy/martial-arts.spring-conventions.gradle`

```groovy
plugins {
    id 'martial-arts.java-conventions'
    id 'io.spring.dependency-management'
}

dependencyManagement {
    imports {
        mavenBom 'org.springframework.boot:spring-boot-dependencies:3.4.0'
    }
}
```

### `buildSrc/src/main/groovy/martial-arts.test-conventions.gradle`

```groovy
plugins {
    id 'martial-arts.java-conventions'
}

dependencies {
    testImplementation 'org.junit.jupiter:junit-jupiter:5.10.0'
    testImplementation 'org.assertj:assertj-core:3.24.2'
    testImplementation 'org.mockito:mockito-core:5.7.0'
}
```

## 도메인 추가 절차

새 도메인 (예: `<newdomain>`) 추가 시 절차:

1. **디렉토리 생성**:
   ```
   backend/<newdomain>/
   ├── adapter/build.gradle + src/main/java/com/martialarts/<newdomain>/adapter/{inbound,outbound}/...
   ├── domain/build.gradle + src/main/java/...
   └── infra/build.gradle + src/main/java/...
   ```
2. **`settings.gradle` 3 줄 추가** (위 §settings.gradle 패턴 — `:<newdomain>:adapter` / `:<newdomain>:domain` / `:<newdomain>:infra`).
3. **각 sub-module 의 `build.gradle`** 작성 — 위 도메인별 예시 참조 (의존 방향 준수).
4. **`app/build.gradle` 의 dependencies 에 3 줄 추가** — 새 도메인 3-sub 를 implementation.
5. **Database 생성** (Phase 12 — 도메인별 database):
   - `CREATE DATABASE IF NOT EXISTS martialarts_<newdomain>;` (Liquibase changeset 으로 자동화 가능)
   - 운영 환경 권한: `GRANT ALL ON martialarts_<newdomain>.* TO ...`
6. **Liquibase changelog**:
   - 도메인별 master: `<newdomain>/infra/src/main/resources/db/changelog/<newdomain>/db.changelog-<newdomain>.yaml` (자체 master, *도메인 전담 database* 대상)
   - 도메인별 partial 첫 changeset: `001-init-<aggregate>.yaml`
   - `<newdomain>:infra/jpa/` 안에 자체 `LiquibaseProperties` Bean 등록 (*도메인 전담 database* 마이그레이션)
7. **EntityManagerFactory + Entity catalog**:
   - `<newdomain>:infra/jpa/<NewDomain>JpaConfig.java` — `default_catalog = martialarts_<newdomain>` 설정
   - 또는 각 Entity 의 `@Table(catalog = "martialarts_<newdomain>", name = "...")` 명시
8. **빌드 검증**: `./gradlew :<newdomain>:domain:build` → `./gradlew :app:build` → `./gradlew :app:test` (ArchUnit 통과 확인 — entity catalog 일치 / cross-database JOIN 부재 / 헥사고날 의존 등).
9. **라이브러리 모듈 의존 (선택)**: 새 도메인이 `:core` 또는 `:<role>` 의 유틸을 *필요할 때만* `dependencies { implementation project(':core') }` 추가. 모든 도메인이 `:core` 를 의존할 필요 없음 (선택적 의존 — 라이브러리 형식, Phase 9 — 2026-05-06 최종 정의).

## 라이브러리 모듈 추가 절차 (`:<role>` 신규 — 책임명 직접)

`:core` 가 책임 못 지는 새 공통 영역 발견 시 (예: Spring 헬퍼·테스트 픽스처 generic):

1. **책임 식별**: 신규 공통 모듈의 *단일 책임* 명시 (예: "Spring 의존 헬퍼만"). SRP 위반 시 도입 보류.
2. **디렉토리 생성**: `backend/<role>/{build.gradle, src/main/java/com/martialarts/<role>/...}` — 책임명 직접 (예: `backend/spring-support/`, `backend/test-fixtures/`). **common-* 접두사 금지**.
3. **`settings.gradle` 1 줄 추가**: `include ':<role>'` (예: `include ':spring-support'`)
4. **`build.gradle` 작성**: `:core` 와 동일 패턴 (`java-conventions` + 책임에 맞는 최소 의존, 단 *다른 모듈 의존 금지* 는 항상 유지).
5. **ArchUnit 룰 추가**: 위 §3 의 `core_should_not_depend_on_anything_external` 패턴을 `<role>` 에 동일 적용.
6. **사용처에서 선택 의존**: *필요한* 도메인/모듈의 build.gradle 에 `implementation project(':<role>')` 추가.

## 참고

- BE 아키텍처 결정 SSOT: [be-architecture.md](./be-architecture.md)
- BE 단일 기준점 (private): `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md`
- BE 코디네이터: `.claude/agents/agent-backend.md` (symlink → `.private-config/martial-world/claude/claude-agents/`)
- BE 리뷰어: `.claude/agents/agent-backend-reviewer.md` (symlink → `.private-config/martial-world/claude/claude-agents/`)
- 메타 워크플로우: `.private-config/shared/prompt/read_only/vibe-coding-flow.md`
- ArchUnit: https://www.archunit.org/
- Gradle Groovy DSL: https://docs.gradle.org/current/userguide/groovy_build_script_primer.html
