import BNProductList from "./ProductList/BNProductList"
import Banner from "./Banner/Banner"
import { BestNewBook } from "../../../../types";

// 베스트 임시 데이터
const bestBooks: BestNewBook[] = [
  {
    id: "1",
    title: "반항하는 인간 1",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 1
  },
  {
    id: "2",
    title: "반항하는 인간 2",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 2
  },
  {
    id: "3",
    title: "반항하는 인간 3",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 3
  },
  {
    id: "4",
    title: "반항하는 인간 4",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 4
  },
  {
    id: "5",
    title: "반항하는 인간 5",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 5
  },
  {
    id: "6",
    title: "반항하는 인간 6",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 6
  },
  {
    id: "7",
    title: "반항하는 인간 7",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 7
  },
  {
    id: "8",
    title: "반항하는 인간 8",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 8
  },
  {
    id: "9",
    title: "반항하는 인간 9",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 9
  },
  {
    id: "10",
    title: "반항하는 인간 10",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 10
  },
]

// 신상품 임시 데이터 (더 많은 개수로 테스트)
const newBooks: BestNewBook[] = [
  {
    id: "1",
    title: "반항하는 인간 1",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 1
  },
  {
    id: "2",
    title: "반항하는 인간 2",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 2
  },
  {
    id: "3",
    title: "반항하는 인간 3",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 3
  },
  {
    id: "4",
    title: "반항하는 인간 4",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 4
  },
  {
    id: "5",
    title: "반항하는 인간 5",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 5
  },
  {
    id: "6",
    title: "반항하는 인간 6",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 6
  },
  {
    id: "7",
    title: "반항하는 인간 7",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 7
  },
  {
    id: "8",
    title: "반항하는 인간 8",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 8
  },
  {
    id: "9",
    title: "반항하는 인간 9",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 9
  },
  {
    id: "10",
    title: "반항하는 인간 10",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 10
  },
  {
    id: "11",
    title: "반항하는 인간 11",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 11
  },
  {
    id: "12",
    title: "반항하는 인간 12",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 12
  },
  {
    id: "13",
    title: "반항하는 인간 13",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 13
  },
  {
    id: "14",
    title: "반항하는 인간 14",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 14
  },
  {
    id: "15",
    title: "반항하는 인간 15",
    author: "알베르카뮈",
    publisher: "민음사",
    imageUrl: "https://contents.kyobobook.co.kr/sih/fit-in/458x0/pdt/9788937463839.jpg",
    rank: 15
  },
]

const BestNew: React.FC<{ type: "best" | "new" }> = ({ type }) => {
  return (
    <>
      <BNProductList type={type} books={type === "best" ? bestBooks : newBooks} />
      <Banner type={type} />
    </>
  )
}

export default BestNew;