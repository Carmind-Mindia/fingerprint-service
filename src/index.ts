
// Import the connection file to start the connection
import express from "express";
import "./mongodb/connection";
import { createServerSocket } from "./service/socket";

const app = express();

const port = process.env.PORT || 3000;

// Add your routes and middleware here
const server = app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

createServerSocket(server);
