import React from "react";
import { motion } from "framer-motion";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import { 
  FileText, 
  Scale,
  Shield, 
  Crown,
  Zap,
  Users,
  AlertTriangle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Mail,
  Gavel,
  CreditCard,
  RefreshCw,
  Ban,
  Star
} from "lucide-react";

const TermsOfServicePage = () => {
  // Animation variants matching your design system
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

  const termsSection = [
    {
      icon: FileText,
      title: "Service Description",
      gradient: "from-purple-500 to-pink-500",
      stats: "AI-Powered",
      content: [
        {
          subtitle: "Resume Enhancement Service",
          details: "ResumeTex provides AI-powered resume enhancement, optimization, and formatting services. Our platform transforms your existing resume into a professional, ATS-compatible document using advanced machine learning algorithms."
        },
        {
          subtitle: "Service Availability",
          details: "Our services are available 24/7 through our web platform. We strive for 99.9% uptime but cannot guarantee uninterrupted service due to maintenance, updates, or technical issues beyond our control."
        },
        {
          subtitle: "Service Improvements",
          details: "We continuously improve our AI models and features. New functionalities may be added, and existing features may be modified to enhance user experience and service quality."
        },
        {
          subtitle: "Beta Features",
          details: "Some features may be offered in beta or experimental versions. These features are provided as-is and may have limited functionality or stability."
        }
      ]
    },
    {
      icon: Users,
      title: "User Accounts & Responsibilities",
      gradient: "from-blue-500 to-cyan-500", 
      stats: "Your Duties",
      content: [
        {
          subtitle: "Account Creation",
          details: "You must provide accurate information when creating an account. You're responsible for maintaining the security of your login credentials and all activities under your account."
        },
        {
          subtitle: "Acceptable Use",
          details: "You agree to use our service for lawful purposes only. You may not upload content that violates intellectual property rights, contains false information, or is harmful, offensive, or illegal."
        },
        {
          subtitle: "Content Ownership",
          details: "You retain full ownership of your resume content and personal information. By using our service, you grant us temporary rights to process your content for service delivery purposes only."
        },
        {
          subtitle: "Account Termination",
          details: "You may terminate your account at any time. We reserve the right to suspend or terminate accounts that violate these terms or engage in harmful activities."
        }
      ]
    },
    {
      icon: CreditCard,
      title: "Pricing & Payment Terms",
      gradient: "from-green-500 to-emerald-500",
      stats: "Transparent",
      content: [
        {
          subtitle: "Free Services",
          details: "Basic resume enhancement features are provided free of charge with certain limitations on usage frequency and template access."
        },
        {
          subtitle: "Premium Features",
          details: "Advanced features, premium templates, and unlimited processing may require payment. All pricing is clearly displayed before purchase."
        },
        {
          subtitle: "Billing & Refunds",
          details: "Payments are processed securely through third-party providers. Refunds are available within 30 days of purchase if you're not satisfied with premium features."
        },
        {
          subtitle: "Price Changes",
          details: "We may adjust pricing for premium features with 30 days' notice. Existing subscribers will maintain their current pricing for the remainder of their billing period."
        }
      ]
    },
    {
      icon: Scale,
      title: "Intellectual Property",
      gradient: "from-amber-500 to-orange-500",
      stats: "Protected",
      content: [
        {
          subtitle: "Our Intellectual Property",
          details: "ResumeTex's AI technology, templates, algorithms, and platform design are protected by intellectual property laws. Users may not copy, reverse engineer, or redistribute our proprietary technology."
        },
        {
          subtitle: "User Content Rights",
          details: "You retain all rights to your resume content and personal information. We do not claim ownership of any content you provide to our service."
        },
        {
          subtitle: "License to Use",
          details: "We grant you a limited, non-exclusive license to use our service for personal and professional purposes. This license terminates when you stop using our service."
        },
        {
          subtitle: "Template Usage",
          details: "Our premium templates are licensed for your personal use in job applications. Commercial redistribution or resale of templates is prohibited."
        }
      ]
    },
    {
      icon: Shield,
      title: "Data Protection & Privacy",
      gradient: "from-violet-500 to-purple-500",
      stats: "Secure",
      content: [
        {
          subtitle: "Data Processing",
          details: "We process your resume data solely for service delivery purposes using automated AI systems. No human employees access your personal documents during processing."
        },
        {
          subtitle: "Data Retention",
          details: "Uploaded files are automatically deleted within 5 minutes of processing completion. Account data is retained only while your account remains active."
        },
        {
          subtitle: "Security Measures",
          details: "We implement industry-standard security measures including SSL encryption, secure servers, and regular security audits to protect your information."
        },
        {
          subtitle: "Privacy Policy",
          details: "Our detailed Privacy Policy explains exactly how we collect, use, and protect your data. By using our service, you agree to our privacy practices."
        }
      ]
    },
    {
      icon: Ban,
      title: "Prohibited Activities",
      gradient: "from-red-500 to-pink-500",
      stats: "Restricted",
      content: [
        {
          subtitle: "Misuse of Service",
          details: "You may not use our service to create fraudulent resumes, impersonate others, or submit false information to employers."
        },
        {
          subtitle: "Technical Restrictions",
          details: "Attempting to hack, overload, or exploit our systems is prohibited. This includes automated scraping, reverse engineering, or unauthorized access attempts."
        },
        {
          subtitle: "Intellectual Property Violations",
          details: "Uploading content that infringes on others' intellectual property rights or contains plagiarized material is strictly forbidden."
        },
        {
          subtitle: "Harmful Content",
          details: "Content that is discriminatory, offensive, illegal, or harmful to others is not permitted on our platform."
        }
      ]
    },
    {
      icon: Gavel,
      title: "Limitation of Liability",
      gradient: "from-slate-500 to-gray-600",
      stats: "Important",
      content: [
        {
          subtitle: "Service Warranty",
          details: "Our service is provided 'as-is' without warranties. While we strive for accuracy and quality, we cannot guarantee that our AI enhancement will result in job offers or interviews."
        },
        {
          subtitle: "Liability Limits",
          details: "Our liability is limited to the amount you paid for premium services in the 12 months preceding any claim. We are not liable for indirect, consequential, or punitive damages."
        },
        {
          subtitle: "User Responsibility",
          details: "You are responsible for reviewing and approving all AI-generated content before using it in job applications. We recommend human review of all enhanced resumes."
        },
        {
          subtitle: "Third-Party Services",
          details: "We integrate with third-party services (payment processors, authentication providers) and are not responsible for their performance or security."
        }
      ]
    }
  ];

  const serviceFeatures = [
    {
      icon: Zap,
      title: "AI Enhancement",
      description: "Advanced algorithms optimize your content"
    },
    {
      icon: Crown,
      title: "Premium Templates", 
      description: "Professional designs by experts"
    },
    {
      icon: Shield,
      title: "ATS Compatible",
      description: "Passes applicant tracking systems"
    },
    {
      icon: RefreshCw,
      title: "Unlimited Revisions",
      description: "Refine until perfect"
    }
  ];

  return (
    <div className="min-h-screen bg-white">
      {/* Background matching your design */}
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
            <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-full px-4 py-2 text-xs text-blue-700 mb-6">
              <Scale className="w-4 h-4" />
              <span className="font-medium">Fair & Transparent Terms</span>
              <CheckCircle className="w-4 h-4 text-green-500" />
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-6">
              <span className="text-gray-900">Terms of Service</span>
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600">
                Clear & Simple
              </span>
            </h1>
            <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-3xl mx-auto">
              <span className="font-semibold text-gray-800">Understanding our terms shouldn't require a law degree.</span>{" "}
              These terms outline your rights and responsibilities when using ResumeTex's AI-powered resume enhancement service.
            </p>
            <p className="text-sm text-gray-500 mt-4 flex items-center justify-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Last updated: December 2024</span>
            </p>
          </motion.div>

          {/* Service Overview */}
          <motion.div
            className="mb-16"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <div className="bg-white border border-gray-200/60 rounded-2xl p-8 lg:p-12">
              <div className="text-center mb-8">
                <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                  What You Get with ResumeTex
                </h2>
                <p className="text-gray-600">Professional resume enhancement powered by advanced AI technology</p>
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
                {serviceFeatures.map((feature, index) => (
                  <motion.div key={index} className="text-center" variants={itemVariants}>
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-100 to-purple-100 flex items-center justify-center mx-auto mb-3">
                      <feature.icon className="w-6 h-6 text-blue-600" />
                    </div>
                    <div className="text-sm font-bold text-gray-900 mb-1">{feature.title}</div>
                    <div className="text-xs text-gray-600">{feature.description}</div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Agreement Introduction */}
          <motion.div
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <div className="bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 border border-blue-200/60 rounded-2xl p-8 lg:p-12">
              <div className="flex items-start space-x-4">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center flex-shrink-0">
                  <Gavel className="w-6 h-6 text-white" />
                </div>
                <div>
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    Agreement to Terms
                  </h2>
                  <p className="text-gray-700 leading-relaxed text-lg mb-6">
                    By accessing and using ResumeTex, you agree to be bound by these Terms of Service and our Privacy Policy. 
                    If you disagree with any part of these terms, please do not use our service. These terms constitute a 
                    legally binding agreement between you and ResumeTex.
                  </p>
                  <div className="grid grid-cols-2 gap-4 text-sm">
                    {[
                      "Legally Binding Agreement",
                      "Covers All Services",
                      "Regular Updates",
                      "User Protection Focused"
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

          {/* Terms Sections */}
          <motion.div 
            className="space-y-8"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {termsSection.map((section, index) => (
              <motion.div
                key={section.title}
                className="bg-white border border-gray-200/60 rounded-xl p-8 relative"
                variants={itemVariants}
              >
                {/* Stats Badge */}
                <div className="absolute top-6 right-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white text-xs font-bold px-3 py-1 rounded-full">
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
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
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

          {/* Contact & Updates */}
          <motion.div
            className="mt-16 grid md:grid-cols-2 gap-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.8 }}
          >
            {/* Legal Contact */}
            <div className="bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200/60 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                  <Mail className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Legal Questions?
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    If you have questions about these terms or need legal clarification, 
                    our legal team is available to assist you.
                  </p>
                  <div className="space-y-3">
                    <a
                      href="mailto:resumetex.convertor@gmail.com"
                      className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white font-semibold rounded-lg hover:bg-blue-700 transition-colors text-sm"
                    >
                      <Scale className="w-4 h-4" />
                      <span>Contact Legal Team</span>
                    </a>
                    <p className="text-xs text-gray-600">
                      Legal inquiries answered within 48 hours
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Terms Updates */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200/60 rounded-2xl p-8">
              <div className="flex items-start space-x-4">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <Globe className="w-5 h-5 text-white" />
                </div>
                <div>
                  <h3 className="text-xl font-bold text-gray-900 mb-4">
                    Terms Updates
                  </h3>
                  <p className="text-gray-700 mb-6 leading-relaxed">
                    We may update these terms to reflect service improvements or legal requirements. 
                    We'll notify users of significant changes.
                  </p>
                  <div className="space-y-3">
                    <div className="inline-flex items-center space-x-2 px-4 py-2 bg-white text-purple-600 font-semibold rounded-lg border border-purple-200 text-sm">
                      <AlertTriangle className="w-4 h-4" />
                      <span>30-Day Notice Period</span>
                    </div>
                    <p className="text-xs text-gray-600">
                      Major changes communicated well in advance
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Dispute Resolution */}
          <motion.div
            className="mt-16 bg-gradient-to-r from-amber-50 to-orange-50 border border-amber-200/60 rounded-2xl p-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 1.0 }}
          >
            <div className="flex items-start space-x-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-500 flex items-center justify-center">
                <Star className="w-5 h-5 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 mb-4">
                  Dispute Resolution & Governing Law
                </h3>
                <p className="text-gray-700 leading-relaxed">
                  Any disputes arising from these terms will be resolved through binding arbitration in accordance with applicable laws. 
                  We encourage users to contact our support team first to resolve issues amicably. These terms are governed by the 
                  laws of the jurisdiction where ResumeTex operates, without regard to conflict of law principles. By using our service, 
                  you agree to resolve any disputes through arbitration rather than court proceedings.
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

export default TermsOfServicePage; 