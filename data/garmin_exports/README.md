# 🏃 Importar Dados do Garmin Connect

## Como Exportar do Garmin Connect

### Opção 1: Exportar Atividade Individual (.FIT)
1. Vai a https://connect.garmin.com
2. Abre uma atividade
3. Clica no ícone de **engrenagem** (⚙️) no canto superior direito
4. Seleciona **"Exportar Original"**
5. Guarda o ficheiro `.fit` na pasta `data/garmin_exports/`

### Opção 2: Exportar Múltiplas Atividades (CSV)
1. Vai a https://connect.garmin.com/modern/activities
2. Seleciona o intervalo de datas
3. Clica em **"Exportar CSV"**
4. Guarda o ficheiro `.csv` na pasta `data/garmin_exports/`

## Como Importar para o Site

### 1. Instala dependências
```bash
pip install -r scripts/requirements.txt
```

### 2. Coloca ficheiros na pasta
```
data/garmin_exports/
  ├── activity_123456.fit
  ├── activity_789012.fit
  └── activities_export.csv
```

### 3. Executa o script
```bash
python scripts/import_garmin_exports.py
```

### 4. Resultado
O script vai:
- ✅ Processar todos os ficheiros .FIT e .CSV
- ✅ Calcular estatísticas (distância, pace, tempo)
- ✅ Gerar `public/data/strava_summary.json`
- ✅ O site vai atualizar automaticamente!

## Formato dos Dados

O script lê:
- **Distância** (km)
- **Tempo** (segundos)
- **Pace** (min/km)
- **Velocidade** (km/h)
- **Frequência Cardíaca** (bpm)
- **Calorias**
- **Data da Atividade**

## Automatização (Opcional)

Podes criar um script batch para automatizar:

```batch
@echo off
echo Importando dados do Garmin...
python scripts/import_garmin_exports.py
echo.
echo Fazendo commit...
git add public/data/strava_summary.json
git commit -m "chore: Update training data from Garmin"
git push
echo Concluído!
```

Guarda como `update_garmin_data.bat` e executa sempre que exportares dados novos.

## 🔄 Sincronização com Strava

Se continuares a usar o Strava, podes manter os dois:
- **Garmin** → Dados mais precisos (manual)
- **Strava** → Atualização automática (GitHub Actions)

Basta renomear o ficheiro de output no script que preferes usar.

---

**Nota:** Os ficheiros .FIT e .CSV **não são commitados** no Git (estão no `.gitignore`). Só o JSON final é versionado.
