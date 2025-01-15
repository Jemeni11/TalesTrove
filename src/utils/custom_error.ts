export default function customError(
  error: Error | undefined,
  message: string,
  name: string
): never {
  const newError = new Error(message, { cause: error?.cause || error });
  newError.name = name || error?.name || "CustomError";
  throw newError;
}
