import React, { useState, useEffect, useRef } from 'react';
import { FaArrowLeft, FaArrowRight } from 'react-icons/fa';
import EditPost from './EditPost';
import DeletePost from './DeletePost';

const sortOptions = ['Newest', 'Oldest', 'Title'];

function ManagePosts() {
  const [posts, setPosts] = useState([]);
  const [selectedSort, setSelectedSort] = useState('Newest');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [deletingPost, setDeletingPost] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [editingPost, setEditingPost] = useState(null);
  const postsPerPage = 6;
  const scrollRef = useRef(null);

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        const res = await fetch('/api/posts/all-posts');
        const data = await res.json();
        setPosts(data || []);
      } catch (err) {
        console.error('Failed to fetch posts:', err);
        setPosts([]);
      }
    };

    fetchPosts();
  }, []);

  const allCategories = [
    'All',
    ...new Set(posts.map((p) => (p.category?.name ? p.category.name : 'Uncategorized')))
  ];

  let filteredPosts =
    selectedCategory === 'All'
      ? posts
      : posts.filter((p) =>
        (p.category?.name || 'Uncategorized') === selectedCategory
      );

  filteredPosts = [...filteredPosts].sort((a, b) => {
    if (selectedSort === 'Newest') return new Date(b.createdAt) - new Date(a.createdAt);
    if (selectedSort === 'Oldest') return new Date(a.createdAt) - new Date(b.createdAt);
    if (selectedSort === 'Title') return a.title.localeCompare(b.title);
    return 0;
  });

  const totalPages = Math.ceil(filteredPosts.length / postsPerPage);
  const startIndex = (currentPage - 1) * postsPerPage;
  const paginatedPosts = filteredPosts.slice(startIndex, startIndex + postsPerPage);

  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) {
      setCurrentPage(page);
      setTimeout(() => {
        if (scrollRef.current) {
          const topOffset = scrollRef.current.getBoundingClientRect().top + window.scrollY;
          window.scrollTo({ top: topOffset - 55, behavior: 'smooth' });
        }
      }, 50);
    }
  };

  const handlePostDeleted = (deletedId) => {
    setPosts((prev) => prev.filter((p) => p._id !== deletedId));
  };


  const handleEditClick = (post) => {
    setEditingPost(post);
  };

  const closeModal = () => {
    setEditingPost(null);
  };

  return (
    <div className="container mx-auto px-4 py-10" ref={scrollRef}>
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-6 gap-4">
        <h2 className="text-2xl font-bold">Manage Posts</h2>
        <div className="flex gap-3">
          <select
            value={selectedCategory}
            onChange={(e) => {
              setSelectedCategory(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none"
          >
            {allCategories.map((cat) => (
              <option key={cat} value={cat}>
                {cat}
              </option>
            ))}
          </select>

          <select
            value={selectedSort}
            onChange={(e) => {
              setSelectedSort(e.target.value);
              setCurrentPage(1);
            }}
            className="bg-white border border-gray-300 text-sm px-4 py-2 pr-8 rounded-md shadow-sm focus:outline-none"
          >
            {sortOptions.map((opt) => (
              <option key={opt} value={opt}>
                Sort by {opt}
              </option>
            ))}
          </select>
        </div>
      </div>

      {filteredPosts.length === 0 ? (
        <p className="text-center text-sm text-gray-600 mt-6">No posts available at the moment.</p>
      ) : (
        <>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {paginatedPosts.map((post) => (
              <div key={post._id} className="bg-white border rounded-xl overflow-hidden">
                <img
                  src={`${process.env.REACT_APP_BACKEND_URL}${post.imageUrl}`}
                  alt={post.title}
                  className="w-full h-48 object-cover"
                  loading="lazy"
                />
                <div className="p-4">
                  <div className="text-xs text-gray-500 mb-1">
                    {new Date(post.createdAt).toDateString()}
                  </div>
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">{post.title}</h3>
                  <span
                    className="inline-block text-sm text-white px-3 py-1 rounded-full mb-4"
                    style={{ backgroundColor: '#fa5005' }}
                  >
                    {post.category?.name || 'Uncategorized'}
                  </span>
                  <div className="flex gap-3">
                    <button
                      onClick={() => handleEditClick(post)}
                      className="inline-flex items-center gap-1 px-4 border border-[#fa5005] py-1.5 text-sm font-medium rounded-md bg-white text-black"
                    >
                      ✎ Edit
                    </button>
                    <button
                      onClick={() => setDeletingPost(post)}
                      className="inline-flex items-center gap-1 px-4 border border-[#fa5005] py-1.5 text-sm font-medium rounded-md bg-white text-black"
                    >
                      🗑 Delete
                    </button>

                    {deletingPost && (
                      <DeletePost
                        post={deletingPost}
                        onClose={() => setDeletingPost(null)}
                        onDeleted={handlePostDeleted}
                      />
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>

          {filteredPosts.length > postsPerPage && (
            <div className="col-span-full flex justify-center mt-8 gap-4">
              {currentPage > 1 && (
                <button
                  onClick={() => goToPage(currentPage - 1)}
                  className="h-10 px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                >
                  <FaArrowLeft />
                  Prev
                </button>
              )}

              {currentPage < totalPages && (
                <button
                  onClick={() => goToPage(currentPage + 1)}
                  className="h-10 px-4 py-2 rounded border text-sm hover:bg-[#fa5005] hover:text-white transition flex items-center gap-2"
                >
                  Next
                  <FaArrowRight />
                </button>
              )}
            </div>
          )}

        </>
      )}

      {editingPost && <EditPost post={editingPost} onClose={closeModal} />}
    </div>
  );
}

export default ManagePosts;
