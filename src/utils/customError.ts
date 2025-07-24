type CustomErrorOptions = {
  name: string;
  message?: string;
  cause?: unknown;
  originalError?: Error;
  partial?: unknown;
};

export default function customError({
  name,
  message,
  cause,
  originalError,
  partial
}: CustomErrorOptions): never {
  const err = new Error(message ?? originalError?.message ?? "Unknown error", {
    cause: cause ?? originalError?.cause
  });

  err.name = name;

  if (partial !== undefined) {
    (err as any).partial = partial;
  }

  throw err;
}
