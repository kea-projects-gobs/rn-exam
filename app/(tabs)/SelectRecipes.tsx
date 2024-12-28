import { View, Text, ScrollView, Pressable, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../security/AuthProvider';
import { mealPlanApi } from '../lib/api/mealPlanApi';
import { Recipe, MealPlanRequest } from '../lib/types/types';
import { recipeApi } from '../lib/api/recipeApi';

export default function SelectRecipesScreen() {
  const { username, isLoggedIn } = useAuth();
  const [selectedRecipes, setSelectedRecipes] = useState<MealPlanRequest[]>([]);
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(false);
  const [openPickerDay, setOpenPickerDay] = useState<string | null>(null);

  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeApi.getAllRecipes();
        setRecipes(allRecipes || []);
      } catch (error) {
        Alert.alert('Fejl', 'Kunne ikke hente opskrifter');
        setRecipes([]);
      }
    };
    loadRecipes();
  }, []);

  const handleRecipeSelect = (recipeId: number, day: string) => {
    if (username) {
      // Remove any existing recipe for this day
      const filtered = selectedRecipes.filter(r => r.dayOfWeek !== day);
      
      // Only add the recipe if it's not 0 (no recipe)
      if (recipeId !== 0) {
        setSelectedRecipes([
          ...filtered,
          {
            username,
            recipeId,
            dayOfWeek: day
          }
        ]);
      } else {
        setSelectedRecipes(filtered);
      }
    }
  };

  const getRecipeForDay = (day: string) => {
    return selectedRecipes.find(r => r.dayOfWeek === day);
  };

  const generateShoppingList = async () => {
    if (!isLoggedIn()) {
      Alert.alert('Login påkrævet', 'Du skal være logget ind');
      return router.push('/(auth)/Login');
    }

    try {
      setLoading(true);
      await mealPlanApi.createMealPlan(selectedRecipes);
      router.push('/(tabs)/ShoppingList');
    } catch (error) {
      Alert.alert('Fejl', 'Kunne ikke generere indkøbsliste');
    } finally {
      setLoading(false);
    }
  };

  const renderPicker = (day: string) => {
    const selectedRecipe = getRecipeForDay(day);
    const isOpen = openPickerDay === day;

    return (
      <View key={day} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
        <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">{day}</Text>
        
        <Pressable 
          onPress={() => setOpenPickerDay(day)}
          className="bg-white dark:bg-gray-700 p-4 rounded-lg flex-row justify-between items-center"
        >
          <Text className="text-gray-900 dark:text-white">
            {selectedRecipe ? 
              recipes.find(r => r.id === selectedRecipe.recipeId)?.name || 'Vælg opskrift' 
              : 'Vælg opskrift'}
          </Text>
          <Text className="text-gray-500">▼</Text>
        </Pressable>

        <Modal
          visible={isOpen}
          transparent={true}
          animationType="slide"
          onRequestClose={() => setOpenPickerDay(null)}
        >
          <Pressable 
            className="flex-1 bg-black/50"
            onPress={() => setOpenPickerDay(null)}
          >
            <View className="mt-auto bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden">
              <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
                <Text className="text-lg font-bold text-gray-900 dark:text-white">
                  Vælg opskrift til {day}
                </Text>
                <Pressable onPress={() => setOpenPickerDay(null)}>
                  <Text className="text-blue-500 font-medium">Luk</Text>
                </Pressable>
              </View>

              <View className="max-h-96">
                <ScrollView>
                  <Pressable
                    className="p-4 border-b border-gray-200 dark:border-gray-700"
                    onPress={() => {
                      handleRecipeSelect(0, day);
                      setOpenPickerDay(null);
                    }}
                  >
                    <Text className="text-gray-900 dark:text-white text-lg">
                      Ingen opskrift
                    </Text>
                  </Pressable>

                  {recipes.map(recipe => (
                    <Pressable
                      key={recipe.id}
                      className={`p-4 border-b border-gray-200 dark:border-gray-700 
                        ${selectedRecipe?.recipeId === recipe.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                      onPress={() => {
                        handleRecipeSelect(recipe.id, day);
                        setOpenPickerDay(null);
                      }}
                    >
                      <Text className="text-gray-900 dark:text-white text-lg">
                        {recipe.name}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>
            </View>
          </Pressable>
        </Modal>
      </View>
    );
  };

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Vælg opskrifter til din uge
        </Text>

        <View className="space-y-2">
          {days.map(renderPicker)}
        </View>

        <Pressable
          className={`bg-blue-500 p-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
          onPress={generateShoppingList}
          disabled={loading}
        >
          <Text className="text-white text-center text-lg font-medium">
            {loading ? 'Genererer...' : 'Generer Indkøbsliste'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}