"use client";

import { useState } from "react";
import PageWrapper from "../../components/PageWrapper";
import { ChevronDown } from "lucide-react";
import styles from "./equipment.module.css";

// Tipos de produtos
type ProductType = "affiliate" | "personal";
type Category = "shoes" | "watch" | "clothing" | "supplements" | "accessories";

interface Product {
  id: string;
  name: string;
  brand: string;
  category: Category;
  type: ProductType;
  price?: string;
  image: string;
  link?: string;
  description: string;
  specs?: string[];
}

export default function EquipmentPage() {
  const [selectedType, setSelectedType] = useState<ProductType | "all">("all");
  const [selectedBrand, setSelectedBrand] = useState("all");
  const [selectedCategory, setSelectedCategory] = useState<Category | "all">("all");
  const [showTypeFilter, setShowTypeFilter] = useState(true);
  const [showBrandFilter, setShowBrandFilter] = useState(true);
  const [showCategoryFilter, setShowCategoryFilter] = useState(true);

  // Base de dados de produtos (depois podes mover para JSON)
  const products: Product[] = [
    // AFILIADOS - Ténis
    {
      id: "nike-pegasus-40",
      name: "Nike Pegasus 40",
      brand: "Nike",
      category: "shoes",
      type: "affiliate",
      price: "€140",
      image: "/placeholder-shoe.jpg",
      link: "https://amazon.com/...",
      description: "Ténis de treino diário com amortecimento React",
      specs: ["Drop: 10mm", "Peso: 280g", "React Foam"]
    },
    {
      id: "adidas-ultraboost",
      name: "Adidas Ultraboost 23",
      brand: "Adidas",
      category: "shoes",
      type: "affiliate",
      price: "€180",
      image: "/placeholder-shoe.jpg",
      link: "https://amazon.com/...",
      description: "Corridas longas com tecnologia Boost",
      specs: ["Drop: 10mm", "Peso: 310g", "Boost Tech"]
    },
    
    // AFILIADOS - Suplementos
    {
      id: "myprotein-whey",
      name: "Whey Protein Impact",
      brand: "MyProtein",
      category: "supplements",
      type: "affiliate",
      price: "€25",
      image: "/placeholder-supplement.jpg",
      link: "https://myprotein.com/...",
      description: "Proteína de soro de leite isolada",
      specs: ["80% proteína", "Sabor: Chocolate", "1kg"]
    },
    
    // EQUIPAMENTO PESSOAL
    {
      id: "garmin-255",
      name: "Garmin Forerunner 255",
      brand: "Garmin",
      category: "watch",
      type: "personal",
      image: "/placeholder-watch.jpg",
      description: "Relógio GPS que uso em todos os treinos",
      specs: ["GPS Multibanda", "Autonomia: 14 dias", "Monitor FC"]
    },
    {
      id: "nike-dri-fit",
      name: "Camisola Nike Dri-FIT",
      brand: "Nike",
      category: "clothing",
      type: "personal",
      image: "/placeholder-shirt.jpg",
      description: "Camisola técnica para treinos",
      specs: ["Dri-FIT", "Anti-odor", "Secagem rápida"]
    }
  ];

  // Filtrar produtos
  const filteredProducts = products.filter(product => {
    if (selectedType !== "all" && product.type !== selectedType) return false;
    if (selectedBrand !== "all" && product.brand !== selectedBrand) return false;
    if (selectedCategory !== "all" && product.category !== selectedCategory) return false;
    return true;
  });

  // Extrair marcas únicas
  const brands = Array.from(new Set(products.map(p => p.brand))).sort((a, b) => a.localeCompare(b));

  return (
    <PageWrapper>
      <div className={styles.equipmentPage}>
        {/* Breadcrumb */}
        <div className={styles.breadcrumb}>
          <div className={styles.breadcrumbContainer}>
            <p className={styles.breadcrumbText}>Equipamento / Corrida</p>
          </div>
        </div>

        <div className={styles.container}>
          
          {/* Header com Hide Filters */}
          <div className={styles.header}>
            <h1 className={styles.title}>
              Equipamento de Corrida ({filteredProducts.length})
            </h1>
            <button className={styles.hideFiltersBtn}>
              Esconder Filtros
            </button>
          </div>

          <div className={styles.content}>
            
            {/* SIDEBAR - Filtros NIKE STYLE */}
            <aside className={styles.sidebar}>
              
                {/* Filtro: Tipo */}
                <div className={styles.filterSection}>
                  <button
                    onClick={() => setShowTypeFilter(!showTypeFilter)}
                    className={`${styles.filterHeader} ${showTypeFilter ? '' : styles.collapsed}`}
                  >
                    <span>Tipo</span>
                    <ChevronDown className="w-4 h-4" />
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
                          checked={selectedType === "affiliate"}
                          onChange={() => setSelectedType("affiliate")}
                        />
                        <span>Afiliados</span>
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
                    </div>
                  )}
                </div>

                {/* Filtro: Marca */}
                <div className={styles.filterSection}>
                  <button
                    onClick={() => setShowBrandFilter(!showBrandFilter)}
                    className={`${styles.filterHeader} ${showBrandFilter ? '' : styles.collapsed}`}
                  >
                    <span>Marca</span>
                    <ChevronDown className="w-4 h-4" />
                  </button>
                  
                  {showBrandFilter && (
                    <div className={styles.filterOptions}>
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="brand"
                          checked={selectedBrand === "all"}
                          onChange={() => setSelectedBrand("all")}
                        />
                        <span>Todas</span>
                      </label>
                      {brands.map(brand => (
                        <label key={brand} className={styles.filterOption}>
                          <input
                            type="radio"
                            name="brand"
                            checked={selectedBrand === brand}
                            onChange={() => setSelectedBrand(brand)}
                          />
                          <span>{brand}</span>
                        </label>
                      ))}
                    </div>
                  )}
                </div>

                {/* Filtro: Categoria */}
                <div className={styles.filterSection}>
                  <button
                    onClick={() => setShowCategoryFilter(!showCategoryFilter)}
                    className={`${styles.filterHeader} ${showCategoryFilter ? '' : styles.collapsed}`}
                  >
                    <span>Categoria</span>
                    <ChevronDown className="w-4 h-4" />
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
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === "shoes"}
                          onChange={() => setSelectedCategory("shoes")}
                        />
                        <span>Ténis</span>
                      </label>
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === "watch"}
                          onChange={() => setSelectedCategory("watch")}
                        />
                        <span>Relógios</span>
                      </label>
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === "clothing"}
                          onChange={() => setSelectedCategory("clothing")}
                        />
                        <span>Roupa</span>
                      </label>
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === "supplements"}
                          onChange={() => setSelectedCategory("supplements")}
                        />
                        <span>Suplementos</span>
                      </label>
                      <label className={styles.filterOption}>
                        <input
                          type="radio"
                          name="category"
                          checked={selectedCategory === "accessories"}
                          onChange={() => setSelectedCategory("accessories")}
                        />
                        <span>Acessórios</span>
                      </label>
                    </div>
                  )}
                </div>

            </aside>

            {/* GRID - Produtos NIKE STYLE */}
            <main className={styles.productGrid}>
              {filteredProducts.length === 0 ? (
                <div className={styles.emptyState}>
                  <p>Nenhum produto encontrado</p>
                </div>
              ) : (
                <div className={styles.grid}>
                  {filteredProducts.map(product => (
                    <div key={product.id} className={styles.productCard}>
                      {/* Imagem */}
                      <div className={styles.productImage}>
                        <span>📦</span>
                      </div>

                      {/* Conteúdo */}
                      <div className={styles.productInfo}>
                        {/* Badge */}
                        {product.type === "affiliate" && (
                          <p className={styles.productBadge}>Parceiro</p>
                        )}
                        
                        {/* Nome */}
                        <h3 className={styles.productName}>{product.name}</h3>
                        
                        {/* Descrição */}
                        <p className={styles.productDescription}>{product.description}</p>
                        
                        {/* Marca */}
                        <p className={styles.productBrand}>{product.brand}</p>
                        
                        {/* Preço */}
                        {product.price && (
                          <p className={styles.productPrice}>{product.price}</p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </main>

          </div>
        </div>
      </div>
    </PageWrapper>
  );
}
