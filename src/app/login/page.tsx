'use client'
import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { login, signup } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';

const AuthPage: React.FC = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [step, setStep] = useState(1);
  const dispatch = useDispatch();
  const router = useRouter();

  const handleLogin = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dispatch(login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }));
    router.push('/dashboard');
  };

  const handleSignup = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    dispatch(signup({
      username: formData.get('username') as string,
      email: formData.get('email') as string,
      firstName: formData.get('firstName') as string,
      lastName: formData.get('lastName') as string,
      password: formData.get('password') as string,
      phoneNumber: formData.get('phoneNumber') as string,
      monthlyIncome: Number(formData.get('monthlyIncome')),
      profileImageUrl: formData.get('profileImageUrl') as string,
      bio: formData.get('bio') as string,
    }));
    router.push('/dashboard');
  };

  const renderLoginForm = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleLogin}
      className="space-y-4"
    >
      <div className="relative">
        <input
          type="email"
          name="email"
          placeholder="Email"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <i className="fas fa-envelope absolute top-4 right-4 text-gray-400"></i>
      </div>
      <div className="relative">
        <input
          type="password"
          name="password"
          placeholder="Password"
          required
          className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
        />
        <i className="fas fa-lock absolute top-4 right-4 text-gray-400"></i>
      </div>
      <button
        type="submit"
        className="w-full bg-blue-500 text-white p-4 rounded-lg hover:from-blue-600 hover:to-purple-700 transition-all transform hover:scale-105"
      >
        Sign In
      </button>
    </motion.form>
  );

  const renderSignupForm = () => (
    <motion.form
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      onSubmit={handleSignup}
      className="space-y-4"
    >
      {step === 1 && (
        <>
          <input
            type="text"
            name="username"
            placeholder="Username"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="email"
            name="email"
            placeholder="Email"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </>
      )}
      {step === 2 && (
        <>
          <input
            type="text"
            name="firstName"
            placeholder="First Name"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="text"
            name="lastName"
            placeholder="Last Name"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="tel"
            name="phoneNumber"
            placeholder="Phone Number"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
        </>
      )}
      {step === 3 && (
        <>
          <input
            type="number"
            name="monthlyIncome"
            placeholder="Monthly Income"
            required
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <input
            type="url"
            name="profileImageUrl"
            placeholder="Profile Image URL"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          />
          <textarea
            name="bio"
            placeholder="Short bio"
            className="w-full p-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
          ></textarea>
        </>
      )}
      {step < 3 ? (
        <button
          type="button"
          onClick={() => setStep(step + 1)}
          className="w-full bg-blue-500 text-white p-4 rounded-lg hover:from-green-500 hover:to-blue-600 transition-all transform hover:scale-105"
        >
          Next
        </button>
      ) : (
        <button
          type="submit"
          className="w-full bg-blue-500 text-white p-4 rounded-lg hover:from-purple-600 hover:to-pink-600 transition-all transform hover:scale-105"
        >
          Sign Up
        </button>
      )}
    </motion.form>
  );

  return (
    <div className="min-h-screen bg-blue-600 flex items-center justify-center p-4">
      <div className="bg-white p-8 rounded-2xl shadow-2xl w-full max-w-md">
        <h2 className="text-3xl font-bold mb-6 text-center bg-clip-text text-transparent bg-blue-600">
          {isLogin ? 'Welcome Back!' : 'Join Us Today'}
        </h2>
        {isLogin ? renderLoginForm() : renderSignupForm()}
        <p className="mt-6 text-center text-gray-600">
          {isLogin ? "Don't have an account?" : "Already have an account?"}
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setStep(1);
            }}
            className="ml-1 text-blue-600 hover:underline font-semibold"
          >
            {isLogin ? 'Sign Up' : 'Sign In'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default AuthPage;