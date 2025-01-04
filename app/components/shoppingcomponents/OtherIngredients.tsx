import { View, Text } from "react-native";
import { ShoppingListItemInterface } from "../../lib/types/types";
import ShoppingListItem from "../shoppingComponents/ShoppingListItem";

interface OtherIngredientsProps {
  items: ShoppingListItemInterface[];
}

export default function OtherIngredients({ items }: OtherIngredientsProps) {
  if (items.length === 0) return null;

  return (
    <>
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">
        Andre ingredienser
      </Text>
      <View className="space-y-2">
        {items.map((item) => (
          <ShoppingListItem key={item.productId} item={item} />
        ))}
      </View>
    </>
  );
}