import React from 'react';


function Home({ setSecaoAtiva, setActiveTab }) { 
  const handleNavigateToCalculator = (tabName) => {
    setSecaoAtiva('calculadora'); 
    setActiveTab(tabName);
  };

  return (
    <div className="text-center p-8 bg-white rounded-xl shadow-2xl w-full max-w-3xl border-t-4 border-indigo-500">
      <h2 className="text-4xl font-extrabold text-blue-800 mb-6">Bem-vindo à Calculadora Financeira!</h2>
      <p className="text-lg text-gray-700 mb-8 max-w-2xl mx-auto">
        Sua ferramenta completa para simulações financeiras. Calcule juros compostos, planeje a amortização de empréstimos e compare investimentos versus empréstimos de forma intuitiva e visual.
      </p>
      <div className="space-y-4 md:space-y-0 md:space-x-4 flex flex-col md:flex-row justify-center">
        <button
          onClick={() => handleNavigateToCalculator('jurosCompostos')} // Usando o nome da aba como em App.js
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Calcular Juros Compostos
        </button>
        <button
          onClick={() => handleNavigateToCalculator('amortizacao')} // Usando o nome da aba como em App.js
          className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Calcular Amortização
        </button>
        <button
          onClick={() => handleNavigateToCalculator('comparacao')} // Usando o nome da aba como em App.js
          className="bg-purple-600 hover:bg-purple-700 text-white font-bold py-3 px-6 rounded-lg shadow-md transition duration-300"
        >
          Comparar Investimento/Empréstimo
        </button>
      </div>
      <p className="mt-8 text-md text-gray-600">
        Para entender como cada cálculo funciona, visite a seção de <a href="#" onClick={() => setSecaoAtiva('info')} className="text-blue-500 hover:underline font-semibold">Informações</a>.
      </p>
    </div>
  );
}

export default Home;