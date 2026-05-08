/**
 * 캐시 키 컨벤션 (SSOT §5.3): [entity, params] 배열.
 * 도메인 entity 가 확정되면 본 파일에 entity별 헬퍼 추가.
 *
 * 예시 (기획 사이클 후 도입):
 *   export const userKeys = {
 *     all: ['user'] as const,
 *     detail: (id: string) => ['user', { id }] as const,
 *   };
 */
export {};
