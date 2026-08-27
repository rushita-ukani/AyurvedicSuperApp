export type DoshaType = 'Vata' | 'Pitta' | 'Kapha';

export interface DoshaScore {
  vata: number;
  pitta: number;
  kapha: number;
  dominant: DoshaType;
}

export interface QuizQuestion {
  id: number;
  category: string;
  question: string;
  options: {
    label: string;
    description: string;
    dosha: DoshaType;
  }[];
}

export interface DinacharyaItem {
  id: string;
  title: string;
  sanskritName: string;
  description: string;
  timeOfDay: 'morning' | 'afternoon' | 'evening';
  completed: boolean;
  duration: string;
  iconName: string;
}

export interface Herb {
  id: string;
  name: string;
  sanskritName: string;
  category: string;
  doshaBalancing: string;
  benefits: string[];
  usage: string;
  precautions: string;
}

export interface HomeRemedy {
  id: string;
  ailment: string;
  symptoms: string;
  ingredients: string[];
  instructions: string;
  recommendedHerbId?: string;
}

export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  fee: number;
  availableDays: string[];
  bio: string;
}

export interface Product {
  id: string;
  name: string;
  brand: string;
  category: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  doshaTarget: string;
  description: string;
  benefits: string[];
  inStock: boolean;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface ChatMessage {
  id: string;
  text: string;
  sender: 'user' | 'vaidya';
  timestamp: string;
}
