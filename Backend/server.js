import "dotenv/config";
import dns from "dns";
import app from "./src/app.js";
import connectDB from "./src/config/db.js";
import { testAi } from "./src/services/ai.service.js";

dns.setServers(["8.8.8.8", "1.1.1.1"]);

await connectDB();

const PORT = process.env.PORT || 3000;

testAi();

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});