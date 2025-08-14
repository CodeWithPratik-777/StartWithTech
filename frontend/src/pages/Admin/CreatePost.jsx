import React, { useState, useRef, useEffect } from 'react';
import { createPost, fetchCategories } from '../../api/authService';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function CreatePost() {
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [content, setContent] = useState('');
  const [metaTitle, setMetaTitle] = useState('');
  const [metaDescription, setMetaDescription] = useState('');
  const [metaKeywords, setMetaKeywords] = useState('');
  const [category, setCategory] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [categoryList, setCategoryList] = useState([]);
  const [categoryLoadFailed, setCategoryLoadFailed] = useState(false);
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);

  const editorRef = useRef();

  const slugify = (text) =>
    text
      .toString()
      .toLowerCase()
      .trim()
      .replace(/[\s\W-]+/g, '-')
      .replace(/^-+|-+$/g, '');


  useEffect(() => {
    setSlug(slugify(title));
  }, [title]);

  useEffect(() => {
    const loadCategories = async () => {
      try {
        const cats = await fetchCategories();
        setCategoryList(cats);
      } catch (err) {
        setCategoryLoadFailed(true);
      }
    };
    loadCategories();
  }, []);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const resetForm = () => {
    setTitle('');
    setSlug('');
    setContent('');
    setMetaTitle('');
    setMetaDescription('');
    setMetaKeywords('');
    setCategory('');
    setNewCategory('');
    setImage(null);
    if (editorRef.current) editorRef.current.setData('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const trimmedNewCat = newCategory.trim();
      const trimmedSelectedCat = category.trim();

      if (trimmedNewCat && trimmedSelectedCat) {
        toast.error('Please either select an existing category or type a new one, not both.');
        setLoading(false);
        return;
      }

      let usedCategory = trimmedNewCat || trimmedSelectedCat;

      if (!usedCategory) {
        toast.error('Please provide a category.');
        setLoading(false);
        return;
      }

      const existing = categoryList.find(cat => cat.name?.toLowerCase?.() === usedCategory.toLowerCase());
      if (existing) {
        usedCategory = existing.name;
      }

      const formData = new FormData();
      formData.append('title', title);
      formData.append('slug', slug);
      formData.append('content', content);
      formData.append('metaTitle', metaTitle);
      formData.append('metaDescription', metaDescription);
      formData.append('metaKeywords', metaKeywords);
      formData.append('category', usedCategory);
      if (image) formData.append('image', image);

      await createPost(formData);

      toast.success('Post published successfully!');
      resetForm();

      if (!categoryList.includes(usedCategory)) {
        setCategoryList((prev) => [...prev, usedCategory]);
      }
    } catch (err) {
      toast.error(err.message || 'Something went wrong!');
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <ToastContainer position="top-right" />
      <h2 className="text-2xl font-bold mb-6">Create New Post</h2>
      <form className="space-y-6" onSubmit={handleSubmit}>
        <div>
          <label className="block text-sm mb-1">Title</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            placeholder="Enter post title"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Slug</label>
          <input
            type="text"
            value={slug}
            readOnly
            className="w-full bg-gray-100 border rounded px-3 py-2 cursor-not-allowed focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
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
                const toolbarContainer = document.querySelector('#toolbar-container');
                toolbarContainer.appendChild(editor.ui.view.toolbar.element);
              }}
              onChange={(event, editor) => {
                setContent(editor.getData());
              }}
              disabled={loading}
            />
          </div>
          <div id="toolbar-container" className="mb-2 border-b"></div>
        </div>

        <div>
          <label className="block text-sm mb-2">Upload Blog Image</label>
          <label className="flex items-center justify-center w-full px-4 py-3 border border-dashed rounded cursor-pointer hover:bg-gray-100 transition">
            <input type="file" accept="image/*" className="hidden" onChange={handleImageChange} disabled={loading} />
            {image ? <span>{image.name}</span> : <span>Click to upload image</span>}
          </label>
        </div>

        <div>
          <label className="block text-sm mb-1">Meta Title</label>
          <input
            type="text"
            value={metaTitle}
            onChange={(e) => setMetaTitle(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            placeholder="Enter meta title"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Meta Description</label>
          <input
            type="text"
            value={metaDescription}
            onChange={(e) => setMetaDescription(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            placeholder="Enter meta description"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Meta Keywords</label>
          <input
            type="text"
            value={metaKeywords}
            onChange={(e) => setMetaKeywords(e.target.value)}
            disabled={loading}
            className="w-full border rounded px-3 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            placeholder="Comma-separated"
          />
        </div>

        <div>
          <label className="block text-sm mb-1">Category</label>
          <div className="flex gap-4 flex-col md:flex-row">
            <select
              value={category}
              onChange={(e) => {
                setCategory(e.target.value);
                setNewCategory('');
              }}
              disabled={loading}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
            >
              <option value="">
                {categoryLoadFailed ? 'Loading...' : '-- Select Existing --'}
              </option>
              {categoryList.map((cat, index) => (
                <option key={index} value={cat.name || cat}>
                  {cat.name || cat}
                </option>
              ))}
            </select>
            <input
              type="text"
              value={newCategory}
              onChange={(e) => {
                setNewCategory(e.target.value);
                setCategory('');
              }}
              disabled={loading}
              className="border rounded px-3 py-2 w-full focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
              placeholder="Or type new category"
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={loading}
          className={`border border-[#fa5005] bg-white text-black font-medium px-6 py-2 rounded-md ${loading ? 'opacity-50 cursor-not-allowed' : ''
            }`}
        >
          {loading ? 'Publishing...' : 'Publish'}
        </button>
      </form>
    </section>
  );
}

export default CreatePost;
