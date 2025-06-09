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

    // Adicionando validações (iguais às dos outros formulários)
    const parsedValorDesejado = parseFloat(valorDesejado);
    const parsedInvestimentoMensal = parseFloat(investimentoMensal);
    const parsedTaxaEmprestimoMensal = parseFloat(taxaEmprestimoMensal);
    const parsedPeriodoEmprestimo = parseInt(periodoEmprestimo, 10);
    const parsedTaxaInvestimentoPersonalizadaAnual = parseFloat(taxaInvestimentoPersonalizadaAnual);

    if (isNaN(parsedValorDesejado) || isNaN(parsedInvestimentoMensal) || isNaN(parsedTaxaEmprestimoMensal) || isNaN(parsedPeriodoEmprestimo)) {
      alert("Por favor, preencha todos os campos com números válidos.");
      return;
    }
    if (parsedValorDesejado <= 0 || parsedInvestimentoMensal < 0 || parsedTaxaEmprestimoMensal < 0 || parsedPeriodoEmprestimo <= 0) {
        alert("Valores devem ser positivos. Taxas podem ser zero.");
        return;
    }
    if (tipoInvestimento === 'PERSONALIZADO' && isNaN(parsedTaxaInvestimentoPersonalizadaAnual)) {
        alert("Por favor, insira uma taxa personalizada válida para o investimento.");
        return;
    }

    onComparar({
      valor_desejado: parsedValorDesejado,
      investimento_mensal: parsedInvestimentoMensal,
      tipo_investimento: tipoInvestimento,
      // Garante que taxa_investimento_personalizada_anual seja 0 se não for personalizado
      taxa_investimento_personalizada_anual: tipoInvestimento === 'PERSONALIZADO' ? parsedTaxaInvestimentoPersonalizadaAnual : 0,
      taxa_emprestimo_mensal: parsedTaxaEmprestimoMensal,
      periodo_emprestimo: parsedPeriodoEmprestimo,
    });
  };

  return (
    // NOVO LAYOUT: classes para card, sombra, borda e margem
    <div className="bg-white p-6 rounded-xl shadow-md">
      <h2 className="text-xl font-semibold mb-4 text-gray-800">Comparação de Investimento vs. Empréstimo</h2>
      <form onSubmit={handleSubmit} className="space-y-4"> {/* Aumentei o espaçamento aqui */}
        <div>
          <label htmlFor="valorDesejado" className="block text-sm font-medium text-gray-700">
            Valor do Item Desejado (R$):
          </label>
          <input
            type="number"
            step="0.01"
            id="valorDesejado"
            // NOVO LAYOUT: classes para input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            value={valorDesejado}
            onChange={(e) => setValorDesejado(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="investimentoMensal" className="block text-sm font-medium text-gray-700">
            Quanto pode investir/economizar por mês (R$):
          </label>
          <input
            type="number"
            step="0.01"
            id="investimentoMensal"
            // NOVO LAYOUT: classes para input
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
            value={investimentoMensal}
            onChange={(e) => setInvestimentoMensal(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="tipoInvestimento" className="block text-sm font-medium text-gray-700">
            Tipo de Investimento (Referência):
          </label>
          <select
            id="tipoInvestimento"
            // NOVO LAYOUT: classes para select
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
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
            <label htmlFor="taxaPersonalizada" className="block text-sm font-medium text-gray-700">
              Taxa de Rendimento Anual Personalizada (% a.a.):
            </label>
            <input
              type="number"
              step="0.01"
              id="taxaPersonalizada"
              // NOVO LAYOUT: classes para input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              value={taxaInvestimentoPersonalizadaAnual}
              onChange={(e) => setTaxaInvestimentoPersonalizadaAnual(e.target.value)}
              required={tipoInvestimento === 'PERSONALIZADO'}
            />
          </div>
        )}

        {/* Linha separadora */}
        <div className="pt-4 border-t border-gray-200">
          <h3 className="text-lg font-semibold mb-2 text-gray-800">Dados para Simulação de Empréstimo (do item desejado):</h3> {/* Título ajustado */}
          <div>
            <label htmlFor="taxaEmprestimoMensal" className="block text-sm font-medium text-gray-700">
              Taxa de Juros Empréstimo (% ao mês):
            </label>
            <input
              type="number"
              step="0.01"
              id="taxaEmprestimoMensal"
              // NOVO LAYOUT: classes para input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              value={taxaEmprestimoMensal}
              onChange={(e) => setTaxaEmprestimoMensal(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="periodoEmprestimo" className="block text-sm font-medium text-gray-700">
              Período do Empréstimo (meses):
            </label>
            <input
              type="number"
              step="1"
              id="periodoEmprestimo"
              // NOVO LAYOUT: classes para input
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2 focus:ring-purple-500 focus:border-purple-500"
              value={periodoEmprestimo}
              onChange={(e) => setPeriodoEmprestimo(e.target.value)}
              required
            />
          </div>
        </div>

        <button
          type="submit"
          // NOVO LAYOUT: classes para botão
          className="w-full bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-offset-2 mt-4"
        >
          Comparar
        </button>
      </form>
    </div>
  );
}

export default ComparacaoForm;