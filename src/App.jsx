import { useState } from "react";
import { cuisines, tasks } from "./data";

function App() {
  const [screen, setScreen] = useState("home");

  const [cuisine, setCuisine] = useState(null);
  const [task, setTask] = useState(null);
  const [fact, setFact] = useState(null);

  const [selectedRestaurant, setSelectedRestaurant] = useState(null);

  const [date, setDate] = useState("");
  const [time, setTime] = useState("19:00");

  // ============================================================
  // 🎲 СУДЬБА ВЫБИРАЕТ КУХНЮ
  // ============================================================

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

    setSelectedRestaurant(null);
    setDate("");
    setTime("19:00");

    setScreen("result");
  }

  // ============================================================
  // 🍽️ ВЫБОР РЕСТОРАНА
  // ============================================================

  function chooseRestaurant(restaurant) {
    setSelectedRestaurant(restaurant);
    setScreen("restaurant-confirm");
  }

  // ============================================================
  // 📅 СОЗДАНИЕ CALENDAR EVENT
  // ============================================================

  function addToCalendar() {
    if (!selectedRestaurant || !date || !time) {
      return;
    }

    const [year, month, day] = date.split("-");
    const [hours, minutes] = time.split(":");

    const startDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );

    // Свидание длится 2 часа
    const endDate = new Date(startDate.getTime() + 2 * 60 * 60 * 1000);

    function formatICSDate(dateObject) {
      const yyyy = dateObject.getFullYear();
      const mm = String(dateObject.getMonth() + 1).padStart(2, "0");
      const dd = String(dateObject.getDate()).padStart(2, "0");
      const hh = String(dateObject.getHours()).padStart(2, "0");
      const min = String(dateObject.getMinutes()).padStart(2, "0");
      const ss = String(dateObject.getSeconds()).padStart(2, "0");

      return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
    }

    function escapeICS(text) {
      return String(text || "")
        .replace(/\\/g, "\\\\")
        .replace(/\n/g, "\\n")
        .replace(/,/g, "\\,")
        .replace(/;/g, "\\;");
    }

    const title = `На вкус судьбы · ${cuisine.name}`;

    const description = [
      `🍽️ Ресторан: ${selectedRestaurant.name}`,
      `📍 Адрес: ${selectedRestaurant.address}`,
      `🍴 Кухня: ${cuisine.name}`,
      "",
      `💡 Знаете ли вы?`,
      fact,
      "",
      `🎲 Задание вечера:`,
      task,
      "",
      `На вкус судьбы`,
    ].join("\n");

    const location = selectedRestaurant.address;

    const uid =
      `${Date.now()}-${Math.random()
        .toString(36)
        .substring(2)}@navkus-sudby`;

    const icsContent = [
      "BEGIN:VCALENDAR",
      "VERSION:2.0",
      "PRODID:-//Na Vkus Sudby//RU",
      "CALSCALE:GREGORIAN",
      "METHOD:PUBLISH",
      "BEGIN:VEVENT",
      `UID:${uid}`,
      `DTSTAMP:${formatICSDate(new Date())}`,
      `DTSTART:${formatICSDate(startDate)}`,
      `DTEND:${formatICSDate(endDate)}`,
      `SUMMARY:${escapeICS(title)}`,
      `DESCRIPTION:${escapeICS(description)}`,
      `LOCATION:${escapeICS(location)}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob([icsContent], {
      type: "text/calendar;charset=utf-8",
    });

    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.download = "na-vkus-sudby.ics";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);
  }

  // ============================================================
  // 🔄 НАЧАТЬ ЗАНОВО
  // ============================================================

  function restart() {
    setCuisine(null);
    setTask(null);
    setFact(null);
    setSelectedRestaurant(null);
    setDate("");
    setTime("19:00");

    setScreen("home");
  }

  // ============================================================
  // 🏠 HOME
  // ============================================================

  return (
    <main className="app">

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

      {/* ========================================================
          🍴 КУХНЯ
      ========================================================= */}

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

          {/* О КУХНЕ */}

          <div className="info-block">

            <span>
              О КУХНЕ
            </span>

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

          {/* БЛЮДА */}

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

      {/* ========================================================
          🍽️ РЕСТОРАНЫ
      ========================================================= */}

      {screen === "restaurant" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА ДОВЕЛА ДО СТОЛА
          </div>

          <div className="emoji">
            🍽️
          </div>

          <h2>
            ВЫБЕРИТЕ
            <br />
            РЕСТОРАН
          </h2>

          <p>
            Три места.
            <br />
            Один вечер.
            <br />
            Выбирайте.
          </p>

          <div className="restaurants">

            {cuisine.restaurants.map((restaurant, index) => (

              <div
                key={restaurant.id}
                className="restaurant-card"
                onClick={() => chooseRestaurant(restaurant)}
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

              </div>

            ))}

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

      {/* ========================================================
          🍷 ВЫБРАН РЕСТОРАН
      ========================================================= */}

      {screen === "restaurant-confirm" &&
        cuisine &&
        selectedRestaurant && (
          <section className="result">

            <div className="eyebrow">
              ВЫ ВЫБРАЛИ
            </div>

            <div className="emoji">
              🍽️
            </div>

            <h2>
              {selectedRestaurant.name}
            </h2>

            <p>
              {selectedRestaurant.address}
            </p>

            <a
              href={selectedRestaurant.maps}
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              ОТКРЫТЬ НА КАРТЕ →
            </a>

            <div className="task">

              <span>
                КУХНЯ
              </span>

              <strong>
                {cuisine.emoji} {cuisine.name}
              </strong>

            </div>

            <button
              onClick={() => setScreen("choice")}
              className="destiny-button"
            >
              ВЫБРАТЬ ДАТУ →
            </button>

            <button
              onClick={() => setScreen("restaurant")}
              className="text-button"
            >
              выбрать другой ресторан
            </button>

          </section>
        )}

      {/* ========================================================
          🎲 ВЫБОРЫ СДЕЛАНЫ
      ========================================================= */}

      {screen === "choice" && cuisine && (
        <section className="result">

          <div className="eyebrow">
            СУДЬБА СМОТРИТ
          </div>

          <div className="emoji">
            🎲
          </div>

          <h2>
            ВЫБОР
            <br />
            СДЕЛАН
          </h2>

          <p>
            Теперь осталось решить,
            <br />
            когда именно вы идёте.
          </p>

          <div className="task">

            <span>
              РЕСТОРАН
            </span>

            <strong>
              {selectedRestaurant
                ? selectedRestaurant.name
                : "Выберите ресторан"}
            </strong>

          </div>

          <button
            onClick={() => setScreen("calendar")}
            className="destiny-button"
            disabled={!selectedRestaurant}
          >
            ВЫБРАТЬ ДАТУ →
          </button>

          <button
            onClick={() => setScreen("restaurant")}
            className="text-button"
          >
            изменить ресторан
          </button>

        </section>
      )}

      {/* ========================================================
          📅 КАЛЕНДАРЬ
      ========================================================= */}

      {screen === "calendar" &&
        cuisine &&
        selectedRestaurant && (
          <section className="result">

            <div className="eyebrow">
              СВИДАНИЕ НАЗНАЧЕНО
            </div>

            <div className="emoji">
              📅
            </div>

            <h2>
              КОГДА
              <br />
              ИДЁМ?
            </h2>

            <p>
              Выберите дату и время.
              <br />
              Остальное мы уже решили.
            </p>

            {/* ДАТА */}

            <div className="calendar-field">

              <label htmlFor="date">
                ДАТА
              </label>

              <input
                id="date"
                type="date"
                value={date}
                min={
                  new Date().toISOString().split("T")[0]
                }
                onChange={(event) =>
                  setDate(event.target.value)
                }
              />

            </div>

            {/* ВРЕМЯ */}

            <div className="calendar-field">

              <label htmlFor="time">
                ВРЕМЯ
              </label>

              <input
                id="time"
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(event.target.value)
                }
              />

            </div>

            {/* ПРЕДПРОСМОТР */}

            <div className="task">

              <span>
                В КАЛЕНДАРЬ ПОПАДЁТ
              </span>

              <strong>
                🍽️ На вкус судьбы · {cuisine.name}
                <br />
                <br />
                {selectedRestaurant.name}
              </strong>

            </div>

            <button
              onClick={addToCalendar}
              className="destiny-button"
              disabled={!date}
            >
              📅 ДОБАВИТЬ В КАЛЕНДАРЬ
            </button>

            <p className="hint">
              Файл откроется на iPhone.
              <br />
              Вы сможете добавить событие
              в свой календарь.
            </p>

            <button
              onClick={() => setScreen("restaurant-confirm")}
              className="text-button"
            >
              назад
            </button>

          </section>
        )}

    </main>
  );
}

export default App;
