// frontend/src/components/ComparacaoForm.js
// (Mantenha o código existente, ele já está bom para o novo layout)
import React, { useState } from 'react';

function ComparacaoForm({ onComparar }) {
  const [valorDesejado, setValorDesejado] = useState('');
  const [investimentoMensal, setInvestimentoMensal] = useState('');
  const [tipoInvestimento, setTipoInvestimento] = useState('TESOURO_SELIC'); // Padrão
  const [taxaInvestimentoPersonalizadaAnual, setTaxaInvestimentoPersonalizadaAnual] = useState('');
  
  // Parâmetros para a simulação de empréstimo do item desejado
  const [taxaEmprestimoMensal, setTaxaEmprestimoMensal] = useState('');
  const [periodoEmprestimo, setPeriodoEmprestimo] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    onComparar({
      valor_desejado: parseFloat(valorDesejado),
      investimento_mensal: parseFloat(investimentoMensal),
      tipo_investimento: tipoInvestimento,
      taxa_investimento_personalizada_anual: parseFloat(taxaInvestimentoPersonalizadaAnual) || 0,
      taxa_emprestimo_mensal: parseFloat(taxaEmprestimoMensal),
      periodo_emprestimo: parseInt(periodoEmprestimo),
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="valorDesejado">
          Valor do Item Desejado (R$):
        </label>
        <input
          type="number"
          id="valorDesejado"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={valorDesejado}
          onChange={(e) => setValorDesejado(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="investimentoMensal">
          Quanto pode investir/economizar por mês (R$):
        </label>
        <input
          type="number"
          id="investimentoMensal"
          className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={investimentoMensal}
          onChange={(e) => setInvestimentoMensal(e.target.value)}
          required
        />
      </div>
      <div>
        <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="tipoInvestimento">
          Tipo de Investimento (Referência):
        </label>
        <select
          id="tipoInvestimento"
          className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
          value={tipoInvestimento}
          onChange={(e) => setTipoInvestimento(e.target.value)}
        >
          <option value="POUPANCA">Poupança</option>
          <option value="TESOURO_SELIC">Tesouro Selic</option>
          <option value="CDB_CDI">CDB 100% CDI</option>
          <option value="LCI_LCA">LCI/LCA (Isenta IR)</option>
          <option value="PERSONALIZADO">Outro (Personalizado)</option>
        </select>
      </div>
      {tipoInvestimento === 'PERSONALIZADO' && (
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="taxaPersonalizada">
            Taxa de Rendimento Anual Personalizada (% a.a.):
          </label>
          <input
            type="number"
            id="taxaPersonalizada"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={taxaInvestimentoPersonalizadaAnual}
            onChange={(e) => setTaxaInvestimentoPersonalizadaAnual(e.target.value)}
            required={tipoInvestimento === 'PERSONALIZADO'}
          />
        </div>
      )}

      <div className="pt-4 border-t border-gray-200">
        <h3 className="text-md font-semibold mb-2">Dados para Simulação de Empréstimo (do item desejado):</h3>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="taxaEmprestimoMensal">
            Taxa de Juros Empréstimo (% ao mês):
          </label>
          <input
            type="number"
            id="taxaEmprestimoMensal"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={taxaEmprestimoMensal}
            onChange={(e) => setTaxaEmprestimoMensal(e.target.value)}
            required
          />
        </div>
        <div>
          <label className="block text-gray-700 text-sm font-bold mb-1" htmlFor="periodoEmprestimo">
            Período do Empréstimo (meses):
          </label>
          <input
            type="number"
            id="periodoEmprestimo"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            value={periodoEmprestimo}
            onChange={(e) => setPeriodoEmprestimo(e.target.value)}
            required
          />
        </div>
      </div>

      <button
        type="submit"
        className="bg-purple-500 hover:bg-purple-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline mt-4"
      >
        Comparar
      </button>
    </form>
  );
}

export default ComparacaoForm;