import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  async loader() {
    return {};
  },
});

function Home() {
  return (
    <div>
      <Link to="/foo">Foo</Link>
      <div>Hello</div>
    </div>
  );
}
