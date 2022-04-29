import { StyleSheet } from "react-native"
import { useSharedContext } from "@meme-bros/client-lib"
import Switch from "../../inputs/Switch"
import { useCanvasActions } from "../utils/actions"

function CanvasConfig() {
    const context = useSharedContext()
    
    const { setBase } = useCanvasActions()

    return (
        <>
            {context.canvas.base && (
                <>
                    <Switch
                        style={styles.input}
                        label="Rounded Corners"
                        value={context.canvas.base.rounded}
                        onChange={(rounded) => setBase({ rounded })}
                    />
                    <Switch
                        style={styles.input}
                        label="Spacing"
                        value={context.canvas.base.padding}
                        onChange={(padding) => setBase({ padding })}
                    />
                </>
            )}
        </>
    )
}

const styles = StyleSheet.create({
    input: {
        margin: 8,
        marginTop: 0
    }
})

export default CanvasConfig
