import { BrowserRouter, Routes, Route } from "react-router-dom"
import Layout from "../layout/Layout"
import IndexPage from "../../views/IndexPage"
import RequireAuth from "../../views/auth/RequireAuth"
import LoginPage from "../../views/auth/LoginPage"
import ChangePasswordPage from "../../views/auth/ChangePasswordPage"
import TemplatesPage from "../../views/templates/TemplatesPage"
import CreateTemplate from "../../views/templates/CreateTemplate"
import UpdateTemplate from "../../views/templates/UpdateTemplate"
import StickersPage from "../../views/stickers/StickersPage"
import UploadsPage from "../../views/uploads/UploadsPage"

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
                        <Route path=":id" element={<UpdateTemplate/>}/>
                    </Route>
                    <Route path="stickers" element={auth(<StickersPage/>)}/>
                    <Route path="uploads" element={auth(<UploadsPage/>)}/>
                </Route>
            </Routes>
        </BrowserRouter>
    )
}

export default Router
