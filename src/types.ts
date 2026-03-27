/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'customer' | 'vendor';

export interface UserProfile {
  uid: string;
  email: string;
  displayName: string;
  role: UserRole;
  createdAt: number;
  photoURL?: string;
}

export interface Vendor {
  id: string;
  name: string;
  station: string;
  rating: number;
  totalRatings: number;
  hygieneScore: number;
  freshnessScore: number;
  tasteScore: number;
  isBlacklisted: boolean;
  isVerified: boolean;
  illnessReportsToday: number;
  imageUrl?: string;
}

export interface FoodItem {
  id: string;
  vendorId: string;
  name: string;
  price: number;
  preparedAt: number; // Timestamp
  category: string;
  imageUrl?: string;
  isVeg: boolean;
}

export interface Rating {
  id: string;
  userId: string;
  vendorId: string;
  freshness: number;
  taste: number;
  hygiene: number;
  comment: string;
  createdAt: number;
}

export interface IllnessReport {
  id: string;
  userId: string;
  vendorId: string;
  timestamp: number;
  symptoms: string[];
}

export interface FoodHistory {
  id: string;
  userId: string;
  vendorId: string;
  foodName: string;
  timestamp: number;
  pnr?: string; // Added PNR for accurate delivery tracking
}
