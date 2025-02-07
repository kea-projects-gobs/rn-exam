import * as SecureStore from 'expo-secure-store';
import { router } from 'expo-router';

export async function saveAuthData(token: string, username: string, roles: string[]) {
  await SecureStore.setItemAsync('token', token);
  await SecureStore.setItemAsync('username', username);
  await SecureStore.setItemAsync('roles', JSON.stringify(roles));
}

export async function getAuthData() {
  const token = await SecureStore.getItemAsync('token');
  const username = await SecureStore.getItemAsync('username');
  const roles = JSON.parse(await SecureStore.getItemAsync('roles') || '[]');
  return { token, username, roles };
}

export async function clearAuthData() {
  await SecureStore.deleteItemAsync('token');
  await SecureStore.deleteItemAsync('username');
  await SecureStore.deleteItemAsync('roles');
}

export async function handleExpiredToken() {
  await clearAuthData();
  router.replace('/(auth)/Login');
  throw new Error('Session expired. Please login again.');
}