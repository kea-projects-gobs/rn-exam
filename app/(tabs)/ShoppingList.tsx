import { View, Text, ScrollView, ActivityIndicator, RefreshControl, Alert } from "react-native";
import { useIsFocused } from "@react-navigation/native";
import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthProvider";
import { mealPlanApi } from "../lib/api/mealPlanApi";
import { ShoppingListItemInterface, MealPlan } from "../lib/types/types";
import { useShoppingList } from "../context/ShoppingListProvider";
import BasicIngredients from "../components/shoppingcomponents/BasicIngredients";
import ShoppingListHeader from "../components/shoppingcomponents/ShoppingListHeader";
import OtherIngredients from "../components/shoppingcomponents/OtherIngredients";
import TotalSummary from "../components/shoppingcomponents/TotalSummary";

const basicIngredients = ["salt", "grana padano", "gurkemeje", "tomatpuré", "soya", "eks. jomfru olivenolie", "sesamfrø", "paprika", "grønsagsbouillon", "estragon", "dijonsennep", "balsamikoeddike", "hvedemel"];

export default function ShoppingListScreen() {
  const { username, isLoggedIn } = useAuth();
  const { checkedItems, clearCheckedItems } = useShoppingList();
  const [items, setItems] = useState<ShoppingListItemInterface[]>([]);
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

  // Iterate through all items, and find the basic ingredients
  items.forEach((item) => {
    // Check if the item is a basic ingredient
    if (basicIngredients.includes(item.name.toLowerCase())) {
      // Only add if we havent seen this item before
      // This prevents duplicates, and ensure we only get one of each basic ingredient
      if (!basicItemsMap.has(item.name.toLowerCase())) {
        // Add the item to the map
        basicItemsMap.set(item.name.toLowerCase(), { ...item, quantity: 1, totalPrice: item.price });
      }
    }
  });

  // Convert the Map back to an array of basic items
  const basicItems = Array.from(basicItemsMap.values());

  // Filter out the basic ingredients, and only keep the other items
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
    // Convert the Map back to an array of basic items
    ...Array.from(basicItemsMap.values()), 
    // Add the other items to the array
    ...otherItems 
  ]
    // Filter out items that are checked
    .filter((item) => !checkedItems.has(item.productId)) 
    // Sum up the total price of the remaining items
    .reduce((sum, item) => sum + item.totalPrice, 0);

  // Calculate total for all items (both checked and unchecked )
  const totalAll = [
    // Convert the Map back to an array of basic items
    ...Array.from(basicItemsMap.values()),
    // Add the other items to the array (all non basic items)
    ...otherItems
  ]
    // Sum up the total price of all items
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
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
    >
      <View className="p-4 space-y-4">
        <ShoppingListHeader 
          hasItems={items.length > 0}
          error={error}
          onDelete={handleDeleteMealPlan}
        />
        
        <BasicIngredients
          items={basicItems}
        />

        <OtherIngredients
          items={otherItems}
        />

        {otherItems.length > 0 && (
          <TotalSummary
            totalAll={totalAll}
            totalRemaining={totalRemaining}
          />
        )}
      </View>
    </ScrollView>
  );
}