import React, { useMemo, useState } from "react"
import { StyleSheet, View } from "react-native"
import { Text, Headline, ActivityIndicator, IconButton } from "react-native-paper"
import { useNavigation } from "@react-navigation/native"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateList from "./TemplateList"
import TemplateTabs, { Tabs } from "./TemplateTabs"

function TemplatesScreen() {
    const appContext = useAppContext()
    
    const navigation = useNavigation()

    const [tab, setTab] = useState(Tabs.HOT)

    const lists = useMemo<Record<Tabs, JSX.Element>>(() => ({
        [Tabs.HOT]: <TemplateList templates={appContext.templates.lists.hot}/>,
        [Tabs.NEW]: <TemplateList templates={appContext.templates.lists.new}/>,
        [Tabs.TOP]: <TemplateList templates={appContext.templates.lists.top}/>
    }), [appContext.templates.lists])

    return (
        <Screen>
            <View style={styles.header}>
                <IconButton icon="arrow-left" onPress={navigation.goBack}/>
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
