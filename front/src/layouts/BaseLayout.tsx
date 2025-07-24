import { Box } from "@mui/material"
import { Outlet } from "react-router"

export const BaseLayout = () => {
  return (
    <Box
      className="shelf-container"
      sx={{
        width: "100dvw",
        height: "100dvh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center"
      }}
    >
      <Outlet />
    </Box>
  )
}
