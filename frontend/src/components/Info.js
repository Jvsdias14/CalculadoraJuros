import React, { useState } from 'react';

function Info() {
  const [activeInfoTab, setActiveInfoTab] = useState('jurosCompostosInfo'); 

 
  const getInfoTabColorClass = (tabName) => {
    switch (tabName) {
      case 'jurosCompostosInfo':
        return 'bg-blue-600 text-white';
      case 'amortizacaoInfo':
        return 'bg-green-600 text-white';
      case 'comparacaoInfo':
        return 'bg-purple-600 text-white';
      default:
        return 'bg-gray-200 text-gray-700';
    }
  };

  const getInfoBorderColorClass = () => {
    switch (activeInfoTab) {
      case 'jurosCompostosInfo':
        return 'border-blue-600';
      case 'amortizacaoInfo':
        return 'border-green-600';
      case 'comparacaoInfo':
        return 'border-purple-600';
      default:
        return 'border-gray-300'; // Fallback
    }
  };

  return (
   
    <div className="w-full max-w-3xl flex flex-col items-center mb-8">

      <div className="flex w-full justify-center -mb-px relative z-10">
        <button
          className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
            ${activeInfoTab === 'jurosCompostosInfo' ? getInfoTabColorClass('jurosCompostosInfo') + ' shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            ${activeInfoTab === 'jurosCompostosInfo' ? 'relative -top-px' : ''} `}
          onClick={() => setActiveInfoTab('jurosCompostosInfo')}
        >
          Juros Compostos
        </button>
        <button
          className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
            ${activeInfoTab === 'amortizacaoInfo' ? getInfoTabColorClass('amortizacaoInfo') + ' shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            ${activeInfoTab === 'amortizacaoInfo' ? 'relative -top-px' : ''} `}
          onClick={() => setActiveInfoTab('amortizacaoInfo')}
        >
          Amortização
        </button>
        <button
          className={`flex-1 py-2 text-lg font-medium transition duration-300 rounded-t-lg 
            ${activeInfoTab === 'comparacaoInfo' ? getInfoTabColorClass('comparacaoInfo') + ' shadow-md' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}
            ${activeInfoTab === 'comparacaoInfo' ? 'relative -top-px' : ''} `}
          onClick={() => setActiveInfoTab('comparacaoInfo')}
        >
          Empréstimo vs. Investimento
        </button>
      </div>

      <div className={`bg-white p-6 rounded-b-xl shadow-md border-t-4 ${getInfoBorderColorClass()} w-full`}>
        {activeInfoTab === 'jurosCompostosInfo' && (
          <section className="text-left"> 
            <h3 className="text-2xl font-semibold text-blue-700 mb-3">Juros Compostos</h3>
            <p className="text-gray-700 mb-2">
              Esta seção permite calcular o valor futuro de um investimento com base em um capital inicial, uma taxa de juros e um período. Juros compostos são juros sobre juros, ou seja, os juros ganhos em um período são adicionados ao capital principal para calcular os juros do próximo período.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">Fórmula:</p>
            <p className="text-center text-lg font-mono p-2 bg-gray-100 rounded-md">
                $M = P(1 + i)^n$
            </p>
            <p className="text-gray-700 text-sm italic mt-2">
                Onde: $M$ = Montante Final, $P$ = Capital Inicial, $i$ = Taxa de Juros por Período, $n$ = Número de Períodos.
            </p>
            <p className="text-gray-700 mb-2 font-semibold mt-4">Campos:</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li><span className="font-semibold">Capital Inicial (R$):</span> O valor que você irá investir no início.</li>
              <li><span className="font-semibold">Taxa de Juros (% ao mês):</span> A porcentagem de juros aplicada por mês.</li>
              <li><span className="font-semibold">Período (meses):</span> O número de meses durante os quais o investimento renderá juros.</li>
            </ul>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Resultado:</span> Você verá o montante final acumulado, o total de juros ganhos e, no futuro, a evolução do capital mês a mês.
            </p>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
                <h4 className="text-xl font-bold text-blue-800 mb-3">Quando usar?</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                    <li>
                        <span className="font-semibold">Planejamento de aposentadoria ou grandes compras:</span> Quer saber quanto seu dinheiro renderá se você investir um valor inicial hoje para comprar um carro, casa ou para a aposentadoria em X anos?
                    </li>
                    <li>
                        <span className="font-semibold">Comparação de investimentos de longo prazo:</span> Ajuda a entender o potencial de crescimento de diferentes investimentos (poupança, CDB, Tesouro Direto, etc.) com base em suas taxas de juros.
                    </li>
                    <li>
                        <span className="font-semibold">Entender dívidas (cartão de crédito, cheque especial):</span> Embora focado em investimento, o conceito de juros compostos também mostra a rapidez com que as dívidas podem crescer se não forem pagas, evidenciando a importância de quitá-las.
                    </li>
                    <li>
                        <span className="font-semibold">Simulação de investimentos de filhos ou netos:</span> Calcule quanto um valor inicial pode se tornar até que eles atinjam a maioridade, por exemplo.
                    </li>
                </ul>
            </div>
 
            <div className="text-center mt-8">
              <p className="text-lg text-gray-700">
                Esperamos que esta calculadora seja uma ferramenta útil para suas decisões financeiras!
              </p>
              <p className="text-md text-gray-600 mt-4">
                <span className="font-semibold">Lembre-se:</span> Os cálculos são simulações. Taxas e condições reais de mercado podem variar. Consulte sempre um especialista financeiro para decisões importantes.
              </p>
            </div>
          </section>
        )}

        {activeInfoTab === 'amortizacaoInfo' && (
          <section className="text-left"> {/* Removi o padding e sombra aqui */}
            <h3 className="text-2xl font-semibold text-green-700 mb-3">Amortização de Empréstimo</h3>
            <p className="text-gray-700 mb-2">
              Aqui você pode simular o pagamento de um empréstimo utilizando os sistemas de amortização PRICE ou SAC.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">Campos:</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li><span className="font-semibold">Valor do Empréstimo (R$):</span> O valor total que você pegou emprestado.</li>
              <li><span className="font-semibold">Taxa de Juros (% ao mês):</span> A taxa de juros mensal do empréstimo.</li>
              <li><span className="font-semibold">Período (meses):</span> O número de meses para quitar o empréstimo.</li>
              <li><span className="font-semibold">Tipo de Amortização:</span>
                <ul className="list-circle list-inside ml-4 mt-1">
                  <li><span className="font-semibold">PRICE:</span> Parcelas fixas ao longo do tempo. Os juros são maiores no início e a amortização é menor.</li>
                  <li><span className="font-semibold">SAC (Sistema de Amortização Constante):</span> A amortização do principal é constante, fazendo com que as parcelas diminuam ao longo do tempo (juros calculados sobre um saldo devedor que decresce linearmente).</li>
                </ul>
              </li>
            </ul>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Resultado:</span> Uma tabela detalhada com o saldo devedor, juros, amortização e valor da parcela para cada mês.
            </p>

            <div className="mt-6 p-4 bg-green-50 rounded-lg border border-green-200">
                <h4 className="text-xl font-bold text-green-800 mb-3">Quando usar?</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                    <li>
                        <span className="font-semibold">Simulação de financiamento imobiliário ou veicular:</span> Entenda o valor das parcelas e como o saldo devedor diminui ao longo do tempo, comparando PRICE e SAC.
                    </li>
                    <li>
                        <span className="font-semibold">Planejamento de empréstimos pessoais:</span> Avalie o impacto da taxa de juros e do prazo no custo total do seu empréstimo.
                    </li>
                    <li>
                        <span className="font-semibold">Revisão de contratos existentes:</span> Compare as condições do seu empréstimo atual com novas simulações para buscar melhores ofertas ou entender seu saldo restante.
                    </li>
                    <li>
                        <span className="font-semibold">Decisão sobre amortização extra:</span> Se tiver um dinheiro extra, a calculadora pode ajudar a visualizar o impacto de amortizar a dívida (diminuindo parcelas ou prazo).
                    </li>
                </ul>
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-gray-700">
                Esperamos que esta calculadora seja uma ferramenta útil para suas decisões financeiras!
              </p>
              <p className="text-md text-gray-600 mt-4">
                <span className="font-semibold">Lembre-se:</span> Os cálculos são simulações. Taxas e condições reais de mercado podem variar. Consulte sempre um especialista financeiro para decisões importantes.
              </p>
            </div>
          </section>
        )}

        {activeInfoTab === 'comparacaoInfo' && (
          <section className="text-left"> {/* Removi o padding e sombra aqui */}
            <h3 className="text-2xl font-semibold text-purple-700 mb-3">Comparar Empréstimo vs. Investimento</h3>
            <p className="text-gray-700 mb-2">
              Esta função te ajuda a decidir se é melhor financiar um item (pegando um empréstimo) ou investir o dinheiro que você gastaria na parcela mensal para comprá-lo à vista no futuro.
            </p>
            <p className="text-gray-700 mb-2 font-semibold">Campos:</p>
            <ul className="list-disc list-inside text-gray-600 ml-4">
              <li><span className="font-semibold">Valor do Item Desejado (R$):</span> O custo total do que você quer comprar.</li>
              <li><span className="font-semibold">Quanto pode investir/economizar por mês (R$):</span> O valor da parcela mensal que você pagaria no empréstimo, que será simulado como um investimento mensal.</li>
              <li><span className="font-semibold">Tipo de Investimento (Referência):</span> Uma taxa de juros de referência para o seu investimento (ex: Poupança, Tesouro Selic, ou Personalizado).</li>
              <li><span className="font-semibold">Taxa de Juros Empréstimo (% ao mês):</span> A taxa que o banco cobraria pelo empréstimo.</li>
              <li><span className="font-semibold">Período do Empréstimo (meses):</span> O tempo para quitar o empréstimo.</li>
            </ul>
            <p className="text-gray-700 mt-2">
              <span className="font-semibold">Resultado:</span> Uma análise que mostra o custo total do empréstimo vs. o montante acumulado se você tivesse investido, ajudando a tomar uma decisão informada.
            </p>

            <div className="mt-6 p-4 bg-purple-50 rounded-lg border border-purple-200">
                <h4 className="text-xl font-bold text-purple-800 mb-3">Quando usar?</h4>
                <ul className="list-disc list-inside text-gray-700 ml-4 space-y-2">
                    <li>
                        <span className="font-semibold">Comprar à vista ou financiar?</span> Decida se vale a pena financiar um bem (carro, eletrodoméstico) ou se é mais vantajoso poupar e investir o valor da parcela para comprá-lo à vista depois.
                    </li>
                    <li>
                        <span className="font-semibold">Educação financeira:</span> Entenda o "custo de oportunidade" de tomar um empréstimo versus investir.
                    </li>
                    <li>
                        <span className="font-semibold">Otimização de recursos:</span> Ajuda a identificar a melhor estratégia para o seu dinheiro, seja para adquirir um bem ou para fazê-lo render mais.
                    </li>
                    <li>
                        <span className="font-semibold">Análise de custos a longo prazo:</span> Permite visualizar o impacto financeiro de diferentes decisões ao longo do tempo.
                    </li>
                </ul>
            </div>

            <div className="text-center mt-8">
              <p className="text-lg text-gray-700">
                Esperamos que esta calculadora seja uma ferramenta útil para suas decisões financeiras!
              </p>
              <p className="text-md text-gray-600 mt-4">
                <span className="font-semibold">Lembre-se:</span> Os cálculos são simulações. Taxas e condições reais de mercado podem variar. Consulte sempre um especialista financeiro para decisões importantes.
              </p>
            </div>
          </section>
        )}
      </div> 
    </div> 
  );
}

export default Info;