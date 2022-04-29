import { Box, Button } from "@mui/material"
import { NavLink, Outlet } from "react-router-dom"
import UserMenu from "./UserMenu"
import { useStore } from "@lib/store"

const links: { to: string, title: string }[] = [
    { to: "/", title: "Home" },
    { to: "/templates", title: "Templates" },
    { to: "/stickers", title: "Stickers" },
    { to: "/uploads", title: "Uploads" }
]

function Layout() {
    const isLoggedIn = useStore((state) => state.isLoggedIn)

    return (
        <>
            <Box sx={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "center",
                height: 64,
                mx: 8
            }}>
                {links.map((link, i) => (
                    <NavLink
                        key={i}
                        to={link.to}
                        style={({ isActive }) => ({
                            color: isActive ? "yellow" : undefined
                        })}
                    >
                        <Button variant="text">
                            {link.title}
                        </Button>
                    </NavLink>
                ))}
                {isLoggedIn && <UserMenu/>}
            </Box>
            <Outlet/>
        </>
    )
}

export default Layout
