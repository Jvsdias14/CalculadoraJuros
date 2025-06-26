# 📊 Calculadora Financeira

Este é um projeto de uma Calculadora Financeira abrangente, desenvolvida com um backend em Python (Flask) para os cálculos financeiros e um frontend em React para a interface do usuário. A aplicação permite realizar cálculos de juros compostos, simular a amortização de empréstimos (Tabela Price e SAC) e comparar cenários de empréstimo versus investimento.

## ✨ Funcionalidades

A calculadora oferece três funcionalidades principais para auxiliar no planejamento e nas decisões financeiras:

### 1. Juros Compostos
* **Propósito:** Calcule o valor futuro de um investimento com base em um capital inicial, aportes mensais (opcional, mas comum para juros compostos), uma taxa de juros e um período. Ideal para simular o crescimento de poupanças, investimentos ou até mesmo entender o impacto de dívidas.
* **Cálculo:** Utiliza a fórmula de juros compostos para determinar o montante final e o total de juros acumulados, além de exibir a evolução mês a mês do montante.
* **Quando usar:** Planejamento de aposentadoria, grandes compras, comparação de investimentos de longo prazo, entendimento de dívidas e simulação de investimentos para filhos/netos.
* **Campos:** Capital Inicial (R$), Taxa de Juros (% ao mês) e Período (meses).

### 2. Amortização de Empréstimos
* **Propósito:** Simule a tabela de amortização de um empréstimo, permitindo visualizar a composição das parcelas (juros e amortização) e a evolução do saldo devedor ao longo do tempo.
* **Sistemas Suportados:** Tabela Price (parcelas fixas) e Sistema de Amortização Constante (SAC - parcelas decrescentes, amortização constante).
* **Campos:** Valor do Empréstimo (R$), Taxa Mensal (%) e Período (meses), além da seleção do Tipo de Amortização.

### 3. Comparação: Empréstimo vs. Investimento
* **Propósito:** Ajuda a tomar decisões financeiras ao comparar o custo total de um item adquirido via empréstimo com o valor acumulado ao investir o mesmo montante da parcela simulada.
* **Análise:** Oferece um resumo comparativo com o custo total do empréstimo, o valor acumulado investindo e uma decisão sugerida, além de insights.
* **Visualização:** Apresenta um gráfico que ilustra a evolução comparativa do investimento acumulado versus o custo total do empréstimo ao longo do tempo, facilitando a compreensão visual.
* **Campos:** Valor do Item Desejado (R$), Quanto pode investir/economizar por mês (R$), Tipo de Investimento (Referência), Taxa de Juros Empréstimo (% ao mês) e Período do Empréstimo (meses).

## 🚀 Tecnologias Utilizadas

Este projeto é dividido em duas partes principais:

### Backend (API)

* **Python:** Linguagem de programação principal para a lógica de negócio e cálculos financeiros.
* **Flask:** Microframework web para criar a API REST que serve os cálculos ao frontend.

### Frontend (Interface do Usuário)

* **React.js:** Biblioteca JavaScript para construir a interface de usuário interativa e responsiva.
* **Chart.js / React-Chartjs-2:** Para a renderização de gráficos, especialmente na seção de Comparação.
* **Tailwind CSS:** Framework CSS utilitário para estilização rápida e responsiva dos componentes.

## ⚙️ Como Rodar a Aplicação

Para configurar e rodar este projeto em sua máquina, siga os passos abaixo:

### Pré-requisitos

Certifique-se de ter o seguinte software instalado:

* **Python 3.11** ou superior
* **pip** (gerenciador de pacotes do Python)
* **Node.js** (LTS recomendado)
* **npm** ou **yarn** (gerenciador de pacotes do Node.js)

### 1. Clonar o Repositório

```
git clone https://github.com/Jvsdias14/CalculadoraJuros.git
cd CalculadoraJuros
```

### 2. Configurar e Rodar o Backend (API Python)
Navegue até a pasta "Python" (que contém o app.py e o requirements.txt).

```
cd Python 
```

Crie e ative um Ambiente Virtual (venv):
```
python -m venv venv
venv\Scripts\activate # No Windows
# source venv/bin/activate # No Linux/macOS
```
Com o ambiente virtual ativado, instale as dependências listadas no requirements.txt:
```
pip install -r requirements.txt
```
Agora, rode o servidor Flask:
```
python app.py
```
O servidor da API deverá estar rodando em http://127.0.0.1:5000. Deixe este terminal aberto.

### 3. Configurar e Rodar o Frontend (React.js)
Abra um novo terminal (Prompt de Comando ou PowerShell) e navegue até a pasta do frontend.

```
cd frontend
```
Instale as dependências do Node.js:
```
npm install
# ou
yarn install
```
Agora, inicie a aplicação React:
```
npm start
# ou
yarn start
```
O navegador deverá abrir automaticamente a aplicação em http://localhost:3000 (ou outra porta disponível). Deixe este terminal aberto.

Agora você terá tanto o backend quanto o frontend rodando, e a aplicação estará pronta para uso!
