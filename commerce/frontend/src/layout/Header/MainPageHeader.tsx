import {
        STTopBar,
        STMallInner,
        STMainHeader,
        Logo,
        STSearchBox,
        SearchIcon,
        LoginIcon,
        CartIcon,
        STList,
        STNewArrivals,
        STBestSellers,
        MenuIcon,
        STMain,
        STTopBarBox
} from './MainPageHeader.styled';

    const MainPageHeader = () => {
        return (
                <>
                    <STMain>

                        {/* TopBar 컴포넌트 */}
                        <STTopBar>
                            <STTopBarBox>
                                <STMallInner>회원가입</STMallInner>
                                <STMallInner>장바구니</STMallInner>
                                <STMallInner>주문배송</STMallInner>
                                <STMallInner>고객센터</STMallInner>
                            </STTopBarBox>
                        </STTopBar>

                        {/* MainHeader 컴포넌트 */}
                        <STMainHeader>
                            <Logo />
                            <STSearchBox>
                                <SearchIcon />
                            </STSearchBox>
                            <div>


                            <CartIcon />
                            <LoginIcon/>
                            </div>
                        </STMainHeader>

                        {/* List 컴포넌트 */}
                        <STList>
                            <MenuIcon />
                            <STNewArrivals>신상품</STNewArrivals>
                            <STBestSellers>베스트</STBestSellers>
                        </STList>


                    </STMain>

                    </>
            );
    };
    export default MainPageHeader;