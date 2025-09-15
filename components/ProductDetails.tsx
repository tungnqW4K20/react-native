import React, { useState } from 'react';
import { Modal, ScrollView, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';

// --- Giao diện cho props (Không đổi) ---
interface ApiColorOption {
  id: number;
  name: string;
  price: string;
  image_urls: string[];
  colorCode: string | null;
}

interface ApiSizeOption {
  id: number;
  name: string;
  price: string | null;
}

interface Props {
  name: string;
  price: string;
  code: string;
  colors: ApiColorOption[];
  sizes: ApiSizeOption[];
  selectedColor: ApiColorOption;
  initialSize: ApiSizeOption;
  onColorChange: (color: ApiColorOption) => void;
  onAddToCart: (details: { color: ApiColorOption; size: ApiSizeOption; quantity: number }) => void;
}

// --- Dữ liệu cho các bảng size ---
const femaleTopData = {
  title: 'Áo Nữ',
  headers: ['Kích thước', 'XS', 'S', 'M', 'L', 'XL', '2XL', '3XL'],
  rows: [
    { label: 'Chiều cao (cm)', values: ['145-150', '150-155', '156-160', '161-164', '165-170', '165-170', '165-170'] },
    { label: 'Cân nặng (kg)', values: ['35-39', '40-45', '46-51', '52-57', '58-63', '63-68', '68-73'] },
    { label: 'Rộng Vai (cm)', values: ['35', '36', '37', '38', '39', '40', '40'] },
    { label: 'Vòng ngực (cm)', values: ['74-77', '78-82', '83-87', '87-91', '91-95', '95-99', '99-103'] },
    { label: 'Vòng eo (cm)', values: ['52-62', '62-66', '66-70', '70-74', '74-78', '78-82', '82-86'] },
  ],
};

const femaleBottomData = {
  title: 'Quần Nữ',
  headers: ['Kích thước', 'XS/25', 'S/26', 'M/27' /* Thêm các size khác nếu có */],
  rows: [
    { label: 'Chiều cao (cm)', values: ['145-150', '150-155', '156-160'] },
    { label: 'Cân nặng (kg)', values: ['35-39', '40-45', '46-51'] },
  ],
};

const maleTopData = {
  title: 'Áo Nam',
  headers: ['Kích thước', 'S', 'M', 'L', 'XL', '2XL', '3XL', '4XL', '5XL'],
  rows: [
    { label: 'Chiều cao (cm)', values: ['160-165', '160-165', '166-172', '172-177', '177-184', '184-192', '184-192', '184-192'] },
    { label: 'Cân nặng (kg)', values: ['50-54', '55-61', '62-68', '69-75', '76-84', '85-90', '90-94', '94-98'] },
    { label: 'Rộng Vai (cm)', values: ['41', '42', '43,5', '45', '46,5', '48', '49', '50'] },
    { label: 'Vòng ngực (cm)', values: ['82-86', '86-90', '90-94', '94-98', '98-102', '102-106', '106-110', '110-114'] },
  ],
};

const maleBottomData = {
    title: 'Quần Nam',
    headers: ['Kích thước', 'S/28', 'M/29', 'L/30', 'XL/31'],
    rows: [
        { label: 'Chiều cao (cm)', values: ['160-165', '160-165', '166-172', '172-177'] },
        { label: 'Cân nặng (kg)', values: ['50-54', '55-61', '62-68', '69-75'] },
        { label: 'Vòng bụng (cm)', values: ['68-72', '72-76', '76-80', '80-84'] },
        { label: 'Vòng mông (cm)', values: ['84-88', '88-92', '92-95', '95-98'] },
    ]
}

// --- Component con để render một bảng size ---
interface SizeTableProps {
  data: {
    title: string;
    headers: string[];
    rows: { label: string; values: string[] }[];
  };
}

const SizeTable: React.FC<SizeTableProps> = ({ data }) => {
  return (
    <View style={styles.tableContainer}>
      <Text style={styles.tableTitle}>{data.title}</Text>
      <View style={styles.table}>
        {/* Header Row */}
        <View style={styles.tableRow}>
          {data.headers.map((header, index) => (
            <View key={index} style={[styles.tableCell, styles.tableHeaderCell, index === 0 && {flex: 2.5}]}>
              <Text style={styles.headerText}>{header}</Text>
            </View>
          ))}
        </View>
        {/* Data Rows */}
        {data.rows.map((row, rowIndex) => (
          <View key={rowIndex} style={styles.tableRow}>
            <View style={[styles.tableCell, styles.labelCell, {flex: 2.5}]}>
              <Text style={styles.labelText}>{row.label}</Text>
            </View>
            {row.values.map((value, valueIndex) => (
              <View key={valueIndex} style={[styles.tableCell, styles.valueCell]}>
                <Text style={styles.valueText}>{value}</Text>
              </View>
            ))}
             {/* Render empty cells if data is missing for some sizes */}
            {Array.from({ length: data.headers.length - 1 - row.values.length }).map((_, i) => (
                 <View key={`empty-${i}`} style={[styles.tableCell, styles.valueCell]} />
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};


// --- Component Modal Hướng dẫn chọn size ---
const SizeGuideModal = ({ visible, onClose }: { visible: boolean; onClose: () => void }) => {
  const [activeTab, setActiveTab] = useState('Nữ');

  const renderContent = () => {
    switch (activeTab) {
      case 'Nữ':
        return (
          <>
            <SizeTable data={femaleTopData} />
            <SizeTable data={femaleBottomData} />
          </>
        );
      case 'Nam':
        return (
            <>
              <SizeTable data={maleTopData} />
              <SizeTable data={maleBottomData} />
            </>
          );
      case 'Trẻ em':
        return <Text style={styles.comingSoonText}>Nội dung sắp được cập nhật.</Text>;
      case 'Phụ kiện':
        return <Text style={styles.comingSoonText}>Nội dung sắp được cập nhật.</Text>;
      default:
        return null;
    }
  };

  return (
    <Modal animationType="slide" transparent={true} visible={visible} onRequestClose={onClose}>
      <View style={styles.modalBackdrop}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Bảng kích thước</Text>
            <TouchableOpacity onPress={onClose}>
              <Icon name="close-outline" size={30} color="#333" />
            </TouchableOpacity>
          </View>

          <View style={styles.tabContainer}>
            {['Nam', 'Nữ', 'Trẻ em', 'Phụ kiện'].map((tab) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabButton, activeTab === tab && styles.activeTabButton]}
                onPress={() => setActiveTab(tab)}
              >
                <Text style={[styles.tabText, activeTab === tab && styles.activeTabText]}>{tab}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>{renderContent()}</ScrollView>
        </View>
      </View>
    </Modal>
  );
};


// --- Component Chi tiết Sản phẩm (Không đổi logic) ---
const ProductDetails: React.FC<Props> = ({
  name,
  price,
  code,
  colors,
  sizes,
  selectedColor,
  initialSize,
  onColorChange,
  onAddToCart,
}) => {
  const [selectedSize, setSelectedSize] = useState<ApiSizeOption>(initialSize);
  const [quantity, setQuantity] = useState(1);
  const [isSizeGuideVisible, setSizeGuideVisible] = useState(false);

  const handleDecreaseQuantity = () => setQuantity(q => Math.max(1, q - 1));
  const handleIncreaseQuantity = () => setQuantity(q => q + 1);

  const handleAddToCartPress = () => {
    onAddToCart({ color: selectedColor, size: selectedSize, quantity });
  };

  return (
    <View style={styles.container}>
      {/* Phần giao diện chi tiết sản phẩm không thay đổi */}
      <Text style={styles.price}>{price}</Text>
      <Text style={styles.productName}>{name}</Text>
      <Text style={styles.productCode}>{code}</Text>

      <Text style={styles.label}>Màu sắc: {selectedColor.name}</Text>
      <View style={styles.selectorContainer}>
        {colors.map((color) => (
          <TouchableOpacity
            key={color.id}
            style={[styles.colorOuterCircle, selectedColor.id === color.id && styles.selectedColor]}
            onPress={() => onColorChange(color)}
          >
            <View style={[styles.colorInnerCircle, { backgroundColor: color.colorCode || '#E0E0E0' }]} />
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.sizeHeader}>
        <Text style={styles.label}>Kích thước: {selectedSize.name}</Text>
        <TouchableOpacity onPress={() => setSizeGuideVisible(true)}>
          <Text style={styles.sizeGuide}>Hướng dẫn chọn size</Text>
        </TouchableOpacity>
      </View>
      <View style={styles.selectorContainer}>
        {sizes.map((size) => (
          <TouchableOpacity
            key={size.id}
            style={[styles.sizeButton, selectedSize.id === size.id && styles.selectedSizeButton]}
            onPress={() => setSelectedSize(size)}
          >
            <Text style={[styles.sizeText, selectedSize.id === size.id && styles.selectedSizeText]}>
              {size.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actionContainer}>
        <View style={styles.quantitySelector}>
          <TouchableOpacity onPress={handleDecreaseQuantity} style={styles.quantityButton}>
            <Icon name="remove-outline" size={20} color="#000" />
          </TouchableOpacity>
          <Text style={styles.quantityText}>{quantity}</Text>
          <TouchableOpacity onPress={handleIncreaseQuantity} style={styles.quantityButton}>
            <Icon name="add-outline" size={20} color="#000" />
          </TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.addToCartButton} onPress={handleAddToCartPress}>
          <Text style={styles.addToCartText}>Thêm vào giỏ</Text>
          <Icon name="bag-handle-outline" size={20} color="#333" />
        </TouchableOpacity>
      </View>

      <SizeGuideModal visible={isSizeGuideVisible} onClose={() => setSizeGuideVisible(false)} />
    </View>
  );
};

// --- Styles ---
const styles = StyleSheet.create({
  // ... (các style cũ không đổi)
  container: { padding: 15 },
  price: { fontSize: 24, fontWeight: 'bold', marginBottom: 8 },
  productName: { fontSize: 18, marginBottom: 4 },
  productCode: { fontSize: 14, color: '#888', marginBottom: 15 },
  label: { fontSize: 16, fontWeight: '500', marginBottom: 10 },
  selectorContainer: { flexDirection: 'row', flexWrap: 'wrap', marginBottom: 15 },
  colorOuterCircle: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  selectedColor: { borderColor: '#000' },
  colorInnerCircle: { width: 32, height: 32, borderRadius: 16, borderWidth: 1, borderColor: '#eee' },
  sizeHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  sizeGuide: { color: '#007bff', textDecorationLine: 'underline' },
  sizeButton: {
    minWidth: 50,
    height: 40,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#ccc',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
    marginBottom: 10,
    paddingHorizontal: 15,
  },
  selectedSizeButton: { borderColor: '#FFA500', backgroundColor: '#FFF8E1' },
  sizeText: { fontSize: 16 },
  selectedSizeText: { color: '#FFA500', fontWeight: 'bold' },
  actionContainer: { flexDirection: 'row', marginTop: 20 },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    marginRight: 15,
  },
  quantityButton: { padding: 10 },
  quantityText: { fontSize: 18, fontWeight: 'bold', paddingHorizontal: 15 },
  addToCartButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#FFD700',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 8,
  },
  addToCartText: { fontSize: 16, fontWeight: 'bold', marginRight: 8, color: '#333' },

  // --- Styles for Size Guide Modal ---
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: 'white',
    height: '85%',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 15,
    paddingTop: 15,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 15,
    backgroundColor: '#f2f2f2',
    borderRadius: 20,
  },
  tabButton: {
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 20,
  },
  activeTabButton: {
    backgroundColor: 'white',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
  },
  activeTabText: {
    color: '#000',
    fontWeight: 'bold',
  },
  comingSoonText: {
    textAlign: 'center',
    marginTop: 50,
    fontSize: 16,
    color: '#888',
  },

  // --- Styles for Size Table Component ---
  tableContainer: {
    marginBottom: 20,
  },
  tableTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    marginLeft: 5,
  },
  table: {
    borderWidth: 1,
    borderColor: '#E0E0E0',
    borderRadius: 8,
    overflow: 'hidden', // Ensures inner borders don't bleed out
  },
  tableRow: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  tableCell: {
    flex: 1.5,
    paddingVertical: 10,
    paddingHorizontal: 5,
    justifyContent: 'center',
    alignItems: 'center',
    borderRightWidth: 1,
    borderRightColor: '#E0E0E0',
  },
  tableHeaderCell: {
    backgroundColor: '#FAFAFA',
  },
  labelCell: {
    backgroundColor: '#FAFAFA',
    alignItems: 'flex-start',
    paddingLeft: 10,
  },
  valueCell: {
    backgroundColor: '#FFFFFF',
  },
  headerText: {
    fontWeight: 'bold',
    fontSize: 13,
    textAlign: 'center',
  },
  labelText: {
    fontWeight: '500',
    fontSize: 13,
  },
  valueText: {
    fontSize: 13,
    textAlign: 'center',
  },
});

export default ProductDetails;