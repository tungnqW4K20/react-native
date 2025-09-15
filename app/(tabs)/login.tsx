import { useAuth } from "@/components/AuthContext";
import { Ionicons, MaterialCommunityIcons } from "@expo/vector-icons";
import { router } from "expo-router"; // 👈 Dùng Expo Router thay vì useNavigation
import React, { useState } from "react";
import { Alert, StyleSheet, Text, TextInput, TouchableOpacity, View } from "react-native";

const LoginScreen = () => {
  const { login } = useAuth();

  const [emailOrUsername, setEmailOrUsername] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleLogin = async () => {
    if (!emailOrUsername || !password) {
      Alert.alert("Thông báo", "Vui lòng nhập email và mật khẩu");
      return;
    }
    setLoading(true);
    try {
      await login(emailOrUsername, password);
      Alert.alert("Thành công", "Đăng nhập thành công!");
      // 👉 Điều hướng sang trang chủ /index
      router.push("/shop");
    } catch (err: any) {
      Alert.alert("Lỗi", err.message || "Đăng nhập thất bại");
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      {/* Nút quay lại */}
      <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
        <Ionicons name="arrow-back" size={24} color="#333" />
      </TouchableOpacity>

      {/* Tiêu đề thương hiệu */}
      <Text style={styles.brand}>
        <Text style={styles.brandYO}>YO</Text>
        <Text style={styles.brandDY}>DY</Text>
      </Text>
      <Text style={styles.subtitle}>Thời trang phong cách – Đậm chất bạn</Text>

      {/* Ô nhập email */}
      <View style={styles.inputContainer}>
        <Ionicons name="mail-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Email hoặc Tên đăng nhập"
          placeholderTextColor="#999"
          keyboardType="email-address"
          value={emailOrUsername}
          onChangeText={setEmailOrUsername}
        />
      </View>

      {/* Ô nhập mật khẩu */}
      <View style={styles.inputContainer}>
        <MaterialCommunityIcons name="lock-outline" size={20} color="#999" style={styles.icon} />
        <TextInput
          style={styles.input}
          placeholder="Mật khẩu"
          placeholderTextColor="#999"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
      </View>

      {/* Nút đăng nhập */}
      <TouchableOpacity style={styles.button} onPress={handleLogin} disabled={loading}>
        <Text style={styles.buttonText}>{loading ? "Đang đăng nhập..." : "Đăng nhập"}</Text>
      </TouchableOpacity>

      {/* Đăng ký & Quên mật khẩu */}
      <View style={styles.footer}>
        <TouchableOpacity>
          <Text style={styles.footerText}>Đăng ký tài khoản</Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text style={styles.footerText}>Quên mật khẩu?</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 24,
    justifyContent: "center",
  },
  backButton: {
    position: "absolute",
    top: 50,
    left: 20,
    backgroundColor: "#f1f1f1",
    borderRadius: 20,
    padding: 6,
    zIndex: 10,
  },
  brand: {
    fontSize: 36,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 8,
  },
  brandYO: {
    color: "#007BFF", // xanh dương
  },
  brandDY: {
    color: "#FFB400", // vàng
  },
  subtitle: {
    fontSize: 14,
    textAlign: "center",
    color: "#555",
    marginBottom: 40,
  },
  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: "#f9f9f9",
  },
  icon: {
    marginRight: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    color: "#333",
  },
  button: {
    backgroundColor: "#FFB400",
    paddingVertical: 14,
    borderRadius: 12,
    marginTop: 8,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  buttonText: {
    color: "#fff",
    fontSize: 18,
    textAlign: "center",
    fontWeight: "bold",
  },
  footer: {
    marginTop: 24,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  footerText: {
    fontSize: 14,
    color: "#FFB400",
    fontWeight: "600",
  },
});
