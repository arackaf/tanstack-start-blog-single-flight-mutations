import { QueryKey, useQuery, UseBaseQueryOptions, UseQueryResult, DefaultError } from "@tanstack/react-query";

type OtherQueryOptions<TQueryFnData = unknown, TError = DefaultError> = Omit<
  Partial<UseBaseQueryOptions<TQueryFnData, TError>>,
  "queryFn" | "queryKey"
>;

type UseQueryLoader<T extends unknown[], TQueryFnData = unknown, TError = DefaultError> = {
  (...args: T): UseQueryResult<TQueryFnData, TError>;
  load: (...args: T) => Promise<TQueryFnData>;
};
const createLoader = <T extends unknown[], TQueryFnData = unknown, TError = DefaultError>(
  createQueryKey: (...args: T) => QueryKey,
  runQuery: (...args: T) => Promise<TQueryFnData>,
  otherOptions: OtherQueryOptions<TQueryFnData, TError> = {},
): UseQueryLoader<T, TQueryFnData, TError> => {
  const useData = (...args: T) => {
    return useQuery({
      queryKey: createQueryKey(...args),
      queryFn: async () => {
        return runQuery(...args);
      },
      ...otherOptions,
    });
  };

  useData.load = (...args: T) => runQuery(...args);
  // TODO: some indirection code so we can reference load function in server-side middleware via hidden uuid or whatever
  return useData;
};

const useTasks = createLoader(
  // args list is strongly typed in both - must be (page: number)
  page => ["tasks", "list", page],
  // ^?
  (page: number) => fetch(`/api/tasks/?page=${page}`),
);

const Junk = () => {
  const { data, isLoading, error, dataUpdatedAt, isError /* etc */ } = useTasks(1);
  //                                                                   ^?

  //or do this ... in middleware >:-)
  useTasks.load(1);
  //        ^?

  return <div />;
};
