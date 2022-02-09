import { Permissions, useModule } from "@meme-bros/client-lib"
import { AnyFunction, MaybeAsyncReturnType } from "tsdef"

export function usePermissionUtils() {
    const permissions = useModule("permissions")
    
    const withPermission = async <T extends AnyFunction>(
        permission: Permissions,
        fn: T
    ): Promise<MaybeAsyncReturnType<T> | undefined> => {
        if (await permissions.request(permission)) {
            return await fn()
        }
        return
    }

    return { withPermission }
}
