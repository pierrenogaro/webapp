import { Tabs } from "expo-router";
import Ionicons from "@expo/vector-icons/Ionicons";

export default function TabLayout() {
    return (
        <Tabs
            screenOptions={{
                tabBarActiveTintColor: "#ffd33d",
                tabBarStyle: { backgroundColor: "#25292e" },
                headerStyle: { backgroundColor: "#25292e" },
                headerTintColor: "#fff",
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Home",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "home-sharp" : "home-outline"} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Alcool"
                options={{
                    title: "Alcool",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "wine" : "wine-outline"} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="Chuck"
                options={{
                    title: "Chuck",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "happy" : "happy-outline"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="Audio"
                options={{
                    title: "Audio",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons
                            name={focused ? "volume-high" : "volume-medium"}
                            color={color}
                            size={24}
                        />
                    ),
                }}
            />
            <Tabs.Screen
                name="RegisterScreen"
                options={{
                    title: "Register",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "person-add" : "person-add-outline"} color={color} size={24} />
                    ),
                }}
            />
            <Tabs.Screen
                name="LoginScreen"
                options={{
                    title: "Login",
                    tabBarIcon: ({ color, focused }) => (
                        <Ionicons name={focused ? "log-in" : "log-in-outline"} color={color} size={24} />
                    ),
                }}
            />
        </Tabs>
    );
}
