import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Clear existing data
  await prisma.orderItem.deleteMany();
  await prisma.orderStatusHistory.deleteMany();
  await prisma.order.deleteMany();
  await prisma.menuItemSize.deleteMany();
  await prisma.menuItem.deleteMany();
  await prisma.category.deleteMany();
  await prisma.addOn.deleteMany();
  await prisma.deliveryZone.deleteMany();

  console.log('🗑️  Cleared existing menu data');

  // ============================================
  // CATEGORIES
  // ============================================
  const categories = await Promise.all([
    prisma.category.create({
      data: {
        name: 'Pizza',
        nameEn: 'Pizza',
        slug: 'pizza',
        description: 'Unsere Steinofenpizzen - frisch zubereitet mit italienischem Teig',
        descriptionEn: 'Our stone oven pizzas - freshly prepared with Italian dough',
        sortOrder: 1,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pizzabrötchen',
        nameEn: 'Pizza Rolls',
        slug: 'pizzabroetchen',
        description: 'Leckere Pizzabrötchen als Vorspeise oder Snack',
        sortOrder: 2,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Kindermenu',
        nameEn: 'Kids Menu',
        slug: 'kindermenu',
        description: 'Speziell für unsere kleinen Gäste',
        sortOrder: 3,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Pasta',
        nameEn: 'Pasta',
        slug: 'pasta',
        description: 'Hausgemachte Pasta nach italienischer Art',
        sortOrder: 4,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Antipasti & Vorspeisen',
        nameEn: 'Appetizers',
        slug: 'antipasti',
        description: 'Italienische Vorspeisen',
        sortOrder: 5,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Baguettes',
        nameEn: 'Baguettes',
        slug: 'baguettes',
        description: 'Frische Baguettes mit verschiedenen Belägen',
        sortOrder: 6,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Aufläufe',
        nameEn: 'Casseroles',
        slug: 'auflaeufe',
        description: 'Überbackene Gerichte aus dem Ofen',
        sortOrder: 7,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Vegetarische Aufläufe',
        nameEn: 'Vegetarian Casseroles',
        slug: 'vegetarische-auflaeufe',
        description: 'Vegetarische überbackene Gerichte',
        sortOrder: 8,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Salate',
        nameEn: 'Salads',
        slug: 'salate',
        description: 'Frische Salate',
        sortOrder: 9,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Desserts',
        nameEn: 'Desserts',
        slug: 'desserts',
        description: 'Süße Nachspeisen',
        sortOrder: 10,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Getränke',
        nameEn: 'Beverages',
        slug: 'getraenke',
        description: 'Kalte und warme Getränke',
        sortOrder: 11,
      },
    }),
    prisma.category.create({
      data: {
        name: 'Extras',
        nameEn: 'Extras',
        slug: 'extras',
        description: 'Zusätzliche Beläge und Extras',
        sortOrder: 12,
      },
    }),
  ]);

  const categoryMap = Object.fromEntries(categories.map((c) => [c.slug, c.id]));
  console.log('✅ Created categories');

  // ============================================
  // PIZZA ITEMS (with Klein and Normal sizes)
  // ============================================
  const pizzaItems = [
    { name: 'Margherita', description: null, kleinPrice: 8.00, normalPrice: 9.00 },
    { name: 'Vulcano', description: 'mit Zwiebeln, Kapern u. Peperoni (scharf)', kleinPrice: 11.00, normalPrice: 12.50, spiceLevel: 2 },
    { name: 'Scampi', description: 'mit Scampi und Sauce Provençal', kleinPrice: 13.00, normalPrice: 14.50 },
    { name: 'Frutti di Mare', description: 'mit Meeresfrüchten und Knoblauch', kleinPrice: 12.00, normalPrice: 14.50 },
    { name: 'Haan', description: 'mit Schinken, fr. Champignons, Paprika, Zwiebeln', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Salami', description: 'mit Salami', kleinPrice: 9.00, normalPrice: 10.00 },
    { name: 'Rica', description: 'mit Thunfisch, Champignons, Paprika, Schinken, Spinat, Artischocken', kleinPrice: 11.50, normalPrice: 13.00 },
    { name: 'Fungi', description: 'mit frischen Champignons', kleinPrice: 8.50, normalPrice: 10.00, isVegetarian: true },
    { name: 'Montana', description: 'Thunfisch, Champignons, mittelscharfe Peperoni, Fetakäse', kleinPrice: 11.50, normalPrice: 12.50, spiceLevel: 1 },
    { name: 'Prosciutto', description: 'mit Schinken', kleinPrice: 8.50, normalPrice: 10.00 },
    { name: 'Ibri', description: 'mit Fetakäse, fr. Tomaten, Peperoni, Oliven', kleinPrice: 11.00, normalPrice: 12.50, spiceLevel: 1 },
    { name: 'Tonno', description: 'mit Thunfisch', kleinPrice: 9.00, normalPrice: 11.00 },
    { name: 'Carciofi', description: 'mit Artischocken', kleinPrice: 8.50, normalPrice: 9.50, isVegetarian: true },
    { name: 'Contadina', description: 'mit Champignons und Schinken', kleinPrice: 10.00, normalPrice: 11.00 },
    { name: 'Spinaci', description: 'mit Spinat und Knoblauch', kleinPrice: 9.50, normalPrice: 10.50, isVegetarian: true },
    { name: '4 Stagioni', description: 'mit Oliven, Schinken, Champignons & Artischocken', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Mista', description: 'mit Thunfisch, Schinken, Champignons und Salami', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Paesana', description: 'mit Champignons, Spinat, Schinken, und Knoblauch', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Bolognese', description: 'mit Rindfleischsauce', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Valentino', description: 'mit Spinat, Champignons, Schinken, Ei und Knoblauch', kleinPrice: 11.00, normalPrice: 13.00 },
    { name: 'Completa', description: 'mit Champignons, Paprika, Thunfisch, Schinken, Artischocken, Zwiebeln und milden Peperoni', kleinPrice: 12.00, normalPrice: 13.50 },
    { name: 'Calzone', description: 'mit Champignons, Schinken, Artischocken und Bolognese', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Hawaii', description: 'Schinken, Ananas', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Arlecchino', description: 'mit Spinat, Paprika, Zwiebeln, Thunfisch, Artischocken, Crevetten und Knoblauch', kleinPrice: 12.00, normalPrice: 13.50 },
    { name: 'Vegetaria', description: 'mit frischem Gemüse', kleinPrice: 11.50, normalPrice: 11.50, isVegetarian: true },
    { name: 'Napoli', description: 'Sardellen, Knoblauch und Kapern', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Shala', description: 'Mozzarella, Hirtenkäse, fr. Tomaten, Zwiebeln und Oliven', kleinPrice: 11.50, normalPrice: 13.00, isVegetarian: true },
    { name: 'Caprese', description: 'Mozzarella, fr. Tomaten, Basilikum', kleinPrice: 11.00, normalPrice: 12.50, isVegetarian: true },
    { name: 'Hollandaise', description: 'Putenfleisch, Brokkoli, Sauce Hollandaise', kleinPrice: 12.00, normalPrice: 13.50 },
    { name: 'Lachs', description: 'Lachs, Spinat und Knoblauch', kleinPrice: 13.50, normalPrice: 15.00 },
    { name: 'Sucuk', description: 'mit Knoblauchwurst und Spinat', kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Italia', description: 'mit Spinat, Paprika, Zwiebeln und Knoblauch', kleinPrice: 11.00, normalPrice: 12.50, isVegetarian: true },
    { name: '4-Formaggi', description: 'mit 4 Käsesorten', kleinPrice: 11.00, normalPrice: 12.50, isVegetarian: true },
    { name: 'Diavolo', description: 'mit Salami Piccante', kleinPrice: 11.00, normalPrice: 12.50, spiceLevel: 2 },
    { name: 'Parma', description: 'Rinderschinken, frischen Tomaten, Hirtenkäse, Rucola, Parmesankäse', kleinPrice: 12.50, normalPrice: 13.00 },
    { name: 'Traditionale', description: 'mit Salami, Oliven, Zwiebeln, Paprika', kleinPrice: 11.50, normalPrice: 13.00 },
    { name: 'Milano', description: 'Spinat, Paprika, Champignons', kleinPrice: 11.50, normalPrice: 13.00, isVegetarian: true },
    { name: 'Pizza Spezial', description: null, kleinPrice: 11.00, normalPrice: 12.50 },
    { name: 'Pizza Gyros', description: 'mit Hähnchen Gyros, Zwiebeln', kleinPrice: 11.00, normalPrice: 13.00 },
    { name: 'Mediterrane', description: 'mit Thunfisch, rote Zwiebeln, frische Tomaten, Hirtenkäse, Oliven', kleinPrice: 12.00, normalPrice: 13.50 },
    { name: 'Pizza Toni', description: 'Gelbe Tomaten, Rucola, Parmesan, Burratina und Bresaola', kleinPrice: 18.00, normalPrice: 18.00 },
  ];

  for (let i = 0; i < pizzaItems.length; i++) {
    const pizza = pizzaItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['pizza'],
        name: pizza.name,
        description: pizza.description,
        basePrice: pizza.kleinPrice,
        spiceLevel: pizza.spiceLevel || 0,
        isVegetarian: pizza.isVegetarian || false,
        sortOrder: i + 1,
        image: '/images/menu/pizza.jpg',
        sizes: {
          create: [
            { name: 'Klein (26cm)', priceAdjustment: 0, sortOrder: 1, isDefault: false },
            { name: 'Normal (32cm)', priceAdjustment: pizza.normalPrice - pizza.kleinPrice, sortOrder: 2, isDefault: true },
          ],
        },
      },
    });
  }

  // Family Pizza
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['pizza'],
      name: 'Familienpizza Margherita',
      description: '40cm große Pizza für die ganze Familie',
      basePrice: 17.00,
      isVegetarian: true,
      sortOrder: 100,
      image: '/images/menu/pizza.jpg',
    },
  });

  console.log('✅ Created pizza items');

  // ============================================
  // PIZZABRÖTCHEN
  // ============================================
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['pizzabroetchen'],
      name: 'Pizzabrötchen mit Kräuterbutter oder Aioli',
      description: '6 Stück',
      basePrice: 4.50,
      isVegetarian: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['pizzabroetchen'],
      name: 'Gefüllte Pizzabrötchen nach Wahl',
      description: '6 Stück',
      basePrice: 8.00,
      sortOrder: 2,
    },
  });

  console.log('✅ Created Pizzabrötchen items');

  // ============================================
  // KINDERMENU
  // ============================================
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['kindermenu'],
      name: 'Kindermenu',
      description: 'Chicken Nuggets 6 Stück, Pommes und Capri Sun',
      basePrice: 7.00,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['kindermenu'],
      name: 'Pommes',
      basePrice: 3.00,
      isVegetarian: true,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['kindermenu'],
      name: 'Chicken Nuggets 6 Stück',
      basePrice: 4.50,
      sortOrder: 3,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['kindermenu'],
      name: 'Chicken Nuggets 12 Stück',
      basePrice: 8.00,
      sortOrder: 4,
    },
  });

  console.log('✅ Created Kindermenu items');

  // ============================================
  // PASTA
  // ============================================
  const pastaItems = [
    { name: 'Lasagne', description: 'mit Schinken und Käse', price: 11.00 },
    { name: 'Tortellini Panna', description: 'mit Schinken und Sahnesauce', price: 11.00 },
    { name: 'Spaghetti Bolognese', description: 'mit Rindfleischsauce', price: 9.50 },
    { name: 'Spaghetti Napoli', description: 'mit Tomatensauce', price: 9.00, isVegetarian: true },
    { name: 'Spaghetti Carbonara', description: 'mit Sahne, Schinken und Ei', price: 10.00 },
    { name: 'Spaghetti Amatriciana', description: 'mit Schinken und Zwiebeln in Tomatensauce', price: 9.00 },
    { name: 'Spaghetti Tonno', description: 'mit Thunfisch, Tomatensauce, Oliven und Kapern', price: 9.00 },
    { name: 'Spaghetti Frutti di Mare', description: 'mit Meeresfrüchten', price: 14.50 },
    { name: 'Spaghetti Scampi', description: 'mit Scampi und Sauce Provençal', price: 12.00 },
    { name: 'Rigatoni 4 Formaggi', description: 'mit vier verschiedenen Käsesorten', price: 11.50, isVegetarian: true },
    { name: 'Rigatoni Paradiso', description: 'mit Spinat, Hirtenkäse, Oliven, frische Paprika, Knoblauch', price: 11.00, isVegetarian: true },
    { name: 'Tortellini al Forno', description: 'mit Spinat, Schinken und Knoblauch in Sahnesauce überbacken', price: 12.00 },
    { name: 'Rigatoni al Forno', description: 'mit Schinken in Bolognese-Sahnesauce überbacken', price: 12.00 },
    { name: 'Rigatoni Minjera', description: 'mit Brokkoli, Putenfleisch, Knoblauch und Sahnesauce überbacken', price: 11.00 },
    { name: 'Rigatoni Hühner', description: 'mit frischem Gemüse und Hähnchenfiletstreifen', price: 11.50 },
    { name: 'Rigatoni Scampi', description: 'Scampi mit fr. Tomaten, in Olivenöl, Tomatensauce und Knoblauch', price: 12.50 },
    { name: 'Rigatoni Tonno', description: 'Tomaten- und Sahnesauce, Thunfisch, Oliven, Käse überbacken', price: 11.00 },
    { name: 'Tagliatelle al Salmone', description: 'Lachs, Knoblauch in Sahnesauce', price: 13.50 },
    { name: 'Tagliatelle Arlecchino', description: 'Putenbrust, Crevetten und Knoblauch in Curry-Sahnesauce', price: 13.50 },
    { name: 'Tagliatelle Toskana', description: 'Schinken, Erbsen und Tomaten in Sahnesauce', price: 12.00 },
  ];

  for (let i = 0; i < pastaItems.length; i++) {
    const pasta = pastaItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['pasta'],
        name: pasta.name,
        description: pasta.description,
        basePrice: pasta.price,
        isVegetarian: pasta.isVegetarian || false,
        sortOrder: i + 1,
        image: '/images/menu/pasta.jpg',
      },
    });
  }

  console.log('✅ Created Pasta items');

  // ============================================
  // ANTIPASTI & VORSPEISEN
  // ============================================
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['antipasti'],
      name: 'Antipasto Groß (ohne Fisch)',
      basePrice: 12.00,
      sortOrder: 1,
      image: '/images/menu/antipasti.jpg',
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['antipasti'],
      name: 'Antipasto Groß (mit Fisch)',
      basePrice: 13.00,
      sortOrder: 2,
      image: '/images/menu/antipasti.jpg',
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['antipasti'],
      name: 'Caprese',
      description: 'Tomaten mit Mozzarella',
      basePrice: 8.00,
      isVegetarian: true,
      sortOrder: 3,
      image: '/images/menu/antipasti.jpg',
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['antipasti'],
      name: 'Bruschetta Italiana',
      description: 'mit Rucola',
      basePrice: 11.00,
      isVegetarian: true,
      sortOrder: 4,
      image: '/images/menu/antipasti.jpg',
    },
  });

  console.log('✅ Created Antipasti items');

  // ============================================
  // BAGUETTES
  // ============================================
  const baguetteItems = [
    { name: 'Baguette Salami', price: 7.00 },
    { name: 'Baguette Schinken', price: 8.00 },
    { name: 'Baguette Käse', price: 7.00, isVegetarian: true },
    { name: 'Baguette Schinken Käse', price: 9.00 },
    { name: 'Baguette Thunfisch Zwiebeln', price: 9.00 },
    { name: 'Baguette Schinken Käse Crevetten', price: 9.50 },
    { name: 'Baguette Salami Käse', price: 8.00 },
    { name: 'Baguette Käse Ei', price: 8.00, isVegetarian: true },
    { name: 'Baguette Lachs', description: 'mit Lachs, Spiegelei, Salat, Remoulade', price: 10.00 },
  ];

  for (let i = 0; i < baguetteItems.length; i++) {
    const item = baguetteItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['baguettes'],
        name: item.name,
        description: item.description || null,
        basePrice: item.price,
        isVegetarian: item.isVegetarian || false,
        sortOrder: i + 1,
        image: '/images/menu/baguette.jpg',
      },
    });
  }

  console.log('✅ Created Baguette items');

  // ============================================
  // AUFLÄUFE
  // ============================================
  const auflaufItems = [
    { name: 'Rigatoni Penne', description: 'mit Bolognese (Rindfleisch), und Sahnesauce überbacken', price: 10.50 },
    { name: 'Tortellini Bauern', description: 'Schinken, Champignons, Erbsen, Fleischsauce', price: 11.50 },
    { name: 'Hähnchen-Kartoffelauflauf', description: 'mit Hähnchenstreifen, Brokkoli, Champignons, Curry- und Sahnesauce mit Käse überbacken', price: 12.00 },
  ];

  for (let i = 0; i < auflaufItems.length; i++) {
    const item = auflaufItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['auflaeufe'],
        name: item.name,
        description: item.description,
        basePrice: item.price,
        sortOrder: i + 1,
        image: '/images/menu/auflaufe.jpg',
      },
    });
  }

  console.log('✅ Created Aufläufe items');

  // ============================================
  // VEGETARISCHE AUFLÄUFE
  // ============================================
  const vegAuflaufItems = [
    { name: 'Brokkoli al Forno', description: 'Brokkoli in Sahnesauce mit Käse überbacken', price: 11.00 },
    { name: 'Rigatoni Vegetaria', description: 'mit verschiedenen Gemüsesorten mit Käse überbacken', price: 11.00 },
    { name: 'Brokkoli Kartoffelauflauf', description: 'Brokkoli und Kartoffeln mit Käse überbacken', price: 11.00 },
  ];

  for (let i = 0; i < vegAuflaufItems.length; i++) {
    const item = vegAuflaufItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['vegetarische-auflaeufe'],
        name: item.name,
        description: item.description,
        basePrice: item.price,
        isVegetarian: true,
        sortOrder: i + 1,
        image: '/images/menu/auflaufe.jpg',
      },
    });
  }

  console.log('✅ Created Vegetarische Aufläufe items');

  // ============================================
  // SALATE
  // ============================================
  const salatItems = [
    { name: 'Eisbergsalat', description: 'mit Tomaten und Gurken', price: 5.00, isVegetarian: true },
    { name: 'Tomatensalat', description: 'mit Zwiebeln', price: 5.00, isVegetarian: true },
    { name: 'Insalata Mista', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais und Oliven', price: 6.00, isVegetarian: true },
    { name: 'Insalata Capricciosa', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais, Oliven, Artischocken, Ei, Thunfisch und Zwiebeln', price: 9.00 },
    { name: 'Insalata Arlecchino', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais, Oliven, Schinken, Käse und Ei', price: 9.00 },
    { name: 'Insalata Arlecchino Plus', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais, Oliven, Schinken, Käse, Ei, Crevetten und Zwiebeln', price: 11.00 },
    { name: 'Bauernsalat', description: 'mit Eisbergsalat, Tomaten, Gurken, Paprika, Mais, Zwiebeln, Ei, Schafskäse, Oliven', price: 10.00, isVegetarian: true },
    { name: 'Salat Hähnchenfleisch', description: 'mit Eisbergsalat, Zwiebeln, Hähnchenfleisch', price: 10.00 },
    { name: 'Salat Schale', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais, Oliven, frischen Paprika, Feta und Mozzarella Käse', price: 10.00, isVegetarian: true },
    { name: 'Salat Frutti', description: 'mit Eisbergsalat, Tomaten, Gurken, Mais, Oliven, Meeresfrüchte, Zwiebeln, Knoblauch', price: 12.00 },
  ];

  for (let i = 0; i < salatItems.length; i++) {
    const item = salatItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['salate'],
        name: item.name,
        description: item.description,
        basePrice: item.price,
        isVegetarian: item.isVegetarian || false,
        sortOrder: i + 1,
        image: '/images/menu/salate.jpg',
      },
    });
  }

  console.log('✅ Created Salate items');

  // ============================================
  // DESSERTS
  // ============================================
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['desserts'],
      name: 'Hausgemachtes Tiramisu',
      basePrice: 4.00,
      isVegetarian: true,
      sortOrder: 1,
      image: null,
    },
  });

  console.log('✅ Created Desserts items');

  // ============================================
  // GETRÄNKE
  // ============================================
  const getraenkeItems = [
    { name: 'Sprite 0,33l', price: 2.50 },
    { name: 'Coca Cola 0,33l', price: 2.50 },
    { name: 'Cola Zero 0,33l', price: 2.50 },
    { name: 'Fanta 0,33l', price: 2.50 },
    { name: 'Mezzo Mix 0,33l', price: 2.50 },
    { name: 'Orangina 0,25l', price: 2.00 },
    { name: 'Orangina Orange 0,25l', price: 2.00 },
    { name: 'Capri Sonne 0,20l', price: 1.20 },
    { name: 'Durstlöscher 0,5l', price: 1.50 },
    { name: 'Malzbier 0,5l', price: 2.50 },
    { name: 'Wasser 0,25l', price: 2.00 },
    { name: 'Ayran', price: 2.00 },
    { name: 'Ice Tea', price: 2.00 },
  ];

  for (let i = 0; i < getraenkeItems.length; i++) {
    const item = getraenkeItems[i];
    await prisma.menuItem.create({
      data: {
        categoryId: categoryMap['getraenke'],
        name: item.name,
        basePrice: item.price,
        isVegetarian: true,
        isVegan: true,
        sortOrder: i + 1,
      },
    });
  }

  console.log('✅ Created Getränke items');

  // ============================================
  // EXTRAS
  // ============================================
  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['extras'],
      name: 'Ketchup, Mayonnaise, Süßsauersauce oder Currysauce',
      basePrice: 0.50,
      isVegetarian: true,
      sortOrder: 1,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['extras'],
      name: 'Extrabelag Meeresfrüchte',
      basePrice: 3.00,
      sortOrder: 2,
    },
  });

  await prisma.menuItem.create({
    data: {
      categoryId: categoryMap['extras'],
      name: 'Extrabelag (Käse, Salami, Schinken, Thunfisch, etc.)',
      basePrice: 2.50,
      sortOrder: 3,
    },
  });

  console.log('✅ Created Extras items');

  // ============================================
  // ADD-ONS (for pizzas)
  // ============================================
  const addOns = [
    { name: 'Extra Käse', nameEn: 'Extra Cheese', price: 2.50 },
    { name: 'Extra Salami', nameEn: 'Extra Salami', price: 2.50 },
    { name: 'Extra Schinken', nameEn: 'Extra Ham', price: 2.50 },
    { name: 'Extra Champignons', nameEn: 'Extra Mushrooms', price: 2.00 },
    { name: 'Extra Paprika', nameEn: 'Extra Bell Pepper', price: 2.00 },
    { name: 'Extra Zwiebeln', nameEn: 'Extra Onions', price: 1.50 },
    { name: 'Extra Oliven', nameEn: 'Extra Olives', price: 2.00 },
    { name: 'Extra Thunfisch', nameEn: 'Extra Tuna', price: 2.50 },
    { name: 'Extra Artischocken', nameEn: 'Extra Artichokes', price: 2.50 },
    { name: 'Extra Spinat', nameEn: 'Extra Spinach', price: 2.00 },
    { name: 'Extra Knoblauch', nameEn: 'Extra Garlic', price: 1.00 },
    { name: 'Extra Peperoni', nameEn: 'Extra Pepperoni', price: 2.00 },
    { name: 'Extra Meeresfrüchte', nameEn: 'Extra Seafood', price: 3.00 },
    { name: 'Extra Scampi', nameEn: 'Extra Shrimp', price: 3.50 },
    { name: 'Extra Lachs', nameEn: 'Extra Salmon', price: 3.50 },
  ];

  for (const addOn of addOns) {
    await prisma.addOn.create({
      data: {
        name: addOn.name,
        nameEn: addOn.nameEn,
        price: addOn.price,
      },
    });
  }

  console.log('✅ Created Add-ons');

  // ============================================
  // DELIVERY ZONES
  // ============================================
  const deliveryZones = [
    { postalCode: '42781', deliveryFee: 0, minimumOrder: 15, estimatedMinutes: 30 }, // Haan
    { postalCode: '42697', deliveryFee: 2, minimumOrder: 20, estimatedMinutes: 40 }, // Solingen
    { postalCode: '42699', deliveryFee: 2, minimumOrder: 20, estimatedMinutes: 40 }, // Solingen
    { postalCode: '40699', deliveryFee: 2.5, minimumOrder: 20, estimatedMinutes: 45 }, // Erkrath
    { postalCode: '40822', deliveryFee: 2, minimumOrder: 20, estimatedMinutes: 40 }, // Mettmann
    { postalCode: '42489', deliveryFee: 3, minimumOrder: 25, estimatedMinutes: 50 }, // Wülfrath
  ];

  for (const zone of deliveryZones) {
    await prisma.deliveryZone.create({
      data: zone,
    });
  }

  console.log('✅ Created Delivery zones');

  console.log('');
  console.log('🎉 Database seeded successfully!');
  console.log('');
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
