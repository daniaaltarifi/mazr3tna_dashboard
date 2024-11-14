import { Routes, Route } from "react-router-dom";
import { Cog6ToothIcon } from "@heroicons/react/24/solid";
import { IconButton } from "@material-tailwind/react";
import {
  Sidenav,
  DashboardNavbar,
  Configurator,
  Footer,
} from "@/widgets/layout";
import routes from "@/routes";

import { useMaterialTailwindController, setOpenConfigurator } from "@/context";
import AddUser from "@/pages/dashboard/Users/AddUser";
import UpdateUser from "@/pages/dashboard/Users/UpdateUser";
import UpdateBrand from "@/pages/dashboard/Brands/UpdateCertificate";
import AddCode from "@/pages/dashboard/Codes/AddCodes";
import UpdateCode from "@/pages/dashboard/Codes/UpdateCode";
import AddSlide from "@/pages/dashboard/Slider/AddSlide";
import UpdateSlide from "@/pages/dashboard/Slider/UpdateSlide";
import AddCertificate from "@/pages/dashboard/Brands/AddCertificate";
import UpdateCertificate from "@/pages/dashboard/Brands/UpdateCertificate";
import AddCategory from "@/pages/dashboard/Category/AddCategory";
import AddProduct from "@/pages/dashboard/Products/AddProducts/AddProduct";
import UpdateProduct from "@/pages/dashboard/Products/UpdateProducts";
import UpdateVariant from "@/pages/dashboard/Products/UpdateVariants";
export function Dashboard() {
  const [controller, dispatch] = useMaterialTailwindController();
  const { sidenavType } = controller;

  return (
    <div className="min-h-screen bg-blue-gray-50/50">
      <Sidenav
        routes={routes}
        brandImg={
          sidenavType === "dark" ? "/img/logo-ct.png" : "/img/logo-ct-dark.png"
        }
      />
      <div className="p-4 xl:ml-80">
        <DashboardNavbar />
        <Configurator />
        <IconButton
          size="lg"
          color="white"
          className="fixed bottom-8 right-8 z-40 rounded-full shadow-blue-gray-900/10"
          ripple={false}
          onClick={() => setOpenConfigurator(dispatch, true)}
        >
          <Cog6ToothIcon className="h-5 w-5" />
        </IconButton>
        <Routes>
          {routes.map(({ layout, pages }) =>
            layout === "dashboard" &&
            pages.map(({ path, element }) => (
              <Route key={path} path={path} element={element} />
            ))
          )}
            <Route path="adduser" element={<AddUser />} />
            <Route path="updateuser/:id" element={<UpdateUser />} />
            <Route path="addCertificate" element={<AddCertificate />} />
            <Route path="updatecertificate/:id" element={<UpdateCertificate />} />
            <Route path="addcode" element={<AddCode />} />
            <Route path="updatecode/:id" element={<UpdateCode />} />
            <Route path="addslide" element={<AddSlide />} />
            <Route path="updateslide/:id" element={<UpdateSlide />} />
            <Route path="addcategory" element={<AddCategory />} />
            <Route path="addproduct" element={<AddProduct />} />
        <Route path="updateproducts/:id" element={<UpdateProduct />} /> 
        <Route path="updatevariants/:id" element={<UpdateVariant />} /> 



        </Routes>   
        <div className="text-blue-gray-600">
          <Footer />
        </div>
      </div>
    </div>
  );
}

Dashboard.displayName = "/src/layout/dashboard.jsx";

export default Dashboard;
