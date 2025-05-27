// frontend/src/App.js
import React, { useState } from 'react';
import JurosCompostosForm from './components/JurosCompostosForm';
import AmortizacaoForm from './components/AmortizacaoForm';
import ComparacaoForm from './components/ComparacaoForm';
import Resultado from './components/Resultado';

function App() {
  const [resultadoJurosCompostos, setResultadoJurosCompostos] = useState(null);
  const [resultadoAmortizacao, setResultadoAmortizacao] = useState(null);
  const [resultadoComparacao, setResultadoComparacao] = useState(null);
  
  // Estado para controlar qual aba está ativa (inicializa com 'juros' por exemplo)
  const [abaAtiva, setAbaAtiva] = useState('juros'); 
  // Estado para qual cálculo gerou o resultado (para exibir o tipo correto na área de resultados)
  const [resultadoTipo, setResultadoTipo] = useState(null); 

  // Função auxiliar para limpar todos os resultados e definir o tipo de resultado ativo
  const resetAndSetResult = (result, type) => {
    setResultadoJurosCompostos(null);
    setResultadoAmortizacao(null);
    setResultadoComparacao(null);
    
    if (type === 'juros') setResultadoJurosCompostos(result);
    else if (type === 'amortizacao') setResultadoAmortizacao(result);
    else if (type === 'comparacao') setResultadoComparacao(result);
    
    setResultadoTipo(type); // Define qual tipo de resultado deve ser exibido
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
      const data = await response.json();
      resetAndSetResult(data, 'juros');
    } catch (error) {
      console.error('Erro ao calcular juros compostos:', error);
      resetAndSetResult({ erro: 'Erro ao calcular' }, 'juros');
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
      const data = await response.json();
      resetAndSetResult(data, 'amortizacao');
    } catch (error) {
      console.error('Erro ao calcular amortização:', error);
      resetAndSetResult({ erro: 'Erro ao calcular' }, 'amortizacao');
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
      const data = await response.json();
      resetAndSetResult(data, 'comparacao');
    } catch (error) {
      console.error('Erro ao comparar investimento/empréstimo:', error);
      resetAndSetResult({ erro: 'Erro ao comparar' }, 'comparacao');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center">
      <nav className="w-full bg-blue-700 shadow-md py-4">
        <div className="container mx-auto flex flex-col md:flex-row justify-between items-center px-4">
          <h1 className="text-3xl font-bold text-white mb-3 md:mb-0">Calculadora Financeira</h1>
          <div className="flex space-x-4">
            <button
              onClick={() => { setAbaAtiva('juros'); resetAndSetResult(null, null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                abaAtiva === 'juros' ? 'bg-blue-500 text-white shadow-lg' : 'text-blue-100 hover:bg-blue-600'
              }`}
            >
              Juros Compostos
            </button>
            <button
              onClick={() => { setAbaAtiva('amortizacao'); resetAndSetResult(null, null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                abaAtiva === 'amortizacao' ? 'bg-green-500 text-white shadow-lg' : 'text-green-100 hover:bg-green-600'
              }`}
            >
              Amortização
            </button>
            <button
              onClick={() => { setAbaAtiva('comparacao'); resetAndSetResult(null, null); }}
              className={`px-4 py-2 rounded-lg font-semibold transition-colors duration-300 ${
                abaAtiva === 'comparacao' ? 'bg-purple-500 text-white shadow-lg' : 'text-purple-100 hover:bg-purple-600'
              }`}
            >
              Empréstimo vs. Investimento
            </button>
          </div>
        </div>
      </nav>

      <div className="flex-grow container mx-auto p-4 max-w-4xl mt-8 flex flex-col items-center">
        {/* Container centralizado para o formulário */}
        <div className="bg-white p-8 rounded-xl shadow-2xl w-full max-w-2xl mb-8">
          {abaAtiva === 'juros' && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-blue-800 text-center">Calcular Juros Compostos</h2>
              <JurosCompostosForm onCalcular={handleCalcularJurosCompostos} />
            </>
          )}

          {abaAtiva === 'amortizacao' && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-green-800 text-center">Calcular Amortização de Empréstimo</h2>
              <AmortizacaoForm onCalcular={handleCalcularAmortizacao} />
            </>
          )}

          {abaAtiva === 'comparacao' && (
            <>
              <h2 className="text-2xl font-semibold mb-6 text-purple-800 text-center">Comparar Empréstimo vs. Investimento</h2>
              <ComparacaoForm onComparar={handleCompararInvestimentoEmprestimo} />
            </>
          )}
        </div>

        {/* Área de Resultados */}
        <div className="w-full max-w-2xl">
          {resultadoTipo === 'juros' && resultadoJurosCompostos && (
            <Resultado resultado={resultadoJurosCompostos} tipo="juros" />
          )}
          {resultadoTipo === 'amortizacao' && resultadoAmortizacao && (
            <Resultado resultado={resultadoAmortizacao} tipo="amortizacao" />
          )}
          {resultadoTipo === 'comparacao' && resultadoComparacao && (
            <Resultado resultado={resultadoComparacao} tipo="comparacao" />
          )}
        </div>
      </div>
    </div>
  );
}

export default App;