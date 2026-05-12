// Mobile Advertisement Services
// These services are designed to be used by the mobile app (React Native/Expo)

export type MobileAdvertisement = {
  adId: string;
  name: string;
  bannerUrl: string;
  destinationLink: string;
};

export type NextAdResponse = {
  ad: MobileAdvertisement | null;
};

export type AdActionResponse = {
  success: boolean;
  destinationLink?: string;
};

import { API_ENDPOINTS } from '@/config/api';

/**
 * Get the next advertisement to show for a user
 * Returns null if no ads available or all ads have been dismissed by this user
 */
export async function getNextAdvertisement(userId: string): Promise<NextAdResponse> {
  const response = await fetch(API_ENDPOINTS.mobile.advertisements.next, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'User-ID': userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch next advertisement: ${response.status}`);
  }

  return response.json();
}

/**
 * Mark an advertisement as dismissed by a user
 * Once dismissed, this ad will never be shown to this user again
 */
export async function dismissAdvertisement(adId: string, userId: string): Promise<AdActionResponse> {
  const response = await fetch(API_ENDPOINTS.mobile.advertisements.dismiss(adId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-ID': userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to dismiss advertisement: ${response.status}`);
  }

  return response.json();
}

/**
 * Track a click on an advertisement
 * This increments the click counter for analytics and returns the destination URL
 */
export async function clickAdvertisement(adId: string, userId: string): Promise<AdActionResponse> {
  const response = await fetch(API_ENDPOINTS.mobile.advertisements.click(adId), {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'User-ID': userId,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to track advertisement click: ${response.status}`);
  }

  return response.json();
}
