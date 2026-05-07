const express = require("express");
const fs = require("fs");
const path = require("path");

const app = express();
const PORT = 3000;
const DATA_FILE = "/app/data/status.json";

app.use(express.json());
app.use(express.static(path.join(__dirname, "public")));

const defaultStatus = {
  brave1: null,
  brave2: null,
  brave3: null,
  brave4: null
};

function readStatus() {
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify(defaultStatus, null, 2));
  }
  return JSON.parse(fs.readFileSync(DATA_FILE, "utf8"));
}

function writeStatus(status) {
  fs.writeFileSync(DATA_FILE, JSON.stringify(status, null, 2));
}

app.get("/api/status", (req, res) => {
  res.json(readStatus());
});

app.post("/api/claim/:id", (req, res) => {
  const { id } = req.params;
  const { name } = req.body;

  if (!["brave1", "brave2", "brave3", "brave4"].includes(id)) {
    return res.status(400).json({ error: "Invalid browser" });
  }

  const status = readStatus();

  status[id] = {
    name: name || "Someone",
    since: new Date().toISOString()
  };

  writeStatus(status);
  res.json(status);
});

app.post("/api/release/:id", (req, res) => {
  const { id } = req.params;

  if (!["brave1", "brave2", "brave3", "brave4"].includes(id)) {
    return res.status(400).json({ error: "Invalid browser" });
  }

  const status = readStatus();
  status[id] = null;
  writeStatus(status);

  res.json(status);
});

app.listen(PORT, () => {
  console.log(`Dashboard running on port ${PORT}`);
});