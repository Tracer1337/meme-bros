import { NavigationContainer } from "@react-navigation/native"
import { createNativeStackNavigator, NativeStackScreenProps } from "@react-navigation/native-stack"
import React from "react"
import { Button, StyleSheet, Text, View } from "react-native"

type Profile = {
    name: string
}

const profiles: Profile[] = [{ name: "Jeff" }, { name: "Lisa" }]

type RootStackParamList = {
    Home: {},
    Profile: Profile
}

const Stack = createNativeStackNavigator<RootStackParamList>()

function HomeScreen({ navigation }: NativeStackScreenProps<RootStackParamList, "Home">) {
    return (
        <View>
            { profiles.map((profile, i) => (
                <View style={styles.profileLink} key={i}>
                    <Button
                        title={profile.name}
                        onPress={() =>
                            navigation.navigate("Profile", profile)
                        }
                    />
                </View>
            )) }
        </View>
    )
}

function ProfileScreen({ route }: NativeStackScreenProps<RootStackParamList, "Profile">) {
    return (
        <View>
            <Text>Name: { route.params.name }</Text>
        </View>
    )
}

function App() {
    return (
        <NavigationContainer>
            <Stack.Navigator initialRouteName="Home">
                <Stack.Screen
                    component={HomeScreen}
                    name="Home"
                    options={{ title: "Home" }}
                />
                <Stack.Screen
                    component={ProfileScreen}
                    name="Profile"
                    options={{ title: "Profile" }}
                />
            </Stack.Navigator>
        </NavigationContainer>
    )
}

const styles = StyleSheet.create({
    profileLink: {
        marginBottom: 16
    }
})

export default App
