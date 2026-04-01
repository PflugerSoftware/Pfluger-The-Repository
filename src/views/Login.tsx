import { useState } from 'react';
import { motion } from 'framer-motion';
import { useAuth } from '../components/System/AuthContext';

interface LoginProps {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { isAuthenticated, login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  if (isAuthenticated) {
    onSuccess();
    return null;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    const cleanEmail = email.toLowerCase().trim();

    if (!cleanEmail.endsWith('@pflugerarchitects.com')) {
      setError('Please use your Pfluger Architects email');
      return;
    }

    setIsLoading(true);
    const success = await login(cleanEmail, password);

    if (!success) {
      setError('Invalid email or password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-[calc(100vh-5rem)] flex items-center justify-center bg-background px-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
        className="w-full max-w-sm"
      >
        <h1 className="text-3xl font-bold text-white text-center">Sign In</h1>
        <p className="text-gray-500 text-center mt-2 mb-10">Pfluger Research Team</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 transition-colors text-center"
            placeholder="you@pflugerarchitects.com"
            required
            autoComplete="email"
            autoFocus
          />

          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-4 py-3 bg-transparent border-b border-gray-700 text-white placeholder-gray-600 focus:outline-none focus:border-sky-500 transition-colors text-center"
            placeholder="Password"
            required
            autoComplete="current-password"
          />

          {error && (
            <p className="text-red-400 text-sm text-center">{error}</p>
          )}

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 disabled:opacity-40 transition-all"
          >
            {isLoading ? 'Signing in...' : 'Sign In'}
          </button>
        </form>
      </motion.div>
    </div>
  );
}
