import { useDialogs } from "./dialogs"

export function useConfirm() {
    const dialogs = useDialogs()
    
    const confirm = (message: string) => {
        return dialogs.open("ConfirmationDialog", { message })
    }

    return confirm
}
