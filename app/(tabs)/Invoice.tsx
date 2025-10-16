import { FontAwesome, Ionicons } from '@expo/vector-icons';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, Image, SafeAreaView, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// --- YODY BRAND COLORS ---
const COLORS = {
  primary: '#ffcd00',
  text: '#1a1a1a',
  subText: '#666',
  white: '#fff',
  background: '#f7f7f7',
  border: '#eee',
  danger: '#d0021b',
};

// --- ĐỊNH NGHĨA KIỂU DỮ LIỆU ---
interface Customer {
  name: string;
  phone: string;
  address: string;
}

interface OrderDetail {
  id: number;
  quantity: number;
  price: string;
  image_url: string;
  product: { name: string };
  colorVariant: { name: string };
  sizeVariant: { name: string };
}

interface Order {
  id: number;
  customer: Customer; // Thêm thông tin khách hàng
  orderDetails: OrderDetail[];
}

export default function InvoiceScreen() {
  const router = useRouter();
  const params = useLocalSearchParams();

  const [order, setOrder] = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (params.orderData) {
      try {
        const parsedData = JSON.parse(params?.orderData as string);
        setOrder(parsedData);
      } catch (error) {
        console.error("Lỗi khi parse dữ liệu đơn hàng:", error);
        Alert.alert("Lỗi", "Không thể đọc dữ liệu đơn hàng.");
      }
    }
    setLoading(false);
  }, [params.orderData]);

  const handlePayment = () => {
    Alert.alert('Thanh toán thành công', 'Cảm ơn bạn đã mua sắm tại YODY!');
    router.push('/(tabs)');
  };

  const formatCurrency = (amount: number) =>
    amount.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });

  const subTotal = order?.orderDetails.reduce(
    (sum, item) => sum + Number(item.price) * item.quantity, 0
  ) || 0;
  const shippingFee = subTotal >= 499000 ? 0 : 25000;
  const total = subTotal + shippingFee;

  // --- COMPONENT NHỎ HÓA ĐỂ DỄ ĐỌC ---
  const renderHeader = () => (
    <View style={styles.headerContainer}>
      <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
        <FontAwesome name="arrow-left" size={18} color={COLORS.text} />
      </TouchableOpacity>
      <Text style={styles.headerTitle}>Thanh toán</Text>
      <View style={{ width: 40 }} />
    </View>
  );
  // Mới: Component hiển thị thông tin giao hàng
  const renderShippingInfo = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Thông tin giao hàng</Text>
      <View style={styles.shippingInfoRow}>
        <Ionicons name="person-outline" size={20} color={COLORS.subText} style={styles.shippingInfoIcon} />
        <Text style={styles.shippingInfoText}>{order?.customer.name}</Text>
      </View>
      <View style={styles.shippingInfoRow}>
        <Ionicons name="call-outline" size={20} color={COLORS.subText} style={styles.shippingInfoIcon} />
        <Text style={styles.shippingInfoText}>{order?.customer.phone}</Text>
      </View>
      <View style={styles.shippingInfoRow}>
        <Ionicons name="location-outline" size={20} color={COLORS.subText} style={styles.shippingInfoIcon} />
        <Text style={styles.shippingInfoText} numberOfLines={2}>{order?.customer.address}</Text>
      </View>
    </View>
  );


  const renderProductItem = (item: OrderDetail) => (
    <View key={item.id} style={styles.productCard}>
      <Image source={{ uri: item.image_url }} style={styles.productImage} />
      <View style={styles.productDetails}>
        <Text style={styles.productName}>{item.product.name}</Text>
        <Text style={styles.productVariant}>
          {`${item.colorVariant.name}, ${item.sizeVariant.name}`}
        </Text>
        <View style={styles.productFooter}>
          <Text style={styles.productQuantity}>SL: {item.quantity}</Text>
          <Text style={styles.productPrice}>{formatCurrency(Number(item.price))}</Text>
        </View>
      </View>
    </View>
  );

  const renderPaymentDetails = () => (
    <View style={styles.sectionCard}>
      <Text style={styles.sectionTitle}>Chi tiết thanh toán</Text>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Tạm tính</Text>
        <Text style={styles.detailValue}>{formatCurrency(subTotal)}</Text>
      </View>
      <View style={styles.detailRow}>
        <Text style={styles.detailLabel}>Phí vận chuyển</Text>
        <Text style={styles.detailValue}>{formatCurrency(shippingFee)}</Text>
      </View>
      {shippingFee === 0 && subTotal > 0 && (
         <Text style={styles.freeShippingText}>Đơn hàng của bạn được miễn phí vận chuyển!</Text>
      )}
      <View style={styles.separator} />
      <View style={styles.detailRow}>
        <Text style={styles.totalLabel}>Tổng cộng</Text>
        <Text style={styles.totalValue}>{formatCurrency(total)}</Text>
      </View>
    </View>
  );

  if (loading) {
    return (
      <SafeAreaView style={styles.centered}>
        <ActivityIndicator size="large" color={COLORS.primary} />
        <Text>Đang tải thông tin đơn hàng...</Text>
      </SafeAreaView>
    );
  }
  
  if (!order) {
    return (
      <SafeAreaView style={styles.centered}>
        {renderHeader()}
        <Text>Không tìm thấy thông tin đơn hàng.</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <ScrollView contentContainerStyle={styles.scrollContent}>
        
        {renderShippingInfo()} 

        <View style={styles.sectionCard}>
          <Text style={styles.sectionTitle}>Sản phẩm</Text>
          {order.orderDetails.map(renderProductItem)}
        </View>

        {renderPaymentDetails()}

        <View style={[styles.sectionCard, styles.promoCard]}>
           <FontAwesome name="ticket" size={20} color={COLORS.subText} />
           <Text style={styles.promoText}>Mã giảm giá</Text>
           <FontAwesome name="chevron-right" size={16} color={COLORS.subText} />
        </View>

      </ScrollView>

      <View style={styles.footer}>
        <TouchableOpacity style={styles.payButton} onPress={handlePayment}>
          <Text style={styles.payButtonText}>Thanh toán {formatCurrency(total)}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.background,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  headerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: COLORS.white,
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: COLORS.text,
  },
  scrollContent: {
    padding: 16,
    paddingBottom: 100,
  },
  sectionCard: {
    backgroundColor: COLORS.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
    marginBottom: 16,
  },
  // Shipping Info Styles
  shippingInfoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  shippingInfoIcon: {
    marginRight: 12,
    width: 20, // Cố định chiều rộng để thẳng hàng
  },
  shippingInfoText: {
    fontSize: 16,
    color: COLORS.text,
    flex: 1, // Cho phép text xuống dòng nếu quá dài
  },
  // Product Card
  productCard: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  productImage: {
    width: 80,
    height: 100,
    borderRadius: 8,
    marginRight: 16,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  productDetails: {
    flex: 1,
    justifyContent: 'space-between',
  },
  productName: {
    fontSize: 16,
    fontWeight: '500',
    color: COLORS.text,
  },
  productVariant: {
    fontSize: 14,
    color: COLORS.subText,
    marginVertical: 4,
  },
  productFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  productQuantity: {
    fontSize: 14,
    color: COLORS.subText,
  },
  productPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: COLORS.text,
  },
  // Payment Details
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  detailLabel: {
    fontSize: 16,
    color: COLORS.subText,
  },
  detailValue: {
    fontSize: 16,
    color: COLORS.text,
    fontWeight: '500',
  },
  freeShippingText: {
    fontSize: 14,
    color: '#28a745',
    textAlign: 'right',
    marginBottom: 12,
  },
  separator: {
    height: 1,
    backgroundColor: COLORS.border,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: COLORS.text,
  },
  totalValue: {
    fontSize: 20,
    fontWeight: '700',
    color: COLORS.danger,
  },
  // Promo code
  promoCard: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between'
  },
  promoText: {
    flex: 1,
    fontSize: 16,
    color: COLORS.text,
    marginLeft: 12
  },
  // Footer & Button
  footer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: COLORS.white,
    padding: 16,
    paddingBottom: 32,
    borderTopWidth: 1,
    borderTopColor: COLORS.border,
  },
  payButton: {
    backgroundColor: COLORS.primary,
    paddingVertical: 16,
    borderRadius: 30,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 5,
  },
  payButtonText: {
    fontSize: 18,
    fontWeight: '700',
    color: COLORS.text,
  },
});