import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Pressable, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth } from "../security/AuthProvider";
import { mealPlanApi } from "../lib/api/mealPlanApi";
import { ShoppingListItem, MealPlan } from "../lib/types/types";
import { useShoppingList } from "../shopping/ShoppingListProvider";

const basicIngredients = ["salt", "grana padano", "gurkemeje", "tomatpuré", "soya", "eks. jomfru olivenolie", "sesamfrø", "paprika", "grønsagsbouillon", "estragon", "dijonsennep", "balsamikoeddike", "hvedemel"];

export default function ShoppingListScreen() {
  const { username, isLoggedIn } = useAuth();
  const { checkedItems, toggleItem, clearCheckedItems } = useShoppingList();
  const [items, setItems] = useState<ShoppingListItem[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

  async function loadData() {
    if (!isLoggedIn()) {
      setLoading(false);
      return;
    }

    try {
      setLoading(true);
      // Load both shopping list and meal plans
      const [list, plans] = await Promise.all([
        mealPlanApi.getShoppingList(username!),
        mealPlanApi.getMealPlansByUser(username!),
      ]);
      setItems(list);
      setMealPlans(plans);
      setError(null);
    } catch (err) {
      setError("Kunne ikke hente indkøbsliste");
      setItems([]);
      setMealPlans([]);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => {
    if (isFocused) {
      loadData();
    }
  }, [isFocused]);

  const basicItemsMap = new Map();
  items.forEach((item) => {
    if (basicIngredients.includes(item.name.toLowerCase())) {
      if (!basicItemsMap.has(item.name.toLowerCase())) {
        basicItemsMap.set(item.name.toLowerCase(), { ...item, quantity: 1, totalPrice: item.price });
      }
    }
  });
  const basicItems = Array.from(basicItemsMap.values());

  const otherItems = items.filter(
    (item) => !basicIngredients.includes(item.name.toLowerCase())
  );

  const handleDeleteMealPlan = async () => {
    Alert.alert(
      "Slet indkøbsliste",
      "Er du sikker på, at du vil slette din indkøbsliste?",
      [
        { text: "Annuller", style: "cancel" },
        {
          text: "Slet",
          style: "destructive",
          onPress: async () => {
            try {
              setLoading(true); // Show loading indicator while deleting
              await Promise.all(
                mealPlans.map((plan) => mealPlanApi.deleteMealPlan(plan.id))
              );
              // Clear the states after successful deletion
              setItems([]);
              setMealPlans([]);
              clearCheckedItems();
              setError(null);
            } catch (err) {
              console.error("Delete error:", err);
              setError("Kunne ikke slette indkøbsliste");
            } finally {
              setLoading(false);
              // Reload the data after successful deletion, to stay in sync
              loadData();
            }
          },
        },
      ]
    );
  };

  // Calculate totals by separating basic and other items
  const totalRemaining = [
    ...Array.from(basicItemsMap.values()),
    ...otherItems
  ]
    .filter((item) => !checkedItems.has(item.productId))
    .reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate total for all items
  const totalAll = [
    ...Array.from(basicItemsMap.values()),
    ...otherItems
  ]
    .reduce((sum, item) => sum + item.totalPrice, 0);

  function onRefresh() {
    setRefreshing(true);
    loadData();
  }

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
        <ActivityIndicator size="large" color="#3b82f6" />
      </View>
    );
  }

  if (!isLoggedIn()) {
    return (
      <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900 p-4">
        <Text className="text-lg text-gray-900 dark:text-white text-center">
          Log ind for at se din indkøbsliste
        </Text>
      </View>
    );
  }

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      {/* Header view */}
      <View className="p-4 space-y-4">
        <View className="flex-row justify-between items-center mb-4 w-full">
          <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">
            Din Indkøbsliste
          </Text>
          {items.length > 0 && (
            <View className="ml-4">
              <Pressable
                onPress={handleDeleteMealPlan}
                className="bg-red-500 px-4 py-2 rounded-lg"
              >
                <Text className="text-white text-base">Slet liste</Text>
              </Pressable>
            </View>
          )}
        </View>

        {error && (
          <Text className="text-red-500 text-center my-2">{error}</Text>
        )}

        {/* Basic Ingredients Section */}
        {basicItems.length > 0 && (
          <>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Basale Ingredienser
            </Text>
            <View className="space-y-2">
              {basicItems.map((item) => (
                <Pressable
                  key={item.productId}
                  onPress={() => toggleItem(item.productId)}
                  className={`flex-row justify-between items-center p-4 rounded-lg mb-2
                    ${
                      checkedItems.has(item.productId)
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 mr-3 
                      ${
                        checkedItems.has(item.productId)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {checkedItems.has(item.productId) && (
                        <Text className="text-white text-center">✓</Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className={`text-lg 
                        ${
                          checkedItems.has(item.productId)
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={`
                        ${
                          checkedItems.has(item.productId)
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Antal: {item.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-lg 
                    ${
                      checkedItems.has(item.productId)
                        ? "text-gray-400 dark:text-gray-500 line-through"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.totalPrice.toFixed(2)}kr
                  </Text>
                </Pressable>
              ))}
            </View>
          </>
        )}

        {/* Other Ingredients Section */}
        {otherItems.length === 0 ? (
          <Text className="text-gray-500 dark:text-gray-400 text-center">
            Din indkøbsliste er tom
          </Text>
        ) : (
          <>
            <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
              Andre ingredienser
            </Text>
            <View className="space-y-2">
              {otherItems.map((item) => (
                <Pressable
                  key={item.productId}
                  onPress={() => toggleItem(item.productId)}
                  className={`flex-row justify-between items-center p-4 rounded-lg mb-2
                    ${
                      checkedItems.has(item.productId)
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 mr-3 
                      ${
                        checkedItems.has(item.productId)
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {checkedItems.has(item.productId) && (
                        <Text className="text-white text-center">✓</Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className={`text-lg 
                        ${
                          checkedItems.has(item.productId)
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={`
                        ${
                          checkedItems.has(item.productId)
                            ? "text-gray-400 dark:text-gray-500"
                            : "text-gray-500 dark:text-gray-400"
                        }`}
                      >
                        Antal: {item.quantity}
                      </Text>
                    </View>
                  </View>
                  <Text
                    className={`text-lg 
                    ${
                      checkedItems.has(item.productId)
                        ? "text-gray-400 dark:text-gray-500 line-through"
                        : "text-gray-500 dark:text-gray-400"
                    }`}
                  >
                    {item.totalPrice.toFixed(2)}kr
                  </Text>
                </Pressable>
              ))}
            </View>
            <View className="p-6 bg-gray-100 dark:bg-gray-800 rounded-2xl shadow-sm space-y-3">
              <View className="flex-row justify-between items-center border-b border-gray-200 dark:border-gray-700 pb-3">
                <Text className="text-base text-gray-500 dark:text-gray-400">
                  Total
                </Text>
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
          </>
        )}
      </View>
    </ScrollView>
  );
}