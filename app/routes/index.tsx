import { createFileRoute, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/start";

export const serverFn1 = createServerFn({ method: "GET" })
  .validator((x: string) => {
    return 12;
  })
  .handler((ctx) => {
    const x = ctx.data; // x is any
    return { time: "" };
  });

export const serverFn2 = createServerFn({ method: "GET" })
  .validator((x: string) => {
    return 12 as const;
  })
  .handler((ctx) => {
    const x = ctx.data; // x is any
    return { time: "" };
  });

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
