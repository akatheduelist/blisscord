import { Icon, Icons } from "@/components/Icons";
import Image from "next/image";
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ReactNode } from "react";
import SignOutButton from "@/components/SignOutButton";
import FriendRequestSidebarOptions from "@/components/FriendRequestSidebarOptions";
import { fetchRedis } from "@/app/helpers/redis";
import { getFriendsByUserId } from "@/app/helpers/get-friends-by-user-id";
import SidebarChatList from "@/components/SidebarChatList";
import { SidebarOptions } from "@/types/typings";
import MobileChatLayout from "@/components/MobileChatLayout";

interface layoutProps {
  children: ReactNode;
}

const sidebarOptions: SidebarOptions[] = [
  {
    id: 1,
    name: "Add friend",
    href: "/dashboard/add",
    Icon: "UserPlus",
  },
];

// Layout component of main dashboard route configures a server rendered sidebar
// that does not get re-rendered with the internal pages improving performance.
// The layout takes in ReactNodes as children which are going to be the 'internal'
// components that get rendered to the right of the side bar.
const layout = async ({ children }: layoutProps) => {
  // getServerSession is function provided by next-auth to get the current auth session
  // authOptions is an object created in the "auth" library for passing important info
  // to next-auth such as jwt token needed to verify the session.
  const session = await getServerSession(authOptions);

  if (!session) notFound();

  // getFriendsByUserId is just a helper function to poll the db for a list of friends based on the current users id.
  const friends = await getFriendsByUserId(session.user.id);

  const unseenRequestCount = (
    (await fetchRedis(
      "smembers",
      "user:$(session.user.id):incoming_friend_requests",
    )) as User[]
  ).length;

  return (
    <div className="w-full flex h-screen">
      <div className="md:hidden">
        <MobileChatLayout
          friends={friends}
          session={session}
          sidebarOptions={sidebarOptions}
          unseenRequestCount={unseenRequestCount}
        />
      </div>
      <div className="hidden md:flex h-full w-full max-w-xs grow flex-col gap-y-5 overflow-y-auto border-r border-gray-200 bg-white px-6">
        <Link href="/dashboard" className="flex h-16 shrink-0 items-center">
          <Icons.Logo className="h-8 w-auto text-indigo-600" />
        </Link>

        {friends.length > 0 ? (
          <div className="text-xs font-semibold leading-6 text-gray-400">
            Current chats
          </div>
        ) : null}

        <nav className="flex flex-1 flex-col">
          <ul role="list" className="flex flex-1 flex-col gap-y-7">
            <li>
              <SidebarChatList sessionId={session.user.id} friends={friends} />
            </li>
            <li>
              <div className="text-xs font-semibold leading-6 text-gray-400">
                Overview
              </div>
              <ul role="list" className="-mx-2 mt-2 space-y-1">
                {sidebarOptions.map((option) => {
                  const Icon = Icons[option.Icon];
                  return (
                    <li key={option.id}>
                      <Link
                        href={option.href}
                        className="text-gray-700 hover:text-indigo-600 hover:bg-gray-50 group flex gap-3 rounded-md p-2 text-sm leading-6 font-semibold"
                      >
                        <span className="text-gray-400 border-gray-200 group-hover:border-indigo-600 group-hover:text-indigo-600 flex h-6 w-6 shrink-0 items-center justify-center rounded-lg border text-[0.625rem] font-medium bg-white">
                          <Icon className="h-4 w-4" />
                        </span>

                        <span className="truncate">{option.name}</span>
                      </Link>
                    </li>
                  );
                })}
                <li>
                  <FriendRequestSidebarOptions
                    sessionId={session.user.id}
                    initialUnseenRequestCount={unseenRequestCount}
                  />
                </li>
              </ul>
            </li>
            <li className="-mx-6 mt-auto flex items-center">
              <div className="flex flex-1 items-center gap-x-2 px-3 py-3 text-sm font-semibold leading-6 text-gray-900">
                <div className="relative h-8 w-8 bg-gray-50">
                  <Image
                    fill
                    referrerPolicy="no-referrer"
                    className="rounded-full"
                    src={session.user.image || ""}
                    alt="Profile picture"
                  />
                </div>
                <span className="sr-only">Your Profile</span>
                <div className="flex flex-col">
                  <span aria-hidden="true">{session.user.name}</span>
                  <span className="text-xs text-zinc-400" aria-hidden="true">
                    {session.user.email}
                  </span>
                </div>
                <div className="relative h-8 w-8 bg-gray-50">
                  <SignOutButton className="h-8 w-8 p-2 aspect-square" />
                </div>
              </div>
            </li>
          </ul>
        </nav>
      </div>
      <aside className="max-h-screen container py-16 md:py-12 w-full">
        {children}
      </aside>
    </div>
  );
};

export default layout;
