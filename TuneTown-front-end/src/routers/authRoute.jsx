import { Outlet } from "react-router-dom";
import LoginPage from "../pages/LoginPage";
import SignupPage from "../pages/SignUpPage";
import ForgotPass from "../pages/ForgotPass";
// import GuardRoute from "./GuardRoute";

// Xem cấu trúc routes ở https://reactrouter.com/en/main/routers/create-browser-router#routes
export default function init(routes) {
  const route = {
    path: "/",
    element: (
      <div>
        <Outlet></Outlet>
      </div>
    ),
    // Element là AuthenLayout, các children muốn hiển thị được trong AuthenLayout thì trong Layout phải có outlet mới hiển thị được
    // outlet đóng vai trò tương tự children
    // Xem thêm ở https://reactrouter.com/en/main/components/outlet
    children: [
      {
        // path: "login",
        index: true,
        element: (
          // <GuardRoute>
          <LoginPage />
          // </GuardRoute>
        ),
      },
      {
        path: "signup",
        element: (
          //<GuardRoute>
          <SignupPage />
          //</GuardRoute>
        ),
      },

      {
        path: "forgotpass",
        element: <ForgotPass />,
      },
    ],
  };
  // push route
  routes.push(route);
}
