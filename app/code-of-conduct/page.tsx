import React from 'react';

export default function CodeOfConductPage() {
  return (
    <div className="min-h-screen bg-white text-gray-900 pt-24 pb-16 px-6 md:px-12">
      <div className="max-w-4xl mx-auto space-y-8">
        <h1 className="text-4xl md:text-5xl font-bold tracking-tight mb-8">Code of Conduct</h1>
        
        <div className="prose prose-lg text-gray-700">
          <p>
            When you join the GDG on Campus University of Benin (GDGOC UNIBEN) community, you join a community of developers. This means you agree to abide by our core values of respect, collaboration, and psychological safety.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Be excellent to each other</h2>
          <p>
            We want the community to be a safe and productive environment for everyone. To that end, we expect participants to be:
          </p>
          <ul className="list-disc pl-6 space-y-2 mt-4 mb-6">
            <li><strong>Friendly and patient.</strong></li>
            <li><strong>Welcoming.</strong> We strive to be a community that welcomes and supports people of all backgrounds and identities.</li>
            <li><strong>Considerate.</strong> Your work will be used by other people, and you in turn will depend on the work of others.</li>
            <li><strong>Respectful.</strong> Not all of us will agree all the time, but disagreement is no excuse for poor behavior and poor manners.</li>
            <li><strong>Careful in the words that we choose.</strong> We are a community of professionals, and we conduct ourselves professionally. Be kind to others. Do not insult or put down other participants. Harassment and other exclusionary behavior aren't acceptable.</li>
          </ul>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Anti-Harassment Policy</h2>
          <p>
            Harassment includes offensive verbal comments related to gender, sexual orientation, disability, physical appearance, body size, race, religion, sexual images in public spaces, deliberate intimidation, stalking, following, harassing photography or recording, sustained disruption of talks or other events, inappropriate physical contact, and unwelcome sexual attention.
          </p>
          <p className="mt-4">
            Participants asked to stop any harassing behavior are expected to comply immediately.
          </p>

          <h2 className="text-2xl font-bold mt-8 mb-4 text-black">Reporting Issues</h2>
          <p>
            If you experience or witness a violation of this Code of Conduct, please report it immediately to the GDGOC UNIBEN core team or organizers via our official contact channels or anonymously through our reporting forms. All reports will be handled with discretion and taken seriously.
          </p>
        </div>
      </div>
    </div>
  );
}
