import { Tabs } from "expo-router";
import { useColorScheme } from "react-native";
import MaterialCommunityIcons from "@expo/vector-icons/MaterialCommunityIcons";
import FontAwesome from "@expo/vector-icons/FontAwesome";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === "dark" ? "#1f2937" : "white",
        },
        tabBarActiveTintColor: colorScheme === "dark" ? "#fff" : "#000",
      }}
    >
      <Tabs.Screen
        name="SelectRecipes"
        options={{
          title: "Planlæg",
          tabBarLabel: "Planlæg",
          tabBarIcon: ({ color, size }) => (
            <FontAwesome name="list-ul" color={color} size={size} />
          ),
        }}
      />

      <Tabs.Screen
        name="Recipes"
        options={{
          title: "Opskrifter",
          tabBarLabel: "Opskrifter",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="food-turkey"
              color={color}
              size={size}
            />
          ),
        }}
      />
      <Tabs.Screen
        name="ShoppingList"
        options={{
          title: "Indkøbsliste",
          tabBarLabel: "Indkøbsliste",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="cart" color={color} size={size} />
          ),
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: "Profil",
          tabBarLabel: "Profil",
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons name="account" color={color} size={size} />
          ),
        }}
      />
    </Tabs>
  );
}
