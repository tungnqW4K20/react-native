import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import React, { useState, type FC } from 'react';
import {
  Image,
  LayoutAnimation,
  Linking,
  Platform,
  SafeAreaView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  UIManager,
  View
} from 'react-native';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

const YODY_PRIMARY_COLOR = "#FDBA44";
const YODY_TEXT_COLOR = "#222222";
const YODY_MUTED_COLOR = "#666666";
const BACKGROUND_COLOR = "#F7F8FA";

const CONTACT_INFO = {
  orderPhone: '024 999 86 999',
  complaintPhone: '1800 2086',
  email: 'chamsockhachhang@yody.vn',
  address: 'Đường An Định, P. Việt Hoà, TP Hải Dương',
};

const SOCIAL_LINKS = [
  { name: 'Zalo', url: 'https://zalo.me/yody', iconUri: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_Zalo.svg' },
  { name: 'Messenger', url: 'https://m.me/yody.vn', iconUri: 'https://cdn-icons-png.flaticon.com/512/739/739236.png' },
  { name: 'TikTok', url: 'https://www.tiktok.com/@yody.vn', iconUri: 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhty7lpsk/tiktok-icon.png' },
  { name: 'YouTube', url: 'https://www.youtube.com/c/YODYVietNamOfficial', iconUri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' },
  { name: 'Instagram', url: 'https://www.instagram.com/yody.vn/', iconUri: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' },
];

const FAQ_DATA = [
    {
        question: "Làm thế nào để theo dõi đơn hàng của tôi?",
        answer: "Bạn có thể theo dõi đơn hàng trong mục 'Đơn hàng của tôi' tại trang cá nhân. Trạng thái đơn hàng sẽ được cập nhật liên tục từ lúc đặt hàng cho đến khi giao thành công."
    },
    {
        question: "YODY có chính sách đổi trả sản phẩm không?",
        answer: "Có. YODY hỗ trợ đổi trả sản phẩm trong vòng 15 ngày kể từ ngày nhận hàng với điều kiện sản phẩm còn nguyên tem, mác và chưa qua sử dụng. Vui lòng liên hệ hotline để được hướng dẫn chi tiết."
    },
    {
        question: "Làm sao để áp dụng mã giảm giá?",
        answer: "Tại bước thanh toán, bạn sẽ thấy ô 'Nhập mã giảm giá'. Hãy điền mã của bạn vào ô này và nhấn 'Áp dụng'. Hệ thống sẽ tự động trừ số tiền tương ứng trên tổng giá trị đơn hàng."
    },
    {
        question: "Phí vận chuyển được tính như thế nào?",
        answer: "YODY miễn phí vận chuyển cho các đơn hàng có giá trị từ 499.000 VNĐ trở lên. Đối với các đơn hàng dưới giá trị này, phí vận chuyển sẽ được tính tự động dựa trên địa chỉ nhận hàng của bạn."
    }
];

interface ContactGridItemProps {
  icon: keyof typeof Ionicons.glyphMap;
  title: string;
  subtitle: string;
  onPress: () => void;
}

const ContactGridItem: FC<ContactGridItemProps> = ({ icon, title, subtitle, onPress }) => (
  <TouchableOpacity style={styles.gridItem} onPress={onPress}>
    <View style={styles.gridIconContainer}>
      <Ionicons name={icon} size={28} color={YODY_PRIMARY_COLOR} />
    </View>
    <Text style={styles.gridTitle}>{title}</Text>
    <Text style={styles.gridSubtitle}>{subtitle}</Text>
  </TouchableOpacity>
);

interface AccordionItemProps {
    question: string;
    answer: string;
}
  
const AccordionItem: FC<AccordionItemProps> = ({ question, answer }) => {
    const [isOpen, setIsOpen] = useState(false);
  
    const toggleOpen = () => {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      setIsOpen(!isOpen);
    };
  
    return (
      <View style={styles.accordionContainer}>
        <TouchableOpacity onPress={toggleOpen} style={styles.accordionHeader}>
          <Text style={styles.accordionQuestion}>{question}</Text>
          <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={22} color={YODY_MUTED_COLOR} />
        </TouchableOpacity>
        {isOpen && (
          <View style={styles.accordionContent}>
            <Text style={styles.accordionAnswer}>{answer}</Text>
          </View>
        )}
      </View>
    );
};

const YodyContactScreen: FC = () => {
  const router = useRouter();

  const handlePressCall = (phoneNumber: string) => Linking.openURL(`tel:${phoneNumber.replace(/\s/g, '')}`);
  const handlePressEmail = (email: string) => Linking.openURL(`mailto:${email}`);
  const handleOpenURL = (url: string) => Linking.openURL(url);
  const handlePressMap = (address: string) => {
    const url = Platform.select({
      ios: `maps:0,0?q=${encodeURIComponent(address)}`,
      android: `geo:0,0?q=${encodeURIComponent(address)}`,
    });
    if (url) Linking.openURL(url);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()} style={styles.headerButton}>
          <Ionicons name="arrow-back" size={24} color={YODY_TEXT_COLOR} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Trung Tâm Hỗ Trợ</Text>
        <View style={{ width: 40 }} />
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.heroSection}>
          <Ionicons name="chatbubbles-outline" size={60} color={YODY_PRIMARY_COLOR} />
          <Text style={styles.heroTitle}>YODY Luôn Lắng Nghe ❤️</Text>
          <Text style={styles.heroSubtitle}>
            Mọi thắc mắc và góp ý của bạn đều là nguồn động lực quý giá để chúng tôi hoàn thiện mỗi ngày.
          </Text>
        </View>

        <View style={styles.contactGrid}>
          <ContactGridItem icon="call-outline" title="Đặt hàng" subtitle="Hỗ trợ đặt hàng nhanh" onPress={() => handlePressCall(CONTACT_INFO.orderPhone)} />
          <ContactGridItem icon="chatbox-ellipses-outline" title="Khiếu nại" subtitle="Góp ý & xử lý sự cố" onPress={() => handlePressCall(CONTACT_INFO.complaintPhone)} />
          <ContactGridItem icon="mail-outline" title="Email" subtitle="Gửi yêu cầu chi tiết" onPress={() => handlePressEmail(CONTACT_INFO.email)} />
          <ContactGridItem icon="location-outline" title="Cửa hàng" subtitle="Tìm địa chỉ gần bạn" onPress={() => handlePressMap(CONTACT_INFO.address)} />
        </View>

        <View style={styles.section}>
            <Text style={styles.sectionTitle}>Câu hỏi thường gặp</Text>
            <View style={styles.faqContainer}>
                {FAQ_DATA.map((faq, index) => (
                    <AccordionItem key={index} question={faq.question} answer={faq.answer} />
                ))}
            </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Kết Nối Với YODY</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ paddingHorizontal: 20 }}>
            {SOCIAL_LINKS.map(social => (
              <TouchableOpacity key={social.name} style={styles.socialItem} onPress={() => handleOpenURL(social.url)}>
                <View style={styles.socialIconWrapper}>
                  <Image source={{ uri: social.iconUri }} style={styles.socialIcon} />
                </View>
                <Text style={styles.socialName}>{social.name}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: BACKGROUND_COLOR,
    marginBottom: 12,
    marginTop: 32
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    height: 60,
    backgroundColor: YODY_PRIMARY_COLOR,
  },
  headerButton: {
    padding: 5,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: YODY_TEXT_COLOR,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  heroSection: {
    backgroundColor: '#fff',
    alignItems: 'center',
    paddingVertical: 32,
    paddingHorizontal: 20,
  },
  heroTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: YODY_TEXT_COLOR,
    textAlign: 'center',
    marginTop: 16,
  },
  
  heroSubtitle: {
    fontSize: 15,
    color: YODY_MUTED_COLOR,
    textAlign: 'center',
    lineHeight: 22,
    marginTop: 8,
    maxWidth: '90%',
  },
  contactGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    marginTop: 24,
  },
  gridItem: {
    width: '48%',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  gridIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FFFBEF',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  gridTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: YODY_TEXT_COLOR,
    marginBottom: 4,
  },
  gridSubtitle: {
    fontSize: 13,
    color: YODY_MUTED_COLOR,
    textAlign: 'center',
  },
  section: {
    marginTop: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: YODY_TEXT_COLOR,
    paddingHorizontal: 20,
    marginBottom: 16,
  },
  faqContainer: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 5,
  },
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0F0F0',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
    paddingHorizontal: 10,
  },
  accordionQuestion: {
    flex: 1,
    fontSize: 15,
    fontWeight: '600',
    color: YODY_TEXT_COLOR,
    marginRight: 10,
  },
  accordionContent: {
    paddingHorizontal: 10,
    paddingBottom: 15,
  },
  accordionAnswer: {
    fontSize: 14,
    color: YODY_MUTED_COLOR,
    lineHeight: 22,
  },
  socialItem: {
    alignItems: 'center',
    marginRight: 20,
  },
  socialIconWrapper: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#fff',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 5,
    elevation: 4,
  },
  socialIcon: {
    width: 32,
    height: 32,
    resizeMode: 'contain',
  },
  socialName: {
    fontSize: 13,
    color: YODY_MUTED_COLOR,
    fontWeight: '500',
  }
});

export default YodyContactScreen;