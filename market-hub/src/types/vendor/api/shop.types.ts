// Shop related types

export interface Shop {
  id: string;
  name: string;
  description: string;
  logo?: string;
  coverImage?: string;
  email: string;
  phone: string;
  address: ShopAddress;
  businessType: BusinessType;
  taxId?: string;
  bankAccount?: BankAccount;
  socialLinks?: SocialLinks;
  settings: ShopSettings;
  status: ShopStatus;
  createdAt: string;
  updatedAt: string;
}

export type BusinessType = 
  | "individual"
  | "sole_proprietorship"
  | "partnership"
  | "corporation"
  | "llc";

export type ShopStatus = "active" | "inactive" | "suspended" | "pending";

export interface ShopAddress {
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}

export interface BankAccount {
  accountName: string;
  accountNumber: string;
  bankName: string;
  routingNumber?: string;
  swiftCode?: string;
}

export interface SocialLinks {
  website?: string;
  facebook?: string;
  instagram?: string;
  twitter?: string;
  linkedin?: string;
}

export interface ShopSettings {
  orderNotifications: boolean;
  marketingEmails: boolean;
  smsNotifications: boolean;
  autoReplyEnabled: boolean;
  autoReplyMessage?: string;
}

export interface CreateShopRequest {
  name: string;
  description: string;
  email: string;
  phone: string;
  address: ShopAddress;
  businessType: BusinessType;
  taxId?: string;
  logo?: File;
  coverImage?: File;
}

export interface UpdateShopRequest extends Partial<CreateShopRequest> {
  id: string;
}