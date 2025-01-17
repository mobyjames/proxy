import http from "http";
import express from "express";
import cors from "cors";
import { Server, RedisPresence } from "colyseus";
import { monitor } from "@colyseus/monitor";
// import socialRoutes from "@colyseus/social/express"
import { MongooseDriver } from "colyseus/lib/matchmaker/drivers/MongooseDriver"

import { MyRoom } from "./MyRoom";
import { RankedLobbyRoom } from "./RankedLobbyRoom";

const port = Number(process.env.PORT) + Number(process.env.NODE_APP_INSTANCE);
const app = express()

app.use(cors());
app.use(express.json())

const server = http.createServer(app);
const gameServer = new Server({
  presence: new RedisPresence(),
  driver: new MongooseDriver(),
  server,
});

// register your room handlers
gameServer.define('my_room', MyRoom);
gameServer.define('ranked', RankedLobbyRoom);

/**
 * Register @colyseus/social routes
 *
 * - uncomment if you want to use default authentication (https://docs.colyseus.io/authentication/)
 * - also uncomment the import statement
 */
// app.use("/", socialRoutes);

// register colyseus monitor AFTER registering your room handlers
app.use("/colyseus", monitor());

gameServer.listen(port);
console.log(`Listening on ws://localhost:${ port }`)
