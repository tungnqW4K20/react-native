import { orderService } from "@/services/orderService";
import { paymentService } from "@/services/paymentService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  RefreshControl,
  SafeAreaView,
  StyleSheet,
  Text,
  TouchableOpacity // Sử dụng TouchableOpacity để có hiệu ứng nhấn rõ hơn
  ,









  View
} from "react-native";
// Giả sử bạn đã cài đặt và cấu hình thư viện date picker
// import DateTimePicker from '@react-native-community/datetimepicker';
import * as Linking from 'expo-linking';

type Product = {
  id: string;
  title: string;
  variant?: string;
  qty: number;
  price: number;
  image?: string;
};

type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled";

type Order = {
  id: string;
  status: OrderStatus;
  statusLabel: string;
  createdAt: string;
  items: Product[];
  total: number;
  deliveredSuccess?: boolean;
};

const PRIMARY = "#FDBA44";
const MUTED = "#666666";
const BACKGROUND = "#F8F8F8";
const TEXT_COLOR = "#222222";
const BORDER_COLOR = "#EAEAEA";

const TABS = [
  { key: "pending", label: "Chờ xử lý" },
  { key: "shipping", label: "Đang giao" },
  { key: "delivered", label: "Đã giao" },
  { key: "cancelled", label: "Đã hủy" },
];

const mapApiOrderToLocalOrder = (apiOrder: any): Order => {
    const statusMap: { [key: string]: OrderStatus } = {
      "0": "pending",
      "1": "shipping",
      "2": "delivered",
      "3": "cancelled",
    };
    const statusKey = statusMap[apiOrder.orderstatus] || "pending";
  
    const statusLabelMap: { [key in OrderStatus]: string } = {
      pending: "Chờ xử lý",
      shipping: "Đang giao hàng",
      delivered: "Giao thành công",
      cancelled: "Đã hủy",
    };
  
    return {
      id: `YODY${apiOrder.id}`,
      status: statusKey,
      statusLabel: statusLabelMap[statusKey],
      createdAt: apiOrder.orderdate,
      total: apiOrder.totalAmount,
      deliveredSuccess: statusKey === "delivered",
      items: apiOrder.orderDetails.map((item: any) => ({
        id: item.id.toString(),
        title: item.product.name,
        variant: `Màu: ${item.colorVariant.name}, Size: ${item.sizeVariant.name}`,
        qty: item.quantity,
        price: parseFloat(item.price),
        image: item.image_url,
      })),
    };
  };

export default function OrderHistoryScreen() {
  const [selectedTab, setSelectedTab] = useState<OrderStatus>("pending");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // State mới cho việc lọc ngày
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  
  // State để điều khiển việc hiển thị DatePicker (giả lập)
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState<'start' | 'end'>('start');


   const handlePayment = async (order: Order) => {
    try {
      // 1. Gọi API để lấy URL thanh toán
      console.log(`Đang yêu cầu thanh toán cho đơn hàng ${order.id} với số tiền ${order.total}`);
      const response = await paymentService.createPaymentUrl(
        Number(order.id.replace("YODY", "")),
        order.total
      );

      if (response && response.data) {
        // 2. Mở URL trong In-App Browser
        // const result = await WebBrowser.openBrowserAsync(response.data);
        await Linking.openURL(response.data);
        // Sau khi trình duyệt đóng, chúng ta có thể làm mới lại danh sách đơn hàng
        // để cập nhật trạng thái mới nhất (nếu cần).
        // Tuy nhiên, cách tốt nhất là lắng nghe từ Deep Link.
      } else {
        alert("Không thể tạo yêu cầu thanh toán. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi tạo URL thanh toán:", error);
      alert("Đã xảy ra lỗi trong quá trình thanh toán.");
    }
  };


  // Lắng nghe sự kiện quay lại ứng dụng từ Deep Link
  useEffect(() => {
    const handleDeepLink = (event: { url: string }) => {
      const { hostname, path, queryParams } = Linking.parse(event.url);
      
      // Kiểm tra nếu URL là từ VNPAY trả về
      if (hostname === 'payment' && path === 'return') {
        console.log("Quay lại từ VNPAY:", queryParams);
        const vnp_ResponseCode = queryParams?.vnp_ResponseCode;

        if (vnp_ResponseCode === '00') {
           // Bạn có thể hiện một thông báo thành công ở đây
           alert('Thanh toán thành công!');
        } else {
           // Hoặc thông báo thất bại
           alert('Thanh toán không thành công hoặc đã bị hủy.');
        }

        // Tải lại danh sách đơn hàng để cập nhật trạng thái mới nhất
        fetchOrders();
      }
    };
    
    // Thêm listener
    const subscription = Linking.addEventListener('url', handleDeepLink);

    // Dọn dẹp listener khi component unmount
    return () => {
      subscription.remove();
    };
  }, []);
  
  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getOrderByCustomer();
      if (response.success && Array.isArray(response.data)) {
        const mappedOrders = response.data.map(mapApiOrderToLocalOrder);
        setOrders(mappedOrders);
      }
    } catch (error) {
      console.error("Lỗi khi tải lịch sử đơn hàng:", error);
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const filteredOrders = useMemo(() => {
    let tempOrders = orders.filter((o) => o.status === selectedTab);

    if (startDate) {
      const startOfDay = new Date(startDate);
      startOfDay.setHours(0, 0, 0, 0);
      tempOrders = tempOrders.filter(o => new Date(o.createdAt) >= startOfDay);
    }
  
    if (endDate) {
      const endOfDay = new Date(endDate);
      endOfDay.setHours(23, 59, 59, 999);
      tempOrders = tempOrders.filter(o => new Date(o.createdAt) <= endOfDay);
    }

    return tempOrders;
  }, [selectedTab, orders, startDate, endDate]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchOrders();
  };
  
  const formatDate = (date: Date) => {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
  };

  const handleClearDateFilter = () => {
    setStartDate(null);
    setEndDate(null);
  }

  // Hàm này sẽ được gọi khi người dùng chọn ngày từ DatePicker
  // Bạn cần tích hợp thư viện DatePicker thực tế để hoàn thiện
  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false); // Ẩn picker sau khi chọn
    if (selectedDate) {
        if (datePickerFor === 'start') {
            setStartDate(selectedDate);
        } else {
            setEndDate(selectedDate);
        }
    }
  };


  const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "₫";

  const renderProductItem = (p: Product) => (
    <View key={p.id} style={styles.productRow}>
      <Image source={{ uri: p.image }} style={styles.thumb} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={2} style={styles.productTitle}>
          {p.title}
        </Text>
        {p.variant ? <Text style={styles.variant}>{p.variant}</Text> : null}
        <View style={styles.rowBetween}>
          <Text style={styles.qty}>Số lượng: {p.qty}</Text>
          <Text style={styles.price}>{formatPrice(p.price)}</Text>
        </View>
      </View>
    </View>
  );

  const OrderCard = ({ item }: { item: Order }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <Text style={styles.orderId}>Đơn hàng: {item.id}</Text>
        <Text
          style={[
            styles.status,
            item.status === "delivered" && styles.statusDelivered,
            item.status === "shipping" && styles.statusShipping,
            item.status === "cancelled" && styles.statusCancelled,
            item.status === "pending" && styles.statusPending,
          ]}
        >
          {item.statusLabel.toUpperCase()}
        </Text>
      </View>
      <View style={styles.divider} />

      {item.items.map(renderProductItem)}

      <View style={styles.divider} />

      <View style={styles.cardFooter}>
        <Text style={styles.totalLabel}>
          {item.items.length} sản phẩm
        </Text>
        <Text style={styles.totalValue}>
          Tổng tiền: <Text style={{ color: TEXT_COLOR, fontWeight: 'bold' }}>{formatPrice(item.total)}</Text>
        </Text>
      </View>
       <View style={styles.actionRow}>
        {item.status === 'delivered' && (
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => console.log("Mua lại", item.id)}>
            <Text style={styles.primaryButtonText}>Mua lại</Text>
          </Pressable>
        )}
        {item.status === 'pending' && (
          <>
            <Pressable style={styles.actionButton} 
              onPress={async () => {
                try {
                  await orderService.updateOrderStatus({
                    id: Number(item.id.replace("YODY", "")),
                    status: 'cancelled',
                  })
                  fetchOrders()
                } catch (error) {
                  console.error("Lỗi hủy đơn:", error)
                }
              }}
            >
              <Text style={styles.actionButtonText}>Hủy đơn</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.primaryButton]}  onPress={() => handlePayment(item)}>
              <Text style={styles.primaryButtonText}>Thanh toán ngay</Text>
            </Pressable>
          </>
        )}

         {/* Khi đơn hàng đã bị hủy */}
      {item.status === 'cancelled' && (
        <Pressable 
          style={[styles.actionButton, styles.primaryButton]} 
          onPress={async () => {
            try {
              // Giả định rằng "Mua lại" sẽ tạo một đơn hàng mới
              // Hoặc cập nhật đơn hàng này về trạng thái 'pending'
              await orderService.updateOrderStatus({
                id: Number(item.id.replace("YODY", "")),
                status: 'pending', // Chuyển trạng thái về 'chờ xử lý'
              });
              // Tải lại danh sách đơn hàng để cập nhật giao diện
              fetchOrders();
              console.log("Đã yêu cầu mua lại đơn hàng:", item.id);
            } catch (error) {
              console.error("Lỗi khi mua lại đơn hàng:", error);
            }
          }}
        >
          <Text style={styles.primaryButtonText}>Mua lại</Text>
        </Pressable>
      )}
      </View>
    </View>
  );
  
  const renderHeader = () => (
    <View style={styles.header}>
      <Pressable onPress={() => router.push('/profile')}>
        <Ionicons name="arrow-back" size={24} color={TEXT_COLOR} />
      </Pressable>
      <Text style={styles.headerTitle}>Đơn hàng của tôi</Text>
      <View style={{ width: 24 }} />
    </View>
  )

  const renderDateFilter = () => (
    <View style={styles.dateFilterContainer}>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => { setDatePickerFor('start'); setShowDatePicker(true); }}>
            <Ionicons name="calendar-outline" size={20} color={MUTED} />
            <Text style={styles.datePickerText}>{startDate ? formatDate(startDate) : 'Từ ngày'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.datePickerButton} onPress={() => { setDatePickerFor('end'); setShowDatePicker(true); }}>
            <Ionicons name="calendar-outline" size={20} color={MUTED} />
            <Text style={styles.datePickerText}>{endDate ? formatDate(endDate) : 'Đến ngày'}</Text>
        </TouchableOpacity>
        {(startDate || endDate) && (
            <TouchableOpacity onPress={handleClearDateFilter} style={styles.clearButton}>
                <Ionicons name="close" size={20} color={TEXT_COLOR} />
            </TouchableOpacity>
        )}
    </View>
  );


  if (isLoading) {
    return (
      <SafeAreaView style={styles.container}>
        {renderHeader()}
        <View style={styles.centered}>
          <ActivityIndicator size="large" color={PRIMARY} />
        </View>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.tabsContainer}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setSelectedTab(t.key as OrderStatus)}
            style={[styles.tab, selectedTab === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      {renderDateFilter()}

      {/* Tích hợp component DateTimePicker của bạn ở đây. 
          Ví dụ:
          {showDatePicker && (
            <DateTimePicker
                value={datePickerFor === 'start' ? startDate || new Date() : endDate || new Date()}
                mode="date"
                display="default"
                onChange={onDateChange}
            />
           )}
      */}

      <FlatList
        data={filteredOrders}
        keyExtractor={(i) => i.id}
        renderItem={OrderCard}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
        ListEmptyComponent={() => (
          <View style={styles.centered}>
             <Image source={{ uri: 'https://cdn.divineshop.vn/static/4e0db8ffb1e967528da41fac2dddf52a.svg' }} style={{width: 120, height: 120, opacity: 0.8}} />
            <Text style={{ color: MUTED, fontSize: 16, marginTop: 16 }}>Không tìm thấy đơn hàng phù hợp</Text>
          </View>
        )}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
        }
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
    container: { flex: 1, backgroundColor: BACKGROUND },
    centered: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 50 },
    header: {
      height: 60,
      paddingHorizontal: 16,
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
      backgroundColor: "#fff",
      borderBottomWidth: 1,
      borderBottomColor: BORDER_COLOR,
    },
    headerTitle: { fontSize: 20, fontWeight: "bold", color: TEXT_COLOR },
    tabsContainer: {
      flexDirection: 'row',
      backgroundColor: '#fff',
    },
    tab: {
      flex: 1,
      paddingVertical: 14,
      alignItems: 'center',
      justifyContent: 'center',
      borderBottomWidth: 3,
      borderBottomColor: 'transparent',
    },
    tabActive: {
      borderBottomColor: PRIMARY,
    },
    tabText: {
      fontSize: 15,
      color: MUTED,
      fontWeight: '500',
    },
    tabTextActive: {
      color: TEXT_COLOR,
      fontWeight: 'bold',
    },
    dateFilterContainer: {
        flexDirection: 'row',
        padding: 12,
        backgroundColor: '#fff',
        borderBottomWidth: 1,
        borderBottomColor: BORDER_COLOR,
        alignItems: 'center',
        justifyContent: 'space-around',
    },
    datePickerButton: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: BACKGROUND,
        paddingHorizontal: 12,
        paddingVertical: 10,
        borderRadius: 8,
        marginHorizontal: 4,
        borderWidth: 1,
        borderColor: BORDER_COLOR
    },
    datePickerText: {
        marginLeft: 8,
        fontSize: 14,
        color: MUTED,
    },
    clearButton: {
        padding: 8,
    },
    card: {
      backgroundColor: "#fff",
      borderRadius: 12,
      padding: 16,
      marginBottom: 16,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
    },
    cardHeader: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
    },
    orderId: { fontSize: 15, fontWeight: "bold", color: TEXT_COLOR },
    status: {
      fontSize: 12,
      fontWeight: 'bold',
      paddingVertical: 4,
      paddingHorizontal: 8,
      borderRadius: 6,
      overflow: "hidden",
    },
    statusDelivered: { color: '#2E7D32', backgroundColor: '#E8F5E9' },
    statusShipping: { color: '#1565C0', backgroundColor: '#E3F2FD' },
    statusCancelled: { color: '#D32F2F', backgroundColor: '#FFEBEE' },
    statusPending: { color: '#E65100', backgroundColor: '#FFF3E0' },
    divider: { height: 1, backgroundColor: BORDER_COLOR, marginVertical: 12 },
    productRow: { flexDirection: "row", alignItems: "flex-start", paddingVertical: 8 },
    thumb: { width: 64, height: 64, borderRadius: 8, backgroundColor: "#eee" },
    productTitle: { fontSize: 15, fontWeight: "600", color: TEXT_COLOR, marginBottom: 4 },
    variant: { color: MUTED, fontSize: 13 },
    rowBetween: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 8,
    },
    qty: { color: MUTED, fontSize: 14 },
    price: { fontSize: 15, fontWeight: "bold", color: TEXT_COLOR },
    cardFooter: {
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      paddingTop: 6,
    },
    totalLabel: { fontSize: 14, color: MUTED },
    totalValue: { fontSize: 16, fontWeight: "500", color: MUTED },
    actionRow: {
      flexDirection: 'row',
      justifyContent: 'flex-end',
      marginTop: 16,
      paddingTop: 16,
      borderTopWidth: 1,
      borderTopColor: BORDER_COLOR
    },
    actionButton: {
      paddingVertical: 10,
      paddingHorizontal: 18,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: MUTED,
      marginLeft: 10,
    },
    actionButtonText: {
      color: MUTED,
      fontWeight: "600",
      fontSize: 14,
    },
    primaryButton: {
      backgroundColor: PRIMARY,
      borderColor: PRIMARY,
    },
    primaryButtonText: { color: TEXT_COLOR, fontWeight: "bold", fontSize: 14 },
  });