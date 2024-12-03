import { View, Text, ScrollView } from 'react-native';
import { Link } from 'expo-router';

export default function ShoppingListScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Din Indkøbsliste
        </Text>


        
        <View className="space-y-2">
          <View className="flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text className="text-gray-900 text-lg dark:text-white">Pasta m/ kødsovs</Text>
            <Text className="text-gray-500 text-lg dark:text-gray-400">43kr</Text>
          </View>
        </View>

        <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
          <Text className="text-lg font-bold text-gray-900 dark:text-white">
            Total: 43kr
          </Text>
        </View>
        <Link href="/" className="text-blue-500 dark:text-blue-400">
          ← Tilbage til forside
        </Link>
      </View>
    </ScrollView>
  );
}