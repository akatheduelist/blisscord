"use client";

import { Check, UserPlus, X } from "lucide-react";
import { FC, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

interface FriendRequestsProps {
  incomingFriendRequests: IncomingFriendRequest[];
  sessionId: string;
}

const FriendRequests: FC<FriendRequestsProps> = ({
  incomingFriendRequests,
  sessionId,
}) => {
  const router = useRouter();

  const [friendRequests, setFriendRequest] = useState<IncomingFriendRequest[]>(
    incomingFriendRequests,
  );

  const acceptFriend = async (senderId: string) => {
    await axios.post("/api/requests/accept", {
      id: senderId,
    });

    setFriendRequest((prev) =>
      prev.filter((request) => request.senderId !== senderId),
    );

    // Refresh the page
    router.refresh();
  };

  const denyFriend = async (senderId: string) => {
    await axios.post("/api/requests/deny", {
      id: senderId,
    });

    setFriendRequest((prev) =>
      prev.filter((request) => request.senderId !== senderId),
    );

    // Refresh the page
    router.refresh();
  };

  return (
    <>
      {friendRequests.length === 0 ? (
        <p className="text-sm text-zinc-500">Nothing to show here...</p>
      ) : (
        friendRequests.map((request) => (
          <div key={request.senderId} className="flex gap-4 items-center">
            <UserPlus className="text-black" />

            <p className="font-medium text-lg">{request.senderEmail}</p>

            <button
              aria-label="accept friend"
              className="w-8 h-8 bg-indigo-600 hover:bg-indigo-700 grid place-item-center rounded-full transition hover:shadow-md"
            >
              <Check className="font-semibold text-white w-3/4 h-3/4" />
            </button>

            <button
              aria-label="deny friend"
              className="w-8 h-8 bg-red-600 hover:bg-red-700 grid place-item-center rounded-full transition hover:shadow-md"
            >
              <X className="font-semibold text-white w-3/4 h-3/4" />
            </button>
          </div>
        ))
      )}
    </>
  );
};

export default FriendRequests;
