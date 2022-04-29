import React, { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Grid, Paper, TextField } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import WebApp from "@meme-bros/web"
import { useListeners, useSharedContext } from "@meme-bros/client-lib"
import * as API from "@meme-bros/api-sdk"
import { scaleCanvas } from "./utils/scale"
import { useSnackbar } from "../../lib/snackbar"

export type Fields = Pick<API.CreateTemplate, "name" | "canvas">

const emptyTemplate: API.Template = {
    id: "",
    hash: "",
    name: "",
    previewFile: ""
}

function TemplateForm({ values, ...props }: {
    values?: Fields,
    onSubmit: (values: Fields) => Promise<any>
}) {
    const context = useSharedContext()

    const snackbar = useSnackbar()
    
    const { register, handleSubmit, reset } = useForm<Fields>({
        defaultValues: values
    })

    const [isLoading, setIsLoading] = useState(false)

    const onSubmit: SubmitHandler<Fields> = (formValues) => {
        if (!formValues.name || !context.renderCanvas) {
            return
        }
        const values: Fields = {
            ...formValues,
            canvas: scaleCanvas(context.canvas)
        }
        setIsLoading(true)
        props.onSubmit(values)
            .then(() => snackbar.success())
            .catch((error) => console.error(error))
            .finally(() => setIsLoading(false))
    }

    const renderTemplate = () => {
        if (values?.canvas) {
            context.events.emit("template.load", {
                template: emptyTemplate,
                canvas: values.canvas as any
            })
        }
    }

    useEffect(() => {
        reset(values)
        renderTemplate()
        // eslint-disable-next-line
    }, [reset, values])

    useListeners(context.events, [
        ["canvas.load", renderTemplate]
    ])
    
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
                        Submit
                    </LoadingButton>
                </Grid>
            </Grid>
            <Paper variant="outlined">
                <WebApp
                    width={window.innerWidth * 0.6}
                    height={window.innerHeight * 0.8}
                />
            </Paper>
        </form>
    )
}

export default TemplateForm
