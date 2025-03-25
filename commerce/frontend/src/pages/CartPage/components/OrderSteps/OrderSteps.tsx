import { IoIosArrowDroprightCircle } from "react-icons/io";
import * as S from './OrderSteps.styled';

const OrderSteps: React.FC = () => {
    return (
        <S.OrderSteps>
            <div className="step">
                <span style={{ color: '#000' }}>장바구니</span>
                <IoIosArrowDroprightCircle size={22} color="#E896FF" />
            </div>
            <div className="step">
                <span>주문/결제</span>
                <IoIosArrowDroprightCircle size={22} color="#D9D9D9" />
            </div>
            <div className="step">
                <span>주문완료</span>
                <IoIosArrowDroprightCircle size={22} color="#D9D9D9" />
            </div>
        </S.OrderSteps>
    )
}

export default OrderSteps;