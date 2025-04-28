
import React from 'react';
import Layout from '@/components/Layout';
import LoginForm from '@/components/Authentication/LoginForm';
import AppDescriptionDocument from '@/components/AppDescriptionDocument';

const Login = () => {
  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12">
        <AppDescriptionDocument />
        <div className="mt-8 w-full max-w-md">
          <LoginForm />
        </div>
      </div>
    </Layout>
  );
};

export default Login;
