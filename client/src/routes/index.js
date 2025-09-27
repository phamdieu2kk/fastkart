import { createBrowserRouter } from "react-router-dom";
import App from "../App";
import Home from "../pages/Home";
import SignIn from "../pages/SignIn";
import ForgotPassowrd from "../pages/ForgotPassowrd";
import SignUp from "../pages/SignUp";
import AdminPanel from '../pages/AdminPanel';
import AllUsers from '../pages/AllUsers';
import AllProducts from '../pages/AllProducts'; // nếu cần sau này
import CategoryProduct from '../pages/CategoryProduct'
import ProductDetails from "../pages/ProductDetails";
import Cart from "../pages/Cart";
import SearchProduct from "../pages/SearchProduct";
import About from "../pages/About";
import ProductList from "../pages/ProductList";
const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
    children: [
      {
        path: "",
        element: <Home />
      },
      {
        path: "login",
        element: <SignIn />
      },
      {
        path: "forgot-password",
        element: <ForgotPassowrd />
      },
      {
        path: "sign-up",
        element: <SignUp />
      },
    
      {
        path : "product-category",
        element : <CategoryProduct/>
      },
      {
        path : "about",
        element : <About/>
      },
      {
        path : "all-products",
        element : <ProductList/>
      },

       {
        path : "product/:id",
        element : <ProductDetails/>
      },
       {
        path : 'cart',
        element : <Cart/>
      },
       {
        path : "search",
        element : <SearchProduct/>
            },
      {
        path: "admin-panel",
        element: <AdminPanel />,
        children: [
          {
            path: "all-users",
            element: <AllUsers />
          },
          {
            path: "all-products",
            element: <AllProducts />
          },
          
        ]
      }
    ]
  }
]);

export default router;
