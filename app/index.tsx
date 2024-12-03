import { View, Text } from 'react-native';
import { Link } from 'expo-router';

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900 p-6">
      <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-6">
        Velkommen til placeholder
      </Text>
      <Text className="text-lg text-gray-600 dark:text-gray-300 mb-6 text-center">
        Planlæg måltider for din uge, så du kan klare indkøb i ét hug.
      </Text>
      <Link 
        href="/(tabs)/SelectRecipes" 
        className="bg-blue-500 px-6 py-3 rounded-lg"
      >
        <Text className="text-white font-semibold">Klik her for at komme i gang</Text>
      </Link>
    </View>
  );
}