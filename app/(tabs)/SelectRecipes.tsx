import { View, Text, ScrollView, Pressable } from 'react-native';
import { Link } from 'expo-router';

export default function SelectRecipesScreen() {
  const days = [
    'Mandag',
    'Tirsdag',
    'Onsdag',
    'Torsdag',
    'Fredag',
    'Lørdag',
    'Søndag',
  ];

  const generateShoppingList = async () => {
    // 1. Get all selected recipes
    // 2. Calculate ingredients based on number of servings
    // 3. Group similar ingredients
    // 4. Match with REMA1000 products for price
    // 5. Generate shopping list
    alert('Generating shopping list');
  };


  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Vælg opskrifter til din uge
        </Text>

        <View className="space-y-2">
          {days.map((day) => (
            <View
              key={day}
              className="flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
              <Text className="text-lg text-gray-900 dark:text-white">{day}</Text>
              <Pressable>
                <Text className="text-gray-500 dark:text-gray-400">Vælg</Text>
              </Pressable>
            </View>
          ))}
        </View>
        <Link href="/" className="text-blue-500 dark:text-blue-400">
          ← Tilbage til forside
        </Link>
        <View className="mt-4">
          <Pressable
            className="bg-blue-500 p-4 rounded-lg"
            onPress={generateShoppingList}>
            <Text className="text-white text-center">Generer Indkøbsliste</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}