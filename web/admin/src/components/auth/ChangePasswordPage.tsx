import React, { useState } from "react"
import { Alert, Container, Snackbar, TextField, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { SubmitHandler, useForm } from "react-hook-form"
import { API } from "../../lib/api"

type Fields = {
    oldPassword: string,
    newPassword: string,
    newPasswordConfirmation: string
}

function ChangePasswordPage() {
    const { register, handleSubmit } = useForm<Fields>()

    const [isLoading, setIsLoading] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

    const onSubmit: SubmitHandler<Fields> = (values) => {
        if (values.newPassword !== values.newPasswordConfirmation) {
            return
        }
        setIsLoading(true)
        API.changePassword(values)
            .then(() => setIsSnackbarOpen(true))
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

            <Snackbar
                open={isSnackbarOpen}
                onClose={() => setIsSnackbarOpen(false)}
                autoHideDuration={6000}
            >
                <Alert
                    severity="success"
                    onClose={() => setIsSnackbarOpen(false)}
                    sx={{ width: "100%" }}
                >
                    Password Changed
                </Alert>
            </Snackbar>
        </form>
    )
}

export default ChangePasswordPage
