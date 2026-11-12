// DELIBERATELY VULNERABLE: test app for GitHub code scanning. Never deploy.
const express = require("express");
const { execFile } = require("child_process");
const app = express();

// Deliberate reflected XSS: user input written straight into HTML
app.get("/hello", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

// Safer command execution: validated input + no shell
app.get("/ping", (req, res) => {
  const host = req.query.host;
  if (typeof host !== "string" || !/^[a-zA-Z0-9.-]+$/.test(host)) {
    return res.status(400).send("Invalid host");
  }

  execFile("ping", ["-c", "1", host], (err, stdout) => {
    if (err) {
      return res.status(500).send("Ping failed");
    }
    res.send(stdout);
  });
});

app.listen(3000);
