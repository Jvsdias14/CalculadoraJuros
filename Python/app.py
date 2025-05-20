# backend/app.py
from flask import Flask, request, jsonify
from flask_cors import CORS
import numpy as np

app = Flask(__name__)
CORS(app)  # Habilita o CORS para permitir requisições do frontend

def calcular_juros_compostos(principal, taxa, periodo):
    """Calcula o valor final dos juros compostos."""
    taxa_decimal = taxa / 100
    montante = principal * (1 + taxa_decimal) ** periodo
    return montante

def calcular_parcelas_sac(principal, taxa, periodo):
    """Calcula as parcelas usando o Sistema de Amortização Constante (SAC)."""
    taxa_mensal = taxa / 100
    amortizacao = principal / periodo
    parcelas = []
    saldo_devedor = principal
    for mes in range(1, periodo + 1):
        juros = saldo_devedor * taxa_mensal
        valor_parcela = amortizacao + juros
        saldo_devedor -= amortizacao
        parcelas.append({
            "mes": mes,
            "valor_amortizacao": amortizacao,
            "valor_juros": juros,
            "valor_parcela": valor_parcela,
            "saldo_devedor": saldo_devedor
        })
    return parcelas

def calcular_parcelas_price(principal, taxa, periodo):
    """Calcula as parcelas usando a Tabela Price."""
    taxa_mensal = taxa / 100
    if taxa_mensal == 0:
        valor_parcela = principal / periodo
    else:
        fator = ((1 + taxa_mensal) ** periodo * taxa_mensal) / ((1 + taxa_mensal) ** periodo - 1)
        valor_parcela = principal * fator
    parcelas = []
    saldo_devedor = principal
    for mes in range(1, periodo + 1):
        juros = saldo_devedor * taxa_mensal
        amortizacao = valor_parcela - juros
        saldo_devedor -= amortizacao
        parcelas.append({
            "mes": mes,
            "valor_amortizacao": amortizacao,
            "valor_juros": juros,
            "valor_parcela": valor_parcela,
            "saldo_devedor": saldo_devedor
        })
    return parcelas

@app.route('/calcular_juros_compostos', methods=['POST'])
def rota_calcular_juros_compostos():
    data = request.get_json()
    principal = float(data.get('principal', 0))
    taxa = float(data.get('taxa', 0))
    periodo = int(data.get('periodo', 0))
    resultado = calcular_juros_compostos(principal, taxa, periodo)
    return jsonify({'valor_final': resultado})

@app.route('/calcular_amortizacao', methods=['POST'])
def rota_calcular_amortizacao():
    data = request.get_json()
    principal = float(data.get('principal', 0))
    taxa = float(data.get('taxa', 0))
    periodo = int(data.get('periodo', 0))
    tipo_amortizacao = data.get('tipo_amortizacao', '').upper()

    if tipo_amortizacao == 'SAC':
        parcelas = calcular_parcelas_sac(principal, taxa, periodo)
    elif tipo_amortizacao == 'PRICE':
        parcelas = calcular_parcelas_price(principal, taxa, periodo)
    else:
        return jsonify({'erro': 'Tipo de amortização inválido'}), 400

    return jsonify({'parcelas': parcelas})

if __name__ == '__main__':
    app.run(debug=True)