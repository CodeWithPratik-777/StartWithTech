import React, { useState } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function DeletePost({ post, onClose, onDeleted }) {
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        toast.success('Post deleted successfully!', {
          autoClose: 1500,
        });
        onClose(); 
        onDeleted(post._id);
      } else {
        toast.error('Failed to delete post');
      }
    } catch (err) {
      toast.error('Error deleting post');
      console.error('Error deleting post:', err);
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <>
      <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg w-full max-w-md">
          <h3 className="text-lg font-semibold mb-4">Confirm Delete</h3>
          <p className="text-sm mb-6">
            Are you sure you want to delete "<strong>{post.title}</strong>"?
          </p>
          <div className="flex justify-end gap-3">
            <button
              onClick={onClose}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm rounded bg-gray-200 hover:bg-gray-300 transition-opacity ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={isDeleting}
              className={`px-4 py-2 text-sm rounded bg-red-500 text-white hover:bg-red-600 transition-opacity ${
                isDeleting ? 'opacity-50 cursor-not-allowed' : ''
              }`}
            >
              Delete
            </button>
          </div>
        </div>
      </div>

      <ToastContainer position="top-right" />
    </>
  );
}

export default DeletePost;
