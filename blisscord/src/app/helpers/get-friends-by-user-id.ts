import { fetchRedis } from "./redis";

export const getFriendsByUserId = async (userId: string) => {
  // Get friends for current logged in user
  // smember = set member, list will be a set inside of the 'user' object
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`,
  )) as string[];

  // Promise all to fetch ALL friend IDs at the same time because the fetches of
  // multiple friends do not rely on each other
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as User;
      return friend;
    }),
  );
};
