import React, { useEffect, useRef, useState } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function EditPost({ post, onClose }) {
  const [title, setTitle] = useState(post?.title || '');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState(post?.content || '');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [image, setImage] = useState(null);
  const [metaTitle, setMetaTitle] = useState(post?.metaTitle || '');
  const [metaDescription, setMetaDescription] = useState(post?.metaDescription || '');
  const [metaKeywords, setMetaKeywords] = useState(post?.metaKeywords || '');
  const editorRef = useRef();

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');

  const normalize = (str) =>
    typeof str === 'string'
      ? str.toLowerCase().replace(/[^a-z0-9]/gi, '').trim()
      : '';

  const currentCategory = post?.category || '';

  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = '';
    };
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch('/api/posts/categories');
        const data = await res.json();
        if (Array.isArray(data)) {
          const unique = Array.from(new Map(data.map((c) => [c._id, c])).values());
          setCategories(unique);
        }
      } catch (err) {
        console.error('Failed to fetch categories:', err);
        setCategories([]);
      }
    };

    fetchCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const effectiveCategory = newCategory || category;
  const normalizedEffective = normalize(
    categories.find((c) => c._id === category)?.name || newCategory
  );
  const normalizedCurrent = normalize(currentCategory?.name || currentCategory);
  const normalizedCategories = categories.map((cat) => normalize(cat.name));

  const isDuplicateNewCategory =
    newCategory && normalizedCategories.includes(normalize(newCategory));

  const isSameAsCurrentCategory = normalizedEffective === normalizedCurrent;

  const isFormInvalid =
    !title.trim() ||
    !content.trim() ||
    !metaTitle.trim() ||
    !metaDescription.trim() ||
    !metaKeywords.trim() ||
    (!effectiveCategory && !currentCategory) ||
    isDuplicateNewCategory;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isFormInvalid) return;

    const formData = new FormData();
    formData.append('title', title);
    formData.append('slug', slug);
    formData.append('content', content);
    formData.append('category', newCategory || category || post.category?._id);
    formData.append('metaTitle', metaTitle);
    formData.append('metaDescription', metaDescription);
    formData.append('metaKeywords', metaKeywords);

    if (image) {
      formData.append('image', image);
    }

    try {
      const res = await fetch(`/api/posts/${post._id}`, {
        method: 'PUT',
        credentials: 'include',
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data?.message || 'Failed to update post.');
      }

      toast.success('Post updated successfully!');
      setTimeout(() => {
        window.location.reload();
      }, 1500);
    } catch (err) {
      console.error('Update error:', err);
      toast.error(err.message);
    }
  };


  if (!post) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black bg-opacity-40 flex items-center justify-center px-4">
      <div className="bg-white w-full max-w-3xl max-h-[90vh] overflow-y-auto rounded-xl shadow-xl p-6 animate-fadeIn relative">
        <h2 className="text-2xl font-bold mb-4">Edit Post</h2>

        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="block text-sm mb-1">Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Slug</label>
            <input
              type="text"
              value={slug}
              readOnly
              className="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600 cursor-not-allowed"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Description</label>
            <div className="border rounded">
              <CKEditor
                editor={DecoupledEditor}
                data={content}
                onReady={(editor) => {
                  if (editorRef.current) return;
                  editorRef.current = editor;
                  const toolbarContainer = document.querySelector('#edit-toolbar-container');
                  toolbarContainer?.appendChild(editor.ui.view.toolbar.element);
                }}
                onChange={(event, editor) => {
                  setContent(editor.getData());
                }}
              />
            </div>
            <div id="edit-toolbar-container" className="mb-2 border-b" />
          </div>

          <div>
            <label className="block text-sm font-medium mb-2">Upload Blog Image</label>
            {post?.imageUrl && (
              <img
                src={post.imageUrl}
                alt="Current"
                loading='lazy'
                className="w-fit h-auto rounded border object-cover"
              />
            )}
            <label className="flex items-center justify-center w-full mt-2 px-4 py-3 border border-dashed border-gray-400 rounded cursor-pointer hover:bg-gray-100 transition">
              <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} />
              {image ? (
                <span className="text-gray-700">{image.name}</span>
              ) : (
                <span className="text-gray-500">Click to upload new image</span>
              )}
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1">Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Meta Description</label>
            <input
              type="text"
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Meta Keywords</label>
            <input
              type="text"
              value={metaKeywords}
              onChange={(e) => setMetaKeywords(e.target.value)}
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
              placeholder="Enter meta keywords (comma-separated)"
            />
          </div>

          <div className="flex gap-x-2">
            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1">Select Category</label>
              <select
                value={category}
                onChange={(e) => {
                  setCategory(e.target.value);
                  setNewCategory('');
                }}
                className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
              >
                <option value="">-- Select Category --</option>
                {categories.map((cat) => (
                  <option
                    key={cat._id}
                    value={cat._id}
                    disabled={cat._id === post.category?._id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="w-1/2">
              <label className="block text-sm font-medium mb-1 invisible">Placeholder</label>
              <input
                type="text"
                value={newCategory}
                onChange={(e) => {
                  setNewCategory(e.target.value);
                  setCategory('');
                }}
                className={`w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 ${isDuplicateNewCategory
                  ? 'border-red-400 ring-red-300'
                  : 'border-gray-300 focus:ring-[#fa5005]'
                  }`}
                placeholder="Or type new category"
              />
              {isDuplicateNewCategory && (
                <p className="text-red-500 text-sm mt-1">
                  This category already exists. Choose from dropdown instead.
                </p>
              )}
            </div>
          </div>

          {effectiveCategory && !isSameAsCurrentCategory && !isDuplicateNewCategory && (
            <p className="text-sm text-orange-600">
              Category will change from <strong>{currentCategory?.name || currentCategory}</strong> →{' '}
              <strong>{categories.find((c) => c._id === category)?.name || newCategory}</strong>
            </p>
          )}

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm bg-gray-200 rounded hover:bg-gray-300 transition"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isFormInvalid}
              className={`px-6 py-2 text-sm border border-[#fa5005] bg-white text-black font-medium rounded-md transition ${isFormInvalid
                ? 'opacity-50 cursor-not-allowed'
                : ''
                }`}
            >
              Save Changes
            </button>
          </div>
        </form>

        <button
          onClick={onClose}
          className="absolute top-4 right-5 text-2xl text-gray-500 hover:text-black"
        >
          &times;
        </button>

        <ToastContainer position="top-right" />
      </div>
    </div>
  );
}

export default EditPost;
