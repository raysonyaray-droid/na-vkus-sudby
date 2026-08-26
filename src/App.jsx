import { useState } from "react";
import { cuisines, wildCards, tasks } from "./data";

function App() {
  const [screen, setScreen] = useState("home");
  const [cuisine, setCuisine] = useState(null);
  const [task, setTask] = useState(null);
  const [fact, setFact] = useState(null);

  function startDestiny() {
    const randomCuisine =
      cuisines[Math.floor(Math.random() * cuisines.length)];

    const randomTask =
      tasks[Math.floor(Math.random() * tasks.length)];

    const randomFact =
      randomCuisine.facts[
        Math.floor(Math.random() * randomCuisine.facts.length)
      ];

    setCuisine(randomCuisine);
    setTask(randomTask);
    setFact(randomFact);
    setScreen("result");
  }

  function restart() {
    setCuisine(null);
    setTask(null);
    setFact(null);
    setScreen("home");
  }

  return (
    <main className="app">

      {/* =========================
          ГЛАВНЫЙ ЭКРАН
      ========================== */}

      {screen === "home" && (
        <section className="home">

          <div className="eyebrow">
            SONYA × SASHA
          </div>

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

          <button
            onClick={startDestiny}
            className="destiny-button"
          >
            ОТДАТЬСЯ СУДЬБЕ
          </button>

          <p className="hint">
            кухня · ресторан · задание
          </p>

        </section>
      )}


      {/* =========================
          КУХНЯ
      ========================== */}

      {screen === "result" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА ВЫБРАЛА
          </div>

          <div className="emoji">
            {cuisine.emoji}
          </div>

          <h2>
            {cuisine.name}
          </h2>

          <div className="mood">
            {cuisine.mood}
          </div>

          <div className="info-block">

            <span>О КУХНЕ</span>

            <p>
              {cuisine.description}
            </p>

          </div>


          {/* ФАКТ */}

          <div className="fact">

            <span>
              💡 ЗНАЕТЕ ЛИ ВЫ?
            </span>

            <p>
              {fact}
            </p>

          </div>


          {/* ЧТО ПОПРОБОВАТЬ */}

          <div className="dishes">

            <span>
              ЧТО ПОПРОБОВАТЬ
            </span>

            <div className="dish-list">
              {cuisine.dishes.map((dish) => (
                <div
                  key={dish}
                  className="dish"
                >
                  {dish}
                </div>
              ))}
            </div>

          </div>


          {/* ЗАДАНИЕ */}

          <div className="task">

            <span>
              ВАШЕ ЗАДАНИЕ
            </span>

            <strong>
              {task}
            </strong>

          </div>


          <button
            onClick={() => setScreen("restaurant")}
            className="secondary-button"
          >
            ПОКАЗАТЬ РЕСТОРАНЫ →
          </button>


          <button
            onClick={restart}
            className="text-button"
          >
            бросить судьбу ещё раз
          </button>

        </section>
      )}


      {/* =========================
          РЕСТОРАНЫ
      ========================== */}

      {screen === "restaurant" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА ДОВЕЛА ДО СТОЛА
          </div>

          <div className="emoji">
            🍽️
          </div>

          <h2>
            ВЫБЕРИТЕ РЕСТОРАН
          </h2>

          <p>
            Судьба выбрала вам кухню.
            <br />
            Теперь у каждого есть право
            выбрать место.
          </p>


          {/* РЕСТОРАНЫ */}

          <div className="restaurants">

            {cuisine.restaurants.map((restaurant, index) => (

              <a
                key={restaurant.id}
                href={restaurant.maps}
                target="_blank"
                rel="noreferrer"
                className="restaurant-card"
              >

                <div className="restaurant-number">
                  0{index + 1}
                </div>

                <div className="restaurant-info">

                  <strong>
                    {restaurant.name}
                  </strong>

                  <span>
                    {restaurant.address}
                  </span>

                </div>

                <div className="restaurant-arrow">
                  →
                </div>

              </a>

            ))}

          </div>


          {/* ВЫБОР */}

          <div className="task">

            <span>
              КАК ЭТО РАБОТАЕТ
            </span>

            <strong>
              Каждый из вас тайно выбирает
              один ресторан. После этого
              Судьба решает, куда вы идёте.
            </strong>

          </div>


          <button
            onClick={() => setScreen("choice")}
            className="secondary-button"
          >
            МЫ ВЫБРАЛИ →
          </button>


          <button
            onClick={restart}
            className="text-button"
          >
            начать заново
          </button>

        </section>
      )}


      {/* =========================
          ВЫБОР РЕСТОРАНА
      ========================== */}

      {screen === "choice" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА СМОТРИТ
          </div>

          <div className="emoji">
            🎲
          </div>

          <h2>
            ВЫБОРЫ СДЕЛАНЫ
          </h2>

          <p>
            Вы оба выбрали ресторан.
            <br />
            Теперь ваше решение больше
            не зависит от вас.
          </p>


          <div className="task">

            <span>
              СУДЬБА ГОВОРИТ
            </span>

            <strong>
              Если вы выбрали одно и то же —
              кажется, вы сегодня думаете
              одинаково.
              <br />
              <br />
              Если выбрали разное —
              судьба сама разберётся.
            </strong>

          </div>


          <button
            onClick={() => setScreen("destiny")}
            className="destiny-button"
          >
            ПУСТЬ РЕШИТ СУДЬБА
          </button>


          <button
            onClick={() => setScreen("restaurant")}
            className="text-button"
          >
            изменить выбор
          </button>

        </section>
      )}


      {/* =========================
          ФИНАЛ
      ========================== */}

      {screen === "destiny" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА РЕШИЛА
          </div>

          <div className="emoji">
            ✨
          </div>

          <h2>
            СЕГОДНЯ
            <br />
            ВСЁ РЕШЕНО
          </h2>

          <p>
            Вы сделали всё, что могли.
            <br />
            Дальше остаётся только идти.
          </p>


          <div className="task">

            <span>
              ВАША КУХНЯ
            </span>

            <strong>
              {cuisine.emoji} {cuisine.name}
            </strong>

          </div>


          <div className="task">

            <span>
              ВАШЕ ЗАДАНИЕ
            </span>

            <strong>
              {task}
            </strong>

          </div>


          <button
            onClick={restart}
            className="secondary-button"
          >
            НОВОЕ СВИДАНИЕ
          </button>

        </section>
      )}

    </main>
  );
}

export default App;
