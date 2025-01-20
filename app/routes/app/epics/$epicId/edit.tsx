import { createFileRoute } from "@tanstack/react-router";

export const Route = createFileRoute("/app/epics/$epicId/edit")({
  loader: ({ context, params }) => {},
});
