import { useAuth } from "@/components/AuthContext";
import Header from '@/components/Header';
import ProductDetails from '@/components/ProductDetails';
import ProductGallery from '@/components/ProductGallery';
import ProductInfoSections from '@/components/ProductInfoSections';
import ProductReviews from "@/components/ProductReviews";
import { cartService } from "@/services/cartService";
import { API_URL } from "@env";
import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, SafeAreaView, ScrollView, StyleSheet, Text, View } from 'react-native';

interface ApiColorOption {
  id: number;
  name: string;
  price: string;
  image_urls: string[];
  colorCode: string | null;
}

interface ApiSizeOption {
  id: number;
  name: string;
  price: string | null;
}

interface Product {
  id: number;
  name: string;
  description: string;
  price: string;
  image_url: string;
  colorOptions: ApiColorOption[];
  sizeOptions: ApiSizeOption[];
}

const formatPrice = (priceString: string) => {
  const price = parseFloat(priceString);
  return new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(price);
};

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const [loading, setLoading] = useState(true);
  const [product, setProduct] = useState<Product | null>(null);
  const [selectedColor, setSelectedColor] = useState<ApiColorOption | null>(null);
  const [error, setError] = useState<string | null>(null);

  const { token } = useAuth();

  useEffect(() => {
    if (!id) {
      setLoading(false);
      setError("Không tìm thấy ID sản phẩm.");
      return;
    }

    const fetchProductDetails = async () => {
      setLoading(true);
      setError(null);
      console.log("URL", API_URL)
      try {
        const response = await fetch(`${API_URL}/products/${id}/details`);
        const result = await response.json();

        if (result.success) {
          const productData = result.data;
          setProduct(productData);

          if (productData.colorOptions && productData.colorOptions.length > 0) {
            setSelectedColor(productData.colorOptions[0]);
          }
        } else {
          setError('Không thể tải dữ liệu sản phẩm.');
        }
      } catch (e) {
        console.error("Lỗi khi fetch chi tiết sản phẩm:", e);
        setError('Đã có lỗi mạng xảy ra.');
      } finally {
        setLoading(false);
      }
    };

    fetchProductDetails();
  }, [id]);

  const handleAddToCart = async (details: { color: ApiColorOption; size: ApiSizeOption; quantity: number }) => {
      if (!token) {
        alert("Bạn cần đăng nhập để thêm sản phẩm vào giỏ hàng!");
        return;
      }

      const imageUrl = details.color.image_urls && details.color.image_urls.length > 0
        ? details.color.image_urls[0]
        : product?.image_url;

        console.log("product---------------", details )
      try {
        const data = await cartService.addToCart({
      product_id: product?.id!,
      color_product_id: details.color.id,
      size_product_id: details.size.id,
      quantity: details.quantity,
      image_url: imageUrl,
    });

    alert("Thêm sản phẩm vào giỏ hàng thành công!");
    console.log("Cart item:", data);
      } catch (err) {
        console.error("Lỗi khi thêm sản phẩm vào giỏ:", err);
      }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2c3e50" />
      </View>
    );
  }

  if (error || !product) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <Header />
        <View style={styles.centered}>
          <Text>{error || 'Không tìm thấy sản phẩm.'}</Text>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView>
        <Header />
        <ProductGallery images={selectedColor?.image_urls.length ? selectedColor.image_urls : [product.image_url]} />
        <ProductDetails
          name={product.name}
          price={formatPrice(product.price)}
          code={`SKU-${product.id}`}
          colors={product.colorOptions}
          sizes={product.sizeOptions}
          selectedColor={selectedColor!}
          initialSize={product.sizeOptions[0]}
          onColorChange={(color) => setSelectedColor(color)}
          onAddToCart={handleAddToCart}
        />
        <ProductInfoSections description={product.description} />
        <ProductReviews productId={product.id} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#fff' },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});