import * as S from "./Banner.styled";
import bestBannerImage from "../../../../../assets/images/best-banner.png";
import newBannerImage from "../../../../../assets/images/new-banner.png";

//배너 문구
const BANNER_TEXTS = {
  best: "지금 로켓문고에서는 3000원 할인!",
  new: "로켓문고 리뷰왕을 찾아라!"
} as const;

const Banner: React.FC<{ type: "best" | "new" }> = ({ type }) => {

  const bannerText = BANNER_TEXTS[type];

  return (
    <S.BannerSection type = { type } >
      <S.BannerLink>
        <S.BannerText>{bannerText}</S.BannerText>
        <S.BannerImage src={type === "best" ? bestBannerImage : newBannerImage} />
      </S.BannerLink>
      </S.BannerSection >
  )
}

export default Banner;