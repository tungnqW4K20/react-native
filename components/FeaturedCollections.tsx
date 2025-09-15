import React from 'react';
import { Dimensions, Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window');

// Dữ liệu cho các bộ sưu tập
const collections = [
  {
    id: '1',
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/4beabaa54fbc214c53d4016a0ba0efb2.webp?width=351&height=468',
  },
  {
    id: '2',
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/7ca2ed2a900a49d0c6e6b139d75947d9.webp?width=351&height=468',
  },
  {
    id: '3',
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/00f76b52090bc112aea949cfceed0595.webp?width=351&height=468',
  },
  {
    id: '4',
    image: 'https://buggy.yodycdn.com/images/home-grid-mb/bd9c0326442c82bca85e310ff2ac108e.webp?width=351&height=468',
  },
];

// 1. Loại bỏ title và description khỏi props
interface ImageCardProps {
  imageUri: string;
  onPress: () => void;
}

// 2. Loại bỏ phần hiển thị text khỏi component ImageCard
const ImageCard: React.FC<ImageCardProps> = ({ imageUri, onPress }) => {
  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <Image
        source={{ uri: imageUri }}
        style={styles.cardImage}
        resizeMode="cover"
      />
    </TouchableOpacity>
  );
};

const FeaturedCollections: React.FC = () => {
  // 3. Sửa lại hàm xử lý, không cần truyền title vào nữa
  const handlePressCollection = (collectionId: string) => {
    console.log(`Bạn đã nhấn vào bộ sưu tập có ID: ${collectionId}`);
    // Thêm logic điều hướng tới màn hình chi tiết bộ sưu tập ở đây
  };

  // Cải tiến: Chia mảng collections thành các hàng, mỗi hàng 2 item
  const collectionRows = [];
  for (let i = 0; i < collections.length; i += 2) {
    collectionRows.push(collections.slice(i, i + 2));
  }

  return (
    <ScrollView style={styles.scrollViewContainer}>
      <View style={styles.mainContainer}>
        <Text style={styles.headerTitle}>CÁC BST NỔI BẬT TẠI YODY</Text>

        {/* 4. Dùng map để render danh sách một cách tự động */}
        <View style={styles.collectionsGrid}>
          {collectionRows.map((row, rowIndex) => (
            <View key={rowIndex} style={styles.row}>
              {row.map((collection) => (
                <ImageCard
                  key={collection.id}
                  imageUri={collection.image}
                  onPress={() => handlePressCollection(collection.id)}
                />
              ))}
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollViewContainer: {
    flex: 1,
    backgroundColor: '#fff',
  },
  mainContainer: {
    paddingVertical: width * 0.05,
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: width * 0.055,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: width * 0.05,
    color: '#333',
    paddingHorizontal: width * 0.04,
  },
  collectionsGrid: {
    paddingHorizontal: width * 0.04,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: width * 0.03,
  },
  cardContainer: {
    width: (width - (width * 0.08) - (width * 0.03)) / 2,
    height: ((width - (width * 0.08) - (width * 0.03)) / 2) * 1.3,
    borderRadius: 8,
    overflow: 'hidden',
    backgroundColor: '#f0f0f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardImage: {
    width: '100%',
    height: '100%',
  },
  // 5. Loại bỏ các style không cần thiết cho text overlay
});

export default FeaturedCollections;