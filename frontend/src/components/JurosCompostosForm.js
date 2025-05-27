// frontend/src/components/JurosCompostosForm.js
import React, { useState } from 'react';

function JurosCompostosForm({ onCalcular }) {
  const [principal, setPrincipal] = useState('');
  const [taxa, setTaxa] = useState('');
  const [periodo, setPeriodo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onCalcular({
      principal: parseFloat(principal),
      taxa: parseFloat(taxa),
      periodo: parseInt(periodo),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="principalJuros">
          Capital Inicial (R$):
        </label>
        <input
          type="number"
          id="principalJuros"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={principal}
          onChange={(e) => setPrincipal(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="taxaJuros">
          Taxa de Juros (% ao mês):
        </label>
        <input
          type="number"
          id="taxaJuros"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={taxa}
          onChange={(e) => setTaxa(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="periodoJuros">
          Período (meses):
        </label>
        <input
          type="number"
          id="periodoJuros"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={periodo}
          onChange={(e) => setPeriodo(e.target.value)}
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline"
      >
        Calcular
      </button>
    </form>
  );
}

export default JurosCompostosForm;