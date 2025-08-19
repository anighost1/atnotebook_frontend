"use client"

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
import { Button } from "@/components/ui/button"
import { Plus, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useMemo, useEffect } from "react";
import { addFriendApi, searchUserApi } from "@/apiCalls/friends"
import debounce from "lodash/debounce"

export default function AddFriend({ triggerRefetch, friends }) {
    const [users, setUsers] = useState([])
    const [search, setSearch] = useState('')
    const [idsToDisable, setIdsToDisable] = useState([])
    const [requestSent, setRequestSent] = useState([])

    const addFriend = async (id) => {
        const dataToSend = {
            friend_id: id
        }
        try {
            await addFriendApi(dataToSend)
            setRequestSent((prev) => [...prev, id])
            triggerRefetch()
        } catch (err) {
            console.log(err)
        }
    }

    const debouncedChangeHandler = useMemo(
        () => debounce((value) => setSearch(value), 500),
        []
    );
    const handleChange = (e) => {
        debouncedChangeHandler(e.target.value)
    }

    useEffect(() => {
        const searchUser = async () => {
            try {
                const response = await searchUserApi(search)
                setUsers(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        if (search) {
            searchUser()
        }
    }, [search])

    useEffect(() => {
        if (friends.length > 0) {
            const ids = [...new Set(friends.flatMap((friend) => [friend.user.id, friend.friend.id]))]
            setIdsToDisable(ids)
        }
    }, [])

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="fixed bottom-6 right-6 rounded-full p-4 shadow-lg cursor-pointer hover:scale-105"
                    size={'Plus'}
                >
                    <Plus />
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Search a friend</AlertDialogTitle>
                    <AlertDialogDescription className={'flex flex-col gap-2 py-4'}>
                        <Input
                            id='search'
                            type="text"
                            placeholder="Search..."
                            onChange={handleChange}
                        />
                        <div className="flex flex-col gap-2">
                            {users.map((user, index) => (
                                <div className="bg-[#aaaaaa22] rounded-sm p-2 px-4" key={index}>
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <p>{user?.username}</p>
                                        <p>{user?.email}</p>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="hover:scale-105 cursor-pointer"
                                            disabled={idsToDisable.includes(user?.id) || requestSent.includes(user?.id)}
                                            onClick={() => { addFriend(user?.id) }}
                                        >
                                            <UserPlus
                                                className="w-4 h-4"
                                            />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                    {/* <AlertDialogAction onClick={handleCreate}>Create</AlertDialogAction> */}
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}