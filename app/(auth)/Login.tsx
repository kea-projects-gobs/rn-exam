import { View, Text, TextInput, Pressable } from 'react-native';
import { useState } from 'react';
import { useAuth } from '../security/AuthProvider';
import { router } from 'expo-router';

export default function LoginScreen() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const auth = useAuth();

const handleLogin = async () => {
  try {
    await auth.signIn({ username, password });
    router.replace('/(tabs)/Profile');
  } catch (error) {
    setError(error instanceof Error ? error.message : 'Fejl ved login.');
  }
};

  return (
    <View className="flex-1 justify-center p-4 bg-white dark:bg-gray-900">
      <Text className="text-2xl font-bold mb-6 text-center text-gray-900 dark:text-white">
        Log ind
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
        className="p-4 mb-6 border rounded-lg bg-gray-50 dark:bg-gray-800 text-gray-900 dark:text-white"
        placeholder="Adgangskode"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      
      <Pressable
        onPress={handleLogin}
        className="bg-blue-500 p-4 rounded-lg"
      >
        <Text className="text-white text-center font-semibold">Log ind</Text>
      </Pressable>
    </View>
  );
}