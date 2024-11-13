import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Input, Button, Typography } from '@material-tailwind/react';
import Swal from 'sweetalert2';
import { useNavigate, useParams } from 'react-router-dom';  
import { API_URL } from '@/App';

export function UpdateProduct() {
  const navigate = useNavigate();
  const { id } = useParams();  

  const [productData, setProductData] = useState({
    name: '',
    ingredients: '',
    sale: '',
    main_product_type_id: '',
    certificateID: '',
    sourcing: '',
    season: '',
    instock: '',
    variants: [{ size: '', weight: '', available: '', before_price: '', after_price: '' }],
    img: [],
  });

  const [main_product, setMainProduct] = useState([]);
  const [certificate, setCertificate] = useState([]);
  const [existingImages, setExistingImages] = useState([]);
  const [newImages, setNewImages] = useState([]);

  const fetchMainProduct = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/mainproduct/getmainproduct`);
      if (!response.ok) throw new Error('Failed to fetch main_product');
      const data = await response.json();
      setMainProduct(data);
    } catch (error) {
      console.error('Error fetching main_product:', error);
    }
  }, []);


  const fetchCertificate = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/certificate/get/certificates`);
      if (!response.ok) throw new Error('Failed to fetch certificates');
      const data = await response.json();
      setCertificate(data);
    } catch (error) {
      console.error('Error fetching certificates:', error);
    }
  }, []);

  const fetchProductData = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/product/getbyidcms/${id}`);
      if (!response.ok) throw new Error('Failed to fetch product');
      const data = await response.json();
      const { product, variants, images } = data;
      console.log(images)

      setProductData({
        name: product.name,
        ingredients: product.ingredients,
        sale: product.sale,
        main_product_type_id: product.main_product_type_id,
        certificateID: product.certificateID,
        sourcing: product.sourcing,
        season: product.season,
        instock: product.instock,
        variants: variants || [{ size: '', weight: '', available: '', before_price: '', after_price: '' }],
        img: [],
      });

      setExistingImages(images || []);
    } catch (error) {
      console.error('Error fetching product data:', error);
    }
  }, [id]);

  useEffect(() => {
    fetchMainProduct();
    fetchCertificate();
    fetchProductData();
  }, [fetchMainProduct, fetchCertificate, fetchProductData]);

 
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProductData((prevData) => ({ ...prevData, [name]: value }));
  };

 
  const handleFileChange = (e) => {
    const files = e.target.files;
    const MAX_IMG = 5;
    if (files.length + productData.img.length > MAX_IMG) {
      Swal.fire({
        title: 'Error!',
        text: `You can only upload a maximum of ${MAX_IMG} images.`,
        icon: 'error',
        confirmButtonText: 'Ok',
      });
      e.target.value = null;
      return;
    }
    setNewImages((prevImages) => [...prevImages, ...files]);
  };


  const handleVariantChange = (index, e) => {
    const { name, value } = e.target;
    const updatedVariants = [...productData.variants];
    updatedVariants[index] = { ...updatedVariants[index], [name]: value };
    setProductData((prevData) => ({ ...prevData, variants: updatedVariants }));
  };


  const addVariant = () => {
    setProductData((prevData) => ({
      ...prevData,
      variants: [...prevData.variants, { size: '', weight: '', available: '', before_price: '', after_price: '' }],
    }));
  };


  const handleSubmit = async (e) => {
    e.preventDefault();


    for (const [key, value] of Object.entries(productData)) {
      if (key !== 'variants' && !value) {
        Swal.fire({
          title: 'Error!',
          text: `${key.replace(/_/g, ' ')} is required.`,
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }
    }


    for (const variant of productData.variants) {
      if (!variant.available || !variant.before_price || !variant.after_price) {
        Swal.fire({
          title: 'Error!',
          text: 'All variant fields except size and weight are required.',
          icon: 'error',
          confirmButtonText: 'Ok',
        });
        return;
      }
    }

    const formDataToSend = new FormData();
    Object.entries(productData).forEach(([key, value]) => {
      if (key !== 'variants') {
        if (Array.isArray(value)) {
          value.forEach((item) => formDataToSend.append(key, item));
        } else {
          formDataToSend.append(key, value);
        }
      }
    });


    productData.variants.forEach((variant, index) => {
      formDataToSend.append(`variants[${index}][size]`, variant.size);
      formDataToSend.append(`variants[${index}][weight]`, variant.weight);
      formDataToSend.append(`variants[${index}][available]`, variant.available);
      formDataToSend.append(`variants[${index}][before_price]`, variant.before_price);
      formDataToSend.append(`variants[${index}][after_price]`, variant.after_price);
    });

 
    newImages.forEach((file) => formDataToSend.append('img', file));

    try {
      const response = await fetch(`${API_URL}/product/update/${id}`, {
        method: 'PUT',
        body: formDataToSend,
      });
      if (!response.ok) throw new Error('Failed to update product');
      Swal.fire({
        title: 'Updated!',
        text: 'The product has been updated successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      }).then(() => {
        navigate('/dashboard/products');
      });
    } catch (error) {
      console.error('Error:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error updating the product. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };


  const handleImageDelete = async (imageId) => {
    try {
      const response = await fetch(`${API_URL}/product/deleteImage/${imageId}`, {
        method: 'DELETE',
      });
      if (!response.ok) {
        throw new Error('Failed to delete image');
      }

   
      setExistingImages((prevImages) => prevImages.filter((image) => image.id !== imageId));

      Swal.fire({
        title: 'Deleted!',
        text: 'The image has been deleted successfully.',
        icon: 'success',
        confirmButtonText: 'Ok',
      });
    } catch (error) {
      console.error('Error deleting image:', error);
      Swal.fire({
        title: 'Error!',
        text: 'There was an error deleting the image. Please try again.',
        icon: 'error',
        confirmButtonText: 'Ok',
      });
    }
  };

  const mainProductOptions = useMemo(() => main_product.map((catg) => (
    <option key={catg.id} value={catg.id}>{catg.name}</option>
  )), [main_product]);

  const certificateOptions = useMemo(() => certificate.map((type) => (
    <option key={type.id} value={type.id}>{type.certificate_name}</option>
  )), [certificate]);
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
        await fetch(`${API_URL}/product/deleteimage/${id}`, { method: 'DELETE' });
        setExistingImages(existingImages.filter(product => product.id !== id));
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
  return (
    <section className="m-8 flex justify-center">
      <div className="w-full lg:w-3/5 mt-16">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Update Product</Typography>
          <Typography variant="paragraph" weight="blue-gray" className="text-lg font-normal">
            Edit the details below to update the product.
          </Typography>
        </div>
        <form onSubmit={handleSubmit} className="mt-8 mb-2 mx-auto w-full max-w-screen-lg">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div>
              <Typography variant="small" className="block mb-1">Name</Typography>
              <Input name="name" value={productData.name} onChange={handleChange} required />
            </div>
            <div>
              <Typography variant="small" className="block mb-1">Ingredients</Typography>
              <Input name="ingredients" value={productData.ingredients} onChange={handleChange} required />
            </div>
            <div>
              <Typography variant="small" className="block mb-1">Sale</Typography>
              <select name="sale" value={productData.sale} onChange={handleChange} className="w-full">
                <option value="">Select Sale Option</option>
                <option value="no">No</option>
                <option value="yes">Yes</option>
              </select>
            </div>
            <div>
              <Typography variant="small" className="block mb-1">Category</Typography>
              <select name="main_product_type_id" value={productData.main_product_type_id} onChange={handleChange} className="w-full">
                <option value="">Select Category</option>
                {mainProductOptions}
              </select>
            </div>
            <div>
              <Typography variant="small" className="block mb-1">Certificate</Typography>
              <select name="certificateID" value={productData.certificateID} onChange={handleChange} className="w-full">
                <option value="">Select Certificate</option>
                {certificateOptions}
              </select>
            </div>

       
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Variants</Typography>
              {productData.variants.map((variant, index) => (
                <div key={index} className="flex flex-col mb-4 border p-4 rounded-lg">
                  <Input name="size" value={variant.size} placeholder="Size" onChange={(e) => handleVariantChange(index, e)} />
                  <Input name="weight" value={variant.weight} placeholder="Weight" onChange={(e) => handleVariantChange(index, e)} />
                  <select name="available" value={variant.available} onChange={(e) => handleVariantChange(index, e)} className="w-full">
                    <option value="">Availability</option>
                    <option value="yes">Yes</option>
                    <option value="no">No</option>
                  </select>
                  <Input name="before_price" value={variant.before_price} placeholder="Before Price" type="number" onChange={(e) => handleVariantChange(index, e)} />
                  <Input name="after_price" value={variant.after_price} placeholder="After Price" type="number" onChange={(e) => handleVariantChange(index, e)} />
                </div>
              ))}
              <Button type="button" onClick={addVariant} className="mt-2">Add Variant</Button>
            </div>

         
            {existingImages && existingImages.length > 0 && (
                <div className="mt-4">
                  <Typography variant="small" className="mb-2">Existing Images:</Typography>
                  <div className="grid grid-cols-3 gap-4">
                    {existingImages.map((img, idx) => (
                      <div key={img.id} className="relative">
                        <img 
                          src={`http://localhost:5050/${img.img}`} 
                          alt={`Product Image ${idx + 1}`} 
                          className="w-24 h-24 object-cover"
                        />
                        <Button 
                          type="button" 
                          color="red" 
                          className="absolute top-0 right-0"
                          onClick={() => handleDelete(img.id)}
                        >
                          Delete
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}


           
            <div className="md:col-span-2">
              <Typography variant="small" className="block mb-1">Add New Images</Typography>
              <Input type="file" name="img" onChange={handleFileChange} accept="image/*" multiple />
            </div>
          </div>
          <Button type="submit" className="mt-4" fullWidth>Update Product</Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateProduct;