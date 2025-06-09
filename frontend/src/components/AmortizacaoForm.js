import React, { useState } from 'react';

// Mantendo o nome da prop como onCalcular, conforme seu pedido
function AmortizacaoForm({ onCalcular }) { 
  const [principal, setPrincipal] = useState('');
  const [taxaMensal, setTaxaMensal] = useState('');
  const [periodoMeses, setPeriodoMeses] = useState('');
  const [tipoAmortizacao, setTipoAmortizacao] = useState('PRICE');

  const handleSubmit = (e) => {
    e.preventDefault();

    const parsedPrincipal = parseFloat(principal);
    const parsedTaxaMensal = parseFloat(taxaMensal);
    const parsedPeriodoMeses = parseInt(periodoMeses, 10);

    if (isNaN(parsedPrincipal) || isNaN(parsedTaxaMensal) || isNaN(parsedPeriodoMeses)) {
      alert("Por favor, preencha todos os campos com números válidos.");
      return;
    }
    if (parsedPrincipal <= 0 || parsedTaxaMensal < 0 || parsedPeriodoMeses <= 0) {
        alert("Valores devem ser positivos. Taxa pode ser zero.");
        return;
    }

    // Chamando a prop onCalcular, conforme seu pedido
    onCalcular({ 
      principal: parsedPrincipal,
      taxa: parsedTaxaMensal,
      periodo: parsedPeriodoMeses,
      tipo_amortizacao: tipoAmortizacao,
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md"> {/* Adicionado mb-8 para espaçamento */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Amortização</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="amortizacaoPrincipal" className="block text-sm font-medium text-gray-700">Valor do Empréstimo (R$):</label>
          <input
            type="number"
            step="0.01"
            id="amortizacaoPrincipal"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amortizacaoTaxaMensal" className="block text-sm font-medium text-gray-700">Taxa Mensal (%):</label>
          <input
            type="number"
            step="0.01"
            id="amortizacaoTaxaMensal"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            value={taxaMensal}
            onChange={(e) => setTaxaMensal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="amortizacaoPeriodoMeses" className="block text-sm font-medium text-gray-700">Período (meses):</label>
          <input
            type="number"
            step="1"
            id="amortizacaoPeriodoMeses"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            value={periodoMeses}
            onChange={(e) => setPeriodoMeses(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tipoAmortizacao" className="block text-sm font-medium text-gray-700">Tipo de Amortização:</label>
          <select
            id="tipoAmortizacao"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-green-500 focus:border-green-500"
            value={tipoAmortizacao}
            onChange={(e) => setTipoAmortizacao(e.target.value)}
          >
            <option value="PRICE">Tabela Price</option>
            <option value="SAC">Sistema SAC</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
        >
          Calcular Amortização
        </button>
      </form>
    </div>
  );
}

export default AmortizacaoForm;