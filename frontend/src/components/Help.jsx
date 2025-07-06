import React from 'react';
import Navbar from './shared/Navbar';  // same Navbar import path
const supportEmail = import.meta.env.VITE_ADMIN_EMAIL_USER;

const faqs = [
  {
    question: "How does a recruiter post a job?",
    answer: `Recruiter first needs to register an account on our portal. 
Then they must mail the required documents to 
  <a href="mailto:${supportEmail}" class="text-blue-600 underline hover:text-blue-800">${supportEmail}</a> 
for verification. Once the recruiter is verified, they can post jobs which job seekers can apply to.`,
  },
  {
    question: "How can I apply for jobs?",
    answer: "Browse jobs on the Jobs page, select the job you want, and click apply. Make sure you are registered and logged in.",
  },
  {
    question: "What documents are required for recruiter verification?",
    answer: "Recruiters need to submit company registration proof and identity documents for verification.",
  },
  {
    question: "Can I edit my job application after submitting?",
    answer: "No, once an application is submitted, it cannot be edited. Please review carefully before applying.",
  },
  {
    question: "How long does recruiter verification take?",
    answer: "Verification usually takes 1-3 business days. You will be notified via email once the process is complete.",
  },
  {
    question: "Is there any fee for job posting?",
    answer: "Currently, posting jobs on our portal is free for verified recruiters.",
  },
  {
    question: "Who do I contact for support?",
    answer: `For any assistance, please email us at 
  <a href="mailto:${supportEmail}" class="text-blue-600 underline hover:text-blue-800">${supportEmail}</a>.`,
  },
];

const Help = () => {
  return (
    <div>
      <Navbar />   {/* Navbar like in Browse.jsx */}

      <div className="max-w-4xl mx-auto p-6 mt-12 mb-24 bg-white rounded-lg shadow-lg">
        <h1 className="text-4xl font-extrabold mb-8 text-center text-gray-900">Help & FAQs</h1>

        <div className="space-y-6">
          {faqs.map(({ question, answer }, idx) => (
            <details
              key={idx}
              className="border border-gray-300 rounded-lg p-5 cursor-pointer bg-gray-50 hover:bg-gray-100 transition"
              open={idx === 0} // first item open by default
            >
              <summary className="font-semibold text-xl text-gray-800">{question}</summary>
              <p
                className="mt-3 text-gray-700 text-base leading-relaxed"
                // Render HTML in answer safely using 'dangerouslySetInnerHTML' since answer has anchor tags
                dangerouslySetInnerHTML={{ __html: answer }}
              />
            </details>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Help;
