import { createMiddleware, useServerFn } from "@tanstack/start";
import { hashKey, useQueryClient, useSuspenseQuery } from "@tanstack/react-query";

import { createFileRoute, Link, redirect, useNavigate } from "@tanstack/react-router";
import { epicQueryOptions } from "../../../../queries/epicQuery";
import { useEffect, useRef, useState } from "react";
import { postToApi } from "../../../../../backend/fetchUtils";
import { createServerFn } from "@tanstack/start";
import { epicsQueryOptions } from "../../../../queries/epicsQuery";

const reactQueryMiddleware = createMiddleware().server(async ({ next, context }) => {
  console.log("Middleware server before", { context });
  const serverFnResult = await next({ sendContext: { xyz: 999 } });

  console.log("Middleware server after", { result: serverFnResult });

  // @ts-ignore
  serverFnResult.result.message = "ayyyyyyyyyyy";

  const queryOptions = epicsQueryOptions(0, 1);
  const data = await queryOptions.queryFn();
  console.log({ data });

  // @ts-ignore
  serverFnResult.context.qwert = "Hi";
  serverFnResult.result.newData = data;

  return serverFnResult;
});

export const saveEpic = createServerFn({ method: "POST" })
  .middleware([reactQueryMiddleware])
  .validator((updates: { id: string; newName: string }) => updates)
  .handler(async ({ data, context }) => {
    console.log("Running server function");
    await postToApi("api/epic/update", {
      id: data.id,
      name: data.newName,
    });
    console.log("Server function finished", { context });

    return {
      a: 12,
    };

    //throw redirect({ to: "/app/epics", search: { page: 1 } });
  });

export const Route = createFileRoute("/app/epics/$epicId/edit")({
  component: EditEpic,
  context({ context, params }) {
    return {
      currentEpicOptions: epicQueryOptions(context.timestarted, params.epicId),
    };
  },
  loader({ context }) {
    context.queryClient.prefetchQuery(context.currentEpicOptions);
  },
});

function EditEpic() {
  const { epicId } = Route.useParams();
  const { currentEpicOptions } = Route.useRouteContext();
  const { data: epic } = useSuspenseQuery(currentEpicOptions);
  const newName = useRef<HTMLInputElement>(null);

  const [saving, setSaving] = useState(false);

  const queryClient = useQueryClient();

  const runSave = useServerFn(saveEpic);

  const save = async () => {
    setSaving(true);

    const result: any = await runSave({
      data: {
        id: epic.id,
        newName: newName.current!.value,
      },
    });

    console.log({ result });

    const queryOptions = epicsQueryOptions(0, 1);
    result.newData;

    queryClient.invalidateQueries({ queryKey: ["epics", "list"] });
    queryClient.invalidateQueries({ queryKey: ["epic", epicId] });
    queryClient.setQueryData(queryOptions.queryKey, result.newData, { updatedAt: Date.now() });
  };

  useEffect(() => {
    newName.current!.value = epic.name;
  }, [epic.name]);

  return (
    <div className="flex flex-col gap-5 p-3">
      <div>
        <Link to="/app/epics" search={{ page: 1 }}>
          Back
        </Link>
      </div>
      <div>
        <div className="flex flex-col gap-2">
          <span>Edit epic {epicId}</span>
          <input className="self-start border p-2 w-64" ref={newName} defaultValue={epic.name} />
          <div className="flex gap-2"></div>
          <button className="self-start p-2 border" onClick={save}>
            Save
          </button>
          {saving && <span>Saving...</span>}
        </div>
      </div>
    </div>
  );
}
