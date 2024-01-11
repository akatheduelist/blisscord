import { fetchRedis } from "@/app/helpers/redis";
import { messageArrayValidator } from "@/lib/validations/message";
import { FC } from "react";

interface PageProps {
  params: {
    chatId: string;
  };
}

async function getChatMessages(chatId: string) {
  try {
    const results: string[] = await fetchRedis(
      "zrange",
      `chat:${chatId}:messages`,
      0,
      -1,
    );
  } catch (error) {
    notFound();
  }

  const dbMessages = results.map((message) => JSON.parse(message) as Message);
  const reversedDbMessages = dbMessages.reverse();
  const messages = messageArrayValidator.parse(reversedDbMessages);
}

// Gets the 'chatId' params from the [chatId] in the routing structure
const page = async ({ params }: PageProps) => {
  const { chatId } = params;

  return <div>{params.chatId}</div>;
};

export default page;
