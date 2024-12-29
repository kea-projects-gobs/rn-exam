import { View, Text, ScrollView, Image, Pressable } from 'react-native';
import { useLocalSearchParams, router } from 'expo-router';
import { useState, useEffect } from 'react';
import { Recipe, Product } from '../lib/types/types';
import { recipeApi } from '../lib/api/recipeApi';
import { productApi } from '../lib/api/productApi';


export default function RecipeDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [recipe, setRecipe] = useState<Recipe | null>(null);
  const [products, setProducts] = useState<Record<string, Product>>({});
  const [loading, setLoading] = useState(true);

  // Load recipe and its associated products when component mounts or id changes
  useEffect(() => {
    const loadRecipeAndProducts = async () => {
      try {
        // First, fetch the recipe details using the ID from URL params
        const recipeData = await recipeApi.getRecipeById(Number(id));
        setRecipe(recipeData);

        // Extract product IDs from the recipe's ingredients
        const productIds = Object.keys(recipeData.ingredients);
        // Fetch all products in parallel and organize them by their IDs
        const productsData = await productApi.getMultipleProducts(productIds);
        setProducts(productsData);
      } catch (error) {
        console.error('Error loading recipe or products:', error);
      } finally {
        // Always set loading to false, whether the fetch succeeded or failed
        setLoading(false);
      }
    };

    loadRecipeAndProducts();
  }, [id]); // Re-run effect when recipe ID changes

  if (loading || !recipe) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <Text className="text-gray-900 dark:text-white">Loading...</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      {/* Back button */}
      <View className="bg-white dark:bg-gray-900 p-4 flex-row items-center">
        <Pressable 
          onPress={() => router.back()}
          className="flex-row items-center"
        >
          <Text className="text-blue-500 text-lg ml-1">Tilbage</Text>
        </Pressable>
      </View>
      
      {/* Title */}
      <View className="px-4 my-2">
        <Text className="text-2xl font-bold text-gray-900 dark:text-white">
          {recipe.name}
        </Text>
      </View>
      
      <Image
        source={{ uri: recipe.imageUrl }}
        className="w-full h-64"
        resizeMode="cover"
      />
      
      <View className="px-4">
        {/* Description */}
        <Text className="text-gray-700 dark:text-gray-300 my-4">
          {recipe.description}
        </Text>
    
        {/* Info and Ingredients Section */}
        <View className="bg-gray-100 dark:bg-gray-800 rounded-lg">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <View className="flex-row space-x-4">
              <View className="flex-row items-center">
                <Text className="text-gray-600 dark:text-gray-400">
                  ⏱️ {recipe.preparationTime} min
                </Text>
              </View>
              <View className="flex-row items-center">
                <Text className="text-gray-600 dark:text-gray-400">
                  👥 {recipe.servings} personer
                </Text>
              </View>
            </View>
          </View>
  
          <View className="p-4 border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white">
              Ingredienser
            </Text>
          </View>
          
          {Object.entries(recipe.ingredients).map(([productId]) => {
            const product = products[productId];
            const productName = product?.name ? 
              product.name.charAt(0).toUpperCase() + product.name.slice(1).toLowerCase() : 
              'Loading...';
            
            return (
              <View key={productId}>
                <View className="flex-row items-center p-3">
                  <Text className="text-gray-700 dark:text-gray-300">
                    • {productName}
                  </Text>
                </View>
              </View>
            );
          })}
        </View>

        {/* Instructions Section */}
        <View className="mt-4">
          <View className="bg-gray-100 dark:bg-gray-800 p-4 rounded-lg border-b border-gray-200 dark:border-gray-700">
            <Text className="text-xl font-semibold text-gray-900 dark:text-white">
              Fremgangsmåde
            </Text>
          </View>
          {recipe.instructions.map((step, index) => (
            <View key={index} className="border-b border-gray-200 dark:border-gray-700">
              <View className="bg-gray-100 dark:bg-gray-800 p-4 flex-row">
                <Text className="text-gray-400 dark:text-gray-500 font-medium w-8">
                  {index + 1}
                </Text>
                <Text className="text-gray-700 dark:text-gray-300 flex-1">
                  {step}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
}