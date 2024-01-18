import { fetchRedis } from "./redis";

// Helper fucntion to get friends for current logged in user, this can be called anywhere in the app
// given the userId string it will return a mapped array of the user's friends.
export const getFriendsByUserId = async (userId: string) => {
  // friendIds gets an array of strings containing the current members of the given user's "friends" set,
  // thus the first arg "smembers" = set members.
  const friendIds = (await fetchRedis(
    "smembers",
    `user:${userId}:friends`,
  )) as string[];

  // Promise all to fetch ALL friend IDs at the same time because the fetches of each friend individually
  // would be wasteful and the order of them do not matter so we await ALL requests to be done.
  const friends = await Promise.all(
    friendIds.map(async (friendId) => {
      const friend = (await fetchRedis("get", `user:${friendId}`)) as string;
      const parsedFriend = JSON.parse(friend) as User;
      return parsedFriend;
    }),
  );

  // Return the list of friends pulled from the db set, parsed from JSON and mapped into an array.
  return friends;
};
