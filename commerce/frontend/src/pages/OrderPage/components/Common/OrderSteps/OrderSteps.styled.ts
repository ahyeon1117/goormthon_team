import styled from 'styled-components';

export const OrderSteps = styled.div`
    display: flex;
    align-items: center;
    gap: 6px;

    .step {
        display: flex;
        align-items: center;
        gap: 6px;

        span {
            font-size: 18px;
            font-weight: 700;
            color: #B7B7B7;
        }
    }
`;

export const Step = styled.div<{ $active: boolean }>`
    display: flex;
    align-items: center;
    gap: 6px;  

    span {
        font-size: 18px;
        font-weight: 700;
        color: ${({ $active }) => $active ? '#000' : '#B7B7B7'};
    }

    svg {
        width: 22px;
        height: 22px;
        color: ${({ $active }) => $active ? '#E896FF' : '#D9D9D9'};
    }
`;
