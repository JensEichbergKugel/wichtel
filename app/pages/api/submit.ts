// pages/api/submit.ts
import type { NextApiRequest, NextApiResponse } from "next";
import { query } from "../../lib/database";

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse,
) {
  if (req.method !== "POST") {
    return res.status(405).json({ error: "Method not allowed" });
  }

  const { email, name, wish } = req.body;

  if (!email || !name || !wish) {
    return res.status(400).json({ error: "Missing fields" });
  }

  try {
    await query(
      "INSERT INTO participant (email, name, wish) VALUES ($1, $2, $3)",
      [email, name, wish],
    );

    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("DB Error:", error);
    return res.status(500).json({ error: "Internal server error" });
  }
}
