import { List } from "@mui/material";
import { useEffect, useRef } from "react";
import { useLocation } from "react-router";
import { useScrollRestoration } from "../hooks/useScrollRestoration";
import type { ShelfData } from "../types";
import { fullwh } from "../utils";
import { ArticleItem } from "./ArticleItem";

interface ArticleListProps {
  data: ShelfData[];
}

export const ArticleList = ({ data }: ArticleListProps) => {
  const listRef = useRef<HTMLUListElement>(null);
  const { saveScrollPosition, restoreScrollPosition } = useScrollRestoration(listRef);
  const location = useLocation();

  useEffect(() => {
    if (data.length > 0) {
      restoreScrollPosition(location.pathname);
    }
  }, [data, location.pathname, restoreScrollPosition]);

  return (
    <List
      ref={listRef}
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
        return (
          <ArticleItem
            key={`article-${index}`}
            data={data}
            saveScrollPosition={() => saveScrollPosition(location.pathname)}
          />
        );
      })}
    </List>
  );
};
