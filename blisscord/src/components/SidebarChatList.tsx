import { FC } from "react";

interface sidebarChatListProps {
  friends: User[];
}

const SidebarChatList: FC<SidebarChatListProps> = ({ }) => {
  return (
    <ul role="list" className="max-h-[25rem] overflow-y-auto -mx-2 space-y-1">
      {/* {friends.sort().map} */}
    </ul>
  );
};

export default SidebarChatList;
