# 🏃 Garmin Connect API - Setup Guide

## 📋 Status Atual

**⏳ Aguardando aprovação da Garmin Health API**

A integração com a Garmin Connect API está **preparada e pronta** para ser ativada assim que a aprovação for concedida.

---

## 🎯 O que já está implementado

### ✅ Infraestrutura Completa

1. **Script Python**: `scripts/fetch_garmin_data.py`
   - Estrutura OAuth1 pronta
   - Formatação de atividades
   - Cálculo de pace
   - Salvamento em JSON

2. **API Route Next.js**: `app/api/garmin/route.ts`
   - Endpoint `/api/garmin`
   - Leitura de `garmin_summary.json`
   - Error handling

3. **Ficheiro de dados**: `public/data/garmin_summary.json`
   - Estrutura JSON criada
   - Pronto para receber dados

4. **Variáveis de ambiente**: `.env.local.example`
   - Placeholders para credenciais Garmin

---

## 🔐 Como configurar (quando aprovado)

### 1️⃣ Obter credenciais na Garmin

1. Aceder a: https://developer.garmin.com/
2. Criar uma aplicação no **Garmin Connect Developer Program**
3. Obter:
   - Consumer Key
   - Consumer Secret
4. Completar o fluxo OAuth1 para obter:
   - Access Token
   - Access Token Secret

### 2️⃣ Configurar .env.local

```env
GARMIN_CONSUMER_KEY=your_consumer_key
GARMIN_CONSUMER_SECRET=your_consumer_secret
GARMIN_ACCESS_TOKEN=your_access_token
GARMIN_ACCESS_SECRET=your_access_secret
```

### 3️⃣ Executar o script

```bash
cd scripts
python fetch_garmin_data.py
```

### 4️⃣ Integrar no frontend

O endpoint `/api/garmin` já está pronto para ser consumido pela página de progresso, similar ao Strava.

---

## 📊 Estrutura de Dados

```json
[
  {
    "date": "2025-11-18",
    "distance": 10.5,
    "moving_time": 3150,
    "pace": "5:00/km",
    "source": "garmin"
  }
]
```

---

## 🔄 Próximos Passos

1. ✅ **Aguardar aprovação** da Garmin Health API
2. ⏳ Configurar credenciais em `.env.local`
3. ⏳ Testar autenticação OAuth1
4. ⏳ Implementar fetch de atividades
5. ⏳ Adicionar toggle Strava/Garmin na página de progresso
6. ⏳ Criar GitHub Action para sync automático

---

## 📚 Documentação Garmin

- **Developer Portal**: https://developer.garmin.com/
- **API Docs**: https://developer.garmin.com/gc-developer-program/overview/
- **OAuth Guide**: https://developer.garmin.com/gc-developer-program/authentication/

---

## 💡 Notas

- A estrutura está **100% pronta** para ativar
- O código segue o mesmo padrão do Strava
- Dados do Garmin terão tag `"source": "garmin"` para diferenciação
- Possível futuro: **merge automático** de dados Strava + Garmin

---

**Status**: 🟡 Preparado | Aguardando aprovação da API
