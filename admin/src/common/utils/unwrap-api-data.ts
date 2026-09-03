export type ApiEnvelope<T> = {
  success: boolean;
  statusCode: number;
  message: string;
  timestamp: string;
  path: string;
  data: T;
};

export function isApiEnvelope<T>(value: unknown): value is ApiEnvelope<T> {
  return (
    !!value &&
    typeof value === 'object' &&
    'success' in value &&
    'statusCode' in value &&
    'data' in value
  );
}

function isControllerDataWrapper(
  value: unknown,
): value is { data: unknown } {
  if (!value || typeof value !== 'object' || !('data' in value)) {
    return false;
  }
  const record = value as Record<string, unknown>;
  const keys = Object.keys(record);
  if (keys.length !== 1 || keys[0] !== 'data') {
    return false;
  }
  const inner = record.data;
  return inner !== null && typeof inner === 'object' && !isApiEnvelope(inner);
}

/** Unwrap Nest TransformInterceptor envelope `{ success, data, ... }`. */
export function unwrapApiData<T>(body: unknown): T {
  let current: unknown = body;

  while (isApiEnvelope<unknown>(current)) {
    current = current.data;
  }

  // Some controllers return `{ data: entity }` and the interceptor wraps that whole object.
  while (isControllerDataWrapper(current)) {
    current = current.data;
  }

  return current as T;
}
