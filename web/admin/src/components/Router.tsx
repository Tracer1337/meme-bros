import { Typography } from "@mui/material"
import React from "react"
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom"
import Layout from "./layout/Layout"
import TemplatesPage from "./templates/TemplatesPage"

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={
                        <Typography variant="h3">Admin</Typography>
                    }/>
                    <Route path="templates" element={<TemplatesPage/>}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
