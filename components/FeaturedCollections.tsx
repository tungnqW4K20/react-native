import React from 'react';
import { Dimensions, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

const collections = [
  { 
    id: '1', 
    name: "Trang phục hàng ngày", 
    description: "Thoải mái & phong cách",
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/4beabaa54fbc214c53d4016a0ba0efb2.webp?width=351&height=468' 
  },
  { 
    id: '2', 
    name: "Đồ thể thao", 
    description: "Năng động & bền bỉ",
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/7ca2ed2a900a49d0c6e6b139d75947d9.webp?width=351&height=468' 
  },
  { 
    id: '3', 
    name: "Thời trang công sở", 
    description: "Lịch lãm & hiện đại",
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/00f76b52090bc112aea949cfceed0595.webp?width=351&height=468' 
  },
  { 
    id: '4', 
    name: "Đồ đi du lịch", 
    description: "Tiện lợi & gọn nhẹ",
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/bd9c0326442c82bca85e310ff2ac108e.webp?width=351&height=468' 
  },
];

const FeaturedCollections = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>KHÁM PHÁ BỘ SƯU TẬP</Text>
      <Text style={styles.sectionSubtitle}>Những lựa chọn được yêu thích nhất từ YODY</Text>
      
      <View style={styles.grid}>
        {collections.map(item => (
          <TouchableOpacity key={item.id} style={styles.card}>
            {/* Phần hình ảnh */}
            <View style={styles.imageContainer}>
              <Image source={{ uri: item.image }} style={styles.image} />
            </View>
            
            {/* Phần nội dung text */}
            <View style={styles.contentContainer}>
              <Text style={styles.cardTitle}>{item.name}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
              
              <View style={styles.actionContainer}>
                  <Text style={styles.actionText}>Xem ngay</Text>
                  <Text style={styles.actionIcon}>→</Text>
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: '#F8F9FA', 
    padding: 16,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1A1A1A',
    textAlign: 'center',
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
    marginBottom: 20,
    marginTop: 4,
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  card: {
    width: (width - 32 - 12) / 2, 
    marginBottom: 16,
    backgroundColor: '#fff',
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.05,
    shadowRadius: 12,
    elevation: 3,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden', 
  },
  image: {
    width: '100%',
    height: '100%',
  },
  contentContainer: {
    padding: 12,
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#222',
  },
  cardDescription: {
    fontSize: 13,
    color: '#777',
    marginTop: 4,
  },
  actionContainer: {
      marginTop: 12,
      flexDirection: 'row',
      alignItems: 'center',
  },
  actionText: {
      fontSize: 14,
      fontWeight: 'bold',
      color: '#007AFF', 
  },
  actionIcon: {
      marginLeft: 4,
      fontSize: 16,
      color: '#007AFF',
  }
});

export default FeaturedCollections;