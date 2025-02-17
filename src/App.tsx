import React from "react";
import { createBrowserRouter, RouterProvider } from "react-router";
import Auth from "../src/auth/Auth.tsx";
import Home from "./pages/Home.tsx";


export default function App() {

  const router = createBrowserRouter([
    {
      index: true,
      path: "/",
      element: <Auth/>
    },
    {
      path:"/home",
      element: <Home/>
    }
  ]);

  return (
    <div>
      <RouterProvider router={router}/>
    </div>
  );
}
