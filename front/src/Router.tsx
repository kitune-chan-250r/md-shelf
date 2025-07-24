import { BrowserRouter, Route, Routes } from "react-router"
import { Shelf } from "./pages/Shelf"
import { Article } from "./pages/Article"
import { BaseLayout } from "./layouts/BaseLayout"

export const Router = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<BaseLayout />}>
          <Route index element={<Shelf />} />
          <Route path="/article" element={<Article />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
