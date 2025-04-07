
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
        
        <div className="mt-8 max-w-2xl w-full">
          <div className="bg-sky-50 border border-sky-100 rounded-lg p-4">
            <h3 className="font-medium text-sky-800 mb-2">Come funziona la registrazione per i ristoranti?</h3>
            <ol className="list-decimal pl-5 space-y-2 text-sky-700">
              <li>Completa il form di registrazione con i tuoi dati personali e informazioni di base sul ristorante</li>
              <li>Registra un metodo di pagamento (gratuito durante il programma pilota)</li>
              <li>Accedi alla tua dashboard per ristoratori</li>
              <li>Completa e personalizza la pagina del tuo ristorante aggiungendo:
                <ul className="list-disc pl-5 mt-1 text-sky-600">
                  <li>Menu completo (in formato interattivo o PDF)</li>
                  <li>Fotografie del locale e dei piatti</li>
                  <li>Videoricette e contenuti multimediali</li>
                  <li>Orari di apertura dettagliati</li>
                  <li>Descrizioni dei piatti e altre informazioni</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      </div>
    </Layout>
  );
};

export default Register;
