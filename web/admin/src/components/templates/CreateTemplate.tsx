import React, { useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { useSWRConfig } from "swr"
import { Alert, Grid, Paper, Snackbar, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useSharedContext } from "@meme-bros/shared/dist"
import RNApp from "../RNApp"
import { API } from "../../lib/api"
import { scaleCanvas } from "./utils/scale"

type Fields = {
    name: string
}

function CreateTemplate() {
    const context = useSharedContext()

    const { mutate } = useSWRConfig()
    
    const { register, handleSubmit } = useForm<Fields>()

    const [isLoading, setIsLoading] = useState(false)
    const [isSnackbarOpen, setIsSnackbarOpen] = useState(false)

    const onSubmit: SubmitHandler<Fields> = (formValues) => {
        if (!formValues.name || !context.renderCanvas) {
            return
        }
        const values: API.CreateTemplate = {
            ...formValues,
            canvas: scaleCanvas(context.canvas)
        }
        setIsLoading(true)
        API.createTemplate(values)
            .then(() => {
                setIsSnackbarOpen(true)
                mutate("templates")
            })
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false))
    }
    
    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Grid container spacing={2}>
                <Grid item xs={10}>
                    <TextField
                        label="Name"
                        fullWidth
                        sx={{ mb: 2 }}
                        {...register("name")}
                    />
                </Grid>
                <Grid item xs={2}>
                    <LoadingButton type="submit" loading={isLoading}>
                        Create
                    </LoadingButton>
                </Grid>
            </Grid>
            <Paper variant="outlined">
                <RNApp
                    width={window.innerWidth * 0.4}
                    height={window.innerHeight * 0.8}
                />
            </Paper>

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
                    Template Created
                </Alert>
            </Snackbar>
        </form>
    )
}

export default CreateTemplate
