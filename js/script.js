(function trackUserContext() {
  const hasCountedThisSession = sessionStorage.getItem("visit_counted");
  let visitCount = Number(localStorage.getItem("visit_count") || 0);

  if (!hasCountedThisSession) {
    visitCount += 1;
    localStorage.setItem("visit_count", String(visitCount));
    sessionStorage.setItem("visit_counted", "1");
  }

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "user_context",
    visit_count: visitCount,
    page_path: window.location.pathname,
    page_title: document.title,
    referrer: document.referrer
  });
})();

function trackJourneyDepth() {
  const currentPath = window.location.pathname;
  const entryChoice = sessionStorage.getItem("entry_choice") || "";
  const visitedKey = "unique_pages_visited";
  const contentVisitedKey = "unique_content_pages_visited";
  const contentViewCountKey = "content_page_view_count";
  let visitedPages = [];
  let contentVisitedPages = [];

  try {
    visitedPages = JSON.parse(sessionStorage.getItem(visitedKey) || "[]");
  } catch (error) {
    visitedPages = [];
  }

  try {
    contentVisitedPages = JSON.parse(sessionStorage.getItem(contentVisitedKey) || "[]");
  } catch (error) {
    contentVisitedPages = [];
  }

  if (!visitedPages.includes(currentPath)) {
    visitedPages.push(currentPath);
    sessionStorage.setItem(visitedKey, JSON.stringify(visitedPages));
  }

  const normalizedPath = currentPath.replace(/\/$/, "");
  const currentFile = normalizedPath.split("/").pop() || "index.html";
  const contentPageFiles = ["growth.html", "strengths.html", "goals.html"];
  const isContentPage = contentPageFiles.includes(currentFile);

  if (isContentPage && !contentVisitedPages.includes(currentPath)) {
    contentVisitedPages.push(currentPath);
    sessionStorage.setItem(contentVisitedKey, JSON.stringify(contentVisitedPages));
  }

  let contentPageViewCount = Number(sessionStorage.getItem(contentViewCountKey) || 0);
  if (isContentPage) {
    contentPageViewCount += 1;
    sessionStorage.setItem(contentViewCountKey, String(contentPageViewCount));
  }

  window.dataLayer = window.dataLayer || [];

  if (isContentPage && contentPageViewCount >= 3 && contentPageViewCount % 3 === 0) {
    const contentRoundCount = contentPageViewCount / 3;
    const roundSentKey = `content_page_round_${contentRoundCount}_sent`;
    if (!sessionStorage.getItem(roundSentKey)) {
      sessionStorage.setItem(roundSentKey, "1");
      window.dataLayer.push({
        event: "content_page_round",
        content_round_count: contentRoundCount,
        content_page_view_count: contentPageViewCount,
        unique_page_count: contentVisitedPages.length,
        entry_choice: entryChoice,
        page_path: currentPath
      });
    }
  }

  if (contentVisitedPages.length >= 3 && !sessionStorage.getItem("unique_three_page_view_sent")) {
    sessionStorage.setItem("unique_three_page_view_sent", "1");
    window.dataLayer.push({
      event: "unique_three_page_view",
      unique_page_count: contentVisitedPages.length,
      entry_choice: entryChoice,
      page_path: currentPath
    });
  }

  if ((currentPath.endsWith("/goals.html") || currentPath.endsWith("/goals")) && !sessionStorage.getItem("journey_complete_sent")) {
    sessionStorage.setItem("journey_complete_sent", "1");
    window.dataLayer.push({
      event: "journey_complete",
      completion_page: currentPath,
      unique_page_count: contentVisitedPages.length,
      entry_choice: entryChoice,
      page_path: currentPath
    });
  }
}

window.addEventListener("load", () => {
  window.setTimeout(trackJourneyDepth, 300);
});
const menuButton = document.querySelector(".menu-toggle");
const sidebar = document.querySelector(".sidebar");
const introSplash = document.querySelector(".intro-splash");
const introStartButton = document.querySelector(".intro-start");
const introAudio = introSplash ? new Audio("assets/audio/nouveau-jingle-netflix.mp3") : null;

if (introAudio) {
  introAudio.preload = "auto";
  introAudio.volume = 0.85;
  introAudio.load();
}

const playIntroSound = () => {
  if (!introAudio) return Promise.resolve(false);

  try {
    introAudio.currentTime = 0.08;
  } catch (error) {
    // Some mobile browsers only allow seeking after metadata is ready.
  }

  return introAudio.play().then(() => true).catch(() => false);
};

const getTrackText = (element) => {
  return element.innerText?.replace(/\s+/g, " ").trim()
    || element.getAttribute("aria-label")
    || element.getAttribute("title")
    || "";
};

const getCurrentEntryChoice = () => sessionStorage.getItem("entry_choice") || "";

// 左ナビの「目標」は入口(経歴/強み)を通った人にだけ見せる。
// entry_choice が立っている or 既に goals ページにいる場合に表示する。
const revealGoalsNavIfEntered = () => {
  const onGoalsPage = window.location.pathname.endsWith("/goals.html")
    || window.location.pathname.endsWith("/goals");
  if (!getCurrentEntryChoice() && !onGoalsPage) return;
  document
    .querySelectorAll(".nav-link--goals.is-gated")
    .forEach((link) => link.classList.remove("is-gated"));
};

document.addEventListener("DOMContentLoaded", revealGoalsNavIfEntered);

const getEntryChoiceFromHref = (href = "") => {
  if (href.includes("growth.html") || href.endsWith("/growth")) return "history";
  if (href.includes("strengths.html") || href.endsWith("/strengths")) return "strengths";
  if (href.includes("goals.html") || href.endsWith("/goals")) return "goals_direct";
  return "";
};

const pushEntryChoice = (choice, method, sourceElement) => {
  if (!choice || sessionStorage.getItem("entry_choice")) return;
  sessionStorage.setItem("entry_choice", choice);

  // 入口を選んだので、以降このセッションでは左ナビの「目標」を出す。
  revealGoalsNavIfEntered();

  // 位置バイアス対策：入口カードで選んだ場合は「先(first)/後(second)」を記録する。
  // 入口順はランダム化しているので、集計で位置の影響を平均化でき、
  // 「両位置で同じ側が選ばれたか」を検証できる（発表の頑健性チェック）。
  // 左ナビ経由(nav)はカード位置の概念が無いので "nav" とする。
  const entryPosition = sourceElement?.dataset.entryPosition
    || (method === "nav" ? "nav" : "");

  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "entry_choice",
    choice,
    entry_method: method,
    entry_position: entryPosition,
    click_area: sourceElement?.dataset.clickArea || "",
    click_name: sourceElement?.dataset.clickName || "",
    click_label: sourceElement?.dataset.clickLabel || getTrackText(sourceElement),
    page_path: window.location.pathname
  });
};

document.addEventListener("click", (event) => {
  const target = event.target.closest("a, button, [data-click-name]");
  if (!target) return;
  if (target.matches(".intro-start, .reaction-like")) return;

  const clickSource = target.closest("[data-click-name]") || target;
  const isHomePage = window.location.pathname.endsWith("/") || window.location.pathname.endsWith("/index.html");
  if (isHomePage && target.matches("a")) {
    pushEntryChoice(getEntryChoiceFromHref(target.getAttribute("href") || ""), "nav", clickSource);
  }

  trackSiteButtonClick(target, clickSource);
});

const trackSiteButtonClick = (target, clickSource = target.closest("[data-click-name]") || target) => {
  window.dataLayer = window.dataLayer || [];
  window.dataLayer.push({
    event: "site_button_click",
    button_text: getTrackText(target),
    button_url: target.href || "",
    button_id: target.id || "",
    button_class: target.className || "",
    nav_item: target.dataset.navItem || "",
    click_area: clickSource.dataset.clickArea || "",
    click_name: clickSource.dataset.clickName || "",
    click_label: clickSource.dataset.clickLabel || getTrackText(target),
    entry_choice: getCurrentEntryChoice(),
    button_type: target.tagName.toLowerCase(),
    button_location: target.closest("nav")?.getAttribute("aria-label") || target.closest("aside")?.className || target.closest("main")?.className || "",
    page_path: window.location.pathname
  });
};

if (introSplash) {
  const introStorageKey = "intro_start_played";
  const navigationEntry = performance.getEntriesByType("navigation")[0];
  const isReload = navigationEntry?.type === "reload";

  if (isReload) {
    sessionStorage.removeItem(introStorageKey);
  }

  let introStarted = Boolean(sessionStorage.getItem(introStorageKey));

  if (introStarted) {
    introSplash.classList.remove("is-waiting");
    introSplash.classList.add("is-finished");
  }

  const finishIntroStart = () => {
    if (introStarted) return;
    introStarted = true;
    sessionStorage.setItem(introStorageKey, "1");
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "site_button_click",
      button_text: getTrackText(introStartButton),
      button_url: "",
      button_id: introStartButton?.id || "",
      button_class: introStartButton?.className || "",
      click_area: "intro",
      click_name: "play_intro",
      click_label: "イントロを再生する",
      entry_choice: getCurrentEntryChoice(),
      button_type: "button",
      button_location: "intro-splash",
      page_path: window.location.pathname
    });
    introSplash.classList.remove("is-waiting");
    // フェードアウト完了(animationend)に依存せず、確実にsplashを閉じる保険。
    // 背景タブ等でanimationが走らない／animationendが飛ばない場合でも黒画面を残さない。
    // is-finished(display:none)の付与は冪等なので、animationend側と二重でも無害。
    window.setTimeout(() => {
      introSplash.classList.add("is-finished");
    }, 2200);
    introStartButton?.removeEventListener("pointerdown", startIntro);
    introStartButton?.removeEventListener("touchend", startIntro);
    introStartButton?.removeEventListener("click", startIntro);
    window.removeEventListener("keydown", handleIntroKeydown);
  };

  const startIntro = () => {
    if (introStarted) return;
    // 音声は「鳴らせたら鳴らす」だけ（撃ちっぱなし）。ファイル読み込み失敗や
    // 端末の再生ブロックがあっても、イントロ解除＝サイト進入は必ず実行する。
    // これを音声再生の成否に依存させると、鳴らなかった端末が黒画面で詰み、
    // 入口フォークに到達せず entry_choice が取れないままユーザーを失う。
    playIntroSound();
    finishIntroStart();
  };

  introStartButton?.addEventListener("pointerdown", startIntro);
  introStartButton?.addEventListener("touchend", startIntro);
  introStartButton?.addEventListener("click", startIntro);

  const handleIntroKeydown = (event) => {
    if (event.key !== "Enter" && event.key !== " ") return;
    startIntro();
  };

  window.addEventListener("keydown", handleIntroKeydown);

  introSplash.addEventListener("animationend", (event) => {
    if (event.target !== introSplash) return;
    introSplash.classList.add("is-finished");
  });
}

if (menuButton && sidebar) {
  menuButton.addEventListener("click", () => {
    const isOpen = sidebar.classList.toggle("is-open");
    menuButton.setAttribute("aria-expanded", String(isOpen));
  });

  sidebar.querySelectorAll("a").forEach((link) => {
    link.addEventListener("click", () => {
      sidebar.classList.remove("is-open");
      menuButton.setAttribute("aria-expanded", "false");
    });
  });
}

const animateCount = (element) => {
  const target = Number(element.dataset.target || 0);
  const duration = 900;
  const startTime = performance.now();

  const tick = (now) => {
    const progress = Math.min((now - startTime) / duration, 1);
    element.textContent = Math.round(target * progress);

    if (progress < 1) {
      requestAnimationFrame(tick);
    }
  };

  requestAnimationFrame(tick);
};

const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) return;

    entry.target.classList.add("is-visible");
    entry.target.querySelectorAll(".count-up").forEach((count) => {
      if (count.dataset.done) return;
      count.dataset.done = "true";
      animateCount(count);
    });
  });
}, {
  threshold: 0.18
});

document.querySelectorAll(".reveal, .card").forEach((element) => {
  observer.observe(element);
});

const logCards = Array.from(document.querySelectorAll(".log-card"));
const historyStops = Array.from(document.querySelectorAll(".history-stop"));
const historyPawn = document.querySelector(".history-pawn");
let activeLogCard = null;
let logOverlay = null;

function setHistoryBoardStep(index) {
  const stop = historyStops[index];
  if (!stop) return;

  historyStops.forEach((item) => {
    item.classList.toggle("is-active", item === stop);
  });

  if (historyPawn) {
    historyPawn.style.left = stop.style.getPropertyValue("--x");
    historyPawn.style.top = stop.style.getPropertyValue("--y");
  }
}

const clearLogOverlaySource = () => {
  document.querySelectorAll(".timeline-item.log-overlay-source").forEach((item) => {
    item.classList.remove("log-overlay-source");
  });
};

const getLogOverlay = () => {
  if (logOverlay) return logOverlay;

  logOverlay = document.createElement("section");
  logOverlay.className = "log-overlay";
  logOverlay.hidden = true;
  logOverlay.setAttribute("aria-modal", "true");
  logOverlay.setAttribute("role", "dialog");
  document.body.append(logOverlay);
  return logOverlay;
};

const closeLogCards = () => {
  logCards.forEach((card) => {
    card.open = false;
  });
  clearLogOverlaySource();
  activeLogCard = null;
  getLogOverlay().hidden = true;
  document.body.classList.remove("log-overlay-open");
};

const openLogCard = (card) => {
  closeLogCards();
  activeLogCard = card;
  setHistoryBoardStep(logCards.indexOf(card));
  const item = card.closest(".timeline-item");
  const thumb = card.querySelector(".log-thumb img");
  const title = card.querySelector("summary strong")?.textContent?.trim() || "";
  const subtitle = card.querySelector("summary small")?.textContent?.trim() || "";
  const detail = card.querySelector(".log-detail > div")?.cloneNode(true);
  const overlay = getLogOverlay();

  item?.classList.add("log-overlay-source");
  document.body.classList.add("log-overlay-open");

  overlay.innerHTML = `
    <figure class="log-overlay-figure">
      <img src="${thumb?.getAttribute("data-full-src") || thumb?.getAttribute("src") || ""}" alt="${thumb?.getAttribute("alt") || ""}">
    </figure>
    <div class="log-overlay-heading">
      <strong>${title}</strong>
      <small>${subtitle}</small>
    </div>
    <div class="log-overlay-detail"></div>
    <button class="log-overlay-close" type="button" aria-label="閉じる" data-click-area="history_overlay" data-click-name="close_overlay" data-click-label="閉じる"></button>
  `;

  if (detail) {
    overlay.querySelector(".log-overlay-detail")?.append(detail);
  }

  overlay.hidden = false;
  overlay.querySelector(".log-overlay-close")?.addEventListener("click", closeLogCards);
  overlay.querySelector(".next-episode")?.addEventListener("click", (event) => {
    event.preventDefault();
    trackSiteButtonClick(event.currentTarget);
    event.stopPropagation();
    goToNextLogCard(card);
  });
};

const LOG_UNLOCK_KEY = "history_unlocked_episodes";

const readUnlockedLogs = () => {
  try {
    const stored = JSON.parse(sessionStorage.getItem(LOG_UNLOCK_KEY));
    return Array.isArray(stored) ? stored : [];
  } catch (error) {
    return [];
  }
};

const saveUnlockedLog = (index) => {
  if (index < 0) return;
  const unlocked = readUnlockedLogs();
  if (unlocked.includes(index)) return;
  unlocked.push(index);
  sessionStorage.setItem(LOG_UNLOCK_KEY, JSON.stringify(unlocked));
};

const unlockLogCard = (card) => {
  card.classList.remove("is-locked");
  card.classList.add("is-unlocked");
  card.querySelector("summary")?.removeAttribute("aria-disabled");
  card.querySelector(".lock-hint")?.remove();
  saveUnlockedLog(logCards.indexOf(card));
};

const createLockHint = (text) => {
  const hint = document.createElement("span");
  hint.className = "lock-hint";
  hint.textContent = text;
  return hint;
};

const goToNextLogCard = (currentCard) => {
  const currentItem = currentCard.closest(".timeline-item");
  const nextItem = currentItem?.nextElementSibling;
  const nextCard = nextItem?.querySelector(".log-card");

  if (nextCard) {
    unlockLogCard(nextCard);
    openLogCard(nextCard);
    nextCard.scrollIntoView({ behavior: "smooth", block: "center" });
    return;
  }

  closeLogCards();
  document.querySelector(".episode-nav-bottom a")?.click();
};

const unlockedLogs = readUnlockedLogs();

// 経歴の鍵（ロック）は撤去：全エピソードを最初から自由に見られるようにする。
// 理由＝順序を強制すると「自由に選んだ関心」を測れなくなるため（計測の公平性）。
logCards.forEach((card) => {
  unlockLogCard(card);
});

logCards.forEach((card) => {
  card.addEventListener("click", (event) => {
    if (!card.open) return;
    if (event.target.closest("summary")) return;
    if (event.target.closest(".log-detail")) return;
    if (event.target.closest(".next-episode")) return;

    closeLogCards();
  });

  const summary = card.querySelector("summary");
  if (summary) {
    summary.addEventListener("click", (event) => {
      event.preventDefault();

      if (card.classList.contains("is-locked")) {
        event.stopPropagation();

        card.classList.remove("is-nudged");
        requestAnimationFrame(() => {
          card.classList.add("is-nudged");
        });
        return;
      }

      if (card.open) {
        closeLogCards();
        return;
      }

      if (activeLogCard === card) {
        closeLogCards();
        return;
      }

      openLogCard(card);
    });
  }
});

historyStops.forEach((stop) => {
  stop.addEventListener("click", (event) => {
    trackSiteButtonClick(stop);
    event.stopPropagation();
    const index = Number(stop.dataset.logIndex);
    const card = logCards[index];
    if (!card) return;

    openLogCard(card);
  });
});

document.querySelectorAll(".log-card .next-episode").forEach((button) => {
  button.addEventListener("click", (event) => {
    trackSiteButtonClick(button);
    event.stopPropagation();

    const currentCard = button.closest(".log-card");
    goToNextLogCard(currentCard);
  });
});

document.addEventListener("click", (event) => {
  if (event.target.closest(".log-overlay")) return;
  if (event.target.closest(".log-card")) return;

  closeLogCards();
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;
  if (!activeLogCard) return;

  closeLogCards();
});


const skillBlocks = Array.from(document.querySelectorAll(".skill-block"));

skillBlocks.forEach((card) => {
  card.addEventListener("toggle", () => {
    if (!card.open) return;

    skillBlocks.forEach((openCard) => {
      if (openCard !== card) {
        openCard.open = false;
      }
    });
  });
});

document.addEventListener("keydown", (event) => {
  if (event.key !== "Escape") return;

  const openSkillBlock = document.querySelector(".skill-block[open]");
  if (!openSkillBlock) return;

  openSkillBlock.open = false;
});


// ネクストステージ：短期・中期・長期を選ぶと、赤旗が山を登る
const goalRoadmap = document.querySelector(".roadmap--single");
if (goalRoadmap) {
  const stageButtons = Array.from(goalRoadmap.querySelectorAll(".goal-stage"));
  const stagePanels = Array.from(goalRoadmap.querySelectorAll(".goal-stage-panel"));
  const stagePlaceholder = goalRoadmap.querySelector("[data-stage-placeholder]");

  const setGoalStage = (stage) => {
    goalRoadmap.dataset.activeStage = stage;
    if (stagePlaceholder) {
      stagePlaceholder.hidden = true;
    }

    const activeButton = stageButtons.find((button) => button.dataset.stage === stage);
    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "goal_stage_choice",
      goal_stage: stage,
      goal_stage_label: activeButton ? getTrackText(activeButton) : stage,
      entry_choice: getCurrentEntryChoice(),
      page_path: window.location.pathname
    });

    stageButtons.forEach((button) => {
      const isActive = button.dataset.stage === stage;
      button.classList.toggle("is-active", isActive);
      button.setAttribute("aria-expanded", String(isActive));
    });

    stagePanels.forEach((panel) => {
      const isActive = panel.dataset.stagePanel === stage;
      panel.hidden = !isActive;
      panel.classList.toggle("is-active", isActive);
    });
  };

  stageButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setGoalStage(button.dataset.stage || "short");
    });
  });
}

// いいね（ユーザーリアクション）計測：カスタムメトリクス用に数値も返す
const likeButton = document.querySelector(".reaction-like");
if (likeButton) {
  let liked = false;
  likeButton.addEventListener("click", () => {
    if (liked) return;                 // 1ページ表示につき1回だけ（二重カウント防止）
    liked = true;

    window.dataLayer = window.dataLayer || [];
    window.dataLayer.push({
      event: "reaction",               // GTMトリガーの合図
      reaction_type: "like",           // ディメンション：種類
      reaction_target: likeButton.dataset.reactionTarget || window.location.pathname, // ディメンション：どこで
      reaction_value: 1,               // メトリクス：数値（合計でいいね総数になる）
      click_area: likeButton.dataset.clickArea || "reaction",
      click_name: likeButton.dataset.clickName || "like_goals",
      click_label: likeButton.dataset.clickLabel || "いいね",
      entry_choice: getCurrentEntryChoice(),
      page_path: window.location.pathname
    });

    likeButton.classList.add("is-liked");
    const label = likeButton.querySelector(".reaction-like__label");
    if (label) label.textContent = "ありがとうございます！";
  });
}

// 入口フォークの位置バイアス対策：表示順をユーザーごとにランダム化する。
// 左=経歴・右=強みの固定順だと「経歴が勝ったのは先に読まれた(左)からでは？」を
// 潰せない。CSSのorderで並びを入れ替え（DOMは動かさない＝チラつき無し）、
// 各カードが「先(first)/後(second)」どちらに出たかをdatasetに記録する。
// 順はセッション内で固定（再訪・戻る操作でも同じ人には同じ順＝一貫性）。
const entryForkCards = Array.from(document.querySelectorAll(".entry-card"));
if (entryForkCards.length === 2) {
  let forkOrder = sessionStorage.getItem("entry_fork_order");
  if (forkOrder !== "0" && forkOrder !== "1") {
    forkOrder = Math.random() < 0.5 ? "0" : "1";
    sessionStorage.setItem("entry_fork_order", forkOrder);
  }
  const reversed = forkOrder === "1";
  entryForkCards.forEach((card, domIndex) => {
    const positionIndex = reversed ? 1 - domIndex : domIndex; // 0=先頭に表示
    card.style.order = String(positionIndex);
    card.dataset.entryPosition = positionIndex === 0 ? "first" : "second";
  });
}

// 入口フォーク（経歴／強み）の第一クリック計測：仮説A/Bを測るメインシグナル
// 経歴=history（A・物語）/ strengths=strengths（B・武器）どちらを先に選んだか
entryForkCards.forEach((card) => {
  card.addEventListener("click", () => {
    const choice = card.dataset.entryChoice || "";
    pushEntryChoice(choice, "entry_card", card);
    // 補足：<a>のクリックで即遷移するが、GA4イベントタグはsendBeaconで送るため
    // 通常は遷移前に送信される。DebugViewで発火を必ず確認すること。
  });
});

// 匿名一言フォーム（FormSubmit）：ページ遷移させず、その場でお礼を出す
const impressionForm = document.querySelector(".comment-form");
if (impressionForm) {
  impressionForm.addEventListener("submit", (event) => {
    event.preventDefault();
    // 入口選択（価値観/強み）を本文と一緒にメールへ届ける。匿名性は保つ（履歴/強み等のラベルのみ＝個人情報ではない）。
    const entryField = impressionForm.querySelector('input[name="入口"]');
    if (entryField) {
      const choice = sessionStorage.getItem("entry_choice") || "";
      const entryLabels = {
        history: "価値観(経歴)から入った人",
        strengths: "強みから入った人",
        goals_direct: "直接ゴールへ来た人"
      };
      entryField.value = entryLabels[choice] || "入口選択なし";
    }
    const payload = Object.fromEntries(new FormData(impressionForm).entries());
    fetch(impressionForm.action, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json"
      },
      body: JSON.stringify(payload)
    })
      .then((res) => {
        if (!res.ok) throw new Error("送信に失敗しました");
        const input = impressionForm.querySelector(".comment-form__input");
        const submit = impressionForm.querySelector(".comment-form__submit");
        const thanks = impressionForm.querySelector(".comment-form__thanks");
        if (input) input.hidden = true;
        if (submit) submit.hidden = true;
        if (thanks) thanks.hidden = false;
      })
      .catch(() => {
        alert("送信に失敗しました。時間をおいて、もう一度お試しください。");
      });
  });
}
