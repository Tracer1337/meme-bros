import React from "react"
import { Box, Button } from "@mui/material"
import { NavLink, Outlet } from "react-router-dom"

const links: { to: string, title: string }[] = [
    { to: "/", title: "Home" },
    { to: "/templates", title: "Templates" }
]

function Layout() {
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
            </Box>
            <Outlet/>
        </>
    )
}

export default Layout
