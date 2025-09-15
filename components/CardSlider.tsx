import React, { useEffect, useState } from 'react';
import { ActivityIndicator, Dimensions, FlatList, Image, StyleSheet, Text, View } from 'react-native';
const { width } = Dimensions.get('window');

// Định nghĩa một interface cho đối tượng category để code an toàn và dễ đọc hơn
interface Category {
  id: number;
  name: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}



const CardSlider = () => {
  const [data, setData] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response =await fetch(`https://benodejs-9.onrender.com/api/categories`);
        const json = await response.json();
        
        if (json.success && Array.isArray(json.data)) {
          setData(json.data);
        } else {
          setError(json.message || 'Lấy dữ liệu không thành công');
        }
      } catch (e) {
        setError('Đã có lỗi xảy ra. Vui lòng thử lại.');
        console.error(e);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text>{error}</Text>
      </View>
    );
  }

  return (
    <View>
        <View>
            <Text style={styles.textTitle}>BỘ SƯU TẬP 2025</Text>
        </View>
         <View style={styles.container}>
            <FlatList
                data={data}
                keyExtractor={(item) => item.id.toString()}
                horizontal
                showsHorizontalScrollIndicator={false}
                pagingEnabled
                snapToAlignment="center"
                decelerationRate="fast"
                renderItem={({ item }) => (
                <View style={styles.card}>
                  <Image
                    source={{
                      uri: item.image_url
                    }}
                    style={styles.image}
                    onError={() => console.log('Không load được ảnh:', item.image_url)}
                  />
                  <Text style={styles.title}>{item.name}</Text>
                </View>

                )}
            />
            </View>
    </View>
  );
};

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    
  },
  container: {
    marginTop: 20,
    marginBottom: 12,
  },
  card: {
    width: width * 0.8,
    marginHorizontal: 10,
    backgroundColor: '#fff',
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
    alignItems: 'center',
    paddingBottom: 10,
  },
  title: {
    fontWeight: '700',
    fontSize: 16,
    marginTop: 10,
  },
  image: {
    width: '100%',
    height: width * 1.0,
    resizeMode: 'cover',
  },
  textTitle:{
      textAlign: 'center',
      marginTop: 50,
      fontSize: 20,
      lineHeight: 32,
      fontWeight: '700',
  }
});

export default CardSlider;