import BestNew from "./components/BestNew/BestNew";
import Main from "./components/Main/Main";

const MainBestNew: React.FC = () => {
  return (
    <>
    <Main />
    <BestNew type="best" />
    <BestNew type="new" />
    </>
  )
}

export default MainBestNew;
