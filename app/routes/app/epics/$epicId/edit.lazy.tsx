import { createLazyFileRoute } from "@tanstack/react-router";
export const Route = createLazyFileRoute("/app/epics/$epicId/edit")({
  component: EditEpic,
});

function EditEpic() {
  return <div>HI</div>;
}
