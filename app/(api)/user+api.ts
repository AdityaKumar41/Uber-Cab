import { neon } from "@neondatabase/serverless";

export async function POST(request: Request) {
  const sql = neon(process.env.EXPO_DATABASE_URL!);
  const { name, email, clerkId, phone } = await request.json();
  try {
    if (!name || !email || !clerkId) {
      return Response.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    const result =
      await sql`INSERT INTO Users (name, email, clerk_id, phone) VALUES (${name}, ${email}, ${clerkId}, ${phone})`;

    return Response.json({ data: result }, { status: 200 });
  } catch (error) {
    console.log(error);
    return Response.json({ error: error }, { status: 500 });
  }
}
