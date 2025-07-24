import { Box } from "@mui/material";
import { Outlet } from "react-router";
import { centering } from "../utils";

export const BaseLayout = () => {
  return (
    <Box
      className="shelf-container"
      sx={{
        ...centering,
        width: "100dvw",
        height: "100dvh",
        overflow: "hidden",
      }}>
      <Outlet />
    </Box>
  );
};
