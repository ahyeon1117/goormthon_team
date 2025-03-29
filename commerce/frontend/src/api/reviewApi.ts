import { apiRequest } from './client'; // apiClient.ts 파일을 사용
import { ReviewRequestDto, ReviewResponseDto } from '../types/apiTypes.ts'; // apiTypes에서 타입을 import

// 리뷰 생성 API
export const createReview = async (review: ReviewRequestDto): Promise<ReviewResponseDto> => {
  try {
    const response = await apiRequest.post<ReviewResponseDto>('/api/v1/reviews', review);
    return response.data.data; // 성공적으로 받은 리뷰 데이터 반환
  } catch (error) {
    console.error('Error creating review:', error);
    throw error;
  }
};

// 특정 사용자의 리뷰 조회 API
export const getReviewsByUser = async (userId: string): Promise<ReviewResponseDto[]> => {
  try {
    const response = await apiRequest.get<ReviewResponseDto[]>(`/api/v1/reviews/user/${userId}`);
    return response.data.data; // 성공적으로 받은 리뷰 리스트 반환
  } catch (error) {
    console.error('Error fetching user reviews:', error);
    throw error;
  }
};

// 특정 상품의 리뷰 조회 API
export const getReviewsByProduct = async (productId: number): Promise<ReviewResponseDto[]> => {
  try {
    const response = await apiRequest.get<ReviewResponseDto[]>(`/api/v1/reviews/product/${productId}`);
    return response.data.data; // 성공적으로 받은 리뷰 리스트 반환
  } catch (error) {
    console.error('Error fetching product reviews:', error);
    throw error;
  }
};
