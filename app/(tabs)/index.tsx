import CardSlider from '@/components/CardSlider';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import HeroBanner1 from '@/components/HeroBanner1';
import HeroBanner2 from '@/components/HeroBanner2';
import HeroSlide from '@/components/HeroSlide';
import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import 'setimmediate';

import { API_URL, DEBUG_MODE } from "@env";


const HomeScreen = () => {


    console.log("API URL:", API_URL);
    console.log("Debug Mode:", DEBUG_MODE);
  const sampleProducts = [
    { 
      id: '1', 
      name: 'Áo thun thể thao Pro Active', 
      price: '199.000đ',
      originalPrice: '249.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/July2023/v2.53.jpg'
    },
    { 
      id: '2', 
      name: 'Quần short nam thể thao 5"', 
      price: '179.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/June2023/new.55.jpg'
    },
    { 
      id: '3', 
      name: 'Áo Polo thể thao Pique', 
      price: '299.000đ',
      originalPrice: '349.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/September2023/polo-the-thao-pique-cool-xanh-reu-2.jpg'
    },
    { 
      id: '4', 
      name: 'Quần dài Kaki Excool', 
      price: '499.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/October2023/quan-dai-kaki-excool-v2-xanh-dam-2.jpg'
    },
    { 
      id: '5', 
      name: 'Combo 3 Quần lót nam Trunk Cotton', 
      price: '199.000đ',
      originalPrice: '249.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/March2024/24.000001.jpg'
    },
    { 
      id: '6', 
      name: 'Áo khoác gió thể thao Essentials 2 lớp', 
      price: '399.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/February2024/Ao-khoac-the-thao-nam-2-lop-xanh-navy-1-copy.jpg'
    },
    { 
      id: '7', 
      name: 'Áo Sơ mi dài tay Cafe-denim', 
      price: '399.000đ',
      originalPrice: '499.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/September2022/ao-so-mi-cafe-xam-xanh-1-1.jpg'
    },
    { 
      id: '8', 
      name: 'Tất thể thao cổ cao', 
      price: '49.000đ',
      image: 'https://media.coolmate.me/cdn-cgi/image/width=672,height=990,quality=85,format=auto/uploads/December2023/v2.12.jpg'
    },
  ];


  return (
    <View style={styles.container}>
      <Header/>
      <ScrollView showsVerticalScrollIndicator={false}>
        <HeroBanner />
        <CardSlider/>
        <HeroBanner1 />
        <HeroBanner2 />
        <FeaturedCollections/>
        <HeroSlide/>
        {/* <CategoryList /> {/* <-- Sử dụng component */}
        {/* <PromotionalBanners/> */}
        {/* <ProductGrid title="Coolmate's Choice" products={sampleProducts} />
        <ProductGrid title="Bán Chạy Nhất" products={sampleProducts.slice(0, 2)} />  */}
        <Footer /> {/* <-- Sử dụng component */}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
});

export default HomeScreen;