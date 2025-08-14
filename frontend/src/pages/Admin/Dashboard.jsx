import React, { useState } from 'react';
import ManagePosts from './ManagePosts';
import CreatePost from './CreatePost';
import Settings from './Settings';
import ManagePages from './ManagePages';

function Dashboard() {
  const [activeSection, setActiveSection] = useState('manage');

  const renderContent = () => {
    switch (activeSection) {
      case 'manage':
        return <ManagePosts />;
      case 'create':
        return <CreatePost />;
      case 'pages':
        return <ManagePages />;
      case 'settings':
        return <Settings />;
      default:
        return <ManagePosts />;
    }
  };

  return (
    <div className="min-h-screen flex font-poppins bg-gray-100">
      <aside className="w-64 bg-white shadow-md hidden md:block">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold text-[#fa5005]">Admin Panel</h2>
        </div>
        <nav className="p-4 space-y-3">
          <button
            onClick={() => setActiveSection('manage')}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-[#fa500510] ${
              activeSection === 'manage' ? 'bg-[#fa500520]' : ''
            }`}
          >
            Manage Posts
          </button>
          <button
            onClick={() => setActiveSection('create')}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-[#fa500510] ${
              activeSection === 'create' ? 'bg-[#fa500520]' : ''
            }`}
          >
            Create Post
          </button>
          <button
            onClick={() => setActiveSection('pages')}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-[#fa500510] ${
              activeSection === 'pages' ? 'bg-[#fa500520]' : ''
            }`}
          >
            Manage Pages
          </button>
          <button
            onClick={() => setActiveSection('settings')}
            className={`block w-full text-left px-4 py-2 rounded hover:bg-[#fa500510] ${
              activeSection === 'settings' ? 'bg-[#fa500520]' : ''
            }`}
          >
            Settings
          </button>
        </nav>
      </aside>

      <main className="flex-1 p-6">{renderContent()}</main>
    </div>
  );
}

export default Dashboard;
