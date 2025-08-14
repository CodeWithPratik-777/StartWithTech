import { useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";

import Navbar from "./pages/Navbar";
import Home from "./pages/Home";
import NewsDetails from "./pages/NewsDetails";
import Footer from "./pages/Footer";
import CategoryPage from "./pages/CategoryPage";
import Blog from "./pages/Blog";
import About from "./pages/About";
import TermsPage from "./pages/TermsPage";
import PrivacyPage from "./pages/PrivacyPage";
import Disclaimer from "./pages/Disclaimer";
import Contact from "./pages/Contact";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import Dashboard from "./pages/Admin/Dashboard";
import NotFound from "./pages/NotFound";
import ProtectedRoute from "./routes/ProtectedRoute";
import Preloader from "./pages/Preloader";
import SearchResults from "./pages/SearchResults";
import DefaultMetaTags from "./pages/DefaultMetaTags";

import { LoadingProvider, useLoading } from "./context/LoadingContext";

function ScrollAwarePreloaderWrapper() {
  const { isAppLoading } = useLoading();

  useEffect(() => {
    document.body.style.overflow = isAppLoading ? "hidden" : "auto";
  }, [isAppLoading]);

  return (
    <>
      <DefaultMetaTags />

      {isAppLoading && <Preloader />}
      <div className={`${isAppLoading ? "pointer-events-none select-none" : ""}`}>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/about" element={<About />} />
          <Route path="/terms" element={<TermsPage />} />
          <Route path="/privacy" element={<PrivacyPage />} />
          <Route path="/disclaimer" element={<Disclaimer />} />
          <Route path="/contact" element={<Contact />} />
          <Route path="/news/:slug" element={<NewsDetails />} />
          <Route path="/category/:category" element={<CategoryPage />} />
          <Route path="/search" element={<SearchResults />} />

          <Route
            path="/dashboard"
            element={
              <ProtectedRoute allowIfLoggedIn={true} requireAdmin={true}>
                <Dashboard />
              </ProtectedRoute>
            }
          />
          <Route
            path="/login"
            element={
              <ProtectedRoute allowIfLoggedIn={false}>
                <Login />
              </ProtectedRoute>
            }
          />
          <Route
            path="/signup"
            element={
              <ProtectedRoute allowIfLoggedIn={false}>
                <Signup />
              </ProtectedRoute>
            }
          />

          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<Navigate to="/404" replace />} />
        </Routes>
        <Footer />
      </div>
    </>
  );
}

function App() {
  return (
    <HelmetProvider>
      <Router>
        <LoadingProvider>
          <ScrollAwarePreloaderWrapper />
        </LoadingProvider>
      </Router>
    </HelmetProvider>
  );
}

export default App;
