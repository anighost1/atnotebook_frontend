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
import { Plus } from "lucide-react";
import { Input } from "../ui/input";
import { Textarea } from "../ui/textarea";
import { useState } from "react";
import decodedToken from "@/utils/tokenDecoder";
import { createNotebooksApi } from "@/apiCalls/notebooks";

export default function AddNotebook({ triggerRefetch }) {
    const [data, setData] = useState({})

    const handleChange = (e) => {
        const { id, value } = e.target
        setData((prev) => ({
            ...prev,
            [id]: value
        }))
    }

    const handleCreate = async () => {
        const dataToSend = {
            ...data,
            owner: decodedToken()?.user_id
        }
        try {
            const response = await createNotebooksApi(dataToSend)
            triggerRefetch()
        } catch (err) {
            console.log(err)
        }
    }

    const handleCancel = () => {
        setData({})
    }

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
                    <AlertDialogTitle>Create a new Notebook</AlertDialogTitle>
                    <AlertDialogDescription className={'flex flex-col gap-2 py-4'}>
                        <Input
                            id='title'
                            type="text"
                            placeholder="Title"
                            onChange={handleChange}
                        />
                        <Textarea
                            id='content'
                            placeholder="Content"
                            onChange={handleChange}
                        />
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel onClick={handleCancel}>Cancel</AlertDialogCancel>
                    <AlertDialogAction onClick={handleCreate}>Create</AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}