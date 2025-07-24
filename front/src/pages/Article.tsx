import { Box } from "@mui/material";
import { fullwh } from "../utils";
import { MarkdownViewer } from "../components/MarkdownViewer";

export const Article = () => {
  return (
    <Box
      sx={{
        ...fullwh,
        overflow: "auto",
        // p: 10,
        display: "flex",
        justifyContent: "center",
      }}>
      <Box
        sx={{
          maxWidth: 1200,
        }}>
        <MarkdownViewer />
      </Box>
    </Box>
  );
};
