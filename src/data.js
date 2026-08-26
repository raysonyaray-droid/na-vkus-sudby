export const cuisines = [
  {
    id: "japanese",
    name: "Японская",
    emoji: "🍣",

    description:
      "Точность, минимализм и еда, где важна каждая деталь.",

    fact:
      "В японской кухне особенно ценится естественный вкус продукта. А умами — тот самый «пятый вкус», который делает еду насыщеннее.",

    mood: "спокойная, эстетичная и немного загадочная",

    dishes: [
      "🍣 суши",
      "🍜 рамен",
      "🥟 гёдза",
      "🍤 темпура",
      "🥩 вагю",
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
        address: "ул. Покровка, 38А, Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Ю-МЭ+Москва+Покровка+38А",
      },
      {
        id: "japanese-2",
        name: "Izumi",
        address: "Мясницкая ул., 38с1, Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Izumi+Москва+Мясницкая+38с1",
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

    description:
      "Паста, вино, долгие разговоры и ощущение маленькой Италии.",

    fact:
      "Итальянская кухня сильно отличается от региона к региону. То, что считается классикой в Риме, может совсем не быть классикой на Сицилии.",

    mood: "тёплая, романтичная и совершенно не спешит",

    dishes: [
      "🍝 паста",
      "🍕 пицца",
      "🥩 карпаччо",
      "🍚 ризотто",
      "🍰 тирамису",
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
        address: "ул. Охотный Ряд, 2, Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=La+Bottega+Siciliana+Москва",
      },
      {
        id: "italian-2",
        name: "Trattoria Mozza",
        address: "Лесная ул., 7, Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Trattoria+Mozza+Москва",
      },
      {
        id: "italian-3",
        name: "Cantinetta Antinori",
        address: "Денежный пер., 20, Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Cantinetta+Antinori+Москва",
      },
    ],
  },

  {
    id: "georgian",
    name: "Грузинская",
    emoji: "🥟",

    description:
      "Хинкали, хачапури, вино и стол, за которым невозможно молчать.",

    fact:
      "Хинкали традиционно едят руками, а бульон внутри считается одной из главных частей блюда. А грузинское застолье — это целая культура со своими правилами и тостами.",

    mood: "громкая, щедрая и располагающая к разговорам",

    dishes: [
      "🥟 хинкали",
      "🧀 хачапури",
      "🍢 шашлык",
      "🥗 пхали",
      "🍷 грузинское вино",
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

    description:
      "Острый вечер, яркие вкусы и немного хаоса.",

    fact:
      "Традиционная мексиканская кухня входит в список нематериального культурного наследия ЮНЕСКО.",

    mood: "яркая, дерзкая и совершенно без стеснения",

    dishes: [
      "🌮 тако",
      "🌯 буррито",
      "🥑 гуакамоле",
      "🫓 кесадилья",
      "🌶️ начос",
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

    description:
      "Баланс сладкого, кислого, острого и солёного.",

    fact:
      "Одна из главных особенностей тайской кухни — попытка собрать несколько противоположных вкусов в одном блюде.",

    mood: "экзотичная, острая и очень живая",

    dishes: [
      "🍜 пад тай",
      "🍲 том ям",
      "🍛 зелёный карри",
      "🥭 манго с рисом",
      "🥗 сом там",
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

    description:
      "Специи, пряности и кухня, которая умеет удивлять.",

    fact:
      "Индийская кухня настолько разнообразна, что правильнее говорить о множестве региональных кухонь, а не об одной.",

    mood: "ароматная, насыщенная и немного безумная",

    dishes: [
      "🍛 карри",
      "🫓 наан",
      "🥟 самоса",
      "🍚 бирьяни",
      "🥘 дал",
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

    description:
      "Остро, шумно, красиво и совсем не скучно.",

    fact:
      "Ферментация — одна из основ корейской кухни. Именно поэтому кимчи, пасты и другие ферментированные продукты занимают в ней такое большое место.",

    mood: "острая, энергичная и очень общительная",

    dishes: [
      "🥬 кимчи",
      "🥩 корейское BBQ",
      "🍜 рамен",
      "🥞 пачон",
      "🍚 пибимпап",
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

    description:
      "Мезе, мясо, лепёшки и очень много всего на столе.",

    fact:
      "Турецкая кухня сформировалась под влиянием огромного количества культур, а мезе — один из лучших примеров еды, созданной для совместного застолья.",

    mood: "щедрая, солнечная и очень гостеприимная",

    dishes: [
      "🥙 кебаб",
      "🫓 пиде",
      "🥗 мезе",
      "🍆 имам баялды",
      "🍮 баклава",
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

    description:
      "Бургеры, BBQ, большие порции и кухня, которая умеет превращать простое в культовое.",

    fact:
      "Американская кухня — это смесь огромного количества культур. Поэтому у неё нет одного единственного «лица»: от техасского BBQ до нью-йоркского чизкейка.",

    mood: "расслабленная, щедрая и немного безбашенная",

    dishes: [
      "🍔 бургер",
      "🌭 хот-дог",
      "🍗 BBQ",
      "🥞 панкейки",
      "🥧 американский пирог",
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

    description:
      "Огонь, специи, общая кастрюля и еда, которую вы готовите прямо за столом.",

    fact:
      "Хого, или китайский самовар, — это не просто блюдо, а целый формат совместной еды: вы выбираете бульон и ингредиенты, а затем готовите их прямо за столом.",

    mood: "яркая, острая и максимально совместная",

    dishes: [
      "🍲 хого",
      "🥟 димсам",
      "🍜 лапша",
      "🥩 мапо-тофу",
      "🥢 пекинская утка",
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
        special: "🍲 Хого / китайский самовар",
      },
      {
        id: "chinese-2",
        name: "Китайский Самовар Ипинлао",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Китайский+Самовар+Ипинлао+Москва",
        special: "🍲 Хот-пот",
      },
      {
        id: "chinese-3",
        name: "Китайский ресторан Кирин",
        address: "Москва",
        maps:
          "https://www.google.com/maps/search/?api=1&query=Китайский+ресторан+Кирин+Москва",
      },
    ],
  },
];

export const tasks = [
  "Сегодня каждый выбирает блюдо другому.",

  "Нельзя обсуждать работу весь вечер.",

  "Каждый должен рассказать историю, которую второй ещё не слышал.",

  "Выберите блюдо с самым странным названием.",

  "В конце вечера каждый называет момент свидания, который запомнил больше всего.",
];

// Все рестораны одним массивом.
// Пригодится позже для поиска, фильтрации и Supabase.
export const restaurants = cuisines.flatMap((cuisine) =>
  cuisine.restaurants.map((restaurant) => ({
    ...restaurant,
    cuisineId: cuisine.id,
    cuisineName: cuisine.name,
    cuisineEmoji: cuisine.emoji,
  }))
);

// Данные для будущей карты мира.
// Пока карта просто знает координаты стран,
// позже Supabase будет добавлять сюда ваши реальные походы.
export const mapCountries = cuisines.map((cuisine) => ({
  cuisineId: cuisine.id,
  cuisineName: cuisine.name,
  emoji: cuisine.map.emoji,
  country: cuisine.map.country,
  lat: cuisine.map.lat,
  lng: cuisine.map.lng,
}));

// Данные для будущей истории свиданий.
// Сейчас пусто — сюда потом будут приходить записи из Supabase.
export const dateHistory = [];

// Экспорт по умолчанию — чтобы файл можно было импортировать
// и как `import cuisines from "./data"`,
// и как `import { cuisines } from "./data"`.
export default cuisines;
