import React, { useState, useRef, useEffect } from 'react';
import { CKEditor } from '@ckeditor/ckeditor5-react';
import DecoupledEditor from '@ckeditor/ckeditor5-build-decoupled-document';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const fetchPage = async (type) => {
  const res = await fetch(`/api/legal/${type}`, {
    credentials: 'include',
  });
  if (!res.ok) return '';
  const data = await res.json();
  return data.content || '';
};

const updatePage = async (type, content) => {
  const res = await fetch(`/api/legal/${type}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    credentials: 'include',
    body: JSON.stringify({ content }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || 'Update failed');
  return data;
};

function ManagePages() {
  const [terms, setTerms] = useState('<p>Loading Terms...</p>');
  const [privacy, setPrivacy] = useState('<p>Loading Privacy Policy...</p>');
  const [saving, setSaving] = useState(false);

  const termsToolbarRef = useRef(null);
  const privacyToolbarRef = useRef(null);

  useEffect(() => {
    const fetchPages = async () => {
      setTerms(await fetchPage('terms'));
      setPrivacy(await fetchPage('privacy'));
    };
    fetchPages();
  }, []);

  const handleSave = async (type, content) => {
    try {
      setSaving(true);
      await updatePage(type, content);
      toast.success(`${type === 'terms' ? 'Terms & Conditions' : 'Privacy Policy'} updated successfully`);
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-10">
      <ToastContainer position="top-right" autoClose={3000} hideProgressBar />

      <h2 className="text-2xl font-bold mb-6">Manage Legal Pages</h2>

      <div className="mb-10">
        <label className="block mb-2 text-lg font-medium">Terms & Conditions</label>
        <div ref={termsToolbarRef} className="mb-2 border rounded p-2 bg-gray-50" />
        <div className={`border rounded ${saving ? 'opacity-50 pointer-events-none' : ''}`}>
          <CKEditor
            editor={DecoupledEditor}
            data={terms}
            disabled={saving}
            onReady={(editor) => {
              if (termsToolbarRef.current && !termsToolbarRef.current.hasChildNodes()) {
                termsToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
              }
            }}
            onChange={(event, editor) => setTerms(editor.getData())}
          />
        </div>
        <button
          onClick={() => handleSave('terms', terms)}
          disabled={saving}
          className={`mt-3 px-6 py-2 border border-[#fa5005] bg-white text-black font-medium rounded-md ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Terms'}
        </button>
      </div>

      <div>
        <label className="block mb-2 text-lg font-medium">Privacy Policy</label>
        <div ref={privacyToolbarRef} className="mb-2 border rounded p-2 bg-gray-50" />
        <div className={`border rounded ${saving ? 'opacity-50 pointer-events-none' : ''}`}>
          <CKEditor
            editor={DecoupledEditor}
            data={privacy}
            disabled={saving}
            onReady={(editor) => {
              if (privacyToolbarRef.current && !privacyToolbarRef.current.hasChildNodes()) {
                privacyToolbarRef.current.appendChild(editor.ui.view.toolbar.element);
              }
            }}
            onChange={(event, editor) => setPrivacy(editor.getData())}
          />
        </div>
        <button
          onClick={() => handleSave('privacy', privacy)}
          disabled={saving}
          className={`mt-3 px-6 py-2 border border-[#fa5005] bg-white text-black font-medium rounded-md ${saving ? 'opacity-60 cursor-not-allowed' : ''}`}
        >
          {saving ? 'Saving...' : 'Save Privacy'}
        </button>
      </div>
    </div>
  );
}

export default ManagePages;
