import { createBrowserRouter, Outlet } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { Home } from "./pages/Home";
import { AuthLayout } from "./pages/layouts/AuthLayout";
import RootLayout from "./pages/layouts/RootLayout";
import { Login } from "./pages/Login";
import { Signup } from "./pages/Signup";

export const router = createBrowserRouter([
  {
    element: <ContextWrapper/>,
    children: [
      {
        element: <RootLayout />,
        path: '/',
        children: [
          {index:true, element: <Home/>},
          { path: "channel", element: <></> },
        ],
      },
      {
        element: <AuthLayout />,
        children: [
          { path: "login", element: <Login /> },
          { path: "signup", element: <Signup /> },
        ],
      },
    ],
  },
]);

function ContextWrapper(){
    return <AuthProvider><Outlet/></AuthProvider>
}