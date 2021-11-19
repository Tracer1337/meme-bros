import React from "react"
import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator } from "@react-navigation/native-stack"
import EditorScreen from "./components/editor/EditorScreen"

export type RootStackParamList = {
    Editor: {}
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
            </Stack.Navigator>
        </NavigationContainer>
    )
}

export default Navigator
