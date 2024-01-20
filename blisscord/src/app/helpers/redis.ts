// Get the URL and Token from environment variables
const upstashRedisUrl = process.env.UPSTASH_REDIS_REST_URL;
const upstashRedisToken = process.env.UPSTASH_REDIS_REST_TOKEN;

// Redis fetch possible command types:
// get = return the string value of a key or 'Nil'
// sismember = is the provided value a member of a the set? returns 0 or 1
// smembers = return all members of a set
// zrange = get a range of values from a sorted set, sorted sets have an accompanying score value starting with 0, the next being 1, and -1 represending the end.
type Command = "zrange" | "sismember" | "get" | "smembers";

// Helper function to make constructing Redis fetches easier and type safe
export async function fetchRedis(
  command: Command,
  ...args: (string | number)[]
) {
  const commandUrl = `${upstashRedisUrl}/${command}/${args.join("/")}`;

  const response = await fetch(commandUrl, {
    headers: {
      Authorization: `Bearer ${upstashRedisToken}`,
    },

    // Avoid strange behavior from Next.JS app, DO NOT hold fetch info in cache
    cache: "no-store",
  });

  if (!response.ok) {
    throw new Error(`Redis Error: ${response.statusText}`);
  }

  const data = await response.json();

  return data.result;
}
