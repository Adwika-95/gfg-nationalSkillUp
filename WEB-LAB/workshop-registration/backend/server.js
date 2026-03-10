const http = require("http");
const fs = require("fs");
const path = require("path");

const PORT = 5000;
const DATA_FILE = path.join(__dirname, "participants.txt");

// Ensure participants.txt exists
if (!fs.existsSync(DATA_FILE)) {
  fs.writeFileSync(DATA_FILE, "");
}

function parseBody(req) {
  return new Promise((resolve, reject) => {
    let body = "";
    req.on("data", (chunk) => (body += chunk));
    req.on("end", () => {
      try {
        resolve(JSON.parse(body));
      } catch (e) {
        reject(e);
      }
    });
  });
}

const server = http.createServer(async (req, res) => {
  // CORS headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");

  if (req.method === "OPTIONS") {
    res.writeHead(204);
    res.end();
    return;
  }

  // POST /register — save new participant
  if (req.method === "POST" && req.url === "/register") {
    try {
      const { name, department } = await parseBody(req);

      if (!name || !department) {
        res.writeHead(400, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Name and department are required." }));
        return;
      }

      const timestamp = new Date().toISOString();
      const entry = `${timestamp} | Name: ${name} | Department: ${department}\n`;

      // Non-blocking async file append (handles concurrency)
      fs.appendFile(DATA_FILE, entry, (err) => {
        if (err) {
          res.writeHead(500, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ error: "Failed to save participant." }));
        } else {
          res.writeHead(200, { "Content-Type": "application/json" });
          res.end(JSON.stringify({ message: "Registration successful!" }));
        }
      });
    } catch (e) {
      res.writeHead(400, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ error: "Invalid request body." }));
    }
    return;
  }

  // GET /participants — return all participants
  if (req.method === "GET" && req.url === "/participants") {
    fs.readFile(DATA_FILE, "utf8", (err, data) => {
      if (err) {
        res.writeHead(500, { "Content-Type": "application/json" });
        res.end(JSON.stringify({ error: "Failed to read participants." }));
        return;
      }

      const lines = data.trim().split("\n").filter(Boolean);
      const participants = lines.map((line, index) => {
        const parts = line.split(" | ");
        const timestamp = parts[0] || "";
        const name = (parts[1] || "").replace("Name: ", "");
        const department = (parts[2] || "").replace("Department: ", "");
        return { id: index + 1, timestamp, name, department };
      });

      res.writeHead(200, { "Content-Type": "application/json" });
      res.end(JSON.stringify({ participants }));
    });
    return;
  }

  // 404 fallback
  res.writeHead(404, { "Content-Type": "application/json" });
  res.end(JSON.stringify({ error: "Route not found." }));
});

server.listen(PORT, () => {
  console.log(`✅ Backend server running at http://localhost:${PORT}`);
  console.log(`   POST /register       → Register a participant`);
  console.log(`   GET  /participants   → View all participants`);
});
