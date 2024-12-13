import { View, Text, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../security/AuthProvider';
import { router } from 'expo-router';

export default function ProfileScreen() {
  const auth = useAuth();

  // If not logged in, show login interface
  if (!auth.isLoggedIn()) {
    return (
      <ScrollView className="flex-1 bg-white dark:bg-gray-900">
        <View className="p-4 space-y-4">
          <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
            Login krævet
          </Text>
          
          <View className="space-y-2">
            <Pressable 
              className="p-4 bg-blue-500 rounded-lg mb-2"
              onPress={() => router.push('/(auth)/Login')}
            >
              <Text className="text-white text-lg text-center">Log ind</Text>
            </Pressable>

            <Text className="text-gray-500 dark:text-gray-400 text-center">
              Log ind for at tilgå din profil
            </Text>
          </View>
        </View>
      </ScrollView>
    );
  }

  // Logged in interface
  return (
    <ScrollView className="flex-1 bg-white dark:bg-gray-900">
      <View className="p-4 space-y-4">
        <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
          Profil
        </Text>

        <View className="space-y-2">
          <Pressable className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text className="text-gray-900 text-lg dark:text-white">Antal personer</Text>
          </Pressable>

          <Pressable className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
            <Text className="text-gray-900 text-lg dark:text-white">Indstillinger</Text>
          </Pressable>

          <Pressable 
            className="p-4 bg-red-100 dark:bg-red-900 rounded-lg mb-2"
            onPress={() => {
              auth.signOut();
              router.replace('../(tabs)');
            }}
          >
            <Text className="text-red-900 text-lg dark:text-red-100">Log ud</Text>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}