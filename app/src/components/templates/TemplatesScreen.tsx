import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { useNavigate } from "react-router-native"
import { Text, Headline, ActivityIndicator, IconButton } from "react-native-paper"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateList from "./TemplateList"
import TemplateTabs, { Tabs } from "./TemplateTabs"

function TemplatesScreen() {
    const appContext = useAppContext()
    
    const navigate = useNavigate()

    const [tab, setTab] = useState(Tabs.HOT)

    const lists = useMemo<Record<Tabs, JSX.Element>>(() => ({
        [Tabs.HOT]: <TemplateList templates={appContext.templates.lists.hot}/>,
        [Tabs.NEW]: <TemplateList templates={appContext.templates.lists.new}/>,
        [Tabs.TOP]: <TemplateList templates={appContext.templates.lists.top}/>
    }), [appContext.templates.lists])

    return (
        <Screen>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={() => navigate(-1)}/>
                <Headline style={styles.headline}>
                    Templates
                </Headline>
                {appContext.sync.isLoading && (
                    <ActivityIndicator animating/>
                )}
                {appContext.sync.error && (
                    <Text>Sync Failed</Text>
                )}
            </View>
            <View style={styles.tabs}>
                <TemplateTabs value={tab} onChange={setTab}/>
            </View>
            {appContext.templates.error && (
                <Text>Failed to load templates</Text>
            )}
            {appContext.templates.isLoading
                ? <ActivityIndicator animating/>
                : lists[tab]}
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
