"use client";

import { useEffect, useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import { useTranslation } from "../../components/TranslationProvider";
import { ChevronDown, ExternalLink, X, Watch, Footprints, Shirt, Pill, Headphones } from "lucide-react";
import Image from "next/image";
import styles from "./equipment.module.css";

// Tipos
type ProductType = "affiliate" | "personal";
type Category = "shoes" | "watch" | "clothing" | "supplements" | "accessories";
type Region = "pt" | "br";

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
}

interface Partner {
  id: string;
  name: string;
  logo: string;
  url: string;
  description: string;
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
    id: "nike-pegasus-41",
    name: "Nike Pegasus 41",
    brand: "Nike",
    category: "shoes",
    type: "affiliate",
    price: "€129,99",
    link: "https://tidd.ly/4rCMmnn",
    description: "Ténis versátil para treino diário",
    specs: ["React Foam", "Drop 10mm", "Peso 280g"],
    region: "pt",
  },
  {
    id: "garmin-255",
    name: "Garmin Forerunner 255",
    brand: "Garmin",
    category: "watch",
    type: "affiliate",
    price: "€181,93",
    link: "https://amzn.to/48jnk5d",
    description: "Relógio GPS com ecrã AMOLED",
    specs: ["GPS Multibanda", "Ecrã AMOLED", "Training Readiness", "HRV Status"],
    region: "pt",
  },
  {
    id: "saucony-endorphin-speed-4",
    name: "Saucony Endorphin Speed 4",
    brand: "Saucony",
    category: "shoes",
    type: "affiliate",
    price: "€159,90",
    link: "https://tidd.ly/4arhYX2",
    description: "Ténis de treino com placa de nylon",
    specs: ["PWRRUN PB", "Drop 8mm", "Peso 215g", "Placa Nylon"],
    region: "pt",
  },
  {
    id: "maurten-gel-100",
    name: "Maurten Gel 100",
    brand: "Maurten",
    category: "supplements",
    type: "affiliate",
    price: "€35 (pack 12)",
    link: "https://amzn.to/4rHV83O",
    description: "Gel de hidrogel para corridas longas",
    specs: ["25g carboidratos", "Sem sabor", "Fácil digestão"],
    region: "pt",
  },
  {
    id: "coros-pod-2",
    name: "COROS POD 2",
    brand: "COROS",
    category: "accessories",
    type: "affiliate",
    price: "€89",
    link: "https://amzn.to/48vvI0f",
    description: "Sensor de dinâmica de corrida",
    specs: ["Cadência", "Oscilação vertical", "Tempo de contacto", "Bateria 28h"],
    region: "pt",
  },
];

const partners: Partner[] = [
  {
    id: "sportzone",
    name: "Sport Zone",
    logo: "/assets/brand/partners/sportzone.svg",
    url: "https://tidd.ly/3KdqaQ6",
    description: "Equipamento desportivo em Portugal",
  },
  {
    id: "decathlon",
    name: "Decathlon",
    logo: "/assets/brand/partners/decathlon.svg",
    url: "https://tidd.ly/48uK7tG",
    description: "Desporto acessível para todos",
  },
  {
    id: "adidas",
    name: "Adidas",
    logo: "/assets/brand/partners/adidas.svg",
    url: "https://www.adidas.pt",
    description: "Performance running gear",
  },
  {
    id: "asics",
    name: "ASICS",
    logo: "/assets/brand/partners/asics.svg",
    url: "https://www.asics.com/pt",
    description: "Sound mind, sound body",
  },
  {
    id: "amazon",
    name: "Amazon",
    logo: "/assets/brand/partners/amazon.svg",
    url: "https://amzn.to/4oCcFYq",
    description: "Suplementos e acessórios",
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
  const affiliateInventoryByRegion: Record<Region, Product[]> = { pt: [], br: [] };
  allAffiliateProducts.forEach((product) => {
    affiliateInventoryByRegion[resolveRegion(product)].push(product);
  });
  const regionOrder: Region[] = ["pt", "br"];
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

                        {regionProducts.length > 0 ? (
                          <div className={styles.productGrid}>
                            {regionProducts.map(renderProductTile)}
                          </div>
                        ) : hasCatalog ? (
                          <div className={styles.regionEmpty}>{t("equipment.affiliates.noMatches")}</div>
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

              <div className={styles.partnersGrid}>
                {partners.map((partner) => (
                  <a
                    key={partner.id}
                    href={partner.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={styles.partnerCard}
                  >
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
                    <div className={styles.partnerInfo}>
                      <h3 className={styles.partnerName}>{partner.name}</h3>
                      <p className={styles.partnerDescription}>{partner.description}</p>
                    </div>
                    <ExternalLink className={styles.partnerArrow} size={18} />
                  </a>
                ))}
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
