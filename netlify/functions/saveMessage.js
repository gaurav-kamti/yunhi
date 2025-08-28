const { MongoClient } = require("mongodb");

let client; // reused across invocations

function cors(headers = {}) {
  return {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "POST, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type",
    ...headers,
  };
}

function wordCount(s) {
  return s.trim().split(/\s+/).filter(Boolean).length;
}

exports.handler = async (event) => {
  // Preflight
  if (event.httpMethod === "OPTIONS") {
    return { statusCode: 200, headers: cors(), body: "ok" };
  }
  if (event.httpMethod !== "POST") {
    return {
      statusCode: 405,
      headers: cors(),
      body: JSON.stringify({ error: "Method Not Allowed" }),
    };
  }

  try {
    const { name, message } = JSON.parse(event.body || "{}");

    // Basic validation
    if (!name || !message) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ error: "Name and message are required." }),
      };
    }
    if (name.length < 2 || name.length > 40) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ error: "Name must be 2–40 chars." }),
      };
    }
    const wc = wordCount(message);
    if (wc > 15) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ error: "Message must be ≤ 15 words." }),
      };
    }
    if (message.length > 200) {
      return {
        statusCode: 400,
        headers: cors(),
        body: JSON.stringify({ error: "Message too long." }),
      };
    }

    // Connect (reuse across calls)
    if (!client) {
      client = new MongoClient(process.env.MONGODB_URI);
      await client.connect();
    }
    const db = client.db(process.env.MONGODB_DB_NAME || "birthday");
    const col = db.collection(process.env.MONGODB_COLLECTION || "messages");

    const doc = {
      name: String(name).trim(),
      message: String(message).trim(),
      createdAt: new Date(),
      // optional metadata:
      ua: event.headers["user-agent"] || "",
      ip: event.headers["x-nf-client-connection-ip"] || event.ip || "",
    };

    await col.insertOne(doc);

    return {
      statusCode: 200,
      headers: cors(),
      body: JSON.stringify({ ok: true }),
    };
  } catch (err) {
    console.error(err);
    return {
      statusCode: 500,
      headers: cors(),
      body: JSON.stringify({ error: "Server error" }),
    };
  }
};
