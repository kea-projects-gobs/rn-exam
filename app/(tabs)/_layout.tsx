import { Tabs } from 'expo-router';
import { useColorScheme } from 'react-native';

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: colorScheme === 'dark' ? '#1f2937' : 'white',
        },
        tabBarActiveTintColor: colorScheme === 'dark' ? '#fff' : '#000',
      }}>
      <Tabs.Screen
        name="SelectRecipes"
        options={{
          title: 'Planlæg',
          tabBarLabel: 'Planlæg',
        }}
      />
      <Tabs.Screen
        name="Recipe"
        options={{
          title: 'Opskrifter',
          tabBarLabel: 'Opskrifter',
        }}
      />
      <Tabs.Screen
        name="ShoppingList"
        options={{
          title: 'Indkøbsliste',
          tabBarLabel: 'Indkøbsliste',
        }}
      />
      <Tabs.Screen
        name="Profile"
        options={{
          title: 'Profil',
          tabBarLabel: 'Profil',
        }}
      />
    </Tabs>
  );
}