import React from "react"
import { ToggleButton } from "react-native-paper"

export enum Tabs {
    HOT,
    NEW,
    TOP
}

function TemplateTabs({ value, onChange }: {
    value: Tabs,
    onChange: (newValue: Tabs) => void
}) {
    return (
        <ToggleButton.Row value={value} onValueChange={onChange}>
            <ToggleButton icon="fire" value={Tabs.HOT}/>
            <ToggleButton icon="alert-decagram" value={Tabs.NEW}/>
            <ToggleButton icon="trending-up" value={Tabs.TOP}/>
        </ToggleButton.Row>
    )
}

export default TemplateTabs
