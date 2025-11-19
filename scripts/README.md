# 🏃 Sistema de Importação de Dados Garmin

Sistema automático para importar e gerir dados de treino do Garmin Connect.

---

## 📋 Scripts Disponíveis

### 🚀 **update_training_data.py** (RECOMENDADO)
**Script tudo-em-um** que faz todo o processo automaticamente.

```bash
python scripts/update_training_data.py
```

**O que faz:**
1. ✅ Cria backup automático dos dados existentes
2. ✅ Importa novas atividades (sem duplicar)
3. ✅ Faz commit e push para GitHub automaticamente
4. ✅ Pergunta se queres apagar os CSVs após importar

---

### 📦 **import_garmin_incremental.py**
Importa APENAS novas atividades (modo incremental).

```bash
python scripts/import_garmin_incremental.py
```

**Quando usar:**
- Queres importar dados SEM fazer commit no Git
- Queres controlar manualmente o backup
- Só precisas adicionar novas corridas

---

### 💾 **backup_data.py**
Cria backup manual dos dados.

```bash
python scripts/backup_data.py
```

**Quando usar:**
- Antes de fazer mudanças arriscadas
- Para criar snapshot dos dados atuais
- Backups ficam em `data/backups/`

---

### 📥 **import_garmin_exports.py**
Script original (substitui TODOS os dados).

```bash
python scripts/import_garmin_exports.py
```

**⚠️ ATENÇÃO:** Este script **apaga** dados antigos!  
Use apenas se quiseres começar do zero.

---

## 🎯 Workflow Recomendado

### **Quando tiveres novas corridas:**

1. **Exporta atividades do Garmin Connect**
   - Vai a [connect.garmin.com](https://connect.garmin.com)
   - Seleciona as atividades novas
   - Exporta em formato **CSV**

2. **Coloca os ficheiros CSV aqui:**
   ```
   data/garmin_exports/
   ```

3. **Executa o script automático:**
   ```bash
   python scripts/update_training_data.py
   ```

4. **Relaxa! 🎉**
   - Backup ✅
   - Import ✅
   - Git commit ✅
   - Deploy automático no Vercel ✅

---

## 📁 Estrutura de Dados

### **Ficheiro principal:**
```
public/data/garmin_summary.json
```

### **Backups:**
```
data/backups/garmin_backup_2025-11-19_18-30-00.json
data/backups/garmin_backup_2025-11-20_08-15-00.json
...
```

### **Exports temporários:**
```
data/garmin_exports/activity_123.csv
data/garmin_exports/activity_124.csv
```

---

## 🔧 Formato dos Dados

### **CSV do Garmin (entrada)**
```csv
Date,Distance,Time,Calories,Avg HR
2025-11-19 08:30:00,10.5,3600,650,155
```

### **JSON gerado (saída)**
```json
{
  "total_distance": 58.66,
  "total_runs": 7,
  "activities": [
    {
      "date": "2025-11-19 08:30:00",
      "distance": 10.5,
      "total_time": 3600,
      "calories": 650,
      "average_heartrate": 155,
      "average_pace": 5.71,
      "average_speed": 10.5
    }
  ]
}
```

---

## 🛡️ Proteção de Dados

### **Tripla Segurança:**

1. **Backups locais**
   - Automáticos em `data/backups/`
   - Com timestamp (nunca são sobrescritos)

2. **Git histórico**
   - Todo commit guardado no GitHub
   - Podes restaurar qualquer versão antiga

3. **Modo incremental**
   - Nunca apaga dados existentes
   - Apenas adiciona novas atividades

---

## 📊 Como o Gráfico se Adapta

O dashboard **adapta-se automaticamente**:

- ✅ **7 corridas** → mostra 7 barras
- ✅ **50 corridas** → mostra 50 barras
- ✅ **Barra mais alta** = sempre a maior distância
- ✅ **Percentagens** recalculadas automaticamente

---

## 🚨 Resolução de Problemas

### **Erro: "Nenhum ficheiro CSV encontrado"**
```bash
# Verifica se colocaste os CSVs na pasta correta:
ls data/garmin_exports/
```

### **Erro: "Git não encontrado"**
```bash
# Instala o Git:
# Windows: https://git-scm.com/download/win
# Ou faz commit manualmente depois
```

### **Atividades duplicadas?**
O script **deteta automaticamente** e ignora duplicados pela data.

### **Quero restaurar backup antigo**
```bash
# Copia o backup para o ficheiro principal:
cp data/backups/garmin_backup_2025-11-19_18-30-00.json public/data/garmin_summary.json
```

---

## 💡 Dicas

1. **Exporta regularmente** do Garmin (semanalmente)
2. **Usa o script automático** (`update_training_data.py`)
3. **Não apagues** a pasta `data/backups/`
4. **Commit frequente** no Git = histórico completo
5. **Verifica o site** após cada import

---

## 🔗 Links Úteis

- 🌐 Site: [joaofaquino.run](https://joaofaquino.run)
- 📊 Dashboard: [joaofaquino.run/progress](https://joaofaquino.run/progress)
- 🏃 Garmin Connect: [connect.garmin.com](https://connect.garmin.com)

---

**Desenvolvido com 💙 para o projeto Maratona 2026**
