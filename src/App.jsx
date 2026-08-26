import { useEffect, useRef, useState } from "react";
import { cuisines, tasks, mapCountries } from "./data";

function WorldMap({ onBack }) {
  const mapRef = useRef(null);
  const mapInstance = useRef(null);

  useEffect(() => {
    if (
      !window.L ||
      !mapRef.current ||
      mapInstance.current
    ) {
      return;
    }

    const L = window.L;

    const map = L.map(mapRef.current, {
      center: [25, 15],
      zoom: 2,
      minZoom: 2,
      maxZoom: 6,
      zoomControl: true,
      attributionControl: true,
      worldCopyJump: true,
      preferCanvas: true,
    });

    mapInstance.current = map;

    /*
      КАРТА

      Используем Carto вместо OpenStreetMap.
      Она остаётся полностью интерактивной:
      можно двигать, приближать и отдалять.
    */

    L.tileLayer(
      "https://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}{r}.png",
      {
        subdomains: "abcd",
        maxZoom: 20,
        attribution:
          '&copy; OpenStreetMap contributors &copy; CARTO',
        crossOrigin: true,
        updateWhenIdle: true,
        keepBuffer: 2,
      }
    ).addTo(map);

    /*
      БУЛАВКИ
    */

    mapCountries.forEach((country) => {
      const cuisineData = cuisines.find(
        (item) =>
          item.id === country.cuisineId
      );

      const pinIcon = L.divIcon({
        className: "destiny-pin-wrapper",

        html: `
          <div class="destiny-pin">
            <span>${country.emoji}</span>
          </div>
        `,

        iconSize: [42, 42],
        iconAnchor: [21, 38],
        popupAnchor: [0, -34],
      });

      const marker = L.marker(
        [country.lat, country.lng],
        {
          icon: pinIcon,
        }
      ).addTo(map);

      const restaurants =
        cuisineData?.restaurants || [];

      const restaurantList =
        restaurants
          .map(
            (restaurant) => `
              <div class="map-restaurant">
                <strong>
                  ${restaurant.name}
                </strong>

                <span>
                  ${restaurant.address}
                </span>
              </div>
            `
          )
          .join("");

      const popup = `
        <div class="map-popup">

          <div class="map-popup-country">
            ${country.emoji}
            ${country.country}
          </div>

          <div class="map-popup-cuisine">
            ${country.cuisineName}
          </div>

          <div class="map-popup-line"></div>

          ${
            restaurants.length
              ? `
                <div class="map-popup-label">
                  РЕСТОРАНЫ
                </div>

                ${restaurantList}
              `
              : `
                <div class="map-popup-label">
                  НАША ИСТОРИЯ
                </div>

                <p>
                  Здесь пока нет
                  ресторанов.
                </p>
              `
          }

        </div>
      `;

      marker.bindPopup(popup, {
        maxWidth: 280,
        minWidth: 220,
        className: "destiny-popup",
        closeButton: true,
      });
    });

    /*
      FIX ДЛЯ REACT

      Когда карта находится на отдельном экране,
      Leaflet иногда неправильно рассчитывает
      размер контейнера.
    */

    const fixMapSize = () => {
      if (!mapInstance.current) return;

      mapInstance.current.invalidateSize({
        animate: false,
      });
    };

    requestAnimationFrame(fixMapSize);

    setTimeout(fixMapSize, 100);
    setTimeout(fixMapSize, 300);
    setTimeout(fixMapSize, 700);

    window.addEventListener(
      "resize",
      fixMapSize
    );

    return () => {
      window.removeEventListener(
        "resize",
        fixMapSize
      );

      map.remove();
      mapInstance.current = null;
    };
  }, []);

  return (
    <section className="map-screen">

      <div className="map-header">

        <button
          className="map-back"
          onClick={onBack}
        >
          ←
        </button>

        <div>
          <div className="eyebrow map-eyebrow">
            SONYA × SASHA
          </div>

          <h2 className="map-title">
            НАША
            <br />
            КАРТА
          </h2>
        </div>

      </div>

      <div className="map-intro">

        <span>🌍</span>

        <p>
          Каждая кухня —
          <br />
          ещё одна точка нашей истории.
        </p>

      </div>

      <div
        ref={mapRef}
        className="world-map"
      />

      <button
        onClick={onBack}
        className="secondary-button map-back-button"
      >
        ← НАЗАД
      </button>

    </section>
  );
}

function App() {
  const [screen, setScreen] =
    useState("home");

  const [cuisine, setCuisine] =
    useState(null);

  const [task, setTask] =
    useState(null);

  const [fact, setFact] =
    useState(null);

  const [
    selectedRestaurant,
    setSelectedRestaurant,
  ] = useState(null);

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState("19:00");

  function startDestiny() {
    const randomCuisine =
      cuisines[
        Math.floor(
          Math.random() *
            cuisines.length
        )
      ];

    const randomTask =
      tasks[
        Math.floor(
          Math.random() *
            tasks.length
        )
      ];

    const randomFact =
      randomCuisine.facts[
        Math.floor(
          Math.random() *
            randomCuisine.facts.length
        )
      ];

    setCuisine(randomCuisine);
    setTask(randomTask);
    setFact(randomFact);

    setSelectedRestaurant(null);
    setDate("");
    setTime("19:00");

    setScreen("result");
  }

  function chooseRestaurant(
    restaurant
  ) {
    setSelectedRestaurant(
      restaurant
    );

    setScreen(
      "restaurant-confirm"
    );
  }

  function addToCalendar() {
    if (
      !selectedRestaurant ||
      !date ||
      !time
    ) {
      return;
    }

    const [
      year,
      month,
      day,
    ] = date.split("-");

    const [
      hours,
      minutes,
    ] = time.split(":");

    const startDate = new Date(
      Number(year),
      Number(month) - 1,
      Number(day),
      Number(hours),
      Number(minutes)
    );

    const endDate = new Date(
      startDate.getTime() +
        2 * 60 * 60 * 1000
    );

    function formatICSDate(
      dateObject
    ) {
      const yyyy =
        dateObject.getFullYear();

      const mm = String(
        dateObject.getMonth() + 1
      ).padStart(2, "0");

      const dd = String(
        dateObject.getDate()
      ).padStart(2, "0");

      const hh = String(
        dateObject.getHours()
      ).padStart(2, "0");

      const min = String(
        dateObject.getMinutes()
      ).padStart(2, "0");

      const ss = String(
        dateObject.getSeconds()
      ).padStart(2, "0");

      return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
    }

    function escapeICS(text) {
      return String(text || "")
        .replace(
          /\\/g,
          "\\\\"
        )
        .replace(
          /\n/g,
          "\\n"
        )
        .replace(
          /,/g,
          "\\,"
        )
        .replace(
          /;/g,
          "\\;"
        );
    }

    const title =
      `На вкус судьбы · ${cuisine.name}`;

    const description = [
      `Ресторан: ${selectedRestaurant.name}`,
      `Адрес: ${selectedRestaurant.address}`,
      `Кухня: ${cuisine.name}`,
      "",
      "Знаете ли вы?",
      fact,
      "",
      "Задание вечера:",
      task,
      "",
      "На вкус судьбы · SONYA × SASHA",
    ].join("\n");

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
      `DTSTAMP:${formatICSDate(
        new Date()
      )}`,
      `DTSTART:${formatICSDate(
        startDate
      )}`,
      `DTEND:${formatICSDate(
        endDate
      )}`,
      `SUMMARY:${escapeICS(title)}`,
      `DESCRIPTION:${escapeICS(
        description
      )}`,
      `LOCATION:${escapeICS(
        selectedRestaurant.address
      )}`,
      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob = new Blob(
      [icsContent],
      {
        type:
          "text/calendar;charset=utf-8",
      }
    );

    const url =
      URL.createObjectURL(blob);

    const link =
      document.createElement("a");

    link.href = url;

    link.download =
      "na-vkus-sudby.ics";

    document.body.appendChild(link);

    link.click();

    document.body.removeChild(link);

    setTimeout(() => {
      URL.revokeObjectURL(url);
    }, 1000);

    setScreen("final");
  }

  function restart() {
    setCuisine(null);
    setTask(null);
    setFact(null);
    setSelectedRestaurant(null);
    setDate("");
    setTime("19:00");

    setScreen("home");
  }

  return (
    <main className="app">

      {/* =====================
          ГЛАВНАЯ
      ====================== */}

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

          <button
            onClick={() =>
              setScreen("map")
            }
            className="secondary-button home-map-button"
          >
            🌍 НАША КАРТА
          </button>

          <p className="hint">
            кухня · ресторан · задание
          </p>

        </section>
      )}

      {/* =====================
          КАРТА
      ====================== */}

      {screen === "map" && (
        <WorldMap
          onBack={() =>
            setScreen("home")
          }
        />
      )}

      {/* =====================
          КУХНЯ
      ====================== */}

      {screen === "result" &&
        cuisine && (
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

              <span>
                О КУХНЕ
              </span>

              <p>
                {cuisine.description}
              </p>

            </div>

            <div className="fact">

              <span>
                💡 ЗНАЕТЕ ЛИ ВЫ?
              </span>

              <p>
                {fact}
              </p>

            </div>

            <div className="dishes">

              <span>
                ЧТО ПОПРОБОВАТЬ
              </span>

              <div className="dish-list">

                {cuisine.dishes.map(
                  (dish) => (
                    <div
                      key={dish}
                      className="dish"
                    >
                      {dish}
                    </div>
                  )
                )}

              </div>

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
              onClick={() =>
                setScreen(
                  "restaurant"
                )
              }
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

      {/* =====================
          РЕСТОРАНЫ
      ====================== */}

      {screen === "restaurant" &&
        cuisine && (
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
            </p>

            <div className="restaurants">

              {cuisine.restaurants.map(
                (
                  restaurant,
                  index
                ) => (
                  <div
                    key={restaurant.id}
                    className="restaurant-card"
                    onClick={() =>
                      chooseRestaurant(
                        restaurant
                      )
                    }
                  >

                    <div className="restaurant-number">
                      0{index + 1}
                    </div>

                    <div className="restaurant-info">

                      <strong>
                        {
                          restaurant.name
                        }
                      </strong>

                      <span>
                        {
                          restaurant.address
                        }
                      </span>

                    </div>

                    <div className="restaurant-arrow">
                      →
                    </div>

                  </div>
                )
              )}

            </div>

            <button
              onClick={() =>
                setScreen("choice")
              }
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

      {/* =====================
          ПОДТВЕРЖДЕНИЕ
      ====================== */}

      {screen ===
        "restaurant-confirm" &&
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
              {
                selectedRestaurant.name
              }
            </h2>

            <p>
              {
                selectedRestaurant.address
              }
            </p>

            <a
              href={
                selectedRestaurant.maps
              }
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
                {cuisine.emoji}{" "}
                {cuisine.name}
              </strong>

            </div>

            <button
              onClick={() =>
                setScreen("choice")
              }
              className="destiny-button"
            >
              ПРОДОЛЖИТЬ →
            </button>

            <button
              onClick={() =>
                setScreen(
                  "restaurant"
                )
              }
              className="text-button"
            >
              выбрать другой ресторан
            </button>

          </section>
        )}

      {/* =====================
          ВЫБОР ДАТЫ
      ====================== */}

      {screen === "choice" &&
        cuisine && (
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
              Теперь осталось
              решить,
              <br />
              когда именно
              вы идёте.
            </p>

            <div className="task">

              <span>
                РЕСТОРАН
              </span>

              <strong>
                {
                  selectedRestaurant?.name
                }
              </strong>

            </div>

            <button
              onClick={() =>
                setScreen("calendar")
              }
              className="destiny-button"
              disabled={
                !selectedRestaurant
              }
            >
              ВЫБРАТЬ ДАТУ →
            </button>

            <button
              onClick={() =>
                setScreen("restaurant")
              }
              className="text-button"
            >
              изменить ресторан
            </button>

          </section>
        )}

      {/* =====================
          КАЛЕНДАРЬ
      ====================== */}

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
              Остальное уже решено.
            </p>

            <div className="calendar-field">

              <label htmlFor="date">
                ДАТА
              </label>

              <input
                id="date"
                type="date"
                value={date}
                min={
                  new Date()
                    .toISOString()
                    .split("T")[0]
                }
                onChange={(event) =>
                  setDate(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="calendar-field">

              <label htmlFor="time">
                ВРЕМЯ
              </label>

              <input
                id="time"
                type="time"
                value={time}
                onChange={(event) =>
                  setTime(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="task">

              <span>
                В КАЛЕНДАРЬ ПОПАДЁТ
              </span>

              <strong>
                🍽️ На вкус судьбы ·{" "}
                {cuisine.name}

                <br />
                <br />

                {
                  selectedRestaurant.name
                }
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
              Событие откроется
              на iPhone.
            </p>

            <button
              onClick={() =>
                setScreen(
                  "restaurant-confirm"
                )
              }
              className="text-button"
            >
              назад
            </button>

          </section>
        )}

      {/* =====================
          ФИНАЛ
      ====================== */}

      {screen === "final" &&
        cuisine &&
        selectedRestaurant && (
          <section className="result">

            <div className="eyebrow">
              СВИДАНИЕ НАЗНАЧЕНО
            </div>

            <div className="emoji">
              ✨
            </div>

            <h2>
              ВСЁ.
              <br />
              РЕШЕНО.
            </h2>

            <p>
              Теперь остаётся только
              <br />
              дождаться этого дня.
            </p>

            <div className="task">

              <span>
                ВАШ ВЕЧЕР
              </span>

              <strong>
                {cuisine.emoji}{" "}
                {cuisine.name}

                <br />
                <br />

                🍽️{" "}
                {
                  selectedRestaurant.name
                }

                <br />
                <br />

                📅 {date}

                <br />

                🕐 {time}
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

            <a
              href={
                selectedRestaurant.maps
              }
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              🗺️ ПОСМОТРЕТЬ РЕСТОРАН
            </a>

            <button
              onClick={() =>
                setScreen("calendar")
              }
              className="secondary-button"
            >
              📅 ИЗМЕНИТЬ ДАТУ
            </button>

            <button
              onClick={() => {
                alert(
                  "После свидания здесь появится ваш отзыв ❤️"
                );
              }}
              className="secondary-button"
            >
              ❤️ КАК СХОДИЛИ?
            </button>

            <button
              onClick={restart}
              className="destiny-button"
            >
              🎲 НОВОЕ СВИДАНИЕ
            </button>

            <button
              onClick={() =>
                setScreen("map")
              }
              className="secondary-button"
            >
              🌍 НАША КАРТА
            </button>

            <button
              onClick={() =>
                setScreen("home")
              }
              className="text-button"
            >
              на главную
            </button>

          </section>
        )}

    </main>
  );
}

export default App;
