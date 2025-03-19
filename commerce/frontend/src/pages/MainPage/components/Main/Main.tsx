import MainPageHeader from '../../../../layout/Header/MainPageHeader.tsx';  // MainPageHeader를 import
import { AiOutlinePauseCircle, AiOutlinePlayCircle, AiOutlineLeft, AiOutlineRight   } from "react-icons/ai";
import { useState, useEffect } from "react";
import {
    STMainBannerBox,
        STMainBannerA,
        ImageMove,
        Image,
        ButtonContainer,
        Button,
        InfoText,
        ButtonContainerB,
        ButtonB,
        InfoTextB,
        STMainBannerB,
        STSubBannerBox,
        STSubBannerA,
        STSubBannerB,
    } from './Main.styled';

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
const imagesSBA = [
    "src/assets/images/SubBannerA.jpg",
    ];

    //SubBannerB
const imagesSBB = [
    "src/assets/images/SubBannerB.jpg",
    ];

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
                setCurrentIndex((prevIndex) => (prevIndex - 1 + imagesMBA.length) % imagesMBA.length);
            };

            // 다음 이미지로 이동하는 함수
                const goToNextImage = () => {
                setCurrentIndex((prevIndex) => (prevIndex + 1) % imagesMBA.length);
            };

            //B배너
                // 이전 이미지로 이동 (B 배너)
                    const goToPreviousImageB = () => {
                setCurrentIndexB((prevIndex) => (prevIndex - 1 + imagesMBB.length) % imagesMBB.length);
            };

            // 다음 이미지로 이동 (B 배너)
                const goToNextImageB = () => {
                setCurrentIndexB((prevIndex) => (prevIndex + 1) % imagesMBB.length);
            };

            return (
                <div>
                        {/* MainPageHeader를 Main 컴포넌트에 포함시킴 */}
                        <MainPageHeader />

                        {/* 여기에 Main 컴포넌트의 다른 내용 추가 */}
                        <div>
                            <STMainBannerBox>
                                <STMainBannerA>
                                    {imagesMBA.map((src, index) => (
                                        <ImageMove
                                            key={index}
                                            src={src}
                                            alt={`Banner ${index + 1}`}
                                            isActive={index === currentIndex}
                                            index={index}
                                        />
                                    ))}
                                    <ButtonContainer>
                                        <Button onClick={() => setIsPlaying(!isPlaying)}>
                                            {isPlaying ? <AiOutlinePauseCircle /> : <AiOutlinePlayCircle />}
                                        </Button>
                                        <Button onClick={goToPreviousImage}><AiOutlineLeft /></Button>
                                        <InfoText>
                                            {currentIndex + 1} / {imagesMBA.length}
                                        </InfoText>
                                        <Button onClick={goToNextImage}><AiOutlineRight/></Button>
                                    </ButtonContainer>
                                </STMainBannerA>
                                <STMainBannerB>
                                    <Image src={imagesMBB[currentIndexB]} alt={`Banner B ${currentIndexB + 1}`} />
                                    <ButtonContainerB>
                                        <ButtonB onClick={goToPreviousImageB}><AiOutlineLeft /></ButtonB>
                                        <InfoTextB>
                                            {currentIndexB + 1} / {imagesMBB.length}
                                        </InfoTextB>
                                        <ButtonB onClick={goToNextImageB}><AiOutlineRight/></ButtonB>
                                    </ButtonContainerB>
                                </STMainBannerB>
                            </STMainBannerBox>
                            <STSubBannerBox>
                                <STSubBannerA>
                                    <Image src={imagesSBA[0]} alt="Sub Banner A" />
                                </STSubBannerA>
                                <STSubBannerB>
                                    <Image src={imagesSBB[0]} alt="Sub Banner B"/>
                                </STSubBannerB>

                            </STSubBannerBox>
                        </div>
                    </div>
            );
    };

export default Main;