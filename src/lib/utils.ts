import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
}

export function calculateDiscount(originalPrice: number, dealPrice: number): number {
  return Math.round(((originalPrice - dealPrice) / originalPrice) * 100);
}

export function formatTimeAgo(date: string): string {
  const now = new Date();
  const past = new Date(date);
  const diffInSeconds = Math.floor((now.getTime() - past.getTime()) / 1000);

  if (diffInSeconds < 60) return 'just now';
  if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
  if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
  return `${Math.floor(diffInSeconds / 86400)}d ago`;
}

export function generateAffiliateLink(originalUrl: string, merchant: string): string {
  const affiliateParams = {
    amazon: 'tag=spicybeats-21',
    flipkart: 'affid=spicybeats',
    myntra: 'utm_source=spicybeats'
  };

  const param = affiliateParams[merchant.toLowerCase() as keyof typeof affiliateParams];
  if (!param) return originalUrl;

  return `${originalUrl}${originalUrl.includes('?') ? '&' : '?'}${param}`;
}