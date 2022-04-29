import { useModule } from "@meme-bros/client-lib"
import { Platform } from "react-native"

const BREAKPOINT_LG = 1000

type LayoutKeys = "sm" | "lg"

export function useLayout<P = {}>(
    layouts: Record<
        LayoutKeys,
        React.LazyExoticComponent<React.FunctionComponent<P>>
    >
) {
    const { width } = useModule("view").useDimensions()

    const layout: LayoutKeys = width >= BREAKPOINT_LG ? "lg" : "sm"
    
    return Platform.OS === "web" ? layouts["lg"] : layouts[layout]
}
