import {
  View,
  Text,
  ScrollView,
  ActivityIndicator,
  RefreshControl,
  Pressable,
  Alert,
} from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth } from "../security/AuthProvider";
import { mealPlanApi } from "../lib/api/mealPlanApi";
import { ShoppingListItem, MealPlan } from "../lib/types/types";

const basicIngredients = [
  "salt",
  "grana padano",
  "gurkemeje",
  "tomatpuré",
  "soya",
  "eks. jomfru olivenolie",
  "sesamfrø",
  "paprika",
  "grønsagsbouillon",
  "estragon",
  "dijonsennep",
  "balsamikoeddike",
  "hvedemel",
  "tomatpuré",
];

// Extend ShoppingListItem to include checked state
interface ShoppingListItemWithState extends ShoppingListItem {
  checked: boolean;
}

export default function ShoppingListScreen() {
  const { username, isLoggedIn } = useAuth();
  const [items, setItems] = useState<ShoppingListItemWithState[]>([]);
  const [mealPlans, setMealPlans] = useState<MealPlan[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const isFocused = useIsFocused();

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
      // Add checked property to each item
      setItems(list.map((item) => ({ ...item, checked: false })));
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
              setLoading(true); // Show loading while deleting
              await Promise.all(
                mealPlans.map((plan) => mealPlanApi.deleteMealPlan(plan.id))
              );
              // Clear states immediately after successful deletion
              setItems([]);
              setMealPlans([]);
              setError(null);
            } catch (err) {
              console.error("Delete error:", err);
              setError("Kunne ikke slette indkøbsliste");
            } finally {
              setLoading(false);
              // Reload data to ensure everything is in sync
              loadData();
            }
          },
        },
      ]
    );
  };

  const toggleItem = (productId: number) => {
    setItems((currentItems) =>
      currentItems.map((item) =>
        item.productId === productId
          ? { ...item, checked: !item.checked }
          : item
      )
    );
  };

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

  // Calculate total only for unchecked items
  const totalRemaining = items
    .filter((item) => !item.checked)
    .reduce((sum, item) => sum + item.totalPrice, 0);
  // Calculate total for all items
  const totalAll = items.reduce((sum, item) => sum + item.totalPrice, 0);

  return (
    <ScrollView
      className="flex-1 bg-white dark:bg-gray-900"
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
      }
    >
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Din Indkøbsliste
        </Text>

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
                      item.checked
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 mr-3 
                      ${
                        item.checked
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {item.checked && (
                        <Text className="text-white text-center">✓</Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className={`text-lg 
                        ${
                          item.checked
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={`
                        ${
                          item.checked
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
                      item.checked
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
              Other Ingredients
            </Text>
            <View className="space-y-2">
              {otherItems.map((item) => (
                <Pressable
                  key={item.productId}
                  onPress={() => toggleItem(item.productId)}
                  className={`flex-row justify-between items-center p-4 rounded-lg mb-2
                    ${
                      item.checked
                        ? "bg-gray-200 dark:bg-gray-700"
                        : "bg-gray-100 dark:bg-gray-800"
                    }`}
                >
                  <View className="flex-row items-center">
                    <View
                      className={`w-6 h-6 rounded-full border-2 mr-3 
                      ${
                        item.checked
                          ? "bg-green-500 border-green-500"
                          : "border-gray-400"
                      }`}
                    >
                      {item.checked && (
                        <Text className="text-white text-center">✓</Text>
                      )}
                    </View>
                    <View>
                      <Text
                        className={`text-lg 
                        ${
                          item.checked
                            ? "text-gray-500 dark:text-gray-400 line-through"
                            : "text-gray-900 dark:text-white"
                        }`}
                      >
                        {item.name}
                      </Text>
                      <Text
                        className={`
                        ${
                          item.checked
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
                      item.checked
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


