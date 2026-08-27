import { useEffect, useRef, useState } from "react";
import * as projectData from "./data";
import { supabase } from "./supabase";

const {
  cuisines,
  tasks,
  mapCountries,
  destinySettings,
} = projectData;

const wildcards =
  projectData.wildcards || [];

/*
  Кухни, которые вы уже недавно пробовали
  ДО запуска приложения.

  Пока корейская исключена вручную.
  Позже перенесём это в Supabase
  и сделаем управление через интерфейс.
*/

const visitedCuisineIds =
  projectData.visitedCuisineIds || [
    "korean",
  ];

/* ============================================
   КАРТА
============================================ */

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

    L.tileLayer(
      "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
      {
        maxZoom: 19,
        attribution:
          "&copy; OpenStreetMap contributors",
        updateWhenIdle: true,
        keepBuffer: 4,
      }
    ).addTo(map);

    mapCountries.forEach(
      (country) => {
        const cuisineData =
          cuisines.find(
            (item) =>
              item.id ===
              country.cuisineId
          );

        if (!cuisineData) {
          return;
        }

        const pinIcon =
          L.divIcon({
            className:
              "destiny-pin-wrapper",

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
          [
            country.lat,
            country.lng,
          ],
          {
            icon: pinIcon,
          }
        ).addTo(map);

        const restaurants =
          cuisineData.restaurants ||
          [];

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

            <div class="map-popup-label">
              РЕСТОРАНЫ
            </div>

            ${restaurantList}

          </div>
        `;

        marker.bindPopup(
          popup,
          {
            maxWidth: 280,
            minWidth: 220,
            className:
              "destiny-popup",
            closeButton: true,
          }
        );
      }
    );

    const fixMapSize = () => {
      if (
        !mapInstance.current
      ) {
        return;
      }

      mapInstance.current
        .invalidateSize(false);
    };

    requestAnimationFrame(
      fixMapSize
    );

    const timer1 =
      setTimeout(
        fixMapSize,
        100
      );

    const timer2 =
      setTimeout(
        fixMapSize,
        300
      );

    const timer3 =
      setTimeout(
        fixMapSize,
        700
      );

    window.addEventListener(
      "resize",
      fixMapSize
    );

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);

      window.removeEventListener(
        "resize",
        fixMapSize
      );

      map.remove();

      mapInstance.current =
        null;
    };
  }, []);

  return (
    <section className="map-screen">

      <div className="map-header">

        <button
          className="map-back"
          onClick={onBack}
          aria-label="Назад"
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
          ещё одна точка
          нашей истории.
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

/* ============================================
   APP
============================================ */

function App() {
  const [screen, setScreen] =
    useState("home");

  /* AUTH */

  const [session, setSession] =
    useState(null);

  const [profile, setProfile] =
    useState(null);

  const [
    authLoading,
    setAuthLoading,
  ] = useState(true);

  const [
    loginBusy,
    setLoginBusy,
  ] = useState(false);

  const [
    loginEmail,
    setLoginEmail,
  ] = useState("");

  const [
    loginPassword,
    setLoginPassword,
  ] = useState("");

  const [
    loginError,
    setLoginError,
  ] = useState("");

  /* ОБЩАЯ СЕССИЯ */

  const [
    activeSession,
    setActiveSession,
  ] = useState(null);

  const [
    backgroundLoading,
    setBackgroundLoading,
  ] = useState(false);

  const [
    syncLoading,
    setSyncLoading,
  ] = useState(false);

  const [
    syncError,
    setSyncError,
  ] = useState("");

  /* СТАТИСТИКА */

  const [
    sonyaWins,
    setSonyaWins,
  ] = useState(0);

  const [
    sashaWins,
    setSashaWins,
  ] = useState(0);

  /* КАЛЕНДАРЬ */

  const [date, setDate] =
    useState("");

  const [time, setTime] =
    useState(
      destinySettings.defaultTime
    );

  /* ============================================
     PROFILE
  ============================================ */

  async function loadProfile(
    user
  ) {
    if (!user) {
      setProfile(null);
      return null;
    }

    const {
      data,
      error,
    } = await supabase
      .from("profiles")
      .select(
        "role, display_name"
      )
      .eq(
        "id",
        user.id
      )
      .single();

    if (error) {
      console.error(
        "Profile error:",
        error
      );

      setProfile(null);

      return null;
    }

    setProfile(data);

    return data;
  }

  /* ============================================
     СТАТИСТИКА
  ============================================ */

  async function loadWinnerStats() {
    const [
      sonyaResult,
      sashaResult,
    ] = await Promise.all([
      supabase
        .from("date_sessions")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "resolved_by_fate",
          true
        )
        .eq(
          "winner",
          "sonya"
        ),

      supabase
        .from("date_sessions")
        .select(
          "id",
          {
            count: "exact",
            head: true,
          }
        )
        .eq(
          "resolved_by_fate",
          true
        )
        .eq(
          "winner",
          "sasha"
        ),
    ]);

    if (!sonyaResult.error) {
      setSonyaWins(
        sonyaResult.count || 0
      );
    }

    if (!sashaResult.error) {
      setSashaWins(
        sashaResult.count || 0
      );
    }
  }

  /* ============================================
     АКТИВНОЕ СВИДАНИЕ
  ============================================ */

  async function loadActiveSession() {
    const {
      data,
      error,
    } = await supabase
      .from("date_sessions")
      .select("*")
      .neq(
        "status",
        "completed"
      )
      .order(
        "created_at",
        {
          ascending: false,
        }
      )
      .limit(1)
      .maybeSingle();

    if (error) {
      console.error(
        "Session load error:",
        error
      );

      return null;
    }

    setActiveSession(data);

    if (data?.date) {
      setDate(data.date);
    }

    if (data?.time) {
      setTime(data.time);
    }

    return data;
  }

  /* ============================================
     БЫСТРЫЙ AUTH INIT
  ============================================ */

  useEffect(() => {
    let mounted = true;

    async function initializeAuth() {
      try {
        const {
          data: {
            session:
              currentSession,
          },
        } =
          await supabase.auth
            .getSession();

        if (!mounted) {
          return;
        }

        setSession(
          currentSession
        );
      } catch (error) {
        console.error(
          "Auth init error:",
          error
        );
      } finally {
        if (mounted) {
          /*
            ВАЖНО:
            не ждём профиль,
            сессии свиданий и статистику.
          */
          setAuthLoading(false);
        }
      }
    }

    initializeAuth();

    const {
      data: {
        subscription,
      },
    } =
      supabase.auth
        .onAuthStateChange(
          (
            _event,
            newSession
          ) => {
            /*
              Только обновляем auth.
              Никаких тяжёлых запросов
              внутри callback.
            */

            setSession(
              newSession
            );

            if (!newSession) {
              setProfile(null);
              setActiveSession(null);
            }

            setAuthLoading(false);
          }
        );

    return () => {
      mounted = false;

      subscription.unsubscribe();
    };
  }, []);

  /* ============================================
     ФОНОВАЯ ЗАГРУЗКА
  ============================================ */

  useEffect(() => {
    if (
      !session?.user
    ) {
      return;
    }

    let cancelled = false;

    async function loadEverything() {
      setBackgroundLoading(true);

      /*
        Загружаем параллельно,
        а не по очереди.
      */

      await Promise.all([
        loadProfile(
          session.user
        ),

        loadActiveSession(),

        loadWinnerStats(),
      ]);

      if (!cancelled) {
        setBackgroundLoading(false);
      }
    }

    loadEverything();

    return () => {
      cancelled = true;
    };
  }, [session?.user?.id]);

  /* ============================================
     REALTIME
  ============================================ */

  useEffect(() => {
    if (!session) {
      return;
    }

    const channel =
      supabase
        .channel(
          "shared-date-session"
        )
        .on(
          "postgres_changes",
          {
            event: "*",
            schema: "public",
            table:
              "date_sessions",
          },
          async (payload) => {
            const next =
              payload.new;

            if (
              !next ||
              !next.id
            ) {
              return;
            }

            setActiveSession(
              next
            );

            if (next.date) {
              setDate(
                next.date
              );
            }

            if (next.time) {
              setTime(
                next.time
              );
            }

            if (
              next.status ===
              "completed"
            ) {
              setActiveSession(
                null
              );

              setScreen(
                "home"
              );

              return;
            }

            if (
              next.result_type ===
              "wildcard"
            ) {
              setScreen(
                "wildcard"
              );

              return;
            }

            if (
              next.final_restaurant_id
            ) {
              setScreen(
                "choice"
              );

              loadWinnerStats();

              return;
            }

            /*
              Если пользователь уже
              выбрал ресторан —
              оставляем его на экране
              ресторанов и ждём второго.

              Не перекидываем назад
              на экран кухни.
            */

            const myChoice =
              profile?.role ===
              "sonya"
                ? next
                    .sonya_restaurant_id
                : profile?.role ===
                  "sasha"
                ? next
                    .sasha_restaurant_id
                : null;

            if (myChoice) {
              setScreen(
                "restaurant"
              );

              return;
            }

            if (
              next.cuisine_id
            ) {
              setScreen(
                "result"
              );
            }
          }
        )
        .subscribe();

    return () => {
      supabase.removeChannel(
        channel
      );
    };
  }, [
    session,
    profile?.role,
  ]);

  /* ============================================
     LOGIN
  ============================================ */

  async function handleLogin(
    event
  ) {
    event.preventDefault();

    if (
      !loginEmail.trim() ||
      !loginPassword
    ) {
      setLoginError(
        "Введите email и пароль."
      );

      return;
    }

    setLoginBusy(true);
    setLoginError("");

    const {
      data,
      error,
    } =
      await supabase.auth
        .signInWithPassword({
          email:
            loginEmail
              .trim()
              .toLowerCase(),

          password:
            loginPassword,
        });

    if (error) {
      console.error(
        "Login error:",
        error
      );

      setLoginError(
        "Не получилось войти. Проверьте email и пароль."
      );

      setLoginBusy(false);

      return;
    }

    /*
      Главное изменение:
      получили session — сразу пускаем.
      Базу здесь НЕ ждём.
    */

    setSession(
      data.session
    );

    setLoginPassword("");

    setLoginBusy(false);
  }

  async function handleLogout() {
    await supabase.auth
      .signOut();

    setSession(null);
    setProfile(null);
    setActiveSession(null);

    setScreen("home");
  }

  /* ============================================
     ТЕКУЩИЕ ДАННЫЕ
  ============================================ */

  const currentCuisine =
    activeSession?.cuisine_id
      ? cuisines.find(
          (item) =>
            item.id ===
            activeSession.cuisine_id
        )
      : null;

  const currentWildcard =
    activeSession?.wildcard_id
      ? wildcards.find(
          (item) =>
            item.id ===
            activeSession.wildcard_id
        )
      : null;

  const finalRestaurant =
    currentCuisine &&
    activeSession
      ?.final_restaurant_id
      ? currentCuisine
          .restaurants
          .find(
            (restaurant) =>
              restaurant.id ===
              activeSession
                .final_restaurant_id
          )
      : null;

  const sonyaRestaurant =
    currentCuisine &&
    activeSession
      ?.sonya_restaurant_id
      ? currentCuisine
          .restaurants
          .find(
            (restaurant) =>
              restaurant.id ===
              activeSession
                .sonya_restaurant_id
          )
      : null;

  const sashaRestaurant =
    currentCuisine &&
    activeSession
      ?.sasha_restaurant_id
      ? currentCuisine
          .restaurants
          .find(
            (restaurant) =>
              restaurant.id ===
              activeSession
                .sasha_restaurant_id
          )
      : null;

  const myRestaurantId =
    profile?.role ===
    "sonya"
      ? activeSession
          ?.sonya_restaurant_id
      : profile?.role ===
        "sasha"
      ? activeSession
          ?.sasha_restaurant_id
      : null;

  const otherRestaurantId =
    profile?.role ===
    "sonya"
      ? activeSession
          ?.sasha_restaurant_id
      : profile?.role ===
        "sasha"
      ? activeSession
          ?.sonya_restaurant_id
      : null;

  const myFateWins =
    profile?.role ===
    "sonya"
      ? sonyaWins
      : sashaWins;

  const isFavoriteOfFate =
    myFateWins >=
    destinySettings
      .favoriteOfFateWins;

  /* ============================================
     ЗАПУСК СУДЬБЫ
  ============================================ */

  async function startDestiny() {
    if (
      syncLoading ||
      !profile
    ) {
      return;
    }

    setSyncLoading(true);
    setSyncError("");

    if (
      activeSession &&
      activeSession.status !==
        "completed"
    ) {
      if (
        activeSession
          .result_type ===
        "wildcard"
      ) {
        setScreen(
          "wildcard"
        );
      } else if (
        activeSession
          .final_restaurant_id
      ) {
        setScreen(
          "choice"
        );
      } else {
        setScreen(
          "result"
        );
      }

      setSyncLoading(false);

      return;
    }

    const wildcardWins =
      wildcards.length > 0 &&
      Math.random() <
        destinySettings
          .wildcardChance;

    let payload;

    if (wildcardWins) {
      const wildcard =
        wildcards[
          Math.floor(
            Math.random() *
              wildcards.length
          )
        ];

      payload = {
        status:
          "cuisine_selected",

        result_type:
          "wildcard",

        wildcard_id:
          wildcard.id,

        wildcard_name:
          wildcard.name,

        task:
          wildcard.task ||
          null,
      };
    } else {
      /*
        Исключаем кухни,
        которые уже недавно
        пробовали вне приложения.
      */

      const availableCuisines =
        cuisines.filter(
          (item) =>
            !visitedCuisineIds
              .includes(
                item.id
              )
        );

      /*
        Если вдруг исключили
        вообще всё — fallback
        на полный список.
      */

      const cuisinePool =
        availableCuisines
          .length > 0
          ? availableCuisines
          : cuisines;

      const randomCuisine =
        cuisinePool[
          Math.floor(
            Math.random() *
              cuisinePool.length
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
        randomCuisine
          .facts[
            Math.floor(
              Math.random() *
                randomCuisine
                  .facts.length
            )
          ];

      payload = {
        status:
          "cuisine_selected",

        result_type:
          "cuisine",

        cuisine_id:
          randomCuisine.id,

        cuisine_name:
          randomCuisine.name,

        country:
          randomCuisine
            .map?.country ||
          null,

        fact:
          randomFact,

        task:
          randomTask,
      };
    }

    const {
      data,
      error,
    } = await supabase
      .from("date_sessions")
      .insert(payload)
      .select()
      .single();

    if (error) {
      console.error(
        "Create destiny error:",
        error
      );

      setSyncError(
        "Судьба временно задумалась. Попробуйте ещё раз."
      );

      setSyncLoading(false);

      return;
    }

    setActiveSession(
      data
    );

    if (
      data.result_type ===
      "wildcard"
    ) {
      setScreen(
        "wildcard"
      );
    } else {
      setScreen(
        "result"
      );
    }

    setSyncLoading(false);
  }

  /* ============================================
     ВЫБОР РЕСТОРАНА
  ============================================ */

  async function chooseRestaurant(
    restaurant
  ) {
    if (
      !activeSession ||
      !profile ||
      myRestaurantId ||
      syncLoading
    ) {
      return;
    }

    setSyncLoading(true);
    setSyncError("");

    const field =
      profile.role ===
      "sonya"
        ? "sonya_restaurant_id"
        : "sasha_restaurant_id";

    const {
      data,
      error,
    } = await supabase
      .from("date_sessions")
      .update({
        [field]:
          restaurant.id,

        status:
          "choosing_restaurant",

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        activeSession.id
      )
      .select()
      .single();

    if (error) {
      console.error(
        "Restaurant choice error:",
        error
      );

      setSyncError(
        "Не получилось сохранить выбор."
      );

      setSyncLoading(false);

      return;
    }

    setActiveSession(
      data
    );

    const {
      data: fresh,
      error:
        freshError,
    } = await supabase
      .from("date_sessions")
      .select("*")
      .eq(
        "id",
        activeSession.id
      )
      .single();

    if (freshError) {
      console.error(
        "Fresh session error:",
        freshError
      );

      setSyncLoading(false);

      return;
    }

    setActiveSession(
      fresh
    );

    if (
      fresh.sonya_restaurant_id &&
      fresh.sasha_restaurant_id
    ) {
      await resolveRestaurants(
        fresh
      );
    }

    setSyncLoading(false);
  }

  /* ============================================
     РЕШЕНИЕ СУДЬБЫ
  ============================================ */

  async function resolveRestaurants(
    dateSession
  ) {
    const cuisineForSession =
      cuisines.find(
        (item) =>
          item.id ===
          dateSession.cuisine_id
      );

    if (
      !cuisineForSession ||
      dateSession
        .final_restaurant_id
    ) {
      return;
    }

    const sonyaChoice =
      cuisineForSession
        .restaurants
        .find(
          (restaurant) =>
            restaurant.id ===
            dateSession
              .sonya_restaurant_id
        );

    const sashaChoice =
      cuisineForSession
        .restaurants
        .find(
          (restaurant) =>
            restaurant.id ===
            dateSession
              .sasha_restaurant_id
        );

    if (
      !sonyaChoice ||
      !sashaChoice
    ) {
      return;
    }

    let winner;
    let chosen;
    let byFate;

    if (
      sonyaChoice.id ===
      sashaChoice.id
    ) {
      winner = "match";
      chosen =
        sonyaChoice;
      byFate = false;
    } else {
      const chooseSonya =
        Math.random() < 0.5;

      winner =
        chooseSonya
          ? "sonya"
          : "sasha";

      chosen =
        chooseSonya
          ? sonyaChoice
          : sashaChoice;

      byFate = true;
    }

    const {
      data,
      error,
    } = await supabase
      .from("date_sessions")
      .update({
        final_restaurant_id:
          chosen.id,

        final_restaurant_name:
          chosen.name,

        final_restaurant_address:
          chosen.address,

        winner,

        resolved_by_fate:
          byFate,

        status:
          "restaurant_selected",

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        dateSession.id
      )
      .is(
        "final_restaurant_id",
        null
      )
      .select()
      .maybeSingle();

    if (error) {
      console.error(
        "Resolve error:",
        error
      );

      return;
    }

    if (data) {
      setActiveSession(
        data
      );
    } else {
      loadActiveSession();
    }

    loadWinnerStats();

    setScreen("choice");
  }

  /* ============================================
     КАЛЕНДАРЬ
  ============================================ */

  function createCalendarFile(
    restaurant
  ) {
    if (
      !restaurant ||
      !date ||
      !time ||
      !currentCuisine ||
      !activeSession
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

    const startDate =
      new Date(
        Number(year),
        Number(month) - 1,
        Number(day),
        Number(hours),
        Number(minutes)
      );

    const endDate =
      new Date(
        startDate.getTime() +
          destinySettings
            .dateDurationHours *
            60 *
            60 *
            1000
      );

    function formatICSDate(
      dateObject
    ) {
      const yyyy =
        dateObject
          .getFullYear();

      const mm =
        String(
          dateObject
            .getMonth() + 1
        ).padStart(2, "0");

      const dd =
        String(
          dateObject
            .getDate()
        ).padStart(2, "0");

      const hh =
        String(
          dateObject
            .getHours()
        ).padStart(2, "0");

      const min =
        String(
          dateObject
            .getMinutes()
        ).padStart(2, "0");

      const ss =
        String(
          dateObject
            .getSeconds()
        ).padStart(2, "0");

      return `${yyyy}${mm}${dd}T${hh}${min}${ss}`;
    }

    function escapeICS(
      text
    ) {
      return String(
        text || ""
      )
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
      `На вкус судьбы · ${currentCuisine.name}`;

    const description = [
      `Ресторан: ${restaurant.name}`,
      `Адрес: ${restaurant.address}`,
      `Кухня: ${currentCuisine.name}`,
      "",
      "Знаете ли вы?",
      activeSession.fact,
      "",
      "Задание вечера:",
      activeSession.task,
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

      `SUMMARY:${escapeICS(
        title
      )}`,

      `DESCRIPTION:${escapeICS(
        description
      )}`,

      `LOCATION:${escapeICS(
        restaurant.address
      )}`,

      "STATUS:CONFIRMED",
      "END:VEVENT",
      "END:VCALENDAR",
    ].join("\r\n");

    const blob =
      new Blob(
        [icsContent],
        {
          type:
            "text/calendar;charset=utf-8",
        }
      );

    const url =
      URL.createObjectURL(
        blob
      );

    const link =
      document
        .createElement("a");

    link.href = url;

    link.download =
      "na-vkus-sudby.ics";

    document.body
      .appendChild(
        link
      );

    link.click();

    document.body
      .removeChild(
        link
      );

    setTimeout(() => {
      URL.revokeObjectURL(
        url
      );
    }, 1000);
  }

  async function addToCalendar() {
    if (
      !finalRestaurant ||
      !date ||
      !time ||
      !activeSession
    ) {
      return;
    }

    const {
      data,
      error,
    } = await supabase
      .from("date_sessions")
      .update({
        date,
        time,

        status:
          "scheduled",

        updated_at:
          new Date()
            .toISOString(),
      })
      .eq(
        "id",
        activeSession.id
      )
      .select()
      .single();

    if (error) {
      console.error(
        "Calendar sync error:",
        error
      );

      setSyncError(
        "Не получилось сохранить дату."
      );

      return;
    }

    setActiveSession(
      data
    );

    createCalendarFile(
      finalRestaurant
    );

    setScreen("final");
  }

  /* ============================================
     НОВОЕ СВИДАНИЕ
  ============================================ */

  async function restart() {
    if (activeSession) {
      await supabase
        .from("date_sessions")
        .update({
          status:
            "completed",

          updated_at:
            new Date()
              .toISOString(),
        })
        .eq(
          "id",
          activeSession.id
        );
    }

    setActiveSession(null);

    setDate("");

    setTime(
      destinySettings
        .defaultTime
    );

    setScreen("home");
  }

  /* ============================================
     AUTH LOADING
  ============================================ */

  if (authLoading) {
    return (
      <main className="app">

        <section className="home">

          <div className="eyebrow">
            SONYA × SASHA
          </div>

          <h1>
            НА ВКУС
            <br />
            <span>
              СУДЬБЫ
            </span>
          </h1>

          <p className="subtitle">
            Судьба
            загружается...
          </p>

        </section>

      </main>
    );
  }

  /* ============================================
     LOGIN
  ============================================ */

  if (!session) {
    return (
      <main className="app">

        <section className="home">

          <div className="eyebrow">
            SONYA × SASHA
          </div>

          <h1>
            НА ВКУС
            <br />
            <span>
              СУДЬБЫ
            </span>
          </h1>

          <p className="subtitle">
            Войдите,
            <br />
            чтобы довериться
            судьбе.
          </p>

          <form
            onSubmit={
              handleLogin
            }
            style={{
              width: "100%",
              maxWidth:
                "380px",
            }}
          >

            <div className="calendar-field">

              <label
                htmlFor="login-email"
              >
                EMAIL
              </label>

              <input
                id="login-email"
                type="email"
                value={
                  loginEmail
                }
                autoComplete="email"
                placeholder="ваш email"
                onChange={(
                  event
                ) =>
                  setLoginEmail(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            <div className="calendar-field">

              <label
                htmlFor="login-password"
              >
                ПАРОЛЬ
              </label>

              <input
                id="login-password"
                type="password"
                value={
                  loginPassword
                }
                autoComplete="current-password"
                placeholder="••••••••"
                onChange={(
                  event
                ) =>
                  setLoginPassword(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            {loginError && (
              <p
                style={{
                  fontSize:
                    "12px",
                  lineHeight:
                    1.5,
                  marginTop:
                    "14px",
                }}
              >
                {loginError}
              </p>
            )}

            <button
              type="submit"
              className="destiny-button"
              disabled={
                loginBusy
              }
            >
              {loginBusy
                ? "ВХОДИМ..."
                : "ВОЙТИ →"}
            </button>

          </form>

          <p className="hint">
            только Соня × Саша
          </p>

        </section>

      </main>
    );
  }

  /* ============================================
     MAIN
  ============================================ */

  return (
    <main className="app">

      {/* HOME */}

      {screen === "home" && (
        <section className="home">

          <div className="eyebrow">
            SONYA × SASHA
          </div>

          <h1>
            НА ВКУС
            <br />
            <span>
              СУДЬБЫ
            </span>
          </h1>

          <p className="subtitle">
            Вы не выбираете.
            <br />
            Вы доверяетесь.
          </p>

          {profile && (
            <p
              style={{
                margin:
                  "-20px 0 18px",

                fontSize:
                  "9px",

                letterSpacing:
                  "2px",

                textTransform:
                  "uppercase",

                opacity: 0.45,
              }}
            >
              {
                profile
                  .display_name
              }

              {isFavoriteOfFate
                ? " · ✨ любимчик судьбы"
                : ""}
            </p>
          )}

          {!profile &&
            backgroundLoading && (
              <p
                style={{
                  margin:
                    "-20px 0 18px",

                  fontSize:
                    "9px",

                  letterSpacing:
                    "2px",

                  textTransform:
                    "uppercase",

                  opacity:
                    0.35,
                }}
              >
                синхронизируем...
              </p>
            )}

          <button
            onClick={
              startDestiny
            }
            className="destiny-button"
            disabled={
              syncLoading ||
              !profile
            }
          >
            {activeSession
              ? "ПРОДОЛЖИТЬ СВИДАНИЕ"
              : "ОТДАТЬСЯ СУДЬБЕ"}
          </button>

          <button
            onClick={() =>
              setScreen("map")
            }
            className="secondary-button home-map-button"
          >
            🌍 НАША КАРТА
          </button>

          {syncError && (
            <p
              style={{
                marginTop:
                  "14px",

                fontSize:
                  "12px",
              }}
            >
              {syncError}
            </p>
          )}

          <p className="hint">
            кухня · ресторан · задание
          </p>

          <button
            onClick={
              handleLogout
            }
            className="text-button"
          >
            выйти
          </button>

        </section>
      )}

      {/* MAP */}

      {screen === "map" && (
        <WorldMap
          onBack={() =>
            setScreen("home")
          }
        />
      )}

      {/* WILDCARD */}

      {screen ===
        "wildcard" &&
        activeSession && (
          <section className="result">

            <div className="eyebrow">
              {currentWildcard
                ?.eyebrow ||
                "⚠️ ВЫ ВЫТАЩИЛИ ДИКУЮ КАРТУ"}
            </div>

            <div className="emoji">
              {currentWildcard
                ?.emoji ||
                "🃏"}
            </div>

            <h2>
              {currentWildcard
                ?.category ||
                "ДИКАЯ КАРТА"}
            </h2>

            <div className="mood">
              {currentWildcard
                ?.name ||
                activeSession
                  .wildcard_name}
            </div>

            {currentWildcard
              ?.subtitle && (
              <div className="fact">

                <p>
                  {
                    currentWildcard
                      .subtitle
                  }
                </p>

              </div>
            )}

            {currentWildcard
              ?.description && (
              <div className="info-block">

                <span>
                  ЧТО ПРОИСХОДИТ
                </span>

                <p>
                  {
                    currentWildcard
                      .description
                  }
                </p>

              </div>
            )}

            {currentWildcard
              ?.budget && (
              <div className="fact">

                <span>
                  БЮДЖЕТ
                </span>

                <p>
                  {
                    currentWildcard
                      .budget
                  }
                </p>

              </div>
            )}

            <div className="task">

              <span>
                ВАШЕ ЗАДАНИЕ
              </span>

              <strong>
                {
                  activeSession
                    .task
                }
              </strong>

            </div>

            {currentWildcard
              ?.place?.maps && (
              <a
                href={
                  currentWildcard
                    .place.maps
                }
                target="_blank"
                rel="noreferrer"
                className="secondary-button"
              >
                🗺️ ОТКРЫТЬ МЕСТО
              </a>
            )}

            <button
              onClick={restart}
              className="destiny-button"
            >
              ДИКАЯ КАРТА ПРИНЯТА
            </button>

          </section>
        )}

      {/* CUISINE */}

      {screen === "result" &&
        activeSession &&
        currentCuisine && (
          <section className="result">

            <div className="eyebrow">
              СУДЬБА ВЫБРАЛА
            </div>

            <div className="emoji">
              {
                currentCuisine
                  .emoji
              }
            </div>

            <h2>
              {
                currentCuisine
                  .name
              }
            </h2>

            <div className="mood">
              {
                currentCuisine
                  .mood
              }
            </div>

            <div className="info-block">

              <span>
                О КУХНЕ
              </span>

              <p>
                {
                  currentCuisine
                    .description
                }
              </p>

            </div>

            <div className="fact">

              <span>
                💡 ЗНАЕТЕ ЛИ ВЫ?
              </span>

              <p>
                {
                  activeSession
                    .fact
                }
              </p>

            </div>

            <div className="dishes">

              <span>
                ЧТО ПОПРОБОВАТЬ
              </span>

              <div className="dish-list">

                {currentCuisine
                  .dishes
                  .map(
                    (dish) => (
                      <div
                        key={
                          dish
                        }
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
                {
                  activeSession
                    .task
                }
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
              ВЫБРАТЬ РЕСТОРАН →
            </button>

          </section>
        )}

      {/* RESTAURANTS */}

      {screen ===
        "restaurant" &&
        currentCuisine &&
        activeSession && (
          <section className="result">

            <div className="eyebrow">
              ВЫБОР ЗА ВАМИ
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
              Ваш выбор
              останется тайным,
              <br />
              пока второй
              не сделает свой.
            </p>

            <div className="restaurants">

              {currentCuisine
                .restaurants
                .map(
                  (
                    restaurant,
                    index
                  ) => (
                    <div
                      key={
                        restaurant.id
                      }
                      className="restaurant-card"
                      onClick={() =>
                        chooseRestaurant(
                          restaurant
                        )
                      }
                      style={{
                        opacity:
                          myRestaurantId &&
                          myRestaurantId !==
                            restaurant.id
                            ? 0.45
                            : 1,
                      }}
                    >

                      <div className="restaurant-number">
                        0
                        {index + 1}
                      </div>

                      <div className="restaurant-info">

                        <strong>
                          {
                            restaurant
                              .name
                          }
                        </strong>

                        <span>
                          {
                            restaurant
                              .address
                          }
                        </span>

                      </div>

                      <div className="restaurant-arrow">
                        {myRestaurantId ===
                        restaurant.id
                          ? "✓"
                          : "→"}
                      </div>

                    </div>
                  )
                )}

            </div>

            {myRestaurantId &&
              !otherRestaurantId && (
              <div className="task">

                <span>
                  ВАШ ВЫБОР
                  СОХРАНЁН
                </span>

                <strong>
                  Теперь ждём,
                  когда второй
                  сделает свой выбор.
                </strong>

              </div>
            )}

            {myRestaurantId &&
              !otherRestaurantId && (
              <p className="hint">
                выбор второго
                пока скрыт
              </p>
            )}

          </section>
        )}

      {/* CHOICE */}

      {screen ===
        "choice" &&
        currentCuisine &&
        finalRestaurant &&
        activeSession && (
          <section className="result">

            <div className="eyebrow">
              {activeSession
                .winner ===
              "match"
                ? "❤️ СОВПАДЕНИЕ"
                : "🎲 СУДЬБА РЕШИЛА"}
            </div>

            <div className="emoji">
              {activeSession
                .winner ===
              "match"
                ? "❤️"
                : "🎲"}
            </div>

            <h2>
              {activeSession
                .winner ===
              "match"
                ? "ВЫ ВЫБРАЛИ ОДНО"
                : "МНЕНИЯ РАЗДЕЛИЛИСЬ"}
            </h2>

            {activeSession
              .winner ===
            "match" ? (
              <p>
                Вы оба выбрали
                одно место.
                <br />
                Судьбе даже
                не пришлось
                вмешиваться.
              </p>
            ) : (
              <p>
                Вы выбрали
                разные места.
                <br />
                Поэтому последнее
                слово осталось
                за судьбой.
              </p>
            )}

            <div className="task">

              <span>
                СОНЯ ВЫБРАЛА
              </span>

              <strong>
                {
                  sonyaRestaurant
                    ?.name
                }
              </strong>

            </div>

            <div className="task">

              <span>
                САША ВЫБРАЛ
              </span>

              <strong>
                {
                  sashaRestaurant
                    ?.name
                }
              </strong>

            </div>

            <div className="fact">

              <span>
                ИТОГ
              </span>

              <p>
                🍽️{" "}
                <strong>
                  {
                    finalRestaurant
                      .name
                  }
                </strong>
              </p>

            </div>

            {activeSession
              .resolved_by_fate &&
              activeSession
                .winner ===
                "sonya" &&
              sonyaWins >=
                destinySettings
                  .favoriteOfFateWins && (
                <div className="task">

                  <span>
                    ✨ ЛЮБИМЧИК
                    СУДЬБЫ
                  </span>

                  <strong>
                    Соня ·{" "}
                    {sonyaWins} побед
                    судьбы
                  </strong>

                </div>
              )}

            {activeSession
              .resolved_by_fate &&
              activeSession
                .winner ===
                "sasha" &&
              sashaWins >=
                destinySettings
                  .favoriteOfFateWins && (
                <div className="task">

                  <span>
                    ✨ ЛЮБИМЧИК
                    СУДЬБЫ
                  </span>

                  <strong>
                    Саша ·{" "}
                    {sashaWins} побед
                    судьбы
                  </strong>

                </div>
              )}

            <button
              onClick={() =>
                setScreen(
                  "calendar"
                )
              }
              className="destiny-button"
            >
              ВЫБРАТЬ ДАТУ →
            </button>

          </section>
        )}

      {/* CALENDAR */}

      {screen ===
        "calendar" &&
        currentCuisine &&
        finalRestaurant && (
          <section className="result">

            <div className="eyebrow">
              СВИДАНИЕ
              НАЗНАЧЕНО
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
              Выберите дату
              и время.
              <br />
              Остальное уже
              решено.
            </p>

            <div className="calendar-field">

              <label
                htmlFor="date"
              >
                ДАТА
              </label>

              <input
                id="date"
                type="date"
                value={date}
                min={
                  new Date()
                    .toISOString()
                    .split(
                      "T"
                    )[0]
                }
                onChange={(
                  event
                ) =>
                  setDate(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            <div className="calendar-field">

              <label
                htmlFor="time"
              >
                ВРЕМЯ
              </label>

              <input
                id="time"
                type="time"
                value={time}
                onChange={(
                  event
                ) =>
                  setTime(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            <div className="task">

              <span>
                В КАЛЕНДАРЬ
                ПОПАДЁТ
              </span>

              <strong>
                🍽️ На вкус
                судьбы ·{" "}
                {
                  currentCuisine
                    .name
                }

                <br />
                <br />

                {
                  finalRestaurant
                    .name
                }
              </strong>

            </div>

            <button
              onClick={
                addToCalendar
              }
              className="destiny-button"
              disabled={!date}
            >
              📅 ДОБАВИТЬ
              В КАЛЕНДАРЬ
            </button>

          </section>
        )}

      {/* FINAL */}

      {screen ===
        "final" &&
        currentCuisine &&
        finalRestaurant &&
        activeSession && (
          <section className="result">

            <div className="eyebrow">
              СВИДАНИЕ
              НАЗНАЧЕНО
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
              Теперь остаётся
              только дождаться
              этого дня.
            </p>

            <div className="task">

              <span>
                ВАШ ВЕЧЕР
              </span>

              <strong>
                {
                  currentCuisine
                    .emoji
                }{" "}
                {
                  currentCuisine
                    .name
                }

                <br />
                <br />

                🍽️{" "}
                {
                  finalRestaurant
                    .name
                }

                <br />
                <br />

                📅{" "}
                {
                  activeSession
                    .date
                }

                <br />

                🕐{" "}
                {
                  activeSession
                    .time
                }
              </strong>

            </div>

            <div className="task">

              <span>
                ВАШЕ ЗАДАНИЕ
              </span>

              <strong>
                {
                  activeSession
                    .task
                }
              </strong>

            </div>

            <a
              href={
                finalRestaurant
                  .maps
              }
              target="_blank"
              rel="noreferrer"
              className="secondary-button"
            >
              🗺️ ПОСМОТРЕТЬ
              РЕСТОРАН
            </a>

            <button
              onClick={() => {
                alert(
                  "Следующим этапом подключим ваши отдельные отзывы ❤️"
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
              🎲 НОВОЕ
              СВИДАНИЕ
            </button>

            <button
              onClick={() =>
                setScreen(
                  "map"
                )
              }
              className="secondary-button"
            >
              🌍 НАША КАРТА
            </button>

            <button
              onClick={() =>
                setScreen(
                  "home"
                )
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
