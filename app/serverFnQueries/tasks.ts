import { getCookie } from "vinxi/http";
import { createServerFn } from "@tanstack/start";
import { Task } from "../../types";

export const getTasksList = createServerFn({ method: "GET" }).handler(async () => {
  const result = getCookie("user");

  return fetch(`http://localhost:3000/api/tasks`, { method: "GET", headers: { Cookie: "user=" + result } })
    .then(resp => resp.json())
    .then(res => res as Task[]);
});
