import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { id: idToAdd } = z.object({ id: z.string() }).parse(body);

    const session = await getServerSession(authOptions);

    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Users cannot already be friends
    const alreadyFriends = await fetchRedis(
      "sismember",
      `user:${session.user.id}:friends`,
      idToAdd,
    );

    if (alreadyFriends) {
      return new Response("You are already friends.", { status: 400 });
    }

    // Valid friend request must be in the database already
    const hasFriendRequest = await fetchRedis(
      "sismember",
      `user:${session.user.id}:incoming_friend_requests`,
      idToAdd,
    );

    if (!hasFriendRequest) {
      return new Response("No friend request", { status: 400 });
    }

    // sadd = Adding to the set
    // srem = Remove from set
    await db.sadd(`user:${session.user.id}:friends`, idToAdd);
    await db.sadd(`user:${idToAdd}:friends`, session.user.id); // If you are my friend, I am your friend
    await db.srem(`user:${session.user.id}:incoming_friend_requests`, idToAdd); // Clean up your requests

    return new Response("OK"); // All seems to be coming back good but getting a 500 error? Adding a response fixes this.
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response("Invalid request payload", { status: 422 }); // Validation error from Zod
    }

    return new Response("Invalid request", { status: 400 }); // Else => Generic 400 error
  }
}
