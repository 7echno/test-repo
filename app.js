// DELIBERATELY VULNERABLE: test app for GitHub code scanning. Never deploy.
const express = require("express");
const { exec } = require("child_process");
const rateLimit = require("express-rate-limit");
const app = express();

const pingLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
});

// Deliberate reflected XSS: user input written straight into HTML
app.get("/hello", (req, res) => {
  res.send("<h1>Hello " + req.query.name + "</h1>");
});

// Deliberate command injection: user input passed to a shell
app.get("/ping", pingLimiter, (req, res) => {
  exec("ping -c 1 " + req.query.host, (err, stdout) => res.send(stdout));
});

app.listen(3000);
