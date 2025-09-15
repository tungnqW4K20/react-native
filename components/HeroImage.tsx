import React from 'react';
import { Dimensions, Image, StyleSheet, View } from 'react-native';

const { width } = Dimensions.get('window');

const HeroImage = () => {
  return (
    <View style={styles.container}>
      <Image
        source={{
          uri: 'https://w.ladicdn.com/s700x800/623420914d0f96001229b9e4/khung-tranh-800x1000-copy-2-1-20250731010828-ptf75.jpg',
        }}
        style={styles.image}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width: '100%',
    marginTop: 44,
  },
  image: {
    width: width,     // full chiều ngang màn hình
    height: undefined, 
    aspectRatio: 1,   // giữ tỉ lệ gốc (thay số này theo tỉ lệ ảnh, ví dụ 4/5, 16/9...)
    resizeMode: 'cover',
  },
});

export default HeroImage;
