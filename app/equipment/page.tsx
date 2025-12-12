"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import { ChevronDown, ExternalLink, X, Watch, Footprints, Shirt, Pill, Headphones } from "lucide-react";
import Image from "next/image";
import styles from "./equipment.module.css";
import { useTranslation } from "../../components/TranslationProvider";

// Tipos
type ProductType = "affiliate" | "personal";
type Category = "shoes" | "watch" | "clothing" | "supplements" | "accessories";
type Region = "pt" | "br";
type RecommendationGroup = "daily" | "performance" | "female" | "trail";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  type: ProductType;
  price?: string;
  image?: string;
  link?: string;
  description: string;
  specs?: string[];
  status?: "main" | "backup" | "retired";
  region?: Region;
  recommendationGroup?: RecommendationGroup;
}

interface Partner {
  id: string;
  name: string;
  logo?: string;
  url: string;
  description: string;
  region: Region;
}

const categoryLabels: Record<Category, string> = {
  shoes: "Ténis",
  watch: "Relógios",
  clothing: "Roupa",
  supplements: "Suplementos",
  accessories: "Acessórios",
};

const categoryIcons: Record<Category, React.ComponentType<{ size?: number; className?: string }>> = {
  shoes: Footprints,
  watch: Watch,
  clothing: Shirt,
  supplements: Pill,
  accessories: Headphones,
};

const recommendationGroupsOrder: RecommendationGroup[] = [
  "daily",
  "performance",
  "female",
  "trail",
];

const recommendationGroupConfig: Record<
  RecommendationGroup,
  { icon: string; title: string; description: string }
> = {
  daily: {
    icon: "🏃‍♂️",
    title: "Treino Diário & Versáteis",
    description: "Modelos equilibrados para cumprir quilometragem sem drama.",
  },
  performance: {
    icon: "🏃‍♀️",
    title: "Performance Leve / Ritmo",
    description: "Opções rápidas para séries, ritmo e dias em que o relógio importa.",
  },
  female: {
    icon: "👟",
    title: "Modelos Específicos para Mulher",
    description: "Calçado pensado para anatomia feminina e ajustes precisos.",
  },
  trail: {
    icon: "🏞️",
    title: "Trail & Off-Road",
    description: "Ténis com grip e proteção para explorar estradões e trilhos.",
  },
};

const regionGroupPlaceholders: Record<Region, string> = {
  pt: "Sem sugestões nesta categoria com os filtros selecionados.",
  br: "Vou atualizar esta categoria com parceiros brasileiros muito em breve.",
};

const partnerRegionEmptyMessages: Record<Region, string> = {
  pt: "Ainda não há parceiros listados nesta categoria para Portugal.",
  br: "Estou a fechar novas parcerias brasileiras — em breve atualizo!",
};

// Dados dos produtos
const products: Product[] = [
  // EQUIPAMENTO PESSOAL
  {
    id: "adidas-supernova-2",
    name: "Adidas Supernova 2",
    brand: "Adidas",
    category: "shoes",
    type: "personal",
    description: "Ténis de treino diário para volumes médios e longos.",
    specs: ["Boost + Bounce", "Drop 9mm", "Peso 275g", "Suporte neutro"],
    status: "main",
    image: "/assets/gear/adidas-supernova-2.jpg",
  },
  {
    id: "adidas-adizero-pro-4",
    name: "Adidas Adizero Pro 4",
    brand: "Adidas",
    category: "shoes",
    type: "personal",
    description: "Modelo de velocidade para treinos fortes e provas curtas.",
    specs: ["Placa carbono", "Lightstrike Pro", "Drop 6mm", "Pisada rápida"],
    status: "main",
    image: "/assets/gear/adidas-adizero-pro-4.jpg",
  },
  {
    id: "adidas-galaxy-7",
    name: "Adidas Galaxy 7",
    brand: "Adidas",
    category: "shoes",
    type: "personal",
    description: "Opção acessível para corridas fáceis e uso diário.",
    specs: ["EVA Cloudfoam", "Drop 10mm", "Peso 285g", "Rotina casual"],
    status: "backup",
    image: "/assets/gear/adidas-galaxy-7.jpg",
  },
  {
    id: "asics-novablast-5-tr",
    name: "ASICS Novablast 5 TR",
    brand: "ASICS",
    category: "shoes",
    type: "personal",
    description: "Ténis versátil para estrada e trilhos leves.",
    specs: ["FF BLAST+", "Drop 8mm", "Peso 275g", "Tração híbrida"],
    status: "main",
    image: "/assets/gear/asics-novablast-5-tr.jpg",
  },
  {
    id: "garmin-255",
    name: "Garmin Forerunner 255",
    brand: "Garmin",
    category: "watch",
    type: "personal",
    description: "Relógio GPS principal para todos os treinos.",
    specs: ["GPS Multibanda", "Autonomia 14 dias", "Monitor FC no pulso", "Métricas avançadas"],
    status: "main",
    image: "/assets/gear/garmin-forerunner-255-photo.jpg",
  },
  // AFILIADOS / RECOMENDADOS
  {
    id: "adidas-adizero-evo-sl",
    name: "Adidas Adizero Evo SL",
    brand: "Adidas",
    category: "shoes",
    type: "affiliate",
    price: "€109,00",
    link: "https://tidd.ly/4q4DfKC",
    description: "Leve e responsivo, ótimo para treino rápido, ritmo moderado e sessões de intervalos.",
    specs: ["Dinamismo e leveza", "Drop 6mm", "Peso 224g"],
    image: "/assets/gear/adizero-evo-sl.jpg",
    region: "pt",
    recommendationGroup: "daily",
  },
  {
    id: "adidas-adizero-boston-13",
    name: "Adidas Adizero Boston 13",
    brand: "Adidas",
    category: "shoes",
    type: "affiliate",
    price: "€159,00",
    link: "https://tidd.ly/4oUOUuK",
    description: "Ótimo everyday trainer com bom retorno de energia e conforto.",
    specs: ["LIGHTSTRIKE 2.0", "Drop 8mm", "Peso 260g"],
    image: "/assets/gear/adizero-boston-13.jpg",
    region: "pt",
    recommendationGroup: "daily",
  },
  {
    id: "nike-vomero-plus",
    name: "Nike Vomero Plus",
    brand: "Nike",
    category: "shoes",
    type: "affiliate",
    price: "€179,99",
    link: "https://tidd.ly/4iSNeQM",
    description: "Ótimo everyday trainer com bom retorno de energia e conforto.",
    specs: ["LIGHTSTRIKE 2.0", "Drop 8mm", "Peso 260g"],
    image: "/assets/gear/vomero-plus-mens.jpg",
    region: "pt",
    recommendationGroup: "daily",
  },
  {
    id: "cloudswift-4",
    name: "Cloudswift 4",
    brand: "ON Running",
    category: "shoes",
    type: "affiliate",
    price: "€152,19",
    link: "https://tidd.ly/3YpzFiq",
    description: "Confortável e estável, boa opção “all-round runner”.",
    specs: ["Forward rolling", "Drop 6mm", "Peso 275g"],
    image: "/assets/gear/cloudswift-4.jpg",
    region: "pt",
    recommendationGroup: "daily",
  },
  {
    id: "new-balance-garoe-v2",
    name: "New Balance Garoe V2",
    brand: "New Balance",
    category: "shoes",
    type: "affiliate",
    price: "€119,99",
    link: "https://tidd.ly/3XMHoHf",
    description: "Opção boa e acessível para correr confortável sem exagerar no preço.",
    specs: ["Fresh Foam X", "Peso 304g"],
    image: "/assets/gear/newbalancegaroev2.jpg",
    region: "pt",
    recommendationGroup: "performance",
  },
  {
    id: "saucony-ride-18",
    name: "Saucony Ride 18",
    brand: "Saucony",
    category: "shoes",
    type: "affiliate",
    price: "€149,00",
    link: "https://tidd.ly/3XQT4Zy",
    description: "Clássico conforto Saucony com ótimo equilíbrio amortecimento ↔ retorno.",
    specs: ["PWRRUN+", "Drop 8mm", "Peso 259g"],
    image: "/assets/gear/sauconyride18.jpg",
    region: "pt",
    recommendationGroup: "performance",
  },
  {
    id: "altra-torin-8",
    name: "Altra Torin 8",
    brand: "Altra",
    category: "shoes",
    type: "affiliate",
    price: "€160,99",
    link: "https://tidd.ly/4pZxnlW",
    description: "Drop zero e espaço para antepé, ideal para quem curte pisada natural.",
    specs: ["Altra EGO MAX", "Drop 0mm", "Peso 288g"],
    image: "/assets/gear/altratorin8.jpg",
    region: "pt",
    recommendationGroup: "performance",
  },
  {
    id: "salomon-sense-ride-5",
    name: "Salomon Sense Ride 5",
    brand: "Salomon",
    category: "shoes",
    type: "affiliate",
    price: "€139,99",
    link: "https://tidd.ly/4f0Spy3",
    description: "Grip agressivo e estabilidade para trilhos húmidos ou serras portuguesas.",
    specs: ["All Terrain Contagrip", "Drop 8mm", "Peso 286g", "Quicklace"],
    region: "pt",
    recommendationGroup: "trail",
  },
  {
    id: "olympikus-vortex-5",
    name: "Olympikus Vortex 5",
    brand: "Olympikus",
    category: "shoes",
    type: "affiliate",
    price: "R$ 399,90",
    link: "https://www.olympikus.com.br/tenis-de-corrida-olympikus-vortex-5",
    description: "Tênis brasileiro acessível para treinos diários e rodagens na cidade.",
    specs: ["Espuma Eleva", "Drop 10mm", "Peso 278g"],
    region: "br",
    recommendationGroup: "daily",
  },
  {
    id: "mizuno-wave-rebellion-pro-2-br",
    name: "Mizuno Wave Rebellion Pro 2",
    brand: "Mizuno",
    category: "shoes",
    type: "affiliate",
    price: "R$ 1.499,90",
    link: "https://www.mizuno.com.br/wave-rebellion-pro-2",
    description: "Opção agressiva para provas rápidas e treinos de ritmo no calor brasileiro.",
    specs: ["Enerzy Lite+", "Placa de carbono", "Drop 4mm"],
    region: "br",
    recommendationGroup: "performance",
  },
  {
    id: "fila-kr5-feminino",
    name: "Fila KR5 Feminino",
    brand: "Fila",
    category: "shoes",
    type: "affiliate",
    price: "R$ 699,90",
    link: "https://www.fila.com.br/kr5-feminino",
    description: "Modelo leve pensado para corredoras que querem resposta rápida em provas de 5K a 21K.",
    specs: ["Ennergize PRO", "Drop 6mm", "Peso 185g"],
    region: "br",
    recommendationGroup: "female",
  },
  {
    id: "adidas-terrex-agravic-speed-br",
    name: "adidas Terrex Agravic Speed",
    brand: "adidas",
    category: "shoes",
    type: "affiliate",
    price: "R$ 899,90",
    link: "https://www.adidas.com.br/tenis-terrex-agravic-speed",
    description: "Tração Continental e proteção leve para trilhos técnicos no Brasil.",
    specs: ["Continental Rubber", "Drop 6mm", "Peso 255g"],
    region: "br",
    recommendationGroup: "trail",
  },
  {
    id: "maurten-gel-100",
    name: "Maurten Gel 100",
    brand: "Maurten",
    category: "supplements",
    type: "affiliate",
    price: "€35 (pack 12)",
    link: "https://amzn.to/4rHV83O",
    description: "Gel de hidrogel para corridas longas e treinos longões.",
    specs: ["25g carboidratos", "Sem sabor", "Fácil digestão"],
    image: "/assets/gear/maurten-gel-100.jpg",
    region: "pt",
    recommendationGroup: "performance",
  },
  {
    id: "coros-pod-2",
    name: "COROS POD 2",
    brand: "COROS",
    category: "accessories",
    type: "affiliate",
    price: "€89",
    link: "https://amzn.to/48vvI0f",
    description: "Sensor de dinâmica para analisar cadência, oscilação e forma.",
    specs: ["Cadência", "Oscilação vertical", "Tempo de contacto", "Bateria 28h"],
    image: "/assets/gear/coros-pod-2.jpg",
    region: "pt",
    recommendationGroup: "performance",
  },
];

const partners: Partner[] = [
  {
    id: "sportzone-pt",
    name: "Sport Zone",
    logo: "/assets/brand/partners/sportzone-pt.png",
    url: "https://tidd.ly/3KdqaQ6",
    description: "Equipamento desportivo em Portugal",
    region: "pt",
  },
  {
    id: "decathlon-pt",
    name: "Decathlon Portugal",
    logo: "/assets/brand/partners/decathlon.png",
    url: "https://tidd.ly/48uK7tG",
    description: "Desporto acessível para todos",
    region: "pt",
  },
  {
    id: "amazon-es",
    name: "Amazon ES",
    logo: "/assets/brand/partners/amazon.png",
    url: "https://amzn.to/4oCcFYq",
    description: "Suplementos e acessórios",
    region: "pt",
  },
  {
    id: "adidas-br",
    name: "Adidas Brasil",
    logo: "/assets/brand/partners/adidas.png",
    url: "https://tidd.ly/4pytdl5",
    description: "Performance running gear",
    region: "br",
  },
  {
    id: "netshoes",
    name: "Netshoes Brasil",
    logo: "/assets/brand/partners/netshoes.svg",
    url: "https://www.netshoes.com.br/corrida",
    description: "Marketplace brasileiro com curadoria forte de corrida.",
    region: "br",
  },
  {
    id: "mizuno-br",
    name: "Mizuno Brasil",
    logo: "/assets/brand/partners/mizuno-usa.png",
    url: "https://www.mizuno.com.br",
    description: "Tecnologia japonesa adaptada ao calor brasileiro.",
    region: "br",
  },
  {
    id: "nike-br",
    name: "Nike Brasil",
    logo: "/assets/brand/partners/nike (1).png",
    url: "https://tidd.ly/4jd0RuF",
    description: "Marca brasileira focada em running lifestyle premium.",
    region: "br",
  },
];

export default function EquipmentPage() {
  const { t } = useTranslation();
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [filtersVisible, setFiltersVisible] = useState(true);
  const [showTypeFilter, setShowTypeFilter] = useState(true);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);
  const [activeProduct, setActiveProduct] = useState<Product | null>(null);

  useEffect(() => {
    if (!activeProduct) {
      return;
    }

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setActiveProduct(null);
      }
    };

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [activeProduct]);

  const openProductDetails = (product: Product) => {
    setActiveProduct(product);
  };

  const closeProductDetails = () => {
    setActiveProduct(null);
  };

  // Filtrar produtos
  const filteredProducts = products.filter((product) => {
    if (selectedType !== "all" && product.type !== selectedType) return false;
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    return true;
  });

  const allAffiliateProducts = products.filter((product) => product.type === "affiliate");
  const personalProducts = filteredProducts.filter(p => p.type === "personal");
  const affiliateProducts = filteredProducts.filter(p => p.type === "affiliate");
  const resolveRegion = (product: Product): Region => product.region ?? "pt";
  const resolveRecommendationGroup = (product: Product): RecommendationGroup =>
    product.recommendationGroup ?? "daily";
  const affiliateInventoryByRegion: Record<Region, Product[]> = { pt: [], br: [] };
  allAffiliateProducts.forEach((product) => {
    affiliateInventoryByRegion[resolveRegion(product)].push(product);
  });
  const regionOrder: Region[] = ["pt", "br"];
  const partnersByRegion: Record<Region, Partner[]> = { pt: [], br: [] };
  partners.forEach((partner) => {
    partnersByRegion[partner.region].push(partner);
  });
  const isAffiliateTypeVisible = selectedType === "all" || selectedType === "affiliate";
  const shouldRenderAffiliateSection =
    isAffiliateTypeVisible &&
    (affiliateProducts.length > 0 || regionOrder.some((region) => affiliateInventoryByRegion[region]?.length));
  const ActiveIcon = activeProduct ? categoryIcons[activeProduct.category] : null;

  const formatItemCount = (count: number) =>
    `${count} ${count === 1 ? t("equipment.itemSingular") : t("equipment.itemPlural")}`;

  const statusLabels: Record<NonNullable<Product["status"]>, string> = {
    main: "Principal",
    backup: "Backup",
    retired: "Reformado",
  };

  const resolveStatusLabel = (product: Product) => {
    if (product.type === "affiliate") {
      return t("equipment.affiliates.partnerLabel");
    }
    if (product.status) {
      return statusLabels[product.status];
    }
    return undefined;
  };

  const renderProductTile = (product: Product) => {
    const Icon = categoryIcons[product.category];
    const statusLabel = resolveStatusLabel(product);
    const badgeClass =
      product.type === "affiliate" ? styles.cardBadgeAffiliate : styles.cardBadge;

    return (
      <button
        key={`${product.id}-${product.type}`}
        type="button"
        className={`${styles.productTile} ${product.type === "affiliate" ? styles.productTileAffiliate : ""}`}
        aria-label={`${product.name} (${product.brand})`}
        onClick={() => openProductDetails(product)}
      >
        <article className={styles.productTileInner}>
          <div className={styles.productCover}>
            {product.image ? (
              <Image
                src={product.image}
                alt={`${product.name} (${product.brand})`}
                width={800}
                height={600}
                sizes="(max-width: 768px) 92vw, 320px"
                className={styles.productCoverImage}
              />
            ) : (
              <div className={styles.productCoverPlaceholder}>{product.brand}</div>
            )}
            <div className={styles.productBadgeRow}>
              <span className={styles.productCategoryIcon}>
                <Icon size={18} />
              </span>
              {statusLabel && (
                <span
                  className={badgeClass}
                  data-status={product.type === "affiliate" ? undefined : product.status}
                >
                  {statusLabel}
                </span>
              )}
            </div>
            <div className={styles.productNameRibbon}>
              <span className={styles.productBrandLabel}>{product.brand}</span>
              <span className={styles.productNameLabel}>{product.name}</span>
            </div>
          </div>
        </article>
      </button>
    );
  };

  return (
    <PageWrapper>
      <div className={styles.equipmentPage}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <h1 className={styles.title}>{t("equipment.title")}</h1>
            <p className={styles.subtitle}>{t("equipment.subtitle")}</p>
          </div>
          <button
            className={styles.hideFiltersBtn}
            onClick={() => setFiltersVisible((prev) => !prev)}
          >
            {filtersVisible ? "Esconder filtros" : "Mostrar filtros"}
          </button>
        </div>

        <div className={styles.content}>
          {/* SIDEBAR - Filtros */}
          {filtersVisible && (
            <aside className={styles.sidebar}>
              {/* Filtro: Tipo */}
              <div className={styles.filterSection}>
                <button
                  onClick={() => setShowTypeFilter(!showTypeFilter)}
                  className={`${styles.filterHeader} ${!showTypeFilter ? styles.collapsed : ""}`}
                >
                  <span>Tipo</span>
                  <ChevronDown className={styles.filterChevron} />
                </button>

                {showTypeFilter && (
                  <div className={styles.filterOptions}>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === "all"}
                        onChange={() => setSelectedType("all")}
                      />
                      <span>Todos</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === "personal"}
                        onChange={() => setSelectedType("personal")}
                      />
                      <span>Meu Equipamento</span>
                    </label>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="type"
                        checked={selectedType === "affiliate"}
                        onChange={() => setSelectedType("affiliate")}
                      />
                      <span>Recomendados</span>
                    </label>
                  </div>
                )}
              </div>

              {/* Filtro: Categoria */}
              <div className={styles.filterSection}>
                <button
                  onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                  className={`${styles.filterHeader} ${!showCategoryFilter ? styles.collapsed : ""}`}
                >
                  <span>Categoria</span>
                  <ChevronDown className={styles.filterChevron} />
                </button>

                {showCategoryFilter && (
                  <div className={styles.filterOptions}>
                    <label className={styles.filterOption}>
                      <input
                        type="radio"
                        name="category"
                        checked={selectedCategory === "all"}
                        onChange={() => setSelectedCategory("all")}
                      />
                      <span>Todas</span>
                    </label>
                    {(Object.keys(categoryLabels) as Category[]).map((cat) => (
                      <label key={cat} className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === cat}
                          onChange={() => setSelectedCategory(cat)}
                        />
                        <span>{categoryLabels[cat]}</span>
                      </label>
                    ))}
                  </div>
                )}
              </div>
            </aside>
          )}

          {/* MAIN CONTENT */}
          <main className={`${styles.mainContent} ${!filtersVisible ? styles.mainContentFull : ""}`}>

            {/* Meu Equipamento */}
            {(selectedType === "all" || selectedType === "personal") && personalProducts.length > 0 && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>🏃</span>
                    {t("equipment.myGear")}
                  </h2>
                  <span className={styles.sectionCount}>{formatItemCount(personalProducts.length)}</span>
                </div>

                <div className={styles.productGrid}>
                  {personalProducts.map(renderProductTile)}
                </div>
              </section>
            )}

            {/* Produtos Afiliados */}
            {shouldRenderAffiliateSection && (
              <section className={styles.section}>
                <div className={styles.sectionHeader}>
                  <h2 className={styles.sectionTitle}>
                    <span className={styles.sectionIcon}>⭐</span>
                    {t("equipment.affiliates.title")}
                  </h2>
                  <span className={styles.sectionCount}>{formatItemCount(affiliateProducts.length)}</span>
                </div>
                <p className={styles.sectionSubtitle}>{t("equipment.affiliates.subtitle")}</p>

                <div className={styles.affiliatesWrapper}>
                  {regionOrder.map((region) => {
                    const label =
                      region === "pt"
                        ? t("equipment.affiliates.region.pt")
                        : t("equipment.affiliates.region.br");
                    const regionProducts = affiliateProducts.filter(
                      (product) => resolveRegion(product) === region
                    );
                    const hasCatalog = (affiliateInventoryByRegion[region] ?? []).length > 0;
                    const countLabel = hasCatalog
                      ? formatItemCount(regionProducts.length)
                      : formatItemCount(0);

                    return (
                      <div key={region} className={styles.regionBlock}>
                        <div className={styles.regionHeader}>
                          <span className={styles.regionLabel}>{label}</span>
                          <span className={styles.regionCount}>{countLabel}</span>
                        </div>
                        {hasCatalog ? (
                          <div className={styles.regionGroups}>
                            {recommendationGroupsOrder.map((group) => {
                              const groupMeta = recommendationGroupConfig[group];
                              const groupProducts = regionProducts.filter(
                                (product) => resolveRecommendationGroup(product) === group
                              );
                              const groupCount = groupProducts.length;

                              return (
                                <div key={`${region}-${group}`} className={styles.regionGroup}>
                                  <div className={styles.regionGroupHeader}>
                                    <div className={styles.regionGroupMeta}>
                                      <span className={styles.regionGroupIcon}>{groupMeta.icon}</span>
                                      <div className={styles.regionGroupText}>
                                        <p className={styles.regionGroupTitle}>{groupMeta.title}</p>
                                        <p className={styles.regionGroupDescription}>{groupMeta.description}</p>
                                      </div>
                                    </div>
                                    <span className={styles.regionGroupCount}>{formatItemCount(groupCount)}</span>
                                  </div>
                                  {groupCount > 0 ? (
                                    <div className={styles.productGrid}>
                                      {groupProducts.map(renderProductTile)}
                                    </div>
                                  ) : (
                                    <div className={styles.regionEmpty}>
                                      {regionGroupPlaceholders[region]}
                                    </div>
                                  )}
                                </div>
                              );
                            })}
                          </div>
                        ) : (
                          <div className={styles.regionEmpty}>{t("equipment.affiliates.emptyRegion")}</div>
                        )}
                      </div>
                    );
                  })}
                </div>
              </section>
            )}

            {/* Mensagem quando não há produtos */}
            {filteredProducts.length === 0 && (
              <div className={styles.emptyState}>
                <p>Nenhum produto encontrado com os filtros selecionados.</p>
              </div>
            )}

            {/* Parceiros */}
            <section className={styles.section}>
              <div className={styles.sectionHeader}>
                <h2 className={styles.sectionTitle}>
                  <span className={styles.sectionIcon}>🤝</span>
                  {t("equipment.partners.title")}
                </h2>
              </div>
              <p className={styles.sectionSubtitle}>{t("equipment.partners.subtitle")}</p>

              <div className={styles.affiliatesWrapper}>
                {regionOrder.map((region) => {
                  const regionLabel =
                    region === "pt"
                      ? t("equipment.affiliates.region.pt")
                      : t("equipment.affiliates.region.br");
                  const regionPartners = partnersByRegion[region];

                  return (
                    <div key={`partners-${region}`} className={styles.regionBlock}>
                      <div className={styles.regionHeader}>
                        <span className={styles.regionLabel}>{regionLabel}</span>
                        <span className={styles.regionCount}>
                          {formatItemCount(regionPartners.length)}
                        </span>
                      </div>

                      {regionPartners.length > 0 ? (
                        <div className={styles.partnersGrid}>
                          {regionPartners.map((partner) => (
                            <a
                              key={partner.id}
                              href={partner.url}
                              target="_blank"
                              rel="noopener noreferrer"
                              className={styles.partnerCard}
                            >
                              {partner.logo ? (
                                <div className={styles.partnerLogo}>
                                  <Image
                                    src={partner.logo}
                                    alt={partner.name}
                                    width={100}
                                    height={50}
                                    style={{ objectFit: "contain" }}
                                    onError={(e) => {
                                      const target = e.target as HTMLImageElement;
                                      target.style.display = "none";
                                    }}
                                  />
                                </div>
                              ) : (
                                <div className={styles.partnerLogoFallback}>
                                  <span>{partner.name.slice(0, 2).toUpperCase()}</span>
                                </div>
                              )}
                              <div className={styles.partnerInfo}>
                                <h3 className={styles.partnerName}>{partner.name}</h3>
                                <p className={styles.partnerDescription}>{partner.description}</p>
                              </div>
                              <ExternalLink className={styles.partnerArrow} size={18} />
                            </a>
                          ))}
                        </div>
                      ) : (
                        <div className={styles.regionEmpty}>{partnerRegionEmptyMessages[region]}</div>
                      )}
                    </div>
                  );
                })}
              </div>

              <div className={styles.disclaimer}>
                <p>{t("equipment.disclaimer")}</p>
              </div>
            </section>
          </main>
        </div>
      </div>
      {activeProduct && (
        <div
          className={styles.productModalOverlay}
          role="dialog"
          aria-modal="true"
          aria-label={`${activeProduct.name} (${activeProduct.brand})`}
          onClick={closeProductDetails}
        >
          <div
            className={styles.productModal}
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className={styles.modalCloseButton}
              aria-label={t("common.close")}
              onClick={closeProductDetails}
            >
              <X size={18} />
            </button>
            <div className={styles.modalMedia}>
              {activeProduct.image ? (
                <Image
                  src={activeProduct.image}
                  alt={`${activeProduct.name} (${activeProduct.brand})`}
                  fill
                  sizes="(max-width: 900px) 100vw, 480px"
                  className={styles.modalImage}
                />
              ) : (
                <div className={styles.modalImagePlaceholder}>{activeProduct.brand}</div>
              )}
            </div>
            <div className={styles.modalContent}>
              <div className={styles.modalHeader}>
                <span className={styles.modalBrand}>{activeProduct.brand}</span>
                <h3 className={styles.modalTitle}>{activeProduct.name}</h3>
              </div>
              <div className={styles.modalMeta}>
                {ActiveIcon && (
                  <span className={styles.modalCategoryChip}>
                    <ActiveIcon size={16} />
                    <span>{categoryLabels[activeProduct.category]}</span>
                  </span>
                )}
                {activeProduct.type === "affiliate" ? (
                  <span className={`${styles.cardBadgeAffiliate} ${styles.modalBadge}`}>
                    {t("equipment.affiliates.partnerLabel")}
                  </span>
                ) : activeProduct.status ? (
                  <span
                    className={`${styles.cardBadge} ${styles.modalBadge}`}
                    data-status={activeProduct.status}
                  >
                    {statusLabels[activeProduct.status]}
                  </span>
                ) : null}
                {activeProduct.region && (
                  <span className={styles.modalRegion}>
                    {activeProduct.region.toUpperCase()}
                  </span>
                )}
              </div>
              <p className={styles.modalDescription}>{activeProduct.description}</p>
              {activeProduct.specs && (
                <ul className={styles.cardSpecs}>
                  {activeProduct.specs.map((spec, index) => (
                    <li key={index}>{spec}</li>
                  ))}
                </ul>
              )}
              {(activeProduct.price || activeProduct.link || activeProduct.type === "affiliate") && (
                <div className={styles.modalFooter}>
                  {activeProduct.price && (
                    <span className={styles.modalPrice}>{activeProduct.price}</span>
                  )}
                  {activeProduct.link ? (
                    <a
                      href={activeProduct.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={styles.modalCta}
                    >
                      {t("equipment.viewProduct")} <ExternalLink size={16} />
                    </a>
                  ) : activeProduct.type === "affiliate" ? (
                    <span className={styles.modalCtaDisabled}>{t("equipment.affiliates.linkSoon")}</span>
                  ) : null}
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </PageWrapper>
  );
}
