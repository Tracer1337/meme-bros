import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-native"
import { Text, ActivityIndicator, useTheme, Surface } from "react-native-paper"
import { SceneMap, TabView, Route, TabBar } from "react-native-tab-view"
import { useModule, useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateList from "./TemplateList"

const HotList = () => (
    <TemplateList templates={useAppContext().templates.lists.hot}/>
)
const NewList = () => (
    <TemplateList templates={useAppContext().templates.lists.new}/>
)
const TopList = () => (
    <TemplateList templates={useAppContext().templates.lists.top}/>
)

const renderScene = SceneMap({
    "hot": HotList,
    "new": NewList,
    "top": TopList
})

const renderTabBar = (props: any) => {
    const theme = useTheme()
    
    return (
        <Surface>
            <TabBar
                {...props}
                indicatorStyle={{
                    backgroundColor: theme.colors.onSurface
                }}
                style={{
                    backgroundColor: "transparent"
                }}
            />
        </Surface>
    )
}

const routes: Route[] = [
    { key: "hot", title: "Hot" },
    { key: "new", title: "New" },
    { key: "top", title: "Top" }
]

function TemplatesScreen() {
    const context = useSharedContext()

    const appContext = useAppContext()
    
    const navigate = useNavigate()

    const dimensions = useModule("view").useDimensions()

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (context.renderCanvas) {
            navigate("/editor")
        }
    }, [context])

    return (
        <Screen>
            {appContext.templates.error && (
                <Text>Failed to load templates</Text>
            )}
            {appContext.templates.isLoading && <ActivityIndicator animating/>}
            <TabView
                navigationState={{ index, routes }}
                renderScene={renderScene}
                renderTabBar={renderTabBar}
                onIndexChange={setIndex}
                initialLayout={{ width: dimensions.width }}
            />
        </Screen>
    )
} 

export default TemplatesScreen
