import React, { forwardRef } from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend } from 'chart.js';
import { Line } from 'react-chartjs-2';


ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);


const Resultado = forwardRef(({ resultado, tipo }, ref) => {
  if (!resultado || Object.keys(resultado).length === 0) {
    return null;
  }


  const ResultContainer = ({ children }) => (

    <div ref={ref} className="bg-gray-50 p-6 rounded-lg shadow-inner border border-gray-200 mt-4 max-w-3xl mx-auto">
      {children}
    </div>
  );


  if (resultado.erro) {
    return (
      <div ref={ref} className="text-center p-4 bg-gray-100 border border-gray-400 text-gray-700 rounded-md mt-4 max-w-3xl mx-auto">
        <p className="font-semibold">Erro:</p>
        <p>{resultado.erro}</p>
      </div>
    );
  }

  // --- Renderização para Juros Compostos ---
  if (tipo === 'juros' && resultado.montante_final !== undefined) {
    const colorClass = "text-blue-700";
    const maxTableHeight = 'max-h-96';
    const tableOverflowClass = 'overflow-y-auto'; 

    return (
      <ResultContainer>
        <h3 className="text-2xl font-semibold text-blue-700 mb-4 text-center">Resultado dos Juros Compostos</h3>
        
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-blue-600">Montante Final:</span> R$ {resultado.montante_final.toFixed(2)}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-blue-600">Total de Juros:</span> R$ {resultado.total_juros.toFixed(2)}
        </p>
        <p className="text-gray-800 mb-4">
          <span className="font-semibold text-blue-600">Período:</span> {resultado.periodo} meses
        </p>

        <h4 className="text-xl font-semibold text-blue-700 mb-3">Evolução do Montante (Mês a Mês):</h4>
        <div className={`${maxTableHeight} ${tableOverflowClass} w-full`}>
          {resultado.evolucao_montante && resultado.evolucao_montante.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Mês</th>
                  <th className="py-3 px-6 text-left">Montante</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {resultado.evolucao_montante.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.mes}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.montante.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">Nenhum dado de evolução disponível.</p>
          )}
        </div>
      </ResultContainer>
    );
  }

  // --- Renderização para Amortização de Empréstimo ---
  if (tipo === 'amortizacao' && resultado.tabela_amortizacao) {
    const maxTableHeight = 'max-h-96';
    const tableOverflowClass = 'overflow-y-auto'; 

    return (
      <ResultContainer>
        <h3 className="text-2xl font-semibold text-green-700 mb-4 text-center">Tabela de Amortização</h3>
        <div className="mb-4 text-gray-700">
          {resultado.valor_emprestimo !== undefined && <p><span className="font-semibold text-green-600">Valor Total do Empréstimo:</span> R$ {resultado.valor_emprestimo.toFixed(2)}</p>}
          {resultado.taxa_juros_mensal !== undefined && <p><span className="font-semibold text-green-600">Taxa de Juros Mensal:</span> {resultado.taxa_juros_mensal.toFixed(2)}%</p>}
          {resultado.total_parcelas !== undefined && <p><span className="font-semibold text-green-600">Total de Parcelas:</span> {resultado.total_parcelas}</p>}
          {resultado.tipo_amortizacao && <p><span className="font-semibold text-green-600">Sistema de Amortização:</span> {resultado.tipo_amortizacao}</p>}
          {resultado.total_juros_pagos !== undefined && (
            <p><span className="font-semibold text-green-600">Total de Juros Pagos:</span> R$ {resultado.total_juros_pagos.toFixed(2)}</p>
          )}
          {resultado.primeira_parcela !== undefined && (
            <p><span className="font-semibold text-green-600">Valor da Primeira Parcela:</span> R$ {resultado.primeira_parcela.toFixed(2)}</p>
          )}
          {resultado.ultima_parcela !== undefined && (
            <p><span className="font-semibold text-green-600">Valor da Última Parcela:</span> R$ {resultado.ultima_parcela.toFixed(2)}</p>
          )}
        </div>

        <div className={`${maxTableHeight} ${tableOverflowClass} w-full`}>
          {resultado.tabela_amortizacao && resultado.tabela_amortizacao.length > 0 ? (
            <table className="min-w-full bg-white border border-gray-300 rounded-md">
              <thead>
                <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                  <th className="py-3 px-6 text-left">Mês</th>
                  <th className="py-3 px-6 text-left">Parcela</th>
                  <th className="py-3 px-6 text-left">Amortização</th>
                  <th className="py-3 px-6 text-left">Juros</th>
                  <th className="py-3 px-6 text-left">Saldo Devedor</th>
                </tr>
              </thead>
              <tbody className="text-gray-600 text-sm font-light">
                {resultado.tabela_amortizacao.map((item, index) => (
                  <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                    <td className="py-3 px-6 text-left whitespace-nowrap">{item.mes}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.valor_parcela.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.valor_amortizacao.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.valor_juros.toFixed(2)}</td>
                    <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.saldo_devedor.toFixed(2)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p className="text-gray-500 text-center">Nenhum dado de amortização disponível.</p>
          )}
        </div>
      </ResultContainer>
    );
  }

  // --- Renderização para Comparação de Empréstimo vs. Investimento ---
  if (tipo === 'comparacao' && resultado) {
    const { 
      valor_item_desejado = 0,
      investimento_mensal_simulado = 0,
      periodo_comparacao = 0,
      custo_total_emprestimo = 0,
      valor_acumulado_investimento = 0,
      decisao_sugerida = "",
      insight_investimento = "",
      comparativo_evolucao = []
    } = resultado;

 
    const decisionColorClass = 'text-gray-700';


    const chartData = {
      labels: comparativo_evolucao.map(item => `Mês ${item.mes}`),
      datasets: [
        {
          label: 'Investimento Acumulado (R$)',
          data: comparativo_evolucao.map(item => item.investimento_acumulado),
          borderColor: 'rgb(75, 192, 192)', 
          backgroundColor: 'rgba(75, 192, 192, 0.5)',
          tension: 0.1,
          pointRadius: 3, 
          pointBackgroundColor: 'rgb(75, 192, 192)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgb(75, 192, 192)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
        },
        {
          label: 'Custo Total do Empréstimo (R$)',
          data: comparativo_evolucao.map(item => item.custo_total_emprestimo),
          borderColor: 'rgb(255, 99, 132)', 
          backgroundColor: 'rgba(255, 99, 132, 0.5)',
          tension: 0.1,
          pointRadius: 3,
          pointBackgroundColor: 'rgb(255, 99, 132)',
          pointBorderColor: '#fff',
          pointHoverRadius: 5,
          pointHoverBackgroundColor: 'rgb(255, 99, 132)',
          pointHoverBorderColor: 'rgba(220,220,220,1)',
        },
      ],
    };

    const chartOptions = {
      responsive: true,
      maintainAspectRatio: false, 
      plugins: {
        legend: {
          position: 'top',
          labels: {
            font: {
              size: 14
            }
          }
        },
        title: {
          display: true,
          text: 'Evolução Comparativa ao Longo do Tempo',
          font: {
            size: 16
          },
          color: '#333' 
        },
        tooltip: {
            callbacks: {
                label: function(context) {
                    let label = context.dataset.label || '';
                    if (label) {
                        label += ': ';
                    }
                    if (context.parsed.y !== null) {
                        label += new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(context.parsed.y);
                    }
                    return label;
                }
            }
        }
      },
      scales: {
        x: {
          title: {
            display: true,
            text: 'Mês',
            color: '#555'
          },
          grid: {
            display: false 
          }
        },
        y: {
          title: {
            display: true,
            text: 'Valor (R$)',
            color: '#555'
          },
          beginAtZero: true,
          ticks: {
            callback: function(value) {
                return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
            }
          }
        },
      },
    };

    return (
      <ResultContainer>
        <h3 className="text-2xl font-semibold text-purple-700 mb-4 text-center">Resultado da Comparação</h3>
        
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-purple-600">Valor Desejado do Item:</span> R$ {valor_item_desejado.toFixed(2)}
        </p>
        <p className="text-gray-800 mb-2">
          <span className="font-semibold text-purple-600">Investimento Mensal / Parcela Sim.:</span> R$ {investimento_mensal_simulado.toFixed(2)}
        </p>
        <p className="text-gray-800 mb-4">
          <span className="font-semibold text-purple-600">Período de Comparação:</span> {periodo_comparacao} meses
        </p>

        <div className="bg-purple-50 p-4 rounded-lg border border-purple-200 mb-4">
          <h4 className="text-xl font-bold text-purple-700 mb-3">Resumo da Comparação:</h4>
          <p className="text-gray-800 mb-2">
            <span className="font-semibold text-purple-600">Custo Total do Empréstimo:</span> R$ {custo_total_emprestimo.toFixed(2)}
          </p>
          <p className="text-gray-800 mb-2">
            <span className="font-semibold text-purple-600">Valor Acumulado Investindo:</span> R$ {valor_acumulado_investimento.toFixed(2)}
          </p>

          <p className={`text-lg ${decisionColorClass} mt-3`}>
            Decisão Sugerida: {decisao_sugerida.replace(/\*\*/g, '')} 
          </p>
          {insight_investimento && (
            <p className="text-gray-700 mt-2 italic text-sm">
              {insight_investimento}
            </p>
          )}
        </div>

        {comparativo_evolucao && comparativo_evolucao.length > 0 && (
          <div className="mt-6">
            <h4 className="text-xl font-semibold text-purple-700 mb-3 text-center">Gráfico Comparativo</h4>
            
           
            <div className="w-full h-80 mb-6"> 
              <Line data={chartData} options={chartOptions} />
            </div>


            <h4 className="text-xl font-semibold text-purple-700 mb-3 text-center">Detalhes Mês a Mês</h4>
            <div className="max-h-64 overflow-y-auto w-full">
              {comparativo_evolucao.length > 0 ? (
                <table className="min-w-full bg-white border border-gray-300 rounded-md">
                  <thead>
                    <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
                      <th className="py-3 px-6 text-left">Mês</th>
                      <th className="py-3 px-6 text-left">Investimento Acumulado</th>
                      <th className="py-3 px-6 text-left">Custo Total do Empréstimo</th>
                    </tr>
                  </thead>
                  <tbody className="text-gray-600 text-sm font-light">
                    {comparativo_evolucao.map((item, index) => (
                      <tr key={index} className="border-b border-gray-200 hover:bg-gray-50">
                        <td className="py-3 px-6 text-left whitespace-nowrap">{item.mes}</td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.investimento_acumulado.toFixed(2)}</td>
                        <td className="py-3 px-6 text-left whitespace-nowrap">R$ {item.custo_total_emprestimo.toFixed(2)}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <p className="text-gray-500 text-center">Nenhum dado de evolução da comparação disponível.</p>
              )}
            </div>
          </div>
        )}
      </ResultContainer>
    );
  }

 
  return (
    <div ref={ref} className="text-center p-4 bg-yellow-100 border border-yellow-400 text-yellow-700 rounded-md mt-4 max-w-3xl mx-auto">
      <p>Nenhum resultado para exibir ou tipo de cálculo desconhecido.</p>
    </div>
  );
});

export default Resultado;