"use server";

import { z } from "zod";
import { query } from "./lib/database";

const participantSchema = z.object({
  name: z.string().min(1),
  email: z.email(),
  wish: z.string().optional(),
});

export type ParticipantInput = z.infer<typeof participantSchema>;

export async function createParticpant(formData: FormData) {
  const data = {
    name: formData.get("name")?.toString() ?? "",
    email: formData.get("email")?.toString() ?? "",
    wish: formData.get("wish")?.toString() ?? "",
  };

  const parseResult = participantSchema.safeParse(data);

  if (!parseResult.success) {
    throw new Error("Validation failed");
  }

  const { name, email, wish = "" } = parseResult.data;

  try {
    await query(
      "INSERT INTO participants (name, email, wish) VALUES ($1, $2, $3)",
      [name, email, wish],
    );
  } catch (err) {
    console.error("DB error:", err);
    throw new Error("Database error");
  }
}
