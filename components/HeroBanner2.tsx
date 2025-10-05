import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, StyleSheet, Text, TouchableOpacity, View } from 'react-native';


const router = useRouter();
interface Product {
  id: number;
  name: string;
  price: number;
  image_url: string;
}

interface ProductCardProps {
  item: Product;
}

const formatPriceVND = (price: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(price);
};

const ProductCard: React.FC<ProductCardProps> = ({ item }) => (
  <TouchableOpacity style={styles.productCard} 
    onPress={() => router.push(`/productdetail/${item.id}`)}
  >
    <Image source={{ uri: item.image_url }} style={styles.productImage} />
    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
    <Text style={styles.productPrice}>{formatPriceVND(item.price)}</Text>
  </TouchableOpacity>
);



const HeroBanner2 = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://benodejs-9.onrender.com/api/products/');
        const json = await response.json();
        
        if (json.success && Array.isArray(json.data)) {
          const firstFourProducts = json.data.slice(0, 4);
          setProducts(firstFourProducts);
        } else {
          setError('Không thể tải dữ liệu sản phẩm.');
        }
      } catch (e) {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  if (loading) {
    return (
      <View style={[styles.container, styles.centered]}>
        <ActivityIndicator size="large" color="#555" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.container, styles.centered]}>
        <Text style={styles.errorText}>{error}</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.sectionTitle}>BÁN CHẠY NHẤT</Text>
        <TouchableOpacity onPress={() => router.push('/shop')} >
          <Text style={styles.viewAll}>Xem tất cả</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={products}
        horizontal
        showsHorizontalScrollIndicator={false}
        keyExtractor={item => item.id.toString()}
        renderItem={({ item }) => <ProductCard item={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    backgroundColor: '#fff',
    paddingVertical: 20,
    minHeight: 300,
  },
  centered: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
      color: '#c0392b',
      fontSize: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#222',
  },
  viewAll: {
    fontSize: 14,
    color: '#007AFF',
    fontWeight: '600',
  },
  listContainer: {
    paddingHorizontal: 16,
  },
  productCard: {
    width: 150,
    marginRight: 12,
  },
  productImage: {
    width: '100%',
    aspectRatio: 3 / 4,
    borderRadius: 8,
    backgroundColor: '#f5f5f5',
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    marginTop: 8,
    color: '#333',
    minHeight: 38
  },
  productPrice: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#111',
    marginTop: 4,
  },
});

export default HeroBanner2;