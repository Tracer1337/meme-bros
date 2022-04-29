import { useState } from "react"
import { Container, TextField, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { SubmitHandler, useForm } from "react-hook-form"
import { useAPI } from "@meme-bros/api-sdk"
import { useSnackbar } from "@lib/snackbar"

type Fields = {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
}

function ChangePasswordPage() {
    const api = useAPI()
    
    const snackbar = useSnackbar()
    
    const { register, handleSubmit } = useForm<Fields>()

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit: SubmitHandler<Fields> = (values) => {
        if (values.newPassword !== values.newPasswordConfirmation) {
            return
        }
        setIsLoading(true)
        api.auth.changePassword(values)
            .then(() => snackbar.success())
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false))
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h4" sx={{
                textAlign: "center",
                my: 4
            }}>Change Password</Typography>

            <Container maxWidth="sm" sx={{
                display: "flex",
                flexDirection: "column"
            }}>
                <TextField
                    label="Old Password"
                    type="password"
                    sx={{ mb: 2 }}
                    {...register("oldPassword")}
                />
                <TextField
                    label="New Password"
                    type="password"
                    sx={{ mb: 2 }}
                    {...register("newPassword")}
                />
                <TextField
                    label="Confirm New Password"
                    type="password"
                    sx={{ mb: 2 }}
                    {...register("newPasswordConfirmation")}
                />
                <LoadingButton type="submit" loading={isLoading}>
                    Submit
                </LoadingButton>
            </Container>
        </form>
    )
}

export default ChangePasswordPage
