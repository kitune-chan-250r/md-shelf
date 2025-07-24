import { Box, Typography } from "@mui/material";
import type { ShelfData } from "../types";

interface ArticleItemProps {
  key: string;
  data: ShelfData;
}
export const ArticleItem = ({ key, data }: ArticleItemProps) => {
  return (
    <Box
      key={key}
      // elevation={3}
      sx={{
        mt: 1.5,
        mb: 1.5,
        p: 2,
        width: "100%",
        maxWidth: 900,
        opacity: 0.8,
        border: "solid 1px #8d7092ff",
      }}>
      <Box
        sx={{
          maxHeight: 300,
          width: "100%",
        }}>
        <Typography variant="caption">{data.filename}</Typography>
        <Typography variant="h5">{data.title}</Typography>
        <Typography
          component="div"
          variant="body1"
          sx={{
            maxHeight: 200,
            whiteSpace: "balance",
            overflow: "hidden",
            textOverflow: "ellipsis",
          }}>
          {data.summary}
        </Typography>
      </Box>
    </Box>
  );
};
