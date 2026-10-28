import { readFile, writeFile } from "node:fs/promises";
import { pathToFileURL } from "node:url";
import path from "node:path";

globalThis.window = {};
await import(`${pathToFileURL(path.resolve("content.js"))}?publish=${Date.now()}`);
const engagement = globalThis.window.ENGAGEMENT;

if (!engagement?.PUBLIC_URL) {
  throw new Error("Set PUBLIC_URL in content.js to the published HTTPS site URL first.");
}

const pageUrl = new URL(engagement.PUBLIC_URL);
if (pageUrl.protocol !== "https:" || !pageUrl.pathname.endsWith("/")) {
  throw new Error("PUBLIC_URL must be an HTTPS URL ending with a slash, such as https://example.com/invitation/");
}
const imageUrl = new URL(engagement.OPEN_GRAPH_IMAGE, pageUrl).href;
const escapeHtml = (value) => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll('"', "&quot;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;");

let html = await readFile("index.html", "utf8");
function setMeta(key, value, attribute = "property") {
  const matcher = new RegExp(`<meta(?=[^>]*\\b${attribute}=[\"']${key}[\"'])[^>]*>`, "i");
  if (!matcher.test(html)) throw new Error(`Could not find the ${key} meta tag in index.html`);
  html = html.replace(matcher, (tag) => tag.replace(/\bcontent=(["']).*?\1/i, `content="${escapeHtml(value)}"`));
}

setMeta("description", `Join ${engagement.BRIDE_NAME} and ${engagement.GROOM_NAME} as they celebrate their engagement on ${engagement.EVENT_DATE}.`, "name");
setMeta("og:title", engagement.OPEN_GRAPH_TITLE);
setMeta("og:description", engagement.OPEN_GRAPH_DESCRIPTION);
setMeta("og:url", pageUrl.href);
setMeta("og:image", imageUrl);
html = html.replace(/<title>.*?<\/title>/i, `<title>${escapeHtml(`${engagement.BRIDE_NAME} & ${engagement.GROOM_NAME} | Engagement Invitation`)}</title>`);
await writeFile("index.html", html);
process.stdout.write(`Social preview metadata prepared for ${pageUrl.href}\n`);
