import { Ionicons } from "@expo/vector-icons";
import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, View } from "react-native";

import { AuthProvider } from "@/components/AuthContext";
import { useColorScheme } from "@/hooks/useColorScheme";

export default function TabLayout() {
  const colorScheme = useColorScheme();

  return (
    <AuthProvider>
      <Tabs
        screenOptions={{
          tabBarActiveTintColor: "#2A2A86", // xanh đậm Yody
          tabBarInactiveTintColor: "#777", // xám nhẹ
          headerShown: false,
          tabBarStyle: {
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 65,
            backgroundColor: "white",
            borderTopWidth: 0.3,
            borderTopColor: "#ddd",
            elevation: 4,
            zIndex: 12
          },
          tabBarLabelStyle: {
            fontSize: 12,
            fontWeight: "500",
          },
        }}
        initialRouteName="index"
      >
        {/* TAB 1 - SẢN PHẨM */}
        <Tabs.Screen
          name="shop"
          options={{
            title: "Sản phẩm",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="bag-outline" color={color} size={22} />
            ),
          }}
        />

        {/* TAB 2 - GIỎ HÀNG */}
        <Tabs.Screen
          name="cart"
          options={{
            title: "Giỏ hàng",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="cart-outline" color={color} size={22} />
            ),
          }}
        />

        {/* TAB 3 - HOME NỔI GIỮA */}
        <Tabs.Screen
          name="index"
          options={{
            title: "Trang chủ",
            tabBarIcon: ({ focused }) => (
              <View style={styles.homeButton}>
                <Ionicons
                  name="home"
                  size={26}
                  color={focused ? "#2A2A86" : "white"}
                />
              </View>
            ),
          }}
        />

        {/* TAB 4 - CÁ NHÂN */}
        <Tabs.Screen
          name="profile"
          options={{
            title: "Cá nhân",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="person-outline" color={color} size={22} />
            ),
          }}
        />

        {/* TAB 5 - LIÊN HỆ */}
        <Tabs.Screen
          name="contact"
          options={{
            title: "Liên hệ",
            tabBarIcon: ({ color, size }) => (
              <Ionicons name="call-outline" color={color} size={22} />
            ),
          }}
        />

        {/* --- ẨN --- */}
        <Tabs.Screen name="explore" options={{ href: null }} />
        <Tabs.Screen name="login" options={{ href: null }} />
        <Tabs.Screen name="Invoice" options={{ href: null }} />
        <Tabs.Screen name="order-history" options={{ href: null }} />
        <Tabs.Screen name="productdetail/[id]" options={{ href: null }} />
        <Tabs.Screen name="shopbyfind" options={{ href: null }} />
        <Tabs.Screen name="rating-product" options={{ href: null }} /> 
        <Tabs.Screen name="register" options={{ href: null }} /> 
        <Tabs.Screen name="payment-success" options={{ href: null }} />

        
      </Tabs>
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  homeButton: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: "#FFD503", 
    justifyContent: "center",
    alignItems: "center",
    
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 4,
    elevation: 4,
  },
});
