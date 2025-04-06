
import React from 'react';
import Layout from '@/components/Layout';
import RegisterForm from '@/components/Authentication/RegisterForm';

const Register = () => {
  return (
    <Layout hideNavigation>
      <div className="min-h-screen flex flex-col items-center justify-center px-4 py-12 bg-gradient-to-b from-white to-gray-50">
        <div className="mb-6 text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Partecipa al Programma Pilota</h1>
          <p className="text-gray-600 max-w-md">
            Registrati gratuitamente alla fase pilota per i prossimi 6 mesi. 
            Approfitta di tutte le funzionalità senza costi durante questo periodo iniziale.
          </p>
        </div>
        <RegisterForm />
      </div>
    </Layout>
  );
};

export default Register;
