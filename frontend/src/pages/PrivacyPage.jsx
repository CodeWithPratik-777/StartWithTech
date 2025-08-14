import React, { useEffect, useState } from 'react';
import { useLoading } from '../context/LoadingContext';

function PrivacyPage() {
  const [privacyContent, setPrivacyContent] = useState('');
  const [lastUpdated, setLastUpdated] = useState('');
  const { setIsAppLoading } = useLoading();

  useEffect(() => {
    const fetchPrivacy = async () => {
      setIsAppLoading(true);
      try {
        const response = await fetch('/api/legal/privacy');
        const data = await response.json();

        if (data && data.content) {
          setPrivacyContent(data.content);
          const updatedDate = new Date(data.updatedAt);
          setLastUpdated(
            updatedDate.toLocaleDateString('en-US', {
              year: 'numeric',
              month: 'long',
              day: 'numeric',
            })
          );
        }
      } catch (error) {
        console.error('Failed to fetch Privacy Policy:', error);
      } finally {
        setIsAppLoading(false);
      }
    };

    fetchPrivacy();
  }, [setIsAppLoading]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl font-poppins">
      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
          Privacy Policy
        </span>
      </h2>

      <div className="prose prose-p:text-lg prose-p:leading-relaxed prose-li:ml-5 prose-li:text-base max-w-none">
        <div dangerouslySetInnerHTML={{ __html: privacyContent }} />
      </div>

      {lastUpdated && (
        <p className="text-sm text-gray-500 mt-8">Last updated: {lastUpdated}</p>
      )}
    </div>
  );
}

export default PrivacyPage;
