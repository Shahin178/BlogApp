import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { getPosts, searchPosts } from "../services/postService";
import toast, { Toaster } from "react-hot-toast";
import { FaSearch, FaChevronDown, FaSignOutAlt } from "react-icons/fa";

const PostList = () => {
  const [postsData, setPostsData] = useState([]);
  const [username, setUsername] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const response = await getPosts();
        setPostsData(response.data);
      } catch (error) {
        console.error("Error fetching posts:", error);
        toast.error("Failed to load posts.");
      }
    };

    fetchPosts();

    const storedUsername = localStorage.getItem("user");
    if (storedUsername) {
      setUsername(storedUsername.toUpperCase()); // Capitalize username
    }
  }, []);

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = async (e) => {
    e.preventDefault();

    if (searchQuery.trim() === "") return;

    try {
      const response = await searchPosts(searchQuery);
      setPostsData(response.data);
    } catch (error) {
      console.error("Error searching posts:", error);
      toast.error("Failed to search posts.");
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

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
  };

  const capitalizeFirstLetter = (str) =>
    str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();

  return (
    <div className="flex flex-col min-h-screen">
      <Toaster
        position="top-center"
        reverseOrder={false}
        toastOptions={{
          style: {
            fontSize: "16px",
            textAlign: "center",
          },
        }}
      />

      <header className="bg-gradient-to-r from-blue-500 to-purple-600 text-white py-4 shadow-lg">
        <div className="container mx-auto flex justify-between items-center px-4">
          <Link
            to="/"
            className="text-3xl md:text-4xl font-extrabold tracking-tight mr-4"
          >
            Bloggers
          </Link>
          <form
            onSubmit={handleSearchSubmit}
            className="relative w-full max-w-md ml-auto flex"
          >
            <input
              type="text"
              placeholder="Search blogs..."
              value={searchQuery}
              onChange={handleSearchChange}
              className="py-2 px-4 rounded-lg border border-gray-300 text-black pl-10 flex-grow"
            />
            <FaSearch
              className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-500"
              size={20}
            />
            <button type="submit" className="hidden">
              Search
            </button>
          </form>
          <div className="relative ml-4">
            <button
              onClick={toggleDropdown}
              className="flex items-center space-x-2 text-lg text-white"
            >
              <span className="font-bold">
                Hi, {capitalizeFirstLetter(username)}
              </span>
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

      <main className="flex-grow container mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Latest Blog Posts</h2>
          <Link to="/create-post">
            <button className="bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded">
              Create New Post
            </button>
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {postsData.length > 0 ? (
            postsData.map((post) => (
              <Link to={`/posts/${post._id}`} key={post._id} className="block">
                <div className="bg-white rounded-lg shadow-lg overflow-hidden hover:shadow-xl hover:bg-blue-50 transition-shadow duration-300 flex flex-col h-full">
                  <img
                    src={post.image || "https://via.placeholder.com/350"}
                    alt={post.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4 flex flex-col flex-grow">
                    <h3 className="text-xl font-bold mb-4">{post.title}</h3>
                    <div className="mt-auto">
                      <p className="text-gray-500 text-sm">
                        Published on{" "}
                        {new Date(post.publishedDate).toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                </div>
              </Link>
            ))
          ) : (
            <p>No posts available.</p>
          )}
        </div>
      </main>

      <footer className="bg-gray-800 text-white py-4">
        <div className="container mx-auto text-center px-4">
          <p>&copy; 2024 Bloggers. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default PostList;
