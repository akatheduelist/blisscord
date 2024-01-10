import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
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

    console.log("hasFriendRequest =>", hasFriendRequest);
  } catch (error) {}
}
