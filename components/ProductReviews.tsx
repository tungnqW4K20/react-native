import api from '@/services/api';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  StyleSheet,
  Text,
  View
} from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// 1. Cập nhật interface, thêm image_urls
interface Review {
  id: string;
  authorName: string;
  authorAvatarUrl: string;
  rating: number;
  comment: string;
  date: string;
  image_urls?: string[]; // Thêm dòng này
}

interface ApiComment {
  id: number;
  content: string;
  createdAt: string;
  customer: {
    id: number;
    name: string;
  };
  image_urls: string[];
}

interface ProductReviewsProps {
  productId: number;
}

const fetchReviewsFromApi = async (productId: number): Promise<Review[]> => {
  try {

    const response = await api.get(`/comments/product/${productId}`);

    const result = response.data; 
    if (result.success && Array.isArray(result.data)) {
     return result.data.map((item: ApiComment) => {
        const authorName = item.customer?.name || 'Ẩn danh';
        
        const avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          authorName
        )}&size=150&background=random&color=fff`;

        return {
          id: item.id.toString(),
          authorName: authorName,
          authorAvatarUrl: avatarUrl, // Sử dụng URL vừa tạo
          rating: 5,
          comment: item.content,
          date: new Date(item.createdAt).toLocaleDateString('vi-VN'),
          // 2. Lấy image_urls từ API
          image_urls: item.image_urls || [] // Thêm dòng này
        };
      });
    }
    return [];
  } catch (error) {
    console.error('Lỗi khi tải bình luận từ API:', error);
    throw error;
  }
};

const StarRating = ({ rating, size = 16 }: { rating: number; size?: number }) => (
  <View style={styles.starContainer}>
    {[1, 2, 3, 4, 5].map(star => (
      <Icon
        key={star}
        name={star <= rating ? 'star' : 'star-outline'}
        size={size}
        color="#FDBA44"
        style={{ marginRight: 2 }}
      />
    ))}
  </View>
);

const ProductReviews: React.FC<ProductReviewsProps> = ({ productId }) => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const loadReviews = async () => {
      try {
        setIsLoading(true);
        const fetched = await fetchReviewsFromApi(productId);
        setReviews(fetched);
      } catch {
        Alert.alert('Lỗi', 'Không thể tải bình luận');
      } finally {
        setIsLoading(false);
      }
    };

    if (productId) {
      loadReviews();
    }
  }, [productId]);

  // 3. Cập nhật hàm render để hiển thị ảnh
  const renderReviewItem = (item: Review) => (
    <View style={styles.reviewCard}>
      <Image source={{ uri: item.authorAvatarUrl }} style={styles.avatar} />
      <View style={styles.reviewContent}>
        <Text style={styles.author}>{item.authorName}</Text>
        {/* <StarRating rating={item.rating} /> */}
        <Text style={styles.date}>{item.date}</Text>
        <Text style={styles.comment}>{item.comment}</Text>

        {/* --- PHẦN THÊM MỚI ĐỂ HIỂN THỊ ẢNH --- */}
        {item.image_urls && item.image_urls.length > 0 && (
          <View style={styles.imageContainer}>
            {item.image_urls.map((url, index) => (
              <Image
                key={index}
                source={{ uri: url }}
                style={styles.reviewImage}
              />
            ))}
          </View>
        )}
        {/* --- KẾT THÚC PHẦN THÊM MỚI --- */}

      </View>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#FDBA44" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.mainTitle}>ĐÁNH GIÁ SẢN PHẨM</Text>
      {reviews.length > 0 ? (
        reviews.map(item => <View key={item.id}>{renderReviewItem(item)}</View>)
      ) : (
        <View style={styles.emptyContainer}>
            {/* @ts-ignore */}
            <Icon name="chatbox-outline" size={40} color="#BDBDBD"/>
            <Text style={styles.emptyText}>Chưa có đánh giá nào</Text>
        </View>
      )}
    </View>
  );
};

export default ProductReviews;

const PRIMARY_YODY = '#FDBA44';
const TEXT_COLOR = '#222222';
const MUTED_COLOR = '#757575';
const BORDER_COLOR = '#EEEEEE';
const BACKGROUND_COLOR = '#FFFFFF';

const styles = StyleSheet.create({
  container: {
    backgroundColor: BACKGROUND_COLOR,
    paddingVertical: 16,
    marginTop: 8,
  },
  centered: {
    padding: 32,
    justifyContent: 'center',
    alignItems: 'center'
  },
  mainTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: TEXT_COLOR,
    marginBottom: 16,
    paddingHorizontal: 16,
  },
  reviewCard: {
    flexDirection: 'row',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: BORDER_COLOR,
  },
  avatar: {
    width: 36,
    height: 36,
    borderRadius: 18,
    marginRight: 12,
  },
  reviewContent: {
    flex: 1,
  },
  author: {
    fontSize: 14,
    fontWeight: '500',
    color: TEXT_COLOR,
  },
  starContainer: {
    flexDirection: 'row',
    marginVertical: 6,
  },
  date: {
    fontSize: 12,
    color: MUTED_COLOR,
    marginBottom: 8,
  },
  comment: {
    fontSize: 14,
    color: TEXT_COLOR,
    lineHeight: 21,
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 40,
  },
  emptyText: {
    textAlign: 'center',
    color: MUTED_COLOR,
    marginTop: 8,
    fontSize: 15,
  },
  // 4. Thêm styles cho phần hiển thị ảnh
  imageContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: 12,
  },
  reviewImage: {
    width: 70,
    height: 70,
    borderRadius: 8,
    marginRight: 8,
    marginBottom: 8,
    backgroundColor: BORDER_COLOR, // Màu nền tạm thời khi ảnh đang tải
  },
});