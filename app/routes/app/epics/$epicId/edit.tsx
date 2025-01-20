import { createMiddleware, useServerFn } from "@tanstack/start";
import { useQueryClient, useSuspenseQuery, type QueryKey } from "@tanstack/react-query";

import { createFileRoute, Link, redirect } from "@tanstack/react-router";
import { epicLoader, epicQueryOptions } from "../../../../queries/epicQuery";
import { useEffect, useRef, useState } from "react";
import { fetchJson, postToApi } from "../../../../../backend/fetchUtils";
import { createServerFn } from "@tanstack/start";
import { epicsQueryOptions } from "../../../../queries/epicsQuery";
import { queryClient } from "../../../../queryClient";
import { Epic } from "../../../../../types";
import { loaderLookup } from "../../../../lib/loaderLookup";

export const Route = createFileRoute("/app/epics/$epicId/edit")({
  context({ context, params }) {},
  loader({ context }) {},
});
