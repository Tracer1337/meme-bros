import React from "react"
import { List, ListItem, ListItemButton, ListItemText } from "@mui/material"

const templates = [
    "First Template",
    "Second Template",
    "Third Template"
]

function TemplatesList() {
    return (
        <List>
            {templates.map((name, i) => (
                <ListItem key={i}>
                    <ListItemButton>
                        <ListItemText>
                            {name}
                        </ListItemText>
                    </ListItemButton>
                </ListItem>
            ))}
        </List>
    )
}

export default TemplatesList
