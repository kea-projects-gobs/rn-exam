import { View, Text, Pressable } from "react-native";
import { ShoppingListItemInterface } from "../../lib/types/types";
import { useShoppingList } from "../../shopping/ShoppingListProvider";

interface ShoppingListItemProps {
  item: ShoppingListItemInterface;
}

export default function ShoppingListItem({ item }: ShoppingListItemProps) {
  const { checkedItems, toggleItem } = useShoppingList();
  const isChecked = checkedItems.has(item.productId);

  return (
    <Pressable
      onPress={() => toggleItem(item.productId)}
      className={`flex-row justify-between items-center p-4 rounded-lg mb-2
        ${isChecked ? "bg-gray-200 dark:bg-gray-700" : "bg-gray-100 dark:bg-gray-800"}`}
    >
      <View className="flex-row items-center">
        <View
          className={`w-6 h-6 rounded-full border-2 mr-3 
          ${isChecked ? "bg-green-500 border-green-500" : "border-gray-400"}`}
        >
          {isChecked && <Text className="text-white text-center">✓</Text>}
        </View>
        <View>
          <Text
            className={`text-lg ${isChecked ? "text-gray-500 dark:text-gray-400 line-through" : "text-gray-900 dark:text-white"}`}
          >
            {item.name}
          </Text>
          <Text className={isChecked ? "text-gray-400 dark:text-gray-500" : "text-gray-500 dark:text-gray-400"}>
            Antal: {item.quantity}
          </Text>
        </View>
      </View>
      <Text className={`text-lg ${isChecked ? "text-gray-400 dark:text-gray-500 line-through" : "text-gray-500 dark:text-gray-400"}`}>
        {item.totalPrice.toFixed(2)}kr
      </Text>
    </Pressable>
  );
}