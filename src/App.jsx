import { Routes, Route, Navigate } from "react-router-dom";
import { Dashboard, Auth } from "@/layouts";
import Cookies from 'js-cookie';

import { useState,useEffect } from "react";



import AddUser from "./pages/dashboard/Users/AddUser.jsx";
import UpdateUser from "./pages/dashboard/Users/UpdateUser.jsx";
import AddBrand from "./pages/dashboard/Brands/AddCertificate.jsx";
import UpdateBrand from "./pages/dashboard/Brands/UpdateCertificate.jsx";
import AddCode from "./pages/dashboard/Codes/AddCodes.jsx";
import UpdateCode from "./pages/dashboard/Codes/UpdateCode.jsx";
import AddSlide from "./pages/dashboard/Slider/AddSlide.jsx";
import UpdateSlide from "./pages/dashboard/Slider/UpdateSlide.jsx";
import { SignIn } from "./pages/auth";

import AddCategory from "./pages/dashboard/Category/AddCategory";
import AddProduct from "./pages/dashboard/Products/AddProducts/AddProduct";
import UpdateProduct from "./pages/dashboard/Products/UpdateProducts";
import UpdateVariant from "./pages/dashboard/Products/UpdateVariants.jsx";
export const API_URL="https://mazr3tnabackend.kassel.icu";
// export const API_URL="http://localhost:5050";

function App() {
  // const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(() => !!Cookies.get('authtoken'));

  useEffect(() => {
    const token = Cookies.get('authtoken');
    if (token) {
      // setIsAuthenticated(true);
      setIsAuthenticated(!!token);
    }
  }, []);
  return (
    <Routes>

      {/* <Route path="/dashboard/*" element={<Dashboard />}> */}
      <Route path="/dashboard/*" element={
        isAuthenticated ? <Dashboard /> : <Navigate to="/auth/sign-in" replace />
      }> 
        <Route path="adduser" element={<AddUser />} />
        <Route path="updateuser/:id" element={<UpdateUser />} />
        <Route path="addcertificate" element={<AddBrand />} />
        <Route path="updatebrand" element={<UpdateBrand />} />
        <Route path="addcode" element={<AddCode />} />
        <Route path="updatecode/:id" element={<UpdateCode />} />
        <Route path="addslide" element={<AddSlide />} />
        <Route path="updateslide/:id" element={<UpdateSlide />} />
        <Route path="addcategory" element={<AddCategory />} />
        <Route path="addproduct" element={<AddProduct />} />


        <Route path="updateproducts/:id" element={<UpdateProduct />} /> 
        <Route path="updatevariants/:id" element={<UpdateVariant />} /> 

      </Route>
      <Route path="/auth/*" element={<Auth />} />
      <Route path="/auth/sign-in" element={<SignIn setIsAuthenticated={setIsAuthenticated} />} />
      <Route path="*" element={<Navigate to="/dashboard/home" replace />} />

    </Routes>
  );
}

export default App;