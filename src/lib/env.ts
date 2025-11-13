type EnvOptions = {
  optional?: boolean;
  fallback?: string;
};

const readFromImportMeta = (key: string): string | undefined => {
  return (import.meta.env as Record<string, string | undefined>)[key];
};

const readFromProcess = (key: string): string | undefined => {
  if (typeof process === "undefined") {
    return undefined;
  }

  return process.env?.[key];
};

export const getEnvVariable = (key: string, options?: EnvOptions): string => {
  const value = readFromImportMeta(key) ?? readFromProcess(key) ?? options?.fallback;

  if (value && value.trim().length > 0) {
    return value;
  }

  if (options?.optional) {
    return "";
  }

  const errorMessage = `Missing required environment variable: ${key}`;
  console.error(errorMessage);
  throw new Error(errorMessage);
};
