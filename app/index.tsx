import { View, Text, Image } from "react-native";
import { Link } from "expo-router";
// ... imports remain the same ...

export default function WelcomeScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-white dark:bg-gray-900">
      <View className="w-full px-6 max-w-sm items-center">
        <Image
          source={require("../assets/images/Food-vintage-logo.jpg")}
          className="w-60 h-60 rounded-full mb-8 shadow-2xl"
          resizeMode="cover"
        />
        <Text className="text-3xl font-bold text-gray-900 dark:text-white mb-3 text-center">
          Travlt i hverdagen?
        </Text>
        <Text className="text-base text-gray-600 dark:text-gray-300 mb-10 text-center leading-relaxed px-4">
          Planlæg måltider for din uge, så du kan klare indkøb i ét hug.
        </Text>
        <Link
          href="/(tabs)/SelectRecipes"
          className="bg-amber-500 active:bg-amber-700 px-6 py-3.5 rounded-lg w-11/12 shadow-lg elevation-3"
        >
          <Text className="text-white font-medium text-center text-base">
            Klik her for at komme i gang
          </Text>
        </Link>
      </View>
    </View>
  );
}
