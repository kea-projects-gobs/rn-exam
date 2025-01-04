import { View, Text, Pressable } from "react-native";
import { Recipe, MealPlanRequest } from "../../lib/types/types";
import RecipePickerModal from "./recipePickerModal";

interface DayPickerProps {
  day: string;
  recipes: Recipe[];
  selectedRecipe?: MealPlanRequest;
  isOpen: boolean;
  onOpen: (day: string) => void;
  onClose: () => void;
  onSelectRecipe: (recipeId: number | null, day: string) => void;
}

export default function DayPicker({ 
  day, 
  recipes, 
  selectedRecipe, 
  isOpen,
  onOpen,
  onClose,
  onSelectRecipe 
}: DayPickerProps) {
  return (
    <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
      <Text className="text-lg font-bold text-gray-900 dark:text-white mb-2">{day}</Text>
      
      <Pressable 
        onPress={() => onOpen(day)}
        className="bg-white dark:bg-gray-700 p-4 rounded-lg flex-row justify-between items-center"
      >
        <Text className="text-gray-900 dark:text-white">
          {selectedRecipe ? 
            recipes.find(r => r.id === selectedRecipe.recipeId)?.name || 'Vælg opskrift' 
            : 'Vælg opskrift'}
        </Text>
        <Text className="text-gray-500">▼</Text>
      </Pressable>

      <RecipePickerModal
        visible={isOpen}
        day={day}
        recipes={recipes}
        selectedRecipe={selectedRecipe}
        onClose={onClose}
        onSelectRecipe={onSelectRecipe}
      />
    </View>
  );
}