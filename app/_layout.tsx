import { Stack } from 'expo-router';
import AuthProvider from './security/AuthProvider';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Recipe/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
    </AuthProvider>
  );
}