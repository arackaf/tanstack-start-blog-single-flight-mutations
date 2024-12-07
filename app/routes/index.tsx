import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/")({
  component: Home,
  async loader() {
    console.log("Root loader");
    await new Promise((res) => setTimeout(res, 500));

    return {
      x: new Date(),
    };
  },
});

function Home() {
  const { x } = Route.useLoaderData();
  return (
    <div>
      <Link to="/foo">Foo</Link>
      <div>Hello {x.toString()}</div>
    </div>
  );
}
