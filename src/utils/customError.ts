export default function customError(
  name: string,
  message: string,
  error?: Error,
  cause?: unknown
): never {
  const newError = new Error(message, {
    cause: cause ?? error?.cause ?? message
  });

  newError.name = name;

  throw newError;
}
