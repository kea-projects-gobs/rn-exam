import { Text, Pressable } from 'react-native';
import { useAuth } from "./AuthProvider";
import { Link } from "expo-router";

export default function AuthStatus() {
  const auth = useAuth();

  if (!auth.isLoggedIn()) {
    return (
      <Link href="../(auth)/Login" asChild>
        <Pressable className="p-4">
          <Text className="text-blue-500">Login</Text>
        </Pressable>
      </Link>
    );
  } else {
    return (
      <Link href="../(auth)/Login" asChild>
        <Pressable className="p-4">
          <Text className="text-blue-500">
            Logout (Logged in as {auth.username})
          </Text>
        </Pressable>
      </Link>
    );
  }
}