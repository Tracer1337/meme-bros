import { useEffect, useState } from "react"
import { SubmitHandler, useForm } from "react-hook-form"
import { TextField, Container, Typography } from "@mui/material"
import { LoadingButton } from "@mui/lab"
import { useLocation, useNavigate } from "react-router-dom"
import { useStore } from "@lib/store"
import { Storage } from "@lib/storage"

type Fields = {
    username: string
    password: string
}

function LoginPage() {
    const store = useStore()
    
    const locationState = useLocation().state as { from?: Location }

    const navigate = useNavigate()

    const [isLoading, setIsLoading] = useState(false)

    const { register, handleSubmit } = useForm<Fields>()

    const onSubmit: SubmitHandler<Fields> = async (values) => {
        if (!values.username || !values.password) {
            return
        }
        setIsLoading(true)
        store.login(values)
            .catch((error) => console.log(error))
            .finally(() => setIsLoading(false))
    }

    useEffect(() => {
        if (Storage.get(Storage.Keys.TOKEN)) {
            setIsLoading(true)
            store.authorize().finally(() => setIsLoading(false))
        }
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
                <LoadingButton type="submit" loading={isLoading}>
                    Login
                </LoadingButton>
            </Container>
        </form>
    )
}

export default LoginPage
