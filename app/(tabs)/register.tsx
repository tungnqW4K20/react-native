import { Ionicons } from '@expo/vector-icons';
import axios from 'axios'; // Bạn cần cài đặt thư viện này: npm install axios
import React, { useState } from 'react';
import {
  ActivityIndicator,
  Alert,
  Image,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';

// --- Bảng màu và Hằng số dựa trên thương hiệu YODY ---
const YODY_PRIMARY = '#FDBA44'; // Màu vàng đặc trưng
const TEXT_PRIMARY = '#222222'; // Màu chữ chính
const TEXT_MUTED = '#888888';   // Màu chữ phụ, placeholder
const BACKGROUND_COLOR = '#FFFFFF';
const INPUT_BACKGROUND = '#F5F5F5';
const BORDER_COLOR = '#EAEAEA';

const API_ENDPOINT = 'https://benodejs-9.onrender.com/api/customers';

export default function RegisterScreen() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [address, setAddress] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleRegister = async () => {
    // 1. Kiểm tra dữ liệu đầu vào (Validation)
    if (!name || !email || !phone || !address || !username || !password || !confirmPassword) {
      Alert.alert('Thông báo', 'Vui lòng điền đầy đủ thông tin.');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Lỗi', 'Mật khẩu xác nhận không khớp.');
      return;
    }
    // (Bạn có thể thêm các validation phức tạp hơn như regex cho email, độ dài mật khẩu,...)

    // 2. Bắt đầu gọi API
    setIsLoading(true);
    try {
      const payload = { name, email, address, username, password, phone };
      const response = await axios.post(API_ENDPOINT, payload);

      // 3. Xử lý kết quả
      if (response.status === 201 || response.status === 200) { // Thường đăng ký thành công sẽ trả về 201
        Alert.alert('Thành công!', 'Tài khoản của bạn đã được tạo thành công.');
        // Ở đây bạn có thể điều hướng người dùng đến trang đăng nhập hoặc trang chủ
        // navigation.navigate('Login');
      } else {
        // Xử lý các trường hợp lỗi khác từ server
        Alert.alert('Lỗi', response.data.message || 'Đã có lỗi xảy ra. Vui lòng thử lại.');
      }
    } catch (error: any) {
      console.error('Lỗi đăng ký:', error.response?.data || error.message);
      Alert.alert('Lỗi', 'Tên đăng nhập hoặc email đã tồn tại. Vui lòng thử lại.');
    } finally {
      // 4. Dừng loading
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* --- Phần Logo và Tiêu đề --- */}
        <Image 
            source={{ uri: 'https://cdn.haitrieu.com/wp-content/uploads/2022/03/Logo-YODY-Y.png' }} 
            style={styles.logo} 
        />
        <Text style={styles.title}>Tạo tài khoản mới</Text>
        <Text style={styles.subtitle}>Cùng YODY trải nghiệm sản phẩm tốt nhất!</Text>

        {/* --- Form đăng ký --- */}
        <View style={styles.form}>
          <View style={styles.inputContainer}>
            <Ionicons name="person-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Họ và tên"
              placeholderTextColor={TEXT_MUTED}
              value={name}
              onChangeText={setName}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="mail-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Email"
              placeholderTextColor={TEXT_MUTED}
              keyboardType="email-address"
              autoCapitalize="none"
              value={email}
              onChangeText={setEmail}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="call-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Số điện thoại"
              placeholderTextColor={TEXT_MUTED}
              keyboardType="phone-pad"
              value={phone}
              onChangeText={setPhone}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="location-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Địa chỉ"
              placeholderTextColor={TEXT_MUTED}
              value={address}
              onChangeText={setAddress}
            />
          </View>
          
          <View style={styles.inputContainer}>
            <Ionicons name="at-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Tên đăng nhập"
              placeholderTextColor={TEXT_MUTED}
              autoCapitalize="none"
              value={username}
              onChangeText={setUsername}
            />
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Mật khẩu"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry={!isPasswordVisible}
              value={password}
              onChangeText={setPassword}
            />
            <TouchableOpacity onPress={() => setIsPasswordVisible(!isPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={isPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>

          <View style={styles.inputContainer}>
            <Ionicons name="lock-closed-outline" size={22} color={TEXT_MUTED} style={styles.inputIcon} />
            <TextInput
              style={styles.input}
              placeholder="Xác nhận mật khẩu"
              placeholderTextColor={TEXT_MUTED}
              secureTextEntry={!isConfirmPasswordVisible}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
            />
            <TouchableOpacity onPress={() => setIsConfirmPasswordVisible(!isConfirmPasswordVisible)} style={styles.eyeIcon}>
              <Ionicons name={isConfirmPasswordVisible ? 'eye-off-outline' : 'eye-outline'} size={24} color={TEXT_MUTED} />
            </TouchableOpacity>
          </View>
          
          {/* --- Nút Đăng ký --- */}
          <TouchableOpacity style={styles.registerButton} onPress={handleRegister} disabled={isLoading}>
            {isLoading ? (
              <ActivityIndicator color={TEXT_PRIMARY} />
            ) : (
              <Text style={styles.registerButtonText}>ĐĂNG KÝ</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* --- Link đến trang Đăng nhập --- */}
        <View style={styles.loginLinkContainer}>
            <Text style={styles.loginText}>Đã có tài khoản? </Text>
            <TouchableOpacity onPress={() => { /* Điều hướng đến trang Đăng nhập */ }}>
                <Text style={styles.loginLink}>Đăng nhập ngay</Text>
            </TouchableOpacity>
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}

// --- Toàn bộ Styles của trang ---
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
  },
  scrollContainer: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  logo: {
    width: 80,
    height: 80,
    resizeMode: 'contain',
    marginBottom: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: TEXT_PRIMARY,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: TEXT_MUTED,
    marginBottom: 32,
    textAlign: 'center'
  },
  form: {
    width: '100%',
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: INPUT_BACKGROUND,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: BORDER_COLOR,
    marginBottom: 16,
    paddingHorizontal: 12,
  },
  inputIcon: {
    marginRight: 10,
  },
  input: {
    flex: 1,
    height: 55,
    fontSize: 16,
    color: TEXT_PRIMARY,
  },
  eyeIcon: {
    padding: 4,
  },
  registerButton: {
    backgroundColor: YODY_PRIMARY,
    paddingVertical: 18,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 16,
    elevation: 2, // Shadow for Android
    shadowColor: '#000', // Shadow for iOS
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  registerButtonText: {
    fontSize: 16,
    color: TEXT_PRIMARY,
    fontWeight: 'bold',
  },
  loginLinkContainer: {
    flexDirection: 'row',
    marginTop: 24,
  },
  loginText: {
    fontSize: 15,
    color: TEXT_MUTED,
  },
  loginLink: {
    fontSize: 15,
    color: YODY_PRIMARY,
    fontWeight: 'bold',
  },
});