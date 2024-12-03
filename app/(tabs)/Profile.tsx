import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function ProfileScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Profil
        </Text>

        <View className="space-y-2">
          <Pressable className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text className="text-gray-900 text-lg dark:text-white">Antal personer</Text>
          </Pressable>

          <Pressable className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text className="text-gray-900 text-lg dark:text-white">Indstillinger</Text>
          </Pressable>

          <Pressable className="p-4 bg-red-100 dark:bg-red-900 rounded-lg mb-2">
            <Text className="text-red-900 text-lg dark:text-red-100">Log ud</Text>
          </Pressable>
        </View>
        <Link href="/" className="text-blue-500 dark:text-blue-400">
          ← Tilbage til forside
        </Link>
      </View>
    </ScrollView>
  );
}