'use client'

import {FC, useState} from 'react'

interface FriendRequestsProps{}

const FriendRequests: FC<FriendRequestsProps> = ({}) => {
  const [friendRequests, setFriendRequest] = useState<IncomingFriendRequest[]>(incomingFriendRequests)
  return <div></div>
}

export default FriendRequests
