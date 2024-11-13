import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Input, Button, Typography } from "@material-tailwind/react";
import Swal from "sweetalert2";
import axios from 'axios';

export function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();
  const [productData, setProductData] = useState({
    name: '',
    ingredients: '',
    sale: '',
    main_product_type_id: '',
    sourcing: '',
    season: '',
    certificateID: '',
    instock: '',
    variants: [],
    img: [],
  });

  const [existingImages, setExistingImages] = useState([]); 
  const [newImages, setNewImages] = useState([]);

  
  useEffect(() => {
    const fetchProductData = async () => {
      try {
        const response = await axios.get(`http://localhost:5050/product/getbyid/${id}`);
        const product = response.data.product;

        
        setProductData({
          name: product.name || '',
          ingredients: product.ingredients || '',
          sale: product.sale || '',
          main_product_type_id: product.main_product_type_id || '',
          sourcing: product.sourcing || '',
          season: product.season || '',
          certificateID: product.certificateID || '',
          instock: product.instock && product.instock.toLowerCase() === 'yes' ? 'Yes' : 'No', 
          variants: product.variants || [],
          img: [] 
        });
        setExistingImages(response.data.images || []);
      } catch (error) {
        console.error("Error fetching product data:", error);
        Swal.fire({
          title: 'Error!',
          text: 'Failed to fetch product data.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
      }
    };

    fetchProductData();
  }, [id]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    const finalValue = value === "" ? null : value;
    setProductData((prevData) => ({ ...prevData, [name]: finalValue }));
  };

  const handleFileChange = (e) => {
    const files = Array.from(e.target.files);
    setNewImages((prevImages) => [...prevImages, ...files]);
  };

  const handleRemoveImage = (imagePath) => {
   
    setExistingImages((prevImages) => prevImages.filter((img) => img.img !== imagePath));
  };

  const handleRemoveNewImage = (index) => {

    setNewImages((prevImages) => prevImages.filter((_, i) => i !== index));
  };


  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = {
      ...updatedVariants[index],
      [name]: value,
    };
    setProductData({ ...productData, variants: updatedVariants });
  };

  const addVariant = () => {
    setProductData((prevData) => ({
      ...prevData,
      variants: [
        ...prevData.variants,
        { size: '', weight: '', before_price: '', after_price: '', available: 'yes' }
      ],
    }));
  };

  const removeVariant = (index) => {
    const updatedVariants = productData.variants.filter((_, i) => i !== index);
    setProductData({ ...productData, variants: updatedVariants });
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    

    const formDataToSend = new FormData();
    for (const key in productData) {
      if (productData[key] !== null && productData[key] !== undefined) {
        if (key === 'instock') {
          formDataToSend.append(key, productData[key] === 'Yes' ? 'yes' : 'no');
        } else if (key === 'img') {
          productData.img.forEach((file) => formDataToSend.append('img', file));
        } else {
          formDataToSend.append(key, productData[key]);
        }
      }
    }

 
    newImages.forEach((file) => {
      formDataToSend.append('img', file);
    });

    try {
      await axios.put(`http://localhost:5050/product/update/${id}`, formDataToSend, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      Swal.fire({
        title: "Updated!",
        text: "Product information updated successfully!",
        icon: "success",
      });
      navigate('/dashboard/products');
    } catch (error) {
      console.error("Error updating product:", error);
      Swal.fire({
        title: "Error!",
        text: error.response?.data?.error || "Failed to update the product. Please try again.",
        icon: "error",
      });
    }
  };

  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center mb-6">
          <Typography variant="h2" className="font-bold mb-4">Update Product</Typography>
          <Typography variant="paragraph" color="blue-gray" className="text-lg font-normal">
            Modify the details below to update the product.
          </Typography>
        </div>
        <form onSubmit={handleUpdate} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">

          
            <Input
              name="name"
              label="Product Name"
              value={productData.name}
              onChange={handleChange}
              required
            />

           
            <Input
              name="ingredients"
              label="Ingredients"
              value={productData.ingredients}
              onChange={handleChange}
              required
            />

          
            <Input
              name="sale"
              label="Sale"
              type="number"
              value={productData.sale}
              onChange={handleChange}
              required
            />

          
            <Input
              name="main_product_type_id"
              label="Main Product Type"
              value={productData.main_product_type_id}
              onChange={handleChange}
              required
            />

          
            <Input
              name="sourcing"
              label="Sourcing"
              value={productData.sourcing}
              onChange={handleChange}
              required
            />

          
            <Input
              name="season"
              label="Season"
              value={productData.season}
              onChange={handleChange}
              required
            />

           
            <Input
              name="certificateID"
              label="Certificate ID"
              value={productData.certificateID}
              onChange={handleChange}
              required
            />

           
            <Input
              name="instock"
              label="In Stock"
              value={productData.instock}
              onChange={handleChange}
              required
            />

           
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Variants</Typography>
              {productData.variants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <div className="flex justify-between items-center">
                    <Typography variant="small" className="mb-1">Variant {index + 1}</Typography>
                    {productData.variants.length > 1 && (
                      <Button type="button" color="red" onClick={() => removeVariant(index)}>Remove</Button>
                    )}
                  </div>
                 
                  <Input 
                    name="size" 
                    value={variant.size} 
                    placeholder="Size (Optional)" 
                    onChange={(e) => handleVariantChange(index, e)} 
                  />

                  
                  <Input 
                    name="weight" 
                    value={variant.weight} 
                    placeholder="Weight (Optional)" 
                    type="number" 
                    onChange={(e) => handleVariantChange(index, e)} 
                  />

                  <Input 
                    name="before_price" 
                    value={variant.before_price} 
                    placeholder="Variant Before Price" 
                    type="number" 
                    onChange={(e) => handleVariantChange(index, e)} 
                    required 
                  />

                  <Input 
                    name="after_price" 
                    value={variant.after_price} 
                    placeholder="Variant After Price" 
                    type="number" 
                    onChange={(e) => handleVariantChange(index, e)} 
                    required 
                  />

                 
                  <div className="flex items-center mt-2">
                    <input
                      type="checkbox"
                      name="available"
                      checked={variant.available === 'yes'}
                      onChange={(e) => handleVariantChange(index, e)}
                    />
                    <label className="ml-2">Available</label>
                  </div>
                </div>
              ))}
              <Button type="button" onClick={addVariant}>Add Variant</Button>
            </div>

           
            <div className="md:col-span-2">
              <input
                type="file"
                name="img"
                multiple
                onChange={handleFileChange}
                className="block mb-4"
              />

          
              {existingImages && existingImages.length > 0 && (
                <div className="mt-4">
                  <Typography variant="small" className="mb-2">Existing Images:</Typography>
                  <div className="grid grid-cols-3 gap-4">
                    {existingImages.map((img, idx) => (
                      <div key={idx} className="relative">
                        <img 
                          src={`http://localhost:5050/${img.img}`} 
                          alt={`Product Image ${idx + 1}`} 
                          className="w-24 h-24 object-cover"
                        />
                        <Button 
                          type="button" 
                          color="red" 
                          className="absolute top-0 right-0"
                          onClick={() => handleRemoveImage(img.img)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


              {newImages.length > 0 && (
                <div className="mt-4">
                  <Typography variant="small" className="mb-2">New Images:</Typography>
                  <div className="grid grid-cols-3 gap-4">
                    {newImages.map((file, idx) => (
                      <div key={idx} className="relative">
                        <img 
                          src={URL.createObjectURL(file)} 
                          alt={`New Image ${idx + 1}`} 
                          className="w-24 h-24 object-cover"
                        />
                        <Button 
                          type="button" 
                          color="red" 
                          className="absolute top-0 right-0"
                          onClick={() => handleRemoveNewImage(idx)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          <Button type="submit" fullWidth>
            Update Product
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateProduct;
