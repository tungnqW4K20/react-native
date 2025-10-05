import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';
import Swiper from 'react-native-swiper';

const { width } = Dimensions.get('window');

const HeroBanner = () => {
  const bannerWidth = width - 32; // Trừ padding 2 bên
  const bannerHeight = bannerWidth / 2; // Tỉ lệ 2:1

  return (
    <View style={styles.container}>
      <Swiper
        style={{ height: bannerHeight }}
        showsButtons={false}
        autoplay
        autoplayTimeout={4}
        dot={<View style={styles.dot} />}
        activeDot={<View style={styles.activeDot} />}
        paginationStyle={styles.pagination}
        loop
      >
        {/* Slide 1 */}
        <View style={[styles.slide, { height: bannerHeight }]}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://mir-s3-cdn-cf.behance.net/projects/404/f30f65214919447.Y3JvcCwxMDgwLDg0NCwwLDExNw.jpg',
            }}
          />
        </View>

        {/* Slide 2 */}
        <View style={[styles.slide, { height: bannerHeight }]}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://lf-tt4b.tiktokcdn.com/obj/i18nblog/tt4b_cms/vi/tipdilz7wysq-3LLDvfAl1QUsvVKMfTMEfL.jpeg',
            }}
          />
        </View>

        {/* Slide 3 */}
        <View style={[styles.slide, { height: bannerHeight }]}>
          <Image
            style={styles.image}
            source={{
              uri: 'https://mir-s3-cdn-cf.behance.net/projects/404/ca683f144849371.Y3JvcCw5OTksNzgyLDAsMTc4.jpg',
            }}
          />
        </View>
      </Swiper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 16,
    marginTop: 8,
    marginBottom: 16,
  },
  slide: {
    borderRadius: 16,
    overflow: 'hidden',
    // backgroundColor: '#f2f2f2',
    elevation: 3, 
    shadowOpacity: 0.15,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  dot: {
    // backgroundColor: 'rgba(255,255,255,0.6)',
    width: 8,
    height: 8,
    borderRadius: 4,
    margin: 3,
  },
  activeDot: {
    backgroundColor: '#007AFF',
    width: 10,
    height: 10,
    borderRadius: 5,
    margin: 3,
  },
  pagination: {
    bottom: 10,
  },
});

export default HeroBanner;
