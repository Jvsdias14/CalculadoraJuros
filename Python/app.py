from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np
import requests
import json
from datetime import datetime, timedelta

app = Flask(__name__)
CORS(app)

# --- Funções de Obtenção de Taxas do BCB ---
def get_selic_meta_atual():
    """
    Obtém a taxa Selic anualizada (Série 432) do Banco Central do Brasil.
    Retorna a taxa em percentual.
    """
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"
    
    try:
        response = requests.get(url, timeout=5) # Adicionado timeout
        response.raise_for_status() # Lança exceção para erros HTTP
        data = response.json()
        
        if data and len(data) > 0 and 'valor' in data[0]:
            selic_anual_percentual = float(data[0]['valor'])
            return {"anual": selic_anual_percentual}
        else:
            print("Nenhum dado válido retornado da API do BCB para a Selic.")
            return None
    except requests.exceptions.Timeout:
        print("Tempo limite excedido ao conectar à API do BCB (Selic).")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar ou processar dados da API do BCB (Selic): {e}")
        return None
    except (ValueError, IndexError) as e:
        print(f"Erro ao processar estrutura de dados da API do BCB (Selic): {e}")
        return None

def get_cdi_atual():
    """
    Obtém a taxa DI (CDI) anualizada (Série 12) do Banco Central do Brasil.
    Retorna a taxa em percentual.
    """
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json"
    
    try:
        response = requests.get(url, timeout=5) # Adicionado timeout
        response.raise_for_status() # Lança exceção para erros HTTP
        data = response.json()
        
        if data and len(data) > 0 and 'valor' in data[0]:
            cdi_anual_percentual = float(data[0]['valor'])
            return {"anual": cdi_anual_percentual}
        else:
            print("Nenhum dado válido retornado da API do BCB para o CDI.")
            return None
    except requests.exceptions.Timeout:
        print("Tempo limite excedido ao conectar à API do BCB (CDI).")
        return None
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar ou processar dados da API do BCB (CDI): {e}")
        return None
    except (ValueError, IndexError) as e:
        print(f"Erro ao processar estrutura de dados da API do BCB (CDI): {e}")
        return None

# --- Funções de Cálculo Financeiro ---

def calcular_juros_compostos(principal: float, taxa_mensal_percentual: float, periodo_meses: int):
    """Calcula o valor final dos juros compostos. Taxa deve ser mensal em percentual."""
    if principal <= 0 or periodo_meses <= 0:
        return {"erro": "Principal e período devem ser maiores que zero."}
    if taxa_mensal_percentual < 0:
        return {"erro": "A taxa de juros não pode ser negativa."}

    taxa_mensal_decimal = taxa_mensal_percentual / 100
    
    evolucao_montante_data = []
    saldo_atual = principal
    for mes in range(1, periodo_meses + 1):
        saldo_atual *= (1 + taxa_mensal_decimal)
        evolucao_montante_data.append({"mes": mes, "montante": round(saldo_atual, 2)})

    montante_final = principal * (1 + taxa_mensal_decimal) ** periodo_meses
    
    return {
        "montante_final": round(montante_final, 2),
        "total_juros": round(montante_final - principal, 2),
        "periodo": periodo_meses,
        "evolucao_montante": evolucao_montante_data
    }

def calcular_parcelas_sac(principal: float, taxa_mensal_percentual: float, periodo_meses: int):
    """Calcula as parcelas usando o Sistema de Amortização Constante (SAC)."""
    if principal <= 0 or periodo_meses <= 0: return {"erro": "Principal e período devem ser maiores que zero."}
    if taxa_mensal_percentual < 0: return {"erro": "A taxa de juros não pode ser negativa."}

    taxa_mensal_decimal = taxa_mensal_percentual / 100
    
    amortizacao_constante = principal / periodo_meses
    parcelas = []
    saldo_devedor = principal
    total_juros_pagos = 0.0

    for mes in range(1, periodo_meses + 1):
        juros = saldo_devedor * taxa_mensal_decimal
        valor_parcela = amortizacao_constante + juros
        saldo_devedor -= amortizacao_constante
        
        # Ajuste para evitar saldo negativo flutuante no final
        if saldo_devedor < 0.01 and mes == periodo_meses: # Para a última parcela ser 0
            saldo_devedor = 0.0

        total_juros_pagos += juros
        
        parcelas.append({
            "mes": mes,
            "valor_amortizacao": round(amortizacao_constante, 2),
            "valor_juros": round(juros, 2),
            "valor_parcela": round(valor_parcela, 2),
            "saldo_devedor": round(saldo_devedor, 2)
        })
    return {"tabela_amortizacao": parcelas, "total_juros_pagos": round(total_juros_pagos, 2)}

def calcular_parcelas_price(principal: float, taxa_mensal_percentual: float, periodo_meses: int):
    """Calcula as parcelas usando a Tabela Price."""
    if principal <= 0 or periodo_meses <= 0: return {"erro": "Principal e período devem ser maiores que zero."}
    if taxa_mensal_percentual < 0: return {"erro": "A taxa de juros não pode ser negativa."}

    taxa_mensal_decimal = taxa_mensal_percentual / 100
    
    parcelas = []
    saldo_devedor = principal
    total_juros_pagos = 0.0

    if taxa_mensal_decimal == 0:
        valor_parcela = principal / periodo_meses
    else:
        # Fórmula da parcela Price (PMT)
        try:
            valor_parcela = principal * (taxa_mensal_decimal / (1 - (1 + taxa_mensal_decimal)**(-periodo_meses)))
        except ZeroDivisionError: # Caso (1 - (1+0)^-periodo) dê zero para periodo muito grande e taxa 0
            valor_parcela = principal / periodo_meses # Trata como juros zero
    
    for mes in range(1, periodo_meses + 1):
        juros = saldo_devedor * taxa_mensal_decimal
        amortizacao = valor_parcela - juros
        saldo_devedor -= amortizacao

        # Ajuste para evitar saldo negativo flutuante no final
        if saldo_devedor < 0.01 and mes == periodo_meses: # Para a última parcela ser 0
            saldo_devedor = 0.0

        total_juros_pagos += juros

        parcelas.append({
            "mes": mes,
            "valor_amortizacao": round(amortizacao, 2),
            "valor_juros": round(juros, 2),
            "valor_parcela": round(valor_parcela, 2),
            "saldo_devedor": round(saldo_devedor, 2)
        })
    return {"tabela_amortizacao": parcelas, "total_juros_pagos": round(total_juros_pagos, 2)}


# --- Nova Função de Simulação de Investimento (para Juros Compostos e Comparação) ---
def simular_crescimento_investimento_mensal(valor_inicial: float, investimento_mensal: float, taxa_mensal_decimal: float, periodo_meses: int):
    """
    Simula o crescimento de um investimento com aportes mensais por um período fixo.
    Retorna o histórico de montantes acumulados.
    """
    saldo_atual = valor_inicial
    historico_acumulado = []
    
    for _ in range(periodo_meses):
        saldo_atual = (saldo_atual + investimento_mensal) * (1 + taxa_mensal_decimal)
        historico_acumulado.append(round(saldo_atual, 2))
        
    return historico_acumulado

# --- Função de Comparação Aprimorada ---
def comparar_investimento_emprestimo_api(
    valor_desejado: float, investimento_mensal: float, tipo_investimento: str,
    taxa_investimento_personalizada_anual: float,
    taxa_emprestimo_mensal_percentual: float, periodo_emprestimo_meses: int
):
    # --- Obter Taxas do BCB ---
    selic_meta = get_selic_meta_atual()
    cdi_taxa = get_cdi_atual()

    if not selic_meta or not cdi_taxa:
        return {"erro": "Não foi possível obter as taxas financeiras do Banco Central. Tente novamente mais tarde."}

    taxa_investimento_anual_percentual = 0.0 # Inicializa com float
    
    if tipo_investimento == 'POUPANCA':
        if selic_meta['anual'] > 8.5:
            # Poupança: 0.5% ao mês + TR (TR geralmente é insignificante, focamos no 0.5%)
            taxa_investimento_anual_percentual = ((1 + 0.005)**12 - 1) * 100 
        else:
            taxa_investimento_anual_percentual = selic_meta['anual'] * 0.70
    elif tipo_investimento == 'TESOURO_SELIC':
        taxa_investimento_anual_percentual = selic_meta['anual']
    elif tipo_investimento == 'CDB_CDI':
        taxa_investimento_anual_percentual = cdi_taxa['anual'] * 1.0 # Assumindo 100% do CDI
    elif tipo_investimento == 'LCI_LCA':
        taxa_investimento_anual_percentual = cdi_taxa['anual'] * 0.90 # Assumindo 90% do CDI, isento de IR
    elif tipo_investimento == 'PERSONALIZADO':
        taxa_investimento_anual_percentual = taxa_investimento_personalizada_anual
    else:
        return {"erro": 'Tipo de investimento inválido.'}

    # Converter taxa anual de investimento para mensal decimal para a simulação
    taxa_investimento_mensal_decimal = (1 + (taxa_investimento_anual_percentual / 100))**(1/12) - 1

    # --- Simulação de Empréstimo (com histórico de custo acumulado) ---
    # Usaremos a função calcular_parcelas_price que já retorna o dicionário com a tabela.
    # É importante passar a taxa em PERCENTUAL para calcular_parcelas_price.
    resultado_emprestimo = calcular_parcelas_price(valor_desejado, taxa_emprestimo_mensal_percentual, periodo_emprestimo_meses)
    
    if "erro" in resultado_emprestimo:
        return {"erro": f"Erro no cálculo do empréstimo: {resultado_emprestimo['erro']}"}

    parcelas_emprestimo = resultado_emprestimo['tabela_amortizacao']
    total_juros_emprestimo = resultado_emprestimo['total_juros_pagos']
    total_pago_emprestimo = sum(p['valor_parcela'] for p in parcelas_emprestimo) if parcelas_emprestimo else 0

    # --- Construção do Comparativo de Evolução (Mês a Mês) ---
    comparativo_evolucao_data = []
    saldo_investimento_acumulado = 0.0
    custo_total_emprestimo_acumulado = 0.0

    for mes in range(1, periodo_emprestimo_meses + 1):
        # Evolução do Investimento
        saldo_investimento_acumulado = (saldo_investimento_acumulado + investimento_mensal) * (1 + taxa_investimento_mensal_decimal)

        # Evolução do Custo do Empréstimo
        if mes <= len(parcelas_emprestimo):
            custo_total_emprestimo_acumulado += parcelas_emprestimo[mes-1]['valor_parcela']
        
        comparativo_evolucao_data.append({
            "mes": mes,
            "investimento_acumulado": round(saldo_investimento_acumulado, 2),
            "custo_total_emprestimo": round(custo_total_emprestimo_acumulado, 2)
        })

    # Pega o valor final acumulado do investimento no último mês
    valor_acumulado_investindo = comparativo_evolucao_data[-1]["investimento_acumulado"] if comparativo_evolucao_data else 0

    # --- Decisão Sugerida e Insights ---
    decisao_sugerida = ""
    insight_investimento = ""
    investimento_mensal_necessario = 0.0

    # Cenário principal: O investimento atingiu (ou superou) o valor do item desejado no prazo?
    if valor_acumulado_investindo >= valor_desejado:
        decisao_sugerida = "É **extremamente mais vantajoso investir** para comprar à vista, pois você atingiria o valor do item no prazo desejado e economizaria consideravelmente os juros abusivos do empréstimo."
        economia = max(0, total_pago_emprestimo - valor_acumulado_investindo)
        insight_investimento = (
            f"Parabéns! Com seu investimento mensal, você consegue acumular R$ {valor_acumulado_investindo:.2f} "
            f"em {periodo_emprestimo_meses} meses, superando ou atingindo o valor do item. "
            f"Isso representa uma economia de R$ {economia:.2f} em comparação com o empréstimo."
        )
    else:
        # Investimento NÃO atingiu o objetivo no prazo
        # Cálculo de quanto precisaria investir para atingir o valor desejado
        if periodo_emprestimo_meses > 0:
            if taxa_investimento_mensal_decimal == 0:
                investimento_mensal_necessario = valor_desejado / periodo_emprestimo_meses
            else:
                try:
                    investimento_mensal_necessario = (valor_desejado * taxa_investimento_mensal_decimal) / ((1 + taxa_investimento_mensal_decimal)**periodo_emprestimo_meses - 1)
                except ZeroDivisionError:
                    investimento_mensal_necessario = valor_desejado # Se o denominador for zero (periodo 0, o que já é tratado)
        else:
            investimento_mensal_necessario = valor_desejado # Se periodo for 0, precisa do valor total
        
        if total_pago_emprestimo > (valor_desejado * 1.3): # Exemplo: se o custo do empréstimo é 30% maior que o valor desejado (considerado caro)
            decisao_sugerida = (
                f"O custo total do empréstimo (R$ {total_pago_emprestimo:.2f}) é muito alto. "
                f"Apesar de não atingir o objetivo de R$ {valor_desejado:.2f} em {periodo_emprestimo_meses} meses investindo (acumulou R$ {valor_acumulado_investindo:.2f}), "
                f"recomenda-se **reavaliar a compra ou buscar outras opções de financiamento/investimento**, pois o empréstimo atual seria uma dívida exorbitante."
            )
            insight_investimento = (
                f"Para atingir o valor de R$ {valor_desejado:.2f} investindo em {periodo_emprestimo_meses} meses "
                f"com a taxa de {taxa_investimento_anual_percentual:.2f}% a.a., "
                f"você precisaria investir aproximadamente R$ {investimento_mensal_necessario:.2f} por mês."
            )
        else:
            decisao_sugerida = (
                f"O empréstimo permitiria adquirir o item imediatamente com um custo total de R$ {total_pago_emprestimo:.2f}. "
                f"Seu investimento mensal de R$ {investimento_mensal:.2f} acumulou R$ {valor_acumulado_investindo:.2f} "
                f"em {periodo_emprestimo_meses} meses. Avalie a urgência da compra: se puder esperar, "
                f"continuar investindo seria mais econômico no longo prazo, mesmo que leve mais tempo para atingir o valor total."
            )
            insight_investimento = (
                f"Para atingir o valor de R$ {valor_desejado:.2f} investindo em {periodo_emprestimo_meses} meses "
                f"com a taxa de {taxa_investimento_anual_percentual:.2f}% a.a., "
                f"você precisaria investir aproximadamente R$ {investimento_mensal_necessario:.2f} por mês."
            )
    
    return {
        "valor_item_desejado": round(valor_desejado, 2),
        "investimento_mensal_simulado": round(investimento_mensal, 2),
        "periodo_comparacao": periodo_emprestimo_meses,
        "custo_total_emprestimo": round(total_pago_emprestimo, 2),
        "valor_acumulado_investimento": round(valor_acumulado_investindo, 2),
        "decisao_sugerida": decisao_sugerida,
        "insight_investimento": insight_investimento,
        "comparativo_evolucao": comparativo_evolucao_data
    }

# --- Rotas da API ---

@app.route('/calcular_juros_compostos', methods=['POST'])
def rota_calcular_juros_compostos():
    data = request.get_json()
    principal = float(data.get('principal', 0) or 0)
    taxa = float(data.get('taxa', 0) or 0) 
    periodo = int(data.get('periodo', 0) or 0)

    resultado = calcular_juros_compostos(principal, taxa, periodo)
    
    if "erro" in resultado:
        return jsonify(resultado), 400 # Retorna erro com status 400
    return jsonify(resultado)

@app.route('/calcular_amortizacao', methods=['POST'])
def rota_calcular_amortizacao():
    data = request.get_json()
    principal = float(data.get('principal', 0) or 0)
    taxa = float(data.get('taxa', 0) or 0)
    periodo = int(data.get('periodo', 0) or 0)
    tipo_amortizacao = data.get('tipo_amortizacao', '').upper()

    # Chame a função de cálculo e verifique se retornou um erro
    if tipo_amortizacao == 'SAC':
        resultado_calculo = calcular_parcelas_sac(principal, taxa, periodo)
    elif tipo_amortizacao == 'PRICE':
        resultado_calculo = calcular_parcelas_price(principal, taxa, periodo)
    else:
        return jsonify({'erro': 'Tipo de amortização inválido. Escolha SAC ou PRICE.'}), 400

    if "erro" in resultado_calculo:
        return jsonify(resultado_calculo), 400 # Retorna erro com status 400

    parcelas = resultado_calculo['tabela_amortizacao']
    total_juros_pagos = resultado_calculo['total_juros_pagos']
    
    primeira_parcela = parcelas[0]['valor_parcela'] if parcelas else 0
    ultima_parcela = parcelas[-1]['valor_parcela'] if parcelas else 0
    
    return jsonify({
        'valor_emprestimo': principal,
        'taxa_juros_mensal': taxa,
        'total_parcelas': periodo,
        'tipo_amortizacao': tipo_amortizacao,
        'total_juros_pagos': total_juros_pagos,
        'primeira_parcela': primeira_parcela,
        'ultima_parcela': ultima_parcela,
        'tabela_amortizacao': parcelas
    })

@app.route('/comparar_investimento_emprestimo', methods=['POST'])
def rota_comparar_investimento_emprestimo():
    data = request.get_json()
    valor_desejado = float(data.get('valor_desejado', 0) or 0)
    investimento_mensal = float(data.get('investimento_mensal', 0) or 0)
    tipo_investimento = data.get('tipo_investimento', '') 
    taxa_investimento_personalizada_anual = float(data.get('taxa_investimento_personalizada_anual', 0) or 0)
    
    taxa_emprestimo_mensal_percentual = float(data.get('taxa_emprestimo_mensal', 0) or 0)
    periodo_emprestimo_meses = int(data.get('periodo_emprestimo', 0) or 0)

    # Validar entradas para comparação (movido para dentro da função de comparação para centralizar)
    
    resultado = comparar_investimento_emprestimo_api(
        valor_desejado, investimento_mensal, tipo_investimento,
        taxa_investimento_personalizada_anual,
        taxa_emprestimo_mensal_percentual, periodo_emprestimo_meses
    )
    
    if "erro" in resultado:
        return jsonify(resultado), 500
    return jsonify(resultado)


# --- Rota para obter taxas do BCB diretamente para o frontend ---
@app.route('/obter_taxas_bcb', methods=['GET'])
def obter_taxas_bcb():
    selic = get_selic_meta_atual()
    cdi = get_cdi_atual()

    if selic and cdi:
        return jsonify({
            "selic_anual": selic["anual"],
            "cdi_anual": cdi["anual"]
        })
    else:
        return jsonify({"erro": "Não foi possível obter as taxas do Banco Central. Tente novamente mais tarde."}), 500

if __name__ == '__main__':
    app.run(debug=True, port=5000) # Mantém o debug para desenvolvimento