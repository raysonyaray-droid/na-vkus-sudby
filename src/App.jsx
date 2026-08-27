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

  const [history, setHistory] =
    useState([]);

  const [
    historyLoading,
    setHistoryLoading,
  ] = useState(true);

  /* ============================================
     ЗАГРУЗКА ИСТОРИИ
  ============================================ */

  useEffect(() => {
    let mounted = true;

    async function loadHistory() {
      setHistoryLoading(true);

      const {
        data,
        error,
      } = await supabase
        .from("date_history")
        .select(
          "id, date, cuisine_id, cuisine_name, restaurant_name, rating, review"
        )
        .order("date", {
          ascending: false,
        });

      if (!mounted) {
        return;
      }

      if (error) {
        console.error(
          "Map history error:",
          error
        );

        setHistory([]);
        setHistoryLoading(false);

        return;
      }

      console.log(
        "MAP HISTORY:",
        data
      );

      setHistory(data || []);
      setHistoryLoading(false);
    }

    loadHistory();

    return () => {
      mounted = false;
    };
  }, []);

  /* ============================================
     СОЗДАНИЕ КАРТЫ
  ============================================ */

  useEffect(() => {
    if (
      historyLoading ||
      !window.L ||
      !mapRef.current
    ) {
      return;
    }

    const L = window.L;

    if (mapInstance.current) {
      mapInstance.current.remove();
      mapInstance.current = null;
    }

    const map = L.map(
      mapRef.current,
      {
        center: [25, 15],
        zoom: 2,
        minZoom: 2,
        maxZoom: 6,
        zoomControl: true,
        attributionControl: true,
        worldCopyJump: true,
        preferCanvas: true,
      }
    );

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

        /* ============================================
           ПРОШЛЫЕ СВИДАНИЯ ПО ЭТОЙ КУХНЕ
        ============================================ */

        const visits =
          history.filter(
            (item) =>
              item.cuisine_id ===
              country.cuisineId
          );

        const wasVisited =
          visits.length > 0;

        /* ============================================
           ПИН
        ============================================ */

        const pinIcon =
          L.divIcon({
            className:
              "destiny-pin-wrapper",

            html: `
              <div
                style="
                  position: relative;
                  width: 42px;
                  height: 42px;
                  border-radius: 50% 50% 50% 0;
                  transform: rotate(-45deg);
                  background: #ffffff;
                  border: 2px solid #8A1538;
                  display: flex;
                  align-items: center;
                  justify-content: center;
                  box-shadow: 0 4px 12px rgba(0,0,0,0.24);
                  box-sizing: border-box;
                "
              >
                <span
                  style="
                    transform: rotate(45deg);
                    font-size: 21px;
                    line-height: 1;
                    display: block;
                  "
                >
                  ${country.emoji}
                </span>

                ${
                  wasVisited
                    ? `
                      <span
                        style="
                          position: absolute;
                          right: -4px;
                          top: -5px;
                          transform: rotate(45deg);
                          font-size: 13px;
                          line-height: 1;
                        "
                      >
                        ❤️
                      </span>
                    `
                    : ""
                }
              </div>
            `,

            iconSize: [42, 42],
            iconAnchor: [21, 38],
            popupAnchor: [0, -34],
          });

        const marker =
          L.marker(
            [
              country.lat,
              country.lng,
            ],
            {
              icon: pinIcon,
            }
          ).addTo(map);

        /* ============================================
           РЕСТОРАНЫ ИЗ DATA.JS
        ============================================ */

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

        /* ============================================
           ИСТОРИЯ
        ============================================ */

        const historyList =
          visits.length > 0
            ? visits
                .map(
                  (visit) => {
                    const rating =
                      Number(
                        visit.rating
                      ) || 0;

                    const stars =
                      rating > 0
                        ? "★".repeat(
                            rating
                          )
                        : "";

                    return `
                      <div
                        class="map-restaurant"
                        style="
                          margin-bottom: 12px;
                        "
                      >
                        <strong>
                          ❤️ ${
                            visit.restaurant_name ||
                            "Ресторан"
                          }
                        </strong>

                        <span>
                          ${
                            visit.date ||
                            ""
                          }

                          ${
                            stars
                              ? ` · ${stars}`
                              : ""
                          }
                        </span>

                        ${
                          visit.review
                            ? `
                              <span
                                style="
                                  display: block;
                                  margin-top: 4px;
                                  opacity: .75;
                                  line-height: 1.35;
                                "
                              >
                                ${visit.review}
                              </span>
                            `
                            : ""
                        }
                      </div>
                    `;
                  }
                )
                .join("")
            : "";

        /* ============================================
           POPUP
        ============================================ */

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
              wasVisited
                ? `
                  <div class="map-popup-label">
                    ❤️ МЫ УЖЕ БЫЛИ
                  </div>

                  ${historyList}

                  <div class="map-popup-line"></div>
                `
                : ""
            }

            <div class="map-popup-label">
              РЕСТОРАНЫ
            </div>

            ${restaurantList}

          </div>
        `;

        marker.bindPopup(
          popup,
          {
            maxWidth: 290,
            minWidth: 230,
            className:
              "destiny-popup",
            closeButton: true,
          }
        );
      }
    );

    /* ============================================
       FIX SIZE
    ============================================ */

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

      if (
        mapInstance.current
      ) {
        mapInstance.current.remove();
        mapInstance.current = null;
      }
    };
  }, [
    history,
    historyLoading,
  ]);

  /* ============================================
     UI
  ============================================ */

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

        <span>
          🌍
        </span>

        <p>
          Каждая кухня —
          <br />
          ещё одна точка
          нашей истории.
        </p>

      </div>

      {historyLoading && (
        <p
          style={{
            textAlign:
              "center",
            fontSize:
              "10px",
            letterSpacing:
              "2px",
            opacity:
              0.45,
          }}
        >
          ЗАГРУЖАЕМ ИСТОРИЮ...
        </p>
      )}

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

  /* ИСТОРИЯ */

  const [
    historyMode,
    setHistoryMode,
  ] = useState(null);

  const [
    historyCuisine,
    setHistoryCuisine,
  ] = useState(null);

  const [
    historyRestaurant,
    setHistoryRestaurant,
  ] = useState("");

  const [
    customHistoryRestaurant,
    setCustomHistoryRestaurant,
  ] = useState("");

  const [
    historyDate,
    setHistoryDate,
  ] = useState("");

  const [
    historyRating,
    setHistoryRating,
  ] = useState(5);

  const [
    historyReview,
    setHistoryReview,
  ] = useState("");

  const [
    historySaving,
    setHistorySaving,
  ] = useState(false);

  /* ============================================
     PROFILE
  ============================================ */

  async function loadProfile(user) {
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
     AUTH INIT
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
    if (!session?.user) {
      return;
    }

    let cancelled = false;

    async function loadEverything() {
      setBackgroundLoading(true);

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
        error.message ||
          "Ошибка входа"
      );

      setLoginBusy(false);

      return;
    }

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
     ИСТОРИЯ
  ============================================ */

  function resetHistoryForm() {
    setHistoryMode(null);
    setHistoryCuisine(null);
    setHistoryRestaurant("");
    setCustomHistoryRestaurant("");
    setHistoryDate("");
    setHistoryRating(5);
    setHistoryReview("");
    setSyncError("");
  }

  function openAlreadyBeen() {
    if (!currentCuisine) {
      return;
    }

    setHistoryMode(
      "already_been"
    );

    setHistoryCuisine(
      currentCuisine
    );

    setHistoryRestaurant("");
    setCustomHistoryRestaurant("");
    setHistoryDate("");
    setHistoryRating(5);
    setHistoryReview("");
    setSyncError("");

    setScreen("history");
  }

  function openPastDate() {
    setHistoryMode("past");

    setHistoryCuisine(null);
    setHistoryRestaurant("");
    setCustomHistoryRestaurant("");
    setHistoryDate("");
    setHistoryRating(5);
    setHistoryReview("");
    setSyncError("");

    setScreen("history");
  }

  async function saveHistory() {
    if (
      !historyCuisine ||
      !historyRestaurant ||
      !historyDate ||
      historySaving
    ) {
      return;
    }

    setHistorySaving(true);
    setSyncError("");

    const restaurant =
      historyCuisine
        .restaurants
        ?.find(
          (item) =>
            item.id ===
            historyRestaurant
        );

    const restaurantName =
      historyRestaurant === "custom"
        ? customHistoryRestaurant.trim()
        : restaurant?.name;

    if (!restaurantName) {
      setSyncError(
        "Укажите ресторан."
      );

      setHistorySaving(false);

      return;
    }

    const {
      error,
    } = await supabase
      .from("date_history")
      .insert({
        date:
          historyDate,

        cuisine_id:
          historyCuisine.id,

        cuisine_name:
          historyCuisine.name,

        restaurant_name:
          restaurantName,

        rating:
          historyRating,

        review:
          historyReview
            .trim() ||
          null,
      });

    if (error) {
      console.error(
        "History save error:",
        error
      );

      setSyncError(
        "Не получилось сохранить свидание."
      );

      setHistorySaving(false);

      return;
    }

    /*
      Если это «Мы тут уже были»,
      текущий результат судьбы
      больше не нужен.
    */

    if (
      historyMode ===
        "already_been" &&
      activeSession
    ) {
      const {
        error:
          closeError,
      } = await supabase
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

      if (closeError) {
        console.error(
          "Session close error:",
          closeError
        );
      }

      setActiveSession(null);
    }

    resetHistoryForm();

    setHistorySaving(false);

    setScreen("home");
  }

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
          .wildcard_id
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


      const availableCuisines =
        cuisines.filter(
          (item) =>
            !visitedCuisineIds
              .includes(
                item.id
              )
        );

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

      const payload = {
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

    setScreen(
      "result"
    );

    setSyncLoading(false);
  }

  /* ============================================
     ОТКАТ
  ============================================ */

  async function rollbackDestiny() {
    if (
      !activeSession ||
      syncLoading
    ) {
      return;
    }

    setSyncLoading(true);
    setSyncError("");

    const {
      error,
    } = await supabase
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

    if (error) {
      console.error(
        "Rollback error:",
        error
      );

      setSyncError(
        "Не получилось откатить судьбу."
      );

      setSyncLoading(false);

      return;
    }

    setActiveSession(null);
    setScreen("home");
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

    const wildcardWins =
      wildcards.length > 0 &&
      Math.random() < 0.05;

    const wildcard =
      wildcardWins
        ? wildcards[
            Math.floor(
              Math.random() *
                wildcards.length
            )
          ]
        : null;

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
wildcard_id:
  wildcard?.id || null,

wildcard_name:
  wildcard?.name || null,
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

  if (data.wildcard_id) {
    setScreen(
      "wildcard"
    );
  } else {
    setScreen(
      "choice"
    );
  }
} else {
  const freshSession =
    await loadActiveSession();

  if (
    freshSession?.wildcard_id
  ) {
    setScreen(
      "wildcard"
    );
  } else {
    setScreen(
      "choice"
    );
  }
}

loadWinnerStats();
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

    function escapeICS(text) {
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

              <label htmlFor="login-email">
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
                onChange={(event) =>
                  setLoginEmail(
                    event.target.value
                  )
                }
              />

            </div>

            <div className="calendar-field">

              <label htmlFor="login-password">
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
                onChange={(event) =>
                  setLoginPassword(
                    event.target.value
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

          {profile?.role ===
            "sonya" && (
            <button
              onClick={
                openPastDate
              }
              className="text-button"
              style={{
                marginTop:
                  "16px",
              }}
            >
              ＋ ПРОШЛОЕ СВИДАНИЕ
            </button>
          )}

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
{finalRestaurant && (
  <div className="fact">
    <span>
      🍽️ ВЫ ИДЁТЕ
    </span>

    <p>
      <strong>
        {finalRestaurant.name}
      </strong>
      <br />
      {finalRestaurant.address}
    </p>
  </div>
)}
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
  onClick={() =>
    setScreen("choice")
  }
  className="destiny-button"
>
  ПРИНЯТО →
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

            {profile?.role ===
              "sonya" && (
              <>
                <button
                  onClick={
                    openAlreadyBeen
                  }
                  className="text-button"
                  style={{
                    marginTop:
                      "18px",
                  }}
                >
                  ❤️ МЫ ТУТ УЖЕ БЫЛИ
                </button>

                <button
                  onClick={
                    rollbackDestiny
                  }
                  className="text-button"
                  disabled={
                    syncLoading
                  }
                  style={{
                    marginTop:
                      "10px",

                    opacity:
                      0.55,
                  }}
                >
                  ↺ ОТКАТИТЬ СУДЬБУ
                </button>
              </>
            )}

            {syncError && (
              <p
                style={{
                  fontSize:
                    "12px",
                  marginTop:
                    "12px",
                }}
              >
                {syncError}
              </p>
            )}

          </section>
        )}

      {/* HISTORY */}

      {screen ===
        "history" && (
          <section className="result">

            <div className="eyebrow">
              SONYA × SASHA
            </div>

            <div className="emoji">
              ❤️
            </div>

            <h2>
              {historyMode ===
              "already_been"
                ? "МЫ ТУТ УЖЕ БЫЛИ"
                : "ПРОШЛОЕ СВИДАНИЕ"}
            </h2>

            <p>
              Добавим его
              <br />
              в нашу историю.
            </p>

            {/* КУХНЯ */}

            <div className="calendar-field">

              <label>
                КУХНЯ
              </label>

              <select
                value={
                  historyCuisine
                    ?.id ||
                  ""
                }
                disabled={
                  historyMode ===
                  "already_been"
                }
                onChange={(
                  event
                ) => {
                  const selected =
                    cuisines.find(
                      (item) =>
                        item.id ===
                        event
                          .target
                          .value
                    );

                  setHistoryCuisine(
                    selected ||
                      null
                  );

                  setHistoryRestaurant(
                    ""
                  );
                }}
              >
                <option value="">
                  Выберите кухню
                </option>

                {cuisines.map(
                  (item) => (
                    <option
                      key={
                        item.id
                      }
                      value={
                        item.id
                      }
                    >
                      {item.emoji}{" "}
                      {item.name}
                    </option>
                  )
                )}
              </select>

            </div>

            {/* РЕСТОРАН */}

            {historyCuisine && (
              <div className="calendar-field">

                <label>
                  РЕСТОРАН
                </label>

                <select
                  value={
                    historyRestaurant
                  }
                  onChange={(event) => {
                    setHistoryRestaurant(
                      event.target.value
                    );

                    if (
                      event.target.value !==
                      "custom"
                    ) {
                      setCustomHistoryRestaurant("");
                    }
                  }}
                >
                  <option value="">
                    Выберите ресторан
                  </option>

                  {historyCuisine
                    .restaurants
                    ?.map(
                      (
                        restaurant
                      ) => (
                        <option
                          key={
                            restaurant.id
                          }
                          value={
                            restaurant.id
                          }
                        >
                          {
                            restaurant.name
                          }
                        </option>
                      )
                    )}

                  <option value="custom">
                    ＋ Другой ресторан
                  </option>
                </select>

                {historyRestaurant ===
                  "custom" && (
                  <input
                    type="text"
                    value={
                      customHistoryRestaurant
                    }
                    placeholder="Название ресторана"
                    onChange={(event) =>
                      setCustomHistoryRestaurant(
                        event.target.value
                      )
                    }
                  />
                )}

              </div>
            )}

            {/* ДАТА */}

            <div className="calendar-field">

              <label>
                ДАТА
              </label>

              <input
                type="date"
                value={
                  historyDate
                }
                max={
                  new Date()
                    .toISOString()
                    .split(
                      "T"
                    )[0]
                }
                onChange={(
                  event
                ) =>
                  setHistoryDate(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            {/* ОЦЕНКА */}

            <div className="calendar-field">

              <label>
                КАК ВАМ?
              </label>

              <div
                style={{
                  display:
                    "flex",

                  justifyContent:
                    "center",

                  gap: "8px",

                  marginTop:
                    "12px",
                }}
              >
                {[
                  1,
                  2,
                  3,
                  4,
                  5,
                ].map(
                  (star) => (
                    <button
                      key={
                        star
                      }
                      type="button"
                      onClick={() =>
                        setHistoryRating(
                          star
                        )
                      }
                      style={{
                        border:
                          "none",

                        background:
                          "transparent",

                        padding:
                          0,

                        fontSize:
                          "30px",

                        cursor:
                          "pointer",

                        opacity:
                          star <=
                          historyRating
                            ? 1
                            : 0.2,
                      }}
                    >
                      ★
                    </button>
                  )
                )}
              </div>

            </div>

            {/* ОТЗЫВ */}

            <div className="calendar-field">

              <label>
                ПАРА СЛОВ
              </label>

              <textarea
                value={
                  historyReview
                }
                placeholder="Что запомнилось?"
                rows={4}
                onChange={(
                  event
                ) =>
                  setHistoryReview(
                    event
                      .target
                      .value
                  )
                }
              />

            </div>

            {syncError && (
              <p
                style={{
                  fontSize:
                    "12px",

                  marginTop:
                    "12px",
                }}
              >
                {syncError}
              </p>
            )}

            <button
              onClick={
                saveHistory
              }
              className="destiny-button"
              disabled={
                !historyCuisine ||
                !historyRestaurant ||
                (
                  historyRestaurant ===
                    "custom" &&
                  !customHistoryRestaurant.trim()
                ) ||
                !historyDate ||
                historySaving
              }
            >
              {historySaving
                ? "СОХРАНЯЕМ..."
                : "❤️ СОХРАНИТЬ В ИСТОРИЮ"}
            </button>

            <button
              onClick={() => {
                resetHistoryForm();

                setScreen(
                  "home"
                );
              }}
              className="text-button"
            >
              отмена
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
                    .split(
                      "T"
                    )[0]
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
