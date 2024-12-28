import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { useEffect, useState } from 'react';
import { useAuth } from '../security/AuthProvider';
import { mealPlanApi } from '../lib/api/mealPlanApi';
import { ShoppingListItem } from '../lib/types/types';

export default function ShoppingListScreen() {
    const { username, isLoggedIn } = useAuth();
    const [items, setItems] = useState<ShoppingListItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadShoppingList = async () => {
            if (!isLoggedIn()) return;
            
            try {
                const list = await mealPlanApi.getShoppingList(username!);
                setItems(list);
            } catch (err) {
                setError('Kunne ikke hente indkøbsliste');
            } finally {
                setLoading(false);
            }
        };

        loadShoppingList();
    }, [username, isLoggedIn]);

    if (loading) {
        return (
            <View className="flex-1 justify-center items-center bg-white dark:bg-gray-900">
                <ActivityIndicator size="large" color="#3b82f6" />
            </View>
        );
    }

    const total = items.reduce((sum, item) => sum + item.totalPrice, 0);

    return (
        <ScrollView className="flex-1 bg-white dark:bg-gray-900">
            <View className="p-4 space-y-4">
                <Text className="text-xl font-bold text-gray-900 dark:text-white mb-4">
                    Din Indkøbsliste
                </Text>

                {error && (
                    <Text className="text-red-500 text-center">{error}</Text>
                )}

                <View className="space-y-2">
                    {items.map((item) => (
                        <View key={item.productId} 
                            className="flex-row justify-between items-center p-4 bg-gray-100 dark:bg-gray-800 rounded-lg mb-2">
                            <View>
                                <Text className="text-gray-900 text-lg dark:text-white">
                                    {item.name}
                                </Text>
                                <Text className="text-gray-500 dark:text-gray-400">
                                    Antal: {item.quantity}
                                </Text>
                            </View>
                            <Text className="text-gray-500 text-lg dark:text-gray-400">
                                {item.totalPrice.toFixed(2)}kr
                            </Text>
                        </View>
                    ))}
                </View>

                <View className="p-4 bg-gray-100 dark:bg-gray-800 rounded-lg">
                    <Text className="text-lg font-bold text-gray-900 dark:text-white">
                        Total: {total.toFixed(2)}kr
                    </Text>
                </View>
            </View>
        </ScrollView>
    );
}