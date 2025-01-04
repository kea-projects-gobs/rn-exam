import { View, Text, ScrollView, Pressable } from 'react-native';
import { useAuth } from '../context/AuthProvider';
import { router } from 'expo-router';
import { MaterialCommunityIcons } from '@expo/vector-icons';

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
              className="p-4 bg-blue-500 rounded-lg mb-2 shadow-sm"
              onPress={() => router.push('/(auth)/Login')}
            >
              <Text className="text-white text-lg text-center font-semibold">Log ind</Text>
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
        <View className="flex-row items-center mb-6">
          <View className="w-12 h-12 bg-blue-500 rounded-full items-center justify-center mr-3">
            <MaterialCommunityIcons name="account" size={24} color="white" />
          </View>
          <View>
            <Text className="text-gray-500 dark:text-gray-400">
              Bruger
            </Text>
            <Text className="text-xl font-bold text-gray-900 dark:text-white">
              {auth.username}
            </Text>
          </View>
        </View>

        <View className="space-y-3">
          {/* Info About Portions */}
          <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-2xl">
            <View className="flex-row items-center mb-2">
              <MaterialCommunityIcons 
                name="account-group" 
                size={24} 
                className="text-gray-900 dark:text-white mr-2" 
              />
              <Text className="text-gray-900 text-lg font-semibold dark:text-white ml-2">
                Om Portioner
              </Text>
            </View>
            <Text className="text-gray-600 dark:text-gray-400 leading-5">
              Alle opskrifter er beregnet til 4 personer. Ingredienserne er tilpasset 
              til hele pakker fra Rema 1000, så du undgår madspild.
            </Text>
          </View>

          {/* Logout Button */}
          <Pressable 
            className="p-4 bg-red-100 dark:bg-red-900/20 rounded-2xl mt-4"
            onPress={() => {
              auth.signOut();
              router.push('../(tabs)');
            }}
          >
            <View className="flex-row items-center justify-center">
              <MaterialCommunityIcons 
                name="logout" 
                size={24} 
                className="text-red-600 dark:text-red-400 mr-2" 
              />
              <Text className="text-red-600 text-lg font-semibold dark:text-red-400">
                Log ud
              </Text>
            </View>
          </Pressable>
        </View>
      </View>
    </ScrollView>
  );
}