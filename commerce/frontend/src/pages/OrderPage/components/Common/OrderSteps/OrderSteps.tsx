import { IoIosArrowDroprightCircle } from "react-icons/io";
import * as S from './OrderSteps.styled';

const OrderSteps: React.FC<{ step: 'cart' | 'order' | 'complete' }> = ({ step }) => {
    return (
        < S.OrderSteps >
            <S.Step $active={step === 'cart'}>
                <span>장바구니</span>
                <IoIosArrowDroprightCircle />
            </S.Step>
            <S.Step $active={step === 'order'}>
                <span>주문/결제</span>
                <IoIosArrowDroprightCircle />
            </S.Step>
            <S.Step $active={step === 'complete'}>
                <span>주문완료</span>
                <IoIosArrowDroprightCircle />
            </S.Step>
        </S.OrderSteps >
    )
}

export default OrderSteps;