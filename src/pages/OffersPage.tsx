
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import Layout from '@/components/Layout';

const OffersPage = () => {
  return (
    <Layout>
      <div className="container mx-auto py-6">
        <Card className="border-none shadow-md">
          <CardHeader className="bg-green-50">
            <CardTitle className="text-2xl font-bold text-green-800">Offerte Speciali</CardTitle>
          </CardHeader>
          <CardContent className="pt-6">
            <div className="text-center py-10">
              <p className="text-gray-500 mb-4">
                Al momento non ci sono offerte speciali disponibili.
              </p>
              <p className="text-sm text-gray-400">
                Controlla più tardi per nuove offerte dai nostri ristoranti senza glutine.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default OffersPage;
