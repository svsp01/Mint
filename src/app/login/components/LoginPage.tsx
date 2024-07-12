import React from 'react';
import { useDispatch } from 'react-redux';
import { login } from '@/redux/features/userSlice';
import { useRouter } from 'next/navigation';

const LoginPage: React.FC = () => {
  const dispatch = useDispatch();
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    
    dispatch(login({
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    }));
    
    router.push('/dashboard');
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
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
      <button
        type="submit"
        className="w-full bg-blue-600 text-white p-2 rounded hover:bg-blue-700 transition-colors"
      >
        Sign In
      </button>
    </form>
  );
};

export default LoginPage;
