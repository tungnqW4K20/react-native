import { API_URL } from "@env";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Dimensions,
  FlatList,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';

const { width } = Dimensions.get('window');
const PADDING = 16;
const CARD_WIDTH = (width - PADDING * 3) / 2;
// ... (Các interface Category, Product, ApiProduct, ProductCardProps không đổi) ...
interface Category {
  id: number;
  name: string;
  image_url: string;
}

interface Product {
  id: string;
  title: string;
  price: string;
  soldCount: number;
  image: string;
  colors: string[];
  isBestSeller: boolean;
}

interface ApiProduct {
  id: number;
  name: string;
  price: string;
  image_url: string;
  featured: boolean;
  category: {
    id: number;
    name: string;
  };
}

interface ProductCardProps {
  product: Product;
  onPress: () => void;
}


const ProductCard = ({ product, onPress }: ProductCardProps) => {
  const formatPrice = (price: string) => {
    return `${parseInt(price, 10).toLocaleString('vi-VN')}₫`;
  };

  return (
    <TouchableOpacity style={styles.cardContainer} onPress={onPress}>
      <View>
        <Image source={{ uri: product.image }} style={styles.cardImage} />
        {product.isBestSeller && (
          <View style={styles.bestSellerBadge}>
            <Text style={styles.bestSellerText}>⚡ Nổi bật</Text>
          </View>
        )}
      </View>
      <View style={styles.infoContainer}>
        <Text style={styles.productTitle} numberOfLines={2}>
          {product.title}
        </Text>
        <Text style={styles.productPrice}>{formatPrice(product.price)}</Text>
        <Text style={styles.soldText}>{product.soldCount} đã bán</Text>
        <View style={styles.colorsContainer}>
          {product.colors.slice(0, 5).map((color, index) => (
            <View
              key={index}
              style={[styles.colorSwatch, { backgroundColor: color }]}
            />
          ))}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const FeaturedProducts = () => {
  const [categories, setCategories] = useState<Category[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [productsLoading, setProductsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        setLoading(true);
        const res =await fetch(`${API_URL}/categories`);
        const json = await res.json();
        if (json.success) {
          const listCate = json.data
          
          setCategories(listCate);
          if (listCate.length > 0) {
            setSelectedCategory(listCate[0].id);
          }
        }
      } catch (error) {
        console.error('Lỗi khi tải categories:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory === null) return;

    const fetchProductsByCategory = async () => {
      try {
        setProductsLoading(true);
        const res = await fetch(
          `${API_URL}/products/category/${selectedCategory}`
        );
        const json = await res.json();

        if (json.success && Array.isArray(json.data)) {
          const mappedProducts: Product[] = json.data.map((p: ApiProduct) => ({
            id: p.id.toString(),
            title: p.name,
            price: p.price,
            image: p.image_url,
            isBestSeller: p.featured,
            soldCount: Math.floor(Math.random() * 5000),
            colors: ['#2c3e50', '#ffffff', '#e74c3c', '#3498db', '#f1c40f'],
          }));
          setProducts(mappedProducts);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.error('Lỗi khi tải products:', error);
        setProducts([]);
      } finally {
        setProductsLoading(false);
      }
    };

    fetchProductsByCategory();
  }, [selectedCategory]);

  // SỬA ĐỔI QUAN TRỌNG: Hàm này chỉ điều hướng, không fetch dữ liệu chi tiết
  const handleProductPress = (productId: string) => {
    console.log(`Điều hướng đến chi tiết sản phẩm ID: ${productId}`);
    // Sử dụng đường dẫn động khớp với cấu trúc file `app/(tabs)/product/[id].tsx`
    router.push(`/productdetail/${productId}` as any);
  };

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sản Phẩm Nổi Bật</Text>

      <View style={styles.chipContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {categories.map((category) => (
            <TouchableOpacity
              key={category.id}
              style={[
                styles.chip,
                selectedCategory === category.id && styles.chipSelected,
              ]}
              onPress={() => setSelectedCategory(category.id)}
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategory === category.id && styles.chipTextSelected,
                ]}
              >
                {category.name}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {productsLoading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#2c3e50" />
        </View>
      ) : (
        <FlatList
          data={products}
          renderItem={({ item }) => (
            <ProductCard
              product={item}
              onPress={() => handleProductPress(item.id)}
            />
          )}
          keyExtractor={(item) => item.id}
          numColumns={2}
          columnWrapperStyle={{ justifyContent: 'space-between' }}
          contentContainerStyle={{ paddingHorizontal: PADDING }}
          scrollEnabled={false}
          ListEmptyComponent={
            <Text style={styles.emptyText}>
              Chưa có sản phẩm cho danh mục này
            </Text>
          }
        />
      )}
    </View>
  );
};

// ... (Toàn bộ phần styles không thay đổi) ...
const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', paddingVertical: 20 },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
    color: '#2c3e50',
  },
  chipContainer: { paddingHorizontal: PADDING, marginBottom: 20 },
  chip: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: '#f1f1f1',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  chipSelected: { backgroundColor: '#FFC84A'  },
  chipText: { fontSize: 14, color: '#333' },
  chipTextSelected: { fontWeight: 'bold', color: '#333' },
  cardContainer: {
    width: CARD_WIDTH,
    marginBottom: PADDING,
    borderRadius: 8,
    backgroundColor: '#f9f9f9',
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#eee',
  },
  cardImage: { width: '100%', height: CARD_WIDTH * 1.5, resizeMode: 'cover' },
  bestSellerBadge: {
    position: 'absolute',
    top: 8,
    left: 8,
    backgroundColor: 'rgba(44, 62, 80, 0.8)',
    paddingVertical: 4,
    paddingHorizontal: 8,
    borderRadius: 12,
  },
  bestSellerText: { fontSize: 11, fontWeight: 'bold', color: '#fff' },
  infoContainer: { padding: 10 },
  productTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 4,
    minHeight: 34,
  },
  productPrice: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#e74c3c',
    marginBottom: 4,
  },
  soldText: { fontSize: 12, color: '#7f8c8d', marginBottom: 8 },
  colorsContainer: { flexDirection: 'row', flexWrap: 'wrap' },
  colorSwatch: {
    width: 18,
    height: 18,
    borderRadius: 9,
    marginRight: 6,
    borderWidth: 1,
    borderColor: '#e0e0e0',
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    minHeight: 200,
  },
  emptyText: { textAlign: 'center', marginTop: 20, color: '#888' },
});


export default FeaturedProducts;