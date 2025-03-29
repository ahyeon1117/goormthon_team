import {create} from 'zustand';
import { ReviewResponseDto, ReviewRequestDto } from '../types/apiTypes'; // apiTypes에서 타입 import
import { createReview, getReviewsByUser, getReviewsByProduct } from '../api/reviewApi';

interface ReviewState {
  reviews: ReviewResponseDto[];
  loading: boolean;
  error: string | null;

  fetchReviewsByUser: (userId: string) => void;
  fetchReviewsByProduct: (productId: number) => void;
  createReview: (review: ReviewRequestDto) => void;
}

export const useReviewStore = create<ReviewState>((set) => ({
  reviews: [],
  loading: false,
  error: null,

  fetchReviewsByUser: async (userId: string) => {
    set({ loading: true });
    try {
      const reviews = await getReviewsByUser(userId);
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch user reviews', loading: false });
      console.error('Error fetching user reviews:', error); // 에러를 로그로 출력
    }
  },

  fetchReviewsByProduct: async (productId: number) => {
    set({ loading: true });
    try {
      const reviews = await getReviewsByProduct(productId);
      set({ reviews, loading: false });
    } catch (error) {
      set({ error: 'Failed to fetch product reviews', loading: false });
      console.error('Error fetching user reviews:', error); // 에러를 로그로 출력
    }
  },

  createReview: async (review: ReviewRequestDto) => {
    try {
      const newReview = await createReview(review);
      set((state) => ({
        reviews: [...state.reviews, newReview],
      }));
    } catch (error) {
      set({ error: 'Failed to create review' });
      console.error('Error fetching user reviews:', error); // 에러를 로그로 출력
    }
  },
}));
