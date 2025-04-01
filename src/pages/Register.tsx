
import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/Authentication/RegisterForm';

const Register = () => {
  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex items-center justify-center px-4 py-12">
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
