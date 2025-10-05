import React from 'react';
import { ImageBackground, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const HeroSlide = () => {
  return (
    <View style={styles.container}>
      <ImageBackground
        source={{ uri: 'https://m.yodycdn.com/blog/stories-nguoi-phuc-vu0-yody-vn.jpg' }}
        style={styles.background}
        resizeMode="cover"
      >
        {/* <View style={styles.overlay} />
        <Text style={styles.title}>CÂU CHUYỆN YODY</Text>
        <Text style={styles.subtitle}>
          Mang sản phẩm thời trang Việt có chất liệu tốt, dịch vụ tốt đến tận tay khách hàng.
        </Text> */}
        <TouchableOpacity style={styles.button}>
          <Text style={styles.buttonText}>TÌM HIỂU THÊM</Text>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
    marginBottom: 16
  },
  background: {
    height: 350,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.4)',
  },
  title: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  subtitle: {
    color: '#fff',
    fontSize: 14,
    textAlign: 'center',
    marginTop: 12,
    lineHeight: 20,
  },
  button: {
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fff',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default HeroSlide;