// ============================================
// НА ВКУС СУДЬБЫ
// DATA
// ============================================

export const cuisines = [
  {
    id: "japanese",
    name: "Японская",
    emoji: "🍣",
    mood: "точная, спокойная и эстетичная",
    description:
      "Японская кухня — это внимание к продукту, балансу и каждой детали блюда.",
    facts: [
      "У японской кухни есть пятый вкус — умами. Именно он отвечает за ощущение насыщенности и глубины вкуса.",
      "В японской кухне важен не только вкус еды, но и то, как она выглядит и подаётся.",
      "Сезонность — одна из главных идей японской кухни: продукты стараются использовать именно тогда, когда они наиболее хороши.",
    ],
    dishes: [
      "🍣 Суши",
      "🍜 Рамен",
      "🥟 Гёдза",
      "🍤 Темпура",
      "🥩 Вагю",
    ],
    map: {
      country: "Япония",
      emoji: "🇯🇵",
      lat: 36.2048,
      lng: 138.2529,
    },
    restaurants: [
      {
        id: "japanese-1",
        name: "Ю-МЭ",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Ю-МЭ+Москва",
      },
      {
        id: "japanese-2",
        name: "Izumi",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Izumi+Москва",
      },
      {
        id: "japanese-3",
        name: "Coba hand roll bar",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Coba+hand+roll+bar+Москва",
      },
    ],
  },

  {
    id: "italian",
    name: "Итальянская",
    emoji: "🍝",
    mood: "тёплая, романтичная и совсем не спешит",
    description:
      "Паста, вино, простые продукты и ощущение, будто вечер внезапно оказался где-то в Италии.",
    facts: [
      "Итальянская кухня сильно отличается от региона к региону — кухня Рима совсем не похожа на сицилийскую.",
      "Паста считается настолько важной частью культуры, что в Италии существуют сотни её форм и видов.",
      "Настоящая итальянская кухня часто строится вокруг очень небольшого количества качественных ингредиентов.",
    ],
    dishes: [
      "🍝 Паста",
      "🍕 Пицца",
      "🍚 Ризотто",
      "🥩 Карпаччо",
      "🍰 Тирамису",
    ],
    map: {
      country: "Италия",
      emoji: "🇮🇹",
      lat: 41.8719,
      lng: 12.5674,
    },
    restaurants: [
      {
        id: "italian-1",
        name: "La Bottega Siciliana",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=La+Bottega+Siciliana+Москва",
      },
      {
        id: "italian-2",
        name: "Trattoria Mozza",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Trattoria+Mozza+Москва",
      },
      {
        id: "italian-3",
        name: "Cantinetta Antinori",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Cantinetta+Antinori+Москва",
      },
    ],
  },

  {
    id: "georgian",
    name: "Грузинская",
    emoji: "🥟",
    mood: "громкая, щедрая и располагающая к разговорам",
    description:
      "Хинкали, хачапури, вино и тот самый стол, за которым вечер сам становится длиннее.",
    facts: [
      "Хинкали традиционно едят руками, а бульон внутри считается одной из главных частей блюда.",
      "Грузинское застолье — это отдельная культура со своими правилами, тостами и традициями.",
      "В Грузии существует множество региональных вариантов хачапури, и они могут сильно отличаться друг от друга.",
    ],
    dishes: [
      "🥟 Хинкали",
      "🧀 Хачапури",
      "🍢 Шашлык",
      "🥗 Пхали",
      "🍷 Грузинское вино",
    ],
    map: {
      country: "Грузия",
      emoji: "🇬🇪",
      lat: 42.3154,
      lng: 43.3569,
    },
    restaurants: [
      {
        id: "georgian-1",
        name: "Хинкали и Вино",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Хинкали+и+Вино+Москва",
      },
      {
        id: "georgian-2",
        name: "Жарим по-грузински",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Жарим+по-грузински+Москва",
      },
      {
        id: "georgian-3",
        name: "Эларджи",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Эларджи+Москва",
      },
    ],
  },

  {
    id: "mexican",
    name: "Мексиканская",
    emoji: "🌮",
    mood: "яркая, дерзкая и немного безбашенная",
    description:
      "Острый вечер, яркие вкусы, кукуруза, авокадо и немного приятного хаоса.",
    facts: [
      "Традиционная мексиканская кухня входит в список нематериального культурного наследия ЮНЕСКО.",
      "Кукуруза — один из фундаментальных продуктов мексиканской кухни.",
      "Мексиканская кухня сильно отличается по регионам: на побережье и в центральной части страны едят очень разную еду.",
    ],
    dishes: [
      "🌮 Тако",
      "🌯 Буррито",
      "🥑 Гуакамоле",
      "🫓 Кесадилья",
      "🌶️ Начос",
    ],
    map: {
      country: "Мексика",
      emoji: "🇲🇽",
      lat: 23.6345,
      lng: -102.5528,
    },
    restaurants: [
      {
        id: "mexican-1",
        name: "Casa Agave",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Casa+Agave+Москва",
      },
      {
        id: "mexican-2",
        name: "Pancho Villa",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Pancho+Villa+Москва",
      },
      {
        id: "mexican-3",
        name: "Tacodor",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Tacodor+Москва",
      },
    ],
  },

  {
    id: "thai",
    name: "Тайская",
    emoji: "🍜",
    mood: "экзотичная, острая и очень живая",
    description:
      "Баланс сладкого, кислого, острого и солёного — кухня, которая почти никогда не оставляет равнодушным.",
    facts: [
      "Одна из главных особенностей тайской кухни — сочетание нескольких противоположных вкусов в одном блюде.",
      "Том ям одновременно может быть острым, кислым, солёным и ароматным.",
      "Свежие травы и специи играют в тайской кухне не меньшую роль, чем основные ингредиенты.",
    ],
    dishes: [
      "🍜 Пад тай",
      "🍲 Том ям",
      "🍛 Зелёный карри",
      "🥭 Манго с клейким рисом",
      "🥗 Сом там",
    ],
    map: {
      country: "Таиланд",
      emoji: "🇹🇭",
      lat: 15.87,
      lng: 100.9925,
    },
    restaurants: [
      {
        id: "thai-1",
        name: "Black Thai",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Black+Thai+Москва",
      },
      {
        id: "thai-2",
        name: "Chang Thai",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Chang+Thai+Москва",
      },
      {
        id: "thai-3",
        name: "Neon Monkey",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Neon+Monkey+Москва",
      },
    ],
  },

  {
    id: "indian",
    name: "Индийская",
    emoji: "🍛",
    mood: "ароматная, насыщенная и немного безумная",
    description:
      "Специи, пряности, соусы и огромное количество вкусов, которые раскрываются один за другим.",
    facts: [
      "Индийская кухня — это не одна кухня, а огромное количество региональных традиций.",
      "Специи в индийской кухне используются не только ради остроты — они создают аромат и глубину блюда.",
      "Многие индийские блюда строятся вокруг сложных сочетаний специй, которые могут сильно отличаться от региона к региону.",
    ],
    dishes: [
      "🍛 Карри",
      "🫓 Наан",
      "🥟 Самоса",
      "🍚 Бирьяни",
      "🥘 Дал",
    ],
    map: {
      country: "Индия",
      emoji: "🇮🇳",
      lat: 20.5937,
      lng: 78.9629,
    },
    restaurants: [
      {
        id: "indian-1",
        name: "Москва-Дели",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Москва-Дели+Москва",
      },
      {
        id: "indian-2",
        name: "Хаджурао",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Хаджурао+Москва",
      },
      {
        id: "indian-3",
        name: "Дарбарс",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Дарбарс+Москва",
      },
    ],
  },

  {
    id: "korean",
    name: "Корейская",
    emoji: "🥢",
    mood: "острая, энергичная и очень общительная",
    description:
      "Кимчи, BBQ, ферментация и множество маленьких блюд, которые хочется пробовать вместе.",
    facts: [
      "Ферментация — одна из основ корейской кухни.",
      "Кимчи существует в огромном количестве вариантов, и рецепты отличаются даже между регионами и семьями.",
      "Корейская трапеза часто состоит из множества небольших закусок, которые ставят на стол одновременно.",
    ],
    dishes: [
      "🥬 Кимчи",
      "🥩 Корейское BBQ",
      "🍜 Рамен",
      "🥞 Пачон",
      "🍚 Пибимпап",
    ],
    map: {
      country: "Южная Корея",
      emoji: "🇰🇷",
      lat: 35.9078,
      lng: 127.7669,
    },
    restaurants: [
      {
        id: "korean-1",
        name: "Корё",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Корё+Москва",
      },
      {
        id: "korean-2",
        name: "КИМЧИ",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=КИМЧИ+Москва",
      },
      {
        id: "korean-3",
        name: "Дом Куксу",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Дом+Куксу+Москва",
      },
    ],
  },

  {
    id: "turkish",
    name: "Турецкая",
    emoji: "🫓",
    mood: "солнечная, щедрая и очень гостеприимная",
    description:
      "Мезе, мясо, свежий хлеб, овощи и ощущение огромного стола, за которым все должны попробовать всё.",
    facts: [
      "Турецкая кухня сформировалась под влиянием множества культур и регионов.",
      "Мезе — это не одно блюдо, а целая традиция множества небольших закусок для совместного стола.",
      "Турецкая кухня особенно богата блюдами на основе овощей, мяса, йогурта и теста.",
    ],
    dishes: [
      "🥙 Кебаб",
      "🫓 Пиде",
      "🥗 Мезе",
      "🍆 Имам баялды",
      "🍮 Баклава",
    ],
    map: {
      country: "Турция",
      emoji: "🇹🇷",
      lat: 38.9637,
      lng: 35.2433,
    },
    restaurants: [
      {
        id: "turkish-1",
        name: "Taksim",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Taksim+Москва",
      },
      {
        id: "turkish-2",
        name: "Босфор",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Босфор+Москва",
      },
      {
        id: "turkish-3",
        name: "Месопотамия",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Месопотамия+Москва",
      },
    ],
  },

  {
    id: "american",
    name: "Американская",
    emoji: "🇺🇸",
    mood: "расслабленная, щедрая и немного безбашенная",
    description:
      "Бургеры, BBQ, большие порции и кухня, которая умеет превращать простое в культовое.",
    facts: [
      "Американская кухня сформировалась под влиянием множества культур и иммигрантских традиций.",
      "BBQ в разных штатах США настолько отличается, что фактически существует несколько разных BBQ-культур.",
      "Даже такие привычные блюда, как бургер, имеют длинную историю и множество региональных вариантов.",
    ],
    dishes: [
      "🍔 Бургер",
      "🌭 Хот-дог",
      "🍗 BBQ",
      "🥞 Панкейки",
      "🥧 Американский пирог",
    ],
    map: {
      country: "США",
      emoji: "🇺🇸",
      lat: 37.0902,
      lng: -95.7129,
    },
    restaurants: [
      {
        id: "american-1",
        name: "Starlite Diner",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Starlite+Diner+Москва",
      },
      {
        id: "american-2",
        name: "California Diner",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=California+Diner+Москва",
      },
      {
        id: "american-3",
        name: "Beverly Hills Diner",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Beverly+Hills+Diner+Москва",
      },
    ],
  },

  {
    id: "chinese",
    name: "Китайская",
    emoji: "🥢",
    mood: "яркая, насыщенная и максимально совместная",
    description:
      "Хот-пот, специи, лапша и еда, которую хочется готовить и пробовать прямо за столом вместе.",
    facts: [
      "Китайская кухня включает огромное количество региональных традиций, и блюда разных провинций могут быть совершенно непохожими.",
      "Хого, или китайский самовар, — это формат совместной еды: ингредиенты готовятся прямо в кипящем бульоне на столе.",
      "В китайской кухне большое значение имеют текстуры — хрустящее, мягкое, упругое и нежное могут сочетаться в одном приёме пищи.",
    ],
    dishes: [
      "🍲 Хот-пот",
      "🥟 Димсам",
      "🍜 Лапша",
      "🥩 Мапо-тофу",
      "🦆 Пекинская утка",
    ],
    map: {
      country: "Китай",
      emoji: "🇨🇳",
      lat: 35.8617,
      lng: 104.1954,
    },
    restaurants: [
      {
        id: "chinese-1",
        name: "Чуаньюй",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Чуаньюй+Москва",
        special: "🍲 Хот-пот",
      },
      {
        id: "chinese-2",
        name: "Китайский Самовар",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Китайский+Самовар+Москва",
        special: "🍲 Хот-пот",
      },
      {
        id: "chinese-3",
        name: "Кирин",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Кирин+Москва",
      },
    ],
  },

  // ============================================
  // НОВЫЕ КУХНИ
  // ============================================

  {
    id: "armenian",
    name: "Армянская",
    emoji: "🇦🇲",
    mood: "тёплая, домашняя и очень щедрая",
    description:
      "Лаваш, мясо, травы, сыр и кухня, в которой гостеприимство ощущается ещё до первого блюда.",
    facts: [
      "Армянский лаваш включён ЮНЕСКО в список нематериального культурного наследия человечества.",
      "Армянская кухня активно использует свежую зелень, которую часто подают к столу целыми пучками.",
      "Многие традиционные армянские блюда связаны с долгим приготовлением и семейными застольями.",
    ],
    dishes: [
      "🫓 Лаваш",
      "🍖 Хоровац",
      "🥟 Толма",
      "🍲 Хаш",
      "🍰 Гата",
    ],
    map: {
      country: "Армения",
      emoji: "🇦🇲",
      lat: 40.0691,
      lng: 45.0382,
    },
    restaurants: [
      {
        id: "armenian-1",
        name: "Gayane's",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Gayane's+Москва",
      },
      {
        id: "armenian-2",
        name: "Ararat",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Ararat+ресторан+Москва",
      },
      {
        id: "armenian-3",
        name: "Армения",
        address: "Москва, Тверская улица",
        maps:
          "https://www.google.com/maps/search/?api=1&query=ресторан+Армения+Тверская+Москва",
      },
    ],
  },

  {
    id: "spanish",
    name: "Испанская",
    emoji: "🇪🇸",
    mood: "страстная, шумная и созданная для долгого вечера",
    description:
      "Тапас, морепродукты, хамон и маленькие тарелки, из-за которых ужин незаметно превращается в несколько часов.",
    facts: [
      "Тапас — это не конкретное блюдо, а формат небольших закусок, которыми принято делиться.",
      "Паэлья родом из Валенсии, а её традиционные варианты заметно отличаются от туристических версий.",
      "Испанский хамон может выдерживаться годами, а его нарезка считается отдельным мастерством.",
    ],
    dishes: [
      "🥘 Паэлья",
      "🥓 Хамон",
      "🍤 Гамбас",
      "🥔 Пататас бравас",
      "🍮 Крема каталана",
    ],
    map: {
      country: "Испания",
      emoji: "🇪🇸",
      lat: 40.4637,
      lng: -3.7492,
    },
    restaurants: [
      {
        id: "spanish-1",
        name: "Padron",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Padron+ресторан+Москва",
      },
      {
        id: "spanish-2",
        name: "El Asador",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=El+Asador+Москва",
      },
      {
        id: "spanish-3",
        name: "Pa-Paella",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Pa-Paella+Москва",
      },
    ],
  },

  {
    id: "vietnamese",
    name: "Вьетнамская",
    emoji: "🇻🇳",
    mood: "свежая, ароматная и немного уличная",
    description:
      "Лапша, травы, лайм, бульоны и кухня, в которой свежесть встречается с очень глубокими вкусами.",
    facts: [
      "Фо может заметно отличаться в разных регионах Вьетнама — северные и южные версии имеют свои особенности.",
      "Свежая зелень во вьетнамской кухне часто подаётся отдельно, чтобы каждый добавлял её в блюдо самостоятельно.",
      "Вьетнамская кухня сочетает местные традиции с историческими влияниями других культур.",
    ],
    dishes: [
      "🍜 Фо",
      "🥖 Бань ми",
      "🥬 Спринг-роллы",
      "🥞 Бань сео",
      "☕ Вьетнамский кофе",
    ],
    map: {
      country: "Вьетнам",
      emoji: "🇻🇳",
      lat: 14.0583,
      lng: 108.2772,
    },
    restaurants: [
      {
        id: "vietnamese-1",
        name: "Bổ",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Bổ+вьетнамский+ресторан+Москва",
      },
      {
        id: "vietnamese-2",
        name: "PHO Fighters",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=PHO+Fighters+Москва",
      },
      {
        id: "vietnamese-3",
        name: "V'yetkafe",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=V'yetkafe+Москва",
      },
    ],
  },

  {
    id: "greek",
    name: "Греческая",
    emoji: "🇬🇷",
    mood: "солнечная, лёгкая и очень отпускная",
    description:
      "Мезе, сыр, оливки, рыба и ощущение, будто до моря осталось пройти несколько метров.",
    facts: [
      "Греческая кухня традиционно строится вокруг оливкового масла, овощей, трав, сыра и сезонных продуктов.",
      "Мезе — это формат множества небольших блюд, которые ставят на стол для всей компании.",
      "Фета имеет защищённое наименование происхождения в Европейском союзе.",
    ],
    dishes: [
      "🥗 Хориатики",
      "🧀 Фета",
      "🥙 Гирос",
      "🍆 Мусака",
      "🐙 Осьминог",
    ],
    map: {
      country: "Греция",
      emoji: "🇬🇷",
      lat: 39.0742,
      lng: 21.8243,
    },
    restaurants: [
      {
        id: "greek-1",
        name: "Molon Lave",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Molon+Lave+Москва",
      },
      {
        id: "greek-2",
        name: "Eva",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Eva+греческий+ресторан+Москва",
      },
      {
        id: "greek-3",
        name: "Porto Mykonos",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Porto+Mykonos+Москва",
      },
    ],
  },

  {
    id: "french",
    name: "Французская",
    emoji: "🇫🇷",
    mood: "романтичная, неторопливая и немного нарядная",
    description:
      "Соусы, сыр, выпечка и тот редкий случай, когда долгий ужин сам по себе становится планом на вечер.",
    facts: [
      "Французская гастрономическая трапеза включена в список нематериального культурного наследия ЮНЕСКО.",
      "Французская кухня сильно различается по регионам — от средиземноморского Прованса до Эльзаса и Бретани.",
      "Во Франции существуют сотни разновидностей сыров, связанных с разными регионами и способами производства.",
    ],
    dishes: [
      "🥐 Круассан",
      "🧅 Луковый суп",
      "🥩 Тартар",
      "🧀 Французские сыры",
      "🍮 Крем-брюле",
    ],
    map: {
      country: "Франция",
      emoji: "🇫🇷",
      lat: 46.2276,
      lng: 2.2137,
    },
    restaurants: [
      {
        id: "french-1",
        name: "Geraldine",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Geraldine+Москва",
      },
      {
        id: "french-2",
        name: "Le Carré",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Le+Carre+restaurant+Москва",
      },
      {
        id: "french-3",
        name: "Mishel",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Mishel+французский+ресторан+Москва",
      },
    ],
  },

  {
    id: "lebanese",
    name: "Ливанская",
    emoji: "🇱🇧",
    mood: "пряная, щедрая и созданная для двоих",
    description:
      "Хумус, мезе, лепёшки, мясо и стол, на котором почти невозможно понять, какое блюдо было главным.",
    facts: [
      "Ливанская трапеза часто начинается с большого набора мезе, которые делят между всеми за столом.",
      "В ливанской кухне широко используются лимон, оливковое масло, петрушка, мята, кунжут и специи.",
      "Табуле в ливанской традиции — прежде всего салат из большого количества петрушки, а не крупы.",
    ],
    dishes: [
      "🧆 Фалафель",
      "🥣 Хумус",
      "🥗 Табуле",
      "🥩 Кебаб",
      "🫓 Манакиш",
    ],
    map: {
      country: "Ливан",
      emoji: "🇱🇧",
      lat: 33.8547,
      lng: 35.8623,
    },
    restaurants: [
      {
        id: "lebanese-1",
        name: "Mister Livanets",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Mister+Livanets+Москва",
      },
      {
        id: "lebanese-2",
        name: "Cafe Beirut",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Cafe+Beirut+Москва",
      },
      {
        id: "lebanese-3",
        name: "Beirut",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Beirut+ливанский+ресторан+Москва",
      },
    ],
  },

  {
    id: "uzbek",
    name: "Узбекская",
    emoji: "🇺🇿",
    mood: "сытная, тёплая и по-хорошему неспешная",
    description:
      "Плов, лепёшки, мясо и тот тип ужина, после которого уже точно никуда не хочется торопиться.",
    facts: [
      "В Узбекистане существует множество региональных вариантов плова с разными ингредиентами и техникой приготовления.",
      "Культура приготовления плова в Узбекистане включена в список нематериального культурного наследия ЮНЕСКО.",
      "Традиционный узбекский стол тесно связан с гостеприимством и совместной трапезой.",
    ],
    dishes: [
      "🍚 Плов",
      "🥟 Манты",
      "🥟 Самса",
      "🍜 Лагман",
      "🫓 Лепёшка",
    ],
    map: {
      country: "Узбекистан",
      emoji: "🇺🇿",
      lat: 41.3775,
      lng: 64.5853,
    },
    restaurants: [
      {
        id: "uzbek-1",
        name: "Узбекистан",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=ресторан+Узбекистан+Москва",
      },
      {
        id: "uzbek-2",
        name: "Восточный квартал",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Восточный+квартал+Москва",
      },
      {
        id: "uzbek-3",
        name: "Урюк",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Урюк+ресторан+Москва",
      },
    ],
  },

  {
    id: "brazilian",
    name: "Бразильская",
    emoji: "🇧🇷",
    mood: "яркая, мясная и настроенная праздновать",
    description:
      "Гриль, фасоль, тропические вкусы и кухня, которая совершенно не собирается быть скромной.",
    facts: [
      "Фейжоада считается одним из самых известных блюд Бразилии и готовится на основе фасоли и мяса.",
      "Бразильская кухня сформировалась под влиянием коренных народов, португальской традиции и африканских культур.",
      "Чурраско — важная часть гастрономической культуры юга Бразилии и связано с приготовлением мяса на огне.",
    ],
    dishes: [
      "🥩 Пиканья",
      "🍲 Фейжоада",
      "🧀 Pão de queijo",
      "🐟 Мокека",
      "🍫 Бригадейро",
    ],
    map: {
      country: "Бразилия",
      emoji: "🇧🇷",
      lat: -14.235,
      lng: -51.9253,
    },
    restaurants: [
      {
        id: "brazilian-1",
        name: "Lars Vegans",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Lars+Vegans+Москва",
      },
      {
        id: "brazilian-2",
        name: "Cafezinho do Brasil",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Cafezinho+do+Brasil+Москва",
      },
      {
        id: "brazilian-3",
        name: "Brazilian Steak House",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Brazilian+Steak+House+Москва",
      },
    ],
  },
];

// ============================================
// ЗАДАНИЯ
// ============================================

export const tasks = [
  "Сегодня каждый выбирает блюдо другому.",

  "Нельзя обсуждать работу весь вечер.",

  "Каждый должен рассказать историю, которую второй ещё не слышал.",

  "Выберите блюдо с самым странным названием.",

  "В конце вечера каждый называет момент свидания, который запомнил больше всего.",
];

// ============================================
// РЕСТОРАНЫ
// Автоматически собираются из всех кухонь.
// ============================================

export const restaurants = cuisines.flatMap((cuisine) =>
  cuisine.restaurants.map((restaurant) => ({
    ...restaurant,
    cuisineId: cuisine.id,
    cuisineName: cuisine.name,
    cuisineEmoji: cuisine.emoji,
    country: cuisine.map.country,
    countryEmoji: cuisine.map.emoji,
    lat: cuisine.map.lat,
    lng: cuisine.map.lng,
  }))
);

// ============================================
// СТРАНЫ ДЛЯ КАРТЫ
// Автоматически создаются из cuisines.
// ============================================

export const mapCountries = cuisines.map((cuisine) => ({
  cuisineId: cuisine.id,
  cuisineName: cuisine.name,
  emoji: cuisine.map.emoji,
  country: cuisine.map.country,
  lat: cuisine.map.lat,
  lng: cuisine.map.lng,
}));

// ============================================
// ИСТОРИЯ СВИДАНИЙ
// ============================================
//
// Пока пустая.
// Позже сюда придут реальные данные из Supabase.
//
// Пример:
//
// {
//   id: "date-001",
//   cuisineId: "georgian",
//   restaurantId: "georgian-1",
//   restaurantName: "Хинкали и Вино",
//   date: "2026-09-15",
//   time: "19:00",
//   rating: 9,
//   review: "Очень вкусно. Хинкали — любовь.",
//   visited: true,
// }
//
// ============================================

export const dateHistory = [];

// ============================================
// DEFAULT EXPORT
// ============================================

export default cuisines;
