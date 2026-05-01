import React, { useState } from 'react';
import { leadsAPI } from '../services/api';
import FormInput from '../components/FormInput';
import Button from '../components/Button';
import toast from 'react-hot-toast';
import { CheckCircle2 } from 'lucide-react';

const LeadForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await leadsAPI.submitLeadForm(formData);
      setIsSubmitted(true);
      toast.success("Message sent successfully!");
    } catch (error) {
       toast.error(error.response?.data?.message || "Failed to submit form");
    } finally {
      setLoading(false);
    }
  };

  if (isSubmitted) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white max-w-md w-full rounded-2xl shadow-card p-10 text-center animate-slide-up border border-gray-100">
           <div className="w-20 h-20 bg-emerald-100 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <CheckCircle2 size={40} />
           </div>
           <h2 className="text-3xl font-bold text-gray-800 mb-3">Thank You!</h2>
           <p className="text-gray-500 mb-8 leading-relaxed">
             We've received your inquiry. One of our representatives will contact you shortly.
           </p>
           <Button onClick={() => { setIsSubmitted(false); setFormData({name:'', email:'', phone:'', message:''}); }} variant="secondary" className="w-full">
             Submit Another Inquiry
           </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col md:flex-row">
      
      {/* Left side / Marketing info */}
      <div className="w-full md:w-1/2 bg-gradient-auth text-white p-12 flex flex-col justify-center relative">
        
        {/* Admin Quick Links */}
        <div className="absolute top-6 left-6 right-6 flex items-center justify-between">
            <span className="font-bold tracking-tight">LeadMaster</span>
            <div className="flex items-center gap-3">
               <a href="/login" className="text-sm font-semibold hover:text-primary-200 transition-colors bg-white/10 px-4 py-2 rounded-lg backdrop-blur-md">Admin Login</a>
            </div>
        </div>

        <div className="max-w-lg mx-auto mt-16 md:mt-0">
          <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center font-bold text-2xl mb-8 backdrop-blur-sm">
            L
          </div>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">
            Grow your business with LeadMaster
          </h1>
          <p className="text-blue-100 text-lg mb-8 leading-relaxed">
            Ready to take the next step? Fill out the form and our team will get back to you with a customized plan for your success.
          </p>
          
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-400" />
              <span className="font-medium">Fast Response Time</span>
            </div>
            <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-400" />
              <span className="font-medium">Dedicated Account Manager</span>
            </div>
             <div className="flex items-center gap-3">
              <CheckCircle2 size={24} className="text-emerald-400" />
              <span className="font-medium">Customized Solutions</span>
            </div>
          </div>
        </div>
      </div>

      {/* Right side / Form */}
      <div className="w-full md:w-1/2 bg-white p-8 md:p-12 lg:p-16 flex items-center justify-center">
        <div className="w-full max-w-md animate-fade-in">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-gray-800">Get in touch</h2>
            <p className="text-gray-500 mt-2">Fill out the form below and we'll reach out.</p>
          </div>

          <form onSubmit={handleSubmit} className="flex flex-col gap-5">
            <FormInput
              label="Full Name"
              id="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="John Doe"
              required
            />
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
              <FormInput
                label="Email"
                id="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="john@example.com"
                required
              />
              <FormInput
                label="Phone Number"
                id="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+1 (555) 000-0000"
                required
              />
            </div>
            
            <div className="flex flex-col gap-1.5">
              <label htmlFor="message" className="text-sm font-semibold text-gray-700">How can we help you? <span className="text-red-500">*</span></label>
              <textarea
                id="message"
                name="message"
                className="form-input min-h-[120px] resize-y"
                value={formData.message}
                onChange={handleChange}
                placeholder="Tell us about your project or inquiry..."
                required
              ></textarea>
            </div>

            <Button type="submit" loading={loading} className="w-full mt-2 text-lg py-3">
              Send Message
            </Button>
          </form>
        </div>
      </div>
      
    </div>
  );
};

export default LeadForm;
