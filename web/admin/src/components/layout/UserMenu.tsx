import React, { useRef, useState } from "react"
import { Avatar, Divider, IconButton, Menu, MenuItem } from "@mui/material"
import { useStore } from "../../lib/store"

function UserMenu() {
    const username = useStore((state) => state.username)

    const [open, setOpen] = useState(false)

    const anchor = useRef<HTMLButtonElement>(null)

    const handleOpen = () => setOpen(true)
    const handleClose = () => setOpen(false)

    return (
        <>
            <IconButton onClick={handleOpen} ref={anchor}>
                <Avatar sx={{ width: 24, height: 24 }}/>
            </IconButton>
            <Menu
                anchorEl={anchor.current}
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                transformOrigin={{
                    horizontal: "right",
                    vertical: "top"
                }}
                anchorOrigin={{
                    horizontal: "right",
                    vertical: "bottom"
                }}
            >
                <MenuItem>{username}</MenuItem>
                <Divider/>
                <MenuItem>Change Password</MenuItem>
                <MenuItem>Logout</MenuItem>
            </Menu>
        </>
    )
}

export default UserMenu
