import Footer from '@/components/Footer';
import Header from '@/components/Header';
import FeaturedProducts from '@/components/ProductCard';
import React from 'react';
import { SafeAreaView, ScrollView, StyleSheet } from 'react-native';

export default function ShopScreen() {
  return (
    
    <SafeAreaView style={styles.container}>
      <ScrollView>
        <Header/>
        <FeaturedProducts />
        <Footer/>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});