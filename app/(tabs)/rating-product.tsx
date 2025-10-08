import { orderService } from "@/services/orderService";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { useEffect, useMemo, useState } from "react";
import {
  ActivityIndicator,
  FlatList,
  Image,
  Keyboard,
  Modal,
  Platform,
  Pressable,
  RefreshControl,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View
} from "react-native";
// Giả sử bạn đã cài đặt và cấu hình thư viện date picker
// import DateTimePicker from '@react-native-community/datetimepicker';
import * as FileSystem from "expo-file-system/legacy";
import * as ImageManipulator from "expo-image-manipulator";

// Để chọn ảnh, bạn cần cài đặt thư viện này:
// import * as ImagePicker from 'expo-image-picker';
import { commentService } from "@/services/commentService";
import * as ImagePicker from 'expo-image-picker';


type Product = {
  id: string;
  title: string;
  variant?: string;
  qty: number;
  price: number;
  image?: string;
  orderId?: string; // Thêm để biết sản phẩm thuộc đơn hàng nào
  purchaseDate?: string; // Thêm ngày mua hàng
};

type OrderStatus = "pending" | "shipping" | "delivered" | "cancelled";

// Thêm một key mới cho tab sản phẩm đã mua
type TabKey = OrderStatus | "delivered";


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
  
  { key: "delivered", label: "Sản phẩm đã mua" }, // Tab mới
];

const mapApiOrderToLocalOrder = (apiOrder: any): Order => {
  console.log("apiOrder", apiOrder)
    const statusMap: { [key: string]: OrderStatus } = {
      "0": "pending",
      "1": "shipping",
      "2": "delivered",
      "3": "cancelled",
    };
    const statusKey = statusMap[apiOrder.orderstatus] || "delivered";
    console.log("statusKey", statusKey)
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
      items: [{
        id: apiOrder?.productId,
        price: 1111,
        qty: 1,
        title: apiOrder?.productName,
        image: apiOrder?.colorImageUrl,
        variant: apiOrder?.colorImageUrl,
        orderId: `YODY${apiOrder.id}`,

      }],
    };
  };

export default function OrderHistoryScreen() {
  const [selectedTab, setSelectedTab] = useState<TabKey>("delivered");
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [refreshing, setRefreshing] = useState(false);
  const router = useRouter();

  // State cho việc lọc ngày
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [datePickerFor, setDatePickerFor] = useState<'start' | 'end'>('start');

  // State cho Modal đánh giá
  const [isReviewModalVisible, setReviewModalVisible] = useState(false);
  const [reviewingProduct, setReviewingProduct] = useState<Product | null>(null);
  const [rating, setRating] = useState(0);
  const [reviewText, setReviewText] = useState("");
  const [reviewImages, setReviewImages] = useState<string[]>([]);


  const fetchOrders = async () => {
    setIsLoading(true);
    try {
      const response = await orderService.getPurchaseCustomer();
      console.log("response", response)
      if (response.success && Array.isArray(response.data)) {
        console.log("hể")
        const mappedOrders = response.data.map(mapApiOrderToLocalOrder);
        console.log("mappedOrders", mappedOrders)
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
    if (selectedTab === 'delivered') return []; // Không lọc đơn hàng cho tab này

    let tempOrders = orders.filter((o) => o.status === selectedTab);
    console.log("tempOrders", tempOrders)
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

  // Tạo danh sách các sản phẩm đã mua từ các đơn hàng đã giao
  const purchasedProducts = useMemo(() => {
    const products: Product[] = [];
    orders.forEach(order => {
      if (order.status === 'delivered') {
        order.items.forEach(item => {
          products.push({
            ...item,
            orderId: order.id,
            purchaseDate: order.createdAt,
          });
        });
      }
    });
    console.log("products", products)
    return products;
  }, [orders]);


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

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(false);
    if (selectedDate) {
        if (datePickerFor === 'start') setStartDate(selectedDate);
        else setEndDate(selectedDate);
    }
  };

  const formatPrice = (v: number) => v.toLocaleString("vi-VN") + "₫";

  // ===== LOGIC CHO REVIEW MODAL =====
  const openReviewModal = (product: Product) => {
    setReviewingProduct(product);
    setRating(0);
    setReviewText("");
    setReviewImages([]);
    setReviewModalVisible(true);
  };

  // const pickImage = async () => {
  //   // Cần quyền truy cập thư viện ảnh
  //   let result = await ImagePicker.launchImageLibraryAsync({
  //     mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //     allowsMultipleSelection: true,
  //     quality: 1,
  //   });
  //   if (!result.canceled) {
  //     setReviewImages(prev => [...prev, ...result.assets.map(a => a.uri)]);
  //   }

  //   // Giả lập chọn ảnh
  //   const fakeUri = `https://picsum.photos/200/300?random=${Math.random()}`;
  //   if (reviewImages.length < 5) {
  //       setReviewImages(prev => [...prev, fakeUri]);
  //   } else {
  //       alert("Bạn chỉ có thể tải lên tối đa 5 ảnh.");
  //   }
  // };

  const handleRemoveImage = (uri: string) => {
    setReviewImages(prev => prev.filter(imageUri => imageUri !== uri));
  }

const submitReview = async () => {

  const payload = {
    product_id: reviewingProduct?.id,
    rating,
    content: reviewText,
    image_urls: reviewImages,
  };

  const data = await commentService.createComment(payload)
  // const response = await fetch("http://localhost:3000/api/comments", {
  //   method: "POST",
  //   headers: {
  //     "Content-Type": "application/json",
  //     Authorization: `Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MSwiZW1haWwiOiJhLm5ndXllbkBleGFtcGxlLmNvbSIsInVzZXJuYW1lIjoibmd1eWVudmFuYSIsInJvbGUiOiJjdXN0b21lciIsImlhdCI6MTc1OTUwMjk2NSwiZXhwIjoxNzU5NTg5MzY1fQ.MocZH0NEBput04Y3cNC7n8s2UGobn3KH9oLIQUcn2OY`,
  //   },
  //   body: JSON.stringify(payload),
  // });

  // const data = await response.json();
  console.log("Review thành công:", data);
   setReviewModalVisible(false)
    setReviewingProduct(null)
};
  // ===== RENDER FUNCTIONS =====

  const renderProductItem = (p: Product , index: number) => (
    <View key={`${p.id}-${index}`} style={styles.productRow}>
      <Image source={{ uri: p.image }} style={styles.thumb} />
      <View style={{ flex: 1, marginLeft: 12 }}>
        <Text numberOfLines={2} style={styles.productTitle}>
          {p.title}
        </Text>
       
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
      {item.items.map((p, index) => renderProductItem(p, index))}
      {/* <View style={styles.divider} /> */}
     
       <View style={styles.actionRow}>
        {/* {item.status === 'delivered' && (
          <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => console.log("Mua lại", item.id)}>
            <Text style={styles.primaryButtonText}>Mua lại</Text>
          </Pressable>
        )} */}
        {item.status === 'pending' && (
          <>
            <Pressable style={styles.actionButton} onPress={async () => {/* ... */}}>
              <Text style={styles.actionButtonText}>Hủy đơn</Text>
            </Pressable>
            <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => console.log("Thanh toán", item.id)}>
              <Text style={styles.primaryButtonText}>Thanh toán ngay</Text>
            </Pressable>
          </>
        )}
        {item.status === 'cancelled' && (
        <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={async () => {/* ... */}}>
          <Text style={styles.primaryButtonText}>Mua lại</Text>
        </Pressable>
        )}
      </View>
    </View>
  );
  
  // Component mới để hiển thị sản phẩm đã mua
  const PurchasedProductCard = ({ item }: { item: Product }) => (
    <View style={styles.card}>
      {renderProductItem(item)}
      <View style={styles.divider} />
      <View style={styles.actionRow}>
        <Pressable style={[styles.actionButton, styles.primaryButton]} onPress={() => openReviewModal(item)}>
            <Text style={styles.primaryButtonText}>Viết đánh giá</Text>
          </Pressable>
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

  const renderReviewModal = () => (
    <Modal
        animationType="slide"
        transparent={true}
        visible={isReviewModalVisible}
        onRequestClose={() => setReviewModalVisible(false)}
    >
        {/* <Pressable style={styles.modalBackdrop} onPress={() => setReviewModalVisible(false)}/> */}
          <TouchableWithoutFeedback onPress={Keyboard.dismiss}>

        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Đánh giá sản phẩm</Text>
            <TouchableOpacity onPress={() => setReviewModalVisible(false)}>
              <Ionicons name="close-circle" size={28} color={MUTED} />
            </TouchableOpacity>
          </View>
          
          {reviewingProduct && (
            <View style={styles.productRow}>
              <Image source={{ uri: reviewingProduct.image }} style={styles.thumb} />
              <View style={{ flex: 1, marginLeft: 12 }}>
                <Text numberOfLines={2} style={styles.productTitle}>
                  {reviewingProduct.title}
                </Text>
              </View>
            </View>
          )}

          <View style={styles.divider} />

     
          <Text style={styles.reviewLabel}>Viết nhận xét:</Text>
          <TextInput
              style={styles.reviewInput}
              multiline
              placeholder="Sản phẩm này có tốt không? Bạn có thích nó không? Hãy chia sẻ cảm nhận của bạn nhé."
              value={reviewText}
              onChangeText={setReviewText}
          />

          <Text style={styles.reviewLabel}>Thêm hình ảnh (tối đa 5):</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexGrow: 1}}>
            <View style={styles.imagePickerRow}>
              {reviewImages.map((uri) => (
                <View key={uri} style={styles.thumbnailContainer}>
                    <Image source={{ uri }} style={styles.thumbnail} />
                    <TouchableOpacity style={styles.removeImageButton} onPress={() => handleRemoveImage(uri)}>
                        <Ionicons name="close-circle" size={24} color="#D32F2F" />
                    </TouchableOpacity>
                </View>
              ))}
            {reviewImages.length < 5 && (
              <TouchableOpacity style={styles.addImageButton} onPress={pickImage}>
                <Ionicons name="camera-outline" size={24} color={MUTED} />
                <Text style={styles.addImageText}>Thêm ảnh</Text>
              </TouchableOpacity>
            )}
            </View>
          </ScrollView>
          

          <TouchableOpacity style={styles.submitButton} onPress={submitReview}>
            <Text style={styles.submitButtonText}>Gửi đánh giá</Text>
          </TouchableOpacity>
        </View>
          </TouchableWithoutFeedback>

    </Modal>
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

  const pickImage = async () => {
  // Xin quyền truy cập thư viện ảnh
  const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
  if (status !== 'granted') {
    alert('Ứng dụng cần quyền truy cập thư viện ảnh để chọn hình.');
    return;
  }

  // let result = await ImagePicker.launchImageLibraryAsync({
  //   mediaTypes: ImagePicker.MediaTypeOptions.Images,
  //   // mediaTypes: [ImagePicker.MediaType.image],
  //   allowsMultipleSelection: true, 
  //   quality: 1,
  // });

  const result = await ImagePicker.launchImageLibraryAsync({
  mediaTypes: ImagePicker.MediaTypeOptions.Images, // ⚠️ vẫn dùng tạm thời
  allowsMultipleSelection: true,
  quality: 1,
});


  if (!result.canceled && result.assets?.length > 0) {
  const uploadedUrls = await Promise.all(
    result.assets.map(async (asset) => {
      const image_url = await uploadImageToServer(asset.uri);
      return image_url;
    })
  );
  setReviewImages((prev) => [...prev, ...uploadedUrls]);
};
}

// const uploadImageToServer = async (uri: string) => {
//   // Chuyển uri thành blob
//   const res = await fetch(uri);
//   const blob = await res.blob();

//   const formData = new FormData();
//   formData.append("productImage", blob, `review_${Date.now()}.jpg`);

//   const response = await fetch("http://localhost:3000/api/uploads/product-image", {
//     method: "POST",
//     body: formData,
//     headers: { Accept: "application/json" },
//   });

//   const data = await response.json();
//   return data?.data?.imageUrl;
// };

/// NEW
// const uploadImageToServer = async (uri: string) => {
//   const res = await fetch(uri)
//   const blob = await res.blob()

//   const formData = new FormData()
//   formData.append("productImage", blob, `review_${Date.now()}.jpg`)

//   const response = await api.post("/uploads/product-image", formData, {
//     headers: { "Content-Type": "multipart/form-data" },
//   })

//   return response.data?.data?.imageUrl
// }

// const uploadImageToServer = async (uri: string) => {
//   try {
//     let realUri = uri;
//     console.log("uri", uri)
//     // ✅ Fix cho iPhone: convert ph:// → file:// để fetch() đọc được
//     if (Platform.OS === "ios" && uri.startsWith("ph://")) {
//       const manipulated = await ImageManipulator.manipulateAsync(
//         uri,
//         [],
//         {
//           compress: 1, // giữ nguyên chất lượng
//           format: ImageManipulator.SaveFormat.JPEG, // lưu file thật
//         }
//       );
//       realUri = manipulated.uri;
//     }

//     // ✅ Fetch ảnh thành blob
//     const res = await fetch(realUri);
//     const blob = await res.blob();

//     // ✅ Kiểm tra blob rỗng
//     if (!blob || blob.size === 0) {
//       throw new Error("Ảnh trống hoặc không thể đọc blob (Empty file).");
//     }

//     // ✅ Chuẩn bị FormData gửi lên backend
//     const formData = new FormData();
//     formData.append("productImage", blob, `review_${Date.now()}.jpg`);

//     // ✅ Gửi request POST như cũ
//     const response = await api.post("/uploads/product-image", formData, {
//       headers: { "Content-Type": "multipart/form-data" },
//     });

//     // ✅ Trả về link ảnh
//     return response.data?.data?.imageUrl;
//   } catch (error) {
//     console.error("❌ Lỗi khi upload ảnh:", error);
//     throw error;
//   }
// };

// const uploadImageToServer = async (uri: string) => {
//   try {
//     let realUri = uri;
//     if (Platform.OS === "ios" && uri.startsWith("ph://")) {
//       const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
//         compress: 1,
//         format: ImageManipulator.SaveFormat.JPEG,
//       });
//       realUri = manipulated.uri;
//     }

//     const res = await fetch(realUri);
//     const blob = await res.blob();

//     if (!blob || blob.size === 0) {
//       throw new Error("Ảnh trống hoặc không thể đọc blob (Empty file).");
//     }

//     const formData = new FormData();
//     formData.append("productImage", blob, `review_${Date.now()}.jpg`);

//     // ✅ Dùng fetch thay vì axios
//     const response = await fetch("https://benodejs-9.onrender.com/api/uploads/product-image", {
//       method: "POST",
//       body: formData,
//       headers: {
//         Accept: "application/json",
//       },
//     });

//     const data = await response.json();
//     console.log("✅ Upload success:", data);
//     return data?.data?.imageUrl;
//   } catch (error) {
//     console.error("❌ Lỗi khi upload ảnh:", error);
//     throw error;
//   }
// };

const uploadImageToServer = async (uri: string) => {
  try {
    let realUri = uri;

    // Fix iOS: chuyển từ ph:// sang file:// bằng expo-image-manipulator
    if (Platform.OS === "ios" && uri.startsWith("ph://")) {
      const manipulated = await ImageManipulator.manipulateAsync(uri, [], {
        compress: 1,
        format: ImageManipulator.SaveFormat.JPEG,
      });
      realUri = manipulated.uri;
    }

    // ✅ Đọc file thành base64
    const base64Data = await FileSystem.readAsStringAsync(realUri, {
      encoding: "base64",
    });

    const formData = new FormData();
    formData.append("productImage", {
      uri: realUri,
      name: `review_${Date.now()}.jpg`,
      type: "image/jpeg",
    } as any);

    // ✅ Gửi request bằng fetch
    const response = await fetch("https://benodejs-9.onrender.com/api/uploads/product-image", {
      method: "POST",
      body: formData,
      headers: {
        Accept: "application/json",
      },
    });

    const data = await response.json();
    console.log("✅ Upload response:", data);
    if (data?.success === false) throw new Error(data?.message || "Upload failed");
    return data?.data?.imageUrl;
  } catch (error) {
    console.error("❌ Lỗi khi upload ảnh:", error);
    throw error;
  }
};
  return (
    <SafeAreaView style={styles.container}>
      {renderHeader()}
      <View style={styles.tabsContainer}>
        {TABS.map((t) => (
          <Pressable
            key={t.key}
            onPress={() => setSelectedTab(t.key as TabKey)}
            style={[styles.tab, selectedTab === t.key && styles.tabActive]}
          >
            <Text style={[styles.tabText, selectedTab === t.key && styles.tabTextActive]}>
              {t.label}
            </Text>
          </Pressable>
        ))}
      </View>
      
      {selectedTab !== 'delivered' && renderDateFilter()}

      {selectedTab === 'delivered' ? (
  <FlatList<Product>
    data={purchasedProducts}
    keyExtractor={(item, index) => `${item.orderId || 'noOrder'}-${item.id}-${index}`}

    renderItem={({ item }) => <PurchasedProductCard item={item} />}
    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
    ListEmptyComponent={() => (
      <View style={styles.centered}>
        <Image
          source={{
            uri: 'https://cdn.divineshop.vn/static/4e0db8ffb1e967528da41fac2dddf52a.svg',
          }}
          style={{ width: 120, height: 120, opacity: 0.8 }}
        />
        <Text style={{ color: MUTED, fontSize: 16, marginTop: 16 }}>
          Bạn chưa có sản phẩm nào đã mua
        </Text>
      </View>
    )}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
    }
  />
) : (
  <FlatList<Order>
    data={filteredOrders}
    keyExtractor={(item, index) => `order-${item.id}-${index}`}

    renderItem={({ item }) => <OrderCard item={item} />}
    contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 16 }}
    ListEmptyComponent={() => (
      <View style={styles.centered}>
        <Image
          source={{
            uri: 'https://cdn.divineshop.vn/static/4e0db8ffb1e967528da41fac2dddf52a.svg',
          }}
          style={{ width: 120, height: 120, opacity: 0.8 }}
        />
        <Text style={{ color: MUTED, fontSize: 16, marginTop: 16 }}>
          Không tìm thấy đơn hàng phù hợp
        </Text>
      </View>
    )}
    refreshControl={
      <RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={PRIMARY} />
    }
  />
)}
      {renderReviewModal()}
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
      fontSize: 14, // Giảm cỡ chữ cho vừa
      color: MUTED,
      fontWeight: '500',
      textAlign: 'center'
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
    // Styles for Review Modal
    modalBackdrop: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)',
    },
    modalContainer: {
      position: 'absolute',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#fff',
      borderTopLeftRadius: 20,
      borderTopRightRadius: 20,
      padding: 20,
      paddingBottom: 40,
    },
    modalHeader: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 16,
    },
    modalTitle: {
      fontSize: 20,
      fontWeight: 'bold',
      color: TEXT_COLOR,
    },
    reviewLabel: {
      fontSize: 16,
      fontWeight: '600',
      color: TEXT_COLOR,
      marginTop: 16,
      marginBottom: 8,
    },
    starContainer: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      marginBottom: 16,
    },
    reviewInput: {
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      borderRadius: 8,
      padding: 12,
      height: 100,
      textAlignVertical: 'top',
      fontSize: 15,
      color: TEXT_COLOR,
    },
    imagePickerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 8,
    },
    addImageButton: {
      width: 80,
      height: 80,
      borderRadius: 8,
      borderWidth: 1,
      borderColor: BORDER_COLOR,
      borderStyle: 'dashed',
      justifyContent: 'center',
      alignItems: 'center',
      marginRight: 10,
    },
    addImageText: {
        fontSize: 12,
        color: MUTED,
        marginTop: 4,
    },
    thumbnailContainer: {
        position: 'relative',
        marginRight: 10,
    },
    thumbnail: {
      width: 80,
      height: 80,
      borderRadius: 8,
    },
    removeImageButton: {
        position: 'absolute',
        top: -8,
        right: -8,
        backgroundColor: '#fff',
        borderRadius: 12,
    },
    submitButton: {
      backgroundColor: PRIMARY,
      padding: 16,
      borderRadius: 12,
      alignItems: 'center',
      marginTop: 24,
    },
    submitButtonText: {
      color: TEXT_COLOR,
      fontSize: 16,
      fontWeight: 'bold',
    },
  });