import { useEffect, useState } from 'react';
import { useAuth, useUser, useCart, useInventory } from '../../hooks';
import { addWishItem, getWishItems, removeWishItem } from '../../api/wishApi';

export default function LibraryPage() {
  // 인증 정보
  const { isAuthenticated, userId, loadUserInfo } = useAuth();

  // 사용자 정보
  const { nickname } = useUser();

  // 카트 정보
  const {
    books: cartBooks,
    totalCount: cartCount,
    fetchCartItems,
    isCartEmpty,
    calculateTotalPrice
  } = useCart();

  // 인벤토리 정보
  const {
    books: inventoryBooks,
    totalCount: inventoryCount,
    fetchInventoryItems,
    fetchProductDetails,
    isInventoryEmpty,
    inventoryItems
  } = useInventory();

  // 찜하기 정보
  const [wishItems, setWishItems] = useState<number[]>([]);
  const [loadingWishItems, setLoadingWishItems] = useState(false);

  // 페이지 로드 시 데이터 가져오기
  useEffect(() => {
    if (isAuthenticated) {
      // 사용자 정보 로드
      loadUserInfo();
      fetchCartItems();
      fetchInventoryItems();
      fetchWishItems();
    }
  // eslint-disable-next-line
  }, [isAuthenticated, fetchCartItems, fetchInventoryItems]);

  // 인벤토리 아이템에 대한 상세 정보 가져오기
  useEffect(() => {
    if (inventoryItems.length > 0) {
      // 각 인벤토리 아이템에 대한 상품 상세 정보 가져오기
      const fetchDetails = async () => {
        for (const item of inventoryItems) {
          await fetchProductDetails(item.productId.toString());
        }
      };

      fetchDetails();
    }
  }, [inventoryItems, fetchProductDetails]);

  // 찜 목록 가져오기
  const fetchWishItems = async () => {
    try {
      setLoadingWishItems(true);
      console.log('찜 목록을 가져오는 중...');
      const items = await getWishItems();
      const productIds = items.map(item => item.productId);
      setWishItems(productIds);
      console.log('찜 목록 조회 완료:', productIds);
    } catch (error) {
      console.error('찜 목록 가져오기 오류:', error);
    } finally {
      setLoadingWishItems(false);
    }
  };

  // 상품이 찜 목록에 있는지 확인
  const isInWishlist = (productId: number) => {
    return wishItems.includes(productId);
  };

  // 찜하기 추가/삭제 토글
  const toggleWish = async (productId: number) => {
    try {
      if (isInWishlist(productId)) {
        console.log(`상품 ID: ${productId} 찜 목록에서 삭제 시도 중...`);
        const success = await removeWishItem(productId);
        if (success) {
          setWishItems(wishItems.filter(id => id !== productId));
          console.log(`상품 ID: ${productId} 찜 목록에서 삭제 완료`);
        }
      } else {
        console.log(`상품 ID: ${productId} 찜 목록에 추가 시도 중...`);
        const success = await addWishItem(productId);
        if (success) {
          setWishItems([...wishItems, productId]);
          console.log(`상품 ID: ${productId} 찜 목록에 추가 완료`);
        }
      }
    } catch (error) {
      console.error('찜하기 토글 중 오류:', error);
    }
  };

  return (
    <>
      <style>
        {`
          /* 라이브러리 페이지 스타일 */
          .library-container {
            max-width: 1200px;
            margin: 0 auto;
            padding: 20px;
          }

          .library-title {
            font-size: 28px;
            margin-bottom: 20px;
            color: #333;
          }

          .login-required {
            background-color: #f8f9fa;
            padding: 20px;
            text-align: center;
            border-radius: 8px;
            border: 1px solid #e0e0e0;
          }

          .library-grid {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
          }

          @media (min-width: 768px) {
            .library-grid {
              grid-template-columns: repeat(2, 1fr);
            }

            .user-info-card {
              grid-column: 1 / -1;
            }
          }

          .user-info-card,
          .cart-card,
          .inventory-card {
            background-color: #fff;
            border-radius: 8px;
            box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1);
            overflow: hidden;
          }

          .card-content {
            padding: 20px;
          }

          .card-content h2 {
            font-size: 20px;
            margin: 0 0 10px 0;
            color: #333;
          }

          .divider {
            border: none;
            height: 1px;
            background-color: #e0e0e0;
            margin: 15px 0;
          }

          .info-list {
            list-style: none;
            padding: 0;
            margin: 0;
          }

          .info-list li {
            display: flex;
            padding: 10px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .info-label {
            font-weight: bold;
            width: 120px;
            color: #555;
          }

          .info-value {
            flex: 1;
          }

          .empty-message {
            text-align: center;
            padding: 20px;
            color: #777;
          }

          .book-list {
            list-style: none;
            padding: 0;
            margin: 0;
            max-height: 400px;
            overflow-y: auto;
          }

          .book-item {
            padding: 15px 0;
            border-bottom: 1px solid #f0f0f0;
          }

          .book-grid {
            display: grid;
            grid-template-columns: 80px 1fr auto;
            gap: 15px;
            align-items: center;
          }

          .book-image-container {
            width: 80px;
            height: 120px;
            overflow: hidden;
            display: flex;
            align-items: center;
            justify-content: center;
          }

          .book-image {
            max-width: 100%;
            max-height: 120px;
            object-fit: contain;
          }

          .book-info {
            overflow: hidden;
          }

          .book-title {
            font-size: 16px;
            margin: 0 0 5px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .book-author {
            font-size: 14px;
            color: #555;
            margin: 0 0 5px 0;
            white-space: nowrap;
            overflow: hidden;
            text-overflow: ellipsis;
          }

          .book-price,
          .book-publisher {
            font-size: 14px;
            color: #888;
            margin: 0;
          }

          .total-price {
            text-align: right;
            margin-top: 15px;
            padding-top: 15px;
            border-top: 1px solid #e0e0e0;
          }

          .total-price h3 {
            font-size: 18px;
            color: #333;
            margin: 0;
          }

          .wish-button {
            background-color: transparent;
            border: none;
            cursor: pointer;
            font-size: 24px;
            color: #ccc;
            transition: color 0.2s;
            margin-right: 10px;
          }

          .wish-button.active {
            color: #ff5a5f;
          }

          .wish-button:hover {
            color: #ff5a5f;
          }

          .wish-button-container {
            display: flex;
            flex-direction: column;
            align-items: center;
          }

          .wish-status {
            font-size: 12px;
            margin-top: 5px;
            color: #777;
          }
        `}
      </style>
      <div className="library-container">
        <h1 className="library-title">내 서재</h1>

        {!isAuthenticated ? (
          <div className="login-required">
            <h2>로그인이 필요합니다.</h2>
          </div>
        ) : (
          <div className="library-grid">
            {/* 사용자 정보 */}
            <div className="user-info-card">
              <div className="card-content">
                <h2>사용자 정보</h2>
                <hr className="divider" />
                <ul className="info-list">
                  <li>
                    <div className="info-label">사용자 ID</div>
                    <div className="info-value">{userId || '정보 없음'}</div>
                  </li>
                  <li>
                    <div className="info-label">닉네임</div>
                    <div className="info-value">{nickname || '정보 없음'}</div>
                  </li>
                </ul>
              </div>
            </div>

            {/* 장바구니 정보 */}
            <div className="cart-card">
              <div className="card-content">
                <h2>장바구니 ({cartCount}개)</h2>
                <hr className="divider" />

                {isCartEmpty() ? (
                  <div className="empty-message">
                    <p>장바구니가 비어 있습니다.</p>
                  </div>
                ) : (
                  <>
                    <ul className="book-list">
                      {cartBooks.map((book) => (
                        <li key={book.id} className="book-item">
                          <div className="book-grid">
                            <div className="book-image-container">
                              <img
                                src={book.imageUrl}
                                alt={book.title}
                                className="book-image"
                              />
                            </div>
                            <div className="book-info">
                              <h3 className="book-title">{book.title}</h3>
                              <p className="book-author">{book.author}</p>
                              <p className="book-price">
                                {book.price.toLocaleString()}원
                              </p>
                            </div>
                            <div className="wish-button-container">
                              <button
                                className={`wish-button ${isInWishlist(Number(book.id)) ? 'active' : ''}`}
                                onClick={() => toggleWish(Number(book.id))}
                                title={isInWishlist(Number(book.id)) ? "찜 해제하기" : "찜하기"}
                              >
                                {isInWishlist(Number(book.id)) ? '♥' : '♡'}
                              </button>
                              <div className="wish-status">
                                {loadingWishItems ? '로딩 중...' : (isInWishlist(Number(book.id)) ? '찜 됨' : '찜하기')}
                              </div>
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                    <div className="total-price">
                      <h3>
                        총 금액: {calculateTotalPrice().toLocaleString()}원
                      </h3>
                    </div>
                  </>
                )}
              </div>
            </div>

            {/* 인벤토리 정보 */}
            <div className="inventory-card">
              <div className="card-content">
                <h2>보유 도서 ({inventoryCount}권)</h2>
                <hr className="divider" />

                {isInventoryEmpty() ? (
                  <div className="empty-message">
                    <p>보유한 도서가 없습니다.</p>
                  </div>
                ) : (
                  <ul className="book-list">
                    {inventoryBooks.map((book) => (
                      <li key={book.id} className="book-item">
                        <div className="book-grid">
                          <div className="book-image-container">
                            <img
                              src={book.imageUrl}
                              alt={book.title}
                              className="book-image"
                            />
                          </div>
                          <div className="book-info">
                            <h3 className="book-title">{book.title}</h3>
                            <p className="book-author">{book.author}</p>
                            {book.publisher && (
                              <p className="book-publisher">{book.publisher}</p>
                            )}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
