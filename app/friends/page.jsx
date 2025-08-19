"use client"

import { acceptRequestApi, getFriendsApi, getPendingRequestsApi } from "@/apiCalls/friends"
import { useEffect, useState } from "react"

import {
    Card,
    CardAction,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button";
import { Trash, UserPlus } from "lucide-react";
import UserDetailsFetcher from "@/lib/userDetailsFetcher"
import AddFriend from "@/components/friend/addFriend"
import { useSearchParams } from "next/navigation"

export const getFriendKeyword = (friendId) => {
    const loggedInUser = UserDetailsFetcher()
    if (friendId === loggedInUser?.user_id) {
        return 'user'
    } else {
        return 'friend'
    }
}

export default function Friends() {
    const [friends, setFriends] = useState([])
    const [refetch, setRefetch] = useState(false)
    const searchParams = useSearchParams();
    const status = searchParams.get('status')

    const triggerRefetch = () => {
        setRefetch(prev => !prev)
    }

    const handlePropagation = (e) => {
        e?.stopPropagation()
    }

    useEffect(() => {
        const getFriends = async () => {
            try {
                let response = {}
                if (!status || status === 'accepted') {
                    response = await getFriendsApi()
                } else if (status === 'pending') {
                    const res = await getPendingRequestsApi()
                    const currentUser = UserDetailsFetcher()
                    const temp = res?.data.filter((friend) => friend?.user?.id !== currentUser?.user_id)
                    response.data = temp
                }
                setFriends(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        getFriends()
    }, [refetch, status])

    const acceptRequest = async (request_id) => {
        try {
            await acceptRequestApi(request_id)
            refetch()
        } catch (err) {
            console.log(err)
        }
    }

    if (friends.length < 1) {
        return (
            <div className=" rounded-sm bg-[#55555511] m-2 flex justify-center items-center py-8">
                <AddFriend triggerRefetch={triggerRefetch} friends={friends} />
                <p className="font-semibold">No friend to show</p>
            </div>
        )
    }

    return (
        <>
            <AddFriend triggerRefetch={triggerRefetch} friends={friends} />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    friends.map((friend, index) => (
                        <Card key={index} className={'hover:scale-105 transition cursor-pointer'}>
                            <CardHeader>
                                <CardTitle>{`${friend?.[getFriendKeyword(friend?.friend?.id)]?.first_name} ${friend?.[getFriendKeyword(friend?.friend?.id)]?.last_name}`}</CardTitle>
                                <CardDescription className="flex flex-col gap-1">
                                    <p>{friend?.[getFriendKeyword(friend?.friend?.id)]?.username}</p>
                                    <p>{friend?.[getFriendKeyword(friend?.friend?.id)]?.email}</p>
                                </CardDescription>
                                <CardAction>
                                    {status !== 'pending' && (<AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={handlePropagation} variant="outline" size="icon" className="size-8">
                                                <Trash className="text-red-700" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action will unfriend <strong>{friend?.[getFriendKeyword(friend?.friend?.id)]?.username}</strong>.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={handlePropagation}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className={'bg-red-700'} onClick={(e) => { alert('This option will be available soon.') }}>Unfriend</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>)}
                                    {status === 'pending' && (
                                        <Button onClick={() => { handlePropagation(); acceptRequest(friend?.id) }} variant="outline" size="icon" className="size-8">
                                            <UserPlus className="text-red-700" />
                                        </Button>
                                    )}
                                </CardAction>
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
        </>
    )
}