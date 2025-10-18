import { API_URL } from "@env";
import { useRouter } from 'expo-router'; // <--- THÊM MỚI: Import useRouter
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface Category {
  id: number;
  name: string;
  image_url: string;
}

const CardSlider = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const router = useRouter(); // <--- THÊM MỚI: Khởi tạo router

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(`${API_URL}/categories`);
        const json = await response.json();
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

    const handleCategoryPress = (categoryId: number) => {
        router.push({
          pathname: "/shop",
          params: { categoryId: categoryId.toString() }, 
        });
      };

  if (loading) {
    return <ActivityIndicator style={{ marginVertical: 30 }} size="large" color="#555" />;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={data}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContainer}
        renderItem={({ item }) => (
          <TouchableOpacity 
            style={styles.categoryItem} 
            onPress={() => handleCategoryPress(item.id)}
          >
            <View style={styles.imageWrapper}>
              <Image source={{ uri: item.image_url }} style={styles.image} />
            </View>
            <Text style={styles.title} numberOfLines={1}>{item.name}</Text>
          </TouchableOpacity>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    paddingVertical: 16,
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  categoryItem: {
    alignItems: 'center',
    width: 80,
    marginRight: 12,
  },
  imageWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#EFEFEF',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
    marginBottom: 8,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  title: {
    fontSize: 12,
    fontWeight: '500',
    color: '#333',
    textAlign: 'center',
  },
});

export default CardSlider;