import { StyleSheet, View } from "react-native"
import Canvas from "../Canvas"
import ConfigPanel from "../config-panel/ConfigPanel"
import ItemPanel from "../item-panel/ItemPanel"

function EditorLayoutLarge() {
    return (
        <View style={styles.container}>
            <ItemPanel/>
            <View style={{ flex: 1 }}>
                <Canvas/>
            </View>
            <ConfigPanel/>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: "row"
    }
})

export default EditorLayoutLarge
