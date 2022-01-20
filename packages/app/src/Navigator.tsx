import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import EditorScreen from "./components/editor/EditorScreen"
import TemplatesScreen from "./components/templates/TemplatesScreen"

export type RootStackParamList = {
    Editor: undefined,
    Templates: undefined
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function Navigator() {
    return (
        <NavigationContainer>
            <Stack.Navigator
                initialRouteName="Editor"
                screenOptions={{ headerShown: false }}
            >
                <Stack.Screen
                    component={EditorScreen}
                    name="Editor"
                />
                <Stack.Screen
                    component={TemplatesScreen}
                    name="Templates"
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator
