import { Modules, Permissions } from "@meme-bros/client-lib"
import { PermissionsAndroid, Permission as RNPermission } from "react-native"

const permissionsMapping: Record<Permissions, RNPermission> = {
    [Permissions.WRITE_EXTERNAL_STORAGE]: PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE
}

export function usePermissionsModule(): Modules.PermissionsModule {
    const request: Modules.PermissionsModule["request"] = async (permission) => {
        try {
            const status = await PermissionsAndroid.request(
                permissionsMapping[permission]
            )
            if (status === PermissionsAndroid.RESULTS.GRANTED) {
                return true
            } else {
                return false
            }
        } catch (error) {
            console.error(error)
            return false
        }
    }

    return {
        request
    }
}
