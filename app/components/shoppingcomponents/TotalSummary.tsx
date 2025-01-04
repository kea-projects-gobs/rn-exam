import { View, Text } from "react-native";

interface Props {
  totalAll: number;
  totalRemaining: number;
}

export default function TotalSummary({ totalAll, totalRemaining }: Props) {
  return (
    <View className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm space-y-3">
      <View className="flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
        <Text className="text-base text-gray-500 dark:text-gray-400">Total</Text>
        <Text className="text-xl font-semibold text-gray-900 dark:text-white">
          {totalAll.toFixed(2)}kr
        </Text>
      </View>
      <View className="flex-row justify-between items-center pt-3">
        <Text className="text-base text-gray-500 dark:text-gray-400">
          Resterende
        </Text>
        <Text className="text-xl font-semibold text-green-600 dark:text-green-400">
          {totalRemaining.toFixed(2)}kr
        </Text>
      </View>
    </View>
  );
}