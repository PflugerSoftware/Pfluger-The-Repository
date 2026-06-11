// Pfluger AI Usage - data processing & dual classification (topic + scope phase)
// Node v22. Reads the Claude.ai org export, emits dashboard_data.json
const fs = require("fs");
const path = require("path");

// auto-detect the unzipped Claude export folder sitting next to this script (keep only ONE data-*-batch-* folder here)
const exportDir = fs.readdirSync(__dirname).find(d => /^data-.*batch/i.test(d) && fs.statSync(path.join(__dirname, d)).isDirectory());
if (!exportDir) throw new Error("No Claude export folder (data-*-batch-*) found next to process.js. Unzip the export here.");
const ROOT = path.join(__dirname, exportDir);
const OUT = path.join(__dirname, "dashboard_data.json");

const convos = JSON.parse(fs.readFileSync(path.join(ROOT, "conversations.json"), "utf8"));
const users = JSON.parse(fs.readFileSync(path.join(ROOT, "users.json"), "utf8"));
const userByUuid = {};
for (const u of users) userByUuid[u.uuid] = u;

// ===================================================================
// EDIT THESE EACH EXPORT  (everything else is derived from the data)
// ===================================================================
// Cumulative PEOPLE onboarded by month (actual, past months):
const onboarding = { "2026-01": 5, "2026-02": 7, "2026-03": 8, "2026-04": 13, "2026-05": 38, "2026-06": 44 };
// Projected cumulative people for FUTURE months (drives the forecast/projection):
const rampFuture = { "2026-07": 55, "2026-08": 70, "2026-09": 85, "2026-10": 100, "2026-11": 100, "2026-12": 100 };
// Full-firm target headcount:
const TARGET_HEADCOUNT = 100;
// ===================================================================

// ---------------- TOPIC taxonomy (what they talk about) ----------------
const TOPICS = [
  { key: "code", label: "Code & Compliance", color: "#c0392b", kw: [
    "ibc", "code", "occupanc", "egress", "exiting", "occupant load", "clearance", "height requirement", "height limit",
    "height maximum", " isd ", "aisd", "fire suppression", "fire riser", "firewall", "fire wall", "fire barrier",
    "fire hydrant", "ada", "accessib", "barrier free", "tas ", "zoning", "permit", "parapet", "fencing", "fence height",
    "regulation", "compliance", "setback", "load verification", "bleacher", "corridor", "locker", "retention pond",
    "guardrail", "handrail", "commcheck", "classroom minimum", "minimum size", "driveway width", "stc rating",
    "roof slope standard", "slope standard", "ball rollback", "minimum slope", "security gate", "security fencing",
    "visitor entry gate", "code calculation", "occupancy code", "occupancy capacity", "control joint spacing",
    "stair", "ramp", "rated", "separation"] },
  { key: "submittal", label: "Submittals & Construction Admin", color: "#d68910", kw: [
    "submittal", "sumittal", "rfi", "shop drawing", "door hardware", "hardware review", "construction issue",
    "construction admin", "punch list", "meeting minute", "pdm memo", "coordination meeting", "field report",
    "site visit", "asi ", "change order", "pay application", "payment requirement", "closeout", "substitution",
    "procore", "betterment", "re-roof", "roof replacement", "re-roofing", "owner items", "owner item",
    "construction update", "cat meeting", "rejection assessment", "compliance review", "spec section",
    "specification compar", "spec compar", "against specification", "against district standard", "tdi",
    "metal panel testing", "fume hood color", "tile supply", "tile availability", "frame revision", "label",
    "sample submittal", "review the submittal", "review submittal"] },
  { key: "qaqc", label: "QA/QC & Drawing Review", color: "#b9770e", kw: [
    "qaqc", "qa/qc", "quality assurance", "discrepanc", "drawing review", "plan review", "redline", "verification",
    "typo", "error review", "dimension discrepanc", "arch dimension", "plan discrepanc", "roofing detail error",
    "expansion joint error", "verifying", "verify", "cross-file", "comparing data across", "comparing policies",
    "master checklist", "checklist"] },
  { key: "bim", label: "Revit / BIM, CAD & 3D", color: "#2e86c1", kw: [
    "revit", " cad", "cad ", "dynamo", "family", "families", ".dwg", "dwg", "sheet", "detail plan", "elevation",
    "grid line", "grid lines", "ceiling grid", "curtain", "two point perspective", "perspective camera", "rhino",
    "blender", "sketchup", "forma", "generic model", "template as new project", "filter not showing", "align tool",
    "model element", "reference link", "xref", "splitting a roof", "split a roof", "hide grid", "design option",
    "main model", "color coding sheet", "pat file", "tile pattern", "casework tagging", "scheduling in revit",
    "dimensioning", "enlarged finish plan", "radius and arc", "kml", "kmz", "comfyui", "lora", "nano banana",
    "image upscal", "upscaling", "machine vision", "transcribing document", "drone footage", "2d drawing to drone",
    "google maps to cad", "furniture layout", "room furniture", "sun path"] },
  { key: "sustain", label: "Sustainability & Materials", color: "#1e8449", kw: [
    "aegb", "lca", "life cycle", "carbon", "mass timber", "timberlab", "timber", "sustainab", "honest material",
    "material health", "material takeoff", "material sustainab", "gyp", "thin brick", "stucco", "glazing", "glaz",
    "wellbeing", "wellness", "energy", "daylight", "metal standing seam", "standing seam", "metal panel",
    "security glass", "protective film", "paint sheen", "paint color", "laminate color", "tile sample",
    "tile color", "sports flooring", "flooring", "sealed concrete", "concrete submittal", "wood type",
    "interior paint", "matching door laminate", "matching aesthetic"] },
  { key: "mep", label: "MEP & Structural Systems", color: "#16a085", kw: [
    "mechanical unit", "mechanical", "plumbing", "hvac", "slab on grade", "slab plumbing", " mep", "mep ",
    "electrical", "mop sink", "ceiling type", "rooftop mechanical", "duct", "diffuser", "structural coordination",
    "cantilever beam", "beam sizing", "structural", "thermostatic mixing", "mixing valve", "a.f.f.", "idf",
    "dry pipe", "hydrotherapy pool", "3d arts room", "mep 3d", "power outlet", "outlet integration",
    "power requirement", "metal studs", "exterior wall"] },
  { key: "predesign", label: "Programming & Pre-Design", color: "#8e44ad", kw: [
    "programming", "problem seeking", "feasibility", "master plan", "master planning", "site analysis",
    "space program", "campus survey", "campus master", "needs assessment", "visioning", "schematic design",
    "pre-design", "predesign", "concept design", "naming design concept", "naming concept", "design concept",
    "dorm design", "ideation", "guiding principle", "design implication", "consolidation program",
    "program analysis", "building utilization", "utilization analysis", "utilization rate", "campus edges",
    "campus landscape", "infrastructure planning", "urban planning", "end zone feasibility", "feasibility study",
    "schedule update", "schematic"] },
  { key: "pursuits", label: "Presentations, Pursuits & Branding", color: "#2980b9", kw: [
    "proposal", "pitch", "presentation", "article", "narrative", "award", "tasa", "prek4sa", "submission",
    "branding", "brand voice", "brand vision", "rebrand", "newsletter", "social media", "marketing", "rfq",
    "sf330", "interview", "slide", "slides", "infographic", "poster", "logo", "txedcon", "booth", "vision board",
    "populous", "growth leader", "demographic context", "emotional resonance", "steering committee",
    "campus edges ideation", "briefing", "showcase", "graphics", "athletic graphics", "stadium graphics",
    "end zone graphic", "typography", "color palette", "powerpoint", "copy", "writing style", "website",
    "core values", "immersive", "vantage point", "r&b platform", "campus survey data", "award-winning",
    "personality quiz", "oreo", "quiz", "narrative rewrite", "reimagining"] },
  { key: "bizops", label: "Business Ops & Project Mgmt", color: "#5d6d7e", kw: [
    "calendar", "outlook", "deltek", "vantage point", "notion", "expense report", "expense", "contract tracking",
    "contract", "payment", "gantt", "schedule update", "subscription", "software inventory", "software and service",
    "team plan", "seat cost", "pricing", "cost per employee", "cost reduction", "estimate", "income statement",
    "delegation", "prioritization", "meeting notes", "meeting transcript", "teams task", "teams channel",
    "to-do item", "pinned email", "email review", "settlement", "negotiation", "consultant", "contractor evaluation",
    "preferred contractor", "team assembl", "responsibilities assignment", "sign-up sheet", "meeting sign-up",
    "task template", "expense report policy", "fci scoring", "project total", "renovation square footage",
    "square footage", "spreadsheet", "excel", "egnyte", "combining excel", "data processing", "scope on gym",
    "garza", "office relocation", "office reconfiguration", "declining a meeting", "weekly calendar",
    "weekly review", "acronyms for measurable", "measurable goal", "contact information", "affiliation"] },
  { key: "ai", label: "AI / Claude Tooling & Setup", color: "#7d3c98", kw: [
    "claude", " mcp", "mcp ", "terminal", "path variable", "plugin", "cowork", "install", "set up claude",
    "setting up claude", " api", "prompt", "automat", "task status", "assigning task", "workflow for new project",
    "chat privacy", "default chat", "ecosystem", "integration use case", "ai into", "ai workflow", "ai teacher",
    "knowledge base", "starting from scratch", "apps and websites", "azure", "ene.sys", "driver loading",
    "command not recognized", "installation link", "windows installation", "port connection", "port 9876",
    "bookmarking project", "shared claude project", "claude project", "kick off prompt", "kick off promt",
    "read architectural drawing", "installs tracker", "chrome browser", "connection unavailable", "blender mcp"] },
  { key: "personal", label: "Personal / Off-Topic", color: "#95a5a6", kw: [
    "recipe", "pav bhaji", "pani puri", "paneer", "bhurji", "grocery list", "chicken bowl", "meal prep", "visa",
    "h-1b", "h1b", "stem opt", "l1a", "l-1a", "i-94", "ssn", "social security", "green card", "gym", "creatine",
    "protein", "incline press", "shoulders", "chest", "knee cracking", "task chair", "gaming chair", "e-bike",
    "car wash", "birthday party", "sensory club", "compound interest", "youtube family", "shirt steaming",
    "unique indian names", "indian names", "qr code", "walking to the car", "choline", "abdominal pain",
    "world cup", "flight cancellation", "airport", "terminal 1 to terminal", "train connection", "pjm exam",
    "are pjm", "exam preparation", "affirmation"] },
];

// ---------------- PHASE taxonomy (scope of work) ----------------
// Phases: Pre-Design, Design, CD (Construction Documents), CA (Construction Administration),
//         Practice (firm operations / non-project overhead), Personal
const PHASES = [
  { key: "CA", label: "Construction Admin", color: "#d68910", kw: [
    "submittal", "sumittal", "rfi", "shop drawing", "punch list", "construction issue", "construction update",
    "construction admin", "asi ", "change order", "pay application", "payment requirement", "closeout",
    "substitution", "procore", "betterment", "re-roof", "roof replacement", "re-roofing", "owner items",
    "owner item", "cat meeting", "field report", "site visit", "construction logistics", "gymnasium logistics",
    "rejection assessment", "sample submittal", "review the submittal", "construction meeting", "garza",
    "scope on gym", "tile supply delay", "frame revision", "label", "against district standard"] },
  { key: "CD", label: "Construction Documents", color: "#c0392b", kw: [
    "qaqc", "qa/qc", "quality assurance", "discrepanc", "drawing review", "plan review", "redline",
    "construction document", "spec section", "specification", "detail", "expansion joint", "roofing detail",
    "dimension discrepanc", "arch dimension", "commcheck", "verifying", "verify", "typo", "error review",
    "dimensioning", "enlarged finish plan", "checklist", "drawing qaqc", "sheet", "color coding sheet",
    "casework tagging", "scheduling in revit", "code calculation", "occupancy code", "occupancy load",
    "compliance review", "against specification"] },
  { key: "Design", label: "Design (SD/DD)", color: "#2e86c1", kw: [
    "revit", "cad", "dynamo", "family", "families", "elevation", "grid", "curtain", "perspective", "rhino",
    "blender", "sketchup", "forma", "design option", "main model", "glazing", "glaz", "material", "paint",
    "laminate", "tile sample", "tile color", "flooring", "sealed concrete", "wood type", "ceiling type",
    "ceiling grid", "mechanical", "plumbing", "mep", "structural", "beam", "thermostatic", "mixing valve",
    "metal stud", "metal panel", "standing seam", "mass timber", "carbon", "lca", "life cycle", "aegb",
    "sustainab", "naming concept", "design concept", "dorm design", "furniture layout", "room furniture",
    "sun path", "casework", "finish plan", "renovation", "office reconfiguration", "interior", "fume hood",
    "security glass", "protective film", "stc rating", "wellbeing", "wellness", "daylight", "energy"] },
  { key: "Pre-Design", label: "Pre-Design / Programming", color: "#8e44ad", kw: [
    "programming", "problem seeking", "feasibility", "master plan", "master planning", "campus survey",
    "campus master", "needs assessment", "visioning", "pre-design", "predesign", "ideation", "guiding principle",
    "design implication", "consolidation program", "program analysis", "building utilization", "utilization",
    "campus edges", "campus landscape", "infrastructure planning", "urban planning", "feasibility study",
    "space program", "school project initiation", "project initiation", "demographic", "site analysis",
    "schematic design cost", "cost overrun"] },
  { key: "Practice", label: "Firm Practice & Operations", color: "#5d6d7e", kw: [
    "claude", "mcp", "terminal", "path variable", "plugin", "cowork", "install", "api", "prompt", "automat",
    "azure", "proposal", "pitch", "presentation", "article", "narrative", "award", "tasa", "prek4sa", "submission",
    "branding", "brand", "rebrand", "newsletter", "social media", "marketing", "rfq", "sf330", "interview", "slide",
    "infographic", "poster", "logo", "txedcon", "booth", "vision board", "populous", "steering committee",
    "calendar", "outlook", "deltek", "vantage point", "notion", "expense", "contract", "payment", "gantt",
    "subscription", "software", "team plan", "seat cost", "pricing", "cost per employee", "cost reduction",
    "estimate", "income statement", "delegation", "prioritization", "meeting notes", "meeting transcript",
    "teams task", "teams channel", "to-do", "pinned email", "email review", "settlement", "negotiation",
    "consultant", "contractor evaluation", "preferred contractor", "team assembl", "responsibilities assignment",
    "sign-up sheet", "fci scoring", "website", "core values", "immersive", "vantage point", "r&b platform",
    "graphics", "typography", "powerpoint", "copy", "writing style", "knowledge base", "starting from scratch",
    "kick off", "office relocation", "declining a meeting", "weekly review", "measurable goal"] },
  { key: "Personal", label: "Personal / Off-Topic", color: "#95a5a6", kw: [
    "recipe", "pav bhaji", "pani puri", "paneer", "bhurji", "grocery", "chicken bowl", "meal prep", "visa",
    "h-1b", "h1b", "stem opt", "l1a", "l-1a", "i-94", "ssn", "social security", "green card", "gym", "creatine",
    "protein", "incline press", "shoulders", "chest", "knee cracking", "task chair", "gaming chair", "e-bike",
    "car wash", "birthday party", "sensory club", "compound interest", "youtube family", "shirt steaming",
    "indian names", "qr code", "walking to the car", "choline", "abdominal pain", "world cup",
    "flight cancellation", "airport", "train connection", "pjm exam", "exam preparation", "affirmation",
    "oreo", "personality quiz"] },
];

function score(text, taxonomy) {
  const t = (" " + text + " ").toLowerCase();
  let best = null, bestScore = 0;
  for (const cat of taxonomy) {
    let s = 0;
    for (const k of cat.kw) if (t.includes(k)) s++;
    if (s > bestScore) { bestScore = s; best = cat; }
  }
  return { cat: best, score: bestScore };
}

// ---------------- aggregation ----------------
const monthMsgs = {}, dayMsgs = {};
const topicAgg = {}, phaseAgg = {};       // key -> {convs, msgs}
const acctAgg = {};                        // uuid -> {convs,msgs,topics{},phases{}}
const topicByMonth = {};                   // topic -> month -> msgs
const phaseByMonth = {};                   // phase -> month -> msgs
const crosstab = {};                       // phase -> topic -> convs (for scope graphic)
let totalConvs = 0, totalMsgs = 0, totalHuman = 0, totalAsst = 0, namedConvs = 0;
let emptyConvs = 0, emptyMsgs = 0, otherTopic = 0;

for (const c of convos) {
  totalConvs++;
  const acct = c.account?.uuid || "unknown";
  const msgs = c.chat_messages || [];

  // gather text
  let parts = [];
  if (c.name && c.name.trim()) { parts.push(c.name); namedConvs++; }
  if (c.summary && c.summary.trim()) parts.push(c.summary);
  let grab = 0;
  for (const m of msgs) {
    const bodyText = (m.text && m.text.trim()) ? m.text : (m.content || []).map(b => b.text || "").join(" ");
    if (m.sender === "human" && bodyText && bodyText.trim() && grab < 4) { parts.push(bodyText); grab++; }
  }
  const text = parts.join(" \n ");
  const hasText = text.trim().length > 0;

  let topicKey, phaseKey;
  if (!hasText) { topicKey = "nocontent"; phaseKey = "nocontent"; emptyConvs++; emptyMsgs += msgs.length; }
  else {
    const tt = score(text, TOPICS); const pp = score(text, PHASES);
    topicKey = tt.score ? tt.cat.key : "other";
    phaseKey = pp.score ? pp.cat.key : "other";
    if (topicKey === "other") otherTopic++;
  }

  const convMonth = (msgs[0]?.created_at || c.created_at || "").slice(0, 7);

  if (!acctAgg[acct]) acctAgg[acct] = { convs: 0, msgs: 0, topics: {}, phases: {} };
  acctAgg[acct].convs++;
  acctAgg[acct].topics[topicKey] = (acctAgg[acct].topics[topicKey] || 0) + 1;
  acctAgg[acct].phases[phaseKey] = (acctAgg[acct].phases[phaseKey] || 0) + 1;

  topicAgg[topicKey] = topicAgg[topicKey] || { convs: 0, msgs: 0 }; topicAgg[topicKey].convs++;
  phaseAgg[phaseKey] = phaseAgg[phaseKey] || { convs: 0, msgs: 0 }; phaseAgg[phaseKey].convs++;
  crosstab[phaseKey] = crosstab[phaseKey] || {};
  crosstab[phaseKey][topicKey] = (crosstab[phaseKey][topicKey] || 0) + 1;

  for (const m of msgs) {
    totalMsgs++; acctAgg[acct].msgs++;
    if (m.sender === "human") totalHuman++; else totalAsst++;
    topicAgg[topicKey].msgs++; phaseAgg[phaseKey].msgs++;
    const d = (m.created_at || "").slice(0, 10);
    if (d) {
      dayMsgs[d] = (dayMsgs[d] || 0) + 1;
      const mo = d.slice(0, 7); monthMsgs[mo] = (monthMsgs[mo] || 0) + 1;
      topicByMonth[topicKey] = topicByMonth[topicKey] || {}; topicByMonth[topicKey][mo] = (topicByMonth[topicKey][mo] || 0) + 1;
      phaseByMonth[phaseKey] = phaseByMonth[phaseKey] || {}; phaseByMonth[phaseKey][mo] = (phaseByMonth[phaseKey][mo] || 0) + 1;
    }
  }
}

// accounts: fold unnamed into "Other / Unlisted seats"
const accounts = [];
let oC = 0, oM = 0, oT = {}, oP = {};
for (const [uuid, agg] of Object.entries(acctAgg)) {
  const u = userByUuid[uuid];
  if (u) {
    const top = Object.entries(agg.topics).filter(([k]) => k !== "nocontent" && k !== "other").sort((a, b) => b[1] - a[1]);
    accounts.push({ uuid, label: u.full_name, email: u.email_address, convs: agg.convs, msgs: agg.msgs, topics: agg.topics, phases: agg.phases, topTopics: top.slice(0, 5) });
  } else {
    oC += agg.convs; oM += agg.msgs;
    for (const [k, n] of Object.entries(agg.topics)) oT[k] = (oT[k] || 0) + n;
    for (const [k, n] of Object.entries(agg.phases)) oP[k] = (oP[k] || 0) + n;
  }
}
if (oC) {
  const top = Object.entries(oT).filter(([k]) => k !== "nocontent" && k !== "other").sort((a, b) => b[1] - a[1]);
  accounts.push({ uuid: "other", label: "Other / Unlisted seats", email: "", convs: oC, msgs: oM, topics: oT, phases: oP, topTopics: top.slice(0, 5), isOther: true });
}
accounts.sort((a, b) => b.msgs - a.msgs);

const months = Object.keys(monthMsgs).sort();
const perPerson = months.map(m => ({ month: m, msgs: monthMsgs[m], people: onboarding[m] || null, perPerson: onboarding[m] ? +(monthMsgs[m] / onboarding[m]).toFixed(1) : null }));

// topic / phase label maps
const topicMeta = {}; for (const t of TOPICS) topicMeta[t.key] = { label: t.label, color: t.color };
topicMeta["other"] = { label: "General / Other", color: "#bdc3c7" };
topicMeta["nocontent"] = { label: "No exported text (API / agent)", color: "#34495e" };
const phaseMeta = {}; for (const p of PHASES) phaseMeta[p.key] = { label: p.label, color: p.color };
phaseMeta["other"] = { label: "General / Other", color: "#bdc3c7" };
phaseMeta["nocontent"] = { label: "No exported text (API / agent)", color: "#34495e" };

// partial-month run-rate basis for the latest month (auto-computed from the export's last date)
const endDate = Object.keys(dayMsgs).sort().slice(-1)[0];           // YYYY-MM-DD
const [ey, em, ed] = endDate.split("-").map(Number);
const lastMonthPartial = { month: endDate.slice(0, 7), days: ed, fullDays: new Date(ey, em, 0).getDate() };

const out = {
  generatedFrom: `Claude.ai org export (${exportDir})`,
  dateRange: { start: Object.keys(dayMsgs).sort()[0], end: endDate },
  lastMonthPartial,
  totals: { conversations: totalConvs, messages: totalMsgs, human: totalHuman, assistant: totalAsst,
            namedConvs, emptyConvs, emptyMsgs, otherTopic, seats: accounts.length, accountUuids: Object.keys(acctAgg).length },
  monthMsgs, dayMsgs, monthsOrder: months,
  topicMeta, phaseMeta,
  topics: Object.entries(topicAgg).map(([k, v]) => ({ key: k, label: topicMeta[k]?.label || k, color: topicMeta[k]?.color || "#999", convs: v.convs, msgs: v.msgs })).sort((a, b) => b.convs - a.convs),
  phases: Object.entries(phaseAgg).map(([k, v]) => ({ key: k, label: phaseMeta[k]?.label || k, color: phaseMeta[k]?.color || "#999", convs: v.convs, msgs: v.msgs })).sort((a, b) => b.convs - a.convs),
  topicByMonth, phaseByMonth, crosstab,
  accounts, onboarding, rampFuture, targetHeadcount: TARGET_HEADCOUNT, perPerson,
};
fs.writeFileSync(OUT, JSON.stringify(out, null, 2));

// ---- report ----
console.log("Conversations:", totalConvs, "| Messages:", totalMsgs, "(human", totalHuman, "/ asst", totalAsst, ")");
console.log("Named:", namedConvs, "| Empty (no text):", emptyConvs, "convs /", emptyMsgs, "msgs | text-but-unmatched topic:", otherTopic);
console.log("\nTOPICS:"); for (const t of out.topics) console.log("  " + t.label.padEnd(34), "convs", String(t.convs).padStart(4), "msgs", String(t.msgs).padStart(5));
console.log("\nPHASES:"); for (const p of out.phases) console.log("  " + p.label.padEnd(30), "convs", String(p.convs).padStart(4), "msgs", String(p.msgs).padStart(5));
console.log("\nMONTHLY:"); for (const r of perPerson) console.log("  " + r.month, "msgs", String(r.msgs).padStart(5), "people", String(r.people).padStart(3), "per-person", r.perPerson ?? "-");
console.log("\nACCOUNTS:"); for (const a of accounts) console.log("  " + a.label.padEnd(26), "convs", String(a.convs).padStart(4), "msgs", String(a.msgs).padStart(5), "top:", a.topTopics.map(x => x[0]).join(","));
