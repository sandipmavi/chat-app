import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import { RegisterPage } from "../pages/RegisterPage";
import { CheckEmail } from "../pages/CheckEmail";
import { CheckPassword } from "../pages/CheckPassword";
import { Home } from "../pages/Home";
import { Message } from "../components/Message";
import { ErrorPage } from "../pages/ErrorPage";
import { AuthLayouts } from "../layout";
import { ForgotPassword } from "../pages/ForgotPassword";
import LandingPage from "../pages/LandingPage";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    errorElement: <ErrorPage />,

    children: [
      {
        path: "register",
        element: (
          <AuthLayouts>
            <RegisterPage />
          </AuthLayouts>
        ),
      },
      {
        path: "email",
        element: (
          <AuthLayouts>
            <CheckEmail />
          </AuthLayouts>
        ),
      },
      {
        path: "password",
        element: (
          <AuthLayouts>
            <CheckPassword />{" "}
          </AuthLayouts>
        ),
      },
      {
        path: "forgot-password",
        element: (
          <AuthLayouts>
            <ForgotPassword />
          </AuthLayouts>
        ),
      },
      {
        path: "/home",
        element: <LandingPage />,
      },
      {
        path: "",
        element: <Home />,
        children: [
          {
            path: ":userId",
            element: <Message />,
          },
        ],
      },
    ],
  },
]);
export default router;
