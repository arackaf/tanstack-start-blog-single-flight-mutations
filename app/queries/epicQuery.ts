import { queryOptions, QueryOptions, UseBaseQueryOptions, UseQueryOptions } from "@tanstack/react-query";
import { fetchJson } from "../../backend/fetchUtils";
import { createLoader } from "../lib/queryUtils";

export type Epic = {
  id: string;
  name: string;
};

export const epicLoader = createLoader(
  (_: number, epicId: string | number) => ["epic", epicId],
  async (timestarted: number, epicId: string | number) => {
    const timeDifference = +new Date() - timestarted;

    console.log(`Loading api/epic/${epicId} data at`, timeDifference);
    const epic = await fetchJson<Epic>(`api/epics/${epicId}`);
    return epic;
  },
);

export const epicQueryOptions = (timestarted: number, id: string | number) => {
  id = Number(id);

  return queryOptions({
    queryKey: ["epic", id],
    queryFn: async () => {
      const timeDifference = +new Date() - timestarted;

      console.log(`Loading api/epic/${id} data at`, timeDifference);
      const epic = await fetchJson<Epic>(`api/epics/${id}`);
      return epic;
    },
    staleTime: 1000 * 60 * 5,
    gcTime: 1000 * 60 * 5,
    meta: { x: 12 },
  });
};
