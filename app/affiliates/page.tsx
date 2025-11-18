"use client";

import PageWrapper from "../../components/PageWrapper";
import Reveal from "../../components/Reveal";

export default function AffiliatesPage() {
  const affiliates = [
    {
      name: "Amazon",
      logo: "🛒",
      description: "Equipamentos, suplementos e acessórios para corrida",
      color: "from-orange-600 to-orange-800",
      products: [
        {
          name: "Produto exemplo 1",
          image: "/assets/products/product1.jpg",
          link: "https://amazon.com/product1"
        },
        {
          name: "Produto exemplo 2",
          image: "/assets/products/product2.jpg",
          link: "https://amazon.com/product2"
        }
      ]
    },
    {
      name: "Decathlon",
      logo: "🏃",
      description: "Vestuário e equipamentos desportivos",
      color: "from-blue-600 to-blue-800",
      products: []
    },
    {
      name: "MyProtein",
      logo: "💪",
      description: "Suplementação e nutrição desportiva",
      color: "from-green-600 to-green-800",
      products: []
    }
  ];

  return (
    <PageWrapper>
      <div className="max-w-6xl mx-auto mt-12 px-4 min-h-screen pb-20">
        {/* Header */}
        <div className="text-center mb-16">
          <h1 className="text-5xl font-bold text-blue-400 mb-4">
            Parceiros & Afiliados
          </h1>
          <p className="text-gray-300 text-lg max-w-2xl mx-auto">
            Lojas e marcas parceiras onde encontro os melhores produtos para treino.
            Apoie o projeto usando os links abaixo! 🙏
          </p>
        </div>

        {/* Affiliates Grid */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {affiliates.map((affiliate, index) => (
            <Reveal key={affiliate.name} delay={index * 0.1}>
              <div className="bg-blue-900/40 border border-blue-700/60 rounded-2xl overflow-hidden hover:border-blue-500/80 transition-all">
                <div className="p-6">
                  {/* Card Header */}
                  <div className={`bg-gradient-to-br ${affiliate.color} rounded-xl p-6 text-center mb-4`}>
                    <div className="text-6xl mb-3">{affiliate.logo}</div>
                    <h2 className="text-2xl font-bold text-white">{affiliate.name}</h2>
                  </div>

                  {/* Description */}
                  <p className="text-gray-300 text-sm mb-4 text-center">
                    {affiliate.description}
                  </p>

                  {/* Action Button */}
                  <button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-all duration-300 hover:scale-105"
                    onClick={() => {
                      alert(`Ver produtos de ${affiliate.name}`);
                    }}
                  >
                    Ver Produtos 🛍️
                  </button>

                  {/* Products Count */}
                  {affiliate.products.length > 0 && (
                    <p className="text-gray-500 text-xs text-center mt-2">
                      {affiliate.products.length} produto(s) recomendado(s)
                    </p>
                  )}
                </div>
              </div>
            </Reveal>
          ))}
        </div>

        {/* Info Banner */}
        <div className="mt-16 bg-gradient-to-r from-blue-600 to-purple-600 rounded-2xl p-8 text-center">
          <h3 className="text-2xl font-bold text-white mb-3">
            💡 Como Funciona?
          </h3>
          <p className="text-blue-100 max-w-3xl mx-auto">
            Quando compras através dos meus links de afiliado, ajudas a manter este projeto ativo
            sem qualquer custo extra para ti. Recomendo apenas produtos que uso ou confio! 
          </p>
        </div>

        {/* Disclaimer */}
        <div className="mt-8 text-center">
          <p className="text-gray-500 text-sm">
            ⚠️ Os links podem conter códigos de afiliado. Ao comprar através deles,
            posso receber uma pequena comissão, sem custo adicional para ti.
          </p>
        </div>
      </div>
    </PageWrapper>
  );
}
