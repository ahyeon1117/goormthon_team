import { AiOutlinePauseCircle, AiOutlinePlayCircle, AiOutlineLeft, AiOutlineRight   } from "react-icons/ai";
import { useState, useEffect } from "react";
import * as S from "./Main.styled";

//MainBannerA
const imagesMBA = [
  "src/assets/images/MainBanner1.jpg",
  "src/assets/images/MainBanner2.jpg",
  "src/assets/images/MainBanner3.jpg",
  "src/assets/images/MainBanner4.jpg",
];

//MainBannerB
const imagesMBB = [
  "src/assets/images/SubBanner1.png",
  "src/assets/images/SubBanner2.png",
];
//SubBannerA
const imagesSBA = ["src/assets/images/SubBannerA.jpg"];

//SubBannerB
const imagesSBB = ["src/assets/images/SubBannerB.jpg"];

const Main = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [currentIndexB, setCurrentIndexB] = useState(0);

  // 자동 슬라이드 효과(A 배너)
  useEffect(() => {
    if (!isPlaying) return;

    const interval = setInterval(() => {
      setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesMBA.length);
    }, 3000);

    return () => clearInterval(interval);
  }, [isPlaying]);

  // 이전 이미지로 이동하는 함수
  const goToPreviousImage = () => {
    setCurrentIndex(
      (prevIndex) => (prevIndex - 1 + imagesMBA.length) % imagesMBA.length,
    );
  };

  // 다음 이미지로 이동하는 함수
  const goToNextImage = () => {
    setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesMBA.length);
  };

  //B배너
  // 이전 이미지로 이동 (B 배너)
  const goToPreviousImageB = () => {
    setCurrentIndexB(
      (prevIndex) => (prevIndex - 1 + imagesMBB.length) % imagesMBB.length,
    );
  };

  // 다음 이미지로 이동 (B 배너)
  const goToNextImageB = () => {
    setCurrentIndexB((prevIndex) => (prevIndex + 1) % imagesMBB.length);
  };

  return (
    <div>
      <div>
        <S.STMainBannerBox>
          <S.STMainBannerA>
            {imagesMBA.map((src, index) => (
              <S.ImageMove
                key={index}
                src={src}
                alt={`Banner ${index + 1}`}
                $isActive={index === currentIndex}
                index={index}
              />
            ))}
            <S.ButtonContainer>
              <S.Button onClick={() => setIsPlaying(!isPlaying)}>
                {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
              </S.Button>
              <S.Button onClick={goToPreviousImage}>
                <AiOutlineLeft />
              </S.Button>
              <S.InfoText>
                {currentIndex + 1} / {imagesMBA.length}
              </S.InfoText>
              <S.Button onClick={goToNextImage}>
                <AiOutlineRight />
              </S.Button>
            </S.ButtonContainer>
          </S.STMainBannerA>
          <S.STMainBannerB>
            <S.Image
              src={imagesMBB[currentIndexB]}
              alt={`Banner B ${currentIndexB + 1}`}
            />
            <S.ButtonContainerB>
              <S.ButtonB onClick={goToPreviousImageB}>
                <AiOutlineLeft />
              </S.ButtonB>
              <S.InfoTextB>
                {currentIndexB + 1} / {imagesMBB.length}
              </S.InfoTextB>
              <S.ButtonB onClick={goToNextImageB}>
                <AiOutlineRight />
              </S.ButtonB>
            </S.ButtonContainerB>
          </S.STMainBannerB>
        </S.STMainBannerBox>
        <S.STSubBannerBox>
          <S.STSubBannerA>
            <S.Image src={imagesSBA[0]} alt="Sub Banner A" />
          </S.STSubBannerA>
          <S.STSubBannerB>
            <S.Image src={imagesSBB[0]} alt="Sub Banner B" />
          </S.STSubBannerB>
        </S.STSubBannerBox>
      </div>
    </div>
  );
};

export default Main;
