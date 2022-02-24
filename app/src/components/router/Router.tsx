import React from "react"
import { NativeRouter, Routes, Route } from "react-router-native"
import Layout from "../layout/Layout"
import TemplatesScreen from "../templates/TemplatesScreen"

function Router() {
    return (
        <NativeRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<TemplatesScreen/>}/>
                    <Route path="/editor" element={<></>}/>
                </Route>
            </Routes>
        </NativeRouter>
    )
}

export default Router
