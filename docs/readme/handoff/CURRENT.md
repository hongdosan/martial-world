# Handoff — 2026-09-05 — martial-arts → martial-world 네임스페이스 마이그레이션 (진행 중)

<!-- Proprietary — Copyright © 2026 홍혁준. See LICENSE. -->

> Tier 2 (Document & Clear). 본 문서는 *fact* 가 아닌 **hypothesis** — 새 세션은 인용된 파일을 직접 Read 도구로 읽고 코드/실제 상태와 대조 검증한 후 작업을 이어간다.
>
> **STATUS — 네임스페이스 마이그레이션 부분 완료** / README.md 대량 정정 + GH Pages 복구 + develop→release merge ⏳ 대기
>
> **선행 사이클 history**: `git log -p docs/readme/handoff/CURRENT.md` (본문) + [`../harness/harness-state.md`](../harness/harness-state.md) 변경 이력 (인덱스). *dated 파일 정책 폐기 — 2026-05-16~*

## Summary

`hongdosan/martial-arts` → `hongdosan/martial-world` GitHub 리네임 후속 정합화. **2 세션 누적**, 본 세션은 사용량 여유 부족으로 **README.md 대량 정정 / GH Pages 복구 / release merge = deferred**. 서브모듈 (`.private-config`) 은 이번에 잔여 self-reference 6개 파일 정정 + 상대경로 (`../shared/`) 복구까지 완료.

### 완료 (이전 세션 + 본 세션 누적)

**이전 세션:**
- 로컬 폴더 `martial-arts/` → `martial-world/` rename → Bash cwd 무효화로 세션 종료
- `.idea/vcs.xml` 원복 (상위 `$PROJECT_DIR$` Git 매핑 복구)
- `.gitignore` `/node_modules` 추가 (root 레벨 재발 방지)
- root `node_modules/` 삭제
- 서브모듈 (`.private-config`) 에 `martial-world/{claude,frontend,backend}` 이동 완료 (`c11f8e7`)
- 메인 저장소 서브모듈 포인터 갱신 (`864661a`)

**본 세션 (2026-09-05):**
- `chore: martial-arts → martial-world 네임스페이스 마이그레이션 잔여 정리` (`16fe702`) — .iml rename / .idea/modules.xml / .gitignore / docs stale 2건
- `chore: .serena/project.yml — project_name 갱신 + Serena 스키마 자동 업그레이드` (`503d84d`)
- `chore: martial-world/ 하위 self-reference + ../shared/ 상대경로 정정` (서브모듈 `966ea51`) — CLAUDE.md + agent-{backend,backend-reviewer,frontend,frontend-reviewer,game-master}.md 6개 파일. self-reference `.private-config/claude/...` → `.private-config/martial-world/claude/...` + `../shared/` → `../../shared/` (CLAUDE.md) / `../../shared/` → `../../../shared/` (agent-*.md)
- `chore: bump .private-config submodule to 966ea51` (`d18a865`)

### Deferred (다음 세션 우선순위)

| # | 항목 | 위치 | 비고 |
|---|------|------|------|
| **1** | **`.private-config/README.md` 대량 정정** | 서브모듈 root | 별도 사이클 필요. 아래 §"README.md 정정 배치" 참조 |
| 2 | `frontend/vite.config.ts:6` base | 메인 | `'/martial-arts/'` → `'/martial-world/'` |
| 3 | GH Pages source legacy → workflow | GitHub | `gh api repos/hongdosan/martial-world/pages -X PUT -f build_type=workflow` |
| 4 | `develop → release` fast-forward merge push | 메인 | release 브랜치 67 커밋 뒤처짐 → workflow trigger |
| 5 | https://hongdosan.github.io/martial-world/ 접속 확인 | 배포 | workflow 성공 후 |
| 6 | `harness-state.md` 변경 이력 1행 추가 | 메인 | 본 마이그레이션 사이클 총괄 (2행 — 이전 세션 + 본 세션) |
| 7 | `.private-config/martial-world/claude/CLAUDE.md` 변경 이력 1행 | 서브모듈 | 이번 마이그레이션 record |
| 8 | 서브모듈 `../../docs/` 상대경로 정합 (선택) | 서브모듈 | 사전 존재 broken 경로 — 별도 사이클로 미룰 것 |

## README.md 정정 배치 (다음 세션 실행)

`.private-config/README.md` 는 c11f8e7 (namespace) 반영이 미완. 아래를 참조해 순차 편집:

### URL / repo 참조

- 라인 5, 240: `[martial-arts](https://github.com/hongdosan/martial-arts)` → `[martial-world](https://github.com/hongdosan/martial-world)`
- 라인 121: `git clone --recursive https://github.com/hongdosan/martial-arts.git` → `.../martial-world.git`
- 라인 123: `cd martial-arts` → `cd martial-world`
- 라인 241: docs URL host `hongdosan/martial-arts` → `hongdosan/martial-world`

### 디렉토리 구조 (line 26-69) — 트리 재구조

현재 파일 시스템 실체:
```
.private-config/
├── README.md
├── heries/                    # H-eries
├── martial-arts/README.md    # 별도 우산 스텁 (건드리지 X)
├── martial-world/             # 천기망
│   ├── backend/
│   ├── claude/{CLAUDE.md, claude-agents/, claude-artifact/, plan/}
│   └── frontend/env/
└── shared/{guideline/, issue/, prompt/}   # 천기망 공용 (root 유지)
```

트리 표를 위와 정합화하고, 아래 표들 (line 73~90 소유자·격리 표, line 100~105 symlink 표) 을 `martial-world/` prefix 로 갱신.

### 워크플로우 예시 (line 147, 183~205)

- `claude/claude-agents/agent-backend.md` → `martial-world/claude/claude-agents/agent-backend.md`
- `### \`claude/\` 에 추가` → `### \`martial-world/claude/\` 에 추가` (동일 패턴 frontend/backend)
- `.private-config/backend/...` (line 204) → `.private-config/martial-world/backend/...`

### 주의사항 (line 216-217)

- `(\`claude/\` / \`shared/\` / \`frontend/\` / \`backend/\`)` → `(\`martial-world/\` / \`shared/\`)`
- `shared/` 는 root 유지 (`martial-world/` 미이동 확인됨 — 이전 커밋 `c11f8e7` scope 확인)

### skip 대상

- `shared/prompt/plan/fe-vite-migration/*.md` — 역사적 plan 문서. 당시 결정 재구성 방지 위해 유지
- `.private-config/martial-arts/README.md` 스텁 — 다른 프로젝트 (`hongdosan/martial-arts` 우산) 예약. 건드리지 X

## 결정된 핵심 영역

### 네임스페이스 마이그레이션 원칙

- **저장소 이름**: `martial-arts-config` (서브모듈) 는 그대로 유지 — URL/SHA/clone 명령 안정성 (결정 #18 재확인)
- **`martial-arts/` vs `martial-world/`**: 서브모듈 root 의 `martial-arts/` 폴더는 별도 프로젝트 (`hongdosan/martial-arts` — 무협 통합 우산 예약) 스텁. 천기망 = `martial-world/`
- **상대경로 복구**: c11f8e7 이동으로 `../shared/` 계열 링크 1레벨 위로 밀림 — 6개 agent 파일 이번 세션에 복구 완료. `../../docs/` 계열은 사전 broken 상태 → 별도 사이클 (docs/ 는 메인 저장소, submodule 상대경로로는 도달 불가능)

### GH Pages 배포 (deferred)

- release 브랜치 상태: develop 대비 67 커밋 뒤 — fast-forward merge 필요
- Pages source: legacy → workflow 전환 필수 (`.github/workflows/static.yml` 이 trigger 가 되도록)
- vite base: `'/martial-arts/'` → `'/martial-world/'` (repo path 변경 반영)

## Traps to Avoid

- **서브모듈 push 순서**: 서브모듈 먼저 push → 메인 저장소 포인터 bump → 메인 push (2단계 커밋 원칙)
- **README.md `shared/` 항목**: `shared/` 는 root 유지 (c11f8e7 scope 확인 — `claude/frontend/backend` 만 이동). `martial-world/shared/` 로 오정정 금지
- **`.private-config/martial-arts/README.md` 건드리지 X** — 별도 프로젝트 예약 스텁
- **`shared/prompt/plan/fe-vite-migration/*` 역사 문서 건드리지 X**
- **release 브랜치 force push 금지** — fast-forward 로 충분 (67 커밋 순방향)
- **develop protected bypass 유지** — 이미 push 됨, 롤백은 destructive
- **`.private-config/heries/` 무관** (선행 원칙 유지)
- **`.private-config` 작업 시 `git pull` 먼저** (선행 원칙 유지)

## Working Agreements (선행 상속)

- 명시적 지시는 우회 없이 직접 실행 / 티키타카 대화 우선
- **2단계 commit** — 서브모듈 먼저, 메인이 포인터 갱신
- **Closure Discipline** — 커밋 메시지 SSOT 는 plan 의 *제안 커밋 메시지 초안*
- Push 는 사용자 본인 진행 (단 서브모듈 push 는 2단계 필수이므로 Claude 진행)
- 변경 이력은 [`harness-state.md`](../harness/harness-state.md) 단일 출처
- **미래 처리보다 지금 사전 방지** (2026-05-16)
- **`.private-config` 작업 시 `git pull` 먼저** (2026-05-16)

## Prompt for New Chat

```
천기망 martial-arts → martial-world 네임스페이스 마이그레이션 마무리 사이클.

먼저 다음 파일을 Read 도구로 읽고 본 핸드오프 주장 검증:
1. docs/readme/handoff/CURRENT.md (본 핸드오프)
2. .private-config/README.md (정정 대상 원본)
3. frontend/vite.config.ts (base 확인)
4. docs/readme/harness/harness-state.md (변경 이력 정책)

검증 후 순서대로 진행:

[1단계] .private-config/README.md 대량 정정 (본 핸드오프 §"README.md 정정 배치" 참조):
  · URL / repo 참조 (라인 5, 121, 123, 240, 241)
  · 디렉토리 구조 트리 재구조 (line 26-69) — 실제 파일 시스템과 정합
  · 소유자/격리 표 (line 73~90) 갱신
  · symlink 표 (line 100~105) — martial-world/ prefix
  · 워크플로우 예시 (line 147, 183~205)
  · 주의사항 (line 216-217)
  · shared/ 는 root 유지 (c11f8e7 scope) — 오정정 금지
  · martial-arts/README.md 스텁 및 shared/prompt/plan/fe-vite-migration/* 는 skip

[2단계] 서브모듈 2단계 commit:
  · cd .private-config && git pull → commit → push origin main
  · 메인 저장소로 돌아와 git add .private-config → commit
  · 커밋 메시지: chore: .private-config/README.md 네임스페이스 마이그레이션 정합

[3단계] frontend/vite.config.ts:6 base 정정:
  · '/martial-arts/' → '/martial-world/'

[4단계] GH Pages source 전환:
  · gh api repos/hongdosan/martial-world/pages -X PUT -f build_type=workflow

[5단계] develop → release fast-forward merge push:
  · git checkout release && git merge --ff-only origin/develop && git push
  · workflow trigger 후 https://hongdosan.github.io/martial-world/ 접속 확인

[6단계] harness-state.md 변경 이력 1행 추가:
  · 이번 마이그레이션 사이클 (2 세션 총괄)

[7단계] .private-config/martial-world/claude/CLAUDE.md 변경 이력 1행 추가:
  · 서브모듈 정합 record

원칙 (반드시 준수):
  · 서브모듈 push 순서: 서브모듈 먼저 → 메인 포인터 bump
  · shared/ 는 root 유지 (오정정 금지)
  · release 브랜치 force push 금지 (fast-forward)
  · .private-config 작업 시 git pull 먼저
  · agent-game-master 사용자 직영 트랙
```

## 참고

- 4-Tier 가이드: [`README.md`](./README.md)
- 변경 이력 단일 출처: [`harness-state.md`](../harness/harness-state.md)
- 본 사이클 헌장: [`vision.md`](../planning/vision.md) (마이그레이션은 헌장 무관 — 정합화 작업)
- BE 단일 기준점: `.private-config/shared/prompt/read_only/backend/be_reference_prompt.md` *(private)*
- FE 단일 기준점: `.private-config/shared/prompt/read_only/frontend/fe_reference_prompt.md` *(private)*
- 메타 워크플로우 SSOT: `.private-config/shared/prompt/read_only/vibe-coding-flow.md` *(private)*
- 공유 저장소 안내: `.private-config/README.md` *(submodule — 본 사이클 정정 대상)*
