import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="Login" 
        options={{ 
          title: 'Login',
          headerShown: true 
        }} 
      />
      <Stack.Screen 
        name="Register" 
        options={{ 
          title: 'Opret bruger',
          headerShown: true 
        }} 
      />
    </Stack>
  );
}