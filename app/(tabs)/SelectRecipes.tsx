import { View, Text, ScrollView, Pressable, Alert } from 'react-native';
import { Picker } from '@react-native-picker/picker';
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

  const days = ["Mandag", "Tirsdag", "Onsdag", "Torsdag", "Fredag", "Lørdag", "Søndag"];

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeApi.getAllRecipes();
        setRecipes(allRecipes);
      } catch (error) {
        Alert.alert('Fejl', 'Kunne ikke hente opskrifter');
      }
    };
    loadRecipes();
  }, []);

  const handleRecipeSelect = (recipeId: number, day: string) => {
    if (username && recipeId) {
      // Remove any existing recipe for this day
      const filtered = selectedRecipes.filter(r => r.dayOfWeek !== day);
      
      // Add the new recipe
      setSelectedRecipes([
        ...filtered,
        {
          username,
          recipeId,
          dayOfWeek: day
        }
      ]);
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
          {days.map((day) => {
            const selectedRecipe = getRecipeForDay(day);
            
            return (
              <View key={day} className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">{day}</Text>
                <View className="bg-white dark:bg-gray-700 rounded">
                  <Picker
                    selectedValue={selectedRecipe?.recipeId || ''}
                    onValueChange={(itemValue) => handleRecipeSelect(Number(itemValue), day)}
                  >
                    <Picker.Item label="Vælg opskrift" value="" />
                    {recipes.map(recipe => (
                      <Picker.Item 
                        key={recipe.id} 
                        label={recipe.name} 
                        value={recipe.id} 
                      />
                    ))}
                  </Picker>
                </View>
              </View>
            );
          })}
        </View>

        <Pressable
          className={`bg-blue-500 p-4 rounded-lg ${loading ? 'opacity-50' : ''}`}
          onPress={generateShoppingList}
          disabled={loading}
        >
          <Text className="text-white text-center">
            {loading ? 'Genererer...' : 'Generer Indkøbsliste'}
          </Text>
        </Pressable>
      </View>
    </ScrollView>
  );
}