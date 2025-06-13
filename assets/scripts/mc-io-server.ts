import { ChildProcessWithoutNullStreams, spawn } from "child_process";
import { Request, Response } from "express";
import { IpAddress } from "./networking";
const express = require("express")


const app = express();
const port = 3000;
app.use(express.json());

let serverProcess: ChildProcessWithoutNullStreams | null = null;

app.post("/start", (req: Request, res: Response) => {
  if (serverProcess) {
    return res.status(400).send({ status: "already_running" });
  }

  serverProcess = spawn("java", ["-jar", "server.jar", "nogui"]);

  serverProcess.stdout.on("data", (data: Buffer) => {
    console.log(`[SERVER] ${data}`);
  });

  serverProcess.stderr.on("data", (data: Buffer) => {
    console.error(`[SERVER ERROR] ${data}`);
  });

  serverProcess.on("exit", (code) => {
    console.log(`[SERVER] exited with code ${code}`);
    serverProcess = null;
  });

  res.send({ status: "started" });
});

app.post("/command", (req: Request, res: Response) => {
  if (!serverProcess) {
    return res.status(400).send({ status: "not_running" });
  }

  const command = req.body.command;
  serverProcess.stdin.write(command + "\n");
  res.send({ status: "sent" });
});

app.get("/status", (req: Request, res: Response) => {
  res.send({ running: !!serverProcess });
});


async function startServer(){
  const ip = await IpAddress;

  app.listen(port, ip,() => {
  console.log(`Backend listening on ${ip}:${port}`);
});
}

