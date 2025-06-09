import React, { useState } from 'react';

// Mantendo o nome da prop como onCalcular, conforme seu pedido
function JurosCompostosForm({ onCalcular }) { 
  const [principal, setPrincipal] = useState('');
  const [taxaMensal, setTaxaMensal] = useState('');
  const [periodoMeses, setPeriodoMeses] = useState('');

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
    });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-md"> {/* Adicionado mb-8 para espaçamento */}
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Juros Compostos</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="jurosPrincipal" className="block text-sm font-medium text-gray-700">Capital Inicial (R$):</label>
          <input
            type="number"
            step="0.01"
            id="jurosPrincipal"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={principal}
            onChange={(e) => setPrincipal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="jurosTaxaMensal" className="block text-sm font-medium text-gray-700">Taxa de Juros (% ao mês):</label>
          <input
            type="number"
            step="0.01"
            id="jurosTaxaMensal"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={taxaMensal}
            onChange={(e) => setTaxaMensal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="jurosPeriodoMeses" className="block text-sm font-medium text-gray-700">Período (meses):</label>
          <input
            type="number"
            step="1"
            id="jurosPeriodoMeses"
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-blue-500 focus:border-blue-500"
            value={periodoMeses}
            onChange={(e) => setPeriodoMeses(e.target.value)}
            required
          />
        </div>
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
        >
          Calcular
        </button>
      </form>
    </div>
  );
}

export default JurosCompostosForm;