import React, { useState, FormEvent, useEffect } from 'react';
import { Mail, Loader2, Linkedin } from 'lucide-react';
import emailjs from '@emailjs/browser';

interface ContactFormProps {
  className?: string;
  selectedPlan?: string;
}

const ContactForm: React.FC<ContactFormProps> = ({ className = '', selectedPlan }) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [plan, setPlan] = useState<string | undefined>(selectedPlan);
  const [subject, setSubject] = useState(plan ? `Inquiry about ${plan} Plan` : '');

  // Update plan and subject when prop changes
  useEffect(() => {
    setPlan(selectedPlan);
    if (selectedPlan) {
      setSubject(`Inquiry about ${selectedPlan} Plan`);
    }
  }, [selectedPlan]);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setError(null);

    const form = e.currentTarget;
    const formData = new FormData(form);

    try {
      await emailjs.send(
        'default_service',
        'template_contact',
        {
          from_name: formData.get('name'),
          from_email: formData.get('email'),
          subject: formData.get('subject'),
          message: formData.get('message'),
          selected_plan: plan || 'Not specified',
          to_email: 'madrasspl@gmail.com'
        },
        'YOUR_PUBLIC_KEY'
      );

      setIsSubmitted(true);
      form.reset();
      setPlan(undefined);
      setSubject('');
    } catch (err) {
      setError('Failed to send message. Please try again later.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    if (value.length <= 140) {
      setSubject(value);
      setPlan(undefined);
    }
  };

  return (
    <div className={className}>
      {/* Direct Contact Links */}
      <div className="flex justify-center gap-6 mb-8">
        <a
          href="mailto:madrasspl@gmail.com"
          className="flex items-center px-6 py-3 bg-gray-850/50 hover:bg-gray-850 rounded-lg transition-all duration-300 group"
        >
          <Mail className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-medium-contrast group-hover:text-white">madrasspl@gmail.com</span>
        </a>
        <a
          href="https://www.linkedin.com/in/maciej-siliwoniuk-77833a345/"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center px-6 py-3 bg-gray-850/50 hover:bg-gray-850 rounded-lg transition-all duration-300 group"
        >
          <Linkedin className="w-5 h-5 mr-2 text-primary group-hover:scale-110 transition-transform duration-300" />
          <span className="text-medium-contrast group-hover:text-white">LinkedIn Profile</span>
        </a>
      </div>

      <form className="space-y-6" onSubmit={handleSubmit} role="form">
        {error && (
          <div className="bg-red-500/10 border border-red-500 text-red-500 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label htmlFor="name" className="sr-only">Name</label>
            <input
              type="text"
              id="name"
              name="name"
              placeholder="Name"
              required
              disabled={isSubmitting}
              className="w-full bg-gray-850/50 border border-gray-700 rounded-lg px-4 py-3 text-high-contrast placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-smooth duration-300 disabled:opacity-50"
            />
          </div>
          <div>
            <label htmlFor="email" className="sr-only">Email</label>
            <input
              type="email"
              id="email"
              name="email"
              placeholder="Email"
              required
              disabled={isSubmitting}
              className="w-full bg-gray-850/50 border border-gray-700 rounded-lg px-4 py-3 text-high-contrast placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-smooth duration-300 disabled:opacity-50"
            />
          </div>
        </div>
        <div>
          <label htmlFor="subject" className="sr-only">Subject</label>
          <input
            type="text"
            id="subject"
            name="subject"
            placeholder="Subject (max 140 characters)"
            required
            maxLength={140}
            disabled={isSubmitting}
            value={subject}
            onChange={handleSubjectChange}
            className="w-full bg-gray-850/50 border border-gray-700 rounded-lg px-4 py-3 text-high-contrast placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-smooth duration-300 disabled:opacity-50"
          />
          <div className="mt-1 text-sm text-gray-400">
            {subject.length}/140 characters
          </div>
        </div>
        <div>
          <label htmlFor="message" className="sr-only">Message</label>
          <textarea
            id="message"
            name="message"
            placeholder="Message"
            rows={6}
            required
            disabled={isSubmitting}
            className="w-full bg-gray-850/50 border border-gray-700 rounded-lg px-4 py-3 text-high-contrast placeholder-gray-400 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-smooth duration-300 disabled:opacity-50"
          ></textarea>
        </div>
        <button 
          type="submit"
          disabled={isSubmitting || isSubmitted}
          className="w-full bg-primary hover:bg-primary-600 text-white py-3 px-4 rounded-lg transition-smooth duration-300 will-change-transform hover:scale-105 flex items-center justify-center text-lg disabled:opacity-50 disabled:hover:scale-100"
          aria-label={isSubmitted ? "Message sent" : "Send message"}
        >
          {isSubmitting ? (
            <>
              <Loader2 className="w-5 h-5 mr-2 animate-spin" />
              Sending...
            </>
          ) : isSubmitted ? (
            "Thank you for your message"
          ) : (
            <>
              Send Message <Mail className="ml-2" aria-hidden="true" />
            </>
          )}
        </button>
      </form>
    </div>
  );
};

export default ContactForm;