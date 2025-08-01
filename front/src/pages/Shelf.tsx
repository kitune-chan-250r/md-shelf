import { ArticleList } from "../components/ArticleList";
import { useShelfData } from "../hooks/useShelfData";

export const Shelf = () => {
  const data = useShelfData();
  return <ArticleList data={data} />;
};
