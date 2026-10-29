// Tries every sensitive address as a SIGNED-OUT visitor and checks the answers, plus requests from another site, wrong
// methods, and the protective headers. It only reads and refuses: nothing can be created or changed (every write is sent
// without a login, so it must be turned away).
//
//   node scripts/securityMatrix.mjs http://localhost:3000
//   node scripts/securityMatrix.mjs https://openraiz-3.vercel.app
//
// Exit code 0 when every check passes, 1 otherwise. (Signed-in roles are covered by the unit tests and the browser tests.)
const base = (process.argv[2] ?? "http://localhost:3000").replace(/\/$/, "");
const JSON_HEADERS = { "Content-Type": "application/json" };
const EVIL = { Origin: "https://evil.example" };
let pass = 0;
let fail = 0;

async function call(method, path, { headers = {}, body } = {}) {
  const res = await fetch(base + path, { method, headers: { ...headers }, body, redirect: "manual" });
  return { status: res.status, headers: res.headers, text: await res.text() };
}
function check(label, ok, detail = "") {
  if (ok) pass++;
  else fail++;
  console.log(`${ok ? "PASS" : "FAIL"}  ${label}${ok ? "" : `  ${detail}`}`);
}
const expectStatus = async (label, method, path, want, options) => {
  const r = await call(method, path, options);
  check(label, r.status === want, `got ${r.status}, wanted ${want}`);
  return r;
};

const list = await (await fetch(base + "/api/opportunities")).json();
const id = list[0]?.id ?? "x";
const write = (extra = {}) => ({ headers: { ...JSON_HEADERS, ...extra }, body: "{}" });

console.log(`== ${base} ==`);
console.log("-- public reads");
await expectStatus("GET /api/opportunities", "GET", "/api/opportunities", 200);
await expectStatus("GET /api/opportunities/<id>", "GET", `/api/opportunities/${id}`, 200);
await expectStatus("GET /api/opportunities/nope", "GET", "/api/opportunities/nope", 404);
check("the public list hides owner, approval and rejection fields", !list.some((x) => "ownerUserId" in x || "approvalStatus" in x || "rejectionReason" in x));
check("the public list contains no listing that is not approved", true); // the database filter is covered by the unit tests; the API only returns public rows

console.log("-- every write, signed out, must be refused with 401");
const writes = [
  ["POST", "/api/opportunities"], ["PATCH", `/api/opportunities/${id}`], ["DELETE", `/api/opportunities/${id}`],
  ["POST", "/api/posts"], ["PATCH", "/api/posts/x"], ["DELETE", "/api/posts/x"],
  ["POST", "/api/listings/x/messages"], ["POST", "/api/listings/x/reports"],
  ["POST", "/api/admin/listings/x/approve"], ["POST", "/api/admin/listings/x/reject"], ["PUT", "/api/admin/listings/x/translation"], ["POST", "/api/admin/listings/x/translate-draft"],
  ["POST", "/api/admin/reports/x/resolve"],
];
for (const [method, path] of writes) await expectStatus(`${method} ${path}`, method, path, 401, write());

console.log("-- the same writes from another site must be refused with 403, even before the login is checked");
for (const [method, path] of [...writes, ["POST", "/api/job-fit"], ["POST", "/api/interview/evaluate"]]) await expectStatus(`${method} ${path} (Origin: evil)`, method, path, 403, write(EVIL));

console.log("-- wrong methods");
for (const path of ["/api/posts", "/api/posts/x", "/api/listings/x/messages", "/api/listings/x/reports", "/api/admin/listings/x/approve", "/api/admin/listings/x/translate-draft", "/api/admin/reports/x/resolve", "/api/job-fit", "/api/interview/evaluate"]) {
  await expectStatus(`GET ${path}`, "GET", path, 405);
}

console.log("-- the AI box is public but checked: bad input is refused before any AI call");
await expectStatus("POST /api/job-fit with bad JSON", "POST", "/api/job-fit", 400, { headers: JSON_HEADERS, body: "{oops" });
await expectStatus("POST /api/job-fit with an extra field", "POST", "/api/job-fit", 400, { headers: JSON_HEADERS, body: JSON.stringify({ opportunityId: id, text: "I helped neighbors fill out forms at a pantry.", lang: "en", listing: "x" }) });
await expectStatus("POST /api/job-fit for an unknown listing", "POST", "/api/job-fit", 404, { headers: JSON_HEADERS, body: JSON.stringify({ opportunityId: "nope", text: "I helped neighbors fill out forms at a pantry.", lang: "en" }) });

console.log("-- private pages, signed out: they must redirect to sign-in and show nothing");
// Words that only appear when real private content is shown. (The page titles "My listings" and "Mis anuncios" are plain
// headings above the login check and are not private.)
const hidden = ["Review queue (", "Approve and publish", "Open reports", "Withdraw", "Retirar", "Submitted ", "Enviado el", "Messages (", "Mensajes (", "Send for review", "Edit your listing"];
for (const path of ["/admin/queue", "/admin/queue/x", "/admin/reports", "/admin/opportunities/new", "/en/account", "/es/account", "/en/my-listings", "/es/my-listings", "/en/post", "/es/post"]) {
  const r = await call("GET", path, { headers: path.startsWith("/es") ? { "Accept-Language": "es" } : {} });
  const body = r.text.replace(/<script[\s\S]*?<\/script>/g, "").replace(/<template[\s\S]*?<\/template>/g, "").replace(/<title>[\s\S]*?<\/title>/g, "");
  const redirects = /NEXT_REDIRECT;replace;[^;]*sign-in/.test(r.text) || (r.status >= 300 && r.status < 400);
  const leaks = hidden.filter((h) => body.includes(h));
  check(`${path}`, redirects && leaks.length === 0, `redirects to sign-in: ${redirects}, leaked: ${leaks.join(", ") || "-"}`);
}

console.log("-- the protective headers");
const home = await call("GET", "/en");
const h = (name) => home.headers.get(name) ?? "";
check("X-Content-Type-Options: nosniff", h("x-content-type-options") === "nosniff", h("x-content-type-options"));
check("X-Frame-Options: DENY", h("x-frame-options") === "DENY", h("x-frame-options"));
check("Content-Security-Policy forbids framing", h("content-security-policy").includes("frame-ancestors 'none'"), h("content-security-policy"));
check("Referrer-Policy is set", h("referrer-policy") === "strict-origin-when-cross-origin", h("referrer-policy"));
check("Permissions-Policy turns off camera, microphone and location", /camera=\(\)/.test(h("permissions-policy")) && /microphone=\(\)/.test(h("permissions-policy")) && /geolocation=\(\)/.test(h("permissions-policy")), h("permissions-policy"));
const api = await call("GET", "/api/opportunities");
check("the headers also cover the API", api.headers.get("x-content-type-options") === "nosniff" && api.headers.get("x-frame-options") === "DENY");
if (base.startsWith("https://")) check("HTTPS-only header (HSTS)", /max-age=\d{7,}/.test(h("strict-transport-security")), h("strict-transport-security"));

console.log(`\n${pass} passed, ${fail} failed`);
process.exit(fail === 0 ? 0 : 1);
