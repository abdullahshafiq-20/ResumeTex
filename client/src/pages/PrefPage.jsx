import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useDashboard } from "../context/DashbaordContext";
import {
  Brain,
  Settings,
  FileText,
  Calendar,
  Target,
  Sparkles,
  Code,
  FolderOpen,
  Users,
  TrendingUp,
  Layers,
  RefreshCw,
  Edit3,
  Save,
  X,
  Plus,
  Loader2,
  Info,
  Lock,
  Link,
  ExternalLink,
  // Social Media Icons
  Linkedin,
  Github,
  Twitter,
  Instagram,
  Youtube,
  Facebook,

  // Communication Icons
  Mail,
  MessageCircle, // Used for Discord and WhatsApp
  Send, // Used for Telegram
  Phone,

  // Design & Creative Icons
  Palette, // Used for Behance and Dribbble
  Figma,

  // Development Icons // Used for Stack Overflow and CodePen
  Code2, // Used for Dev.to
  Hash, // Used for Hashnode

  // Content & Documentation Icons
  BookOpen, // Used for Notion

  // Web & Portfolio Icons
  Globe, // Used for Portfolio
  Globe2, // Used for Personal Website

  // Business & Productivity Icons
  Building, // Used for Crunchbase
  Zap, // Used for Product Hunt

  // Media & Entertainment Icons
  Video,
  XIcon, // Used for Twitch and TikTok
} from "lucide-react";
import { useResumes } from "../context/ResumeContext";

// Platform configuration with icons and validation patterns
const PLATFORMS = {
  LinkedIn: {
    name: "LinkedIn",
    icon: Linkedin,
    color: "text-blue-600",
    bgColor: "bg-blue-100",
    placeholder: "https://linkedin.com/in/username",
    pattern: /^https?:\/\/(www\.)?linkedin\.com\/in\/[a-zA-Z0-9-]+\/?$/,
  },
  GitHub: {
    name: "GitHub",
    icon: Github,
    color: "text-gray-800",
    bgColor: "bg-gray-100",
    placeholder: "https://github.com/username",
    pattern: /^https?:\/\/(www\.)?github\.com\/[a-zA-Z0-9-]+\/?$/,
  },
  Portfolio: {
    name: "Portfolio",
    icon: Globe,
    color: "text-green-600",
    bgColor: "bg-green-100",
    placeholder: "https://yourportfolio.com",
    pattern: /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
  },
  Twitter: {
    name: "Twitter",
    icon: XIcon,
    color: "text-blue-400",
    bgColor: "bg-blue-50",
    placeholder: "https://twitter.com/username",
    pattern: /^https?:\/\/(www\.)?(twitter\.com|x\.com)\/[a-zA-Z0-9_]+\/?$/,
  },
  Instagram: {
    name: "Instagram",
    icon: Instagram,
    color: "text-pink-600",
    bgColor: "bg-pink-100",
    placeholder: "https://instagram.com/username",
    pattern: /^https?:\/\/(www\.)?instagram\.com\/[a-zA-Z0-9_.]+\/?$/,
  },
  YouTube: {
    name: "YouTube",
    icon: Youtube,
    color: "text-red-600",
    bgColor: "bg-red-100",
    placeholder: "https://youtube.com/@channel",
    pattern:
      /^https?:\/\/(www\.)?youtube\.com\/(channel\/|@|c\/)[a-zA-Z0-9_-]+\/?$/,
  },
  Facebook: {
    name: "Facebook",
    icon: Facebook,
    color: "text-blue-700",
    bgColor: "bg-blue-100",
    placeholder: "https://facebook.com/profile",
    pattern: /^https?:\/\/(www\.)?facebook\.com\/[a-zA-Z0-9.]+\/?$/,
  },
  Email: {
    name: "Email",
    icon: Mail,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    placeholder: "mailto:your@email.com",
    pattern: /^mailto:[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/,
  },
  // New Professional Platforms
  Behance: {
    name: "Behance",
    icon: Palette, // or use a custom Behance icon
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    placeholder: "https://behance.net/username",
    pattern: /^https?:\/\/(www\.)?behance\.net\/[a-zA-Z0-9_-]+\/?$/,
  },
  Dribbble: {
    name: "Dribbble",
    icon: Palette,
    color: "text-pink-500",
    bgColor: "bg-pink-50",
    placeholder: "https://dribbble.com/username",
    pattern: /^https?:\/\/(www\.)?dribbble\.com\/[a-zA-Z0-9_-]+\/?$/,
  },
  Medium: {
    name: "Medium",
    icon: FileText,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    placeholder: "https://medium.com/@username",
    pattern: /^https?:\/\/(www\.)?medium\.com\/@[a-zA-Z0-9_.-]+\/?$/,
  },
  StackOverflow: {
    name: "Stack Overflow",
    icon: Code,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    placeholder: "https://stackoverflow.com/users/id/username",
    pattern:
      /^https?:\/\/(www\.)?stackoverflow\.com\/users\/\d+\/[a-zA-Z0-9-]+\/?$/,
  },
  Devto: {
    name: "Dev.to",
    icon: Code2,
    color: "text-gray-800",
    bgColor: "bg-gray-50",
    placeholder: "https://dev.to/username",
    pattern: /^https?:\/\/(www\.)?dev\.to\/[a-zA-Z0-9_-]+\/?$/,
  },
  CodePen: {
    name: "CodePen",
    icon: Code,
    color: "text-gray-700",
    bgColor: "bg-gray-100",
    placeholder: "https://codepen.io/username",
    pattern: /^https?:\/\/(www\.)?codepen\.io\/[a-zA-Z0-9_-]+\/?$/,
  },
  Figma: {
    name: "Figma",
    icon: Figma,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    placeholder: "https://figma.com/@username",
    pattern: /^https?:\/\/(www\.)?figma\.com\/@[a-zA-Z0-9_-]+\/?$/,
  },
  Hashnode: {
    name: "Hashnode",
    icon: Hash,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    placeholder: "https://hashnode.com/@username",
    pattern:
      /^https?:\/\/[a-zA-Z0-9_-]+\.hashnode\.dev\/?$|^https?:\/\/(www\.)?hashnode\.com\/@[a-zA-Z0-9_-]+\/?$/,
  },
  Notion: {
    name: "Notion",
    icon: BookOpen,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    placeholder: "https://notion.so/username",
    pattern:
      /^https?:\/\/[a-zA-Z0-9_-]+\.notion\.site\/.*$|^https?:\/\/(www\.)?notion\.so\/[a-zA-Z0-9_-]+.*$/,
  },
  Website: {
    name: "Personal Website",
    icon: Globe2,
    color: "text-indigo-600",
    bgColor: "bg-indigo-50",
    placeholder: "https://yourname.com",
    pattern: /^https?:\/\/[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}(\/.*)?$/,
  },
  Calendly: {
    name: "Calendly",
    icon: Calendar,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    placeholder: "https://calendly.com/username",
    pattern: /^https?:\/\/(www\.)?calendly\.com\/[a-zA-Z0-9_-]+\/?.*$/,
  },
  Discord: {
    name: "Discord",
    icon: MessageCircle,
    color: "text-indigo-500",
    bgColor: "bg-indigo-50",
    placeholder: "https://discord.gg/servername or discord.com/users/userid",
    pattern:
      /^https?:\/\/(www\.)?(discord\.gg\/[a-zA-Z0-9]+|discord\.com\/users\/\d+)\/?$/,
  },
  Telegram: {
    name: "Telegram",
    icon: Send,
    color: "text-blue-500",
    bgColor: "bg-blue-50",
    placeholder: "https://t.me/username",
    pattern: /^https?:\/\/(www\.)?t\.me\/[a-zA-Z0-9_]+\/?$/,
  },
  WhatsApp: {
    name: "WhatsApp",
    icon: MessageCircle,
    color: "text-green-500",
    bgColor: "bg-green-50",
    placeholder: "https://wa.me/1234567890",
    pattern: /^https?:\/\/(www\.)?wa\.me\/\d+\/?$/,
  },
  Phone: {
    name: "Phone",
    icon: Phone,
    color: "text-gray-600",
    bgColor: "bg-gray-100",
    placeholder: "tel:+1234567890",
    pattern: /^tel:\+?[1-9]\d{1,14}$/,
  },
  Substack: {
    name: "Substack",
    icon: Mail,
    color: "text-orange-600",
    bgColor: "bg-orange-50",
    placeholder: "https://username.substack.com",
    pattern: /^https?:\/\/[a-zA-Z0-9_-]+\.substack\.com\/?.*$/,
  },
  Twitch: {
    name: "Twitch",
    icon: Video,
    color: "text-purple-600",
    bgColor: "bg-purple-50",
    placeholder: "https://twitch.tv/username",
    pattern: /^https?:\/\/(www\.)?twitch\.tv\/[a-zA-Z0-9_]+\/?$/,
  },
  TikTok: {
    name: "TikTok",
    icon: Video,
    color: "text-black",
    bgColor: "bg-gray-100",
    placeholder: "https://tiktok.com/@username",
    pattern: /^https?:\/\/(www\.)?tiktok\.com\/@[a-zA-Z0-9_.]+\/?$/,
  },
  ProductHunt: {
    name: "Product Hunt",
    icon: Zap,
    color: "text-orange-500",
    bgColor: "bg-orange-50",
    placeholder: "https://producthunt.com/@username",
    pattern: /^https?:\/\/(www\.)?producthunt\.com\/@[a-zA-Z0-9_-]+\/?$/,
  },
  AngelList: {
    name: "AngelList",
    icon: TrendingUp,
    color: "text-gray-700",
    bgColor: "bg-gray-50",
    placeholder: "https://angel.co/u/username",
    pattern:
      /^https?:\/\/(www\.)?(angel\.co\/u\/[a-zA-Z0-9_-]+|wellfound\.com\/u\/[a-zA-Z0-9_-]+)\/?$/,
  },
  Crunchbase: {
    name: "Crunchbase",
    icon: Building,
    color: "text-blue-600",
    bgColor: "bg-blue-50",
    placeholder: "https://crunchbase.com/person/name",
    pattern: /^https?:\/\/(www\.)?crunchbase\.com\/person\/[a-zA-Z0-9-]+\/?$/,
  },
};
// Validation function
const validateUrl = (platform, url) => {
  if (!url.trim()) return "URL is required";

  const platformConfig = PLATFORMS[platform];
  if (!platformConfig) return "Invalid platform";

  if (!platformConfig.pattern.test(url.trim())) {
    return `Please enter a valid ${platformConfig.name} URL`;
  }

  return null;
};

// Mobile-Optimized Title Restriction Modal
const TitleRestrictionModal = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-4"
        >
          <div className="flex justify-between items-start mb-3 sm:mb-4">
            <div className="flex items-center">
              <div className="flex-shrink-0 w-6 h-6 sm:w-8 sm:h-8 bg-amber-100 rounded-full flex items-center justify-center mr-2 sm:mr-3">
                <Lock className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600" />
              </div>
              <h3 className="text-sm sm:text-base font-semibold text-gray-900">
                Title Cannot Be Edited
              </h3>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="mb-4 sm:mb-6">
            <p className="text-xs sm:text-sm text-gray-600 leading-relaxed mb-2 sm:mb-3">
              The preference title is automatically linked to your resume title
              and is used for generating personalized emails.
            </p>
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-2 sm:p-3">
              <div className="flex items-start">
                <Info className="h-3 w-3 sm:h-4 sm:w-4 text-amber-600 mt-0.5 mr-1.5 sm:mr-2 flex-shrink-0" />
                <div className="text-[10px] sm:text-xs text-amber-800">
                  <p className="font-medium mb-1">
                    Why can't I edit the title?
                  </p>
                  <p>
                    This ensures consistency between your resume and email
                    generation, maintaining professional accuracy across all
                    communications.
                  </p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-full px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm font-medium"
          >
            Got it
          </button>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Mobile-Optimized Links Modal
const LinksModal = ({
  isOpen,
  onClose,
  currentLinks,
  onSave,
  isLoading,
  editingLink = null,
}) => {
  // console.log(currentLinks);
  const [selectedPlatform, setSelectedPlatform] = useState(
    editingLink?.platform || "LinkedIn"
  );
  const [url, setUrl] = useState(editingLink?.url || "");
  const [linkId, setLinkId] = useState(editingLink?._id || "");
  const [error, setError] = useState("");

  const handleSave = () => {
    const validationError = validateUrl(selectedPlatform, url);
    if (validationError) {
      setError(validationError);
      return;
    }

    // Check for duplicates (excluding current editing link)
    const existingLink = currentLinks.find(
      (link) =>
        link.platform === selectedPlatform && link.url !== editingLink?.url
    );

    if (existingLink) {
      setError(`${PLATFORMS[selectedPlatform].name} link already exists`);
      return;
    }

    onSave({ platform: selectedPlatform, url: url.trim(), _id: linkId });
    handleClose();
  };

  const handleClose = () => {
    setSelectedPlatform(editingLink?.platform || "LinkedIn");
    setUrl(editingLink?.url || "");
    setError("");
    onClose();
  };

  React.useEffect(() => {
    if (editingLink) {
      setSelectedPlatform(editingLink.platform);
      setUrl(editingLink.url);
      setLinkId(editingLink._id);
    } else {
      setSelectedPlatform("LinkedIn");
      setUrl("");
    }
    setError("");
  }, [editingLink, isOpen]);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-md mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center">
              <Link className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-600" />
              {editingLink ? "Edit Link" : "Add Link"}
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          {/* Platform Selection */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Platform
            </label>
            <div className="grid grid-cols-2 gap-1.5 sm:gap-2">
              {Object.entries(PLATFORMS).map(([key, platform]) => {
                const IconComponent = platform.icon;
                return (
                  <button
                    key={key}
                    type="button"
                    onClick={() => setSelectedPlatform(key)}
                    className={`p-2 sm:p-3 rounded-lg border transition-all text-left ${
                      selectedPlatform === key
                        ? `${platform.bgColor} border-current ${platform.color}`
                        : "bg-gray-50 border-gray-200 hover:bg-gray-100 text-gray-700"
                    }`}
                  >
                    <div className="flex items-center space-x-1.5 sm:space-x-2">
                      <IconComponent className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0" />
                      <span className="text-[10px] sm:text-xs font-medium">
                        {platform.name}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* URL Input */}
          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              URL
            </label>
            <input
              type="url"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setError("");
              }}
              placeholder={PLATFORMS[selectedPlatform].placeholder}
              className={`w-full border rounded-lg p-2 sm:p-3 text-xs sm:text-sm focus:ring-2 focus:ring-purple-500 focus:border-transparent ${
                error ? "border-red-300" : "border-gray-300"
              }`}
            />
            {error && (
              <p className="text-[10px] sm:text-xs text-red-600 mt-1">
                {error}
              </p>
            )}
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Please enter the full URL including https://
            </p>
          </div>

          {/* Current Links Preview */}
          {currentLinks.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Current Links
              </label>
              <div className="max-h-16 sm:max-h-20 overflow-y-auto space-y-1">
                {currentLinks.map((link, index) => {
                  const platform = PLATFORMS[link.platform];
                  const IconComponent = platform?.icon || Link;
                  return (
                    <div
                      key={index}
                      className="flex items-center space-x-2 p-1.5 sm:p-2 bg-gray-50 rounded text-[10px] sm:text-xs"
                    >
                      <IconComponent
                        className={`h-3 w-3 sm:h-4 sm:w-4 ${
                          platform?.color || "text-gray-600"
                        }`}
                      />
                      <span className="font-medium">
                        {platform?.name || link.platform}:
                      </span>
                      <span className="text-gray-600 truncate">{link.url}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !url.trim()}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span>{editingLink ? "Updating..." : "Adding..."}</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{editingLink ? "Update Link" : "Add Link"}</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-xs sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Mobile-Optimized Skills Modal
const SkillsModal = ({ isOpen, onClose, currentSkills, onSave, isLoading }) => {
  const [skillsInput, setSkillsInput] = useState("");

  const handleSave = () => {
    if (skillsInput.trim()) {
      const newSkills = skillsInput
        .split(",")
        .map((skill) => skill.trim())
        .filter((skill) => skill.length > 0);

      onSave(newSkills);
      setSkillsInput("");
    }
  };

  const handleClose = () => {
    setSkillsInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center">
              <Code className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-600" />
              Add Skills
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Enter skills separated by commas
            </label>
            <textarea
              value={skillsInput}
              onChange={(e) => setSkillsInput(e.target.value)}
              placeholder="React, Node.js, Python, JavaScript, etc."
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-xs sm:text-sm resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Separate multiple skills with commas
            </p>
          </div>

          {/* Current Skills Preview - Compact */}
          {currentSkills.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Current Skills
              </label>
              <div className="flex flex-wrap gap-1 max-h-16 sm:max-h-20 overflow-y-auto">
                {currentSkills.map((skill, index) => (
                  <span
                    key={index}
                    className="px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs"
                  >
                    {skill}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !skillsInput.trim()}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Add Skills</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-xs sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

// Mobile-Optimized Projects Modal
const ProjectsModal = ({
  isOpen,
  onClose,
  currentProjects,
  onSave,
  isLoading,
}) => {
  const [projectsInput, setProjectsInput] = useState("");

  const handleSave = () => {
    if (projectsInput.trim()) {
      const newProjects = projectsInput
        .split(",")
        .map((project) => project.trim())
        .filter((project) => project.length > 0);

      onSave(newProjects);
      setProjectsInput("");
    }
  };

  const handleClose = () => {
    setProjectsInput("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="bg-white rounded-lg p-3 sm:p-4 w-full max-w-xs sm:max-w-sm mx-2 sm:mx-4 max-h-[90vh] overflow-y-auto"
        >
          <div className="flex justify-between items-center mb-3 sm:mb-4">
            <h3 className="text-sm sm:text-base font-semibold text-gray-900 flex items-center">
              <FolderOpen className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-green-600" />
              Add Projects
            </h3>
            <button
              onClick={handleClose}
              className="text-gray-400 hover:text-gray-600"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="mb-3 sm:mb-4">
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
              Enter projects separated by commas
            </label>
            <textarea
              value={projectsInput}
              onChange={(e) => setProjectsInput(e.target.value)}
              placeholder="E-commerce Platform, Chat Application, etc."
              className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-xs sm:text-sm resize-none focus:ring-2 focus:ring-green-500 focus:border-transparent"
              rows={3}
            />
            <p className="text-[10px] sm:text-xs text-gray-500 mt-1">
              Separate multiple projects with commas
            </p>
          </div>

          {/* Current Projects Preview - Compact */}
          {currentProjects.length > 0 && (
            <div className="mb-3 sm:mb-4">
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1.5 sm:mb-2">
                Current Projects
              </label>
              <div className="space-y-1 max-h-16 sm:max-h-20 overflow-y-auto">
                {currentProjects.map((project, index) => (
                  <div
                    key={index}
                    className="p-1.5 sm:p-2 bg-green-50 border border-green-200 rounded text-[10px] sm:text-xs text-green-800"
                  >
                    {project}
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
            <button
              onClick={handleSave}
              disabled={isLoading || !projectsInput.trim()}
              className="flex-1 px-3 py-2 sm:px-4 sm:py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-xs sm:text-sm flex items-center justify-center space-x-1.5 sm:space-x-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                <>
                  <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin" />
                  <span>Adding...</span>
                </>
              ) : (
                <>
                  <Plus className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>Add Projects</span>
                </>
              )}
            </button>
            <button
              onClick={handleClose}
              className="px-3 py-2 sm:px-4 sm:py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors text-xs sm:text-sm"
            >
              Cancel
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};

const PrefPage = () => {
  const {
    preferences,
    loading,
    error,
    refreshPreferences,
    isSocketConnected,
    stats,
  } = useDashboard();
  const { updatePreferences, addLinks, updateLinks, deleteLink } = useResumes();
  const [selectedRecord, setSelectedRecord] = useState(0);
  const { lastUpdated, isLive } = useDashboard();

  // Edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editData, setEditData] = useState({});
  const [isSaving, setIsSaving] = useState(false);

  // Modal states
  const [showSkillsModal, setShowSkillsModal] = useState(false);
  const [showProjectsModal, setShowProjectsModal] = useState(false);
  const [showLinksModal, setShowLinksModal] = useState(false);
  const [showTitleRestrictionModal, setShowTitleRestrictionModal] =
    useState(false);
  const [isAddingSkills, setIsAddingSkills] = useState(false);
  const [isAddingProjects, setIsAddingProjects] = useState(false);
  const [isManagingLinks, setIsManagingLinks] = useState(false);
  const [editingLink, setEditingLink] = useState(null);

  // Get user links from stats
  const userLinks = stats?.user?.links || [];

  // Initialize edit data when editing starts
  const startEditing = () => {
    const currentRecord = preferences.records[selectedRecord];
    setEditData({
      preferences:
        typeof currentRecord.preferences === "string"
          ? currentRecord.preferences
          : JSON.stringify(currentRecord.preferences) || "",
      summary: currentRecord.summary || "",
      skills: [...(currentRecord.skills || [])],
      projects: [...(currentRecord.projects || [])],
    });
    setIsEditing(true);
  };

  // Cancel editing
  const cancelEditing = () => {
    setIsEditing(false);
    setEditData({});
  };

  // Save preferences - preserve selected record
  const savePreferences = async () => {
    const currentSelectedIndex = selectedRecord; // Store current selection index
    // console.log(preferences.records[selectedRecord]._id);
    setIsSaving(true);
    try {
      await updatePreferences(
        editData,
        preferences.records[selectedRecord]._id
      );
      setIsEditing(false);
      setEditData({});
      // Refresh preferences to get updated data
      await refreshPreferences();
      // Restore the selected record after refresh
      setSelectedRecord(currentSelectedIndex);
    } catch (error) {
      console.error("Error updating preferences:", error);
    } finally {
      setIsSaving(false);
    }
  };

  // Handle adding skills from modal
  const handleAddSkills = async (newSkills) => {
    setIsAddingSkills(true);
    try {
      const updatedSkills = [...editData.skills, ...newSkills];
      setEditData((prev) => ({
        ...prev,
        skills: updatedSkills,
      }));
      setShowSkillsModal(false);
    } catch (error) {
      console.error("Error adding skills:", error);
    } finally {
      setIsAddingSkills(false);
    }
  };

  // Handle adding projects from modal
  const handleAddProjects = async (newProjects) => {
    setIsAddingProjects(true);
    try {
      const updatedProjects = [...editData.projects, ...newProjects];
      setEditData((prev) => ({
        ...prev,
        projects: updatedProjects,
      }));
      setShowProjectsModal(false);
    } catch (error) {
      console.error("Error adding projects:", error);
    } finally {
      setIsAddingProjects(false);
    }
  };

  // Handle links management
  const handleAddLink = async (linkData) => {
    setIsManagingLinks(true);
    try {
      await addLinks(linkData);
      setShowLinksModal(false);
      // Refresh will happen via socket
    } catch (error) {
      console.error("Error adding link:", error);
    } finally {
      setIsManagingLinks(false);
    }
  };

  const handleUpdateLink = async (linkData) => {
    setIsManagingLinks(true);
    // console.log("linkData", linkData);
    try {
      await updateLinks(linkData);
      setShowLinksModal(false);
      setEditingLink(null);
      // Refresh will happen via socket
    } catch (error) {
      console.error("Error updating link:", error);
    } finally {
      setIsManagingLinks(false);
    }
  };

  const handleDeleteLink = async (platform) => {
    setIsManagingLinks(true);
    try {
      await deleteLink(platform);
      // Refresh will happen via socket
    } catch (error) {
      console.error("Error deleting link:", error);
    } finally {
      setIsManagingLinks(false);
    }
  };

  const openEditLinkModal = (link) => {
    setEditingLink(link);
    setShowLinksModal(true);
  };

  const openAddLinkModal = () => {
    setEditingLink(null);
    setShowLinksModal(true);
  };

  // Remove skill
  const removeSkill = (index) => {
    setEditData((prev) => ({
      ...prev,
      skills: prev.skills.filter((_, i) => i !== index),
    }));
  };

  // Remove project
  const removeProject = (index) => {
    setEditData((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  if (loading) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex justify-center items-center min-h-[60vh]">
          <div className="flex flex-col items-center space-y-4">
            <div className="animate-spin rounded-full h-12 w-12 border-2 border-blue-600 border-t-transparent"></div>
            <p className="text-sm text-gray-600">Loading your preferences...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="text-red-600 text-sm font-medium">{error}</div>
          <button
            onClick={refreshPreferences}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm flex items-center space-x-2"
          >
            <RefreshCw className="h-4 w-4" />
            <span>Retry</span>
          </button>
        </div>
      </div>
    );
  }

  if (
    !preferences ||
    !preferences.records ||
    preferences.records.length === 0
  ) {
    return (
      <div className="relative px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col items-center justify-center min-h-[60vh] space-y-4">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center">
            <Settings className="h-8 w-8 text-blue-600" />
          </div>
          <h2 className="text-xl font-semibold text-gray-800">
            No Preferences Found
          </h2>
          <p className="text-sm text-gray-600 text-center max-w-md">
            You haven't set up any preferences yet. Upload a resume to
            automatically generate your preferences.
          </p>
        </div>
      </div>
    );
  }

  const currentRecord = preferences.records[selectedRecord];
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.05,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { duration: 0.2 },
    },
  };

  // Helper function to safely render preference title
  const renderPreferenceTitle = (preferences) => {
    if (typeof preferences === "string") {
      return preferences;
    } else if (typeof preferences === "object" && preferences !== null) {
      return JSON.stringify(preferences);
    }
    return "Untitled Preference";
  };

  return (
    <div className="relative">
      {/* Smaller background elements for mobile */}
      <div className="absolute top-0 right-0 w-20 h-20 sm:w-40 sm:h-40 rounded-full bg-gradient-to-br from-blue-200 to-blue-300 opacity-10 blur-3xl -z-10"></div>
      <div className="absolute bottom-20 left-10 w-16 h-16 sm:w-32 sm:h-32 rounded-full bg-gradient-to-br from-purple-200 to-purple-300 opacity-8 blur-2xl -z-10"></div>

      {/* Modals */}
      <TitleRestrictionModal
        isOpen={showTitleRestrictionModal}
        onClose={() => setShowTitleRestrictionModal(false)}
      />

      <SkillsModal
        isOpen={showSkillsModal}
        onClose={() => setShowSkillsModal(false)}
        currentSkills={editData.skills || []}
        onSave={handleAddSkills}
        isLoading={isAddingSkills}
      />

      <ProjectsModal
        isOpen={showProjectsModal}
        onClose={() => setShowProjectsModal(false)}
        currentProjects={editData.projects || []}
        onSave={handleAddProjects}
        isLoading={isAddingProjects}
      />

      <LinksModal
        isOpen={showLinksModal}
        onClose={() => setShowLinksModal(false)}
        currentLinks={userLinks}
        onSave={editingLink ? handleUpdateLink : handleAddLink}
        isLoading={isManagingLinks}
        editingLink={editingLink}
      />

      <motion.div
        className=""
        variants={containerVariants}
        initial="hidden"
        animate="visible"
      >
        {/* Live Status Indicator - Compact */}
        <motion.div
          className="mb-3 sm:mb-6 p-2 sm:p-3 rounded-lg border border-gray-200 bg-white relative overflow-hidden"
          variants={itemVariants}
          initial="hidden"
          animate="visible"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-1.5 sm:space-x-2">
              <div
                className={`h-1.5 w-1.5 sm:h-2 sm:w-2 rounded-full ${
                  isLive ? "bg-green-500 animate-pulse" : "bg-yellow-500"
                }`}
              ></div>
              <span
                className={`text-xs sm:text-sm font-medium ${
                  isLive ? "text-green-700" : "text-yellow-700"
                }`}
              >
                Live Update
              </span>
              {lastUpdated && (
                <span className="text-[10px] sm:text-xs text-gray-500">
                  • {new Date(lastUpdated).toLocaleTimeString()}
                </span>
              )}
            </div>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-600 hover:text-blue-800 text-[10px] sm:text-xs font-medium px-1.5 py-0.5 sm:px-2 sm:py-1 rounded border border-blue-200 hover:border-blue-300 transition-colors"
            >
              Refresh
            </button>
          </div>
        </motion.div>

        {/* User Links Panel - Simple Link Cards */}
        <motion.div
          className="mb-3 sm:mb-6 border border-slate-200 bg-white rounded-lg p-2.5 sm:p-4 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Subtle background pattern */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1 left-1/3 w-2 h-2 sm:w-3 sm:h-3 bg-blue-200/20 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-1 right-1/4 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-indigo-200/15 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative">
            {/* Header Section */}
            <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
              <div className="flex items-center">
                <Link className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 mr-1.5 sm:mr-2" />
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                  Professional Links ({userLinks.length})
                </h3>
                <div className="flex space-x-0.5 sm:space-x-1 ml-2">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-500 rounded-full animate-pulse"></div>
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-indigo-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-500 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>

              <button
                onClick={openAddLinkModal}
                className="text-[10px] sm:text-xs border border-blue-200 text-blue-600 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors flex items-center space-x-1 self-start sm:self-auto"
              >
                <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                <span>Add Link</span>
              </button>
            </div>

            {userLinks.length > 0 ? (
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-2 sm:gap-3">
                {userLinks.map((link, index) => {
                  const platform = PLATFORMS[link.platform];
                  const IconComponent = platform?.icon || Link;

                  // Extract domain from URL
                  const domain = link.url
                    .replace(/^https?:\/\//, "")
                    .split("/")[0];
                  const faviconUrl = `https://www.google.com/s2/favicons?domain=${domain}&sz=16`;

                  return (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="group relative"
                    >
                      {/* Simple Link Card */}
                      <div
                        onClick={() => window.open(link.url, "_blank")}
                        className="border border-gray-200 rounded-lg hover:border-gray-300 transition-all duration-200 overflow-hidden bg-white cursor-pointer hover:bg-gray-50"
                      >
                        <div className="p-2 sm:p-3">
                          {/* Header with favicon and actions */}
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-1.5 sm:space-x-2">
                              <img
                                src={faviconUrl}
                                alt=""
                                className="w-3 h-3 sm:w-4 sm:h-4 rounded"
                                onError={(e) => {
                                  e.target.style.display = "none";
                                  e.target.nextElementSibling.style.display =
                                    "flex";
                                }}
                              />
                              <div
                                className={`w-3 h-3 sm:w-4 sm:h-4 ${
                                  platform?.bgColor || "bg-gray-100"
                                } rounded flex items-center justify-center hidden`}
                              >
                                <IconComponent
                                  className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${
                                    platform?.color || "text-gray-600"
                                  }`}
                                />
                              </div>
                              <span className="text-[9px] sm:text-[10px] text-gray-500 font-medium">
                                {domain}
                              </span>
                            </div>

                            <div className="flex items-center space-x-0.5 sm:space-x-1 sm:opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  openEditLinkModal(link);
                                }}
                                className="p-0.5 text-gray-400 hover:text-blue-600 border border-transparent hover:border-blue-200 hover:bg-blue-50 rounded transition-all duration-200"
                                title="Edit link"
                              >
                                <Edit3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              </button>
                              <button
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleDeleteLink(link.platform);
                                }}
                                disabled={isManagingLinks}
                                className="p-0.5 text-gray-400 hover:text-red-600 border border-transparent hover:border-red-200 hover:bg-red-50 rounded transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                                title="Delete link"
                              >
                                <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                              </button>
                            </div>
                          </div>

                          {/* Main URL Display */}
                          <div className="space-y-1 sm:space-y-1.5">
                            <h4 className="font-medium text-[10px] sm:text-xs text-gray-900 group-hover:text-blue-600 transition-colors duration-200 break-all">
                              {link.url}
                            </h4>
                          </div>

                          {/* Footer */}
                          <div className="flex items-center justify-between mt-2 pt-1.5 sm:pt-2 border-t border-gray-100">
                            <div className="flex items-center space-x-1">
                              <div
                                className={`w-4 h-4 sm:w-5 sm:h-5 ${
                                  platform?.bgColor || "bg-gray-100"
                                } rounded flex items-center justify-center`}
                              >
                                <IconComponent
                                  className={`h-2 w-2 sm:h-2.5 sm:w-2.5 ${
                                    platform?.color || "text-gray-600"
                                  }`}
                                />
                              </div>
                              <span className="text-[9px] sm:text-[10px] font-medium text-gray-700">
                                {platform?.name || link.platform}
                              </span>
                            </div>

                            <div className="flex items-center space-x-1 text-gray-400 group-hover:text-blue-500 transition-colors duration-200">
                              <ExternalLink className="h-2 w-2 sm:h-2.5 sm:w-2.5" />
                              <span className="text-[8px] sm:text-[9px] font-medium">
                                Visit
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Loading overlay */}
                      {isManagingLinks && (
                        <div className="absolute inset-0 bg-white/70 rounded-lg flex items-center justify-center">
                          <Loader2 className="h-3 w-3 sm:h-4 sm:w-4 animate-spin text-blue-600" />
                        </div>
                      )}
                    </motion.div>
                  );
                })}
              </div>
            ) : (
              /* Empty State */
              <div className="text-center py-3 sm:py-4">
                <div className="w-6 h-6 sm:w-8 sm:h-8 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-2">
                  <Link className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600" />
                </div>
                <h4 className="text-xs sm:text-sm font-semibold text-gray-900 mb-1">
                  No links added yet
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-600 mb-2 max-w-xs mx-auto">
                  Add your professional and social links to showcase your online
                  presence.
                </p>
                <button
                  onClick={openAddLinkModal}
                  className="text-[10px] sm:text-xs border border-blue-200 text-blue-600 px-2 py-1 sm:px-3 sm:py-1.5 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors font-medium"
                >
                  Add your first link
                </button>
              </div>
            )}

            {/* Quick Stats */}
            {userLinks.length > 0 && (
              <div className="mt-3 sm:mt-4 pt-2 sm:pt-3 border-t border-gray-200">
                <div className="flex items-center justify-between text-[10px] sm:text-xs text-gray-600">
                  <div className="flex items-center space-x-2 sm:space-x-3">
                    <span className="flex items-center">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-green-500 rounded-full mr-1"></div>
                      All active
                    </span>
                    <span className="flex items-center">
                      <div className="w-1 h-1 sm:w-1.5 sm:h-1.5 bg-blue-500 rounded-full mr-1"></div>
                      {userLinks.length} total
                    </span>
                  </div>
                  <button
                    onClick={() => {
                      userLinks.forEach((link) => {
                        window.open(link.url, "_blank");
                      });
                    }}
                    className="text-blue-600 hover:text-blue-800 font-medium transition-colors duration-200 border border-transparent hover:border-blue-200 px-1.5 py-0.5 rounded"
                  >
                    Open all
                  </button>
                </div>
              </div>
            )}
          </div>
        </motion.div>

        {/* AI Notice - Compact */}
        <motion.div
          className="mb-3 sm:mb-6 border border-purple-200 bg-gradient-to-r from-purple-50 via-blue-50 to-indigo-50 rounded-lg p-2.5 sm:p-4 relative overflow-hidden"
          variants={itemVariants}
        >
          {/* Smaller animated background elements */}
          <div className="absolute inset-0 overflow-hidden">
            <div className="absolute top-1 left-1/4 w-2 h-2 sm:w-3 sm:h-3 bg-purple-200/30 rounded-full animate-pulse delay-300"></div>
            <div className="absolute bottom-1 right-1/3 w-1.5 h-1.5 sm:w-2 sm:h-2 bg-blue-200/20 rounded-full animate-pulse delay-700"></div>
          </div>

          <div className="relative flex items-start space-x-2 sm:space-x-3">
            <div className="flex-shrink-0 mt-0.5">
              <Brain className="h-3 w-3 sm:h-4 sm:w-4 text-purple-600 animate-pulse" />
            </div>

            <div className="flex-1 min-w-0">
              <div className="flex items-center space-x-1.5 sm:space-x-2 mb-1.5 sm:mb-2">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800">
                  AI-Generated Preferences
                </h3>
                <div className="flex space-x-0.5 sm:space-x-1">
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-purple-500 rounded-full animate-pulse"></div>
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-blue-500 rounded-full animate-pulse delay-200"></div>
                  <div className="w-0.5 h-0.5 sm:w-1 sm:h-1 bg-indigo-500 rounded-full animate-pulse delay-400"></div>
                </div>
              </div>

              <p className="text-[10px] sm:text-xs text-gray-600 leading-relaxed">
                These preferences are automatically extracted from your uploaded
                resumes and are used to personalize your email generation.
              </p>
            </div>

            <div className="flex-shrink-0">
              <Sparkles className="h-3 w-3 sm:h-4 sm:w-4 text-blue-600 animate-pulse delay-500" />
            </div>
          </div>
        </motion.div>

        {/* Header - Compact */}
        <motion.div className="mb-3 sm:mb-6" variants={itemVariants}>
          <h1 className="text-lg sm:text-xl font-semibold text-gray-800 mb-1 flex items-center">
            <Settings className="h-4 w-4 sm:h-5 sm:w-5 mr-1.5 sm:mr-2 text-blue-600" />
            User Preferences
          </h1>
          <div className="flex flex-col sm:flex-row sm:items-center sm:space-x-4 space-y-0.5 sm:space-y-0 text-[10px] sm:text-xs text-gray-600">
            <span className="flex items-center">
              <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              {preferences.aggregated.totalRecords} Records
            </span>
            <span className="flex items-center">
              <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1" />
              Updated{" "}
              {new Date(
                preferences.aggregated.lastUpdated
              ).toLocaleDateString()}
            </span>
          </div>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {/* Records Sidebar - NOW MOVED TO TOP ON MOBILE */}
          <motion.div
            className="lg:col-span-1 order-1 lg:order-1"
            variants={itemVariants}
          >
            <div className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 relative overflow-hidden">
              <div className="absolute top-1 right-1 w-3 h-3 sm:w-6 sm:h-6 rounded-full bg-gradient-to-br from-blue-200/20 to-purple-200/15 blur-md"></div>

              <h3 className="text-xs sm:text-sm font-semibold mb-2 sm:mb-3 flex items-center text-gray-800">
                <Layers className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-gray-600" />
                Preference Records
              </h3>
              <div className="space-y-1.5 sm:space-y-2 max-h-48 sm:max-h-64 lg:max-h-96 overflow-y-auto">
                {preferences.records.map((record, index) => (
                  <button
                    key={record._id}
                    onClick={() => setSelectedRecord(index)}
                    className={`w-full text-left p-2 sm:p-3 rounded-lg transition-all duration-200 relative overflow-hidden ${
                      selectedRecord === index
                        ? "bg-blue-50 border border-blue-200 shadow-sm"
                        : "bg-gray-50 hover:bg-gray-100 border border-gray-100 hover:border-gray-200"
                    }`}
                  >
                    {selectedRecord === index && (
                      <div className="absolute top-0.5 right-0.5 w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-gradient-to-br from-blue-400 to-purple-400 opacity-60"></div>
                    )}
                    <div className="font-medium text-[10px] sm:text-xs text-gray-900 truncate">
                      {renderPreferenceTitle(record.preferences) || "Untitled"}
                    </div>
                    <div className="text-[10px] sm:text-xs text-gray-500 mt-0.5 sm:mt-1 flex items-center">
                      <Calendar className="h-2 w-2 mr-0.5 sm:mr-1" />
                      {new Date(record.createdAt).toLocaleDateString()}
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </motion.div>

          {/* Main Content - NOW COMES AFTER RECORDS ON MOBILE */}
          <div className="lg:col-span-3 order-2 lg:order-2 space-y-3 sm:space-y-4">
            {/* Current Record Details - Compact */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-2 right-2 w-4 h-4 sm:w-8 sm:h-8 rounded-full bg-gradient-to-br from-green-200/20 to-blue-200/15 blur-lg"></div>

              <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start mb-3 sm:mb-4 space-y-2 sm:space-y-0">
                <h2 className="text-sm sm:text-lg font-semibold text-gray-900 flex items-center flex-1">
                  <Target className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-blue-600 flex-shrink-0" />
                  <button
                    onClick={() => setShowTitleRestrictionModal(true)}
                    className="text-left hover:text-blue-600 transition-colors cursor-pointer truncate"
                    title="Click to learn why this cannot be edited"
                  >
                    {renderPreferenceTitle(currentRecord.preferences) ||
                      "Untitled Preference"}
                  </button>
                  <Lock className="h-2.5 w-2.5 sm:h-3 sm:w-3 ml-1.5 sm:ml-2 text-gray-400 flex-shrink-0" />
                </h2>

                <div className="flex flex-col sm:flex-row items-start sm:items-center space-y-1.5 sm:space-y-0 sm:space-x-2">
                  <span className="text-[10px] sm:text-xs text-gray-500 bg-gray-100 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full whitespace-nowrap">
                    Record {selectedRecord + 1} of {preferences.records.length}
                  </span>

                  {isEditing ? (
                    <div className="flex space-x-1.5 sm:space-x-2">
                      <button
                        onClick={savePreferences}
                        disabled={isSaving}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors text-[10px] sm:text-xs flex items-center space-x-1 disabled:opacity-50"
                      >
                        {isSaving ? (
                          <>
                            <Loader2 className="h-2.5 w-2.5 sm:h-3 sm:w-3 animate-spin" />
                            <span>Saving...</span>
                          </>
                        ) : (
                          <>
                            <Save className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                            <span>Save</span>
                          </>
                        )}
                      </button>
                      <button
                        onClick={cancelEditing}
                        className="px-2 py-1 sm:px-3 sm:py-1.5 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors text-[10px] sm:text-xs flex items-center space-x-1"
                      >
                        <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        <span>Cancel</span>
                      </button>
                    </div>
                  ) : (
                    <button
                      onClick={startEditing}
                      className="px-2 py-1 sm:px-3 sm:py-1.5 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-[10px] sm:text-xs flex items-center space-x-1"
                    >
                      <Edit3 className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Edit</span>
                    </button>
                  )}
                </div>
              </div>

              {/* Summary - Compact */}
              <div className="mb-3 sm:mb-5">
                <h3 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 flex items-center">
                  <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                  Summary
                </h3>
                {isEditing ? (
                  <textarea
                    value={editData.summary || ""}
                    onChange={(e) =>
                      setEditData((prev) => ({
                        ...prev,
                        summary: e.target.value,
                      }))
                    }
                    className="w-full border border-gray-300 rounded-lg p-2 sm:p-3 text-[10px] sm:text-xs text-gray-700 resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    rows={10}
                    placeholder="Enter your professional summary"
                  />
                ) : (
                  <p className="text-[10px] sm:text-xs text-gray-700 leading-relaxed bg-gray-50 p-2 sm:p-3 rounded-lg">
                    {currentRecord.summary || "No summary provided"}
                  </p>
                )}
              </div>

              {/* Skills - Compact */}
              <div className="mb-3 sm:mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-1.5 sm:space-y-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center">
                    <Code className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                    Skills (
                    {isEditing
                      ? (editData.skills || []).length
                      : (currentRecord.skills || []).length}
                    )
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowSkillsModal(true)}
                      className="text-[10px] sm:text-xs bg-blue-100 text-blue-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full hover:bg-blue-200 transition-colors flex items-center space-x-1 self-start sm:self-auto"
                    >
                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Add Skills</span>
                    </button>
                  )}
                </div>
                <div className="flex flex-wrap gap-1 sm:gap-1.5">
                  {(isEditing
                    ? editData.skills || []
                    : currentRecord.skills || []
                  ).map((skill, index) => (
                    <span
                      key={index}
                      className={`px-1.5 py-0.5 sm:px-2 sm:py-1 bg-blue-100 text-blue-800 rounded-full text-[10px] sm:text-xs font-medium ${
                        isEditing ? "flex items-center space-x-1" : ""
                      }`}
                    >
                      <span>{skill}</span>
                      {isEditing && (
                        <button
                          onClick={() => removeSkill(index)}
                          className="ml-0.5 sm:ml-1 text-red-500 hover:text-red-700"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </span>
                  ))}
                </div>
              </div>

              {/* Projects - Compact */}
              <div className="mb-3 sm:mb-5">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-2 sm:mb-3 space-y-1.5 sm:space-y-0">
                  <h3 className="text-xs sm:text-sm font-semibold text-gray-800 flex items-center">
                    <FolderOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                    Projects (
                    {isEditing
                      ? (editData.projects || []).length
                      : (currentRecord.projects || []).length}
                    )
                  </h3>
                  {isEditing && (
                    <button
                      onClick={() => setShowProjectsModal(true)}
                      className="text-[10px] sm:text-xs bg-green-100 text-green-600 px-1.5 py-0.5 sm:px-2 sm:py-1 rounded-full hover:bg-green-200 transition-colors flex items-center space-x-1 self-start sm:self-auto"
                    >
                      <Plus className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                      <span>Add Projects</span>
                    </button>
                  )}
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5 sm:gap-2">
                  {(isEditing
                    ? editData.projects || []
                    : currentRecord.projects || []
                  ).map((project, index) => (
                    <div
                      key={index}
                      className={`p-1.5 sm:p-2 bg-green-50 border border-green-200 rounded-lg ${
                        isEditing ? "flex items-center justify-between" : ""
                      }`}
                    >
                      <div className="font-medium text-[10px] sm:text-xs text-green-800 flex-1">
                        {project}
                      </div>
                      {isEditing && (
                        <button
                          onClick={() => removeProject(index)}
                          className="ml-1.5 sm:ml-2 text-red-500 hover:text-red-700 flex-shrink-0"
                        >
                          <X className="h-2.5 w-2.5 sm:h-3 sm:w-3" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
              </div>

              {/* Metadata - Compact */}
              <div className="pt-2 sm:pt-3 border-t border-gray-200">
                <div className="flex flex-col sm:flex-row sm:justify-between text-[10px] sm:text-xs text-gray-500 space-y-0.5 sm:space-y-0">
                  <span className="flex items-center">
                    <Calendar className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    Created:{" "}
                    {new Date(currentRecord.createdAt).toLocaleDateString()}
                  </span>
                  <span className="flex items-center">
                    <RefreshCw className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-0.5 sm:mr-1" />
                    Updated:{" "}
                    {new Date(currentRecord.updatedAt).toLocaleDateString()}
                  </span>
                </div>
              </div>
            </motion.div>

            {/* Aggregated Data - Compact */}
            <motion.div
              className="bg-white border border-gray-200 rounded-lg p-2.5 sm:p-4 relative overflow-hidden"
              variants={itemVariants}
            >
              <div className="absolute top-2 right-2 w-5 h-5 sm:w-10 sm:h-10 rounded-full bg-gradient-to-br from-purple-200/20 to-pink-200/15 blur-xl"></div>

              <h3 className="text-sm sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4 flex items-center">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4 mr-1.5 sm:mr-2 text-purple-600" />
                Aggregated Overview
              </h3>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-3 sm:gap-5">
                {/* All Unique Skills - Compact */}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                    <Code className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                    All Unique Skills ({preferences.aggregated.allSkills.length}
                    )
                  </h4>
                  <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50/50">
                    <div className="flex flex-wrap gap-0.5 sm:gap-1">
                      {preferences.aggregated.allSkills.map((skill, index) => (
                        <span
                          key={index}
                          className="px-1.5 py-0.5 sm:px-2 sm:py-0.5 bg-gray-200 text-gray-700 rounded text-[10px] sm:text-xs"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* All Projects - Compact */}
                <div>
                  <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-2 sm:mb-3 flex items-center">
                    <FolderOpen className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                    All Projects ({preferences.aggregated.allProjects.length})
                  </h4>
                  <div className="max-h-32 sm:max-h-40 overflow-y-auto border border-gray-100 rounded-lg p-2 sm:p-3 bg-gray-50/50 space-y-1 sm:space-y-1.5">
                    {preferences.aggregated.allProjects.map(
                      (project, index) => (
                        <div
                          key={index}
                          className="p-1.5 sm:p-2 bg-white rounded text-[10px] sm:text-xs text-gray-700 border border-gray-200"
                        >
                          {project}
                        </div>
                      )
                    )}
                  </div>
                </div>
              </div>

              {/* Latest Summary - Compact */}
              <div className="mt-3 sm:mt-5">
                <h4 className="text-xs sm:text-sm font-semibold text-gray-800 mb-1.5 sm:mb-2 flex items-center">
                  <FileText className="h-2.5 w-2.5 sm:h-3 sm:w-3 mr-1 text-gray-600" />
                  Latest Summary
                </h4>
                <p className="text-[10px] sm:text-xs text-gray-700 bg-gradient-to-r from-gray-50 to-blue-50/30 p-2 sm:p-3 rounded-lg border border-gray-200">
                  {preferences.aggregated.latestSummary ||
                    "No summary available"}
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default PrefPage;
