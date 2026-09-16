import { useState } from 'react';
import type { FormEvent } from 'react';

export const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    channel: '',
    inquiryType: 'sponsorship',
    message: '',
  });

  const [submitted, setSubmitted] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    if (!formData.name || !formData.email || !formData.message) {
      alert('Please fill out all required fields.');
      return;
    }
    setSubmitted(true);
  };

  const faqs = [
    {
      q: 'How does the Logarithmic View Curve differ from standard view projections?',
      a: 'Standard analytics apply linear or exponential models that artificially inflate long-term view projections. CreatorIQ fits early hourly views to a logarithmic decay asymptote V(t) = Vmax * (1 - e^(-kt)), accurately reflecting how algorithmic recommendation traffic stabilizes after the initial 48-hour push.',
    },
    {
      q: 'How are the Brand Sponsorship rates calculated?',
      a: 'We evaluate predicted lifetime reach alongside historical engagement rate (likes/comments per view) and regional CPM benchmarks. Tier-1 countries (US, UK, CA, AU) command premium rates, while niches like Tech ($25-$40) and Finance ($35-$55) reflect higher purchasing power.',
    },
    {
      q: 'Can I connect this platform to my own YouTube Data API key?',
      a: 'Yes. CreatorIQ is fully open and containerized. Set the YOUTUBE_API_KEY environment variable in your server .env or on your Render dashboard to unlock real-time live channel queries.',
    },
    {
      q: 'How does deployment to Render work?',
      a: 'The repository contains a native render.yaml blueprint. Connect your GitHub repository to Render, select Blueprint deployment, and Render will automatically provision the Fastify Web Service and React Static Site.',
    },
  ];

  return (
    <div className="page-container contact-page">
      <div className="page-header apple-reveal">
        <div className="badge-pill">Support & Inquiries</div>
        <h1 className="page-heading">Get in Touch</h1>
        <p className="page-subheading">
          Questions about sponsorship valuation models, API feeds, or self-hosted deployment.
        </p>
      </div>

      <div className="contact-layout">
        {/* Left: Contact Form */}
        <div className="contact-form-card glass-panel apple-reveal delay-1">
          <h2 className="section-title">Send a Message</h2>
          <p className="section-subtext">We typically respond within 24 business hours.</p>

          {submitted ? (
            <div className="success-message-box">
              <div className="success-icon">✓</div>
              <h3>Message Dispatched Successfully!</h3>
              <p>
                Thank you, <strong>{formData.name}</strong>. Your inquiry regarding <em>{formData.inquiryType}</em> has been logged. Our team will reach out at <strong>{formData.email}</strong>.
              </p>
              <button
                className="secondary-btn"
                onClick={() => {
                  setSubmitted(false);
                  setFormData({ name: '', email: '', channel: '', inquiryType: 'sponsorship', message: '' });
                }}
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="actual-contact-form">
              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">Your Name *</label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Rivera"
                    className="text-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Email Address *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="alex@creatoragency.com"
                    className="text-input"
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-field">
                  <label className="field-label">YouTube Channel / Organization</label>
                  <input
                    type="text"
                    value={formData.channel}
                    onChange={(e) => setFormData({ ...formData, channel: e.target.value })}
                    placeholder="@YourChannel or Company Name"
                    className="text-input"
                  />
                </div>
                <div className="form-field">
                  <label className="field-label">Inquiry Category</label>
                  <select
                    value={formData.inquiryType}
                    onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                    className="select-input"
                  >
                    <option value="sponsorship">Sponsorship & Rate Card Audit</option>
                    <option value="api-access">Custom API Access & Webhooks</option>
                    <option value="deployment">Render / Docker Deployment Support</option>
                    <option value="other">General Feedback / Inquiries</option>
                  </select>
                </div>
              </div>

              <div className="form-field">
                <label className="field-label">Message Details *</label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Describe your channel, desired integration, or question..."
                  className="textarea-input"
                ></textarea>
              </div>

              <button type="submit" className="primary-btn full-width">
                Send Message
              </button>
            </form>
          )}
        </div>

        {/* Right: FAQ & Support Channels */}
        <div className="contact-info-column">
          <div className="support-tiles-grid">
            <div className="support-tile glass-panel apple-reveal delay-2">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tile-icon-svg">
                <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"></path>
                <polyline points="22,6 12,13 2,6"></polyline>
              </svg>
              <h4>Email Inquiries</h4>
              <p>partners@creatoriq.dev</p>
            </div>
            <div className="support-tile glass-panel apple-reveal delay-3">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="tile-icon-svg">
                <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"></path>
              </svg>
              <h4>Community & Discussion</h4>
              <p>discord.gg/creatoriq</p>
            </div>
          </div>

          <div className="faq-card glass-panel apple-reveal delay-3">
            <h3 className="section-title">Frequently Asked Questions</h3>
            <div className="faq-accordion">
              {faqs.map((faq, idx) => (
                <div key={idx} className={`faq-item ${openFaq === idx ? 'open' : ''}`}>
                  <button
                    className="faq-question"
                    onClick={() => setOpenFaq(openFaq === idx ? null : idx)}
                  >
                    <span>{faq.q}</span>
                    <span className="faq-arrow">{openFaq === idx ? '▲' : '▼'}</span>
                  </button>
                  {openFaq === idx && (
                    <div className="faq-answer">
                      <p>{faq.a}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
