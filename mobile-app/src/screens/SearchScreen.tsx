import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Searchbar, Chip } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const SearchScreen: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState([
    'iPhone 15',
    'Samsung Galaxy',
    'MacBook Air',
    'Sony Headphones',
  ]);

  const popularSearches = [
    'iPhone deals',
    'Laptop offers',
    'Gaming accessories',
    'Wireless earbuds',
    'Smart TV',
    'Camera deals',
  ];

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    // Add to recent searches if not already present
    if (query && !recentSearches.includes(query)) {
      setRecentSearches(prev => [query, ...prev.slice(0, 4)]);
    }
  };

  const clearRecentSearches = () => {
    setRecentSearches([]);
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Search Deals</Text>
      </View>

      <View style={styles.content}>
        <Searchbar
          placeholder="Search for electronics deals..."
          onChangeText={setSearchQuery}
          value={searchQuery}
          onSubmitEditing={() => handleSearch(searchQuery)}
          style={styles.searchBar}
        />

        {!searchQuery && (
          <>
            {/* Recent Searches */}
            {recentSearches.length > 0 && (
              <View style={styles.section}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Recent Searches</Text>
                  <TouchableOpacity onPress={clearRecentSearches}>
                    <Text style={styles.clearText}>Clear</Text>
                  </TouchableOpacity>
                </View>
                <FlatList
                  data={recentSearches}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item, index) => `recent-${index}`}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      style={styles.recentItem}
                      onPress={() => handleSearch(item)}
                    >
                      <Ionicons name="time-outline" size={16} color="#6b7280" />
                      <Text style={styles.recentText}>{item}</Text>
                    </TouchableOpacity>
                  )}
                />
              </View>
            )}

            {/* Popular Searches */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Popular Searches</Text>
              <View style={styles.chipsContainer}>
                {popularSearches.map((search, index) => (
                  <Chip
                    key={index}
                    onPress={() => handleSearch(search)}
                    style={styles.popularChip}
                    textStyle={styles.chipText}
                  >
                    {search}
                  </Chip>
                ))}
              </View>
            </View>

            {/* Categories */}
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Browse Categories</Text>
              <View style={styles.categoriesGrid}>
                {[
                  { name: 'Mobiles', icon: 'phone-portrait-outline' },
                  { name: 'Laptops', icon: 'laptop-outline' },
                  { name: 'Audio', icon: 'headset-outline' },
                  { name: 'Gaming', icon: 'game-controller-outline' },
                  { name: 'Cameras', icon: 'camera-outline' },
                  { name: 'Smart TV', icon: 'tv-outline' },
                ].map((category, index) => (
                  <TouchableOpacity
                    key={index}
                    style={styles.categoryItem}
                    onPress={() => handleSearch(category.name)}
                  >
                    <Ionicons 
                      name={category.icon as any} 
                      size={32} 
                      color="#f97316" 
                    />
                    <Text style={styles.categoryText}>{category.name}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </>
        )}

        {searchQuery && (
          <View style={styles.searchResults}>
            <Text style={styles.resultsText}>
              Search results for "{searchQuery}" will appear here
            </Text>
            <Text style={styles.comingSoonText}>
              Search functionality coming soon!
            </Text>
          </View>
        )}
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
  content: {
    flex: 1,
    padding: 16,
  },
  searchBar: {
    marginBottom: 24,
    elevation: 2,
  },
  section: {
    marginBottom: 32,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
  },
  clearText: {
    fontSize: 14,
    color: '#f97316',
    fontWeight: '500',
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
    elevation: 1,
  },
  recentText: {
    fontSize: 14,
    color: '#374151',
    marginLeft: 6,
  },
  chipsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  popularChip: {
    backgroundColor: '#fff',
    marginBottom: 8,
  },
  chipText: {
    fontSize: 14,
  },
  categoriesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  categoryItem: {
    width: '30%',
    aspectRatio: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    elevation: 2,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    color: '#374151',
    marginTop: 8,
    textAlign: 'center',
  },
  searchResults: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  resultsText: {
    fontSize: 16,
    color: '#374151',
    textAlign: 'center',
    marginBottom: 8,
  },
  comingSoonText: {
    fontSize: 14,
    color: '#6b7280',
    textAlign: 'center',
  },
});

export default SearchScreen;