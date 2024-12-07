import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/foo/")({
  component: RouteComponent,
});

function RouteComponent() {
  return (
    <div>
      <Link to="/">Home</Link>
      <div>Hello "/foo/"!</div>
    </div>
  );
}
