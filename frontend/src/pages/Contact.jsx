import { motion } from "framer-motion";
import { 
  MailIcon, 
  GithubIcon, 
  TwitterIcon, 
  GlobeIcon, 
  LinkedinIcon, 
  SendIcon, 
  ArrowRightIcon 
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

const Contact = () => {
  const handleEmailSubmit = (e) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const subject = formData.get('subject');
    const message = formData.get('message');
    window.location.href = `mailto:codehimanshu24@gmail.com?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(message)}`;
  };

  const socialLinks = [
    {
      icon: <GithubIcon className="w-6 h-6" />,
      href: "https://github.com/HimanshuMohanty-Git24",
      label: "GitHub",
      color: "hover:text-gray-900"
    },
    {
      icon: <TwitterIcon className="w-6 h-6" />,
      href: "https://twitter.com/CodingHima",
      label: "Twitter",
      color: "hover:text-blue-400"
    },
    {
      icon: <GlobeIcon className="w-6 h-6" />,
      href: "https://himanshumohanty.netlify.app/",
      label: "Portfolio",
      color: "hover:text-green-600"
    },
    {
      icon: <LinkedinIcon className="w-6 h-6" />,
      href: "https://www.linkedin.com/in/himanshumohanty/",
      label: "LinkedIn",
      color: "hover:text-blue-600"
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-neutral-50 to-neutral-100">
    <div className="w-full bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <Link 
            to="/" 
            className="inline-block text-2xl font-bold text-primary-dark hover:text-primary transition-colors"
          >
            OdiaLingua
          </Link>
        </div>
      </div>
      <div className="container mx-auto px-4 py-16 md:py-24">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="max-w-3xl mx-auto"
        >
          <div className="text-center mb-12">
            <span className="inline-block px-3 py-1 mb-4 text-sm font-medium text-primary-dark bg-primary-light/10 rounded-full">
              Let's Connect
            </span>
            <h1 className="font-display text-3xl md:text-4xl font-bold text-neutral-900 mb-4">
              Hey, I'm Himanshu! 👋
            </h1>
            <p className="text-neutral-600">
              Thank you for your interest in reaching out. I'm always excited to connect with fellow tech enthusiasts and language lovers!
            </p>
          </div>

          <div className="bg-white rounded-2xl shadow-sm p-6 md:p-8 mb-8">
            <form onSubmit={handleEmailSubmit} className="space-y-6">
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-neutral-700 mb-2">
                  Subject
                </label>
                <input
                  type="text"
                  name="subject"
                  id="subject"
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-neutral-700 mb-2">
                  Message
                </label>
                <textarea
                  name="message"
                  id="message"
                  rows={6}
                  className="w-full rounded-lg border border-neutral-200 px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary"
                  required
                ></textarea>
              </div>
              <Button type="submit" className="w-full bg-primary hover:bg-primary-dark">
                <MailIcon className="w-4 h-4 mr-2" /> {/* Changed Mail to MailIcon */}
                Send Message
              </Button>
            </form>
          </div>

          <div className="text-center">
            <h2 className="font-display text-xl font-semibold text-neutral-900 mb-6">
              Connect with me on
            </h2>
            <div className="flex justify-center space-x-6">
              {socialLinks.map((link, index) => (
                <motion.a
                  key={index}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`text-neutral-600 transition-colors duration-300 ${link.color}`}
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {link.icon}
                </motion.a>
              ))}
            </div>
            <p className="mt-8 text-neutral-600 text-sm">
              Looking forward to connecting with you and discussing how we can collaborate on making technology more accessible through language!
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default Contact;