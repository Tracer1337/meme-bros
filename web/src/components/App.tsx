import React from "react"
import { Grid, Paper } from "@mui/material"
import RNApp from "./RNApp"

function App() {
    return (
        <Grid container height="100vh" alignItems="center">
            <Grid container item xs justifyContent="center">
                <Paper variant="outlined">
                    <RNApp
                        width={window.innerWidth * 0.4}
                        height={window.innerHeight * 0.9}
                    />
                </Paper>
            </Grid>
        </Grid>
    )
}

export default App
