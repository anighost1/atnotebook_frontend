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
import { BookPlus, Plus, UserPlus } from "lucide-react";
import { Input } from "../ui/input";
import { useState, useMemo, useEffect } from "react";
import { addFriendApi, getFriendsApi, searchUserApi } from "@/apiCalls/friends"
import debounce from "lodash/debounce"
import { getFriendKeyword } from "@/app/friends/page";
import { addCollaboratorApi } from "@/apiCalls/notebooks";

export default function AddCollaborator({ notebookData }) {
    const [friends, setFriends] = useState([])
    const [search, setSearch] = useState('')
    const [idsToDisable, setIdsToDisable] = useState([])
    const [addedCollaborators, setAddedCollaborators] = useState([])

    const debouncedChangeHandler = useMemo(
        () => debounce((value) => setSearch(value), 500),
        []
    );
    const handleChange = (e) => {
        debouncedChangeHandler(e.target.value)
    }

    const addCollaborator = async (friend_id) => {
        const dataToSend = {
            notebook: notebookData?.id,
            user: friend_id
        }
        try {
            await addCollaboratorApi(dataToSend)
            setAddedCollaborators((prev) => [...prev, friend_id])
        } catch (err) {
            console.log(err)
        }
    }

    useEffect(() => {
        const getFriends = async () => {
            try {
                const response = await getFriendsApi()
                setFriends(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        getFriends()
    }, [])

    useEffect(() => {
        if (notebookData?.collaborators?.length > 0) {
            const ids = notebookData?.collaborators.map((collaborator) => Number(collaborator?.user_id))
            setIdsToDisable(ids)
        }
    }, [notebookData])

    return (
        <AlertDialog>
            <AlertDialogTrigger asChild>
                <Button
                    className="cursor-pointer"
                >
                    Add Collaborator
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Search a friend</AlertDialogTitle>
                    <AlertDialogDescription className={'flex flex-col gap-2 py-4'}>
                        {/* <Input
                            id='search'
                            type="text"
                            placeholder="Search..."
                            onChange={handleChange}
                        /> */}
                        <div className="flex flex-col gap-2">
                            {friends.map((friend, index) => (
                                <div className="bg-[#aaaaaa22] rounded-sm p-2 px-4" key={index}>
                                    <div className="flex flex-row justify-between items-center w-full">
                                        <p>{friend?.[getFriendKeyword(friend?.friend?.id)]?.username}</p>
                                        <Button
                                            variant="default"
                                            size="sm"
                                            className="hover:scale-105 cursor-pointer"
                                            disabled={idsToDisable.includes(friend?.friend?.id) || addedCollaborators.includes(friend?.friend?.id)}
                                            onClick={() => { addCollaborator(friend?.friend?.id) }}
                                        >
                                            <BookPlus
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
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}