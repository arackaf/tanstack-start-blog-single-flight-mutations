type LoaderLookup = Record<string, (...args: unknown[]) => Promise<unknown>>;

export const loaderLookup: LoaderLookup = {};
