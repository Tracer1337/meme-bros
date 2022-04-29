import { AnyFunction } from "tsdef"
import { BottomSheetMethods } from "@gorhom/bottom-sheet/lib/typescript/types"

export function useCallbacks(
    bottomSheet: React.RefObject<BottomSheetMethods>
) {
    return (fn: AnyFunction) => () => {
        bottomSheet.current?.collapse()
        fn()
    }
}
