// frontend/src/components/AmortizacaoForm.js
import React, { useState } from 'react';

function AmortizacaoForm({ onCalcular }) {
  const [principal, setPrincipal] = useState('');
  const [taxa, setTaxa] = useState('');
  const [periodo, setPeriodo] = useState('');
  const [tipoAmortizacao, setTipoAmortizacao] = useState('PRICE'); // Padrão

  const handleSubmit = (event) => {
    event.preventDefault();
    onCalcular({
      principal: parseFloat(principal),
      taxa: parseFloat(taxa),
      periodo: parseInt(periodo),
      tipo_amortizacao: tipoAmortizacao,
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="principalAmortizacao">
          Valor do Empréstimo (R$):
        </label>
        <input
          type="number"
          id="principalAmortizacao"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="taxaAmortizacao">
          Taxa de Juros (% ao mês):
        </label>
        <input
          type="number"
          id="taxaAmortizacao"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={taxa}
          onChange={(e) => setTaxa(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="periodoAmortizacao">
          Período (meses):
        </label>
        <input
          type="number"
          id="periodoAmortizacao"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="tipoAmortizacao">
          Tipo de Amortização:
        </label>
        <select
          id="tipoAmortizacao"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={tipoAmortizacao}
          onChange={(e) => setTipoAmortizacao(e.target.value)}
        >
          <option value="PRICE">Price</option>
          <option value="SAC">SAC</option>
        </select>
      </div>
      <button
        type="submit"
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calcular
      </button>
    </form>
  );
}

export default AmortizacaoForm;