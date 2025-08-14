import React, { useEffect } from 'react';
import { useLoading } from '../context/LoadingContext';

function Disclaimer() {
  const { setIsAppLoading } = useLoading();

  useEffect(() => {
    setIsAppLoading(true);
    const timeout = setTimeout(() => {
      setIsAppLoading(false);
    }, 800);

    return () => clearTimeout(timeout);
  }, [setIsAppLoading]);

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl font-poppins">
      <h2 className="font-bold text-xl mb-6">
        <span className="border-l-4 border-[#fa5005] pl-3 text-black uppercase tracking-wide">
          Disclaimer
        </span>
      </h2>

      <p className="mb-4">
        StartWithTech ("we," "us," or "our") provides the content on this website only for general informational purposes. Although all of the material on the website is given in good faith, we do not guarantee or make any representations about its completeness, correctness, adequacy, validity, reliability, or availability.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">1. External Connections Disclaimer</h2>
      <p className="mb-4">
        Links to other websites or third-party content may be included on the website. These links are simply offered for convenience. We don't look into, keep an eye on, or verify the authenticity or completeness of such connections. Any third-party websites' content, rules, or practices are not our responsibility.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">2. No Expert Guidance</h2>
      <p className="mb-4">
        This website's material is not meant to be interpreted as professional advice and never will be. Before making any decisions based on the information on this website, you should speak with the relevant experts.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">3. Individual Accountability</h2>
      <p className="mb-4">
        You understand that you are accessing our website freely and that you are accountable for your own activities. Any loss or harm brought on by your reliance on information on the website is not our responsibility.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">4. Mistakes and Exclusions</h2>
      <p className="mb-4">
        Although we make every effort to guarantee that the material is accurate, mistakes or omissions may nevertheless occur. Any material may be corrected by us at any moment and without prior notice.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">5. Notice of Fair Use</h2>
      <p className="mb-4">
        There may be copyrighted content on this website that hasn't been expressly approved by the copyright holder. In our opinion, this qualifies as "fair use" under the relevant copyright regulations. You must get permission from the copyright owner before using any content on our website that is protected by copyright.
      </p>

      <h2 className="text-xl font-semibold mt-6 mb-2">6. Get in Touch</h2>
      <p className="mb-4">
        You may reach us at <a href="mailto:startwithtech@gmail.com" className="text-[#fa5005] underline">startwithtech@gmail.com</a> if you have any queries about this disclaimer.
      </p>
    </div>
  );
}

export default Disclaimer;
