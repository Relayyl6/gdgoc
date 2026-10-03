import React from 'react';

export default function PrivacyPolicyPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Privacy Policy</h1>
        
        <div className="prose prose-lg text-gray-700">
          <p>
            At GDG on Campus University of Benin (GDGOC UNIBEN), we take your privacy seriously. This policy outlines how we handle data when you use our website, register for events, or participate in our community.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Data Collection</h2>
          <p>
            We strictly adhere to a <strong>Zero Data Collection</strong> policy for event attendees on our local platform. When you generate an Event Pass, the information (Name, Track) is processed entirely locally on your device to create a downloadable pass and is <strong>never</strong> transmitted to our servers or stored in our database.
          </p>
          <p className="mt-4">
            For community projects and memories uploaded to the Showcase, we store only the information you explicitly provide (such as your project name, description, and images) solely for the purpose of displaying it on the public gallery. 
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">External Services</h2>
          <p>
            Our community relies on external platforms (such as the official GDG Community Platform, Google Forms, Discord, and WhatsApp) for official registration, analytics, and communication. Please refer to the respective privacy policies of these platforms regarding how they handle your data:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-6">
            <li>Google / GDG Community Dev Privacy Policy</li>
            <li>WhatsApp Privacy Policy</li>
            <li>Discord Privacy Policy</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Cookies and Analytics</h2>
          <p>
            We do not use tracking cookies or third-party analytics scripts that infringe on your privacy. We may collect aggregated, anonymous page view metrics (like click counts on the 'Register Now' button) to understand event engagement, but this data cannot be linked back to any individual user.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Your Rights</h2>
          <p>
            If you have submitted a project or memory to our showcase and wish for it to be removed, please contact the GDGOC UNIBEN core team, and we will promptly delete the data from our systems.
          </p>
        </div>
      </div>
    </div>
  );
}
