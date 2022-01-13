import React, { useEffect } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { Button, TextField, Container, Typography } from "@mui/material"
import { useLocation, useNavigate } from "react-router-dom"
import { useStore } from "../../lib/store"

type Fields = {
    username: string
    password: string
}

function LoginPage() {
    const store = useStore()
    
    const locationState = useLocation().state as { from?: Location }

    const navigate = useNavigate()

    const { register, handleSubmit } = useForm<Fields>()

    const onSubmit: SubmitHandler<Fields> = async (values) => {
        if (!values.username || !values.password) {
            return
        }
        store.login(values).catch((error) => {
            console.log(error)
        })
    }

    useEffect(() => {
        store.authorize()
        // eslint-disable-next-line
    }, [])

    useEffect(() => {
        if (store.isLoggedIn) {
            navigate(locationState.from || "/", { replace: true })
        }
    }, [store.isLoggedIn, locationState, navigate])

    return (
        <form onSubmit={handleSubmit(onSubmit)}>
            <Typography variant="h4" sx={{
                textAlign: "center",
                my: 4
            }}>Login</Typography>

            <Container maxWidth="sm" sx={{
                display: "flex",
                flexDirection: "column"
            }}>
                <TextField
                    label="Username"
                    sx={{ mb: 2 }}
                    {...register("username")}
                />
                <TextField
                    label="Password"
                    type="password"
                    sx={{ mb: 2 }}
                    {...register("password")}
                />
                <Button type="submit">Login</Button>
            </Container>
        </form>
    )
}

export default LoginPage
