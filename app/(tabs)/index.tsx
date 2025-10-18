import React from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import 'setimmediate';


import CardSlider from '@/components/CardSlider';
import FeaturedCollections from '@/components/FeaturedCollections';
import Footer from '@/components/Footer';
import Header from '@/components/Header';
import HeroBanner from '@/components/HeroBanner';
import HeroBanner1 from '@/components/HeroBanner1';
import HeroBanner2 from '@/components/HeroBanner2';
import HeroSlide from '@/components/HeroSlide';

const HomeScreen = () => {

  return (
    <View style={styles.container}>
      <Header />
      <ScrollView
        showsVerticalScrollIndicator={false}
        style={styles.scrollView}
        contentContainerStyle={styles.contentContainer}
      >
        <HeroBanner />
        <CardSlider />
        <HeroBanner1 />
        <HeroBanner2 />
        <FeaturedCollections />
        <HeroSlide />
        <Footer />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  scrollView: {
    backgroundColor: '#F8F9FA', 
  },
  contentContainer: {
    paddingBottom: 20,
  }
});

export default HomeScreen;