// Injects dashboard_data.json into the template -> self-contained index.html
const fs = require("fs");
const path = require("path");
const base = __dirname + path.sep;
const tpl = fs.readFileSync(base + "index_template.html", "utf8");
const data = fs.readFileSync(base + "dashboard_data.json", "utf8");
const out = tpl.replace("/*__DATA__*/{}", data);
fs.writeFileSync(base + "index.html", out);
console.log("Wrote index.html (" + (out.length / 1024).toFixed(0) + " KB, data " + (data.length / 1024).toFixed(0) + " KB)");
// quick sanity: ensure no leftover placeholder and DATA parses
if (out.includes("/*__DATA__*/{}")) throw new Error("placeholder not replaced");
JSON.parse(data);
console.log("OK");
