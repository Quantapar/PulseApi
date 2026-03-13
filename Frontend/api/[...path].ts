import type { VercelRequest, VercelResponse } from "@vercel/node";

const BACKEND_URL = process.env.BACKEND_URL!;

export default async function handler(req: VercelRequest, res: VercelResponse) {
  const { url, method, headers } = req;

  const targetUrl = `${BACKEND_URL}${url}`;

  const forwardHeaders: Record<string, string> = {};
  for (const [key, value] of Object.entries(headers)) {
    if (typeof value === "string") {
      forwardHeaders[key] = value;
    }
  }
  delete forwardHeaders["host"];

  try {
    const body =
      method !== "GET" && method !== "HEAD"
        ? JSON.stringify(req.body)
        : undefined;

    const response = await fetch(targetUrl, {
      method,
      headers: forwardHeaders,
      body,
    });

    // Forward response headers
    response.headers.forEach((value, key) => {
      if (key.toLowerCase() !== "transfer-encoding") {
        res.setHeader(key, value);
      }
    });

    res.status(response.status);
    const data = await response.text();
    res.send(data);
  } catch (error) {
    res.status(502).json({ error: "Bad gateway" });
  }
}
