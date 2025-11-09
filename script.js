document.addEventListener("DOMContentLoaded", () => {
  fetch("data/strava_summary.json")
    .then((res) => res.json())
    .then((data) => {
      // Preencher datas
      document.getElementById("week-start").textContent =
        data.week_start || "--";
      document.getElementById("week-end").textContent =
        data.week_end || "--";

      // Preencher métricas
      document.getElementById("distancia").textContent =
        data.total_distance_km ?? "--";
      document.getElementById("pace").textContent =
        data.avg_pace_per_km ?? "--:--";
      document.getElementById("tempo").textContent =
        data.total_time_hours ?? "--";
      document.getElementById("fc").textContent =
        data.avg_heart_rate ?? "--";
      document.getElementById("atividades").textContent =
        data.activities ?? "--";

      // Mensagem quando não há dados
      const msgEl = document.getElementById("no-data-msg");
      if (data.no_data) {
        msgEl.textContent =
          data.message ||
          "Nenhuma corrida encontrada nos últimos 7 dias.";
      } else {
        msgEl.textContent = "Dados extraídos do Strava.";
      }
    })
    .catch((err) => {
      console.error("Erro ao carregar strava_summary.json", err);
      const msgEl = document.getElementById("no-data-msg");
      if (msgEl) {
        msgEl.textContent =
          "Não foi possível carregar os dados do Strava no momento.";
      }
    });
});
