import { useAuth } from "@/components/AuthContext";
import { API_URL } from "@env";
import { useRouter } from "expo-router";
import React, { useState } from "react";
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
} from "react-native";
import Icon from "react-native-vector-icons/Feather";

interface User {
  id: string | number;
  name: string;
  email: string;
  address?: string
  phone?: string;
}

interface AuthContextData {
  user: User | null;
  token: string | null;
  updateUser: (user: User) => void;
  logout: () => void;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  data: User;
}

const PALETTE = {
  primary: "#FFD400",
  background: "#F9F9F9",
  surface: "#FFFFFF",
  textPrimary: "#111111",
  textSecondary: "#6C757D",
  border: "#EEEEEE",
  danger: "#D93025",
  success: "#1E8E3E",
};

const ProfileScreen: React.FC = () => {
  const { user, token, updateUser, logout } = useAuth() as AuthContextData;
  const [isEditing, setIsEditing] = useState<boolean>(false);

  const [name, setName] = useState<string>(user?.name || "");
  const [email, setEmail] = useState<string>(user?.email || "");
  const [address, setAddress] = useState<string>(user?.address || "");
  const [loading, setLoading] = useState<boolean>(false);

  const router = useRouter();

  const EditInputRow: React.FC<{
    label: string;
    value: string;
    onChangeText: (text: string) => void;
    placeholder: string;
    keyboardType?: 'default' | 'email-address' | 'phone-pad';
    autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  }> = ({ label, value, onChangeText, placeholder, keyboardType = 'default', autoCapitalize = 'sentences' }) => (
    <View style={styles.inputContainer}>
      <Text style={styles.inputLabel}>{label}</Text>
      <TextInput
        style={styles.textInput}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={PALETTE.textSecondary}
        keyboardType={keyboardType}
        autoCapitalize={autoCapitalize}
      />
    </View>
  );

  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <Text style={styles.headerTitle}>Tài khoản</Text>
        <View style={styles.unauthenticatedContainer}>
          {/* @ts-ignore */}
          <Icon name="user-x" size={60} color={PALETTE.textSecondary} />
          <Text style={styles.unauthenticatedText}>Vui lòng đăng nhập để xem thông tin</Text>
        </View>
      </SafeAreaView>
    );
  }

  const handleSave = async (): Promise<void> => {
    setLoading(true);
    try {
        const response = await fetch(`${API_URL}/customers/${user.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
            body: JSON.stringify({ name, email, address }),
        });
        const result: ApiResponse = await response.json();
        if (!result.success) throw new Error(result.message || 'Cập nhật thất bại');
        updateUser(result.data);
        Alert.alert('Thành công', 'Thông tin đã được cập nhật!');
        setIsEditing(false);
    } catch (error) {
        const errorMessage = error instanceof Error ? error.message : "Đã xảy ra lỗi";
        Alert.alert('Lỗi', errorMessage);
    } finally {
        setLoading(false);
    }
  };
  
  const handleCancel = () => {
    setName(user.name);
    setEmail(user.email);
    setAddress(user.address || "");
    setIsEditing(false);
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        <View style={styles.header}>
            <Text style={styles.headerTitle}>{isEditing ? "Chỉnh sửa thông tin" : "Tài khoản của tôi"}</Text>
        </View>

        {!isEditing && (
            <View style={styles.userInfoHeader}>
            <Image
                source={{ uri: `https://ui-avatars.com/api/?name=${user.name.replace(/\s/g, '+')}&background=FFD400&color=111111&bold=true` }}
                style={styles.avatar}
            />
            <View>
                <Text style={styles.userName}>{user.name}</Text>
                <Text style={styles.userMembership}>Thành viên Vàng</Text>
            </View>
            </View>
        )}

        {isEditing ? (
          <View style={styles.section}>
            <EditInputRow label="Họ và tên" value={name} onChangeText={setName} placeholder="Nhập họ và tên" autoCapitalize="words"/>
            <EditInputRow label="Email" value={email} onChangeText={setEmail} placeholder="Nhập email" keyboardType="email-address" autoCapitalize="none"/>
            <EditInputRow label="Địa chỉ" value={address} onChangeText={setAddress} placeholder="Nhập địa chỉ nhận hàng" />
            
            <View style={styles.actionButtonsContainer}>
                <TouchableOpacity style={[styles.button, styles.secondaryButton]} onPress={handleCancel} disabled={loading}>
                    <Text style={[styles.buttonText, styles.secondaryButtonText]}>Hủy</Text>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.button, styles.primaryButton]} onPress={handleSave} disabled={loading}>
                    {loading ? <ActivityIndicator color={PALETTE.textPrimary} /> : <Text style={[styles.buttonText, styles.primaryButtonText]}>Lưu</Text>}
                </TouchableOpacity>
            </View>
          </View>
        ) : (
          <>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Thông tin cá nhân</Text>
                <TouchableOpacity onPress={() => setIsEditing(true)}>
                  {/* @ts-ignore */}
                    <Icon name="edit-2" size={20} color={PALETTE.textSecondary}/>
                </TouchableOpacity>
              </View>
              <View style={styles.infoRow}>
                {/* @ts-ignore */}
                <Icon name="user" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Họ tên</Text>
                <Text style={styles.infoValue}>{user.name}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* @ts-ignore */}
                <Icon name="mail" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Email</Text>
                <Text style={styles.infoValue}>{user.email}</Text>
              </View>
              <View style={styles.infoRow}>
                {/* @ts-ignore */}
                <Icon name="phone" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Điện thoại</Text>
                <Text style={styles.infoValue}>{user.phone || "Chưa cập nhật"}</Text>
              </View>
              <View style={[styles.infoRow, { borderBottomWidth: 0 }]}>
                {/* @ts-ignore */}
                <Icon name="map-pin" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Địa chỉ</Text>
                <Text style={styles.infoValue} numberOfLines={1}>{user.address || "Chưa cập nhật"}</Text>
              </View>
            </View>

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                 <Text style={styles.sectionTitle}>Quản lý đơn hàng</Text>
              </View>
              <TouchableOpacity style={styles.infoRow} onPress={ () => {
                console.log("----------")
                router.push("/order-history"); 
              }}>
                {/* @ts-ignore */}
                <Icon name="package" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Lịch sử mua hàng</Text>
                {/* @ts-ignore */}
                <Icon name="chevron-right" style={styles.chevronIcon} />

              </TouchableOpacity>
              <TouchableOpacity style={[styles.infoRow, { borderBottomWidth: 0 }]}
               onPress={()=>{
                router.push("/rating-product")
               }}
              >
                {/* @ts-ignore */}
                <Icon name="star" style={styles.infoIcon} />
                <Text style={styles.infoLabel}>Đánh giá sản phẩm</Text>
                {/* @ts-ignore */}
                <Icon name="chevron-right" style={styles.chevronIcon} />
              </TouchableOpacity>
            </View>

            <TouchableOpacity
                style={styles.logoutButton}
                onPress={() => {
                    logout(); 
                    router.push("/login"); 
                }}
                >
                  {/* @ts-ignore */}
                <Icon name="log-out" size={20} color={PALETTE.danger} />
                <Text style={styles.logoutButtonText}>Đăng xuất</Text>
            </TouchableOpacity>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: PALETTE.background,
        marginBottom: 16
    },
    header: {
        padding: 20,
        paddingTop: 10,
    },
    headerTitle: {
        fontSize: 28,
        fontWeight: 'bold',
        color: PALETTE.textPrimary,
        marginTop: 32
    },
    unauthenticatedContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    unauthenticatedText: {
        marginTop: 16,
        fontSize: 16,
        color: PALETTE.textSecondary,
        textAlign: 'center',
    },
    userInfoHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    avatar: {
        width: 70,
        height: 70,
        borderRadius: 35,
        marginRight: 16,
    },
    userName: {
        fontSize: 20,
        fontWeight: 'bold',
        color: PALETTE.textPrimary,
    },
    userMembership: {
        fontSize: 14,
        color: PALETTE.textPrimary,
        backgroundColor: PALETTE.primary,
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 6,
        overflow: 'hidden',
        alignSelf: 'flex-start',
        marginTop: 6,
        fontWeight: '600',
    },
    section: {
        backgroundColor: PALETTE.surface,
        borderRadius: 12,
        marginHorizontal: 20,
        marginBottom: 20,
        paddingHorizontal: 16,
    },
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingVertical: 16,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: PALETTE.textPrimary,
    },
    infoRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 16,
        borderBottomWidth: 1,
        borderBottomColor: PALETTE.border,
    },
    infoIcon: {
        fontSize: 20,
        color: PALETTE.primary,
        marginRight: 16,
    },
    infoLabel: {
        fontSize: 16,
        color: PALETTE.textPrimary,
        flex: 1,
    },
    infoValue: {
        fontSize: 16,
        color: PALETTE.textSecondary,
        flex: 1,
        textAlign: 'right',
    },
    chevronIcon: {
        fontSize: 20,
        color: PALETTE.textSecondary,
    },
    logoutButton: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: PALETTE.surface,
        borderRadius: 12,
        marginHorizontal: 20,
        padding: 16,
        marginTop: 10,
        marginBottom: 70
    },
    logoutButtonText: {
        fontSize: 16,
        color: PALETTE.danger,
        fontWeight: '600',
        marginLeft: 8,
    },
    inputContainer: {
        paddingVertical: 12,
    },
    inputLabel: {
        fontSize: 14,
        color: PALETTE.textSecondary,
        marginBottom: 8,
    },
    textInput: {
        fontSize: 16,
        color: PALETTE.textPrimary,
        borderBottomWidth: 2,
        borderBottomColor: PALETTE.border,
        paddingBottom: 8,
    },
    actionButtonsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 20,
        paddingBottom: 12,
    },
    button: {
        flex: 1,
        padding: 14,
        borderRadius: 12,
        alignItems: 'center',
    },
    primaryButton: {
        backgroundColor: PALETTE.primary,
        marginLeft: 8,
    },
    secondaryButton: {
        backgroundColor: PALETTE.border,
        marginRight: 8,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    primaryButtonText: {
        color: PALETTE.textPrimary,
    },
    secondaryButtonText: {
        color: PALETTE.textSecondary,
    },
});