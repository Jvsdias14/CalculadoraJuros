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
    # Série 432: Taxa Selic acumulada no mês (meta diária) - É a Selic anualizada
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.432/dados/ultimos/1?formato=json"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if data:
            selic_anual_percentual = float(data[0]['valor'])
            # Retorna em formato de percentual
            return {"anual": selic_anual_percentual}
        else:
            print("Nenhum dado retornado da API do BCB para a Selic.")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar à API do BCB (Selic): {e}")
        return None
    except (ValueError, IndexError) as e:
        print(f"Erro ao processar dados da API do BCB (Selic): {e}")
        return None

def get_cdi_atual():
    # Série 12: Taxa DI (CDI) - Over / Extra-grupo - Também é anualizada
    url = "https://api.bcb.gov.br/dados/serie/bcdata.sgs.12/dados/ultimos/1?formato=json"
    
    try:
        response = requests.get(url)
        response.raise_for_status()
        data = response.json()
        
        if data:
            cdi_anual_percentual = float(data[0]['valor'])
            # Retorna em formato de percentual
            return {"anual": cdi_anual_percentual}
        else:
            print("Nenhum dado retornado da API do BCB para o CDI.")
            return None
    except requests.exceptions.RequestException as e:
        print(f"Erro ao conectar à API do BCB (CDI): {e}")
        return None
    except (ValueError, IndexError) as e:
        print(f"Erro ao processar dados da API do BCB (CDI): {e}")
        return None

# --- Funções de Cálculo Financeiro ---

def calcular_juros_compostos(principal, taxa_mensal_percentual, periodo_meses):
    """Calcula o valor final dos juros compostos. Taxa deve ser mensal em percentual."""
    taxa_mensal_decimal = taxa_mensal_percentual / 100
    montante = principal * (1 + taxa_mensal_decimal) ** periodo_meses
    return montante

def calcular_parcelas_sac(principal, taxa_mensal_percentual, periodo_meses):
    """Calcula as parcelas usando o Sistema de Amortização Constante (SAC)."""
    taxa_mensal_decimal = taxa_mensal_percentual / 100
    if periodo_meses == 0: return []
    
    amortizacao_constante = principal / periodo_meses
    parcelas = []
    saldo_devedor = principal

    for mes in range(1, periodo_meses + 1):
        juros = saldo_devedor * taxa_mensal_decimal
        valor_parcela = amortizacao_constante + juros
        saldo_devedor -= amortizacao_constante
        
        # Garante que o saldo devedor não fique negativo devido a arredondamentos
        if saldo_devedor < 0.001: saldo_devedor = 0 

        parcelas.append({
            "mes": mes,
            "valor_amortizacao": round(amortizacao_constante, 2),
            "valor_juros": round(juros, 2),
            "valor_parcela": round(valor_parcela, 2),
            "saldo_devedor": round(saldo_devedor, 2)
        })
    return parcelas

def calcular_parcelas_price(principal, taxa_mensal_percentual, periodo_meses):
    """Calcula as parcelas usando a Tabela Price."""
    taxa_mensal_decimal = taxa_mensal_percentual / 100
    if periodo_meses == 0: return []
    
    parcelas = []
    saldo_devedor = principal

    if taxa_mensal_decimal == 0:
        valor_parcela = principal / periodo_meses
    else:
        # Fórmula da parcela Price (PMT)
        valor_parcela = principal * (taxa_mensal_decimal / (1 - (1 + taxa_mensal_decimal)**(-periodo_meses)))

    for mes in range(1, periodo_meses + 1):
        juros = saldo_devedor * taxa_mensal_decimal
        amortizacao = valor_parcela - juros
        saldo_devedor -= amortizacao

        # Garante que o saldo devedor não fique negativo devido a arredondamentos
        if saldo_devedor < 0.001: saldo_devedor = 0

        parcelas.append({
            "mes": mes,
            "valor_amortizacao": round(amortizacao, 2),
            "valor_juros": round(juros, 2),
            "valor_parcela": round(valor_parcela, 2),
            "saldo_devedor": round(saldo_devedor, 2)
        })
    return parcelas

# --- Nova Função de Simulação de Investimento ---
def simular_investimento(valor_desejado, investimento_mensal, taxa_mensal_decimal):
    """
    Simula o crescimento de um investimento mensal até atingir um valor desejado.
    Retorna o número de meses, rendimentos totais e o valor total investido.
    """
    saldo_atual = 0
    meses = 0
    total_investido_pelo_usuario = 0
    
    # Limite para evitar loops infinitos em objetivos inatingíveis ou taxas muito baixas
    max_meses = 360 # 30 anos
    
    while saldo_atual < valor_desejado:
        meses += 1
        # Aplica rendimento ao saldo existente
        saldo_atual = saldo_atual * (1 + taxa_mensal_decimal)
        # Adiciona o novo investimento mensal
        saldo_atual += investimento_mensal
        total_investido_pelo_usuario += investimento_mensal

        if meses >= max_meses and saldo_atual < valor_desejado:
            return {
                "meses": meses,
                "valor_final_atingido": round(saldo_atual, 2),
                "total_investido_pelo_usuario": round(total_investido_pelo_usuario, 2),
                "total_rendimentos": round(saldo_atual - total_investido_pelo_usuario, 2),
                "mensagem": f"O objetivo de {valor_desejado:.2f} foi atingido em {meses} meses. Total investido: {total_investido_pelo_usuario:.2f}, Rendimentos: {saldo_atual - total_investido_pelo_usuario:.2f}"
            }
            # Se atingiu o limite de meses e não atingiu o objetivo
            # return {"erro": "Demasiado tempo para atingir o objetivo com este investimento mensal e taxa.",
            #         "meses_simulados": meses,
            #         "saldo_final_atingido": round(saldo_atual, 2),
            #         "total_investido_pelo_usuario": round(total_investido_pelo_usuario, 2)}
            
    total_rendimentos = saldo_atual - total_investido_pelo_usuario
    return {
        "meses": meses,
        "valor_final_atingido": round(saldo_atual, 2),
        "total_investido_pelo_usuario": round(total_investido_pelo_usuario, 2),
        "total_rendimentos": round(total_rendimentos, 2),
        "mensagem": f"O objetivo de {valor_desejado:.2f} foi atingido em {meses} meses. Total investido: {total_investido_pelo_usuario:.2f}, Rendimentos: {total_rendimentos:.2f}"
    }

# --- Rotas da API ---

@app.route('/calcular_juros_compostos', methods=['POST'])
def rota_calcular_juros_compostos():
    data = request.get_json()
    principal = float(data.get('principal', 0))
    taxa = float(data.get('taxa', 0)) # Assumindo taxa mensal em percentual
    periodo = int(data.get('periodo', 0))
    resultado = calcular_juros_compostos(principal, taxa, periodo)
    return jsonify({'valor_final': round(resultado, 2)})

@app.route('/calcular_amortizacao', methods=['POST'])
def rota_calcular_amortizacao():
    data = request.get_json()
    principal = float(data.get('principal', 0))
    taxa = float(data.get('taxa', 0)) # Assumindo taxa mensal em percentual
    periodo = int(data.get('periodo', 0))
    tipo_amortizacao = data.get('tipo_amortizacao', '').upper()

    if tipo_amortizacao == 'SAC':
        parcelas = calcular_parcelas_sac(principal, taxa, periodo)
    elif tipo_amortizacao == 'PRICE':
        parcelas = calcular_parcelas_price(principal, taxa, periodo)
    else:
        return jsonify({'erro': 'Tipo de amortização inválido'}), 400

    return jsonify({'parcelas': parcelas})

@app.route('/comparar_investimento_emprestimo', methods=['POST'])
def rota_comparar_investimento_emprestimo():
    data = request.get_json()
    valor_desejado = float(data.get('valor_desejado', 0))
    investimento_mensal = float(data.get('investimento_mensal', 0))
    tipo_investimento = data.get('tipo_investimento', '') # POUPANCA, TESOURO_SELIC, CDB_CDI, LCI_LCA, PERSONALIZADO
    taxa_investimento_personalizada_anual = float(data.get('taxa_investimento_personalizada_anual', 0)) # Se tipo_investimento for PERSONALIZADO
    
    # Parâmetros para simulação de empréstimo (do custo do item desejado)
    taxa_emprestimo_mensal_percentual = float(data.get('taxa_emprestimo_mensal', 0))
    periodo_emprestimo_meses = int(data.get('periodo_emprestimo', 0))

    # --- Obter Taxas do BCB ---
    selic_meta = get_selic_meta_atual()
    cdi_taxa = get_cdi_atual()

    if not selic_meta or not cdi_taxa:
        return jsonify({'erro': 'Não foi possível obter as taxas financeiras do Banco Central. Tente novamente mais tarde.'}), 500

    taxa_investimento_anual_percentual = 0
    
    if tipo_investimento == 'POUPANCA':
        # Regra da poupança:
        # Se Selic anual > 8.5%, rende 0.5% ao mês + TR (TR é desprezível, usamos 0.5% a.m.)
        # Se Selic anual <= 8.5%, rende 70% da Selic anual + TR (usamos 70% da Selic)
        if selic_meta['anual'] > 8.5:
            # Converte 0.5% ao mês para anual para padronizar
            taxa_investimento_anual_percentual = ((1 + 0.005)**12 - 1) * 100
        else:
            taxa_investimento_anual_percentual = selic_meta['anual'] * 0.70
    elif tipo_investimento == 'TESOURO_SELIC':
        # Tesouro Selic rende a taxa Selic. Usamos a Selic anual do BCB.
        taxa_investimento_anual_percentual = selic_meta['anual']
    elif tipo_investimento == 'CDB_CDI':
        # CDB 100% CDI rende o CDI. Usamos o CDI anual do BCB.
        taxa_investimento_anual_percentual = cdi_taxa['anual']
    elif tipo_investimento == 'LCI_LCA':
        # LCI/LCA: Geralmente um percentual do CDI, e são isentas de IR.
        # Estimamos 85% do CDI anual para fins de comparação com rendimentos líquidos.
        taxa_investimento_anual_percentual = cdi_taxa['anual'] * 0.85
    elif tipo_investimento == 'PERSONALIZADO':
        taxa_investimento_anual_percentual = taxa_investimento_personalizada_anual
    else:
        return jsonify({'erro': 'Tipo de investimento inválido.'}), 400

    # Converter taxa anual de investimento para mensal decimal para a simulação
    taxa_investimento_mensal_decimal = (1 + (taxa_investimento_anual_percentual / 100))**(1/12) - 1

    # --- Simulação de Investimento ---
    resultado_investimento = simular_investimento(valor_desejado, investimento_mensal, taxa_investimento_mensal_decimal)
    
    # --- Simulação de Empréstimo ---
    # Usamos o método Price para a simulação de empréstimo aqui
    parcelas_emprestimo = calcular_parcelas_price(valor_desejado, taxa_emprestimo_mensal_percentual, periodo_emprestimo_meses)
    
    total_juros_emprestimo = sum(p['valor_juros'] for p in parcelas_emprestimo)
    total_pago_emprestimo = valor_desejado + total_juros_emprestimo

    # --- Comparação e Resumo ---
    comparacao_resumo = {
        "investimento": {
            "meses_para_atingir": resultado_investimento.get('meses'),
            "valor_final_atingido": resultado_investimento.get('valor_final_atingido'),
            "total_investido_pelo_usuario": resultado_investimento.get('total_investido_pelo_usuario'),
            "total_rendimentos": resultado_investimento.get('total_rendimentos'),
            "mensagem": resultado_investimento.get('mensagem'),
            "taxa_anual_aplicada": round(taxa_investimento_anual_percentual, 2),
            "investimento_mensal": investimento_mensal
        },
        "emprestimo": {
            "principal": valor_desejado,
            "taxa_mensal_percentual": taxa_emprestimo_mensal_percentual,
            "periodo_meses": periodo_emprestimo_meses,
            "total_juros_pagos": round(total_juros_emprestimo, 2),
            "total_pago": round(total_pago_emprestimo, 2),
            "parcelas": parcelas_emprestimo
        },
        "decisao_sugerida": ""
    }

    # Lógica simples para sugestão
    if resultado_investimento.get('meses') and resultado_investimento['meses'] <= periodo_emprestimo_meses:
        if total_juros_emprestimo > resultado_investimento['total_rendimentos']:
             comparacao_resumo["decisao_sugerida"] = "Pode ser mais vantajoso investir, pois você atingiria o objetivo no prazo ou antes, e teria rendimentos em vez de juros."
        else:
             comparacao_resumo["decisao_sugerida"] = "Analise com cuidado. Mesmo investindo, o custo final pode ser similar ou superior ao empréstimo dependendo das taxas."
    elif resultado_investimento.get('meses') and resultado_investimento['meses'] > periodo_emprestimo_meses:
        comparacao_resumo["decisao_sugerida"] = "O empréstimo permitiria a compra em menos tempo. Investir levaria mais tempo, mas sem dívida."
    else: # Caso de erro na simulação de investimento
        comparacao_resumo["decisao_sugerida"] = "Não foi possível simular o investimento para comparação."


    return jsonify(comparacao_resumo)


if __name__ == '__main__':
    app.run(debug=True)