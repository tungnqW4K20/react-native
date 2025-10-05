import { API_URL } from '@env';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
    ActivityIndicator,
    Dimensions,
    FlatList,
    Image,
    SafeAreaView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View
} from 'react-native';


interface Product {
    id: number;
    name: string;
    price: number;
    description: string;
    stock: number;
    image_url: string;
    category_id: number;
    createdAt: string;
    updatedAt: string;
    deletedAt: string | null;
}


const ProductCard = ({ item }: { item: Product }) => {
    const router = useRouter();

    const handleProductPress = (productId: number) => {
        router.push(`/productdetail/${productId}`);
    };

    const formatPrice = (price: number) => {
        return price.toString().replace(/\B(?=(\d{3})+(?!\d))/g, '.') + 'đ';
    };

    const onPress = () => {
        handleProductPress(item?.id)
    }
    return (
        <TouchableOpacity onPress={onPress}>
            <View style={styles.productCard}


            >
                <Image
                    source={{ uri: item.image_url || 'https://via.placeholder.com/150' }}
                    style={styles.productImage}
                />
                <View style={styles.productInfo}>
                    <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
                    <Text style={styles.productPrice}>{formatPrice(item.price)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};



const ProductListScreen = () => {
    const { search } = useLocalSearchParams<{ search?: string }>();

    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState<boolean>(true);
    const [title, setTitle] = useState<string>('Tất cả sản phẩm');

    useEffect(() => {
        const fetchProducts = async () => {
            const BASE_URL = API_URL || 'https://benodejs-9.onrender.com/api';
            let url = `${BASE_URL}/products`;

            if (search && search.trim() !== '') {
                const decodedSearch = decodeURIComponent(search);
                setTitle(`Kết quả cho "${decodedSearch}"`);
                url = `${BASE_URL}/products/search?search=${encodeURIComponent(decodedSearch)}`;
            } else {
                setTitle('Tất cả sản phẩm');
            }

            setLoading(true);
            setProducts([]); 

            try {
                const response = await fetch(url);
                const result: { success: boolean; data: Product[] } = await response.json();

                if (result.success && Array.isArray(result.data)) {
                    setProducts(result.data);
                } else {
                    console.warn("API không trả về dữ liệu sản phẩm mong đợi:", result);
                    setProducts([]);
                }
            } catch (error) {
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [search]);

    if (loading) {
        return (
            <SafeAreaView style={styles.centered}>
                <ActivityIndicator size="large" color="#0000ff" />
            </SafeAreaView>
        );
    }

    // Giao diện chính sau khi đã tải xong
    return (
        <SafeAreaView style={styles.container}>
            <FlatList
                data={products}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => <ProductCard item={item} />}
                numColumns={2}
                ListHeaderComponent={
                    <Text style={styles.title}>{title}</Text>
                }
                ListEmptyComponent={
                    <View style={styles.centered}>
                        <Text style={styles.emptyText}>Không tìm thấy sản phẩm nào.</Text>
                    </View>
                }
                contentContainerStyle={styles.listContainer}
            />
        </SafeAreaView>
    );
};


const { width } = Dimensions.get('window');
const cardWidth = (width - 3 * 16) / 2;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    centered: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
    },
    title: {
        fontSize: 22,
        fontWeight: 'bold',
        margin: 16,
        color: '#333',
    },
    listContainer: {
        paddingBottom: 20,
    },
    emptyText: {
        fontSize: 16,
        color: 'gray',
    },
    productCard: {
        width: cardWidth,
        backgroundColor: '#fff',
        borderRadius: 8,
        overflow: 'hidden',
        marginLeft: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: '#f0f0f0',
    },
    productImage: {
        width: '100%',
        height: cardWidth * 1.3,
        resizeMode: 'cover',
        backgroundColor: '#f5f5f5',
    },
    productInfo: {
        padding: 10,
    },
    productName: {
        fontSize: 14,
        color: '#333',
        minHeight: 38,
    },
    productPrice: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#000',
        marginTop: 6,
    },
});

export default ProductListScreen;