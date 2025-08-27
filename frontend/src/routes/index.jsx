import { createBrowserRouter } from "react-router-dom";

import LandingPage from "../components/LandingPage2";
import { ErrorPage } from "../pages/ErrorPage";
import { Home } from "../pages/Home";
import App from "@/App";
// import { Message } from "../components/Message";

const router = createBrowserRouter([
  {
    path: "/",
    element: <LandingPage />,
    errorElement: <ErrorPage />,
  },
  {
    path: "/home",
    element: <Home />,
    children: [{ path: ":userId", element: <Home /> }],
  },
  { path: "*", element: <ErrorPage /> },
]);

export default router;
