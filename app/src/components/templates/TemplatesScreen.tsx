import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Text, Headline, ActivityIndicator } from "react-native-paper"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateList from "./TemplateList"
import { useTemplates } from "./utils"
import TemplateTabs, { Tabs } from "./TemplateTabs"

function TemplatesScreen() {
    const appContext = useAppContext()

    const templates = useTemplates()

    const [tab, setTab] = useState(Tabs.HOT)

    const lists = useMemo<Record<Tabs, JSX.Element>>(() => ({
        [Tabs.HOT]: <TemplateList templates={templates.hot}/>,
        [Tabs.NEW]: <TemplateList templates={templates.new}/>,
        [Tabs.TOP]: <TemplateList templates={templates.top}/>,
    }), [tab, templates])

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
            {lists[tab]}
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
