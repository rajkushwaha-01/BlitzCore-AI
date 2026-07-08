import "dotenv/config";
import dns from "dns";
import app from "./src/app.js";
import http from "http";
import connectDB from "./src/config/db.js";
import { initSocket } from "./src/sockets/server.socket.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

await connectDB();

const PORT = process.env.PORT || 3000;

const httpServer = http.createServer(app);
initSocket(httpServer);


httpServer.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});