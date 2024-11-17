import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Input,
  Button,
  Typography,
} from "@material-tailwind/react";
import { API_URL } from "../../../App.jsx";
import Swal from "sweetalert2";
import axios from 'axios';

function UpdateBlog() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [img, setImg] = useState(null);
    const [existing_img, setExistingImg] = useState(null);
    const navigate = useNavigate();
    const { id } = useParams();

    useEffect(() => {
      const fetchBlogs = async () => {
        try {
          const response = await axios.get(
            `${API_URL}/blogs/getblogbyid/${id}`
          );
          setTitle(response.data.title);
          setDescription(response.data.description);
          setExistingImg(response.data.img); 
        } catch (error) {
          console.error(error);
        }
      };
  
      fetchBlogs();
    }, [id]);

    const handleUpdateBlog = async (e) => {
      e.preventDefault();
      const formData = new FormData();
      formData.append("title", title);
      formData.append("description", description);
      // Only append the new image if it's selected, otherwise leave it out
      if (img) {
        formData.append("img", img);
      }

      try {
        await axios.put(`${API_URL}/blogs/updateblog/${id}`, formData, {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        });
        Swal.fire({
          title: "Success!",
          text: "Blog Updated successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
        navigate("/dashboard/blogs");
      } catch (error) {
        console.error(error);
        Swal.fire({
          title: "Error!",
          text: "Failed to update. Please try again.",
          icon: "error",
          confirmButtonText: "OK",
        });
      }
    };

  return (
    <section className="m-8 flex gap-4">
      <div className="w-full mt-24">
        <div className="text-center">
          <Typography variant="h2" className="font-bold mb-4">Update Blog</Typography>
        </div>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2" onSubmit={handleUpdateBlog}>
          <div className="grid grid-cols-1 gap-6 ">
            {/* Brand Name Input */}
            <div className="flex flex-col">
              <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Title:</Typography>
              <Input
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={title}
                onChange={(e) => {
                  setTitle(e.target.value);
                }}
              />
            </div>
            <Typography variant="small" color="blue-gray" className="mb-2 font-medium">Description:</Typography>
              <Input
                size="lg"
                className="!border-t-blue-gray-200 focus:!border-t-gray-900"
                value={description}
                onChange={(e) => {
                  setDescription(e.target.value);
                }}
              />
            {/* Brand Image Input */}
            <Typography variant="small" color="blue-gray" className=" font-medium">Blog Image:</Typography>
            <div className="flex flex-col">
              {existing_img && (
                <img src={`${API_URL}/${existing_img}`} alt="Existing brand" className="mb-2 w-32 h-32 object-cover" />
              )}
                <Typography variant="small" color="blue-gray" className="mb-2 ">It is recommended to use the WebP format for images.</Typography>

              <div className="relative">
                <input
                  type="file"
                  id="file_input"
                  onChange={(e) => setImg(e.target.files[0])}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Button className="bg-gray-200 text-gray-800 hover:bg-gray-300 w-full text-left">
                  Choose an image
                </Button>
                <Typography>
                  {img ? (
                    <p>{img.name}</p> // Show selected image name
                  ) : (
                    <Typography variant="small" color="blue-gray" className="text-gray-500">No image selected</Typography>
                  )}
                </Typography>
              </div>
            </div>
          </div>
          <Button type="submit" className="mt-6" fullWidth>
            Update Blog
          </Button>
        </form>
      </div>
    </section>
  );
}

export default UpdateBlog;
