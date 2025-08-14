

export const fetchDetails = async () => {
  const res = await fetch('/api/auth/get-user-details', {
    method: 'GET',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch author name');
  return data;
};


export const logout = async () => {
  const res = await fetch('/api/auth/logout', {
    method: 'POST',
    credentials: 'include',
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Logout failed');
  return data;
};

export const updateAuthorName = async (newName) => {
  const res = await fetch('/api/auth/update-author-name', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ name: newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to update author name');
  return data;
};

export const changePassword = async (currentPassword, newPassword) => {
  const res = await fetch('/api/auth/change-password', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ currentPassword, newPassword }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to change password');
  return data;
};

export const toggleTwoFactor = async (enable) => {
  const res = await fetch('/api/auth/two-factor', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ enable }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to toggle 2FA');
  return data;
};

export const createPost = async (formData) => {
  const res = await fetch('/api/posts', {
    method: 'POST',
    body: formData,
  });

  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to publish post.');
  return data;
};

export const fetchCategories = async () => {
  const res = await fetch('/api/posts/categories');
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to fetch categories');
  return data;
};


export const renameCategory = async (categoryId, newName) => {
  const res = await fetch(`/api/posts/categories/${categoryId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: newName }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to rename category');
  return data;
};

export const addCategory = async (name) => {
  const res = await fetch(`/api/posts/categories`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Failed to add category');
  return data;
};
