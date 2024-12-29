import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { router, useLocalSearchParams } from 'expo-router';
import { useState, useEffect } from 'react';
import { Recipe } from '../lib/types/types';
import { recipeApi } from '../lib/api/recipeApi';

export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecipe = async () => {
      try {
        const recipeData = await recipeApi.getRecipeById(Number(id));
        setRecipe(recipeData);
      } catch (error) {
        console.error('Error loading recipe:', error);
      } finally {
        setLoading(false);
      }
    };
    loadRecipe();
  }, [id]);

  if (loading || !recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-900 dark:text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      { /* Back button */}
      <View className="bg-white dark:bg-gray-900 p-4 flex-row items-center">
        <Pressable 
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Text className="text-blue-500 text-lg ml-1">Tilbage</Text>
        </Pressable>
      </View>
      
      <Image
        source={{ uri: recipe.imageUrl }}
        className="w-full h-64"
        resizeMode="cover"
      />
      <View className="p-4 space-y-4">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {recipe.name}
        </Text>
        
        <View className="flex-row space-x-4">
          <Text className="text-gray-600 dark:text-gray-400">
            ⏱️ {recipe.preparationTime} min
          </Text>
          <Text className="text-gray-600 dark:text-gray-400">
            👥 {recipe.servings} personer
          </Text>
        </View>

        <Text className="text-gray-700 dark:text-gray-300">
          {recipe.description}
        </Text>

        <View className="space-y-2">
          <Text className="text-xl font-semibold text-gray-900 dark:text-white">
            Fremgangsmåde
          </Text>
          {recipe.instructions.map((step, index) => (
            <View key={index} className="flex-row space-x-2">
              <Text className="text-gray-700 dark:text-gray-300 font-bold">
                {index + 1}.
              </Text>
              <Text className="text-gray-700 dark:text-gray-300 flex-1">
                {step}
              </Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}