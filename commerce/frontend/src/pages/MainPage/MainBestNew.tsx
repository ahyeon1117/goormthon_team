import BestNew from "./BestNew";

// 임시 데이터 (베스트/신상품)
const bookData = [
    {
        id: 1,
        title: "반항하는 인간",
        author: "알베르카뮈",
        publisher: "민음사",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        rank: 1
    },
    {
        id: 2,
        title: "반항하는 인간",
        author: "알베르카뮈",
        publisher: "민음사",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        rank: 2
    },
    {
        id: 3,
        title: "반항하는 인간",
        author: "알베르카뮈",
        publisher: "민음사",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        rank: 3
    },
    {
        id: 4,
        title: "반항하는 인간",
        author: "알베르카뮈",
        publisher: "민음사",
        imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
        rank: 4
    },
]

function MainBestNew() {
  return (
    <>
    <BestNew sectionType="best" bookData={bookData} />
    <BestNew sectionType="new" bookData={bookData} />
    </>
  )
}

export default MainBestNew;