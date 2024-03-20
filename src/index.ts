import { Elysia } from "elysia";

// Import the connection file to start the connection
import "./mongodb/connection";
import "./service/socket";

const app = new Elysia()
    .get("/ping", () => "pong");

app.listen(Bun.env.PORT || 3000);

console.log(
  `🦊 Elysia is running at ${app.server?.hostname}:${app.server?.port}`
);
