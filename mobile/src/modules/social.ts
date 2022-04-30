import { Modules } from "@meme-bros/client-lib"
import Share from "react-native-share"

export function useSocialModule(): Modules.SocialModule {
    const share: Modules.SocialModule["share"] = async (args) => {
        try {
            await Share.open({ url: args.uri })
        } catch {}
    }
    
    return {
        share
    }
}
