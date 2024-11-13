import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Card,
  CardHeader,
  CardBody,
  Typography,
  Button,
  Chip
} from "@material-tailwind/react";
import { PencilIcon, TrashIcon, PlusIcon } from "@heroicons/react/24/outline";
import Swal from 'sweetalert2';
import { API_URL } from '@/App';

export function Products() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch(`${API_URL}/product/get/getAllPro`);
        const data = await response.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

 
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this product?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      background: '#000',
      color: '#fff',
      customClass: {
        confirmButton: 'bg-blue-600 text-white',
        cancelButton: 'bg-red-600 text-white'
      }
    });

    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/product/delete/${id}`, { method: 'DELETE' });
        setProducts(products.filter(product => product.id !== id));
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your product has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white'
          }
        });
      } catch (error) {
        console.error("Error deleting product:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the product.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };

  const handleEdit = (product) => {
    const { main_product_type, id } = product;

    switch (main_product_type) {
      case "Watch":
        navigate(`/dashboard/updatewatches/${id}`);
        break;
      case "Fragrance":
        navigate(`/dashboard/updateFragrances/${id}/${product.FragranceID}`);
        break;
      case "Bag":
        navigate(`/dashboard/updateBags/${id}/${product.BagID}`);
        break;
      default:
        Swal.fire({
          title: 'Error!',
          text: 'Unknown product type.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
    }
  };

  const handleEditVariant = (variant, product) => {
    const { main_product_type } = product;
    const { VariantID } = variant;
 
    switch (main_product_type) {
      case "Fragrance":
        navigate(`/dashboard/updateFragrancesVariant/${VariantID}`);
        break;
      case "Bag":
        navigate(`/dashboard/updatebagvariants/${VariantID}`);
        break;
      default:
        Swal.fire({
          title: 'Error!',
          text: 'Unknown variant type.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
    }
  };

  const handleDeleteVariant = async (variant) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this variant?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      background: '#000',
      color: '#fff',
      customClass: {
        confirmButton: 'bg-blue-600 text-white',
        cancelButton: 'bg-red-600 text-white'
      }
    });
 
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/product/deletefragrancevariant/${variant.VariantID}`, {
          method: 'DELETE'
        });
 
        setProducts(prevProducts =>
          prevProducts.map(product => ({
            ...product,
            variantDetails: product.variantDetails.filter(v => v.VariantID !== variant.VariantID)
          }))
        );
 
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your variant has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white'
          }
        });
      } catch (error) {
        console.error("Error deleting variant:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the variant.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };
  const handleDeleteBagVariant = async (variant) => {
    const result = await Swal.fire({
      title: 'Are you sure you want to delete this bag variant?',
      showCancelButton: true,
      confirmButtonText: 'Yes, delete it!',
      cancelButtonText: 'Cancel',
      icon: 'warning',
      background: '#000',
      color: '#fff',
      customClass: {
        confirmButton: 'bg-blue-600 text-white',
        cancelButton: 'bg-red-600 text-white'
      }
    });
  
    if (result.isConfirmed) {
      try {
        await fetch(`${API_URL}/product/deletebagvariant/${variant.VariantID}`, {
          method: 'DELETE'
        });
  
        setProducts(prevProducts =>
          prevProducts.map(product => ({
            ...product,
            variantDetails: product.variantDetails.filter(v => v.VariantID !== variant.VariantID)
          }))
        );
  
        await Swal.fire({
          title: 'Deleted!',
          text: 'Your bag variant has been deleted.',
          icon: 'success',
          background: '#000',
          color: '#fff',
          customClass: {
            confirmButton: 'bg-blue-600 text-white'
          }
        });
      } catch (error) {
        console.error("Error deleting bag variant:", error);
        Swal.fire({
          title: 'Error!',
          text: 'There was an error deleting the bag variant.',
          icon: 'error',
          background: '#000',
          color: '#fff',
        });
      }
    }
  };
  return (
    <div className="mt-12 mb-8 flex flex-col gap-12"> 
    <Card >
      <CardHeader variant="gradient" color="green" className="mb-3 p-6">
        <Typography variant="h6" color="white">
          Manage Products
        </Typography>
      </CardHeader>
      <CardBody>
        <div className="flex justify-between mb-4">
          {/* <Button className="bg-blue-600 text-white" >
            <PlusIcon className="h-5 w-5 mr-2" /> Add Product
          </Button> */}
          <Button onClick={()=>navigate('/dashboard/addproduct')}
  className="flex items-center bg-[#D87C55] transition duration-300 ease-in hover:shadow-lg hover:shadow-green-500"
  style={{ marginLeft: '50px' }} 
>
  <PlusIcon className="h-5 w-5 mr-1" /> Add Product
</Button>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full text-sm table-auto text-blue-gray-700">
            <thead>
              <tr>
                {[
                  "ID", "Name", "ingredients", "Sale",
                  "Main Product Type",
                  "Sourcing", "Season","Instock","Certificate", "Updated At", "Variants",
                  "Variants Action", "Actions"
                ].map((header) => (
                  <th key={header} className="border-b py-3 px-5 text-left">
                    <Typography variant="small" className="font-semibold text-xs text-blue-gray-500">
                      {header}
                    </Typography>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={13} className="py-3 text-center">
                    <Typography className="text-gray-500">Loading...</Typography>
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="hover:bg-gray-100">
                    <td className="border-b py-3 px-5">{product.id}</td>
                    <td className="border-b py-3 px-5">{product.name}</td>
                    <td className="border-b py-3 px-5"><Typography className="text-xs font-semibold text-blue-gray-500 "style={{width:"300px"}}>
                    {product.ingredients}</Typography></td>
                    <td className="border-b py-3 px-5">
                     <Chip
                      variant="gradient"
                      color={product.sale === "yes" ? "green" :"red"}
                     value={product.sale}
                    className="py-0.5 px-5 text-[11px] font-medium text-center"
                    />
                   </td>
                    <td className="border-b py-3 px-5">{product.main_product_type_name}</td>
                    <td className="border-b py-3 px-5">{product.sourcing}</td>
                    <td className="border-b py-3 px-5">{product.season}</td>
                    <td className="border-b py-3 px-5">{product.instock}</td>
                    <td className="border-b py-3 px-5">{product.certificate_name}</td>
                    <td className="border-b py-3 px-5">{product.updated_at}</td>
                    <td className="border-b py-3 px-5">
                      <ul className="list-disc pl-5 space-y-2">
                        {product.variants.map((variant) => (
                          <li key={variant.variant_id} className="text-sm text-gray-700"style={{width:"300px"}}>
                            Size :  {variant.size ? variant.size : "No Size"} ,Weight: {variant.weight ? `${variant.weight} kg` : "No Weight"}, Before Price: {variant.before_price} JD, After Price: {variant.after_price}JD,Available:{variant.available}
                          </li>
                        ))}
                      </ul>
                    </td>
                    {/* <td className="border-b py-3 px-5">
                      <div className="flex flex-col gap-2">
                        {product.variantDetails.map((variant) => (
                          <div key={variant.VariantID} className="flex gap-2">
                            <Button className="mr-2 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
                             color="blue-gray" variant="text" size="sm" onClick={() => handleEditVariant(variant, product)}>
                              <PencilIcon className="h-4 w-4 mr-1" /> Edit
                            </Button>
                            <Button className="text-red-600 flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
                             color="red-500" variant="text" size="sm" onClick={() => {
                              if (product.main_product_type === "Bag") {
                                handleDeleteBagVariant(variant);
                              } else if (product.main_product_type === "Fragrance") {
                                handleDeleteVariant(variant);
                              }
                            }}>
                              <TrashIcon className="h-4 w-4 mr-1" /> Delete
                            </Button>
                          </div>
                        ))}
                      </div>
                    </td> */}
                   <td className="border-b py-3 px-5">
  <div className="flex justify-center gap-2">
    <Button
  
      onClick={() => handleEdit(product)}
      className="mr-2 flex bg-[#D87C55] items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-blue-500"
      >
      <PencilIcon className="h-4 w-4 mr-1" /> Edit
    </Button>
    <Button
      onClick={() => handleDelete(product.id)}
      className="text-white-600 bg-[#F5C16C] flex items-center transition duration-300 ease-in hover:shadow-lg hover:shadow-red-500"
      >
      <TrashIcon className="h-5 w-5 mr-1" /> Delete
    </Button>
  </div>
</td>

                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </CardBody>
    </Card>
    </div>
  );
}

export default Products