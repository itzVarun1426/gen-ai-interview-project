import { useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { useAuth } from '../hooks/useAuth.js';
import { motion } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { GoogleLogin } from '@react-oauth/google';
import ThemeToggle from '../../../components/ThemeToggle';

const Login = () => {
  const navigate = useNavigate();
  const { loading, handleLogin, handleGoogleLogin, authError } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await handleLogin({ email, password });
    if (success) {
      navigate("/dashboard");
    }
  };

  if (loading) {
    return (
      <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center transition-colors">
        <div className="flex flex-col items-center gap-4">
          <div className="w-12 h-12 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          <p className="font-inter text-slate-500 dark:text-slate-400 font-medium text-sm">Signing in...</p>
        </div>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center p-6 relative overflow-hidden font-inter transition-colors duration-300">
      {/* Theme Toggle Positioned */}
      <div className="absolute top-8 right-8 z-20">
        <ThemeToggle />
      </div>

      {/* Background Decor */}
      <div className="absolute inset-0 z-0 pointer-events-none">
         <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-primary/5 dark:bg-primary/10 rounded-full blur-[100px]"></div>
      </div>

      <motion.div 
        initial={{ y: 20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="w-full max-w-md relative z-10 space-y-8"
      >
        <div className="text-center space-y-2">
          <div className="flex justify-center mb-6">
             <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center text-white font-bold text-2xl shadow-soft">
                i
             </div>
          </div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
            Welcome Back
          </h1>
          <p className="text-sm text-slate-500 dark:text-slate-400">Sign in to your account</p>
        </div>

        <div className="bg-white dark:bg-slate-900 p-8 rounded-2xl shadow-soft border border-slate-100 dark:border-slate-800 transition-colors">
          <form onSubmit={handleSubmit} className="space-y-5">
            {authError && (
              <motion.div 
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                className="p-3 bg-red-50 dark:bg-red-900/20 border border-red-100 dark:border-red-900/30 rounded-lg text-red-600 dark:text-red-400 text-sm font-medium text-center shadow-sm"
              >
                Error: {authError}
              </motion.div>
            )}
            
            <div className="space-y-1.5">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Email Address</label>
              <input
                onChange={(e) => setEmail(e.target.value)}
                type="email"
                id="email"
                className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                placeholder="john@example.com"
                required
              />
            </div>
             <div className="space-y-1.5 relative">
              <label htmlFor="password" className="block text-sm font-medium text-slate-700 dark:text-slate-300">Password</label>
              <div className="relative">
                <input
                  onChange={(e) => setPassword(e.target.value)}
                  type={showPassword ? "text" : "password"}
                  id="password"
                  className="w-full bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 rounded-lg p-3 pr-10 text-sm text-slate-900 dark:text-slate-100 focus:border-primary focus:ring-1 focus:ring-primary outline-none transition-all placeholder:text-slate-400 dark:placeholder:text-slate-600"
                  placeholder="••••••••"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 transition-colors flex items-center justify-center p-1"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            <motion.button 
              whileHover={{ scale: 1.01 }}
              whileTap={{ scale: 0.99 }}
              className="w-full py-3.5 bg-primary hover:bg-primary-dim text-white font-semibold text-sm rounded-lg shadow-sm transition-all mt-2"
            >
              Sign In
            </motion.button>

            <div className="mt-6 flex flex-col items-center gap-4 w-full">
              <div className="flex items-center w-full">
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
                <span className="px-3 text-xs font-medium text-slate-400 uppercase tracking-wider">or continue with</span>
                <div className="flex-1 h-px bg-slate-200 dark:bg-slate-800"></div>
              </div>
              <div className="w-full flex justify-center">
                <GoogleLogin
                  onSuccess={async (credentialResponse) => {
                    const success = await handleGoogleLogin(credentialResponse.credential);
                    if (success) navigate("/dashboard");
                  }}
                  onError={() => {
                    console.error('Login Failed');
                  }}
                  theme="outline"
                  size="large"
                  text="signin_with"
                  shape="rectangular"
                />
              </div>
            </div>
          </form>

          <div className="mt-8 text-center">
            <p className="text-sm text-slate-600 dark:text-slate-400">
              Don't have an account?{" "}
              <Link to="/register" className="text-primary hover:text-primary-dim dark:hover:text-primary-bright font-bold transition-colors">
                Sign up
              </Link>
            </p>
          </div>
        </div>

        <div className="flex justify-center">
          <Link to="/" className="text-sm text-slate-500 hover:text-slate-800 transition-colors">
            Return to Home
          </Link>
        </div>
      </motion.div>
    </main>
  );
};

export default Login;
