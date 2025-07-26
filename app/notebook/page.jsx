"use client"

import { deleteNotebooksApi, getNotebooksApi } from "@/apiCalls/notebooks";
import { useEffect, useState } from "react";
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
import truncateString from "@/utils/truncateString";
import { Badge } from "@/components/ui/badge"
import AddNotebook from "@/components/notebook/addNotebook";
import { Trash } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";

export default function Notebooks() {

    const [notebooks, setNotebooks] = useState([])
    const [refetch, setRefetch] = useState(false)
    const router = useRouter()

    const triggerRefetch = () => {
        setRefetch(prev => !prev)
    }

    useEffect(() => {
        const getNotebooks = async () => {
            try {
                const response = await getNotebooksApi()
                setNotebooks(response?.data)
            } catch (err) {
                console.log(err)
            }
        }
        getNotebooks()
    }, [refetch])

    const handleRedirect = (notebookId) => {
        router.push(`/notebook/${notebookId}`)
    }

    const handlePropagation = (e) => {
        e?.stopPropagation()
    }

    const handleDelete = async (e, notebookId) => {
        e?.stopPropagation()
        try {
            const response = await deleteNotebooksApi(notebookId)
            triggerRefetch()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <>
            <AddNotebook triggerRefetch={triggerRefetch} />
            <div className="p-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {
                    notebooks?.map((notebook, index) => (
                        <Card key={index} onClick={() => { handleRedirect(notebook?.id) }} className={'hover:scale-105 transition cursor-pointer'}>
                            <CardHeader>
                                <CardTitle>{notebook?.title}</CardTitle>
                                <CardAction>
                                    <AlertDialog>
                                        <AlertDialogTrigger asChild>
                                            <Button onClick={handlePropagation} variant="outline" size="icon" className="size-8">
                                                <Trash className="text-red-700" />
                                            </Button>
                                        </AlertDialogTrigger>
                                        <AlertDialogContent>
                                            <AlertDialogHeader>
                                                <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                <AlertDialogDescription>
                                                    This action cannot be undone. This will permanently delete <strong>{notebook?.title}</strong> notebook.
                                                </AlertDialogDescription>
                                            </AlertDialogHeader>
                                            <AlertDialogFooter>
                                                <AlertDialogCancel onClick={handlePropagation}>Cancel</AlertDialogCancel>
                                                <AlertDialogAction className={'bg-red-700'} onClick={(e) => { handleDelete(e, notebook?.id) }}>Delete</AlertDialogAction>
                                            </AlertDialogFooter>
                                        </AlertDialogContent>
                                    </AlertDialog>


                                </CardAction>
                                <CardDescription>{truncateString(notebook?.content)}</CardDescription>
                                <LimitedTags collaborators={notebook?.collaborators} />
                            </CardHeader>
                        </Card>
                    ))
                }
            </div>
        </>
    );
}

const LimitedTags = ({ collaborators = [] }) => {
    const limit = 3;
    const shown = collaborators.slice(0, limit);
    const remaining = collaborators.length - limit;

    return (
        <div className="flex flex-row gap-2 flex-wrap">
            {collaborators.length < 1 && (
                <Badge variant={'outline'}>
                    No contributors yet
                </Badge>
            )}
            {shown.map((item, index) => (
                <Badge key={index} variant={'secondary'}>
                    {item?.username}
                </Badge>
            ))}
            {remaining > 0 && (
                <span className="bg-gray-200 text-gray-800 text-sm px-2 py-1 rounded">
                    +{remaining} more
                </span>
            )}
        </div>
    );
};