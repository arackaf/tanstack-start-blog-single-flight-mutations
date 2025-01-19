import {
  QueryKey,
  UseBaseQueryOptions,
  DefaultError,
  queryOptions,
  UnusedSkipTokenOptions,
} from "@tanstack/react-query";
import { loaderLookup } from "./loaderLookup";

type OtherQueryOptions<TQueryFnData = unknown, TError = DefaultError> = Omit<
  Partial<UseBaseQueryOptions<TQueryFnData, TError>>,
  "queryFn" | "queryKey"
>;

let currentQueryId = 1;

type UseQueryLoader<LoaderArgs extends unknown[], TQueryFnData = unknown, TError = DefaultError> = {
  load: (...args: LoaderArgs) => Promise<TQueryFnData>;
  queryOptions: (...args: LoaderArgs) => UnusedSkipTokenOptions<TQueryFnData, TError>;
};
export const createLoader = <LoaderArgs extends unknown[], TQueryFnData = unknown, TError = DefaultError>(
  createQueryKey: (...args: LoaderArgs) => QueryKey,
  runQuery: (...args: LoaderArgs) => Promise<TQueryFnData>,
  otherOptions: OtherQueryOptions<TQueryFnData, TError> & { queryLabel?: string } = {},
): UseQueryLoader<LoaderArgs, TQueryFnData, TError> => {
  const meta = otherOptions.meta || {};
  const queryId = otherOptions.queryLabel || currentQueryId++;

  console.log("!!!! Creating loader", queryId);

  loaderLookup[queryId] = runQuery;

  const getQueryOptions = (...args: LoaderArgs) => {
    Object.assign(meta, {
      __middlewareQueryInfo: { queryId, args },
    });

    return queryOptions({
      queryKey: createQueryKey(...args),
      queryFn: async () => {
        return runQuery(...args);
      },
      ...otherOptions,
      meta,
    });
  };

  return {
    load: (...args: LoaderArgs) => runQuery(...args),
    queryOptions: getQueryOptions,
  };
  // TODO: some indirection code so we can reference load function in server-side middleware via hidden uuid or whatever
  //return useData;
};
