import { createContext, useContext, useState, ReactNode } from 'react';

interface ShoppingListContextType {
  checkedItems: Set<number>; // Stores the IDs of the items that are checked
  toggleItem: (productId: number) => void; // Toggles the checked status of an item
  clearCheckedItems: () => void; // Clears all checked items
}

const ShoppingListContext = createContext<ShoppingListContextType | undefined>(undefined);

export function ShoppingListProvider({ children }: { children: ReactNode }) {
  const [checkedItems, setCheckedItems] = useState<Set<number>>(new Set()); // Use a Set to store checked items for easier lookup

  const toggleItem = (productId: number) => {
    setCheckedItems(prev => {
      const newSet = new Set(prev);
      if (newSet.has(productId)) {
        newSet.delete(productId);
      } else {
        newSet.add(productId);
      }
      return newSet;
    });
  };

  const clearCheckedItems = () => {
    setCheckedItems(new Set());
  };

  return (
    <ShoppingListContext.Provider value={{ checkedItems, toggleItem, clearCheckedItems }}>
      {children}
    </ShoppingListContext.Provider>
  );
}

export function useShoppingList() {
  const context = useContext(ShoppingListContext);
  if (context === undefined) {
    throw new Error('useShoppingList must be used within a ShoppingListProvider');
  }
  return context;
}