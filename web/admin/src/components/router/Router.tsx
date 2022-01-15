import React from "react"
import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import IndexPage from "../IndexPage"
import RequireAuth from "../auth/RequireAuth"
import LoginPage from "../auth/LoginPage"
import ChangePasswordPage from "../auth/ChangePasswordPage"
import TemplatesPage from "../templates/TemplatesPage"
import CreateTemplate from "../templates/CreateTemplate"

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
                    <Route path="login" element={<LoginPage/>}/>
                    <Route path="change-password" element={auth(<ChangePasswordPage/>)}/>
                    <Route path="templates" element={auth(<TemplatesPage/>)}>
                        <Route path="create" element={<CreateTemplate/>}/>
                        <Route path=":id" element={<h1>Update</h1>}/>
                    </Route>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router