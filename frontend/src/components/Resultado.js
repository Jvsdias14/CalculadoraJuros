// frontend/src/components/Resultado.js
import React from 'react';

function Resultado({ resultado, tipo }) {
  if (!resultado) {
    return null;
  }

  if (resultado.erro) {
    return (
      <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4" role="alert">
        <strong className="font-bold">Erro:</strong>
        <span className="block sm:inline"> {resultado.erro}</span>
      </div>
    );
  }

  const formatCurrency = (value) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  return (
    <div className="mt-6 p-6 bg-gray-100 shadow rounded-lg">
      <h3 className="text-xl font-semibold mb-4 text-gray-800">Resultado do Cálculo:</h3>
      
      {tipo === 'juros' && (
        <div>
          <p className="text-2xl font-bold text-blue-800">
            Valor Final (Juros Compostos): {formatCurrency(resultado.valor_final)}
          </p>
        </div>
      )}

      {tipo === 'amortizacao' && (
        <div className="overflow-x-auto">
          <h4 className="text-lg font-medium mb-2">Tabela de Amortização</h4>
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amortização</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juros</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcela</th>
                <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Devedor</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {resultado.parcelas.map((parcela, index) => (
                <tr key={index}>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcela.mes}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_amortizacao)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_juros)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_parcela)}</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.saldo_devedor)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {tipo === 'comparacao' && (
        <div className="space-y-6">
          {resultado.decisao_sugerida && (
              <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative mb-4" role="alert">
                <strong className="font-bold">Sugestão:</strong>
                <span className="block sm:inline"> {resultado.decisao_sugerida}</span>
              </div>
          )}

          {/* Resultado do Investimento */}
          <div className="p-4 bg-white rounded shadow">
            <h4 className="text-lg font-medium mb-2 text-purple-700">Cenário de Investimento:</h4>
            <p><strong>Valor Desejado:</strong> {formatCurrency(resultado.emprestimo.principal)}</p>
            <p><strong>Investindo {formatCurrency(resultado.investimento.total_investido_pelo_usuario / resultado.investimento.meses)} por mês (Taxa aplicada: {resultado.investimento.taxa_anual_aplicada}% a.a.):</strong></p>
            <p className="ml-4"> - Tempo para atingir: <span className="font-bold">{resultado.investimento.meses_para_atingir} meses</span></p>
            <p className="ml-4"> - Total Investido pelo Usuário: <span className="font-bold">{formatCurrency(resultado.investimento.total_investido_pelo_usuario)}</span></p>
            <p className="ml-4"> - Total de Rendimentos Ganhos: <span className="font-bold text-green-700">{formatCurrency(resultado.investimento.total_rendimentos)}</span></p>
            <p className="ml-4"> - Valor Final Acumulado: <span className="font-bold">{formatCurrency(resultado.investimento.valor_final_atingido)}</span></p>
            {resultado.investimento.mensagem && <p className="text-sm text-gray-600 mt-2">{resultado.investimento.mensagem}</p>}
          </div>

          {/* Resultado do Empréstimo */}
          <div className="p-4 bg-white rounded shadow">
            <h4 className="text-lg font-medium mb-2 text-red-700">Cenário de Empréstimo (Valor do Item como Principal):</h4>
            <p><strong>Principal:</strong> {formatCurrency(resultado.emprestimo.principal)}</p>
            <p><strong>Taxa de Juros:</strong> {resultado.emprestimo.taxa_mensal_percentual}% ao mês</p>
            <p><strong>Período:</strong> {resultado.emprestimo.periodo_meses} meses</p>
            <p className="ml-4"> - Total de Juros Pagos: <span className="font-bold text-red-700">{formatCurrency(resultado.emprestimo.total_juros_pagos)}</span></p>
            <p className="ml-4"> - Custo Total do Empréstimo (Principal + Juros): <span className="font-bold">{formatCurrency(resultado.emprestimo.total_pago)}</span></p>
            
            {/* Opcional: Tabela de amortização do empréstimo na comparação, se desejado */}
            
            <h5 className="text-md font-medium mt-4 mb-2">Detalhes das Parcelas do Empréstimo:</h5>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Mês</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Parcela</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Juros</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Amortização</th>
                    <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Saldo Devedor</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {resultado.emprestimo.parcelas.map((parcela, index) => (
                    <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{parcela.mes}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_parcela)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_juros)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.valor_amortizacao)}</td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{formatCurrency(parcela.saldo_devedor)}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            
          </div>
        </div>
      )}
    </div>
  );
}

export default Resultado;