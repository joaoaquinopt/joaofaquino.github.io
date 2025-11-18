export default function PrivacyPolicy() {
  return (
    <main className="max-w-3xl mx-auto px-6 py-12 text-gray-200">
      <h1 className="text-3xl font-bold text-blue-400 mb-6">
        Política de Privacidade — João Aquino
      </h1>

      <p className="mb-4">
        O site <strong>joaofaquino.run</strong> é um projeto pessoal criado por João Aquino para documentar a sua jornada até à Maratona de 2026.
      </p>

      <p className="mb-4">
        Este site poderá integrar dados provenientes de plataformas externas, como Strava e Garmin Connect, exclusivamente com o objetivo de exibir métricas pessoais de treino (distância, ritmo, duração e frequência cardíaca).
      </p>

      <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
        Coleta e uso de dados
      </h2>
      <p className="mb-4">
        Nenhum dado pessoal é armazenado, partilhado ou vendido. Todos os dados exibidos são obtidos através de APIs oficiais com autenticação segura e utilizados apenas para fins informativos e pessoais.
      </p>

      <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">
        Integrações externas
      </h2>
      <p className="mb-4">
        A integração com a Garmin Connect e/ou Strava é realizada de forma autenticada, respeitando as políticas de privacidade de cada serviço.
        O acesso aos dados é apenas leitura, e nenhuma informação é modificada ou reenviada a terceiros.
      </p>

      <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Segurança</h2>
      <p className="mb-4">
        O site utiliza conexão HTTPS e segue boas práticas de segurança para proteger os dados transferidos entre as APIs e o navegador.
      </p>

      <h2 className="text-xl font-semibold text-blue-300 mt-6 mb-3">Contato</h2>
      <p className="mb-4">
        Em caso de dúvidas sobre esta política, entre em contacto através de{" "}
        <a href="mailto:jmfaquino@gmail.com" className="text-blue-400 underline">
          jmfaquino@gmail.com
        </a>.
      </p>

      <p className="text-sm text-gray-400 mt-10">
        Última atualização: {new Date().toLocaleDateString("pt-PT")}
      </p>
    </main>
  );
}
