import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');
const numColumns = 2;
const itemWidth = (width - 40) / numColumns;
interface  IProduct{
    title : string;
        products: {
        id: string;
        name?: string; 
        price?: string;
        originalPrice?: string ;
        image?: string;
    }[];
} 
const ProductGrid = ({ title, products }: IProduct) => {
  const renderItem = ({ item }: any) => (
    <TouchableOpacity style={styles.card}>
      <Image source={{ uri: item.image }} style={styles.image} />
      <Text style={styles.name} numberOfLines={2}>{item.name}</Text>
      <Text style={styles.price}>{item.price}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{title}</Text>
      <FlatList
        data={products}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        columnWrapperStyle={styles.row}
        scrollEnabled={false} // Vô hiệu hóa cuộn cho FlatList bên trong ScrollView
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    marginTop: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 15,
    marginLeft: 5,
  },
  row: {
    justifyContent: 'space-between',
  },
  card: {
    width: itemWidth,
    marginBottom: 20,
    backgroundColor: '#f9f9f9',
    borderRadius: 8,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: 200,
  },
  name: {
    fontSize: 14,
    fontWeight: '600',
    margin: 8,
  },
  price: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginHorizontal: 8,
    marginBottom: 10,
  },
});

export default ProductGrid;