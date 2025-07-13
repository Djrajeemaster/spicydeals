import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Image,
  StyleSheet,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, FAB, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import type { StackNavigationProp } from '@react-navigation/stack';
import type { RootStackParamList } from '../../App';

// Types
interface Deal {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  original_price: any;
  deal_price: any;
  discount_percentage: any;
  merchant: string;
  image_url: string;
  upvotes: number;
  downvotes: number;
  is_verified: boolean;
  is_promoted: boolean;
  city?: string;
  created_at: string;
}

type NavigationProp = StackNavigationProp<RootStackParamList, 'Main'>;

const DealsScreen: React.FC = () => {
  const navigation = useNavigation<NavigationProp>();
  const [deals, setDeals] = useState<Deal[]>([]);
  const [loading, setLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  const categories = ['Mobiles', 'Laptops', 'Audio', 'Gaming', 'Cameras'];

  const mockDeals: Deal[] = [
    {
      id: '1',
      title: 'iPhone 15 Pro Max 256GB',
      brand: 'Apple',
      category: 'Mobiles',
      description: 'Latest iPhone with A17 Pro chip, titanium design',
      original_price: 159900,
      deal_price: 149900,
      discount_percentage: 6,
      merchant: 'Amazon',
      image_url: 'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 45,
      downvotes: 3,
      is_verified: true,
      is_promoted: true,
      city: 'Mumbai',
      created_at: '2024-01-15T10:30:00Z',
    },
    {
      id: '2',
      title: 'Samsung Galaxy S24 Ultra 512GB',
      brand: 'Samsung',
      category: 'Mobiles',
      description: 'Flagship Samsung phone with S Pen, 200MP camera',
      original_price: 139999,
      deal_price: 119999,
      discount_percentage: 14,
      merchant: 'Flipkart',
      image_url: 'https://images.pexels.com/photos/404280/pexels-photo-404280.jpeg?auto=compress&cs=tinysrgb&w=400',
      upvotes: 32,
      downvotes: 1,
      is_verified: true,
      is_promoted: false,
      city: 'Delhi',
      created_at: '2024-01-14T15:45:00Z',
    },
  ];

  useEffect(() => {
    loadDeals();
  }, []);

  const sanitizeDeals = (data: Deal[]): Deal[] => {
    return data.filter(deal =>
      !isNaN(Number(deal.deal_price)) &&
      !isNaN(Number(deal.original_price)) &&
      !isNaN(Number(deal.discount_percentage))
    );
  };

  const loadDeals = async () => {
    setLoading(true);
    setTimeout(() => {
      setDeals(sanitizeDeals(mockDeals));
      setLoading(false);
    }, 1000);
  };

  const formatPrice = (price: any): string => {
    const num = Number(price);
    if (isNaN(num) || !isFinite(num)) {
      console.warn('Invalid price value:', price);
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(num);
  };

  const handleVote = (dealId: string, voteType: 'up' | 'down') => {
    setDeals(prevDeals =>
      prevDeals.map(deal => {
        if (deal.id === dealId) {
          return {
            ...deal,
            upvotes: voteType === 'up' ? deal.upvotes + 1 : deal.upvotes,
            downvotes: voteType === 'down' ? deal.downvotes + 1 : deal.downvotes,
          };
        }
        return deal;
      })
    );
  };

  const handleDealPress = (dealId: string) => {
    navigation.navigate('DealDetail', { dealId });
  };

  const filteredDeals = deals.filter(deal => {
    const matchesSearch = deal.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      deal.brand.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = !selectedCategory || deal.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const renderDealCard = ({ item: deal }: { item: Deal }) => (
    <TouchableOpacity
      style={[styles.dealCard, deal.is_promoted && styles.promotedCard]}
      onPress={() => handleDealPress(deal.id)}
    >
      {deal.is_promoted && (
        <View style={styles.promotedBadge}>
          <Ionicons name="star" size={12} color="#fff" />
          <Text style={styles.promotedText}>Promoted</Text>
        </View>
      )}

      <View style={styles.dealContent}>
        <Image source={{ uri: deal.image_url }} style={styles.dealImage} />

        <View style={styles.dealInfo}>
          <Text style={styles.dealTitle} numberOfLines={2}>
            {deal.title}
          </Text>

          <View style={styles.priceContainer}>
            <Text style={styles.dealPrice}>{formatPrice(deal.deal_price)}</Text>
            {Number(deal.original_price) > Number(deal.deal_price) && (
              <Text style={styles.originalPrice}>{formatPrice(deal.original_price)}</Text>
            )}
            <View style={styles.discountBadge}>
              <Text style={styles.discountText}>
                {Number.isFinite(Number(deal.discount_percentage)) ? `${deal.discount_percentage}% OFF` : ''}
              </Text>
            </View>
          </View>

          <Text style={styles.description} numberOfLines={2}>
            {deal.description}
          </Text>

          <View style={styles.dealFooter}>
            <View style={styles.merchantContainer}>
              <Text style={styles.merchantText}>{deal.merchant}</Text>
              {deal.is_verified && (
                <Ionicons name="checkmark-circle" size={16} color="#10b981" />
              )}
            </View>

            <View style={styles.voteContainer}>
              <TouchableOpacity
                style={styles.voteButton}
                onPress={() => handleVote(deal.id, 'up')}
              >
                <Ionicons name="thumbs-up-outline" size={16} color="#10b981" />
              </TouchableOpacity>
              <Text style={styles.voteCount}>
                {Number.isFinite(deal.upvotes - deal.downvotes) ? (deal.upvotes - deal.downvotes) : 0}
              </Text>
              <TouchableOpacity
                style={styles.voteButton}
                onPress={() => handleVote(deal.id, 'down')}
              >
                <Ionicons name="thumbs-down-outline" size={16} color="#ef4444" />
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SpicyBeats</Text>
        <TouchableOpacity>
          <Ionicons name="notifications-outline" size={24} color="#374151" />
        </TouchableOpacity>
      </View>

      <Searchbar
        placeholder="Search electronics deals..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        style={styles.searchBar}
      />

      <View style={styles.categoriesContainer}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={categories}
          keyExtractor={(item) => item}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => setSelectedCategory(selectedCategory === item ? null : item)}
              style={styles.categoryChip}
              textStyle={styles.categoryText}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={(item) => item.id}
        renderItem={renderDealCard}
        refreshControl={<RefreshControl refreshing={loading} onRefresh={loadDeals} />}
        contentContainerStyle={styles.dealsList}
        showsVerticalScrollIndicator={false}
      />

      <FAB
        icon="plus"
        style={styles.fab}
        onPress={() => Alert.alert('Coming Soon', 'Deal submission feature coming soon!')}
      />
    </SafeAreaView>
  );
};

// Styles remain unchanged...
const styles = StyleSheet.create({
  // ... your same styles
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
  },
  searchBar: {
    margin: 16,
    elevation: 2,
  },
  categoriesContainer: {
    paddingHorizontal: 16,
    marginBottom: 16,
  },
  categoryChip: {
    marginRight: 8,
  },
  categoryText: {
    fontSize: 12,
  },
  dealsList: {
    paddingHorizontal: 16,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  promotedCard: {
    borderWidth: 2,
    borderColor: '#f97316',
  },
  promotedBadge: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderTopRightRadius: 12,
    borderBottomLeftRadius: 8,
    zIndex: 1,
  },
  promotedText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: 'bold',
    marginLeft: 4,
  },
  dealContent: {
    flexDirection: 'row',
    padding: 16,
  },
  dealImage: {
    width: 80,
    height: 80,
    borderRadius: 8,
    marginRight: 12,
  },
  dealInfo: {
    flex: 1,
  },
  dealTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 8,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  dealPrice: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#10b981',
    marginRight: 8,
  },
  originalPrice: {
    fontSize: 14,
    color: '#6b7280',
    textDecorationLine: 'line-through',
    marginRight: 8,
  },
  discountBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 12,
  },
  discountText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#dc2626',
  },
  description: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 12,
  },
  dealFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  merchantContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  merchantText: {
    fontSize: 12,
    color: '#3b82f6',
    fontWeight: '500',
    marginRight: 4,
  },
  voteContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  voteButton: {
    padding: 4,
  },
  voteCount: {
    fontSize: 12,
    fontWeight: '600',
    color: '#374151',
    marginHorizontal: 8,
  },
  fab: {
    position: 'absolute',
    margin: 16,
    right: 0,
    bottom: 0,
    backgroundColor: '#f97316',
  },
});

export default DealsScreen;
