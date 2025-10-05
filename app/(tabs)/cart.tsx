import { useAuth } from '@/components/AuthContext';
import Header from '@/components/Header';
import { cartService } from '@/services/cartService';
import { orderService } from '@/services/orderService'; // Thêm import
import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useFocusEffect } from '@react-navigation/native';
import { useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

interface CartItem {
  id: number;
  productId: number;
  colorProductId: number;
  sizeProductId: number;
  name: string;
  variant: string;
  price: number;
  quantity: number;
  image: string;
  selected: boolean;
}

export default function CartScreen() {
  const { token } = useAuth();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectAll, setSelectAll] = useState(true);
  const router = useRouter();

  const formatCurrency = (amount: number) => {
    return amount.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
  };

  const totalPrice = items.reduce((sum, item) => item.selected ? sum + item.price * item.quantity : sum, 0);

  const fetchCart = async () => {
    if (!token) return;

    try {
      setLoading(true);
      const res = await cartService.getCart()

      if (res.success) {
        const data = res.data;

        const cartItems: CartItem[] = data.map((item: any) => ({
          id: item.id,
          productId: item.product_id,
          colorProductId: item.color_product_id,
          sizeProductId: item.size_product_id,
          name: item.product.name,
          variant: `${item.colorVariant.name}, ${item.sizeVariant.name}`,
          price:
            (Number(item.product.price) || 0) +
            (Number(item.colorVariant?.price) || 0) +
            (Number(item.sizeVariant?.price) || 0),
          quantity: item.quantity,
          image: item.colorVariant?.image_urls?.[0] || item.product.image_url,
          selected: true,
        }));

        setItems(cartItems);
        setSelectAll(cartItems.every(item => item.selected));
      } else {
        console.error('Lỗi khi lấy giỏ hàng');
      }
    } catch (err) {
      console.error('Lỗi fetch giỏ hàng:', err);
    } finally {
      setLoading(false);
    }
  };

  useFocusEffect(
    useCallback(() => {
      fetchCart();
    }, [token])
  );

  const toggleSelectAll = () => {
    setSelectAll(!selectAll);
    setItems(prev => prev.map(item => ({ ...item, selected: !selectAll })));
  };

  const toggleSelectItem = (id: number) => {
    setItems(prev => {
      const newItems = prev.map(item =>
        item.id === id ? { ...item, selected: !item.selected } : item
      );
      setSelectAll(newItems.every(item => item.selected));
      return newItems;
    });
  };

  const removeItem = async (id: number) => {
    const res = await cartService.deleteCart(id)
    if (res.success) {
      fetchCart();
    };
  }

  const changeQuantity = async (id: number, quantity: number, type: string) => {
    let newQuantity = type === "plus"
      ? quantity + 1
      : type === "minus"
        ? quantity - 1
        : quantity;

    if (newQuantity < 1) return;

    const res = await cartService.updateCart(id, newQuantity);
    if (res.success) {
      setItems(prev =>
        prev.map(item =>
          item.id === id ? { ...item, quantity: newQuantity } : item
        )
      );
    } else {
      console.error("Update thất bại");
    }
  };

  const handleOrder = async () => {
    const selectedItems = items.filter(item => item.selected);

    if (selectedItems.length === 0) {
      Alert.alert('Thông báo', 'Vui lòng chọn sản phẩm để đặt hàng.');
      return;
    }

    const orderItems = selectedItems.map(item => ({
      productId: item.productId,
      colorProductId: item.colorProductId,
      sizeProductId: item.sizeProductId,
      quantity: item.quantity,
      imageUrl: item.image,
    }));

    try {
      const res = await orderService.createOrder(orderItems);
      if (res.success) {
        Alert.alert('Thành công', 'Tạo đơn hàng thành công!');
        fetchCart();
        router.push({
          pathname: '/Invoice',
          params: { orderData: JSON.stringify(res.data) }
        });
      } else {
        Alert.alert('Lỗi', res.message || 'Không thể tạo đơn hàng. Vui lòng thử lại.');
      }
    } catch (error) {
      console.error('Lỗi khi tạo đơn hàng:', error);
      Alert.alert('Lỗi', 'Đã xảy ra lỗi khi tạo đơn hàng. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color="#2c3e50" />
        <Text>Đang tải giỏ hàng...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Header />

      <Text style={styles.titlepage}>Giỏ hàng</Text>

      <ScrollView contentContainerStyle={styles.scrollViewContent}>
        <View style={styles.selectAllContainer}>
          <TouchableOpacity onPress={toggleSelectAll}>
            <Ionicons name={selectAll ? "checkbox" : "square-outline"} size={24} color="#f5b301" />
          </TouchableOpacity>
          <Text style={styles.selectAllText}>Chọn tất cả</Text>
        </View>

        {items.map(item => (
          <View key={item.id} style={styles.productItemContainer}>
            <TouchableOpacity style={styles.checkbox} onPress={() => toggleSelectItem(item.id)}>
              <Ionicons name={item.selected ? "checkbox" : "square-outline"} size={24} color="#f5b301" />
            </TouchableOpacity>

            <Image source={{ uri: item.image }} style={styles.productImage} />

            <View style={styles.productDetails}>
              <View style={styles.productNameRow}>
                <Text style={styles.productName}>{item.name}</Text>
                <TouchableOpacity onPress={() => removeItem(item.id)}>
                  <Ionicons name="trash-outline" size={20} color="#888" />
                </TouchableOpacity>
              </View>

              <View style={styles.variantContainer}>
                <Text style={styles.variantText}>{item.variant} ▾</Text>
              </View>

              <View style={styles.priceQuantityRow}>
                <View style={styles.quantitySelector}>
                  <TouchableOpacity onPress={() => changeQuantity(item.id, item.quantity, 'minus')} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>-</Text>
                  </TouchableOpacity>
                  <Text style={styles.quantityText}>{item.quantity}</Text>
                  <TouchableOpacity onPress={() => changeQuantity(item.id, item.quantity, 'plus')} style={styles.quantityButton}>
                    <Text style={styles.quantityButtonText}>+</Text>
                  </TouchableOpacity>
                </View>
                <Text style={styles.productPrice}>
                  {formatCurrency(item.price * item.quantity)}
                </Text>

              </View>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.shippingInfo}>
          <FontAwesome name="truck" size={16} color="#555" />
          <Text style={styles.shippingText}>Đơn từ 498k được miễn phí vận chuyển nhé!</Text>
        </View>
        <View style={styles.checkoutContainer}>
          <View>
            <Text style={styles.totalLabel}>Tổng {formatCurrency(totalPrice)}</Text>
            <Text style={styles.subLabel}>Mua nhiều giảm nhiều</Text>
          </View>
          <TouchableOpacity style={styles.orderButton} onPress={handleOrder}>
            <Text style={styles.orderButtonText}>Đặt hàng</Text>
            <FontAwesome name="arrow-right" size={16} color="black" />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    marginBottom: 60
     },
  centered: { 
    flex: 1, 
    justifyContent: 'center', 
    alignItems: 'center' 
  },
  titlepage: { 
    textAlign: 'center', 
    fontSize: 18, fontWeight: '600',
     paddingVertical: 16, 
     borderBottomWidth: 1, 
     borderBottomColor: '#f0f0f0' 
    },
  scrollViewContent: { 
    paddingBottom: 150 
},
  selectAllContainer: {
     flexDirection: 'row', 
     alignItems: 'center', 
     paddingHorizontal: 16,
      paddingVertical: 12 
    },
  selectAllText: {
     marginLeft: 8, 
     fontSize: 16 
    },
  productItemContainer: { 
    flexDirection: 'row', 
    paddingHorizontal: 16, 
    paddingVertical: 12, 
    alignItems: 'flex-start' 
},
  checkbox: { 
    marginRight: 10,
     marginTop: 20
     },
  productImage: { 
    width: 80, 
    height: 100,
    borderRadius: 8,
    marginRight: 12
},
  productDetails: { 
    flex: 1 
},
  productNameRow: { 
    flexDirection: 'row',
     justifyContent: 'space-between', 
     alignItems: 'flex-start' 
    },
  productName: { 
    fontSize: 14,
     fontWeight: '500', 
     flex: 1, 
     marginRight: 8 
    },
  variantContainer: {
     backgroundColor: '#f5f5f5', 
     paddingHorizontal: 8,
      paddingVertical: 4,
       borderRadius: 4, alignSelf: 'flex-start',
        marginVertical: 8
     },
  variantText: { 
    fontSize: 12,
     color: '#555'
     },
  priceQuantityRow: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center', 
    marginTop: 8 
},
  quantitySelector: { 
    flexDirection: 'row',
     alignItems: 'center',
      borderWidth: 1, 
      borderColor: '#e0e0e0', 
      borderRadius: 6
     },
  quantityButton: { 
    paddingHorizontal: 12, 
    paddingVertical: 4
 },
  quantityButtonText: { 
    fontSize: 18,
     color: '#555' 
    },
  quantityText: {
     paddingHorizontal: 12,
     fontSize: 16,
      fontWeight: '600' 
    },
  productPrice: { 
    fontSize: 16,
    fontWeight: 'bold' 
    },
  footer: { 
    position: 'absolute', 
    bottom: 0, 
    left: 0,
    right: 0,
    backgroundColor: '#fff',
    borderTopWidth: 1, 
    borderTopColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    paddingBottom: 24,
    marginBottom:0 
    },
  shippingInfo: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  shippingText: { marginLeft: 8, fontSize: 12, color: '#555' },
  checkoutContainer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { fontSize: 16, fontWeight: 'bold' },
  subLabel: { fontSize: 12, color: '#888' },
  orderButton: { backgroundColor: '#ffd700', paddingHorizontal: 24, paddingVertical: 12, borderRadius: 20, flexDirection: 'row', alignItems: 'center' },
  orderButtonText: { fontSize: 16, fontWeight: 'bold', marginRight: 8 },
});