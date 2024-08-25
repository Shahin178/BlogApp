import React, { useEffect, useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { getPost, deletePost } from "../services/postService";
import toast from "react-hot-toast";
import { FaChevronDown, FaSignOutAlt } from "react-icons/fa";

const PostDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [post, setPost] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [username, setUsername] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);

  useEffect(() => {
    // Fetch post details
    const fetchPost = async () => {
      try {
        const result = await getPost(id);
        setPost(result.data);
      } catch (error) {
        console.error("Error fetching post details:", error);
        toast.error("Failed to fetch post details.");
      }
    };
    fetchPost();

    // Get username from local storage
    const user = localStorage.getItem("user");
    if (user) {
      setUsername(user);
    }
  }, [id]);

  const handleEdit = () => {
    navigate(`/create-post/${id}`); // Navigate to CreatePost page with post ID
  };

  const handleDelete = async () => {
    try {
      await deletePost(id);
      toast.success("Successfully deleted!");
      navigate("/"); // Redirect to homepage or post list after deletion
    } catch (error) {
      console.error("Error deleting post:", error);
      toast.error("Failed to delete post.");
    }
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();


    const toggleDropdown = () => {
      setDropdownOpen(!dropdownOpen);
    };

  const openDeleteModal = () => {
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
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
    <div className="flex flex-col min-h-screen">
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
                  <FaSignOutAlt className="text-red-500" size={18} />
                  <span className="ml-2">Logout</span>
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-grow container mx-auto p-6">
        {post ? (
          <>
            <div className="flex flex-col sm:flex-row items-center mb-6">
              <h1 className="text-3xl font-bold mb-4 sm:mb-0">{post.title}</h1>
              <div className="ml-auto flex space-x-2">
                <button
                  onClick={handleEdit}
                  className="bg-yellow-500 hover:bg-yellow-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Update
                </button>
                <button
                  onClick={openDeleteModal}
                  className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg transition-colors duration-300"
                >
                  Delete
                </button>
              </div>
            </div>

            <img
              src={post.image}
              alt={post.title}
              className="w-full h-96 object-cover mb-6 rounded-lg shadow"
            />
            <p className="text-gray-600 mb-4">
              Published on {new Date(post.publishedDate).toLocaleDateString()} |{" "}
              {post.readTime} min read
            </p>
            {post.subheadings.map((subheading, index) => (
              <div key={index} className="mb-6">
                <h2 className="text-2xl font-semibold mb-2">
                  {subheading.subheading}
                </h2>
                <p className="text-gray-700">{subheading.content}</p>
              </div>
            ))}
          </>
        ) : (
          <p>Loading post...</p>
        )}
      </main>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg max-w-sm w-full">
            <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
            <p className="mb-4">Are you sure you want to delete this post?</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={handleDelete}
                className="bg-red-500 hover:bg-red-600 text-white py-2 px-4 rounded-lg"
              >
                Yes
              </button>
              <button
                onClick={closeDeleteModal}
                className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg"
              >
                No
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center">
          <p>&copy; 2024 Bloggers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostDetail;
