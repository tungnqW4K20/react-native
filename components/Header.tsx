import { useAuth } from "@/components/AuthContext";
import { viewHistoryService } from "@/services/viewHistoryService";
import { API_URL } from "@env";
import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { ActivityIndicator, FlatList, Image, Modal, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View } from 'react-native';
import Icon from 'react-native-vector-icons/Ionicons';
interface Category {
  id: number;
  name: string;
  image_url: string;
  createdAt: string;
  updatedAt: string;
  deletedAt: string | null;
}

interface CategorizedData {
  men: Category[];
  women: Category[];
  sports: Category[];
}

type ActiveTab = 'NAM' | 'NỮ' | 'THỂ THAO';

const menData = {
  featured: ['Tất cả sản phẩm', 'Sản phẩm mới' ],
};

const womenData = {
    featured: ['TẤT CẢ SẢN PHẨM', 'Sản phẩm mới'],
};

const Header: React.FC = () => {
  const [menuVisible, setMenuVisible] = useState<boolean>(false);
  const [searchVisible, setSearchVisible] = useState<boolean>(false);
  const [activeTab, setActiveTab] = useState<ActiveTab>('NAM');
  const [categories, setCategories] = useState<CategorizedData>({ men: [], women: [], sports: [] });
  const [searchValue, setSearchValue] = useState('')
  const router = useRouter();
  const { user } = useAuth();
  const { token } = useAuth();
  const [recentViews, setRecentViews] = useState<any[]>([]);
const [loadingRecent, setLoadingRecent] = useState(false);
useEffect(() => {
  if (!token) return;

  const fetchHistory = async () => {
    setLoadingRecent(true);
    try {
      const result = await viewHistoryService.getHistory();
      if (result.success) setRecentViews(result.data);
    } catch (err) {
      console.error('Lỗi khi lấy lịch sử xem:', err);
    } finally {
      setLoadingRecent(false);
    }
  };

  fetchHistory();
}, [token]);

  useEffect(() => {

    
    const fetchCategories = async () => {
      
      try {
        const response =await fetch(`${API_URL}/categories`);
        const result: { success: boolean; data: Category[] } = await response.json();

        if (result.success) {
          const menCats: Category[] = [];
          const womenCats: Category[] = [];
          const sportsCats: Category[] = [];

          result.data.forEach((cat: Category) => {
            const lowerCaseName = cat.name.toLowerCase();
            if (lowerCaseName.includes('thể thao')) {
              sportsCats.push(cat);
            } else if (lowerCaseName.includes('nữ')) {
              womenCats.push(cat);
            } else if (lowerCaseName.includes('nam')) {
              menCats.push(cat);
            }
          });
          
          setCategories({ men: menCats, women: womenCats, sports: sportsCats });
        }
      } catch (error) {
        console.error("Failed to fetch categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const handleNavigateToShop = (): void => {
    setMenuVisible(false);
    router.push('/shop');
  };

  const handleNavigateToCart = (): void => {
    router.push('/cart');
  };

  const handleNavigateToHome = (): void => {
    router.push('/');
  };
  const handleNavigateToLogin = (): void => {
    router.push('/login');
  };

  const renderMenuContent = (): React.ReactNode => {
    if (activeTab === 'NAM') {
        return (
            <ScrollView>
                <Image source={{ uri: 'https://i.postimg.cc/RFqZMcrp/a55b2d09-d456-432a-bb94-409a54f76327.png' }} style={styles.bannerImage} />
                <TouchableOpacity style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText}>KHÁM PHÁ ĐỒ NAM</Text>
                </TouchableOpacity>
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>NỔI BẬT</Text>
                    {menData.featured.map((item, index) => {
                        if (item === 'Tất cả sản phẩm') {
                            return (
                                <TouchableOpacity key={index} onPress={handleNavigateToShop}>
                                    <Text style={styles.menuItem}>{item}</Text>
                                </TouchableOpacity>
                            );
                        }
                        return (
                           <Text key={index} style={[styles.menuItem, (item.includes('Sản phẩm mới') || item.includes('SALE')) ? styles.highlightItem : null]}>{item}</Text>
                        );
                    })}
                </View>
                {categories.men.map((cat) => (
                     <View key={cat.id} style={styles.menuSection}>
                        <Text style={styles.menuSectionTitle}>{cat.name.toUpperCase()}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }
    if (activeTab === 'NỮ') {
        return (
            <ScrollView>
                 <Image source={{ uri: 'https://i.postimg.cc/zB1YQKzh/0395b8aa-29a3-4bb5-8dac-1a69fc31bb23.png' }} style={styles.bannerImage} />
                <TouchableOpacity style={styles.exploreButton}>
                    <Text style={styles.exploreButtonText}>KHÁM PHÁ ĐỒ NỮ</Text>
                </TouchableOpacity>
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>NỔI BẬT</Text>
                    {womenData.featured.map((item, index) => {
                        if (item === 'TẤT CẢ SẢN PHẨM') {
                            return (
                               <TouchableOpacity key={index} onPress={handleNavigateToShop}>
                                   <Text style={styles.menuItem}>{item}</Text>
                               </TouchableOpacity>
                           );
                       }
                       return (
                           <Text key={index} style={[styles.menuItem, (item.includes('Sản phẩm mới') || item.includes('SALE')) ? styles.highlightItem : null]}>{item}</Text>
                       );
                    })}
                </View>
                 {categories.women.map((cat) => (
                     <View key={cat.id} style={styles.menuSection}>
                        <Text style={styles.menuSectionTitle}>{cat.name.toUpperCase()}</Text>
                    </View>
                ))}
            </ScrollView>
        );
    }
    if (activeTab === 'THỂ THAO') {
       return (
           <ScrollView>
                 <Image source={{ uri: 'https://i.postimg.cc/5tBR6GVD/e87f614f-1508-4cfb-98dc-d236ccd95dd3.png' }} style={styles.bannerImage} />
                 <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>THỂ THAO NAM</Text>
                    {categories.sports.map((item) => (
                        <Text key={item.id} style={styles.sportsItem}>{item.name}</Text>
                    ))}
                </View>
                <View style={styles.menuSection}>
                    <Text style={styles.menuSectionTitle}>THỂ THAO NỮ</Text>
                </View>
           </ScrollView>
       )
    }
    return null;
  };

  const renderSearchContent = (): React.ReactNode => (
    <View style={styles.searchContainer}>
        <View style={styles.searchHeader}>
            <View style={styles.searchInputContainer}>
                {/* @ts-ignore */}
                <Icon name="search-outline" size={22} color="#888" />
                <TextInput placeholder="Tìm kiếm..." style={styles.searchInput}
                value={searchValue}
                onChangeText={setSearchValue}
                 returnKeyType="search"
                onSubmitEditing={() => handleSearchSubmit(searchValue)}
                />
            </View>
            <TouchableOpacity onPress={() => setSearchVisible(false)}>
              {/* @ts-ignore */}
                 <Icon name="close-outline" size={30} color="#000" /> 
            </TouchableOpacity>
        </View>
        <Text style={styles.searchTitle}>Từ khóa nổi bật ngày hôm nay</Text>
        <View style={styles.keywordContainer}>
            {['Áo thun', 'Quần Shorts', 'Áo Polo', 'Áo khoác'].map(keyword => (
                <TouchableOpacity key={keyword} style={styles.keywordChip}
                onPress={() => handleSearchSubmit(keyword)}
                >
                    <Text>{keyword}</Text>
                </TouchableOpacity>
            ))}
        </View>
        <Text style={styles.searchTitle}>Sản phẩm đã xem gần đây</Text>
        {/* <View style={styles.recentProduct}>
            <Image source={{ uri: 'https://n7media.coolmate.me/uploads/July2025/t-shirt-chay-bo-graphic-energy-1-5-do.jpg' }} style={styles.recentProductImage} />
            <Text style={styles.recentProductText}>Set đồ Áo thun và Quần short thể thao "Tự hào Vi...</Text>
        </View> */}
        <View style={styles.recentContainer}>
  <Text style={styles.recentTitle}>Sản phẩm đã xem gần đây</Text>

  {loadingRecent ? (
    <ActivityIndicator size="small" color="#000" />
  ) : recentViews.length === 0 ? (
    <Text style={styles.emptyText}>Chưa có sản phẩm nào được xem gần đây.</Text>
  ) : (
    <FlatList
      horizontal
      showsHorizontalScrollIndicator={false}
      data={recentViews}
  keyExtractor={(item) => item.product_id.toString()}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.recentProduct}
          onPress={() => router.push(`/productdetail/${item.product_id}`)}
        >
          <Image
            source={{ uri: item.product?.image_url }}
            style={styles.recentProductImage}
          />
          <Text numberOfLines={1} style={styles.recentProductText}>
            {item.product?.name}
          </Text>
        </TouchableOpacity>
      )}
    />
  )}
</View>
    </View>
  );


  const handleSearchSubmit = (query: string) => {
  if (query.trim()) {
    setSearchValue(''); 
    setSearchVisible(false); 
    
    router.push(`/shopbyfind?search=${encodeURIComponent(query.trim())}`);
  }
};
  return (
    <View>
      <View style={styles.mainHeader}>
        <TouchableOpacity onPress={() => setMenuVisible(true)}>
          {/* @ts-ignore */}
          <Icon name="menu-outline" size={30} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={() => setSearchVisible(true)}>
          {/* @ts-ignore */}
          <Icon name="search-outline" size={25} color="#000" />
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToHome}>
        <Image
          source={{uri: 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAT4AAACfCAMAAABX0UX9AAAAwFBMVEX////8rxcqKob8qgD8rAD8qAAbG4GVlbv+7tgYGIAAAHylpcYICH4oKIX8rQv//Pja2ub90JEjI4P+3q38v1VgYKDn5/ENDX7/9uVbW53OzuAgIIP92KD/+e8SEn8FBX3z8/jExNn+6sptbab+47uIiLX9xGn8syn8tzrm5vCxsc5CQpG7u9T+6ctnZ6N7e64yMor9zYI+Po/8ukX9yHSQkLqdncH8wFr9w2V1dar92qZRUZj90YxLS5X+5MD+4LNweehdAAAM4ElEQVR4nO2d2ULqPBeGix2glRaoQxGkFBVQxAlwQt3e/139lLFZWUmaVn/AL8/BPoDstHnJuPImappCoVAoFAqFQqFQKBQKhUKh+EUqnzWCz22/0H5RMQ0Cc9svtF9UjAKBkk8KJV8ulHy5UPLlQsmXCyVfLpR8uVDy5ULJlwslXy6UfLlQ8uVCyZcLJV8ulHy5UPLlQsmXCyVfLpR8uVDy5ULJlwslXy6UfLlQ8uVCyZcLJV8ulHy5+I/IF8XkzqUyA3zy1+WLOsXL2wMrCAPr4Pay2Iky5dL6V3u77sceqv51r3axFnEX5Ls5JREkj8j0NxEn5+KXE1hNd0XTCp2v4o3k+9Vr16ZueN5CIc8zdP34aKEgQ75WfUZpRn1BhZP7On0CUfok1bZD8CFI/0Kmbz+zEg5uHcs/gPiWczuQeL3va9PwCgBP15/qGlO+T3OGHmPOmQqeMTZJShLvVy2TxTsRpD+0ifRWkZUspLVbPiJsHqZ8uaOCTmm3wDAnLZZ8NfJj/UjwlGPyGfrW5Ru6ocsQL8YNHzspXu2ur+PaLQTUp39TvujE4Yk3f4xzH4nebGIyat66nGPwwZ+QrxM2BeLFNO0G9zn1AqhaCFDevyDfs7DqLXCdF85jrkRVD+MPyHcZpBIvpvzAfMq5KS/eX5DvPkyt3sFBeMl4SDb19l++Sxn1Zvrh9e8om3p7L183fctdUMZm3XcZ1dt3+QaOpHoHB86QekKLN9v7w/KdphxzSf0i+IRxhjH3L8j3xVqm8fDhIvs8c+Xbb/kOGcOGb9lhENpNhrhlMoLAarpxpGWGwZtM77N8UYA1Xd92vrqDYWM46H45NpbCtaNk/m+oPobZf5r+K5X+TScFk6ngPsv3YCHSBI+HG3Giw0cskmB1E9mXsFHXMD7riSQTnSHgHsuHjRtNG4b2Bja9HnaDaJPgFRk39CcQwGy94VObPZavS1e+8CSi/nt0RveQ9qb/rNO6eAWkOFdoHHCP5aMrX7uLZtAtw4Sutf7yiWqWxjUaO69T4Za9lm9IVaqAFcbv0knXwVNKPa/PyKX1p+Q7gdMSixUO0LR72P8135ffXFCzFqPFygUZZPZWvggu11yfk0cTNHQ3WH5BtV39HzsXen69t/J1YKygzdvMGMLur1xdfNEHLdJ4473K9Z+JNj+DcZdaipHA5Z292Hprwfao13m5UE19b+U7A3oE/J00ONA0Fx0l1MPjVj66+u2tfC7Zm3F7vhiLTO+P5p+eg66P1/Nh6fdVPjhyrIdSFpfk4OuW55/CkUMX2CXgJHtf5au2SfmoxRqVS+ATOHNrzbHhJTGORS9Pqre38jXAwBvw93BnT/04I/iaG4d64+Mk45ro5UFkdV/lg/OWtqyNKiNvuyafsNdKJR8dgf8dJqRQ25fPvxekTyfff7X2/Uzft1pFMDl9OSR4ieJPj85JBPMWquAM+YT+vjzykYOmeytIXyTXF8uRF6zCQnr7kWTg2ASLznKsE7cZ6sKRt0+UeyUfmA4a53K5SMl3Sk7ZhBPee3J9gc/7LDzUt6ELgi7O/FPQlRU8QS5wW2kp35T82Ojxc4EuQSn5NFDytqDdgfXFctXRRFcRbB7BKuVg/mlNsiDfuHz/wMeskOGSO5BcTj4L1YNFAzTTZfIPsOZ1+D9CA0yz/bP5x1egIMYT/9WP8TVvCarK14Na60jJBwKdrstN/Q5a3VI+uNMhmP/AgKm1iExTOx0Gd9VWZ0RcKiAbY8J9GSrGKCUfGAsOQt6C6xRu5i7lo2L13IlzFQZXw2WABhSkYHCvEn5jxPuoSIzODFlrVE8pKx+csyU2bmhOYJydFW3mBvxuYWR/Nc3uUTWBE/CjjVgr+eAQxIu6woFDVj7KHdBk71IMqF2yVVdJ+VsCtvW2CKvqsuujO7+Cdy1R7rV8VDb6NzOb15zyUaFOdsmr9G7kSj4wm45rFCtiOqRsbOv+AvZavFkHYsQymdkwR49P2lIjKd+A2jhs4/o1EBfLSj6q9R64DP2G1G/gtqPVl1TrLeiM0fcYMWqsz7TRXgUD1wSzc0nKF9HGE3SHe1jGDCqreQ61+8iwzr/QNbi5sejCOVhcmldk+G1dYzaXtXxU651lc4W8zASzc0nKpz3QvhP7Fk7confU/LiWr4E4S4MzeMDw5gOx7yYDDNTu2azieNTad4qf1dqcqMSqZg/+DKU+ajWSle8GKbnv3CcFjIpl/KzLZpZNdaHzXB6SuVTfHSQRMVQh9SY+PnSRfN9v1mGtjXxYozT0WnICU3pjHB2RlQ/uPCxL1R4VG/Ep5qg6OAsshu92Ix81mVvkUh49d6pRFFU7zyP0J3DJ6BZS/eIjlIWnq3p8Hrr0PTFYxwQT8iHD8lzA42mpVdEqrYtan5mLtHynuKXbtQLHdi2nbPtM03JijfeOGPwOYnNpGJ9hLYfI8dQYm+xnWbZ6Y24tjf9hlJqQj54ML3+HWQ6GZ8QHhJm5SMunPVPTjrWEArd3Qj5kCEoBtUikB9/UJE+TQ8NCeuTl0x6zuLqBfFpH/lzCbNyAu0p4u5OWD7Wp/pZ8yIRYXj7EeiYEsbFlPhVD3mVQy+rQzyCfdpil5kD5tI80R1GJ/47tDWQuOHkVBDax/i35stQcWr5oJNcJNPGtAXQ2Ky1fJWP3l0k+2dN8qHxadCCjX3MU4e/ylk0/cBFJCzPw/pZ82fSDwelolL79Wiz1suoH73HJpl9G+bQHKhwlL99s9ZH2Vwh5e6KTLOMHdQ1OC1+W/Y582HKeAo82J+mmGsVdh3kDzBzGslZOPq1yLF+NM8unNUS3OLjhl3hnqRPi6w/i/1kiF1GJew1JDFWzsEuYaqJLEbxCnn1ekugSW9Sv8Z3OIM09Lg/cXOahhBQv88k+vRYX25zAnU30DivBz2D0W3lcBpDGbZlVdDcc3aS8Rah64kD7/CabpnOSzgNT7zEF9PTxrJQVUhnGFWDnnGOYZo+KUuSST9OGozZadKsdS5XyEiatelm2sd/BD4NLkQNmQ32iY32gYY4XMUByj5Z1g1qlxojS6IU4mzwWIYzGezkA8RHfdh7msc+08sUHKL+csJkI1ri+FTofg0jqXVrTMRkf8QzdeFqVsGWm/BOf37NcgIKevnS//LR8MzrdW6cc2laz2bTssOycrQ6WppdvRjTsfpSddhCGYdB2grNuJ8rwLq2rp7GxuBJNN43X82Txpsm/Mcs1JbSOegUzDnoZXmw/Mo3eKnyfR76oQZL4qjo8fH64fO++DBKtTUq+xROq1U6nU61GEm9F0yrNb+RLc7de/YIgoUbr7uj8qdebfJ5fJTaQc/n72kGSzaYXAygf7yalLfG5rKnL+iq0ueUZOoC/T+hKBp4OewflI/19nJ32JT/o7wtFF+sBfx/XEbMlpqmmM2uoWwC5J8EgpHxCYyNYtQlOX20F4O/T7/jJKT+bzN2lwO/oPvJTw/00kZtyGwA9RC7BT2goknoY2KUs86sTNPI5Us/6PwFdlvzqRCYueK9Sz3ohBfG/eInhbpovcpJvBTiUcr3hlKVVeJaJgDpQxRsM4GUtwq5yK1B2W549ElS+gn7BSYwAKpQbsG++powsuzhy0N5wb8xOS5//lxo5aG+Uz4yhR9QtSjvZ9VGdX0Fnupu/YVRbsuvTtCE0PbF2cCJqM51jRN0qtMmXod8VtSeAGtm4UPYf38dCwQ36DjTBML01aJugfoz1f8gdqYJhGgHe4xBvRDxEVCp6C8MXTBK3B73F69EnA+tjOg7N9/KjnLYR023YTa5+T18sZP9iF1dsC44w021/Svj7elgIlTtIM0DvjrOc2+6wehOdVjsvH2Xs6j3RCmWb0MLE2ujj2r9Sq1UvfT/10X0A0QoFJcK3Fn0rLPOceW3RucktgrpUF/6++V+jYOx+yM5aFhzKXhg8V/dMnPH2gOfdUiE8+ssAHulLgeuI/rDMVqEOvKWAN73mcirvDHV2dtxYkOHqcf6dTzyknaF2mo3urdKTrX+m8PA/mxc5/SzR3zTaAcZy/iBTLtQCoC/F5MDwNe4WFfToEQv2ujgd3bZYtlXd2wf15PTLq56mFdP6w+09aLlzKsiyjNFy5RdrFEOBMWqBm8oetSOks1l6JvvArwQ3I/EEphns8GKD5op3DGnVcPuZZyyAYptvkPQd5C7rnab1KjBIevoPNNwVN/cOW0A3SPX36XaMC/bxv7jdvv5U1VtQvXdQZ57bdEZ71W43XOHxlYJnmK8/YEcDnL6MHJuwSLq+VbYfRHbkHeZuYsBTlDPt+rWfrXlrbg4vH2ODX0wYONZZcY+1W3D3OXcJzi8X03Wz8Db9Je2WRI3OIL4dbtjY6diKDPW7q/Pz2vn0312GqLJCoVAoFAqFQqFQKBQKhUKxQ/wPYckilR50rKkAAAAASUVORK5CYII='}}
          style={styles.logo}
        />
        </TouchableOpacity>
        {/* <TouchableOpacity onPress={handleNavigateToLogin}>
          <Icon name="person-outline" size={25} color="#000" />
        </TouchableOpacity> */}

          {user ? (
            <TouchableOpacity onPress={() => router.push('/profile')}>
              <Text style={{ fontWeight: "bold", fontSize: 14, marginRight: 10 }}>
                {user.username}
              </Text>
            </TouchableOpacity>
          ) : (
            <TouchableOpacity onPress={handleNavigateToLogin}>
              {/* @ts-ignore */}
              <Icon name="person-outline" size={25} color="#000" />
            </TouchableOpacity>
          )}
          
        <TouchableOpacity onPress={handleNavigateToCart}>
          {/* @ts-ignore */}
          <Icon name="lock-closed-outline" size={25} color="#000" />
          {/* <TouchableOpacity > */}
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>0</Text>
            </View>
          {/* </TouchableOpacity> */}
        </TouchableOpacity>
      </View>

      <Modal
        animationType="slide"
        transparent={false}
        visible={menuVisible}
        onRequestClose={() => setMenuVisible(false)}
      >
        <View style={styles.modalContainer}>
             <View style={styles.modalHeader}>
                <TouchableOpacity onPress={() => setMenuVisible(false)}>
                    {/* @ts-ignore */}
                    <Icon name="close-outline" size={30} color="#000" />
                </TouchableOpacity>
            </View>
            <View style={styles.searchInMenu}>
                  {/* @ts-ignore */}
                 <Icon name="search-outline" size={22} color="#888" />
                 <TextInput placeholder="Tìm kiếm..." style={styles.searchInput} />
            </View>
            <View style={styles.tabContainer}>
                <TouchableOpacity onPress={() => setActiveTab('NAM')} style={[styles.tab, activeTab === 'NAM' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'NAM' && styles.activeTabText]}>NAM</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('NỮ')} style={[styles.tab, activeTab === 'NỮ' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'NỮ' && styles.activeTabText]}>NỮ</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setActiveTab('THỂ THAO')} style={[styles.tab, activeTab === 'THỂ THAO' && styles.activeTab]}>
                    <Text style={[styles.tabText, activeTab === 'THỂ THAO' && styles.activeTabText]}>THỂ THAO</Text>
                </TouchableOpacity>
            </View>
            {renderMenuContent()}
        </View>
      </Modal>

       <Modal
            animationType="fade"
            transparent={false}
            visible={searchVisible}
            onRequestClose={() => setSearchVisible(false)}
       >
           {renderSearchContent()}
       </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  topBar: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#666',
    paddingVertical: 8,
  },
  topBarText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
    marginHorizontal: 10,
  },
  separator: {
    height: '60%',
    width: 1,
    backgroundColor: '#fff',
  },
  mainHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingVertical: 10,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    marginTop: 50,
  },
  logo: {
    width: 120,
    height: 40,
    resizeMode: 'contain',
  },
  cartBadge: {
    position: 'absolute',
    right: -8,
    top: -5,
    backgroundColor: 'red',
    borderRadius: 10,
    width: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  modalContainer: {
    flex: 1,
    paddingTop: 40,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  modalLogo: {
      width: 100,
      height: 30,
      resizeMode: 'contain',
  },
  searchInMenu: {
      flexDirection: 'row',
      alignItems: 'center',
      backgroundColor: '#f5f5f5',
      margin: 15,
      paddingHorizontal: 10,
      borderRadius: 8,
  },
  tabContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    paddingHorizontal: 15,
  },
  tab: {
    paddingVertical: 15,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  tabText: {
    fontSize: 16,
    color: '#888',
    fontWeight: 'bold',
  },
  activeTabText: {
    color: '#000',
  },
  bannerImage: {
      width: '90%',
      height: 150,
      resizeMode: 'cover',
      alignSelf: 'center',
      marginVertical: 24,
      borderRadius: 8,
  },
  exploreButton: {
      backgroundColor: '#000',
      padding: 15,
      marginHorizontal: 15,
      marginBottom: 15,
      alignItems: 'center',
      borderRadius: 5,
  },
  exploreButtonText: {
      color: '#fff',
      fontWeight: 'bold',
  },
  menuSection: {
      paddingHorizontal: 20,
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: '#f0f0f0',
  },
  menuSectionTitle: {
      fontWeight: 'bold',
      fontSize: 16,
      marginBottom: 10,
  },
  menuItem: {
      paddingVertical: 8,
      fontSize: 15,
  },
  highlightItem: {
      color: 'red',
  },
  sportsItem: {
      paddingVertical: 8,
      fontSize: 15,
  },
  searchContainer: {
    flex: 1,
    paddingTop: 50,
    paddingHorizontal: 15,
  },
  searchHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f5f5f5',
    borderRadius: 8,
    paddingHorizontal: 10,
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    paddingVertical: 10,
    fontSize: 16,
  },
  searchTitle: {
      marginTop: 20,
      marginBottom: 15,
      fontWeight: 'bold',
      fontSize: 16,
  },
  keywordContainer: {
      flexDirection: 'row',
      flexWrap: 'wrap',
  },
  keywordChip: {
      backgroundColor: '#f0f0f0',
      paddingVertical: 8,
      paddingHorizontal: 15,
      borderRadius: 20,
      margin: 5,
  },
  // recentProduct: {
  //     alignItems: 'center',
  //     width: 150,
  // },
  // recentProductImage: {
  //     width: 150,
  //     height: 220,
  //     backgroundColor: '#f0f0f0'
  // },
  // recentProductText: {
  //     marginTop: 5,
  //     textAlign: 'center'
  // },

  recentContainer: {
  marginTop: 20,
},
recentTitle: {
  fontWeight: 'bold',
  fontSize: 18,
  marginBottom: 10,
},
recentProduct: {
  width: 120,
  marginRight: 10,
},
recentProductImage: {
  width: 120,
  height: 120,
  borderRadius: 10,
},
recentProductText: {
  marginTop: 5,
  fontSize: 14,
  color: '#333',
},
emptyText: {
  color: '#777',
  fontStyle: 'italic',
},
});

export default Header;