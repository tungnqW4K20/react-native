import React, { useState } from 'react';
import { Image, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


interface ICategory {
  id: string;
  name: string;
  image?: string;
}

interface ICategories {
  nam: ICategory[];
  nu: ICategory[];
}

const categories: ICategories = {
  nam: [
    { id: 'nam1', name: 'ÁO THUN', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_1.jpg?aio=w-270' },
    { id: 'nam2', name: 'ÁO POLO', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_3.jpg?aio=w-270' },
    { id: 'nam3', name: 'QUẦN SHORT', image: 'https://n7media.coolmate.me/uploads/August2025/Filter_Card_-_840x11632.jpg?aio=w-270' },
    { id: 'nam4', name: 'QUẦN LÓT', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_6.jpg?aio=w-270' },
    { id: 'nam5', name: 'ĐỒ BƠI', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_14.jpg?aio=w-270' },
  ],
  nu: [
    { id: 'nu1', name: 'BRA & LEGGING', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_8.jpg?aio=w-270' },
    { id: 'nu2', name: 'ÁO THỂ THAO', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_9.jpg?aio=w-270' },
    { id: 'nu3', name: 'QUẦN THỂ THAO', image: 'https://n7media.coolmate.me/uploads/August2025/Filter_Card_-_840x11631.jpg?aio=w-270' },
    { id: 'nu4', name: 'PHỤ KIỆN', image: 'https://n7media.coolmate.me/uploads/August2025/image-ao-thun-1_18_11.jpg?aio=w-270' },
  ],
};

const CategoryList = () => {
  type TabKey = keyof ICategories;
  const [activeTab, setActiveTab] = useState<TabKey>('nam');
  const currentProducts = categories[activeTab];

  return (
    <View style={styles.container}>
      {/* Các nút bấm NAM/NỮ */}
      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'nam' ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab('nam')}
        >
          <Text style={[styles.tabText, activeTab === 'nam' ? styles.activeTabText : styles.inactiveTabText]}>
            NAM
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tabButton, activeTab === 'nu' ? styles.activeTab : styles.inactiveTab]}
          onPress={() => setActiveTab('nu')}
        >
          <Text style={[styles.tabText, activeTab === 'nu' ? styles.activeTabText : styles.inactiveTabText]}>
            NỮ
          </Text>
        </TouchableOpacity>
      </View>
      
      {/* Danh sách sản phẩm */}
      <ScrollView
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        {currentProducts?.map((category) => (
          <TouchableOpacity key={category.id} style={styles.categoryItem}>
            <Image source={{ uri: category.image }} style={styles.categoryImage} />
            <Text style={styles.categoryName}>{category.name}</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 25,
    marginBottom: 10,
  },
  tabContainer: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingHorizontal: 15,
  },
  tabButton: {
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 20,
    marginRight: 10,
  },
  activeTab: {
    backgroundColor: '#000',
  },
  inactiveTab: {
    backgroundColor: '#f0f0f0',
  },
  tabText: {
    fontSize: 14,
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#fff',
  },
  inactiveTabText: {
    color: '#888',
  },
  scrollViewContent: {
    paddingHorizontal: 15, 
  },
  categoryItem: {
    alignItems: 'center',
    width: 150, 
    marginRight: 15, 
  },
  categoryImage: {
    width: '100%', 
    height: 220, 
    borderRadius: 12,
    marginBottom: 10,
    backgroundColor: '#f5f5f5', 
  },
  categoryName: {
    fontSize: 14,
    fontWeight: 'bold',
    textAlign: 'center',
    color: '#333',
  },
});

export default CategoryList;