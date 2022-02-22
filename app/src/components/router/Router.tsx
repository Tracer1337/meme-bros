import React from "react"
import { NativeRouter, Routes, Route } from "react-router-native"
import Layout from "../layout/Layout"
import TemplatesScreen from "../templates/TemplatesScreen"
import BaseSelectionScreen from "../editor/BaseSelectionScreen"

function Router() {
    return (
        <NativeRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={<BaseSelectionScreen/>}/>
                    <Route path="/editor" element={<></>}/>
                    <Route path="/templates" element={<TemplatesScreen/>}/>
                </Route>
            </Routes>
        </NativeRouter>
    )
}

export default Router
