import { fetchJson } from "../../backend/fetchUtils";
import { Epic } from "../../types";
import { createLoader } from "./queryUtils";

export const epicLoader = createLoader(
  (_: number, epicId: string | number) => ["epic", epicId],
  async (timestarted: number, epicId: string | number) => {
    const timeDifference = +new Date() - timestarted;

    console.log(`Loading api/epic/${epicId} data at`, timeDifference);
    const epic = await fetchJson<Epic>(`api/epics/${epicId}`);
    return epic;
  },
);
