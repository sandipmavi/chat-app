import React from "react";
import "../index.css";
import logo from "../assets/logo.png";
import { Link } from "react-router-dom";

function LandingPage() {
  return (
    <div className="bg-teal-50 min-h-screen text-gray-800 font-sans">
      {/* Header */}
      <header className="bg-teal-500 sm:text-10px text-white shadow-md py-4 px-6 gap-2 items-center justify-between flex flex-col sm:flex-row">
        <div className="p-1 bg-white rounded-full shadow-md ">
          <img
            src={logo}
            alt="App Logo"
            className="h-10 rounded-full object-cover"
          />
        </div>
        <nav className="space-x-4 font-semibold text-[18px]  ">
          <Link
            to={"/login"}
            className="h-10 rounded-full text-gray-600  bg-white px-4 py-2 shadow-md hover:text-gray-800"
          >
            Home
          </Link>
          <button className=" h-10 rounded-full text-gray-600  bg-white px-4 py-2 shadow-md hover:text-gray-800">
            About
          </button>
          <Link
            to={"/email"}
            className=" h-10 rounded-full text-gray-600  bg-white px-4 py-2 shadow-md hover:text-gray-800"
          >
            Login
          </Link>
        </nav>
      </header>

      {/* Hero Section */}
      <section className="py-20 px-6 text-center bg-gradient-to-br from-teal-300 to-teal-100">
        <h2 className="text-4xl md:text-5xl font-bold mb-4">
          Connect, Chat, and Collaborate
        </h2>
        <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto">
          Welcome to ChatConnect — your hub for seamless communication. Join now
          and start your journey.
        </p>
        <Link
          className="bg-white text-teal-600 px-6 py-3 rounded-full shadow hover:bg-teal-600 hover:text-white transition"
          to={"/register"}
        >
          Get Started
        </Link>
      </section>

      {/* Features */}
      <section className="py-16 px-6 bg-white text-center">
        <h3 className="text-3xl font-semibold mb-12">Features</h3>
        <div className="grid md:grid-cols-3 gap-8 max-w-5xl mx-auto">
          <div className="p-6 bg-teal-100 rounded-lg shadow">
            <h4 className="text-xl font-bold mb-2">Real-time Messaging</h4>
            <p>Instant messaging with smart notifications.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h4 className="text-xl font-bold mb-2 text-teal-500">
              Group Chatting <span className="text-sm">(Coming Soon)</span>
            </h4>
            <p>Chat with multiple users in dynamic group spaces.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h4 className="text-xl font-bold mb-2 text-teal-500">
              Video Calling <span className="text-sm">(Coming Soon)</span>
            </h4>
            <p>Face-to-face communication through live video chat.</p>
          </div>
          <div className="p-6 bg-gray-100 rounded-lg shadow">
            <h4 className="text-xl font-bold mb-2 text-teal-500">
              Premium Features <span className="text-sm">(Coming Soon)</span>
            </h4>
            <p>Unlock additional tools and customization options.</p>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-teal-500 text-white py-4 text-center text-sm">
        © 2025 ChatConnect. All rights reserved.
      </footer>
    </div>
  );
}

export default LandingPage;
