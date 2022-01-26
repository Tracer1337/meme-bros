import React, { useEffect, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Text, Headline, ActivityIndicator } from "react-native-paper"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateList from "./TemplateList"
import { useTemplates } from "./utils"
import TemplateTabs, { Tabs } from "./TemplateTabs"
import { TemplateMeta } from "./types"

function TemplatesScreen() {
    const appContext = useAppContext()

    const templates = useTemplates()

    const [tab, setTab] = useState(Tabs.HOT)
    const [list, setList] = useState<TemplateMeta[]>([])

    useEffect(() => {
        switch (tab) {
            case Tabs.HOT:
                setList(templates.hot)
                break
            case Tabs.NEW:
                setList(templates.new)
                break
            case Tabs.TOP:
                setList(templates.top)
                break
        }
    }, [tab, templates])

    return (
        <Screen>
            <View style={styles.header}>
                <Headline style={styles.headline}>
                    Templates
                </Headline>
                {appContext.templates.isSyncing && (
                    <ActivityIndicator animating/>
                )}
                {appContext.templates.error && (
                    <Text>Sync Failed</Text>
                )}
            </View>
            <View style={styles.tabs}>
                <TemplateTabs value={tab} onChange={setTab}/>
            </View>
            <TemplateList templates={list}/>
        </Screen>
    )
} 

const styles = StyleSheet.create({
    header: {
        marginVertical: 24
    },

    tabs: {
        flexDirection: "row",
        justifyContent: "center",
        marginBottom: 24,
    },

    headline: {
        textAlign: "center"
    }
})

export default TemplatesScreen
