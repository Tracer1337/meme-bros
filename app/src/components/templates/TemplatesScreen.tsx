import { useEffect } from "react"
import { useNavigate } from "react-router-native"
import { Text, ActivityIndicator } from "react-native-paper"
import { useSharedContext } from "@meme-bros/client-lib"
import Screen from "../styled/Screen"
import { useAppContext } from "../../lib/context"
import TemplateTabs from "./TemplatesTabs"
import MoreActionsFAB from "./MoreActionsFAB"

function TemplatesScreen() {
    const context = useSharedContext()

    const appContext = useAppContext()
    
    const navigate = useNavigate()

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
            <TemplateTabs/>
            <MoreActionsFAB/>
        </Screen>
    )
} 

export default TemplatesScreen
