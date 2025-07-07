import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import Navbar from "../components/Navbar";
import {
  FileText,
  Sparkles,
  Wand2,
  ArrowRight,
  Bot,
  Target,
  Zap,
  Star,
  CheckCircle,
  Upload,
  Download,
  RefreshCw,
  Layers,
  Shield,
  Award,
  TrendingUp,
  Users,
  Clock,
  Cpu,
  Brain,
  Rocket,
  Atom,
  Crown,
  Gem,
  Palette,
  Lightbulb,
  Play,
  Eye,
  BarChart3,
  ChevronRight,
  Briefcase,
  Globe,
  Heart,
  Code,
} from "lucide-react";

const LandingPage = () => {
  const navigate = useNavigate();

  const features = [
    {
      icon: Brain,
      title: "AI-Powered Content Optimization",
      description:
        "Advanced machine learning algorithms analyze industry standards and optimize your content for maximum recruiter engagement and ATS compatibility.",
      gradient: "from-purple-500 to-pink-500",
      stats: "98% ATS Pass Rate",
    },
    {
      icon: Rocket,
      title: "Lightning-Fast Processing",
      description:
        "Professional-grade transformation in under 15 seconds. Our optimized infrastructure ensures rapid delivery without compromising quality.",
      gradient: "from-blue-500 to-cyan-500",
      stats: "<15s Processing",
    },
    {
      icon: Crown,
      title: "Premium LaTeX Templates",
      description:
        "Meticulously crafted templates by typography experts and HR professionals, designed to make your resume stand out in competitive markets.",
      gradient: "from-amber-500 to-orange-500",
      stats: "25+ Templates",
    },
    {
      icon: Shield,
      title: "Enterprise-Grade Security",
      description:
        "Bank-level encryption with automatic file deletion after 5 minutes. Your sensitive career information remains completely private and secure.",
      gradient: "from-green-500 to-emerald-500",
      stats: "100% Secure",
    },
  ];

  const stats = [
    {
      icon: Users,
      value: "50K+",
      label: "Professionals Transformed",
      color: "text-purple-600",
    },
    {
      icon: FileText,
      value: "250K+",
      label: "Resumes Enhanced",
      color: "text-blue-600",
    },
    {
      icon: Award,
      value: "99.8%",
      label: "Interview Success Rate",
      color: "text-amber-600",
    },
    {
      icon: Clock,
      value: "<15s",
      label: "Average Processing Time",
      color: "text-green-600",
    },
  ];

  const processSteps = [
    {
      icon: Upload,
      title: "Upload Your Resume",
      description: "Securely upload your existing resume in any format - PDF, DOC, DOCX, or plain text. Our system handles all major file types.",
      step: "01",
    },
    {
      icon: Wand2,
      title: "AI Enhancement",
      description:
        "Our advanced AI analyzes your content, optimizes keywords, improves formatting, and ensures ATS compatibility for maximum impact.",
      step: "02",
    },
    {
      icon: Palette,
      title: "Professional Formatting",
      description: "Select from premium LaTeX templates designed by industry experts to create a visually stunning and professional presentation.",
      step: "03",
    },
    {
      icon: Download,
      title: "Download & Excel",
      description:
        "Receive your transformed resume in high-quality PDF format, optimized for both digital applications and print presentations.",
      step: "04",
    },
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Senior Software Engineer",
      company: "Google",
      text: "ResumeTex transformed my career prospects completely. The AI-driven optimization and professional formatting landed me interviews at top tech companies within weeks.",
      avatar: "SC",
      salary: "$180k → $240k",
      timeToJob: "2 weeks",
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      text: "The quality difference was immediately apparent. My resume went from being overlooked to generating interview requests from FAANG companies consistently.",
      avatar: "MJ",
      salary: "$120k → $190k",
      timeToJob: "3 weeks",
    },
    {
      name: "Emma Rodriguez",
      role: "Data Scientist",
      company: "Tesla",
      text: "Initially skeptical about AI resume tools, ResumeTex exceeded all expectations. The optimization was precise, professional, and incredibly effective.",
      avatar: "ER",
      salary: "$95k → $165k",
      timeToJob: "1 week",
    },
  ];

  const pricingFeatures = [
    "Unlimited AI enhancements",
    "25+ Premium LaTeX templates",
    "ATS optimization guarantee",
    "Real-time preview",
    "Expert typography",
    "Priority support",
  ];

  const handleGetStarted = () => {
    navigate("/dashboard");
  };

  const handleWatchDemo = () => {
    console.log("Watch demo clicked");
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Simple Background */}
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

      {/* Use existing Navbar component */}
      <Navbar />

      {/* Hero Section - Professional */}
      <section className="relative z-10 pt-24 pb-16 lg:pt-28 lg:pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid lg:grid-cols-2 gap-12 lg:gap-16 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6 }}
              className="space-y-8"
            >
              {/* Professional Hook Badge */}
              <div className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-4 py-2 text-xs text-purple-700">
                <Crown className="w-4 h-4" />
                <span className="font-medium">Trusted by 50,000+ Professionals Worldwide</span>
                <Star className="w-4 h-4 text-amber-500" />
              </div>

              {/* Professional Headline */}
              <div className="space-y-6">
                <h1 className="text-3xl sm:text-4xl lg:text-5xl xl:text-6xl font-bold leading-tight">
                  <span className="text-gray-900">Transform Your Resume Into</span>
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600">
                    Interview Magnet
                  </span>
                </h1>

                <p className="text-lg lg:text-xl text-gray-600 leading-relaxed max-w-xl">
                  <span className="font-semibold text-gray-800">
                    Stop watching opportunities pass by.
                  </span>{" "}
                  Our enterprise-grade AI transforms ordinary resumes into compelling career narratives that hiring managers can't ignore.
                </p>

                {/* Value Proposition Points */}
                <div className="grid grid-cols-2 gap-4 text-sm">
                  {[
                    "3x Interview Rate Increase",
                    "98% ATS Compatibility",
                    "15-Second Transformation",
                    "Zero Design Experience Required",
                  ].map((point, index) => (
                    <div key={index} className="flex items-center space-x-2">
                      <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                      <span className="font-medium text-gray-700">{point}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Professional CTA Section */}
              <div className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4">
                <motion.button
                  onClick={handleGetStarted}
                  className="px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-lg font-semibold text-base lg:text-lg"
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <div className="flex items-center space-x-2">
                    <Wand2 className="w-5 h-5" />
                    <span>Start Free Transformation</span>
                    <ArrowRight className="w-5 h-5" />
                  </div>
                  <div className="text-xs opacity-90 font-medium mt-1">
                    No Credit Card Required • Instant Access
                  </div>
                </motion.button>

                <button 
                  onClick={handleWatchDemo}
                  className="flex items-center space-x-2 px-6 py-4 border-2 border-gray-200 text-gray-700 rounded-lg font-semibold text-base hover:border-purple-300 hover:bg-purple-50 transition-all duration-300"
                >
                  <Play className="w-5 h-5" />
                  <span>View Demo</span>
                </button>
              </div>

              {/* Social Proof */}
              <div className="flex items-center space-x-4 text-sm text-gray-600">
                <div className="flex -space-x-2">
                  {["SC", "MJ", "ER", "AS", "KL"].map((initial, index) => (
                    <div 
                      key={index}
                      className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 flex items-center justify-center text-white text-xs font-semibold border-2 border-white"
                    >
                      {initial}
                    </div>
                  ))}
                </div>
                <div>
                  <div className="font-semibold">Join 50,000+ successful professionals</div>
                  <div className="text-xs">who accelerated their careers with AI</div>
                </div>
              </div>
            </motion.div>

            {/* Right Visual - Enhanced */}
            <motion.div
              initial={{ opacity: 0, x: 30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative lg:mt-0"
            >
              <div className="bg-white/90 backdrop-blur-sm border border-gray-200/60 rounded-2xl p-8 relative overflow-hidden max-w-md mx-auto lg:max-w-full">
                <div className="space-y-6">
                  {/* Header */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                        <FileText className="w-5 h-5 text-white" />
                      </div>
                      <div>
                        <div className="font-semibold text-gray-900">Professional Resume</div>
                        <div className="text-xs text-gray-500">AI-Enhanced • ATS-Optimized</div>
                      </div>
                    </div>
                    <div className="text-green-500">
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </div>

                  {/* Resume Preview Content */}
                  <div className="space-y-4">
                    {/* Name and Title */}
                    <div className="space-y-2">
                      <div className="h-6 bg-gradient-to-r from-gray-800 to-gray-700 rounded w-3/4"></div>
                      <div className="h-4 bg-gradient-to-r from-purple-300 to-pink-300 rounded w-1/2"></div>
                    </div>
                    
                    {/* Contact Info */}
                    <div className="flex space-x-4 text-xs">
                      <div className="h-3 bg-blue-200 rounded w-20"></div>
                      <div className="h-3 bg-blue-200 rounded w-24"></div>
                      <div className="h-3 bg-blue-200 rounded w-16"></div>
                    </div>

                    {/* Content Sections */}
                    <div className="space-y-4">
                      {/* Experience Section */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-purple-400 to-pink-400 rounded w-32 font-semibold"></div>
                        <div className="space-y-2 ml-2">
                          <div className="h-3 bg-gray-300 rounded w-full"></div>
                          <div className="h-3 bg-gray-300 rounded w-5/6"></div>
                          <div className="h-3 bg-gray-300 rounded w-4/5"></div>
                        </div>
                      </div>

                      {/* Skills Section */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-blue-400 to-cyan-400 rounded w-20"></div>
                        <div className="flex flex-wrap gap-2">
                          {[1,2,3,4,5,6].map((_, i) => (
                            <div key={i} className="h-3 bg-green-200 rounded px-2 w-16"></div>
                          ))}
                        </div>
                      </div>

                      {/* Education */}
                      <div className="space-y-2">
                        <div className="h-4 bg-gradient-to-r from-amber-400 to-orange-400 rounded w-24"></div>
                        <div className="h-3 bg-gray-300 rounded w-3/4"></div>
                      </div>
                    </div>
                  </div>

                  {/* Enhancement Indicators */}
                  <div className="flex items-center justify-between pt-4 border-t border-gray-200">
                    <div className="flex items-center space-x-1">
                      <CheckCircle className="w-3 h-3 text-green-500" />
                      <span className="text-xs font-medium text-green-600">ATS Optimized</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Crown className="w-3 h-3 text-amber-500" />
                      <span className="text-xs font-medium text-amber-600">Professional</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Zap className="w-3 h-3 text-purple-500" />
                      <span className="text-xs font-medium text-purple-600">AI Enhanced</span>
                    </div>
                  </div>
                </div>

                {/* Floating Enhancement Badges */}
                <div className="absolute -top-2 -right-2 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  +98% ATS Score
                </div>

                <div className="absolute -bottom-2 -left-2 bg-gradient-to-r from-purple-500 to-pink-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                  3x More Interviews
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Social Proof Stats - Professional */}
      <section className="relative z-10 py-16 bg-gray-50/50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="bg-white border border-gray-200/60 rounded-2xl p-8 lg:p-12">
            <div className="text-center mb-8">
              <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-2">
                Trusted by Industry Leaders
              </h2>
              <p className="text-gray-600">Join thousands of professionals who've transformed their careers</p>
            </div>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8">
              {stats.map((stat, index) => (
                <div key={index} className="text-center">
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-3">
                    <stat.icon className={`w-6 h-6 ${stat.color}`} />
                  </div>
                  <div className="text-2xl lg:text-3xl font-bold text-gray-900 mb-1">{stat.value}</div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Process - Professional */}
      <section className="relative z-10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              How It Works: <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Simple Yet Powerful</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our streamlined process transforms your resume from ordinary to extraordinary in four simple steps, powered by cutting-edge AI technology.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {processSteps.map((step, index) => (
              <div key={index} className="relative">
                <div className="bg-white border border-gray-200/60 rounded-xl p-6 h-full">
                  {/* Step Number */}
                  <div className="absolute top-4 right-4 w-6 h-6 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white text-xs font-bold">
                    {step.step}
                  </div>

                  {/* Icon */}
                  <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mb-4">
                    <step.icon className="w-6 h-6 text-purple-600" />
                  </div>
                  
                  <h3 className="text-lg font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed">{step.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features - Professional */}
      <section className="relative z-10 py-16 lg:py-20 bg-gray-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Enterprise-Grade Features for <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Career Success</span>
            </h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Advanced AI technology combined with professional design principles to deliver resumes that outperform the competition.
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <div key={index} className="bg-white border border-gray-200/60 rounded-xl p-6 h-full relative">
                {/* Stats Badge */}
                <div className="absolute top-4 right-4 bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-2 py-1 rounded-full">
                  {feature.stats}
                </div>

                {/* Icon */}
                <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-4`}>
                  <feature.icon className="w-6 h-6 text-white" />
                </div>
                
                <h3 className="text-lg font-bold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-sm text-gray-600 leading-relaxed mb-4">{feature.description}</p>

                {/* Learn More Link */}
                <div className="flex items-center space-x-2 text-purple-600 text-sm font-medium cursor-pointer">
                  <span>Learn More</span>
                  <ChevronRight className="w-4 h-4" />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials - Professional */}
      <section className="relative z-10 py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-4">
              Success Stories from <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 to-pink-600">Industry Professionals</span>
            </h2>
            <p className="text-lg text-gray-600">
              Discover how ResumeTex helped ambitious professionals secure positions at leading companies and increase their earning potential.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <div key={index} className="bg-white border border-gray-200/60 rounded-xl p-6">
                {/* Success Metrics */}
                <div className="flex justify-between items-start mb-6">
                  <div className="bg-gradient-to-r from-green-500 to-emerald-500 text-white text-xs font-bold px-3 py-1 rounded-full">
                    {testimonial.salary}
                  </div>
                  <div className="text-right">
                    <div className="text-xs text-gray-500">Time to Offer</div>
                    <div className="text-sm font-bold text-purple-600">{testimonial.timeToJob}</div>
                  </div>
                </div>

                <div className="flex items-center space-x-4 mb-6">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold">
                    {testimonial.avatar}
                  </div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-purple-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed italic mb-6">"{testimonial.text}"</p>

                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    {[1,2,3,4,5].map((star) => (
                      <Star key={star} className="w-4 h-4 text-yellow-400 fill-current" />
                    ))}
                  </div>
                  <div className="flex items-center space-x-1 text-xs text-gray-500">
                    <CheckCircle className="w-3 h-3 text-green-500" />
                    <span>Verified</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA - Professional */}
      <section className="relative z-10 py-16 lg:py-20 bg-gray-50/50">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-2xl p-12 lg:p-16 text-white">
            <h2 className="text-2xl lg:text-3xl font-bold mb-6">Ready to Accelerate Your Career?</h2>
            
            <p className="text-lg lg:text-xl text-purple-100 mb-8 max-w-3xl mx-auto">
              Join 50,000+ professionals who've transformed their career trajectory with ResumeTex. 
              Your next opportunity is just one click away.
            </p>

            <div className="space-y-6">
              <button
                onClick={handleGetStarted}
                className="px-12 py-4 bg-white text-purple-600 rounded-lg font-bold text-lg hover:bg-gray-50 transition-colors"
              >
                <div className="flex items-center space-x-3 justify-center">
                  <Rocket className="w-6 h-6" />
                  <span>Start Free Transformation</span>
                  <ArrowRight className="w-6 h-6" />
                </div>
              </button>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center space-x-8 text-sm text-purple-200">
                <div className="flex items-center space-x-2">
                  <CheckCircle className="w-4 h-4" />
                  <span>100% Free to Start</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Shield className="w-4 h-4" />
                  <span>Secure & Private</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Zap className="w-4 h-4" />
                  <span>15-Second Transform</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Professional Footer */}
      <footer className="relative z-10 py-16 bg-gradient-to-br from-gray-900 to-purple-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid md:grid-cols-4 gap-8 mb-12">
            {/* Logo & Description */}
            <div className="md:col-span-2">
              <div className="flex items-center space-x-3 mb-6">
                <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center">
                  <img
                    src="/logo.png"
                    alt="ResumeTex Logo"
                    className="w-8 h-8 object-contain"
                    onError={(e) => {
                      e.target.style.display = "none";
                      e.target.nextSibling.style.display = "block";
                    }}
                  />
                  <FileText className="w-6 h-6 text-white hidden" />
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
                    ResumeTex
                  </span>
                  <div className="text-xs text-gray-400">
                    AI Resume Enhancement Platform
                  </div>
                </div>
              </div>

              <p className="text-gray-300 mb-6 max-w-md leading-relaxed">
                Empowering professionals worldwide with AI-driven resume optimization. 
                Transform your career story and unlock opportunities with industry-leading technology.
              </p>

              <div className="flex items-center space-x-4">
                <a
                  href="https://github.com/abdullahshafiq-20/ResumeConvertorLatex"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center space-x-2 text-purple-400 hover:text-purple-300 transition-colors"
                >
                  <Code className="w-5 h-5" />
                  <span className="text-sm font-medium">Open Source</span>
                </a>
                <span className="text-gray-500">•</span>
                <div className="flex items-center space-x-2 text-green-400">
                  <div className="w-2 h-2 bg-green-400 rounded-full" />
                  <span className="text-sm">All Systems Operational</span>
                </div>
              </div>
            </div>

            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Product</h3>
              <ul className="space-y-3 text-sm">
                {["Templates", "Pricing", "Examples", "API Access"].map(
                  (link, index) => (
                    <li key={index}>
                      <a
                        href="#"
                        className="text-gray-300 hover:text-white transition-colors"
                      >
                        {link}
                      </a>
                    </li>
                  )
                )}
              </ul>
            </div>

            {/* Support */}
            <div>
              <h3 className="text-lg font-semibold mb-4">Support</h3>
              <ul className="space-y-3 text-sm">
                {[
                  "Help Center",
                  "Contact Us",
                  "Privacy Policy",
                  "Terms of Service",
                ].map((link, index) => (
                  <li key={index}>
                    <a
                      href="#"
                      className="text-gray-300 hover:text-white transition-colors"
                    >
                      {link}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Bottom Section */}
          <div className="border-t border-gray-700 pt-8">
            <div className="flex flex-col md:flex-row items-center justify-between space-y-4 md:space-y-0">
              <div className="text-center md:text-left">
                <p className="text-sm text-gray-400">
                  © 2024 ResumeTex. All rights reserved.
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Files automatically deleted after 5 minutes for complete privacy and security.
                </p>
              </div>

              <div className="flex items-center space-x-6 text-sm text-gray-400">
                <div className="flex items-center space-x-2">
                  <Globe className="w-4 h-4" />
                  <span>50+ Countries</span>
                </div>
                <div className="flex items-center space-x-2">
                  <Users className="w-4 h-4" />
                  <span>50K+ Users</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
