import { ResizeMode, Video } from 'expo-av'; // 1. Import từ expo-av
import React from 'react';
import { Dimensions, StyleSheet, View } from 'react-native';

const { width, height } = Dimensions.get('window');

const HeroBanner2 = () => {
  return (
    <View style={styles.container}>
      {/* Video nền */}
      <Video
        source={{ uri: 'https://buggy.yodycdn.com/videos/raw/b934c986f8b1125c6f674651f270b5e3.mp4' }}
        style={styles.video}
        resizeMode={ResizeMode.COVER} // 2. Thay đổi giá trị resizeMode
        isLooping // 3. Thay 'repeat' bằng 'isLooping'
        isMuted // 4. Thay 'muted' bằng 'isMuted'
        shouldPlay // 5. Thay 'paused={false}' bằng 'shouldPlay'
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    width,
    height: 800,
    position: 'relative',
  },
  video: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
  },
});

export default HeroBanner2;