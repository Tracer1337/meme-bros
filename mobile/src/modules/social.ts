import { Modules } from "@meme-bros/client-lib"
import Share from "react-native-share"

const share: Modules.SocialModule["share"] = async (args) => {
    try {
        const res = await Share.open({ url: args.uri })
        console.log(res)
    } catch {}
}

const socialModule: Modules.SocialModule = {
    share
}

export default socialModule
