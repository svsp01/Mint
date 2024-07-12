'use client'
import React from 'react';
import { useDispatch } from 'react-redux';
import { signup } from '@/app/redux/features/userSlice';
import { useRouter } from 'next/navigation';

const SignupPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <input
        type="text"
        name="username"
        placeholder="Username"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="email"
        name="email"
        placeholder="Email"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="password"
        name="password"
        placeholder="Password"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        name="firstName"
        placeholder="First Name"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="text"
        name="lastName"
        placeholder="Last Name"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="tel"
        name="phoneNumber"
        placeholder="Phone Number"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="number"
        name="monthlyIncome"
        placeholder="Monthly Income"
        required
        className="w-full p-2 border border-gray-300 rounded"
      />
      <input
        type="url"
        name="profileImageUrl"
        placeholder="Profile Image URL"
        className="w-full p-2 border border-gray-300 rounded"
      />
      <textarea
        name="bio"
        placeholder="Short bio"
        className="w-full p-2 border border-gray-300 rounded"
      ></textarea>
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
      >
        Sign Up
      </button>
    </form>
  );
};

export default SignupPage;
