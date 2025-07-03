import React, { useState, useEffect } from 'react';
import { motion, useAnimation } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
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
  Lightbulb
} from 'lucide-react';

const LandingPage = () => {
  const navigate = useNavigate();
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });
  const [particles, setParticles] = useState([]);

  // Generate magical particles
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = [];
      for (let i = 0; i < 40; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * window.innerWidth,
          y: Math.random() * window.innerHeight,
          size: Math.random() * 3 + 1,
          delay: Math.random() * 5,
          duration: Math.random() * 15 + 10,
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
    window.addEventListener('resize', generateParticles);
    return () => window.removeEventListener('resize', generateParticles);
  }, []);

  // Track mouse for magical effects
  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePosition({ x: e.clientX, y: e.clientY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const features = [
    {
      icon: Brain,
      title: "Neural AI Engine",
      description: "Advanced deep learning algorithms that understand and enhance your professional narrative with supernatural precision",
      gradient: "from-purple-500 to-pink-500"
    },
    {
      icon: Shield,
      title: "ATS Optimization",
      description: "Mystical algorithms ensure your resume passes through any applicant tracking system like digital magic",
      gradient: "from-blue-500 to-cyan-500"
    },
    {
      icon: Crown,
      title: "Royal Templates",
      description: "Handcrafted premium LaTeX templates designed by typography masters and career professionals",
      gradient: "from-amber-500 to-orange-500"
    },
    {
      icon: Zap,
      title: "Instant Transform",
      description: "Lightning-fast processing powered by quantum computing and advanced optimization techniques",
      gradient: "from-green-500 to-emerald-500"
    }
  ];

  const stats = [
    { icon: Users, value: "25K+", label: "Happy Professionals", color: "text-purple-600" },
    { icon: FileText, value: "100K+", label: "Resumes Transformed", color: "text-blue-600" },
    { icon: Award, value: "99.8%", label: "Success Rate", color: "text-amber-600" },
    { icon: Clock, value: "<15s", label: "Average Time", color: "text-green-600" }
  ];

  const testimonials = [
    {
      name: "Sarah Chen",
      role: "Software Engineer",
      company: "Google",
      text: "This magical transformation got me my dream job! The LaTeX format was stunning.",
      avatar: "SC"
    },
    {
      name: "Marcus Johnson",
      role: "Product Manager",
      company: "Microsoft",
      text: "Incredible AI-powered enhancement. My resume stood out among hundreds of applicants.",
      avatar: "MJ"
    },
    {
      name: "Emma Rodriguez",
      role: "Data Scientist",
      company: "Tesla",
      text: "The professional formatting and ATS optimization made all the difference in my job search.",
      avatar: "ER"
    }
  ];

  const handleGetStarted = () => {
    navigate('/dashboard');
  };

  return (
    <div className="min-h-screen bg-white relative overflow-hidden">
      {/* Aurora Background */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {/* Main Aurora Waves */}
        <motion.div 
          className="absolute inset-0 opacity-60"
          style={{
            background: `
              radial-gradient(ellipse at top left, rgba(147, 51, 234, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at top right, rgba(59, 130, 246, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at bottom left, rgba(236, 72, 153, 0.15) 0%, transparent 50%),
              radial-gradient(ellipse at bottom right, rgba(34, 197, 94, 0.15) 0%, transparent 50%),
              linear-gradient(135deg, rgba(139, 92, 246, 0.1) 0%, rgba(59, 130, 246, 0.1) 25%, rgba(16, 185, 129, 0.1) 50%, rgba(245, 158, 11, 0.1) 75%, rgba(239, 68, 68, 0.1) 100%)
            `
          }}
          animate={{
            backgroundPosition: ["0% 0%", "100% 100%", "0% 0%"]
          }}
          transition={{
            duration: 20,
            repeat: Infinity,
            ease: "linear"
          }}
        />

        {/* Floating Aurora Orbs */}
        <motion.div 
          className="absolute top-20 left-1/4 w-96 h-96 rounded-full opacity-30 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(147, 51, 234, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.4, 1],
            x: [0, 100, 0],
            y: [0, -50, 0],
          }}
          transition={{
            duration: 25,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />
        
        <motion.div 
          className="absolute top-1/3 right-1/4 w-80 h-80 rounded-full opacity-25 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(236, 72, 153, 0.3) 0%, rgba(139, 92, 246, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            scale: [1.2, 1, 1.2],
            x: [0, -80, 0],
            y: [0, 60, 0],
          }}
          transition={{
            duration: 18,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        <motion.div 
          className="absolute bottom-1/4 left-1/3 w-72 h-72 rounded-full opacity-20 blur-3xl"
          style={{
            background: 'radial-gradient(circle, rgba(34, 197, 94, 0.3) 0%, rgba(59, 130, 246, 0.2) 50%, transparent 70%)',
          }}
          animate={{
            scale: [1, 1.3, 1],
            x: [0, 120, 0],
            y: [0, -80, 0],
          }}
          transition={{
            duration: 22,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        />

        {/* Floating Sparkle Particles */}
        {particles.map((particle) => (
          <motion.div
            key={particle.id}
            className="absolute rounded-full"
            style={{
              left: particle.x,
              top: particle.y,
              width: particle.size,
              height: particle.size,
              background: `linear-gradient(45deg, 
                rgba(147, 51, 234, 0.6), 
                rgba(59, 130, 246, 0.6), 
                rgba(236, 72, 153, 0.6)
              )`
            }}
            animate={{
              y: [particle.y, particle.y - 150, particle.y],
              opacity: [0, 0.8, 0],
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: particle.duration,
              delay: particle.delay,
              repeat: Infinity,
              ease: "easeInOut"
            }}
          />
        ))}

        {/* Magic Mouse Trail */}
        <motion.div
          className="absolute pointer-events-none"
          style={{
            left: mousePosition.x - 15,
            top: mousePosition.y - 15,
          }}
        >
          <motion.div
            className="w-8 h-8 rounded-full bg-gradient-to-r from-purple-400 to-pink-400 opacity-30 blur-md"
            animate={{
              scale: [0, 1.5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
            }}
          />
        </motion.div>
      </div>

      {/* Enhanced Navigation */}
      <nav className="relative z-20 p-4 sm:p-6 lg:p-8">
        <motion.div 
          className="max-w-7xl mx-auto"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <div className="bg-white/70 backdrop-blur-xl border border-gray-200/50 rounded-2xl px-6 py-4 shadow-xl">
            <div className="flex items-center justify-between">
              <motion.div 
                className="flex items-center space-x-3"
                whileHover={{ scale: 1.05 }}
                transition={{ duration: 0.2 }}
              >
                <motion.div 
                  className="w-10 h-10 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
                  animate={{
                    boxShadow: [
                      "0 0 20px rgba(147, 51, 234, 0.3)",
                      "0 0 30px rgba(236, 72, 153, 0.4)",
                      "0 0 20px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  <FileText className="w-5 h-5 text-white" />
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
                    animate={{ x: [-100, 100] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                </motion.div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ResumeTex</span>
                  <div className="text-xs text-gray-500">AI Resume Magic</div>
                </div>
              </motion.div>

              <div className="flex items-center space-x-4">
                <motion.button
                  className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-purple-600 transition-colors duration-200"
                  whileHover={{ scale: 1.05 }}
                >
                  Examples
                </motion.button>
                <motion.button
                  onClick={handleGetStarted}
                  className="px-6 py-2 text-sm font-medium bg-gradient-to-r from-purple-500 to-pink-500 text-white rounded-xl hover:shadow-lg transition-all duration-200"
                  whileHover={{ scale: 1.05, y: -2 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Get Started
                </motion.button>
              </div>
            </div>
          </div>
        </motion.div>
      </nav>

      {/* Enhanced Hero Section */}
      <section className="relative z-10 px-4 sm:px-6 lg:px-8 pt-12 pb-20">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            {/* Left Content */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1 }}
              className="space-y-8"
            >
              {/* Magic Badge */}
              <motion.div 
                className="inline-flex items-center space-x-2 bg-gradient-to-r from-purple-50 to-pink-50 border border-purple-200 rounded-full px-4 py-2 text-sm text-purple-700"
                animate={{
                  boxShadow: [
                    "0 0 20px rgba(147, 51, 234, 0.1)",
                    "0 0 30px rgba(236, 72, 153, 0.2)",
                    "0 0 20px rgba(147, 51, 234, 0.1)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                <motion.div
                  animate={{ rotate: [0, 360] }}
                  transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
                >
                  <Sparkles className="w-4 h-4" />
                </motion.div>
                <span className="font-medium">AI-Powered Resume Transformation</span>
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity }}
                >
                  <Bot className="w-4 h-4" />
                </motion.div>
              </motion.div>

              {/* Enhanced Title */}
              <div className="space-y-4">
                <motion.h1 
                  className="text-5xl sm:text-6xl lg:text-7xl font-bold leading-tight"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.2 }}
                >
                  <span className="text-gray-900">Transform Your</span>
                  <br />
                  <motion.span 
                    className="text-transparent bg-clip-text bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    style={{
                      backgroundSize: "200% 200%"
                    }}
                    transition={{ duration: 5, repeat: Infinity }}
                  >
                    Career Story
                  </motion.span>
                  <br />
                  <span className="text-gray-900">With AI Magic</span>
                </motion.h1>

                <motion.p 
                  className="text-lg text-gray-600 leading-relaxed max-w-xl"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 1, delay: 0.4 }}
                >
                  Experience the future of resume creation with our AI-powered platform. 
                  Transform your career narrative into stunning LaTeX documents that captivate recruiters and secure interviews.
                </motion.p>
              </div>

              {/* Enhanced CTA Buttons */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.6 }}
                className="flex flex-col sm:flex-row items-start space-y-4 sm:space-y-0 sm:space-x-4"
              >
                <motion.button
                  onClick={handleGetStarted}
                  className="group relative px-8 py-4 bg-gradient-to-r from-purple-600 via-pink-600 to-blue-600 text-white rounded-2xl font-semibold text-lg overflow-hidden shadow-2xl"
                  whileHover={{ scale: 1.05, y: -3 }}
                  whileTap={{ scale: 0.95 }}
                  animate={{
                    boxShadow: [
                      "0 10px 40px rgba(147, 51, 234, 0.3)",
                      "0 15px 50px rgba(236, 72, 153, 0.4)",
                      "0 10px 40px rgba(147, 51, 234, 0.3)"
                    ]
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                >
                  {/* Magic Shimmer Effect */}
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    animate={{ x: [-200, 200] }}
                    transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                  />
                  
                  <div className="relative flex items-center space-x-3 z-10">
                    <motion.div
                      animate={{ rotate: [0, 360] }}
                      transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                    >
                      <Wand2 className="w-6 h-6" />
                    </motion.div>
                    <span>Start Your Transformation</span>
                    <motion.div
                      animate={{ x: [0, 5, 0] }}
                      transition={{ duration: 1.5, repeat: Infinity }}
                    >
                      <ArrowRight className="w-6 h-6" />
                    </motion.div>
                  </div>
                </motion.button>

                <motion.button 
                  className="group px-8 py-4 border-2 border-gray-200 text-gray-700 rounded-2xl font-semibold text-lg hover:border-purple-300 hover:bg-purple-50 transition-all duration-300 backdrop-blur-sm"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <div className="flex items-center space-x-3">
                    <Lightbulb className="w-6 h-6" />
                    <span>View Examples</span>
                  </div>
                </motion.button>
              </motion.div>

              {/* Trust Indicators */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 1, delay: 0.8 }}
                className="flex items-center space-x-6 pt-4"
              >
                <div className="flex items-center space-x-2">
                  <div className="flex -space-x-2">
                    {[1,2,3,4,5].map((i) => (
                      <motion.div
                        key={i}
                        className="w-8 h-8 rounded-full bg-gradient-to-br from-purple-400 to-pink-400 border-2 border-white flex items-center justify-center text-white text-xs font-bold"
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 1 + i * 0.1 }}
                      >
                        {String.fromCharCode(65 + i)}
                      </motion.div>
                    ))}
                  </div>
                  <div className="text-sm text-gray-600">
                    <div className="font-semibold">25,000+ professionals</div>
                    <div>trust our platform</div>
                  </div>
                </div>
              </motion.div>
            </motion.div>

            {/* Right Visual */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 1, delay: 0.4 }}
              className="relative"
            >
              <motion.div 
                className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-8 shadow-2xl relative overflow-hidden"
                animate={{
                  boxShadow: [
                    "0 25px 60px rgba(147, 51, 234, 0.1)",
                    "0 35px 80px rgba(236, 72, 153, 0.15)",
                    "0 25px 60px rgba(147, 51, 234, 0.1)"
                  ]
                }}
                transition={{ duration: 4, repeat: Infinity }}
              >
                {/* Floating Elements */}
                <motion.div
                  className="absolute top-4 right-4 w-3 h-3 bg-purple-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, -20, 0],
                  }}
                  transition={{ duration: 3, repeat: Infinity }}
                />
                <motion.div
                  className="absolute bottom-6 left-6 w-2 h-2 bg-pink-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    y: [0, -15, 0],
                  }}
                  transition={{ duration: 2.5, repeat: Infinity, delay: 1 }}
                />

                {/* Demo Interface */}
                <div className="space-y-6">
                  <div className="flex items-center justify-between">
                    <div className="text-lg font-semibold text-gray-800">Resume Transformer</div>
                    <motion.div 
                      className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-xs font-medium flex items-center space-x-1"
                      animate={{ scale: [1, 1.05, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                      <span>AI Active</span>
                    </motion.div>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <motion.div 
                      className="bg-gray-50 border-2 border-dashed border-gray-300 rounded-xl p-6 text-center"
                      whileHover={{ scale: 1.02 }}
                    >
                      <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
                      <div className="text-sm text-gray-600">Your Resume</div>
                    </motion.div>
                    
                    <motion.div 
                      className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-xl p-6 text-center relative overflow-hidden"
                      whileHover={{ scale: 1.02 }}
                      animate={{
                        borderColor: ["rgba(147, 51, 234, 0.3)", "rgba(236, 72, 153, 0.3)", "rgba(147, 51, 234, 0.3)"]
                      }}
                      transition={{ duration: 3, repeat: Infinity }}
                    >
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: "linear" }}
                      >
                        <Crown className="w-8 h-8 text-purple-600 mx-auto mb-2" />
                      </motion.div>
                      <div className="text-sm text-purple-700 font-medium">LaTeX Magic</div>
                      
                      <motion.div
                        className="absolute inset-0 bg-gradient-to-r from-transparent via-white/50 to-transparent"
                        animate={{ x: [-100, 100] }}
                        transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                      />
                    </motion.div>
                  </div>

                  <motion.div 
                    className="bg-gradient-to-r from-purple-600 to-pink-600 text-white rounded-xl p-4 text-center relative overflow-hidden"
                    animate={{
                      backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
                    }}
                    style={{ backgroundSize: "200% 200%" }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    <div className="flex items-center justify-center space-x-2 relative z-10">
                      <motion.div
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Bot className="w-5 h-5" />
                      </motion.div>
                      <span className="font-medium">AI Processing Complete!</span>
                      <CheckCircle className="w-5 h-5" />
                    </div>
                  </motion.div>
                </div>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Enhanced Features Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-purple-50/50 to-pink-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <motion.h2 
              className="text-4xl font-bold text-gray-900 mb-4"
              animate={{
                textShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.1)",
                  "0 0 30px rgba(236, 72, 153, 0.15)",
                  "0 0 20px rgba(147, 51, 234, 0.1)"
                ]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            >
              Powerful AI Features That Transform Everything
            </motion.h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our cutting-edge AI technology doesn't just format your resume—it enhances your entire professional story 
              with intelligent optimization and stunning visual presentation.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.1 }}
                viewport={{ once: true }}
                className="group relative"
                whileHover={{ y: -10 }}
              >
                <motion.div 
                  className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-xl relative overflow-hidden h-full"
                  whileHover={{
                    boxShadow: "0 25px 60px rgba(147, 51, 234, 0.15)"
                  }}
                  transition={{ duration: 0.3 }}
                >
                  {/* Background Gradient */}
                  <motion.div
                    className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-5 transition-opacity duration-300`}
                  />

                  {/* Icon */}
                  <motion.div 
                    className={`w-16 h-16 rounded-2xl bg-gradient-to-br ${feature.gradient} flex items-center justify-center mb-6 relative`}
                    animate={{
                      boxShadow: [
                        "0 10px 30px rgba(147, 51, 234, 0.2)",
                        "0 15px 40px rgba(236, 72, 153, 0.3)",
                        "0 10px 30px rgba(147, 51, 234, 0.2)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <feature.icon className="w-8 h-8 text-white" />
                    
                    {/* Magic Sparkles */}
                    <motion.div
                      className="absolute -top-1 -right-1 w-2 h-2 bg-yellow-400 rounded-full"
                      animate={{
                        scale: [0, 1, 0],
                        opacity: [0, 1, 0]
                      }}
                      transition={{ duration: 2, repeat: Infinity, delay: index * 0.2 }}
                    />
                  </motion.div>
                  
                  <h3 className="text-xl font-bold text-gray-900 mb-4 relative z-10">{feature.title}</h3>
                  <p className="text-sm text-gray-600 leading-relaxed relative z-10">{feature.description}</p>

                  {/* Hover Effects */}
                  <motion.div
                    className="absolute bottom-4 right-4 w-2 h-2 bg-purple-400 rounded-full opacity-0 group-hover:opacity-100"
                    animate={{
                      scale: [0, 1, 0],
                      y: [0, -10, 0],
                    }}
                    transition={{ duration: 2, repeat: Infinity }}
                  />
                </motion.div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Stats Section */}
      <section className="relative z-10 py-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-3xl p-12 shadow-2xl relative overflow-hidden"
          >
            {/* Background Pattern */}
            <div className="absolute inset-0 opacity-5">
              <div 
                className="w-full h-full"
                style={{
                  backgroundImage: `
                    radial-gradient(circle at 1px 1px, rgba(147, 51, 234, 0.3) 1px, transparent 0)
                  `,
                  backgroundSize: '40px 40px'
                }}
              />
            </div>

            <div className="grid grid-cols-2 lg:grid-cols-4 gap-8 relative z-10">
              {stats.map((stat, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, scale: 0.5 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: index * 0.1 }}
                  viewport={{ once: true }}
                  className="text-center group"
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="w-16 h-16 rounded-2xl bg-gradient-to-br from-purple-100 to-pink-100 flex items-center justify-center mx-auto mb-4 relative"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                    animate={{
                      boxShadow: [
                        "0 10px 30px rgba(147, 51, 234, 0.1)",
                        "0 15px 40px rgba(236, 72, 153, 0.15)",
                        "0 10px 30px rgba(147, 51, 234, 0.1)"
                      ]
                    }}
                    transition={{ duration: 4, repeat: Infinity, delay: index * 0.5 }}
                  >
                    <stat.icon className={`w-8 h-8 ${stat.color}`} />
                  </motion.div>
                  
                  <motion.div 
                    className="text-3xl font-bold text-gray-900 mb-2"
                    animate={{
                      textShadow: [
                        "0 0 10px rgba(147, 51, 234, 0.1)",
                        "0 0 20px rgba(236, 72, 153, 0.15)",
                        "0 0 10px rgba(147, 51, 234, 0.1)"
                      ]
                    }}
                    transition={{ duration: 3, repeat: Infinity }}
                  >
                    {stat.value}
                  </motion.div>
                  <div className="text-sm text-gray-600 font-medium">{stat.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section className="relative z-10 py-24 bg-gradient-to-br from-blue-50/50 to-purple-50/50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Success Stories That Inspire</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Discover how professionals transformed their careers with our AI-powered resume magic
            </p>
          </motion.div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: index * 0.2 }}
                viewport={{ once: true }}
                className="bg-white/80 backdrop-blur-xl border border-gray-200/50 rounded-2xl p-8 shadow-xl relative overflow-hidden"
                whileHover={{ y: -5 }}
              >
                <motion.div
                  className="absolute top-4 right-4 w-2 h-2 bg-purple-400 rounded-full"
                  animate={{
                    scale: [0, 1, 0],
                    opacity: [0, 1, 0]
                  }}
                  transition={{ duration: 3, repeat: Infinity, delay: index * 0.5 }}
                />

                <div className="flex items-center space-x-4 mb-6">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white font-bold"
                    whileHover={{ scale: 1.1 }}
                  >
                    {testimonial.avatar}
                  </motion.div>
                  <div>
                    <div className="font-semibold text-gray-900">{testimonial.name}</div>
                    <div className="text-sm text-gray-600">{testimonial.role}</div>
                    <div className="text-xs text-purple-600 font-medium">{testimonial.company}</div>
                  </div>
                </div>

                <p className="text-gray-700 text-sm leading-relaxed italic">"{testimonial.text}"</p>

                <div className="flex items-center mt-4">
                  {[1,2,3,4,5].map((star) => (
                    <motion.div
                      key={star}
                      initial={{ scale: 0 }}
                      whileInView={{ scale: 1 }}
                      transition={{ delay: index * 0.2 + star * 0.1 }}
                      viewport={{ once: true }}
                    >
                      <Star className="w-4 h-4 text-yellow-400 fill-current" />
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Enhanced Final CTA */}
      <section className="relative z-10 py-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            viewport={{ once: true }}
            className="bg-gradient-to-br from-purple-600 via-pink-600 to-blue-600 rounded-3xl p-12 text-white relative overflow-hidden"
          >
            {/* Magic Background Effects */}
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-purple-600/50 via-pink-600/50 to-blue-600/50"
              animate={{
                backgroundPosition: ["0% 50%", "100% 50%", "0% 50%"]
              }}
              style={{ backgroundSize: "300% 300%" }}
              transition={{ duration: 8, repeat: Infinity }}
            />

            {/* Floating Elements */}
            <motion.div
              className="absolute top-8 left-8 w-4 h-4 bg-white/30 rounded-full"
              animate={{
                scale: [0, 1, 0],
                y: [0, -30, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 4, repeat: Infinity }}
            />
            <motion.div
              className="absolute top-12 right-12 w-3 h-3 bg-yellow-300/50 rounded-full"
              animate={{
                scale: [0, 1, 0],
                y: [0, -25, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3.5, repeat: Infinity, delay: 1 }}
            />
            <motion.div
              className="absolute bottom-8 left-1/4 w-2 h-2 bg-blue-300/50 rounded-full"
              animate={{
                scale: [0, 1, 0],
                y: [0, -20, 0],
                opacity: [0, 1, 0]
              }}
              transition={{ duration: 3, repeat: Infinity, delay: 2 }}
            />

            <div className="relative z-10 space-y-8">
              <motion.div
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: "linear" }}
              >
                <Gem className="w-16 h-16 mx-auto mb-6" />
              </motion.div>
              
              <motion.h2 
                className="text-4xl font-bold mb-4"
                animate={{
                  textShadow: [
                    "0 0 30px rgba(255, 255, 255, 0.5)",
                    "0 0 40px rgba(255, 255, 255, 0.7)",
                    "0 0 30px rgba(255, 255, 255, 0.5)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                Ready to Transform Your Career Story?
              </motion.h2>
              
              <p className="text-xl text-white/90 mb-8 max-w-3xl mx-auto">
                Join thousands of professionals who have already discovered the magic of AI-powered resume transformation. 
                Your dream career is just one click away.
              </p>

              <motion.button
                onClick={handleGetStarted}
                className="group px-10 py-5 bg-white text-purple-600 rounded-2xl font-bold text-lg relative overflow-hidden shadow-2xl"
                whileHover={{ scale: 1.05, y: -3 }}
                whileTap={{ scale: 0.95 }}
                animate={{
                  boxShadow: [
                    "0 20px 60px rgba(255, 255, 255, 0.3)",
                    "0 25px 70px rgba(255, 255, 255, 0.4)",
                    "0 20px 60px rgba(255, 255, 255, 0.3)"
                  ]
                }}
                transition={{ duration: 3, repeat: Infinity }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-200/50 to-transparent"
                  animate={{ x: [-200, 200] }}
                  transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
                />

                <div className="flex items-center space-x-3 relative z-10">
                  <motion.div
                    animate={{ 
                      rotate: [0, 360],
                      scale: [1, 1.2, 1]
                    }}
                    transition={{ 
                      rotate: { duration: 4, repeat: Infinity, ease: "linear" },
                      scale: { duration: 1.5, repeat: Infinity }
                    }}
                  >
                    <Rocket className="w-6 h-6" />
                  </motion.div>
                  <span>Start My Magical Transformation</span>
                  <motion.div
                    animate={{ x: [0, 8, 0] }}
                    transition={{ duration: 2, repeat: Infinity }}
                  >
                    <ArrowRight className="w-6 h-6" />
                  </motion.div>
                </div>
              </motion.button>

              <div className="text-sm text-white/70 mt-4">
                ✨ Free trial • No credit card required • Transform in seconds
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Enhanced Footer */}
            {/* Enhanced Footer */}
            <footer className="relative z-10 py-12 bg-gradient-to-br from-gray-50 to-white border-t border-gray-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <motion.div 
            className="flex items-center justify-center space-x-3 mb-6"
            animate={{
              textShadow: [
                "0 0 20px rgba(147, 51, 234, 0.1)",
                "0 0 30px rgba(236, 72, 153, 0.15)",
                "0 0 20px rgba(147, 51, 234, 0.1)"
              ]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          >
            <motion.div 
              className="w-8 h-8 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center shadow-lg"
              animate={{
                boxShadow: [
                  "0 0 20px rgba(147, 51, 234, 0.3)",
                  "0 0 30px rgba(236, 72, 153, 0.4)",
                  "0 0 20px rgba(147, 51, 234, 0.3)"
                ]
              }}
              transition={{ duration: 3, repeat: Infinity }}
              whileHover={{ scale: 1.1, rotate: 10 }}
            >
              <FileText className="w-4 h-4 text-white" />
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent rounded-xl"
                animate={{ x: [-100, 100] }}
                transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
              />
            </motion.div>
            <div>
              <span className="text-xl font-bold bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">ResumeTex</span>
              <div className="text-xs text-gray-500">AI Resume Magic Platform</div>
            </div>
          </motion.div>

          {/* Footer Links */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="flex flex-wrap justify-center items-center space-x-6 mb-6 text-sm text-gray-600"
          >
            <motion.a 
              href="#" 
              className="hover:text-purple-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Privacy Policy
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Terms of Service
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Support
            </motion.a>
            <motion.a 
              href="#" 
              className="hover:text-purple-600 transition-colors duration-200"
              whileHover={{ scale: 1.05 }}
            >
              Blog
            </motion.a>
          </motion.div>

          {/* Copyright */}
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: true }}
            className="border-t border-gray-200 pt-6"
          >
            <p className="text-sm text-gray-500 mb-4">
              © 2024 ResumeTex. Transform your career with magical AI-powered resume enhancement.
            </p>
            
            {/* Magic Elements */}
            <div className="flex justify-center items-center space-x-2 text-xs text-gray-400">
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity }}
              >
                ✨
              </motion.span>
              <span>Crafted with AI Magic</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 1 }}
              >
                🚀
              </motion.span>
              <span>Powered by Innovation</span>
              <motion.span
                animate={{ opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 2, repeat: Infinity, delay: 0.5 }}
              >
                💫
              </motion.span>
            </div>
          </motion.div>

          {/* Floating Magic Sparkles */}
          <motion.div
            className="absolute bottom-4 left-1/4 w-2 h-2 bg-purple-400/50 rounded-full"
            animate={{
              scale: [0, 1, 0],
              y: [0, -20, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.div
            className="absolute bottom-8 right-1/3 w-1.5 h-1.5 bg-pink-400/50 rounded-full"
            animate={{
              scale: [0, 1, 0],
              y: [0, -15, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 3.5, repeat: Infinity, delay: 1.5 }}
          />
          <motion.div
            className="absolute bottom-6 left-1/2 w-1 h-1 bg-blue-400/50 rounded-full"
            animate={{
              scale: [0, 1, 0],
              y: [0, -10, 0],
              opacity: [0, 0.8, 0]
            }}
            transition={{ duration: 3, repeat: Infinity, delay: 0.8 }}
          />
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;