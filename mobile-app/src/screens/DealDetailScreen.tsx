import React, { useEffect, useState } from 'react';
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
import { supabase } from '../lib/supabase';

type DealDetailRouteProp = RouteProp<RootStackParamList, 'DealDetail'>;

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
  state?: string;
  warranty_info?: string;
  specs: Record<string, string>;
  created_at: string;
  deal_url?: string; // add this for dynamic links
}

const DealDetailScreen: React.FC = () => {
  const route = useRoute<DealDetailRouteProp>();
  const navigation = useNavigation();
  const { dealId } = route.params;

  const [deal, setDeal] = useState<Deal | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDeal();
  }, [dealId]);

  const loadDeal = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from<Deal>('deals')
      .select('*')
      .eq('id', dealId)
      .single();

    if (error || !data) {
      Alert.alert('Error', 'Deal not found');
      navigation.goBack();
      return;
    }
    setDeal(data);
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

  const handleGetDeal = () => {
    if (!deal?.deal_url) {
      Alert.alert('Link unavailable');
      return;
    }
    Alert.alert(
      'Open Deal',
      `Open this deal on ${deal.merchant}?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Open',
          onPress: () => Linking.openURL(deal.deal_url!),
        },
      ],
      { cancelable: true }
    );
  };

  const handleVote = async (voteType: 'up' | 'down') => {
    if (!deal) return;

    // Optimistic update UI
    setDeal({
      ...deal,
      upvotes: voteType === 'up' ? deal.upvotes + 1 : deal.upvotes,
      downvotes: voteType === 'down' ? deal.downvotes + 1 : deal.downvotes,
    });

    const columnToIncrement = voteType === 'up' ? 'upvotes' : 'downvotes';

    const { error } = await supabase
      .from('deals')
      .update({ [columnToIncrement]: deal[columnToIncrement] + 1 })
      .eq('id', deal.id);

    if (error) {
      Alert.alert('Error', 'Failed to record vote.');
      // Optionally revert UI here
    } else {
      Alert.alert('Vote recorded', `You voted ${voteType} for this deal!`);
    }
  };

  if (loading || !deal) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </SafeAreaView>
    );
  }

  return (
    <
