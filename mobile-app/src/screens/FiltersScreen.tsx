import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Button, Chip, TextInput } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const FiltersScreen: React.FC = () => {
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedBrand, setSelectedBrand] = useState<string | null>(null);
  const [selectedCity, setSelectedCity] = useState<string | null>(null);
  const [dealType, setDealType] = useState<'all' | 'online' | 'physical'>('all');
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [sortBy, setSortBy] = useState('newest');

  const categories = [
    'Mobiles', 'Laptops', 'Tablets', 'Cameras', 'Audio', 'Gaming',
    'Smart TV', 'Accessories', 'Components', 'Wearables'
  ];

  const brands = [
    'Apple', 'Samsung', 'OnePlus', 'Xiaomi', 'Realme', 'HP', 'Dell',
    'Lenovo', 'Asus', 'Sony', 'LG', 'Canon', 'Nikon'
  ];

  const cities = [
    'Mumbai', 'Delhi', 'Bangalore', 'Chennai', 'Kolkata', 'Hyderabad',
    'Pune', 'Ahmedabad', 'Jaipur', 'Lucknow'
  ];

  const sortOptions = [
    { value: 'newest', label: 'Newest First' },
    { value: 'popular', label: 'Most Popular' },
    { value: 'discount', label: 'Highest Discount' },
    { value: 'price_low', label: 'Price: Low to High' },
    { value: 'price_high', label: 'Price: High to Low' },
  ];

  const clearAllFilters = () => {
    setSelectedCategory(null);
    setSelectedBrand(null);
    setSelectedCity(null);
    setDealType('all');
    setMinPrice('');
    setMaxPrice('');
    setSortBy('newest');
  };

  const applyFilters = () => {
    // In a real app, this would apply the filters and navigate back
    console.log('Applying filters:', {
      category: selectedCategory,
      brand: selectedBrand,
      city: selectedCity,
      dealType,
      minPrice,
      maxPrice,
      sortBy,
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Filters</Text>
        <TouchableOpacity onPress={clearAllFilters}>
          <Text style={styles.clearAllText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Category Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Category</Text>
          <View style={styles.chipsContainer}>
            {categories.map((category) => (
              <Chip
                key={category}
                selected={selectedCategory === category}
                onPress={() => setSelectedCategory(
                  selectedCategory === category ? null : category
                )}
                style={[
                  styles.chip,
                  selectedCategory === category && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCategory === category && styles.selectedChipText
                ]}
              >
                {category}
              </Chip>
            ))}
          </View>
        </View>

        {/* Brand Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Brand</Text>
          <View style={styles.chipsContainer}>
            {brands.map((brand) => (
              <Chip
                key={brand}
                selected={selectedBrand === brand}
                onPress={() => setSelectedBrand(
                  selectedBrand === brand ? null : brand
                )}
                style={[
                  styles.chip,
                  selectedBrand === brand && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedBrand === brand && styles.selectedChipText
                ]}
              >
                {brand}
              </Chip>
            ))}
          </View>
        </View>

        {/* Price Range */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Price Range (₹)</Text>
          <View style={styles.priceInputs}>
            <TextInput
              label="Min Price"
              value={minPrice}
              onChangeText={setMinPrice}
              keyboardType="numeric"
              style={styles.priceInput}
              mode="outlined"
            />
            <TextInput
              label="Max Price"
              value={maxPrice}
              onChangeText={setMaxPrice}
              keyboardType="numeric"
              style={styles.priceInput}
              mode="outlined"
            />
          </View>
        </View>

        {/* Location Filter */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Location</Text>
          <View style={styles.chipsContainer}>
            {cities.map((city) => (
              <Chip
                key={city}
                selected={selectedCity === city}
                onPress={() => setSelectedCity(
                  selectedCity === city ? null : city
                )}
                style={[
                  styles.chip,
                  selectedCity === city && styles.selectedChip
                ]}
                textStyle={[
                  styles.chipText,
                  selectedCity === city && styles.selectedChipText
                ]}
              >
                {city}
              </Chip>
            ))}
          </View>
        </View>

        {/* Deal Type */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Deal Type</Text>
          <View style={styles.radioGroup}>
            {[
              { value: 'all', label: 'All Deals' },
              { value: 'online', label: 'Online Only' },
              { value: 'physical', label: 'In-Store Only' },
            ].map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.radioOption}
                onPress={() => setDealType(option.value as any)}
              >
                <View style={styles.radioButton}>
                  {dealType === option.value && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Sort By */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Sort By</Text>
          <View style={styles.radioGroup}>
            {sortOptions.map((option) => (
              <TouchableOpacity
                key={option.value}
                style={styles.radioOption}
                onPress={() => setSortBy(option.value)}
              >
                <View style={styles.radioButton}>
                  {sortBy === option.value && (
                    <View style={styles.radioButtonSelected} />
                  )}
                </View>
                <Text style={styles.radioLabel}>{option.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View style={styles.footer}>
        <Button
          mode="contained"
          onPress={applyFilters}
          style={styles.applyButton}
          contentStyle={styles.applyButtonContent}
        >
          Apply Filters
        </Button>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
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
    color: '#111827',
  },
  clearAllText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  selectedChip: {
    backgroundColor: '#f97316',
  },
  chipText: {
    fontSize: 14,
    color: '#374151',
  },
  selectedChipText: {
    color: '#fff',
  },
  priceInputs: {
    flexDirection: 'row',
    gap: 12,
  },
  priceInput: {
    flex: 1,
    backgroundColor: '#fff',
  },
  radioGroup: {
    gap: 12,
  },
  radioOption: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: '#d1d5db',
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#f97316',
  },
  radioLabel: {
    fontSize: 16,
    color: '#374151',
  },
  footer: {
    padding: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  applyButton: {
    backgroundColor: '#f97316',
  },
  applyButtonContent: {
    paddingVertical: 8,
  },
});

export default FiltersScreen;