import { View, Text, ScrollView, Pressable, Alert, Modal } from 'react-native';
import { router } from 'expo-router';
import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthProvider';
import { mealPlanApi } from '../lib/api/mealPlanApi';
import { Recipe, MealPlanRequest } from '../lib/types/types';
import { recipeApi } from '../lib/api/recipeApi';
import DayPicker from '../components/recipeComponents/dayPicker';

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

  

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Vælg opskrifter til din uge
        </Text>

        <View className="space-y-2">
          {days.map(day => (
            <DayPicker
              key={day}
              day={day}
              recipes={recipes}
              selectedRecipe={getRecipeForDay(day)}
              isOpen={openPickerDay === day}
              onOpen={setOpenPickerDay}
              onClose={() => setOpenPickerDay(null)}
              onSelectRecipe={handleRecipeSelect}
            />
          ))}
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