import { View } from "react-native"
import BottomBar from "../bottom-bar/BottomBar"
import Canvas from "../Canvas"
import { ACTION_BAR_HEIGHT } from "../constants"

function EditorLayoutSmall() {
    return (
        <>
            <View style={{
                flexGrow: 1,
                paddingBottom: ACTION_BAR_HEIGHT
            }}>
                <Canvas/>
            </View>
            <BottomBar/>
        </>
    )
}

export default EditorLayoutSmall
