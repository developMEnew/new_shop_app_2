import React, { useEffect, useRef, useState, useCallback } from 'react';
import { View, FlatList, StyleSheet, TouchableOpacity, Text } from 'react-native';
import { BottomSheetModal } from '@gorhom/bottom-sheet';
import { useNavigation } from '@react-navigation/native';
import { ItemCard } from '../components/ItemCard';
import { ItemDetails } from '../components/ItemDetails';
import { Item } from '../types/Item';
import { api } from '../services/api';
import { cache } from '../services/cache';

export const HomeScreen = () => {
  const [items, setItems] = useState<Item[]>([]);
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const bottomSheetRef = useRef<BottomSheetModal>(null);
  const navigation = useNavigation();

  const loadItems = useCallback(async () => {
    try {
      // Try to load from cache first
      const cachedItems = await cache.getItems();
      
      if (cachedItems) {
        setItems(cachedItems);
      } else {
        // If no cache or expired, fetch from API
        const fetchedItems = await api.getItems();
        setItems(fetchedItems);
        await cache.saveItems(fetchedItems);
      }
    } catch (error) {
      console.error('Error loading items:', error);
    }
  }, []);

  useEffect(() => {
    loadItems();
  }, [loadItems]);

  const handleItemPress = useCallback((item: Item) => {
    setSelectedItem(item);
    bottomSheetRef.current?.present();
  }, []);

  const handleAddPress = useCallback(() => {
    navigation.navigate('AddItem' as never);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <FlatList
        data={items}
        renderItem={({ item }) => (
          <ItemCard 
            item={item}
            onPress={handleItemPress}
          />
        )}
        keyExtractor={item => item._id}
        contentContainerStyle={styles.list}
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={handleAddPress}
      >
        <Text style={styles.addButtonText}>Add New Item</Text>
      </TouchableOpacity>

      <ItemDetails
        item={selectedItem}
        bottomSheetRef={bottomSheetRef}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  list: {
    padding: 10,
    paddingBottom: 80,
  },
  addButton: {
    position: 'absolute',
    bottom: 20,
    left: 20,
    right: 20,
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});