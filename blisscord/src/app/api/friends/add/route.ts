import { fetchRedis } from "@/app/helpers/redis";
import { authOptions } from "@/lib/auth";
import { db } from "@/lib/db";
import { addFriendValidator } from "@/lib/validations/add-friend";
import { getServerSession } from "next-auth";
import { z } from "zod";

export async function POST(req: Request) {
  try {
    const body = await req.json();

    const { email: emailToAdd } = addFriendValidator.parse(body.email);

    const response = await fetch(
      `${process.env.UPSTASH_REDIS_REST_URL}/get/user:email${emailToAdd}`,
      {
        headers: {
          Authorization: `Bearer ${process.env.UPSTASH_REDIS_REST_TOKEN}`,
        },
        cache: "no-store",
      },
    );

    const data = (await response.json()) as { result: string | null };

    const userId = data.result;

    // Does the user exist?
    if (!userId) {
      return new Response("This person does not exist.", { status: 400 });
    }

    const session = await getServerSession(authOptions);

    // Is the user making the request logged in?
    if (!session) {
      return new Response("Unauthorized", { status: 401 });
    }

    // Is the user trying to add themself as a friend?
    if (userId === session.user.id) {
      return new Response("You cannot add yourself.", { status: 400 });
    }

    // Has the user already sent this friend a request?
    const hasRequested = (await fetchRedis(
      "sismember",
      `user:${userId}:incoming_friend_request`,
      session.user.id,
    )) as 0 | 1;

    if (hasRequested) {
      return new Response("You have already added this user.", { status: 400 });
    }

    // Are these users already friends?
    const isFriend = (await fetchRedis(
      "sismember",
      `user:${userId}:friends`,
      userId,
    )) as 0 | 1;

    if (isFriend) {
      return new Response("You are already friends.", { status: 400 });
    }

    // Success
    db.sadd(`user:${userId}:incoming_friend_requests`, session.user.id);
    return new Response("OK");
  } catch (error) {
    if (error instanceof z.ZodError) {
      return new Response(`Invalid Request`, { status: 422 });
    }

    return new Response("Invalid Request", { status: 400 });
  }
}
