import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import TemplatesPage from "../templates/TemplatesPage"
import RequireAuth from "../auth/RequireAuth"
import LoginPage from "../auth/LoginPage"
import ChangePasswordPage from "../auth/ChangePasswordPage"
import IndexPage from "../IndexPage"

function auth(child: JSX.Element) {
    return (
        <RequireAuth>
            {child}
        </RequireAuth>
    )
}

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/" element={<Layout/>}>
                    <Route index element={auth(<IndexPage/>)}/>
                    <Route path="templates" element={auth(<TemplatesPage/>)}/>
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="change-password" element={auth(<ChangePasswordPage/>)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
