import React, { useEffect, useState } from "react"
import { useNavigate } from "react-router-native"
import { useTheme, Surface } from "react-native-paper"
import { SceneMap, TabView, Route, TabBar } from "react-native-tab-view"
import { useModule, useSharedContext } from "@meme-bros/client-lib"
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

function TemplateTabs() {
    const context = useSharedContext()
    
    const navigate = useNavigate()

    const dimensions = useModule("view").useDimensions()

    const [index, setIndex] = useState(0)

    useEffect(() => {
        if (context.renderCanvas) {
            navigate("/editor")
        }
    }, [context])

    return (
        <TabView
            navigationState={{ index, routes }}
            renderScene={renderScene}
            renderTabBar={renderTabBar}
            onIndexChange={setIndex}
            initialLayout={{ width: dimensions.width }}
            lazy
        />
    )
} 

export default TemplateTabs
