import { Ionicons } from '@expo/vector-icons';
import React, { useState, type FC, type ReactNode } from 'react';
import { Dimensions, Image, Linking, StyleSheet, Text, TouchableOpacity, View } from 'react-native';

const { width } = Dimensions.get('window'); // Get screen width for responsive calculations

interface AccordionItemProps {
  title: string;
  children?: ReactNode;
}

const AccordionItem: FC<AccordionItemProps> = ({ title, children }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  return (
    <View style={styles.accordionContainer}>
      <TouchableOpacity onPress={() => setIsOpen(!isOpen)} style={styles.accordionHeader}>
        <Text style={styles.accordionTitle}>{title}</Text>
        <Ionicons name={isOpen ? "chevron-up" : "chevron-down"} size={20} color="#fff" />
      </TouchableOpacity>
      {isOpen && (
        <View style={styles.accordionContent}>
          {children}
        </View>
      )}
    </View>
  );
};

const Footer: FC = () => {
  return (
    <View style={styles.container}>
      {/* Contact Section */}
      <View style={styles.contactSection}>
        <View style={styles.contactRow}>
          <Ionicons name="call-outline" size={24} color="white" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Đặt hàng</Text>
            <Text style={styles.contactInfo}>024 999 86 999</Text>
          </View>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="chatbox-ellipses-outline" size={24} color="white" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Góp ý khiếu nại</Text>
            <Text style={styles.contactInfo}>1800 2086</Text>
          </View>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="mail-outline" size={24} color="white" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Email</Text>
            <Text style={styles.contactInfo}>chamsockhachhang@yody.vn</Text>
          </View>
        </View>
        <View style={styles.contactRow}>
          <Ionicons name="location-outline" size={24} color="white" />
          <View style={styles.contactTextContainer}>
            <Text style={styles.contactTitle}>Địa chỉ</Text>
            <Text style={styles.contactInfo}>Đường An Định - Phường Việt Hoà - TP Hải Dương</Text>
          </View>
        </View>
      </View>

      {/* Social Icons */}
      <View style={styles.socialIconsContainer}>
        <TouchableOpacity style={styles.socialIconWrapper} onPress={() => Linking.openURL('https://zalo.me/yody')}>
          <Image
            source={{ uri: 'https://upload.wikimedia.org/wikipedia/commons/9/91/Icon_Zalo.svg' }}
            style={styles.socialIconImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIconWrapper} onPress={() => Linking.openURL('https://m.me/yody.vn')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/739/739236.png' }} // Facebook Messenger icon
            style={styles.socialIconImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIconWrapper} onPress={() => Linking.openURL('https://www.tiktok.com/@yody.vn')}>
          <Image
            source={{ uri: 'https://sf-tb-sg.ibytedtos.com/obj/eden-sg/uhty7lpsk/tiktok-icon.png' }} // TikTok icon
            style={styles.socialIconImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIconWrapper} onPress={() => Linking.openURL('https://www.youtube.com/c/YODYVietNamOfficial')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/1384/1384060.png' }} // YouTube icon
            style={styles.socialIconImage}
          />
        </TouchableOpacity>
        <TouchableOpacity style={styles.socialIconWrapper} onPress={() => Linking.openURL('https://www.instagram.com/yody.vn/')}>
          <Image
            source={{ uri: 'https://cdn-icons-png.flaticon.com/512/174/174855.png' }} // Instagram icon
            style={styles.socialIconImage}
          />
        </TouchableOpacity>
      </View>

      {/* Feedback Section */}
      <View style={styles.feedbackSection}>
        <Text style={styles.feedbackTitle}>YODY XIN CHÀO ❤️</Text>
        <Text style={styles.feedbackText}>
          Chúng tôi luôn quý trọng và tiếp thu mọi ý kiến đóng góp từ khách hàng, nhằm không ngừng cải thiện và nâng tầm trải nghiệm dịch vụ cũng như chất lượng sản phẩm.
        </Text>
        <View style={styles.emailInputContainer}>
          <Ionicons name="mail-outline" size={20} color="#666" style={styles.emailIcon} />
          <Text style={styles.emailInputPlaceholder}>Nhập địa chỉ email của bạn</Text>
          <TouchableOpacity style={styles.guiButton}>
            <Text style={styles.guiButtonText}>Gửi</Text>
          </TouchableOpacity>
        </View>
      </View>
      
      {/* Accordion Links */}
      <AccordionItem title="HỆ THỐNG CỬA HÀNG" />
      <AccordionItem title="MUA SẮM" />
      <AccordionItem title="DỊCH VỤ KHÁCH HÀNG" />
      <AccordionItem title="VỀ YODY" />

      {/* Company Info */}
      <View style={styles.companyInfoSection}>
        <Text style={styles.companyText}>© CÔNG TY CỔ PHẦN THỜI TRANG YODY</Text>
        <Text style={styles.companyText}>
          Mã số doanh nghiệp: 0801206940. Giấy chứng nhận đăng ký doanh nghiệp do Sở Kế hoạch và Đầu tư TP Hải Dương cấp lần đầu ngày 04/03/2017
        </Text>
      </View>

      {/* Badges */}
      <View style={styles.badgesContainer}>
        <Image source={{ uri: 'https://www.dmca.com/img/dmca_protected_200.png' }} style={styles.badge} /> {/* DMCA badge */}
        <Image source={{ uri: 'https://images.dmca.com/badges/byr_ssl_small.png' }} style={styles.badge} /> {/* Example BCT badge - you might need a specific URL for the actual BCT badge */}
      </View>

      {/* "Danh mục" button removed as it was not part of the initial component's visual, and likely a separate fixed element. */}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a', // Darker background for the footer
    padding: 20,
    // paddingBottom: 80, // Remove or adjust if no fixed bottom button
  },
  // Contact Section
  contactSection: {
    marginBottom: 20,
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
  },
  contactTextContainer: {
    marginLeft: 15,
    flex: 1, // Allow text to wrap and take available space
  },
  contactTitle: {
    color: '#aaa', // Lighter grey for titles
    fontSize: width * 0.035, // Responsive font size
  },
  contactInfo: {
    color: '#fff',
    fontSize: width * 0.04, // Responsive font size
    fontWeight: 'bold',
    marginTop: 2,
    flexWrap: 'wrap', // Ensure long address wraps
  },
  // Social Icons (Updated for the provided image)
  socialIconsContainer: {
    flexDirection: 'row',
    justifyContent: 'flex-start', // Align to start
    marginVertical: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
    paddingBottom: 20,
    flexWrap: 'wrap', // Allow icons to wrap if many
  },
  socialIconWrapper: {
    width: width * 0.1, // Responsive width
    height: width * 0.1, // Responsive height (square)
    borderRadius: 8, // Slightly rounded corners
    backgroundColor: '#333', // Dark background for icons
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: width * 0.025, // Responsive space between icons
    marginBottom: 10, // Add bottom margin for wrapping
  },
  socialIconImage: {
    width: '60%', // Image takes 60% of wrapper size
    height: '60%', // Image takes 60% of wrapper size
    resizeMode: 'contain',
  },
  // Feedback Section (YODY XIN CHÀO)
  feedbackSection: {
    marginTop: 20,
    marginBottom: 30,
  },
  feedbackTitle: {
    color: '#fff',
    fontSize: width * 0.05, // Responsive font size
    fontWeight: 'bold',
    marginBottom: 10,
  },
  feedbackText: {
    color: '#ccc',
    fontSize: width * 0.038, // Responsive font size
    lineHeight: width * 0.055, // Responsive line height
    marginBottom: 20,
  },
  emailInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#333',
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 45, // Fixed height for input, or make it responsive if needed
  },
  emailIcon: {
    marginRight: 10,
  },
  emailInputPlaceholder: {
    flex: 1, // Allow placeholder to take remaining space
    color: '#666',
    fontSize: width * 0.038, // Responsive font size
  },
  guiButton: {
    backgroundColor: '#ffc107', // Yellow button
    paddingVertical: 8,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  guiButtonText: {
    color: '#000',
    fontWeight: 'bold',
    fontSize: width * 0.038, // Responsive font size
  },
  // Accordion
  accordionContainer: {
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 15,
  },
  accordionTitle: {
    color: '#fff',
    fontSize: width * 0.042, // Responsive font size
    fontWeight: 'bold',
  },
  accordionContent: {
    paddingBottom: 15,
  },
  // Company Info
  companyInfoSection: {
    marginTop: 30,
    marginBottom: 20,
  },
  companyText: {
    color: '#aaa',
    fontSize: width * 0.032, // Responsive font size
    lineHeight: width * 0.045, // Responsive line height
    marginBottom: 8,
    flexWrap: 'wrap', // Ensure text wraps
  },
  // Badges
  badgesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    flexWrap: 'wrap', // Allow badges to wrap
    justifyContent: 'center', // Center badges if they wrap
  },
  badge: {
    width: width * 0.25, // Responsive width
    height: width * 0.1, // Responsive height
    resizeMode: 'contain',
    marginRight: 10,
    marginBottom: 10, // Add bottom margin for wrapping
  },
  // The 'danhMucButton' styles are removed as per the instruction about not drawing the result interface.
  // If this was a fixed button you intended to keep, it would need to be outside the Footer component
  // or positioned absolutely relative to a parent that covers the whole screen.
});

export default Footer;