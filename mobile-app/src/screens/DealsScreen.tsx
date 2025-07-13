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
import { supabase } from '../lib/supabase';

interface Deal {
  id: string;
  title: string;
  brand: string;
  category: string;
  description: string;
  original_price: number;
  deal_price: number;
  discount_percentage: number;
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
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [cities, setCities] = useState<string[]>([]);

  const categories = ['Mobiles', 'Laptops', 'Audio', 'Gaming', 'Cameras'];

  useEffect(() => {
    loadCities();
    loadDeals();

    // Subscribe to real-time changes on deals table
    const subscription = supabase
      .from<Deal>('deals')
      .on('*', payload => {
        // Simple re-fetch on any change
        loadDeals();
      })
      .subscribe();

    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const loadCities = async () => {
    const { data, error } = await supabase
      .from('deals')
      .select('city')
      .neq('city', null)
      .limit(100); // limit to avoid huge queries

    if (!error && data) {
      // Extract unique cities
      const uniqueCities = Array.from(new Set(data.map(d => d.city!))).sort();
      setCities(uniqueCities);
    }
  };

  const loadDeals = async () => {
    setLoading(true);
    let query = supabase.from<Deal>('deals').select('*');

    if (selectedCategory) {
      query = query.eq('category', selectedCategory);
    }
    if (selectedCity) {
      query = query.eq('city', selectedCity);
    }
    if (searchQuery.trim() !== '') {
      // Using ilike for case-insensitive search
      query = query.ilike('title', `%${searchQuery}%`);
    }
    const { data, error } = await query.order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Error', error.message);
      setLoading(false);
      return;
    }
    if (data) {
      setDeals(data);
    }
    setLoading(false);
  };

  const formatPrice = (price: number): string => {
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleVote = async (dealId: string, voteType: 'up' | 'down') => {
    const deal = deals.find(d => d.id === dealId);
    if (!deal) return;

    // Update vote count locally for immediate UI feedback
    setDeals(prev =>
      prev.map(d =>
        d.id === dealId
          ? {
              ...d,
              upvotes: voteType === 'up' ? d.upvotes + 1 : d.upvotes,
              downvotes: voteType === 'down' ? d.downvotes + 1 : d.downvotes,
            }
          : d
      )
    );

    // Persist vote in Supabase (you need a votes table or update counters here)
    const columnToIncrement = voteType === 'up' ? 'upvotes' : 'downvotes';
    const { error } = await supabase
      .from('deals')
      .update({ [columnToIncrement]: deal[columnToIncrement] + 1 })
      .eq('id', dealId);

    if (error) {
      Alert.alert('Error', 'Failed to record vote.');
      // Optionally revert UI changes here if you want
    }
  };

  const handleDealPress = (dealId: string) => {
    navigation.navigate('DealDetail', { dealId });
  };

  // Apply client-side filtering for search (if needed)
  const filteredDeals = deals.filter(deal => {
    if (!searchQuery.trim()) return true;
    const lowerQuery = searchQuery.toLowerCase();
    return (
      deal.title.toLowerCase().includes(lowerQuery) ||
      deal.brand.toLowerCase().includes(lowerQuery)
    );
  });

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>SpicyBeats</Text>
      </View>

      <Searchbar
        placeholder="Search deals..."
        onChangeText={setSearchQuery}
        value={searchQuery}
        onSubmitEditing={loadDeals}
        style={styles.searchBar}
      />

      <View style={styles.filterRow}>
        <FlatList
          horizontal
          data={categories}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCategory === item}
              onPress={() => {
                const next = selectedCategory === item ? null : item;
                setSelectedCategory(next);
              }}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />

        <FlatList
          horizontal
          data={cities}
          keyExtractor={item => item}
          showsHorizontalScrollIndicator={false}
          style={{ marginTop: 8 }}
          renderItem={({ item }) => (
            <Chip
              selected={selectedCity === item}
              onPress={() => {
                const next = selectedCity === item ? null : item;
                setSelectedCity(next);
              }}
              style={styles.chip}
            >
              {item}
            </Chip>
          )}
        />
      </View>

      <FlatList
        data={filteredDeals}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[styles.dealCard, item.is_promoted && styles.promotedCard]}
            onPress={() => handleDealPress(item.id)}
          >
            {item.is_promoted && (
              <View style={styles.promotedBadge}>
                <Ionicons name="star" size={12} color="#fff" />
                <Text style={styles.promotedText}>Promoted</Text>
              </View>
            )}

            <View style={styles.dealContent}>
              <Image source={{ uri: item.image_url }} style={styles.dealImage} />

              <View style={styles.dealInfo}>
                <Text style={styles.dealTitle} numberOfLines={2}>
                  {item.title}
                </Text>

                <View style={styles.priceContainer}>
                  <Text style={styles.dealPrice}>{formatPrice(item.deal_price)}</Text>
                  {item.original_price > item.deal_price && (
                    <Text style={styles.originalPrice}>{formatPrice(item.original_price)}</Text>
                  )}
                  <View style={styles.discountBadge}>
                    <Text style={styles.discountText}>{item.discount_percentage}% OFF</Text>
                  </View>
                </View>

                <Text style={styles.description} numberOfLines={2}>
                  {item.description}
                </Text>

                <View style={styles.dealFooter}>
                  <View style={styles.merchantContainer}>
                    <Text style={styles.merchantText}>{item.merchant}</Text>
                    {item.is_verified && (
                      <Ionicons name="checkmark-circle" size={16} color="#10b981" />
                    )}
                  </View>

                  <View style={styles.voteContainer}>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(item.id, 'up')}
                    >
                      <Ionicons name="thumbs-up-outline" size={16} color="#10b981" />
                    </TouchableOpacity>
                    <Text style={styles.voteCount}>{item.upvotes - item.downvotes}</Text>
                    <TouchableOpacity
                      style={styles.voteButton}
                      onPress={() => handleVote(item.id, 'down')}
                    >
                      <Ionicons name="thumbs-down-outline" size={16} color="#ef4444" />
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        )}
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

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  header: {
    padding: 16,
    backgroundColor: '#fff',
    borderBottomColor: '#e5e7eb',
    borderBottomWidth: 1,
    alignItems: 'center',
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
  filterRow: {
    paddingHorizontal: 16,
  },
  chip: {
    marginRight: 8,
    marginBottom: 8,
  },
  dealsList: {
    paddingHorizontal: 16,
    paddingBottom: 80,
  },
  dealCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  promotedCard: {
    borderWidth: 2,
    borderColor: '#f97316',
  },
  promotedBadge: {
    position: 'absolute',
    top: 8,
    right: 8,
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
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
