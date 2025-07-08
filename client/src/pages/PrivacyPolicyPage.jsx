import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  Shield, 
  Lock, 
  Eye, 
  Clock, 
  FileText, 
  User, 
  Server,
  Trash2,
  CheckCircle,
  AlertTriangle,
  Mail,
  Phone,
  Globe,
  Database,
  Cpu,
  Crown
} from "lucide-react";

const PrivacyPolicyPage = () => {
  // Animation variants matching your landing page
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.6 },
    },
  };

  const privacySections = [
    {
      icon: FileText,
      title: "Information We Collect",
      gradient: "from-purple-500 to-pink-500",
      stats: "Minimal Data",
      content: [
        {
          subtitle: "Resume Documents",
          details: "The resume files and documents you upload to our AI-powered enhancement service. These are processed temporarily and automatically deleted."
        },
        {
          subtitle: "Account Information", 
          details: "Your email address and name when you create an account through Google OAuth. We use this for authentication and service communication."
        },
        {
          subtitle: "Usage Analytics",
          details: "Anonymous usage statistics to improve our AI models and service performance. This includes processing times and feature usage patterns."
        },
        {
          subtitle: "Technical Information",
          details: "IP address, browser type, and device information for security monitoring and fraud prevention purposes."
        }
      ]
    },
    {
      icon: Cpu,
      title: "How We Use Your Information", 
      gradient: "from-blue-500 to-cyan-500",
      stats: "AI Processing",
      content: [
        {
          subtitle: "Resume Enhancement",
          details: "Process and enhance your resume using our advanced AI algorithms, including content optimization, formatting, and ATS compatibility improvements."
        },
        {
          subtitle: "Service Delivery",
          details: "Provide you with transformed resume files, progress updates, and access to premium templates and features."
        },
        {
          subtitle: "Customer Support",
          details: "Respond to your inquiries, provide technical assistance, and improve our service based on user feedback."
        },
        {
          subtitle: "Security & Safety",
          details: "Monitor for suspicious activities, prevent fraud, and ensure the security and integrity of our platform."
        }
      ]
    },
    {
      icon: Lock,
      title: "Data Security & Encryption",
      gradient: "from-green-500 to-emerald-500", 
      stats: "Bank-Level",
      content: [
        {
          subtitle: "SSL/TLS Encryption",
          details: "All data transmission between your device and our servers is protected with industry-standard SSL/TLS encryption protocols."
        },
        {
          subtitle: "Automatic File Deletion",
          details: "Your uploaded resume files are automatically and permanently deleted from our servers within 5 minutes of processing completion."
        },
        {
          subtitle: "Secure Infrastructure",
          details: "Our servers are hosted on enterprise-grade cloud infrastructure with multiple layers of security, including firewalls and intrusion detection."
        },
        {
          subtitle: "Regular Security Audits",
          details: "We conduct regular security assessments and vulnerability testing to ensure your data remains protected against emerging threats."
        }
      ]
    },
    {
      icon: Eye,
      title: "Data Sharing & Privacy",
      gradient: "from-amber-500 to-orange-500",
      stats: "Zero Sharing",
      content: [
        {
          subtitle: "No Third-Party Sales",
          details: "We never sell, rent, or trade your personal information to third parties for marketing or any other purposes."
        },
        {
          subtitle: "AI Processing Only",
          details: "Your resume content is processed exclusively by our proprietary AI systems. No human employees access your personal documents."
        },
        {
          subtitle: "Anonymous Analytics",
          details: "We may use aggregated, anonymized data for improving our AI models and service performance, but this cannot be traced back to you."
        },
        {
          subtitle: "Legal Compliance",
          details: "We may share information only when required by law, court order, or to protect our legal rights and user safety."
        }
      ]
    },
    {
      icon: User,
      title: "Your Privacy Rights",
      gradient: "from-violet-500 to-purple-500",
      stats: "Full Control",
      content: [
        {
          subtitle: "Data Access Rights",
          details: "Request a copy of all personal data we have collected about you, including account information and usage history."
        },
        {
          subtitle: "Data Deletion Rights",
          details: "Request immediate deletion of your account and all associated personal data from our systems at any time."
        },
        {
          subtitle: "Communication Preferences",
          details: "Opt-out of non-essential communications while maintaining access to important service updates and security notifications."
        },
        {
          subtitle: "Data Portability",
          details: "Request your data in a machine-readable format to transfer to another service provider if desired."
        }
      ]
    },
    {
      icon: Clock,
      title: "Data Retention Policy",
      gradient: "from-rose-500 to-pink-500",
      stats: "5 Minutes",
      content: [
        {
          subtitle: "Resume Files",
          details: "All uploaded resume documents are automatically deleted within 5 minutes of processing completion. No backups are retained."
        },
        {
          subtitle: "Account Data",
          details: "Account information is retained only while your account remains active. You can request deletion at any time."
        },
        {
          subtitle: "Security Logs",
          details: "Security and access logs are kept for 30 days for fraud prevention and security monitoring purposes."
        },
        {
          subtitle: "Analytics Data",
          details: "Anonymous usage statistics are retained for service improvement but cannot be linked to individual users."
        }
      ]
    }
  ];

  const trustIndicators = [
    {
      icon: Shield,
      title: "SOC 2 Compliant",
      description: "Enterprise security standards"
    },
    {
      icon: Lock,
      title: "256-bit Encryption", 
      description: "Military-grade data protection"
    },
    {
      icon: Trash2,
      title: "Auto-Delete",
      description: "Files removed in 5 minutes"
    },
    {
      icon: Crown,
      title: "GDPR Ready",
      description: "European privacy compliance"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Subtle gradient background matching your landing page */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div
          className="absolute inset-0 opacity-20"
          style={{
            background: `
              radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.08) 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.08) 0%, transparent 50%)
            `,
          }}
        />
      </div>

      <Navbar />
      
      <div className="relative z-10 pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          {/* Hero Header */}
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {/* Professional Hook Badge */}
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-4 py-2 text-xs text-purple-700 mb-6">
              <Shield className="w-4 h-4" />
              <span className="font-medium">Your Privacy is Our Priority</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gray-900">Privacy Policy</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                Transparent & Secure
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold text-gray-800">Complete transparency in how we handle your data.</span>{" "}
              Learn exactly what information we collect, how it's used, and your rights as a user of ResumeTex.
            </p>
            <p className="text-sm text-gray-500 mt-4 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: December 2024</span>
            </p>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  Enterprise-Grade Privacy Protection
                </h2>
                <p className="text-gray-600">Your data security is built into every aspect of our service</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {trustIndicators.map((indicator, index) => (
                  <motion.div key={index} className="text-center" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-3">
                      <indicator.icon className="w-6 h-6 text-purple-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1">{indicator.title}</div>
                    <div className="text-xs text-gray-600">{indicator.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Introduction */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 border border-purple-200/60 rounded-2xl p-8 lg:p-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center flex-shrink-0">
                  <FileText className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Our Commitment to Your Privacy
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg">
                    At ResumeTex, we understand that your resume contains your most sensitive personal and professional information. 
                    We've designed our service with privacy-first principles, ensuring your data is protected at every step. 
                    This policy explains exactly how we collect, use, store, and protect your information when you use our 
                    AI-powered resume enhancement platform.
                  </p>
                  <div className="mt-6 grid grid-cols-2 gap-4 text-sm">
                    {[
                      "5-Minute Auto-Delete",
                      "Zero Human Access",
                      "SSL Encrypted",
                      "No Data Sales"
                    ].map((point, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="font-medium text-gray-700">{point}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Privacy Sections */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {privacySections.map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-white border border-gray-200/60 rounded-xl p-8 relative"
                variants={itemVariants}
              >
                {/* Stats Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  {section.stats}
                </div>

                <div className="flex items-start space-x-6">
                  {/* Icon */}
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${section.gradient} flex items-center justify-center flex-shrink-0`}>
                    <section.icon className="w-6 h-6 text-white" />
                  </div>
                  
                  <div className="flex-1">
                    <h3 className="text-xl lg:text-2xl font-bold text-gray-900 mb-6">
                      {section.title}
                    </h3>
                    
                    <div className="space-y-6">
                      {section.content.map((item, itemIndex) => (
                        <div key={itemIndex} className="border-l-2 border-gray-100 pl-6">
                          <h4 className="font-semibold text-gray-900 mb-2 flex items-center space-x-2">
                            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                            <span>{item.subtitle}</span>
                          </h4>
                          <p className="text-gray-700 leading-relaxed">{item.details}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>

          {/* Contact & Legal */}
          <motion.div
            className="mt-16 grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Contact Information */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/60 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Privacy Questions?
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    If you have any questions about this privacy policy or how we handle your data, 
                    our privacy team is here to help.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:resumetex.convertor@gmail.com"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-purple-600 text-white font-semibold rounded-lg hover:bg-purple-700 transition-colors text-sm"
                    >
                      <Mail className="w-4 h-4" />
                      <span>Contact Privacy Team</span>
                    </a>
                    <p className="text-xs text-gray-600">
                      We respond to privacy inquiries within 24 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Open Source & Transparency */}
            <div className="bg-gradient-to-br from-blue-50 to-cyan-50 border border-blue-200/60 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Open Source Transparency
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    Our code is open source, allowing you to verify our privacy practices 
                    and security implementations yourself.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="https://github.com/abdullahshafiq-20/ResumeConvertorLatex"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-blue-600 font-semibold rounded-lg border border-blue-200 hover:bg-blue-50 transition-colors text-sm"
                    >
                      <FileText className="w-4 h-4" />
                      <span>View Source Code</span>
                    </a>
                    <p className="text-xs text-gray-600">
                      Full transparency in our data handling practices
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Updates & Changes */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <AlertTriangle className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Policy Updates & Notifications
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  We may update this privacy policy to reflect changes in our practices or legal requirements. 
                  We'll notify you of any material changes via email and provide a 30-day notice period. 
                  Your continued use of our service after the effective date constitutes acceptance of the updated policy.
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>

      <Footer />
    </div>
  );
};

export default PrivacyPolicyPage; 