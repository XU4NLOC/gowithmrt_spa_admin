# Mobile App Advertisement Integration Guide

## Overview
This guide explains how to integrate the advertisement system with your React Native/Expo mobile app.

## Backend Implementation (✅ COMPLETED)

### API Endpoints Created:
1. `GET /api/mobile/advertisements/next` - Get next ad for user
2. `POST /api/mobile/advertisements/{adId}/dismiss` - Dismiss ad permanently  
3. `POST /api/mobile/advertisements/{adId}/click` - Track ad click

### Service File:
- `src/services/mobile-advertisements.services.ts` - Ready-to-use functions for mobile app

## Mobile App Implementation (TODO)

### Required Dependencies
```bash
npm install react-native-modal react-native-webview
# or
expo install expo-web-browser
```

### 1. Advertisement Popup Component (React Native)

```jsx
// AdPopup.jsx
import React from 'react';
import { View, Image, TouchableOpacity, Modal, StyleSheet, Dimensions } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import * as WebBrowser from 'expo-web-browser';

const { width, height } = Dimensions.get('window');

export default function AdPopup({ ad, visible, onDismiss, onAdClick }) {
  if (!ad) return null;

  const handleAdTap = async () => {
    try {
      await onAdClick(ad.adId);
      // Open destination link in browser
      await WebBrowser.openBrowserAsync(ad.destinationLink);
    } catch (error) {
      console.error('Error handling ad click:', error);
    }
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onDismiss}
    >
      <View style={styles.overlay}>
        <View style={styles.container}>
          {/* Close Button */}
          <TouchableOpacity style={styles.closeButton} onPress={onDismiss}>
            <Ionicons name="close" size={24} color="#666" />
          </TouchableOpacity>
          
          {/* Ad Banner */}
          <TouchableOpacity onPress={handleAdTap} activeOpacity={0.8}>
            <Image 
              source={{ uri: ad.bannerUrl }} 
              style={styles.banner}
              resizeMode="contain"
            />
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 20,
    margin: 20,
    maxWidth: width * 0.9,
    maxHeight: height * 0.8,
  },
  closeButton: {
    position: 'absolute',
    top: 10,
    right: 10,
    zIndex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.8)',
    borderRadius: 12,
    padding: 4,
  },
  banner: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
});
```

### 2. Advertisement Service Hook

```jsx
// useAdvertisements.js
import { useState, useCallback } from 'react';

import { API_ENDPOINTS } from '@/config/api'; // Use centralized config

export function useAdvertisements(userId) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const getNextAd = useCallback(async () => {
    if (!userId) return null;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(API_ENDPOINTS.mobile.advertisements.next, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': userId,
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP ${response.status}`);
      }

      const data = await response.json();
      return data.ad;
    } catch (err) {
      setError(err.message);
      return null;
    } finally {
      setLoading(false);
    }
  }, [userId]);

  const dismissAd = useCallback(async (adId) => {
    if (!userId || !adId) return false;
    
    try {
      const response = await fetch(API_ENDPOINTS.mobile.advertisements.dismiss(adId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': userId,
        },
      });

      return response.ok;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  const clickAd = useCallback(async (adId) => {
    if (!userId || !adId) return false;
    
    try {
      const response = await fetch(API_ENDPOINTS.mobile.advertisements.click(adId), {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'User-ID': userId,
        },
      });

      return response.ok;
    } catch (err) {
      setError(err.message);
      return false;
    }
  }, [userId]);

  return {
    getNextAd,
    dismissAd,
    clickAd,
    loading,
    error,
  };
}
```

### 3. Home Screen Integration

```jsx
// HomeScreen.jsx
import React, { useState, useEffect } from 'react';
import { View } from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import AdPopup from './components/AdPopup';
import { useAdvertisements } from './hooks/useAdvertisements';

export default function HomeScreen() {
  const [currentAd, setCurrentAd] = useState(null);
  const [showAdPopup, setShowAdPopup] = useState(false);
  const userId = 'user-uuid-from-firebase'; // Get from your auth system
  
  const { getNextAd, dismissAd, clickAd } = useAdvertisements(userId);

  // Check for ads every time user navigates to Home Screen
  useFocusEffect(
    React.useCallback(() => {
      checkForAds();
    }, [])
  );

  const checkForAds = async () => {
    try {
      const ad = await getNextAd();
      if (ad) {
        setCurrentAd(ad);
        setShowAdPopup(true);
      }
    } catch (error) {
      console.error('Error fetching ads:', error);
    }
  };

  const handleDismissAd = async () => {
    if (currentAd) {
      await dismissAd(currentAd.adId);
    }
    setShowAdPopup(false);
    setCurrentAd(null);
  };

  const handleAdClick = async (adId) => {
    await clickAd(adId);
    setShowAdPopup(false);
    setCurrentAd(null);
  };

  return (
    <View style={{ flex: 1 }}>
      {/* Your existing home screen content */}
      
      <AdPopup
        ad={currentAd}
        visible={showAdPopup}
        onDismiss={handleDismissAd}
        onAdClick={handleAdClick}
      />
    </View>
  );
}
```

## Backend Requirements (NEEDS IMPLEMENTATION)

The backend server needs to implement these endpoints:

### 1. GET /api/mobile/advertisements/next
```javascript
// Expected Response:
{
  "ad": {
    "adId": "uuid",
    "name": "Ad Name",
    "bannerUrl": "https://...",
    "destinationLink": "https://..."
  } | null
}

// Logic:
// 1. Get all PUBLISHED ads ordered by createdAt ASC
// 2. Filter out ads dismissed by this user
// 3. Return first remaining ad or null
```

### 2. POST /api/mobile/advertisements/{adId}/dismiss
```javascript
// Add record to user_dismissed_ads table
// Response: { "success": true }
```

### 3. POST /api/mobile/advertisements/{adId}/click
```javascript
// Increment click counter in advertisements table
// Response: { "success": true, "destinationLink": "https://..." }
```

## Database Schema Addition

```sql
CREATE TABLE user_dismissed_ads (
  id SERIAL PRIMARY KEY,
  user_id VARCHAR(255) NOT NULL,
  ad_id VARCHAR(255) NOT NULL,
  dismissed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, ad_id)
);

CREATE INDEX idx_user_dismissed_ads_user_id ON user_dismissed_ads(user_id);
CREATE INDEX idx_user_dismissed_ads_ad_id ON user_dismissed_ads(ad_id);
```

## Testing the Integration

1. **Create test ads** in Back Office with PUBLISHED status
2. **Test the flow**:
   - Navigate to Home Screen → Ad should popup
   - Click X → Ad should not appear again
   - Navigate to Home Screen → Next ad should popup
   - Click ad → Should open destination link and track click

## Priority System Implementation

**Simple Approach**: Order by `createdAt ASC` (oldest first)
- Fair to advertisers
- Predictable behavior  
- Easy to implement and debug

This ensures ads are shown in the order they were created, giving equal opportunity to all published advertisements.
