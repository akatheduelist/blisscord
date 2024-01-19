import { chatHrefConstructor, cn } from "@/lib/utils";
import Image from "next/image";
import { FC } from "react";
import toast, { Toast } from "react-hot-toast";

interface UnseenChatToastProps {
  t: Toast;
  sessionId: string;
  senderId: string;
  senderImg: string;
}

const UnseenChatToast: FC<UnseenChatToastProps> = ({
  t,
  senderId,
  sessionId,
}) => {
  return (
    <div
      className={cn(
        "max-w-md w-full bg-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5",
        {
          "animate-enter": t.visible,
          "animate-leave": !t.visible,
        },
      )}
    >
      <a
        onClick={() => toast.dismiss(t.id)}
        className="flex-1 w-0 p-4"
        href={`/dashboard/chat/${chatHrefConstructor(sessionId, senderId)}`}
      >
        <div className="flex items-start">
          <div className="flex-shrink-0 pt-0.5">
            <div className="relative h-10 w-10">
              <Image />
            </div>
          </div>
        </div>
      </a>
    </div>
  );
};

export default UnseenChatToast;
