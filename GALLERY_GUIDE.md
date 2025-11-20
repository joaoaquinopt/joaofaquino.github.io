# 📸 Guia da Galeria - Como Adicionar Fotos

## 📁 Estrutura de Pastas

Todas as fotos devem ser colocadas dentro da pasta `public/assets/gallery/`, organizadas por evento:

```
public/
└── assets/
    └── gallery/
        ├── training-nov/
        │   ├── run1.jpg
        │   └── run2.jpg
        ├── sao-silvestre/
        │   ├── start.jpg
        │   └── finish.jpg
        └── training-jan/
            └── long-run.jpg
```

---

## ➕ Como Adicionar um Novo Evento

### Passo 1: Criar a pasta do evento

Cria uma nova pasta dentro de `public/assets/gallery/` com o nome do evento (sem espaços, usa hífens):

```
public/assets/gallery/meia-maratona-lisboa/
```

### Passo 2: Adicionar as fotos

Coloca as tuas fotos dentro da pasta criada. Recomendações:

- ✅ Formato: `.jpg` ou `.png`
- ✅ Nome: descritivo e sem espaços (ex: `inicio.jpg`, `meta.jpg`, `podio.jpg`)
- ✅ Tamanho: otimizado para web (máx 2MB por foto)

### Passo 3: Editar o código

Abre o ficheiro `app/gallery/page.tsx` e encontra o array `galleryEvents` (por volta da linha 13).

Adiciona um novo objeto ao array seguindo este template:

```typescript
{
  id: "meia-maratona-lisboa",           // ID único (sem espaços)
  name: "Meia Maratona Lisboa",         // Nome que aparece no botão
  date: "Março 2025",                   // Data do evento
  photos: [
    {
      id: 10,                           // ID único da foto (número sequencial)
      url: "/assets/gallery/meia-maratona-lisboa/inicio.jpg",  // Caminho da foto
      title: "Antes da Corrida",        // Título da foto
      date: "15/03/2025",               // Data específica
      location: "Ponte 25 de Abril",    // Local
      description: "Preparado para os 21km"  // Descrição curta
    },
    {
      id: 11,
      url: "/assets/gallery/meia-maratona-lisboa/meta.jpg",
      title: "Meta Alcançada",
      date: "15/03/2025",
      location: "Belém",
      description: "21km concluídos!"
    }
  ]
}
```

### Exemplo Completo:

```typescript
const galleryEvents = [
  {
    id: "training-nov-2024",
    name: "Treinos Novembro 2024",
    date: "Novembro 2024",
    photos: [
      // ... fotos existentes
    ]
  },
  // ADICIONAR AQUI O NOVO EVENTO 👇
  {
    id: "meia-maratona-lisboa",
    name: "Meia Maratona Lisboa",
    date: "Março 2025",
    photos: [
      {
        id: 10,
        url: "/assets/gallery/meia-maratona-lisboa/inicio.jpg",
        title: "Antes da Corrida",
        date: "15/03/2025",
        location: "Ponte 25 de Abril",
        description: "Preparado para os 21km"
      }
    ]
  }
];
```

---

## 📝 Dicas Importantes

### IDs das Fotos
- Usa números sequenciais únicos (1, 2, 3, 4...)
- Não repitas IDs mesmo que sejam de eventos diferentes
- Mantém a sequência crescente

### Caminhos das Fotos
- Sempre começa com `/assets/gallery/`
- Usa o nome da pasta do evento
- Exemplo: `/assets/gallery/meia-maratona-lisboa/foto.jpg`

### Nomes de Pastas e Ficheiros
- ✅ Bom: `meia-maratona-lisboa`, `treino-longo.jpg`
- ❌ Mau: `Meia Maratona Lisboa`, `treino longo.jpg`
- Usa letras minúsculas e hífens em vez de espaços

### Ordem dos Eventos
- Os eventos aparecem na ordem que estão no array
- Recomendação: ordem cronológica (mais antigos primeiro)
- O filtro "Todas" mostra todas as fotos de todos os eventos

---

## 🔄 Workflow Completo

1. **Preparar fotos**: Otimiza e renomeia os ficheiros
2. **Criar pasta**: `public/assets/gallery/nome-do-evento/`
3. **Copiar fotos**: Coloca as fotos na pasta criada
4. **Editar código**: Adiciona o evento no `gallery/page.tsx`
5. **Testar local**: `npm run dev` e verifica em `http://localhost:3000/gallery`
6. **Commit**: `git add .` → `git commit -m "Add: fotos do evento X"` → `git push`

---

## 🎯 Exemplo Prático: Adicionar Fotos da Corrida de Natal

### 1. Criar pasta
```
public/assets/gallery/corrida-natal-2024/
```

### 2. Adicionar fotos
- `corrida-natal-2024/aquecimento.jpg`
- `corrida-natal-2024/largada.jpg`
- `corrida-natal-2024/chegada.jpg`

### 3. Adicionar no código (`app/gallery/page.tsx`)

```typescript
{
  id: "corrida-natal-2024",
  name: "Corrida de Natal",
  date: "25/12/2024",
  photos: [
    {
      id: 6,
      url: "/assets/gallery/corrida-natal-2024/aquecimento.jpg",
      title: "Aquecimento",
      date: "25/12/2024",
      location: "Parque da Cidade",
      description: "Preparação antes da corrida"
    },
    {
      id: 7,
      url: "/assets/gallery/corrida-natal-2024/largada.jpg",
      title: "Largada",
      date: "25/12/2024",
      location: "Parque da Cidade",
      description: "Início dos 10km"
    },
    {
      id: 8,
      url: "/assets/gallery/corrida-natal-2024/chegada.jpg",
      title: "Meta",
      date: "25/12/2024",
      location: "Parque da Cidade",
      description: "10km concluídos!"
    }
  ]
}
```

---

## ✨ Funcionalidades da Galeria

- **Filtros por Evento**: Botões no topo para filtrar fotos por evento
- **Contador**: Mostra quantas fotos há em cada evento
- **Tag do Evento**: Quando filtro = "Todas", cada foto mostra de que evento é
- **Modal**: Ao clicar numa foto, abre preview (funcionalidade futura)
- **Responsivo**: Funciona bem em mobile e desktop

---

## 🚀 Próximos Passos (Futuro)

- [ ] Implementar visualização de imagem em tamanho real no modal
- [ ] Adicionar lightbox com navegação entre fotos
- [ ] Integração com Instagram para importar fotos automaticamente
- [ ] Adicionar EXIF data (câmera, configurações, etc.)
- [ ] Upload de fotos via interface (sem editar código)

---

📍 **Localização do ficheiro**: `app/gallery/page.tsx` (linha 13 - array `galleryEvents`)

🏃‍♂️ "Nem sempre perfeito, mas sempre em frente." 🏁
