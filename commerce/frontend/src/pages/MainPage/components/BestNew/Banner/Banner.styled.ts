import styled from "styled-components";

export const BannerSection = styled.section<{ type: "best" | "new" }>`
    background-color: ${({ type }) => (type === "best" ? "#FBD642" : "#47BF86")};
    height: 120px;
`;

export const BannerLink = styled.a`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 100%;
    max-width: 1200px;
    height: 100%;
    margin: 0 auto;
    box-sizing: border-box;
    // cursor: pointer;

    &:hover {
      color: white;
    }
`;

export const BannerText = styled.div`
    font-size: 22px;
    font-weight: 700;
    min-width: 310px;
    margin-left: 70px;
    color: white;
`;

export const BannerImage = styled.img`
    height: 100%;
`;