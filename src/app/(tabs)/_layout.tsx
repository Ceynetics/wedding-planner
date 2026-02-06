import { CustomTabBar } from "@/components/CustomTabBar";
import { Tabs } from "expo-router";
import React from "react";

export default function TabLayout() {
    return (
        <Tabs
            tabBar={(props) => <CustomTabBar {...props} />}
            screenOptions={{
                headerShown: false,
            }}
        >
            <Tabs.Screen
                name="index"
                options={{
                    title: "Dashboard",
                }}
            />
            <Tabs.Screen
                name="tasks"
                options={{
                    title: "Tasks",
                }}
            />
            <Tabs.Screen
                name="guests"
                options={{
                    title: "Guests",
                }}
            />
            <Tabs.Screen
                name="tools"
                options={{
                    title: "Tools",
                }}
            />
            <Tabs.Screen
                name="profile"
                options={{
                    title: "Profile",
                }}
            />
        </Tabs>
    );
}
