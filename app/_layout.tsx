import { Stack } from 'expo-router';
import AuthProvider from './security/AuthProvider';
import { ShoppingListProvider } from './shopping/ShoppingListProvider';
import '../global.css';

export default function RootLayout() {
  return (
    <AuthProvider>
      <ShoppingListProvider>
      <Stack>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="Recipe/[id]" options={{ headerShown: false, presentation: 'modal' }} />
      </Stack>
      </ShoppingListProvider>
    </AuthProvider>
  );
}