import { View, Text, Pressable } from "react-native";

interface Props {
  hasItems: boolean;
  error: string | null;
  onDelete: () => void;
}

export default function ShoppingListHeader({ hasItems, error, onDelete }: Props) {
  return (
    <>
      <View className="flex-row justify-between items-center mb-4 w-full">
        <Text className="text-xl font-bold text-gray-900 dark:text-white flex-1">
          Din Indkøbsliste
        </Text>
        {hasItems && (
          <View className="ml-4">
            <Pressable
              onPress={onDelete}
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

      {!hasItems && !error && (
        <Text className="text-gray-500 dark:text-gray-400 text-center">
          Din indkøbsliste er tom
        </Text>
      )}
    </>
  );
}