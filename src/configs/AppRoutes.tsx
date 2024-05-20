import { FC } from "react";
import { Route, Routes } from "react-router-dom";
import App from "../App";
import { Home } from "../components/Home";
import { Categories } from "../components/Categories";
import { UploadReceipt } from "../components/UploadReceipt";
import { Statistics } from "../components/Statistics";

export const AppRoutes: FC = () => {
  return (
    <Routes>
      <Route path={"/"} element={<App />}>
        <Route path={"/"} element={<Home />}></Route>
        <Route path={"/categories"} element={<Categories />}></Route>
        <Route path={"/upload-receipt"} element={<UploadReceipt />}></Route>
        <Route path={"/statistics"} element={<Statistics />}></Route>
      </Route>
    </Routes>
  );
};
