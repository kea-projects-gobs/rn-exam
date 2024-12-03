import { View, Text, ScrollView } from 'react-native';

export default function HomeScreen() {
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="flex-1 items-center justify-center p-6">
        <Text className="text-3xl font-bold text-gray-900 dark:text-white">
          Welcome!
        </Text>
        <Text className="mt-4 text-lg text-gray-600 dark:text-gray-300">
          Edit this file to start building your app.
        </Text>
      </View>
    </ScrollView>
  );
}