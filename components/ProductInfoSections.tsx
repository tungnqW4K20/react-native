// components/product/ProductInfoSections.tsx
import React, { PropsWithChildren, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

const AccordionItem: React.FC<PropsWithChildren<{ title: string }>> = ({ title, children }) => {
    const [isExpanded, setIsExpanded] = useState(false);
    return (
        <View style={styles.accordionContainer}>
            <TouchableOpacity style={styles.accordionHeader} onPress={() => setIsExpanded(!isExpanded)}>
                <Text style={styles.accordionTitle}>{title}</Text>
                <Icon name={isExpanded ? "remove-circle-outline" : "add-circle-outline"} size={22} color="#333"/>
            </TouchableOpacity>
            {isExpanded && <View style={styles.accordionContent}>{children}</View>}
        </View>
    );
};

interface Props {
  description: string;
}

const ProductInfoSections: React.FC<Props> = ({ description }) => {
  return (
    <View>
      {/* Commitment Section */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>YODY CAM KẾT</Text>
        <View style={styles.commitmentItem}>
            <Icon name="car-outline" size={24} color="#555" />
            <Text style={styles.commitmentText}>Giao trong 3-5 ngày và freeship đơn từ 498k</Text>
        </View>
        <View style={styles.commitmentItem}>
            <Icon name="swap-horizontal-outline" size={24} color="#555" />
            <Text style={styles.commitmentText}>Đổi trả trong vòng 15 ngày</Text>
        </View>
      </View>

      {/* Accordion Sections */}
      <View style={styles.sectionContainer}>
        <AccordionItem title="Chi tiết sản phẩm">
            <Text>{description}</Text>
        </AccordionItem>
        <AccordionItem title="Câu hỏi thường gặp">
            <Text>Hỏi: Sản phẩm có được bảo hành không?{'\n'}Đáp: Có, sản phẩm được bảo hành 6 tháng.</Text>
        </AccordionItem>
      </View>
      
      {/* Store Locator */}
      <TouchableOpacity style={styles.storeLocator}>
        <Text style={styles.accordionTitle}>Xem cửa hàng còn sản phẩm</Text>
        <Icon name="chevron-forward-outline" size={22} color="#333"/>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  sectionContainer: { borderTopWidth: 8, borderTopColor: '#f5f5f5' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 15, paddingHorizontal: 15, paddingTop: 15 },
  commitmentItem: { flexDirection: 'row', alignItems: 'center', marginBottom: 12, paddingHorizontal: 15 },
  commitmentText: { marginLeft: 12, fontSize: 15, flex: 1 },
  accordionContainer: { borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  accordionHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15 },
  accordionTitle: { fontSize: 16, fontWeight: '500' },
  accordionContent: { padding: 15, backgroundColor: '#fafafa' },
  storeLocator: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 15, borderTopWidth: 8, borderTopColor: '#f5f5f5'},
});

export default ProductInfoSections;