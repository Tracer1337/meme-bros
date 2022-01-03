import React from "react"
import { NativeStackScreenProps } from "@react-navigation/native-stack"
import { Text } from "react-native-paper"
import { RootStackParamList } from "../../Navigator"
import Screen from "../styled/Screen"

function TemplatesScreen({}: NativeStackScreenProps<RootStackParamList, "Templates">) {
    return (
        <Screen>
            <Text>Templates</Text>
        </Screen>
    )
}

export default TemplatesScreen
