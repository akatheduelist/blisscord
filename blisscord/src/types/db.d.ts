// Define DB types so they don't have to be defined around the app
interface User {
  name: string;
  email: string;
  id: string;
  image: string;
}

interface Chat {
  id: string;
  messages: Message[];
}

interface Message {
  id: string;
  senderId: string;
  receiverId: string;
  text: string;
  timestamp: number;
}

interface FriendRequest {
  id: string;
  senderID: string;
  receiverId: string;
}
