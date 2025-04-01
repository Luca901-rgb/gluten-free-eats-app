
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/Authentication/LoginForm';

const Login = () => {
  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <LoginForm />
      </div>
    </Layout>
  );
};

export default Login;
