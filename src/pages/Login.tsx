
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';
import { User, Store, LogIn } from 'lucide-react';
import { Eye, EyeOff } from 'lucide-react';

const Login = () => {
  const [userType, setUserType] = useState<'customer' | 'restaurant'>('customer');
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-500 to-[#bfe5c0]">
      <div className="bg-green-500 text-white p-4 flex items-center justify-center">
        <h1 className="text-xl font-bold flex items-center">
          <img src="/lovable-uploads/cb016c24-7700-4927-b5e2-40af08e4b219.png" alt="Logo" className="w-8 h-8 mr-2" />
          GlutenFree Eats
        </h1>
      </div>
      
      <div className="flex flex-col items-center justify-center p-6 pt-12">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center">
            <h1 className="text-4xl font-bold mb-4 text-slate-800">
              Accedi
            </h1>
            <p className="text-slate-700 mb-6 text-lg">
              Benvenuto su Gluten Free Eats
            </p>
          </div>
          
          <div className="flex mb-6 border rounded-lg overflow-hidden bg-white">
            <button
              className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                userType === 'customer' ? 'bg-white text-slate-800' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setUserType('customer')}
            >
              <User size={18} />
              <span>Cliente</span>
            </button>
            <button
              className={`flex-1 py-3 px-4 flex justify-center items-center gap-2 ${
                userType === 'restaurant' ? 'bg-white text-slate-800' : 'bg-gray-100 text-gray-600'
              }`}
              onClick={() => setUserType('restaurant')}
            >
              <Store size={18} />
              <span>Ristoratore</span>
            </button>
          </div>
          
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-center text-xl font-medium mb-1">
                Email
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path d="M2.003 5.884L10 9.882l7.997-3.998A2 2 0 0016 4H4a2 2 0 00-1.997 1.884z"></path>
                    <path d="M18 8.118l-8 4-8-4V14a2 2 0 002 2h12a2 2 0 002-2V8.118z"></path>
                  </svg>
                </div>
                <input 
                  id="email"
                  type="email" 
                  className="w-full p-4 pl-10 border border-gray-300 rounded-lg bg-white text-gray-900" 
                  placeholder="nome@esempio.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>
            
            <div>
              <div className="flex justify-between">
                <label htmlFor="password" className="block text-center text-xl font-medium mb-1">
                  Password
                </label>
                <a href="#" className="text-orange-500 hover:underline">
                  Password dimenticata?
                </a>
              </div>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg className="w-5 h-5 text-gray-500" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg">
                    <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd"></path>
                  </svg>
                </div>
                <input 
                  id="password"
                  type={showPassword ? "text" : "password"} 
                  className="w-full p-4 pl-10 border border-gray-300 rounded-lg bg-white text-gray-900" 
                  placeholder="••••••••"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <button 
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500"
                >
                  {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                </button>
              </div>
            </div>
          </div>
          
          <Button className="w-full py-3 h-auto text-base flex items-center justify-center space-x-2 bg-slate-800">
            <LogIn size={18} />
            <span>Accedi</span>
          </Button>
          
          <div className="mt-6">
            <div className="relative flex py-5 items-center">
              <div className="flex-grow border-t border-gray-300"></div>
              <span className="flex-shrink mx-4 text-gray-600">oppure</span>
              <div className="flex-grow border-t border-gray-300"></div>
            </div>
            
            <button className="w-full py-3 px-4 bg-white border border-gray-300 rounded-lg flex items-center justify-center space-x-2 text-base">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 48 48">
                <path fill="#FFC107" d="M43.611 20.083H42V20H24v8h11.303c-1.649 4.657-6.08 8-11.303 8c-6.627 0-12-5.373-12-12s5.373-12 12-12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C12.955 4 4 12.955 4 24s8.955 20 20 20s20-8.955 20-20c0-1.341-.138-2.65-.389-3.917z" />
                <path fill="#FF3D00" d="m6.306 14.691l6.571 4.819C14.655 15.108 18.961 12 24 12c3.059 0 5.842 1.154 7.961 3.039l5.657-5.657C34.046 6.053 29.268 4 24 4C16.318 4 9.656 8.337 6.306 14.691z" />
                <path fill="#4CAF50" d="M24 44c5.166 0 9.86-1.977 13.409-5.192l-6.19-5.238A11.91 11.91 0 0 1 24 36c-5.202 0-9.619-3.317-11.283-7.946l-6.522 5.025C9.505 39.556 16.227 44 24 44z" />
                <path fill="#1976D2" d="M43.611 20.083H42V20H24v8h11.303a12.04 12.04 0 0 1-4.087 5.571l.003-.002l6.19 5.238C36.971 39.205 44 34 44 24c0-1.341-.138-2.65-.389-3.917z" />
              </svg>
              <span>Accedi con Google</span>
            </button>
          </div>
          
          <div className="text-center mt-6">
            <p className="text-gray-700">
              Non hai un account? 
              <Link to="/register" className="ml-1 text-orange-500 hover:underline">
                Registrati
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
