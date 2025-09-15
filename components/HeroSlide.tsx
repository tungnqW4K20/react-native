import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

// Tỷ lệ khung hình của ảnh gốc (chiều cao / chiều rộng)
// Ảnh gốc là 720x1280, vậy tỷ lệ là 1280 / 720 = 1.7777...
const BANNER_ASPECT_RATIO = 1280 / 720; 

const HeroBanner = () => {
  // Chiều rộng của banner luôn bằng chiều rộng màn hình
  const bannerWidth = width;
  // Chiều cao của banner được tính toán dựa trên chiều rộng và tỷ lệ
  const bannerHeight = bannerWidth * BANNER_ASPECT_RATIO;

  return (
    <View style={[styles.container, { height: bannerHeight }]}>
      <Swiper
        style={styles.wrapper}
        showsButtons={false}
        autoplay
        autoplayTimeout={4}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        loop
      >
        <View style={styles.slide}>
          <Image
            style={[styles.image, { width: bannerWidth, height: bannerHeight }]}
            source={{ uri: 'https://buggy.yodycdn.com/images/home-banner-mb/49ca86f322e77d64c3339a21162cdd60.webp?width=720&height=1280' }}
            resizeMode="cover" // Đảm bảo ảnh lấp đầy toàn bộ không gian được cung cấp
          />
        </View>
        <View style={styles.slide}>
          <Image
            style={[styles.image, { width: bannerWidth, height: bannerHeight }]}
            source={{ uri: 'https://buggy.yodycdn.com/images/home-banner-mb/38aa9673d710a112e43f69b159649917.webp?width=720&height=1280' }}
            resizeMode="cover"
          />
        </View>
        <View style={styles.slide}>
          <Image
            style={[styles.image, { width: bannerWidth, height: bannerHeight }]}
            source={{ uri: 'https://buggy.yodycdn.com/images/home-banner-mb/1fa954619ba525b0d40639f62b03110f.webp?width=720&height=1280' }}
            resizeMode="cover"
          />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Chiều cao của container sẽ được thiết lập inline để phản ánh bannerHeight
    // Cần có flex: 1 nếu muốn nó chiếm toàn bộ không gian có sẵn,
    // nhưng ở đây ta đang đặt chiều cao cụ thể.
  },
  wrapper: {}, // Không cần chỉnh sửa wrapper
  slide: {
    flex: 1, // Đảm bảo slide chiếm toàn bộ không gian của Swiper
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    // Chiều rộng và chiều cao của image sẽ được thiết lập inline
  },
  dot: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    marginVertical: 3,
  },
  activeDot: {
    backgroundColor: '#fff',
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 3,
    marginVertical: 3,
  },
});

export default HeroBanner;