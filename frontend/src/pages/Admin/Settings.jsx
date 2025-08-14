import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import {
  fetchDetails,
  logout,
  updateAuthorName,
  changePassword,
  toggleTwoFactor,
  fetchCategories,
  renameCategory,
  addCategory,
} from '../../api/authService';
import 'react-toastify/dist/ReactToastify.css';

function Settings() {
  const [authorName, setAuthorName] = useState('Loading...');
  const [newAuthorName, setNewAuthorName] = useState('');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(false);
  const [logoutLoading, setLogoutLoading] = useState(false);
  const [updatingAuthor, setUpdatingAuthor] = useState(false);
  const [changingPassword, setChangingPassword] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);
  const [selectedCategoryId, setSelectedCategoryId] = useState('');
  const [renameValue, setRenameValue] = useState('');
  const [newCategory, setNewCategory] = useState('');
  const [isEditingRename, setIsEditingRename] = useState(false);
  const [renaming, setRenaming] = useState(false);
  const [adding, setAdding] = useState(false);

  const selectedCategory = categories.find(cat => cat._id === selectedCategoryId);

  const normalize = str => str.toLowerCase().replace(/[^a-z0-9]/gi, '');

  const handleEnableRename = () => setIsEditingRename(true);
  const handleCancelRename = () => {
    if (selectedCategory) setRenameValue(selectedCategory.name);
    setIsEditingRename(false);
  };

  useEffect(() => {
    const fetchUserDetails = async () => {
      try {
        const data = await fetchDetails();
        setAuthorName(data.authorName);
        setTwoFactorEnabled(data.twoFactorEnabled);
      } catch (err) {
        console.error('Failed to fetch user details:', err.message);
      }
    };
    fetchUserDetails();
  }, []);

  useEffect(() => {
    const loadCategories = async () => {
      setLoadingCategories(true);
      try {
        const data = await fetchCategories();
        setCategories(data);
      } catch (err) {
        toast.error(`Failed to load categories: ${err.message}`);
      } finally {
        setLoadingCategories(false);
      }
    };
    loadCategories();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setRenameValue(selectedCategory.name);
      setIsEditingRename(false);
    } else {
      setRenameValue('');
      setIsEditingRename(false);
    }
  }, [selectedCategoryId]);

  const handleRename = async () => {
    if (!renameValue.trim()) return toast.error('Category name cannot be empty');
    if (normalize(renameValue) === normalize(selectedCategory.name)) {
      return toast.error('No changes made to category name');
    }

    setRenaming(true);
    try {
      await renameCategory(selectedCategoryId, renameValue.trim());
      toast.success('Category renamed successfully');
      const updated = await fetchCategories();
      setCategories(updated);
      setIsEditingRename(false);
    } catch (err) {
      toast.error(`Rename failed: ${err.message}`);
    } finally {
      setRenaming(false);
    }
  };

  const handleAddCategory = async () => {
    if (!newCategory.trim()) return toast.error('Category name required');
    const normalizedNew = normalize(newCategory);
    const exists = categories.some(cat => normalize(cat.name) === normalizedNew);
    if (exists) return toast.error('Category already exists');

    setAdding(true);
    try {
      await addCategory(newCategory.trim());
      toast.success('Category added');
      const updated = await fetchCategories();
      setCategories(updated);
      setNewCategory('');
    } catch (err) {
      toast.error(`Add failed: ${err.message}`);
    } finally {
      setAdding(false);
    }
  };

  const handleLogout = async () => {
    if (!window.confirm('Are you sure you want to log out?')) return;
    setLogoutLoading(true);
    try {
      await logout();
      toast.success('Logout successful.');
      setTimeout(() => (window.location.href = '/'), 1000);
    } catch (err) {
      toast.error(`Logout failed: ${err.message}`);
    } finally {
      setLogoutLoading(false);
    }
  };

  const handleUpdateAuthorName = async (e) => {
    e.preventDefault();
    setUpdatingAuthor(true);
    try {
      await updateAuthorName(newAuthorName.trim());
      setAuthorName(newAuthorName.trim());
      setNewAuthorName('');
      toast.success('Author name updated');
    } catch (err) {
      toast.error(`Failed to update name: ${err.message}`);
    } finally {
      setUpdatingAuthor(false);
    }
  };

  const handleChangePassword = async (e) => {
    e.preventDefault();
    setChangingPassword(true);
    try {
      await changePassword(currentPassword, newPassword);
      toast.success('Password updated. Logging out...');
      await logout();
      setTimeout(() => (window.location.href = '/'), 1000);
    } catch (err) {
      toast.error(`Failed to change password: ${err.message}`);
    } finally {
      setChangingPassword(false);
    }
  };

  const handleToggleTwoFactor = async () => {
    const confirmed = window.confirm(
      twoFactorEnabled
        ? 'Disable Two-Factor Authentication?'
        : 'Enable Two-Factor Authentication?'
    );
    if (!confirmed) return;
    try {
      await toggleTwoFactor(!twoFactorEnabled);
      setTwoFactorEnabled((prev) => !prev);
      toast.success(`2FA ${twoFactorEnabled ? 'Disabled' : 'Enabled'}`);
    } catch (err) {
      toast.error(`Failed to toggle 2FA: ${err.message}`);
    }
  };

  return (
    <section className="container mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-2xl font-bold mb-6">Settings</h2>

      <form
        onSubmit={handleUpdateAuthorName}
        className="mb-8 bg-white p-6 rounded-xl shadow-sm border"
      >
        <h3 className="text-lg font-semibold mb-2">Change Author Name</h3>
        <p className="text-sm text-gray-500 mb-4">
          Current: <strong>{authorName}</strong>
        </p>
        <input
          required
          type="text"
          placeholder="Enter new author name"
          value={newAuthorName}
          onChange={(e) => setNewAuthorName(e.target.value)}
          disabled={updatingAuthor}
          className="w-full border border-gray-300 rounded-md px-4 py-2 mb-4 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
        />
        <button
          type="submit"
          className="border border-[#fa5005] bg-white text-black font-medium px-4 py-2 rounded-md transition disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={updatingAuthor}
        >
          {updatingAuthor ? 'Updating...' : 'Update Name'}
        </button>
      </form>

      <form
        onSubmit={handleChangePassword}
        className="mb-8 bg-white p-6 rounded-xl shadow-sm border"
      >
        <h3 className="text-lg font-semibold mb-4">Change Password</h3>
        <div className="space-y-4">
          <input
            required
            type="password"
            placeholder="Current password"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            disabled={changingPassword}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
          />
          <input
            required
            type="password"
            placeholder="New password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            disabled={changingPassword}
            className="w-full border border-gray-300 rounded-md px-4 py-2 focus:outline-none focus:ring-1 focus:ring-[#fa5005]"
          />
        </div>
        <button
          type="submit"
          className="mt-4 border border-[#fa5005] bg-white text-black font-medium px-4 py-2 rounded-md  disabled:opacity-60 disabled:cursor-not-allowed"
          disabled={changingPassword}
        >
          {changingPassword ? 'Updating...' : 'Update Password'}
        </button>
      </form>

      <div className="mb-8 bg-white p-4 rounded-md shadow border">
        <h3 className="text-lg font-semibold mb-2">Manage Categories</h3>

        <label className="block text-sm mb-1">Select Category</label>
        <select
          value={selectedCategoryId}
          onChange={(e) => setSelectedCategoryId(e.target.value)}
          className="w-full border px-3 py-2 rounded mb-3 text-sm"
          disabled={loadingCategories}
        >
          <option value="">-- Select --</option>
          {categories.map((cat) => (
            <option key={cat._id} value={cat._id}>
              {cat.name} ({cat.postCount})
            </option>
          ))}
        </select>

        {selectedCategoryId && selectedCategory && (
          <div className="flex gap-2 mb-3">
            <input
              type="text"
              value={renameValue}
              onChange={(e) => setRenameValue(e.target.value)}
              disabled={!isEditingRename || renaming}
              className={`flex-1 border px-4 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#fa5005] ${renaming ? 'opacity-50' : ''}`}
            />
            {!isEditingRename ? (
              <button
                className="border border-[#fa5005] bg-white text-black font-medium px-4 py-2 rounded-md"
                onClick={handleEnableRename}
              >
                Rename
              </button>
            ) : (
              <>
                <button
                  className="border border-[#fa5005] bg-white text-black font-medium px-4 py-2 rounded-md disabled:opacity-50"
                  onClick={handleRename}
                  disabled={
                    renaming ||
                    normalize(renameValue) === normalize(selectedCategory.name)
                  }
                >
                  {renaming ? 'Saving...' : 'Save'}
                </button>
                <button
                  className="bg-gray-400 text-white px-4 py-2 rounded hover:bg-gray-500"
                  onClick={handleCancelRename}
                  disabled={renaming}
                >
                  Cancel
                </button>
              </>
            )}
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-2">
          <input
            type="text"
            placeholder="New category name"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            disabled={adding}
            className={`flex-1 border px-3 py-2 rounded focus:outline-none focus:ring-1 focus:ring-[#fa5005] text-sm ${adding ? 'opacity-50' : ''}`}
          />
          <button
            className="border border-[#fa5005] bg-white text-black font-medium px-4 py-2 rounded-md text-sm disabled:opacity-50"
            onClick={handleAddCategory}
            disabled={adding || !newCategory.trim()}
          >
            {adding ? 'Adding...' : 'Add'}
          </button>

        </div>
      </div>

      <div className="mb-8 bg-white p-6 rounded-xl shadow-sm border">
        <h3 className="text-lg font-semibold mb-2">Two-Factor Authentication</h3>
        <p className="text-sm text-gray-500 mb-4">
          Add an extra layer of security to your account.
        </p>
        <label className="inline-flex items-center cursor-pointer">
          <input
            type="checkbox"
            checked={twoFactorEnabled}
            onChange={handleToggleTwoFactor}
            className="sr-only"
          />
          <div
            className={`relative w-11 h-6 rounded-full transition-colors duration-300 ease-in-out ${twoFactorEnabled ? 'bg-[#fa5005]' : 'bg-gray-300'}`}
          >
            <div
              className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full shadow-md transform transition-transform duration-300 ease-in-out ${twoFactorEnabled ? 'translate-x-5' : ''}`}
            ></div>
          </div>
          <span className="ml-3 text-sm">
            {twoFactorEnabled ? 'Enabled' : 'Disabled'}
          </span>
        </label>
      </div>

      <div className="bg-white p-6 rounded-xl shadow-sm border text-right">
        <button
          onClick={handleLogout}
          disabled={logoutLoading}
          className={`bg-red-500 text-white px-5 py-2 w-full rounded-md font-medium hover:bg-red-600 transition ${logoutLoading ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {logoutLoading ? 'Logging out...' : 'Logout'}
        </button>
      </div>
    </section>
  );
}

export default Settings;
