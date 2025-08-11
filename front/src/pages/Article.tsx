import { Box } from "@mui/material";
import { fullwh } from "../utils";
import { MarkdownViewer } from "../components/MarkdownViewer";
import { useParams } from "react-router";
import { useCallback, useEffect, useState } from "react";

export const Article = () => {
  const { filename } = useParams();
  const [markdownText, setMarkdownText] = useState("");

  const fetchMarkDown = useCallback(async (filename: string) => {
    const response = await fetch(`/api/article/${filename}`);
    if (response.ok) {
      setMarkdownText(await response.text());
    } else {
      console.warn("fetchMarkDown faild");
    }
  }, []);

  useEffect(() => {
    if (filename) {
      void (async () => {
        await fetchMarkDown(filename);
      })();
    }
  }, [filename, fetchMarkDown]);

  return (
    <Box
      sx={{
        ...fullwh,
        overflow: "auto",
        p: 3,
        display: "flex",
        justifyContent: "center",
      }}>
      <Box
        sx={{
          width: "100%",
          maxWidth: 1200,
        }}>
        <MarkdownViewer markdownText={markdownText} />
      </Box>
    </Box>
  );
};
