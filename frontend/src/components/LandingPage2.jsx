import { motion } from "framer-motion";
import { Button } from "../components/ui/button";
import { MessageSquareMore, X } from "lucide-react";
import { useContext } from "react";
import { AppContext } from "@/context/AppContext";
import { CheckEmail } from "@/pages/CheckEmail";
import { RegisterPage } from "@/pages/RegisterPage";
import AccentPicker from "./AccentPicker";
import { ThemeContext } from "@/context/ThemeContext";

export default function LandingPage() {
  const { showLogin, setShowLogin } = useContext(AppContext);
  const { accent } = useContext(ThemeContext);

  return (
    <motion.div className="relative min-h-screen flex flex-col items-center justify-between bg-white text-black overflow-hidden">
      {/* Header */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.8 }}
        className="w-full flex justify-between items-center px-8 py-4 backdrop-blur-sm bg-white/10"
      >
        <div className="flex items-center gap-1">
          <MessageSquareMore size={40} color={accent} />
          <h1
            className="text-2xl font-bold tracking-wide"
            style={{ color: "var(--accent)" }}
          >
            ChatS
          </h1>
        </div>

        <nav className="hidden md:flex space-x-8 text-lg">
          <a href="#features" className="hover:text-[var(--accent)]">
            Features
          </a>
          <a href="#ai" className="hover:text-[var(--accent)]">
            AI
          </a>
          <a href="#community" className="hover:text-[var(--accent)]">
            Community
          </a>
          <AccentPicker />
        </nav>

        <div className="space-x-2">
          <Button
            onClick={() => setShowLogin("register")}
            className="bg-[var(--accent)] text-black font-semibold rounded-xl py-4 px-6 hover:opacity-80"
          >
            Get Started
          </Button>
          <Button
            onClick={() => setShowLogin("login")}
            className="bg-[var(--accent)] text-black font-semibold rounded-xl py-4 px-6 hover:opacity-80"
          >
            Login
          </Button>
        </div>
      </motion.header>

      {/* Hero Section */}
      <main className="flex flex-col lg:flex-row items-center justify-between w-full px-8 lg:px-20 mt-12">
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.8 }}
          className="lg:w-1/2 space-y-6"
        >
          <h2 className="text-5xl lg:text-6xl font-extrabold leading-tight">
            Connect, Collaborate,{" "}
            <span className="text-[var(--accent)]">Communicate</span>
          </h2>
          <p className="text-lg lg:text-xl text-gray-700">
            Experience next-gen real-time chat with AI-powered insights, secure
            conversations, and vibrant communities.
          </p>
          <div className="space-x-4">
            <Button
              onClick={() => setShowLogin("register")}
              className="bg-[var(--accent)] text-black font-semibold rounded-xl px-6 py-2 hover:opacity-80"
            >
              Try Now
            </Button>
            <Button
              variant="outline"
              className="border border-[var(--accent)] text-[var(--accent)] rounded-xl px-6 py-3 hover:bg-[var(--accent)] hover:text-white"
            >
              Learn More
            </Button>
          </div>
        </motion.div>

        {/* Chat Mockup */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 1 }}
          className="mt-12 lg:mt-0 lg:w-1/2 flex justify-center"
        >
          <div className="bg-black rounded-3xl shadow-2xl w-[280px] h-[520px] p-4 relative">
            <div className="bg-gray-200 rounded-full w-16 h-2 mx-auto mb-4"></div>
            <div className="space-y-4">
              <div className="bg-[var(--accent-light)] text-[var(--accent)] rounded-xl p-3 w-3/4">
                Hey! Welcome to ChatS 🚀
              </div>
              <div className="bg-gray-200 text-gray-800 rounded-xl p-3 w-2/3 ml-auto">
                Thanks! Excited to try it out 🎉
              </div>
              <div className="bg-[var(--accent-light)] text-[var(--accent)] rounded-xl p-3 w-2/3">
                Don’t forget to check the AI assistant 🤖
              </div>
            </div>
          </div>
        </motion.div>
      </main>

      <footer
        className="w-full text-center py-6 bg-white/10 mt-12 text-sm"
        style={{
          boxShadow:
            "0 -4px 6px -1px rgba(0,0,0,0.1), 0 -2px 4px -1px rgba(0,0,0,0.06)",
        }}
      >
        © {new Date().getFullYear()} ChatS. All rights reserved.
      </footer>

      {showLogin && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-md">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="relative bg-white rounded-2xl shadow-xl w-full max-w-md p-6"
          >
            <button
              onClick={() => setShowLogin(false)}
              className="absolute top-2 right-3 text-gray-600 hover:text-gray-900"
            >
              <X size={24} />
            </button>
            {showLogin === "login" && <CheckEmail />}
            {showLogin === "register" && <RegisterPage />}
          </motion.div>
        </div>
      )}
    </motion.div>
  );
}
