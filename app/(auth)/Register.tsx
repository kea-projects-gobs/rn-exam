import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { Link, router } from 'expo-router';
import { useAuth } from '../security/AuthProvider';

export default function RegisterScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

  const handleRegister = async () => {
    try {
      await auth.register({ username, password, email });
      router.push('/(auth)/Login');
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Fejl ved registrering');
    }
  };

  return (
    <View className="flex-1 justify-center p-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Opret bruger
      </Text>
      
      {error && (
        <Text className="text-red-500 text-center mb-4">{error}</Text>
      )}

      <TextInput
        className="p-4 mb-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Brugernavn"
        value={username}
        onChangeText={setUsername}
        autoCapitalize="none"
      />

      <TextInput
        className="p-4 mb-4 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />
      
      <TextInput
        className="p-4 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Adgangskode"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Pressable
        onPress={handleRegister}
        className="bg-blue-500 p-4 rounded-lg mb-4"
      >
        <Text className="text-white text-center font-semibold">Opret bruger</Text>
      </Pressable>

      <View className="flex-row justify-center items-center mt-4">
        <Text className="text-gray-600 dark:text-gray-400">
          Har du allerede en bruger?{" "}
        </Text>
        <Link href="/(auth)/Login" asChild>
          <Pressable>
            <Text className="text-blue-500 font-bold">
              Log ind her!
            </Text>
          </Pressable>
        </Link>
      </View>
      <View className="mt-8">
        <Link href="/(tabs)/SelectRecipes" asChild>
          <Pressable className="p-4">
            <Text className="text-blue-500 text-center">← Tilbage til opskrifter</Text>
          </Pressable>
        </Link>
      </View>
    </View>
  );
}