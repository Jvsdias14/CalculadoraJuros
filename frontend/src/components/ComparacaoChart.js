// frontend/src/components/ComparacaoChart.js
import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Registrar os componentes necessários do Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function ComparacaoChart({ dadosComparacao }) {
  // Verifica se dadosComparacao existe e tem as propriedades esperadas
  if (!dadosComparacao || !dadosComparacao.investimento_acumulado || !dadosComparacao.emprestimo_saldo_devedor_acumulado) {
    return (
      <div className="bg-yellow-100 border-l-4 border-yellow-500 text-yellow-700 p-4 rounded-lg shadow-md mb-6">
        <p>Dados de comparação insuficientes para gerar o gráfico.</p>
      </div>
    );
  }

  // Pegamos o período máximo entre os dois dados para os rótulos do eixo X
  const labels = Array.from({ length: Math.max(dadosComparacao.investimento_acumulado.length, dadosComparacao.emprestimo_saldo_devedor_acumulado.length) }, (_, i) => `Mês ${i + 1}`);

  const data = {
    labels: labels,
    datasets: [
      {
        label: 'Investimento Acumulado (R$)',
        data: dadosComparacao.investimento_acumulado,
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
        tension: 0.1,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(75, 192, 192)',
      },
      {
        label: 'Custo Total do Empréstimo (R$)',
        data: dadosComparacao.emprestimo_saldo_devedor_acumulado, // Usar o custo acumulado do empréstimo
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1,
        pointRadius: 3,
        pointBackgroundColor: 'rgb(255, 99, 132)',
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: 'Comparativo: Investimento vs. Empréstimo ao Longo do Tempo',
        font: {
          size: 18,
          weight: 'bold'
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
          font: {
            size: 14
          }
        }
      },
      y: {
        title: {
          display: true,
          text: 'Valor (R$)',
          font: {
            size: 14
          }
        },
        beginAtZero: true, // Garante que o eixo Y comece em zero
        ticks: {
          callback: function(value, index, values) {
            return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
          }
        }
      }
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md mb-6">
      <Line data={data} options={options} />
    </div>
  );
}

export default ComparacaoChart;