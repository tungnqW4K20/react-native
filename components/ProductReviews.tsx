import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Alert,
    FlatList,
    Image,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Kiểu dữ liệu cho 1 bình luận ---
interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  date: string;
}

// --- Props cho component ---
interface ProductReviewsProps {
  productId: number;
}

// --- Giả lập API ---
const FAKE_REVIEWS: Review[] = [
  {
    id: "1",
    authorName: "Nguyễn Thu Trang",
    authorAvatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    rating: 5,
    comment: "Chất vải polo rất đẹp, mặc mát và đứng form. Giao hàng nhanh!",
    date: "20/08/2025",
  },
  {
    id: "2",
    authorName: "Trần Minh Hoàng",
    authorAvatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026705d",
    rating: 4,
    comment: "Áo phông mặc thoải mái, co giãn tốt. Màu sắc đúng như trên web.",
    date: "18/08/2025",
  },
];

const fetchReviewsAPI = (productId: number): Promise<Review[]> => {
  return new Promise(resolve => setTimeout(() => resolve([...FAKE_REVIEWS]), 1200));
};

const submitReviewAPI = (reviewData: Omit<Review, 'id' | 'date'>): Promise<Review> => {
  const newReview: Review = {
    ...reviewData,
    id: Math.random().toString(36).substr(2, 9),
    date: new Date().toLocaleDateString('vi-VN'),
  };
  return new Promise(resolve => setTimeout(() => resolve(newReview), 800));
};

// --- Component hiển thị sao ---
const StarRating = ({ rating, size = 18 }: { rating: number; size?: number }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map(star => (
      <Icon
        key={star}
        name={star <= rating ? "star" : "star-outline"}
        size={size}
        color="#FCB800"
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

// --- Component chính ---
const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  const [newComment, setNewComment] = useState<string>('');
  const [newRating, setNewRating] = useState<number>(0);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const fetched = await fetchReviewsAPI(productId);
        setReviews(fetched);
      } catch {
        Alert.alert("Lỗi", "Không thể tải bình luận");
      } finally {
        setIsLoading(false);
      }
    };
    loadReviews();
  }, [productId]);

  const handleSubmitReview = async () => {
    if (newRating === 0) {
      Alert.alert("Thiếu thông tin", "Vui lòng chọn số sao.");
      return;
    }
    if (!newComment.trim()) {
      Alert.alert("Thiếu thông tin", "Vui lòng nhập nội dung đánh giá.");
      return;
    }
    try {
      setIsSubmitting(true);
      const review = await submitReviewAPI({
        authorName: "Khách hàng",
        authorAvatarUrl: "https://i.pravatar.cc/150?u=a042581f4e29026707d",
        rating: newRating,
        comment: newComment,
      });
      setReviews(prev => [review, ...prev]);
      setNewComment('');
      setNewRating(0);
    } catch {
      Alert.alert("Lỗi", "Không thể gửi bình luận.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: item.authorAvatarUrl }} style={styles.avatar} />
      <View style={{ flex: 1 }}>
        <View style={styles.reviewHeader}>
          <Text style={styles.author}>{item.authorName}</Text>
          <Text style={styles.date}>{item.date}</Text>
        </View>
        <StarRating rating={item.rating} />
        <Text style={styles.comment}>{item.comment}</Text>
      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FCB800" />
        <Text style={styles.loadingText}>Đang tải đánh giá...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>Đánh giá sản phẩm</Text>

      {/* Form nhập bình luận */}
      <View style={styles.form}>
        <Text style={styles.formLabel}>Chia sẻ trải nghiệm của bạn</Text>
        <View style={styles.starInput}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setNewRating(star)}>
              <Icon
                name={star <= newRating ? "star" : "star-outline"}
                size={28}
                color="#FCB800"
                style={{ marginRight: 6 }}
              />
            </TouchableOpacity>
          ))}
        </View>
        <TextInput
          style={styles.input}
          placeholder="Viết đánh giá của bạn..."
          multiline
          value={newComment}
          onChangeText={setNewComment}
        />
        <TouchableOpacity
          style={[styles.submitBtn, isSubmitting && { backgroundColor: "#FFD166" }]}
          onPress={handleSubmitReview}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.submitText}>Gửi đánh giá</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Danh sách bình luận */}
      <FlatList
        data={reviews}
        keyExtractor={item => item.id}
        renderItem={renderReviewItem}
        ListEmptyComponent={<Text style={styles.emptyText}>Chưa có đánh giá nào</Text>}
      />
    </View>
  );
};

export default ProductReviews;

// --- Styles ---
const YELLOW = "#FCB800";
const BLACK = "#111";
const GRAY = "#666";
const BORDER = "#E0E0E0";

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#fff", padding: 16 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadingText: { marginTop: 8, fontSize: 14, color: GRAY },
  mainTitle: { fontSize: 20, fontWeight: "bold", color: BLACK, marginBottom: 16 },

  // Form
  form: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 12,
    padding: 14,
    marginBottom: 20,
    backgroundColor: "#fafafa",
  },
  formLabel: { fontSize: 15, fontWeight: "600", color: BLACK, marginBottom: 8 },
  starInput: { flexDirection: "row", marginBottom: 10 },
  input: {
    borderWidth: 1,
    borderColor: BORDER,
    borderRadius: 8,
    padding: 10,
    height: 90,
    textAlignVertical: "top",
    fontSize: 14,
    marginBottom: 12,
    backgroundColor: "#fff",
  },
  submitBtn: {
    backgroundColor: YELLOW,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  submitText: { color: BLACK, fontSize: 15, fontWeight: "bold" },

  // Review item
  reviewCard: {
    flexDirection: "row",
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  avatar: { width: 42, height: 42, borderRadius: 21, marginRight: 12 },
  reviewHeader: { flexDirection: "row", justifyContent: "space-between", marginBottom: 4 },
  author: { fontSize: 14, fontWeight: "bold", color: BLACK },
  date: { fontSize: 12, color: "#999" },
  starContainer: { flexDirection: "row", marginBottom: 4 },
  comment: { fontSize: 14, color: GRAY, lineHeight: 20 },
  emptyText: { textAlign: "center", color: "#999", marginTop: 16 },
});
