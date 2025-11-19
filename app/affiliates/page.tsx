"use client";

import Reveal from "../../components/Reveal";
import ModernCard from "../../components/ModernCard";
import { Store, ExternalLink, ShoppingCart, Package } from "lucide-react";

export default function AffiliatesPage() {
  const affiliates = [
    {
      name: "Amazon",
      icon: <ShoppingCart className="w-6 h-6 text-orange-400" />,
      description: "Equipamentos, suplementos e acessórios para corrida",
      category: "Equipamento Geral",
      products: [
        "Garmin Forerunner 255",
        "Ténis de corrida Nike/Adidas",
        "Mochilas de hidratação",
        "Suplementos desportivos"
      ],
      link: "https://amazon.com",
      discount: "Vários descontos disponíveis"
    },
    {
      name: "Decathlon",
      icon: <Store className="w-6 h-6 text-blue-400" />,
      description: "Vestuário e equipamentos desportivos acessíveis",
      category: "Vestuário & Equipamento",
      products: [
        "Camisolas técnicas",
        "Calções de corrida",
        "Meias de compressão",
        "Acessórios de corrida"
      ],
      link: "https://decathlon.pt",
      discount: "Promoções regulares"
    },
    {
      name: "MyProtein",
      icon: <Package className="w-6 h-6 text-green-400" />,
      description: "Suplementação e nutrição desportiva de qualidade",
      category: "Nutrição Desportiva",
      products: [
        "Whey Protein",
        "Géis energéticos",
        "Barras proteicas",
        "Vitaminas e minerais"
      ],
      link: "https://myprotein.pt",
      discount: "40% OFF com código JOAO40"
    },
    {
      name: "Prozis",
      icon: <Package className="w-6 h-6 text-purple-400" />,
      description: "Suplementação europeia premium",
      category: "Nutrição Desportiva",
      products: [
        "Proteínas",
        "Aminoácidos",
        "Snacks saudáveis",
        "Acessórios fitness"
      ],
      link: "https://prozis.com",
      discount: "10% OFF em compras"
    }
  ];

  return (
    <section className="max-w-7xl mx-auto mt-8 px-4 min-h-screen pb-20">
      {/* Header */}
      <Reveal>
        <div className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-3">
            Parceiros & Afiliados
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            Lojas e marcas parceiras onde encontro os melhores produtos para treino
          </p>
          <div className="flex items-center gap-2 text-sm text-gray-500">
            <span>💡</span>
            <p>Apoie o projeto usando os links abaixo! 🙏</p>
          </div>
        </div>
      </Reveal>

      {/* Info Card */}
      <Reveal delay={0.1}>
        <div className="mb-8 p-6 bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-white/10 rounded-2xl">
          <h3 className="text-lg font-semibold text-white mb-2">Como Funciona?</h3>
          <p className="text-gray-300 text-sm">
            Quando compras através dos meus links de afiliado, ajudas a manter este projeto ativo 
            <strong className="text-blue-400"> sem qualquer custo extra para ti</strong>. 
            Recomendo apenas produtos que uso ou confio!
          </p>
        </div>
      </Reveal>

      {/* Affiliates Grid */}
      <div className="grid gap-6 md:grid-cols-2">
        {affiliates.map((affiliate, index) => (
          <Reveal key={affiliate.name} delay={0.1 + index * 0.05}>
            <ModernCard
              title={affiliate.name}
              subtitle={affiliate.category}
              icon={affiliate.icon}
              collapsible={true}
              defaultExpanded={index === 0}
            >
              <div className="space-y-4">
                {/* Description */}
                <p className="text-gray-300 text-sm">{affiliate.description}</p>

                {/* Products List */}
                <div>
                  <h4 className="text-sm font-semibold text-white mb-2">Produtos Recomendados:</h4>
                  <ul className="space-y-2">
                    {affiliate.products.map((product) => (
                      <li key={product} className="flex items-center gap-2 text-sm text-gray-400">
                        <span className="w-1.5 h-1.5 bg-blue-400 rounded-full"></span>
                        {product}
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Discount Badge */}
                {affiliate.discount && (
                  <div className="p-3 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-sm text-green-400 font-medium">
                      🎉 {affiliate.discount}
                    </p>
                  </div>
                )}

                {/* CTA Button */}
                <a
                  href={affiliate.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 w-full px-4 py-3 bg-blue-500 hover:bg-blue-600 text-white font-medium rounded-lg transition-all duration-200 hover:scale-[1.02]"
                >
                  <span>Ver Produtos</span>
                  <ExternalLink className="w-4 h-4" />
                </a>
              </div>
            </ModernCard>
          </Reveal>
        ))}
      </div>

      {/* Disclaimer */}
      <Reveal delay={0.4}>
        <div className="mt-12 p-4 bg-white/5 border border-white/10 rounded-lg">
          <p className="text-xs text-gray-400 text-center">
            ⚠️ Os links podem conter códigos de afiliado. Ao comprar através deles, 
            posso receber uma pequena comissão, sem custo adicional para ti.
          </p>
        </div>
      </Reveal>
    </section>
  );
}
