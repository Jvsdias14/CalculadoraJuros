// frontend/src/App.js
import React, { useState } from 'react';
import JurosCompostosForm from './components/JurosCompostosForm';
import AmortizacaoForm from './components/AmortizacaoForm';
import Resultado from './components/Resultado';

function App() {
  const [resultadoJurosCompostos, setResultadoJurosCompostos] = useState(null);
  const [resultadoAmortizacao, setResultadoAmortizacao] = useState(null);
  const [calculoAtivo, setCalculoAtivo] = useState(null); // 'juros' ou 'amortizacao'

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
      setResultadoJurosCompostos(data);
      setResultadoAmortizacao(null);
      setCalculoAtivo('juros');
    } catch (error) {
      console.error('Erro ao calcular juros compostos:', error);
      setResultadoJurosCompostos({ erro: 'Erro ao calcular' });
      setResultadoAmortizacao(null);
      setCalculoAtivo('juros');
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
      setResultadoAmortizacao(data);
      setResultadoJurosCompostos(null);
      setCalculoAtivo('amortizacao');
    } catch (error) {
      console.error('Erro ao calcular amortização:', error);
      setResultadoAmortizacao({ erro: 'Erro ao calcular' });
      setResultadoJurosCompostos(null);
      setCalculoAtivo('amortizacao');
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Calculadora Financeira Simples</h1>

      <div className="mb-4">
        <h2 className="text-xl font-semibold mb-2">Calcular Juros Compostos</h2>
        <JurosCompostosForm onCalcular={handleCalcularJurosCompostos} />
        {calculoAtivo === 'juros' && resultadoJurosCompostos && (
          <Resultado resultado={resultadoJurosCompostos} tipo="juros" />
        )}
      </div>

      <div>
        <h2 className="text-xl font-semibold mb-2">Calcular Amortização de Empréstimo</h2>
        <AmortizacaoForm onCalcular={handleCalcularAmortizacao} />
        {calculoAtivo === 'amortizacao' && resultadoAmortizacao && (
          <Resultado resultado={resultadoAmortizacao} tipo="amortizacao" />
        )}
      </div>
    </div>
  );
}

export default App;