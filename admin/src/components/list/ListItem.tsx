import React, { useState } from "react"
import { useMutation } from "react-query"
import { AnyFunction } from "tsdef"
import { ListItem as MuiListItem, IconButton } from "@mui/material"
import DeleteIcon from "@mui/icons-material/Delete"
import { useSnackbar } from "../../lib/snackbar"
import { useConfirm } from "../../lib/confirm"

function ListItem({
    children,
    label,
    deleteMutation: deleteFn,
    onDelete
}: React.PropsWithChildren<{
    label: number | string,
    deleteMutation: () => Promise<void>,
    onDelete?: AnyFunction
}>) {
    const snackbar = useSnackbar()

    const [isDeleting, setIsDeleting] = useState(false)

    const deleteMutation = useMutation(
        () => deleteFn(),
        {
            onMutate: () => setIsDeleting(true),
            onSuccess: () =>  {
                snackbar.success()
                onDelete?.()
            },
            onError: (error) => {
                console.error(error)
                snackbar.error()
            },
            onSettled: () => {
                setIsDeleting(false)
            }
        }
    )

    const confirm = useConfirm()

    const handleDelete = async () => {
        if (await confirm(`The item '${label}' will be deleted`)) {
            deleteMutation.mutate()
        }
    }

    return (
        <MuiListItem
            secondaryAction={
                <IconButton
                    edge="end"
                    onClick={() => handleDelete()}
                    disabled={isDeleting}
                >
                    <DeleteIcon/>
                </IconButton>
            }
        >
            {children}
        </MuiListItem>
    )
}

export default ListItem
