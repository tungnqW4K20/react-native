import React from 'react';
import { ImageBackground, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

// Dữ liệu cho hai banner
const bannerData = [
  {
    id: '1',
    title: 'MEN WEAR',
    subtitle: 'Nhập COOLNEW Giảm 30K đơn đầu tiên từ 199k',
    imageUrl: 'https://n7media.coolmate.me/uploads/August2025/m.jpg?aio=w-550', // Thay bằng URL ảnh thật của bạn
  },
  {
    id: '2',
    title: 'WOMEN ACTIVE',
    subtitle: 'Tặng phụ kiện cho đơn từ 399K | Freeship',
    imageUrl: 'https://n7media.coolmate.me/uploads/August2025/wm.jpg?aio=w-550', // Thay bằng URL ảnh thật của bạn
  },
];

// Component con cho dải text chạy "Tự do vươn mình"
const TickerText = () => {
    // Lặp lại text để tạo cảm giác kéo dài
    const text = '✦ Tự do vươn mình  ';
    const repeatedText = Array(5).fill(text).join('');

    return(
        <View style={styles.tickerContainer}>
            <Text style={styles.tickerText}>{repeatedText}</Text>
        </View>
    );
};


const PromotionalBanners = () => {
  return (
    <ScrollView style={styles.container}>
      {bannerData.map((banner) => (
        <View key={banner.id} style={styles.bannerWrapper}>
          <ImageBackground 
            source={{ uri: banner.imageUrl }}
            style={styles.imageBackground}
            imageStyle={{ borderRadius: 12 }} // Áp dụng bo góc cho chính ảnh
          >
            {/* Lớp phủ màu đen mờ để làm nổi bật text */}
            <View style={styles.overlay}>
              <View style={styles.textContainer}>
                <Text style={styles.title}>{banner.title}</Text>
                <Text style={styles.subtitle}>{banner.subtitle}</Text>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>KHÁM PHÁ</Text>
                </TouchableOpacity>
              </View>

               {/* Dải text chạy phía dưới */}
               <TickerText />
            </View>
          </ImageBackground>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
    backgroundColor: '#fff',
  },
  bannerWrapper: {
    height: 250, // Chiều cao của mỗi banner
    marginBottom: 20, // Khoảng cách giữa các banner
    borderRadius: 12,
    // Thêm đổ bóng cho đẹp hơn (tùy chọn)
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    elevation: 5,
  },
  imageBackground: {
    flex: 1,
    justifyContent: 'flex-end', // Đẩy nội dung xuống dưới cùng
    width: '100%',
    height: '100%',
  },
  overlay: {
    // Lớp phủ này sẽ chứa cả text và dải ticker
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.3)', // Màu đen với độ trong suốt 30%
    borderRadius: 12,
    justifyContent: 'space-between', // Đẩy text container lên trên và ticker xuống dưới
  },
  textContainer: {
    padding: 20,
    // Không cần absolute positioning vì đã có justify-content
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 5,
  },
  subtitle: {
    fontSize: 14,
    color: '#fff',
    marginBottom: 15,
  },
  button: {
    backgroundColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 25,
    borderRadius: 25, // Bo tròn nhiều để tạo hình viên thuốc
    alignSelf: 'flex-start', // Chỉ chiếm chiều rộng của nội dung
  },
  buttonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: 'bold',
  },
  tickerContainer: {
    backgroundColor: '#A0522D', // Màu nâu đất
    paddingVertical: 8,
    // Không cần bo góc ở đây vì ImageBackground đã có overflow: 'hidden'
  },
  tickerText: {
    color: '#FFD700', // Màu vàng gold
    fontSize: 12,
    fontWeight: 'bold',
  },
});

export default PromotionalBanners;