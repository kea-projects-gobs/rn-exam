import { View, Text, ScrollView, Pressable, Image } from 'react-native';
import { useState, useEffect } from 'react';
import { Recipe } from '@/app/lib/types/types';
import { recipeApi } from '@/app/lib/api/recipeApi';
import { router } from 'expo-router';

export default function RecipeScreen() {
  const [recipes, setRecipes] = useState<Recipe[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipes = async () => {
      try {
        const allRecipes = await recipeApi.getAllRecipes();
        setRecipes(allRecipes || []);
      } catch (error) {
        console.error('Error loading recipes:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRecipes();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-900 dark:text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
          Alle Opskrifter
        </Text>
        <View className="space-y-4">
          {recipes.map((recipe) => (
            <Pressable 
              key={recipe.id}
              onPress={() => router.push(`.././Recipe/${recipe.id}`)}
              className="bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden"
            >
              <View className="flex-row items-center">
                {recipe.imageUrl && (
                  <Image
                    source={{ uri: recipe.imageUrl }}
                    className="w-20 h-20"
                    resizeMode="cover"
                  />
                )}
                <View className="p-4 flex-1">
                  <Text className="text-lg font-bold text-gray-900 dark:text-white">
                    {recipe.name}
                  </Text>
                  <Text className="text-gray-600 dark:text-gray-400 text-sm">
                    {recipe.preparationTime} min • {recipe.servings} personer
                  </Text>
                </View>
              </View>
            </Pressable>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}