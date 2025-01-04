import { Modal, View, Text, Pressable, ScrollView } from "react-native";
import { Recipe, MealPlanRequest } from "../../lib/types/types";

interface RecipePickerModalProps {
  visible: boolean;
  day: string;
  recipes: Recipe[];
  selectedRecipe?: MealPlanRequest;
  onClose: () => void;
  onSelectRecipe: (recipeId: number, day: string) => void;
}

export default function RecipePickerModal({
  visible,
  day,
  recipes,
  selectedRecipe,
  onClose,
  onSelectRecipe
}: RecipePickerModalProps) {
  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <Pressable 
        className="flex-1 bg-black/50"
        onPress={onClose}
      >
        <View className="mt-auto bg-white dark:bg-gray-800 rounded-t-3xl overflow-hidden">
          <View className="p-4 border-b border-gray-200 dark:border-gray-700 flex-row justify-between items-center">
            <Text className="text-lg font-bold text-gray-900 dark:text-white">
              Vælg opskrift til {day}
            </Text>
            <Pressable onPress={onClose}>
              <Text className="text-blue-500 font-medium">Luk</Text>
            </Pressable>
          </View>

          <View className="max-h-96">
            <ScrollView>
              <Pressable
                className="p-4 border-b border-gray-200 dark:border-gray-700"
                onPress={() => {
                  onSelectRecipe(0, day);
                  onClose();
                }}
              >
                <Text className="text-gray-900 dark:text-white text-lg">
                  Ingen opskrift
                </Text>
              </Pressable>

              {recipes.map(recipe => (
                <Pressable
                  key={recipe.id}
                  className={`p-4 border-b border-gray-200 dark:border-gray-700 
                    ${selectedRecipe?.recipeId === recipe.id ? 'bg-blue-50 dark:bg-blue-900/20' : ''}`}
                  onPress={() => {
                    onSelectRecipe(recipe.id, day);
                    onClose();
                  }}
                >
                  <Text className="text-gray-900 dark:text-white text-lg">
                    {recipe.name}
                  </Text>
                </Pressable>
              ))}
            </ScrollView>
          </View>
        </View>
      </Pressable>
    </Modal>
  );
}