import React from 'react';

const TestPage = () => {
  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-4xl font-bold text-center text-blue-600 mb-8">
        Página de Prueba
      </h1>
      <div className="bg-white rounded-lg shadow-lg p-6 max-w-md mx-auto">
        <h2 className="text-2xl font-semibold text-gray-800 mb-4">
          ¿Puedes ver esto?
        </h2>
        <p className="text-gray-600">
          Si puedes ver esta página, entonces React está funcionando correctamente.
        </p>
        <button className="mt-4 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600">
          Botón de Prueba
        </button>
      </div>
    </div>
  );
};

export default TestPage;
