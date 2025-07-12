import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Avatar, List, Divider } from 'react-native-paper';
import { Ionicons } from '@expo/vector-icons';

const ProfileScreen: React.FC = () => {
  const user = {
    name: 'John Doe',
    email: 'john.doe@example.com',
    avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=200',
    dealsSubmitted: 12,
    totalUpvotes: 156,
    memberSince: 'January 2024',
  };

  const handleMenuPress = (item: string) => {
    Alert.alert('Coming Soon', `${item} feature coming soon!`);
  };

  const menuItems = [
    {
      title: 'My Deals',
      description: 'View deals you\'ve submitted',
      icon: 'pricetag-outline',
      onPress: () => handleMenuPress('My Deals'),
    },
    {
      title: 'Saved Deals',
      description: 'Your bookmarked deals',
      icon: 'bookmark-outline',
      onPress: () => handleMenuPress('Saved Deals'),
    },
    {
      title: 'Deal Alerts',
      description: 'Manage your notifications',
      icon: 'notifications-outline',
      onPress: () => handleMenuPress('Deal Alerts'),
    },
    {
      title: 'Location Settings',
      description: 'Update your preferred location',
      icon: 'location-outline',
      onPress: () => handleMenuPress('Location Settings'),
    },
    {
      title: 'Privacy Settings',
      description: 'Manage your privacy preferences',
      icon: 'shield-outline',
      onPress: () => handleMenuPress('Privacy Settings'),
    },
    {
      title: 'Help & Support',
      description: 'Get help or contact support',
      icon: 'help-circle-outline',
      onPress: () => handleMenuPress('Help & Support'),
    },
    {
      title: 'About SpicyBeats',
      description: 'App version and information',
      icon: 'information-circle-outline',
      onPress: () => handleMenuPress('About SpicyBeats'),
    },
  ];

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.content}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <Avatar.Image
            size={80}
            source={{ uri: user.avatar }}
            style={styles.avatar}
          />
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user.name}</Text>
            <Text style={styles.userEmail}>{user.email}</Text>
            <Text style={styles.memberSince}>Member since {user.memberSince}</Text>
          </View>
        </View>

        {/* Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.dealsSubmitted}</Text>
            <Text style={styles.statLabel}>Deals Submitted</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{user.totalUpvotes}</Text>
            <Text style={styles.statLabel}>Total Upvotes</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>4.8</Text>
            <Text style={styles.statLabel}>Rating</Text>
          </View>
        </View>

        {/* Menu Items */}
        <View style={styles.menuContainer}>
          {menuItems.map((item, index) => (
            <View key={index}>
              <List.Item
                title={item.title}
                description={item.description}
                left={(props) => (
                  <List.Icon
                    {...props}
                    icon={({ size, color }) => (
                      <Ionicons
                        name={item.icon as any}
                        size={size}
                        color={color}
                      />
                    )}
                  />
                )}
                right={(props) => <List.Icon {...props} icon="chevron-right" />}
                onPress={item.onPress}
                style={styles.menuItem}
              />
              {index < menuItems.length - 1 && <Divider />}
            </View>
          ))}
        </View>

        {/* Logout Button */}
        <TouchableOpacity
          style={styles.logoutButton}
          onPress={() => Alert.alert('Logout', 'Are you sure you want to logout?')}
        >
          <Ionicons name="log-out-outline" size={20} color="#dc2626" />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        {/* App Version */}
        <Text style={styles.versionText}>SpicyBeats v1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f9fafb',
  },
  content: {
    flex: 1,
  },
  profileHeader: {
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  avatar: {
    marginBottom: 16,
  },
  userInfo: {
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#111827',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#6b7280',
    marginBottom: 4,
  },
  memberSince: {
    fontSize: 14,
    color: '#9ca3af',
  },
  statsContainer: {
    backgroundColor: '#fff',
    flexDirection: 'row',
    paddingVertical: 20,
    marginTop: 1,
    borderBottomWidth: 1,
    borderBottomColor: '#e5e7eb',
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#f97316',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 12,
    color: '#6b7280',
    textAlign: 'center',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#e5e7eb',
    marginHorizontal: 16,
  },
  menuContainer: {
    backgroundColor: '#fff',
    marginTop: 16,
  },
  menuItem: {
    paddingVertical: 8,
  },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#fff',
    marginTop: 16,
    marginHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#fecaca',
  },
  logoutText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#dc2626',
    marginLeft: 8,
  },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#9ca3af',
    marginTop: 24,
    marginBottom: 32,
  },
});

export default ProfileScreen;