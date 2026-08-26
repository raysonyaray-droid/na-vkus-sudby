import { useState } from "react";

const cuisines = [
  {
    name: "Японская",
    emoji: "🍣",
    description: "Точность, минимализм и еда, где важна каждая деталь.",
  },
  {
    name: "Итальянская",
    emoji: "🍝",
    description: "Паста, вино, долгие разговоры и ощущение маленькой Италии.",
  },
  {
    name: "Грузинская",
    emoji: "🥟",
    description: "Хинкали, хачапури и стол, за которым невозможно молчать.",
  },
  {
    name: "Мексиканская",
    emoji: "🌮",
    description: "Острый вечер, яркие вкусы и немного хаоса.",
  },
  {
    name: "Тайская",
    emoji: "🍜",
    description: "Баланс сладкого, кислого, острого и солёного.",
  },
  {
    name: "Индийская",
    emoji: "🍛",
    description: "Специи, пряности и кухня, которая умеет удивлять.",
  },
  {
    name: "Корейская",
    emoji: "🥢",
    description: "Остро, шумно, красиво и совсем не скучно.",
  },
  {
    name: "Турецкая",
    emoji: "🫓",
    description: "Мезе, мясо, лепёшки и очень много всего на столе.",
  },
];

const tasks = [
  "Сегодня каждый выбирает блюдо другому.",
  "Нельзя обсуждать работу весь вечер.",
  "Каждый должен рассказать историю, которую второй ещё не слышал.",
  "Выберите блюдо с самым странным названием.",
  "В конце вечера каждый называет момент свидания, который запомнил больше всего.",
];

function App() {
  const [screen, setScreen] = useState("home");
  const [cuisine, setCuisine] = useState(null);
  const [task, setTask] = useState(null);

  function startDestiny() {
    const randomCuisine =
      cuisines[Math.floor(Math.random() * cuisines.length)];

    const randomTask =
      tasks[Math.floor(Math.random() * tasks.length)];

    setCuisine(randomCuisine);
    setTask(randomTask);
    setScreen("result");
  }

  return (
    <main className="app">
      {screen === "home" && (
        <section className="home">
          <div className="eyebrow">SONYA × SASHA</div>

          <h1>
            НА ВКУС
            <br />
            <span>СУДЬБЫ</span>
          </h1>

          <p className="subtitle">
            Вы не выбираете.
            <br />
            Вы доверяетесь.
          </p>

          <button onClick={startDestiny} className="destiny-button">
            ПЕРЕДАТЬСЯ СУДЬБЕ
          </button>

          <p className="hint">
            кухня · ресторан · задание
          </p>
        </section>
      )}

      {screen === "result" && cuisine && (
        <section className="result">
          <div className="eyebrow">СУДЬЯ СУДЬБЫ РЕШИЛ</div>

          <div className="emoji">{cuisine.emoji}</div>

          <h2>{cuisine.name}</h2>

          <p>{cuisine.description}</p>

          <div className="task">
            <span>ВАШЕ ЗАДАНИЕ</span>
            <strong>{task}</strong>
          </div>

          <button
            onClick={() => setScreen("restaurant")}
            className="secondary-button"
          >
            НАЙТИ РЕСТОРАН →
          </button>

          <button
            onClick={() => setScreen("home")}
            className="text-button"
          >
            бросить судьбу ещё раз
          </button>
        </section>
      )}

      {screen === "restaurant" && cuisine && (
        <section className="result">
          <div className="eyebrow">СУДЬЯ ПРОДОЛЖАЕТ</div>

          <div className="emoji">🍽️</div>

          <h2>РЕСТОРАН</h2>

          <p>
            Здесь появится подборка ресторанов Москвы с кухней:
          </p>

          <strong>{cuisine.name}</strong>

          <div className="task">
            <span>СЛЕДУЮЩИЙ ЭТАП</span>
            <strong>
              Каждый тайно выбирает один ресторан.
              Судья узнает ваши решения только после
              того, как выберут оба.
            </strong>
          </div>

          <button
            onClick={() => setScreen("home")}
            className="secondary-button"
          >
            ВЕРНУТЬСЯ
          </button>
        </section>
      )}
    </main>
  );
}

export default App;
