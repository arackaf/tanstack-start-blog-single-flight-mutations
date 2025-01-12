import { QueryKey, useQuery, UseBaseQueryOptions, UseQueryResult, DefaultError } from "@tanstack/react-query";
import { Task } from "../../types";
import { loaderLookup } from "./loaderLookup";

type OtherQueryOptions<TQueryFnData = unknown, TError = DefaultError> = Omit<
  Partial<UseBaseQueryOptions<TQueryFnData, TError>>,
  "queryFn" | "queryKey"
>;

let currentQueryId = 1;

type UseQueryLoader<LoaderArgs extends unknown[], TQueryFnData = unknown, TError = DefaultError> = {
  (...args: LoaderArgs): UseQueryResult<TQueryFnData, TError>;
  load: (...args: LoaderArgs) => Promise<TQueryFnData>;
};
const createLoader = <LoaderArgs extends unknown[], TQueryFnData = unknown, TError = DefaultError>(
  createQueryKey: (...args: LoaderArgs) => QueryKey,
  runQuery: (...args: LoaderArgs) => Promise<TQueryFnData>,
  otherOptions: OtherQueryOptions<TQueryFnData, TError> & { queryLabel?: string } = {},
): UseQueryLoader<LoaderArgs, TQueryFnData, TError> => {
  const meta = otherOptions.meta || {};
  const queryId = otherOptions.queryLabel || currentQueryId++;

  loaderLookup[queryId] = runQuery;

  const useData = (...args: LoaderArgs) => {
    Object.assign(meta, {
      __middlewareQueryInfo: { queryId, args },
    });

    return useQuery({
      queryKey: createQueryKey(...args),
      queryFn: async () => {
        return runQuery(...args);
      },
      ...otherOptions,
      meta,
    });
  };

  useData.load = (...args: LoaderArgs) => runQuery(...args);
  // TODO: some indirection code so we can reference load function in server-side middleware via hidden uuid or whatever
  return useData;
};

const useTasks = createLoader(
  // args list is strongly typed in both - must be (page: number)
  page => ["tasks", "list", page],
  // ^?
  (page: number) => fetch(`/api/tasks/?page=${page}`).then(async res => (await res.json()) as Task[]),
);

const Junk = () => {
  const { data, isLoading, error, dataUpdatedAt, isError /* etc */ } = useTasks(1);
  //                                                                   ^?

  //or do this ... in middleware >:-)
  useTasks.load(1);
  //        ^?

  return <div />;
};
