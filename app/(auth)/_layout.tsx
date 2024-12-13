import { Stack } from 'expo-router';

export default function AuthLayout() {
  return (
    <Stack>
      <Stack.Screen 
        name="Login" 
        options={{ 
          title: 'Login',
          headerShown: false
        }} 
      />
      <Stack.Screen 
        name="Register" 
        options={{ 
          title: 'Opret bruger',
          headerShown: false
        }} 
      />
    </Stack>
  );
}