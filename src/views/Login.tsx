import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useAuth } from '../components/System/AuthContext';

interface LoginProps {
  onSuccess: () => void;
}

export default function Login({ onSuccess }: LoginProps) {
  const { isAuthenticated, sendLink } = useAuth();
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [sent, setSent] = useState(false);
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
    const result = await sendLink(cleanEmail);

    if (result.success) {
      setSent(true);
    } else {
      setError(result.error || 'Failed to send login link');
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
        <AnimatePresence mode="wait">
          {!sent ? (
            <motion.div
              key="form"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <h1 className="text-3xl font-bold text-white text-center">Sign In</h1>
              <p className="text-gray-500 text-center mt-2 mb-10">We'll email you a login link</p>

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

                {error && (
                  <p className="text-red-400 text-sm text-center">{error}</p>
                )}

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full py-3 bg-white text-black font-medium rounded-full hover:bg-gray-200 disabled:opacity-40 transition-all"
                >
                  {isLoading ? 'Sending...' : 'Continue'}
                </button>
              </form>
            </motion.div>
          ) : (
            <motion.div
              key="sent"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center"
            >
              <h1 className="text-3xl font-bold text-white">Check Your Email</h1>
              <p className="text-gray-500 mt-2 mb-10">
                Login link sent to <span className="text-white">{email}</span>
              </p>

              <button
                onClick={() => { setSent(false); setError(''); }}
                className="px-6 py-2.5 bg-white/10 text-gray-300 text-sm font-medium rounded-full hover:bg-white/15 transition-all"
              >
                Use a different email
              </button>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
