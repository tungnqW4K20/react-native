import React from 'react';
import { Dimensions, FlatList, Image, StyleSheet, View } from 'react-native';

interface Props {
  images: string[];
}

const { width } = Dimensions.get('window');

const ProductGallery: React.FC<Props> = ({ images }) => {
  if (!images || images.length === 0) {
    return <View style={styles.placeholder} />;
  }

  return (
    <FlatList
      data={images}
      horizontal
      pagingEnabled
      showsHorizontalScrollIndicator={false}
      keyExtractor={(item, index) => index.toString()}
      renderItem={({ item }) => (
        <Image source={{ uri: item }} style={styles.productImage} />
      )}
    />
  );
};

const styles = StyleSheet.create({
  productImage: {
    width: width,
    height: 450,
    resizeMode: 'cover',
  },
  placeholder: { width: '100%', height: 450, backgroundColor: '#f0f0f0' },
});

export default ProductGallery;