export default function customError(
  error: Error | undefined,
  name: string,
  message: string,
  cause?: string
): never {
  const newError = new Error(message, {
    cause: cause || error?.cause || error
  });
  newError.name = name || error?.name || "CustomError";
  throw newError;
}
