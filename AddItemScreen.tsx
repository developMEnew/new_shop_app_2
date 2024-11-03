import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  Image, 
  StyleSheet,
  ScrollView,
  Alert
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';
import { api } from '../services/api';
import { cache } from '../services/cache';

export const AddItemScreen = () => {
  const [name, setName] = useState('');
  const [purchasePrice, setPurchasePrice] = useState('');
  const [sellingPrice, setSellingPrice] = useState('');
  const [imageUri, setImageUri] = useState('');
  const navigation = useNavigation();

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.canceled) {
      setImageUri(result.assets[0].uri);
    }
  };

  const handleSubmit = async () => {
    if (!name || !purchasePrice || !sellingPrice || !imageUri) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    try {
      const newItem = {
        name,
        purchasePrice: parseFloat(purchasePrice),
        sellingPrice: parseFloat(sellingPrice),
        imageUri,
      };

      await api.addItem(newItem);
      
      // Refresh cache
      const updatedItems = await api.getItems();
      await cache.saveItems(updatedItems);
      
      navigation.goBack();
    } catch (error) {
      console.error('Error adding item:', error);
      Alert.alert('Error', 'Failed to add item');
    }
  };

  return (
    <ScrollView style={styles.container}>
      <View style={styles.form}>
        <Text style={styles.label}>Item Name</Text>
        <TextInput
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="Enter item name"
        />

        <Text style={styles.label}>Purchase Price (RS)</Text>
        <TextInput
          style={styles.input}
          value={purchasePrice}
          onChangeText={setPurchasePrice}
          placeholder="Enter purchase price"
          keyboardType="numeric"
        />

        <Text style={styles.label}>Selling Price (RS)</Text>
        <TextInput
          style={styles.input}
          value={sellingPrice}
          onChangeText={setSellingPrice}
          placeholder="Enter selling price"
          keyboardType="numeric"
        />

        <TouchableOpacity 
          style={styles.imageButton}
          onPress={pickImage}
        >
          <Text style={styles.imageButtonText}>Pick an image</Text>
        </TouchableOpacity>

        {imageUri ? (
          <Image 
            source={{ uri: imageUri }} 
            style={styles.preview}
          />
        ) : null}

        <TouchableOpacity 
          style={styles.submitButton}
          onPress={handleSubmit}
        >
          <Text style={styles.submitButtonText}>Add Item</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  form: {
    padding: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 5,
    marginTop: 15,
  },
  input: {
    backgroundColor: 'white',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  imageButton: {
    backgroundColor: '#007AFF',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 20,
  },
  imageButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
  preview: {
    width: '100%',
    height: 200,
    marginTop: 20,
    borderRadius: 8,
  },
  submitButton: {
    backgroundColor: '#34C759',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 30,
  },
  submitButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});