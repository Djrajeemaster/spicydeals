import React from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  Linking,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';
import { useRoute, useNavigation } from '@react-navigation/native';
import type { RouteProp } from '@react-navigation/native';
import type { RootStackParamList } from '../../App';
import type { StackNavigationProp } from '@react-navigation/stack';

type DealDetailRouteProp = RouteProp<RootStackParamList, 'DealDetail'>;
type NavigationProp = StackNavigationProp<RootStackParamList, 'DealDetail'>;

const DealDetailScreen: React.FC = () => {
  const route = useRoute<DealDetailRouteProp>();
  const navigation = useNavigation<NavigationProp>();
  const { dealId } = route.params;

  // Mock deal (replace with API call using dealId in real app)
  const deal = {
    id: dealId,
    title: 'iPhone 15 Pro Max 256GB - Natural Titanium',
    brand: 'Apple',
    category: 'Mobiles',
    description:
      'Latest iPhone with A17 Pro chip, titanium design, and advanced camera system. Perfect for photography enthusiasts and power users.',
    original_price: 159900,
    deal_price: 149900,
    discount_percentage: 6,
    merchant: 'Amazon',
    image_url:
      'https://images.pexels.com/photos/788946/pexels-photo-788946.jpeg?auto=compress&cs=tinysrgb&w=400',
    upvotes: 45,
    downvotes: 3,
    is_verified: true,
    is_promoted: true,
    city: 'Mumbai',
    state: 'Maharashtra',
    warranty_info: '1 Year Apple Warranty',
    specs: {
      storage: '256GB',
      color: 'Natural Titanium',
      ram: '8GB',
      display: '6.7-inch Super Retina XDR',
      processor: 'A17 Pro chip',
    },
    created_at: '2024-01-15T10:30:00Z',
  };

  const formatPrice = (price: number): string => {
    if (typeof price !== 'number' || !Number.isFinite(price)) {
      return '₹0';
    }
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0,
    }).format(price);
  };

  const handleGetDeal = () => {
    Alert.alert('Open Deal', `Open this deal on ${deal.merchant}?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Open',
        onPress: () => Linking.openURL('https://amazon.in'),
      },
    ]);
  };

  const handleVote = (type: 'up' | 'down') => {
    Alert.alert('Vote Recorded', `You voted ${type}`);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollView}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: deal.image_url }} style={styles.heroImage} />
          {deal.is_promoted && (
            <View style={styles.promotedBadge}>
              <Ionicons name="star" size={16} color="#fff" />
              <Text style={styles.promotedText}>Promoted</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title}>{deal.title}</Text>
          <Text style={styles.brandCategory}>
            {deal.brand} • {deal.category}
          </Text>

          <View style={styles.priceSection}>
            <Text style={styles.dealPrice}>{formatPrice(deal.deal_price)}</Text>
            <View style={styles.priceDetails}>
              <Text style={styles.originalPrice}>
                {formatPrice(deal.original_price)}
              </Text>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{deal.discount_percentage}% OFF</Text>
              </View>
            </View>
          </View>

          <View style={styles.actionSection}>
            <Button
              mode="contained"
              onPress={handleGetDeal}
              style={styles.getDealButton}
              contentStyle={styles.getDealButtonContent}
            >
              <Ionicons name="open-outline" size={20} color="#fff" />
              <Text style={styles.getDealButtonText}>Get This Deal</Text>
            </Button>

            <View style={styles.voteSection}>
              <TouchableOpacity style={styles.voteButton} onPress={() => handleVote('up')}>
                <Ionicons name="thumbs-up-outline" size={24} color="#10b981" />
                <Text style={styles.voteText}>{deal.upvotes}</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.voteButton} onPress={() => handleVote('down')}>
                <Ionicons name="thumbs-down-outline" size={24} color="#ef4444" />
                <Text style={styles.voteText}>{deal.downvotes}</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{deal.description}</Text>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            <View style={styles.specsContainer}>
              {Object.entries(deal.specs).map(([key, value]) => (
                <View key={key} style={styles.specRow}>
                  <Text style={styles.specKey}>{key.charAt(0).toUpperCase() + key.slice(1)}</Text>
                  <Text style={styles.specValue}>{value}</Text>
                </View>
              ))}
            </View>
          </View>

          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Store Information</Text>
            <View style={styles.storeInfo}>
              <View style={styles.storeRow}>
                <Ionicons name="storefront-outline" size={20} color="#6b7280" />
                <Text style={styles.storeText}>{deal.merchant}</Text>
                {deal.is_verified && <Ionicons name="checkmark-circle" size={20} color="#10b981" />}
              </View>

              <View style={styles.storeRow}>
                <Ionicons name="location-outline" size={20} color="#6b7280" />
                <Text style={styles.storeText}>
                  {deal.city}, {deal.state}
                </Text>
              </View>

              <View style={styles.storeRow}>
                <Ionicons name="shield-checkmark-outline" size={20} color="#6b7280" />
                <Text style={styles.storeText}>{deal.warranty_info}</Text>
              </View>
            </View>
          </View>

          <View style={styles.badgesSection}>
            {deal.is_verified && (
              <Chip icon="check-circle" style={styles.verifiedChip}>
                Verified Deal
              </Chip>
            )}
            <Chip icon="store" style={styles.merchantChip}>
              {deal.merchant}
            </Chip>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f9fafb' },
  scrollView: { flex: 1 },
  imageContainer: { height: 300, position: 'relative' },
  heroImage: { width: '100%', height: '100%', resizeMode: 'cover' },
  promotedBadge: {
    position: 'absolute',
    top: 16,
    right: 16,
    backgroundColor: '#f97316',
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  promotedText: { color: '#fff', fontSize: 12, fontWeight: 'bold', marginLeft: 4 },
  content: { padding: 20 },
  title: { fontSize: 24, fontWeight: 'bold', color: '#111827', marginBottom: 8 },
  brandCategory: { fontSize: 16, color: '#6b7280', marginBottom: 20 },
  priceSection: { marginBottom: 24 },
  dealPrice: { fontSize: 32, fontWeight: 'bold', color: '#10b981', marginBottom: 8 },
  priceDetails: { flexDirection: 'row', alignItems: 'center' },
  originalPrice: {
    fontSize: 18,
    color: '#6b7280',
    textDecorationLine: 'line-through',
    marginRight: 12,
  },
  discountBadge: {
    backgroundColor: '#fef2f2',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  discountText: { fontSize: 12, fontWeight: 'bold', color: '#dc2626' },
  actionSection: { marginBottom: 32 },
  getDealButton: { backgroundColor: '#f97316', marginBottom: 16 },
  getDealButtonContent: { paddingVertical: 8 },
  getDealButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
    marginLeft: 8,
  },
  voteSection: { flexDirection: 'row', justifyContent: 'center', gap: 32 },
  voteButton: { alignItems: 'center', padding: 8 },
  voteText: { fontSize: 14, fontWeight: '600', color: '#374151', marginTop: 4 },
  section: { marginBottom: 24 },
  sectionTitle: { fontSize: 18, fontWeight: '600', color: '#111827', marginBottom: 12 },
  description: { fontSize: 16, color: '#374151', lineHeight: 24 },
  specsContainer: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f3f4f6',
  },
  specKey: { fontSize: 14, color: '#6b7280', fontWeight: '500' },
  specValue: { fontSize: 14, color: '#111827', fontWeight: '600' },
  storeInfo: { backgroundColor: '#fff', borderRadius: 12, padding: 16 },
  storeRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 12 },
  storeText: { fontSize: 14, color: '#374151', marginLeft: 12, flex: 1 },
  badgesSection: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  verifiedChip: { backgroundColor: '#dcfce7' },
  merchantChip: { backgroundColor: '#dbeafe' },
});

export default DealDetailScreen;
