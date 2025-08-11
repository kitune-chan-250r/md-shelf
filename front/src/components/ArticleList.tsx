import { List } from "@mui/material";
import type { ShelfData } from "../types";
import { ArticleItem } from "./ArticleItem";
import { fullwh } from "../utils";

interface ArticleListProps {
  data: ShelfData[];
}

export const ArticleList = ({ data }: ArticleListProps) => {
  return (
    <List
      sx={{
        ...fullwh,
        pt: 0,
        pb: 0,
        pl: 3,
        pr: 3,
        overflowY: "auto",
        overflowX: "hidden",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}>
      {data.map((data, index) => {
        return <ArticleItem key={`article-${index}`} data={data} />;
      })}
    </List>
  );
};
