import React, { useEffect, useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import { createPost, getPost, updatePost } from "../services/postService";
import toast from "react-hot-toast";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";

const PostForm = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [dropdownOpen, setDropdownOpen] = useState(false);

  const [post, setPost] = useState({
    title: "",
    image: "",
    publishedDate: "",
    readTime: "",
    subheadings: [{ subheading: "", content: "" }],
  });
  const [isEditing, setIsEditing] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    if (id) {
      const fetchPost = async () => {
        try {
          const result = await getPost(id);
          const postData = result.data;
          setPost({
            ...postData,
            publishedDate: postData.publishedDate.split("T")[0],
          });
        } catch (error) {
          console.error("Error fetching post for editing:", error);
          toast.error("Failed to fetch post for editing.");
        }
      };
      fetchPost();
      setIsEditing(true);
    } else {
      // Set today's date as the default value for publishedDate
      const today = new Date().toISOString().split("T")[0];
      setPost((prevPost) => ({
        ...prevPost,
        publishedDate: today,
      }));
    }
  }, [id]);

  useEffect(() => {
    const storedUsername = localStorage.getItem("user");
    if (storedUsername) {
      setUsername(storedUsername);
    }
  }, []);

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPost({ ...post, [name]: value });
  };

  const handleSubheadingChange = (index, e) => {
    const { name, value } = e.target;
    const newSubheadings = [...post.subheadings];
    newSubheadings[index][name] = value;
    setPost({ ...post, subheadings: newSubheadings });
  };

  const addSubheading = () => {
    setPost({
      ...post,
      subheadings: [...post.subheadings, { subheading: "", content: "" }],
    });
  };

  const removeSubheading = (index) => {
    const newSubheadings = [...post.subheadings];
    newSubheadings.splice(index, 1);
    setPost({ ...post, subheadings: newSubheadings });
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  const validatePost = () => {
    if (!post.title || post.title.trim() === "") {
      toast.error("Title is required.");
      return false;
    }
    if (!post.image || post.image.trim() === "") {
      toast.error("Image URL is required.");
      return false;
    }
    if (!post.publishedDate) {
      toast.error("Published Date is required.");
      return false;
    }
    if (!post.readTime || post.readTime <= 0) {
      toast.error("Read Time should be a positive number.");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validatePost()) return;

    try {
      if (isEditing) {
        await updatePost(id, post);
        toast.success("Post updated successfully!");
      } else {
        await createPost(post);
        toast.success("Post created successfully!");
      }
      navigate("/");
    } catch (error) {
      console.error("Error saving post:", error);
      toast.error("Failed to save post.");
    }
  };

  const handleLogout = () => {
    try {
      localStorage.removeItem("user");
      localStorage.removeItem("email");
      localStorage.removeItem("token");
      navigate("/login");
      toast.success("Log Out successful!");
    } catch (error) {
      console.error("Error logging out:", error);
      toast.error("Failed to log out.");
    }
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link to="/" className="text-4xl font-extrabold tracking-tight">
            Bloggers
          </Link>
          <div className="relative ml-4">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-lg text-white"
            >
              <span className="font-bold">
                Hi, {capitalizeFirstLetter(username)}
              </span>{" "}
              <FaChevronDown />
            </button>
            {dropdownOpen && (
              <div className="absolute right-0 mt-2 bg-white text-black border border-gray-300 rounded-lg shadow-lg w-48">
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 p-2 text-left hover:bg-transparent hover:text-red-600 font-bold transition-colors rounded-lg"
                >
                  <FaSignOutAlt className="text-red-500 mr-5" size={18} />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        <div className="bg-white p-8 rounded-lg shadow-md">
          <h2 className="text-3xl font-semibold mb-6">
            {isEditing ? "Edit Post" : "Create New Blog"}
          </h2>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-lg font-medium mb-2">Title</label>
              <input
                type="text"
                name="title"
                value={post.title}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Image URL
              </label>
              <input
                type="text"
                name="image"
                value={post.image}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Published Date
              </label>
              <input
                type="date"
                name="publishedDate"
                value={post.publishedDate}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Read Time (min)
              </label>
              <input
                type="number"
                name="readTime"
                value={post.readTime}
                onChange={handleChange}
                className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-lg font-medium mb-2">
                Subheadings
              </label>
              {post.subheadings.map((subheading, index) => (
                <div key={index} className="mb-4 space-y-2">
                  <input
                    type="text"
                    name="subheading"
                    value={subheading.subheading}
                    onChange={(e) => handleSubheadingChange(index, e)}
                    placeholder="Subheading"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                  />
                  <textarea
                    name="content"
                    value={subheading.content}
                    onChange={(e) => handleSubheadingChange(index, e)}
                    placeholder="Content"
                    className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                    rows="4"
                  />
                  <div className="flex justify-end">
                    <button
                      type="button"
                      onClick={() => removeSubheading(index)}
                      className="px-4 py-2 bg-red-600 text-white rounded-lg shadow-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500"
                    >
                      Remove
                    </button>
                  </div>
                </div>
              ))}
              <button
                type="button"
                onClick={addSubheading}
                className="px-4 py-2 bg-green-600 text-white rounded-lg shadow-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                Add Subheading
              </button>
            </div>
            <button
              type="submit"
              className="w-full py-3 bg-blue-600 text-white font-semibold rounded-lg shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              {isEditing ? "Update Post" : "Create Post"}
            </button>
          </form>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-800 text-white text-center py-4">
        &copy; 2024 Bloggers. All rights reserved.
      </footer>
    </div>
  );
};

export default PostForm;
