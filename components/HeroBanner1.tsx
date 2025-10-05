import React from 'react';
import { Image, StyleSheet, TouchableOpacity, View } from 'react-native';

const HeroBanner1 = () => {
  return (
    <View style={styles.container}>
      <TouchableOpacity style={styles.card}>
        <Image 
          source={{ uri: 'https://buggy.yodycdn.com/images/raw/8ec9c41350fb00545aa7e9c86269fc24.jpeg' }} 
          style={styles.image} 
        />
        {/* <View style={styles.overlay}>
          <Text style={styles.title}>POLO YODY</Text>
          <Text style={styles.subtitle}>Thoải mái & Lịch lãm</Text>
        </View> */}
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginTop: 8,
    paddingHorizontal: 16,
  },
  card: {
    height: 200,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: '100%',
    height: '100%',
    position: 'absolute',
  },
  overlay: {
    backgroundColor: 'rgba(0,0,0,0.3)',
    width: '100%',
    height: '100%',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    textTransform: 'uppercase',
  },
  subtitle: {
    fontSize: 16,
    color: '#fff',
    marginTop: 4,
  },
});

export default HeroBanner1;