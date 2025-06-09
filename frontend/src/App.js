import React, { useState, useRef } from 'react';
import JurosCompostosForm from './components/JurosCompostosForm';
import AmortizacaoForm from './components/AmortizacaoForm';
import ComparacaoForm from './components/ComparacaoForm';
import Resultado from './components/Resultado';
import Home from './components/Home';
import Info from './components/Info';

import './App.css'; 

function App() {
  const [resultado, setResultado] = useState(null);
  const [tipoCalculo, setTipoCalculo] = useState('');
  const [activeTab, setActiveTab] = useState('jurosCompostos'); 
  const [secaoAtiva, setSecaoAtiva] = useState('home'); 
  
  const resultadoRef = useRef(null); 

  const resetAndSetResult = (data, tipo) => {
    setResultado(data);
    setTipoCalculo(tipo);
    setTimeout(() => {
      if (resultadoRef.current) {
        resultadoRef.current.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }, 100);
  };

  const handleCalcularJurosCompostos = async (dados) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/calcular_juros_compostos', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro desconhecido ao calcular juros compostos');
      }
      const data = await response.json();
      resetAndSetResult(data, 'juros');
    } catch (error) {
      console.error('Erro ao calcular juros compostos:', error);
      resetAndSetResult({ erro: error.message || 'Erro ao calcular juros compostos. Verifique o servidor.' }, 'juros');
    }
  };

  const handleCalcularAmortizacao = async (dados) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/calcular_amortizacao', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro desconhecido ao calcular amortização');
      }
      const data = await response.json();
      resetAndSetResult(data, 'amortizacao');
    } catch (error) {
      console.error('Erro ao calcular amortização:', error);
      resetAndSetResult({ erro: error.message || 'Erro ao calcular amortização. Verifique o servidor.' }, 'amortizacao');
    }
  };

  const handleCompararInvestimentoEmprestimo = async (dados) => {
    try {
      const response = await fetch('http://127.0.0.1:5000/comparar_investimento_emprestimo', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(dados),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.erro || 'Erro desconhecido ao comparar investimento/empréstimo');
      }
      const data = await response.json();
      resetAndSetResult(data, 'comparacao');
    } catch (error) {
      console.error('Erro ao comparar investimento/empréstimo:', error);
      resetAndSetResult({ erro: error.message || 'Erro ao comparar investimento/empréstimo. Verifique o servidor.' }, 'comparacao');
    }
  };

  const setCalculatorTab = (tabName) => {
    setActiveTab(tabName);
    setResultado(null); 
  };

  const setMainSection = (sectionName) => {
    setSecaoAtiva(sectionName);
    setResultado(null); 
    if (sectionName === 'calculadora') {
      setActiveTab('jurosCompostos'); 
    } else {
        setActiveTab('jurosCompostos'); 
    }
  };

  // Cores originais (mais saturadas)
  const getBorderColorClass = () => {
    switch (activeTab) {
      case 'jurosCompostos':
        return 'border-blue-600'; // Azul original
      case 'amortizacao':
        return 'border-green-600'; // Verde original
      case 'comparacao':
        return 'border-purple-600'; // Roxo original
      default:
        return 'border-gray-300'; 
    }
  };

  // Cores originais (mais saturadas)
  const getTabBgColorClass = (tabName) => {
    switch (tabName) {
        case 'jurosCompostos':
            return 'bg-blue-600'; // Azul original
        case 'amortizacao':
            return 'bg-green-600'; // Verde original
        case 'comparacao':
            return 'bg-purple-600'; // Roxo original
        default:
            return 'bg-gray-200';
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-8">Calculadora Financeira</h1>

      {/* Navbar Principal Global */}
      <nav className="flex space-x-4 mb-8">
        <button
          className={`px-6 py-3 rounded-lg text-lg font-medium ${secaoAtiva === 'home' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`} // Indigo original
          onClick={() => setMainSection('home')}
        >
          Início
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-medium ${secaoAtiva === 'calculadora' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setMainSection('calculadora')}
        >
          Calculadora
        </button>
        <button
          className={`px-6 py-3 rounded-lg text-lg font-medium ${secaoAtiva === 'info' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}
          onClick={() => setMainSection('info')}
        >
          Informações
        </button>
      </nav>

      {/* Renderização do Conteúdo Principal (Home, Info, ou o Bloco da Calculadora) */}
      {secaoAtiva === 'home' && (
        <Home setSecaoAtiva={setMainSection} setActiveTab={setCalculatorTab} />
      )}
      {secaoAtiva === 'info' && (
        // O Info.js já deve estar com as cores originais se você reverteu lá
        <Info />
      )}

      {secaoAtiva === 'calculadora' && (
        <div className="w-full max-w-3xl flex flex-col items-center"> 
          {/* Abas da Calculadora */}
          <div className="flex w-full justify-center -mb-px relative z-10">
            <button
              className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
                ${activeTab === 'jurosCompostos' ? `${getTabBgColorClass('jurosCompostos')} text-white shadow-md` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                ${activeTab === 'jurosCompostos' ? 'relative -top-px' : ''} `}
              onClick={() => setCalculatorTab('jurosCompostos')}
            >
              Juros Compostos
            </button>
            <button
              className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
                ${activeTab === 'amortizacao' ? `${getTabBgColorClass('amortizacao')} text-white shadow-md` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                ${activeTab === 'amortizacao' ? 'relative -top-px' : ''} `}
              onClick={() => setCalculatorTab('amortizacao')}
            >
              Amortização
            </button>
            <button
              className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
                ${activeTab === 'comparacao' ? `${getTabBgColorClass('comparacao')} text-white shadow-md` : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
                ${activeTab === 'comparacao' ? 'relative -top-px' : ''} `}
              onClick={() => setCalculatorTab('comparacao')}
            >
              Empréstimo vs. Investimento
            </button>
          </div>

          {/* O container do formulário agora terá a borda colorida dinâmica */}
          <div className={`bg-white p-6 rounded-b-xl shadow-md border-t-4 ${getBorderColorClass()} w-full max-w-3xl`}>
            {/* Renderização do Formulário ativo dentro do card */}
            {activeTab === 'jurosCompostos' && (
              <JurosCompostosForm onCalcular={handleCalcularJurosCompostos} />
            )}
            {activeTab === 'amortizacao' && (
              <AmortizacaoForm onCalcular={handleCalcularAmortizacao} />
            )}
            {activeTab === 'comparacao' && (
              <ComparacaoForm onComparar={handleCompararInvestimentoEmprestimo} />
            )}
            
            {/* Resultado da calculadora (agora dentro do mesmo card e com ref) */}
            {resultado && (
              <div ref={resultadoRef} className="mt-8"> {/* Adicionado mt-8 para espaçamento */}
                {/* O componente Resultado será renderizado aqui e terá sua própria estilização interna */}
                <Resultado resultado={resultado} tipo={tipoCalculo} />
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default App;