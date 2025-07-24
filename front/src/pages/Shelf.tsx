import json from "../demo.json";
import type { ShelfData } from "../types";
import { ArticleList } from "../components/ArticleList";

export const Shelf = () => {
  const data = json as ShelfData[];
  return <ArticleList data={data} />;
};
