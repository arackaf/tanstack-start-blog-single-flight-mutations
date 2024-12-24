import { QueryKey, useQuery, UseQueryOptions, UseQueryResult } from "@tanstack/react-query";

type OtherQueryOptions = Omit<Partial<UseQueryOptions>, "queryFn" | "queryKey">;

type UseQueryLoader<T extends unknown[], Res> = {
  (...args: T): UseQueryResult<Res>;
  load: (...args: T) => Promise<Res>;
};
const createLoader = <T extends unknown[], Res>(
  runQuery: (...args: T) => Promise<Res>,
  createQueryKey: (...args: T) => QueryKey,
  otherOptions: OtherQueryOptions = {},
): UseQueryLoader<T, Res> => {
  const useData = (...args: T) => {
    return useQuery({
      queryKey: createQueryKey(...args),
      queryFn: async () => {
        return runQuery(...args);
      },
    });
  };

  useData.load = (...args: T) => runQuery(...args);
  // TODO: some indirection code so we can reference load function in server-side middleware via hidden uuid or whatever
  return useData;
};

const useTasks = createLoader(
  // args list is strongly typed in both - must be (page: number)
  (page: number) => fetch(`/api/tasks/?page=${page}`),
  page => ["tasks", "list", page],
  // ^?
);

const Junk = () => {
  const { data, isLoading, error, dataUpdatedAt, isError /* etc */ } = useTasks(1);
  //                                                                   ^?

  //or do this ... in middleware >:-)
  useTasks.load(1);
  //        ^?

  return <div />;
};
