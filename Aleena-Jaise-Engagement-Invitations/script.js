(() => {
  "use strict";
  const engagement = window.ENGAGEMENT;
  const $ = (selector, scope = document) => scope.querySelector(selector);
  const $$ = (selector, scope = document) => [...scope.querySelectorAll(selector)];
  const toast = $("#toast");
  const petalLayer = $("#petal-layer");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  let toastTimer;

  function getTimezoneLabel() {
    if (engagement.TIMEZONE === "Asia/Kolkata") return "IST";
    try {
      return new Intl.DateTimeFormat("en-US", { timeZone: engagement.TIMEZONE, timeZoneName: "short" })
        .formatToParts(new Date()).find((part) => part.type === "timeZoneName")?.value || engagement.TIMEZONE;
    } catch {
      return engagement.TIMEZONE;
    }
  }

  function configurePage() {
    document.title = `${engagement.BRIDE_NAME} & ${engagement.GROOM_NAME} | Engagement Invitation`;
    const description = `Join ${engagement.BRIDE_NAME} and ${engagement.GROOM_NAME} as they celebrate their engagement on ${engagement.EVENT_DATE}.`;
    const setMeta = (selector, content) => {
      const element = $(selector);
      if (element) element.content = content;
    };
    setMeta("meta[name='description']", description);
    setMeta("meta[property='og:title']", engagement.OPEN_GRAPH_TITLE);
    setMeta("meta[property='og:description']", engagement.OPEN_GRAPH_DESCRIPTION);
    const canonical = engagement.PUBLIC_URL ? new URL(engagement.PUBLIC_URL) : new URL(location.href);
    setMeta("meta[property='og:url']", canonical.href);
    const imageMeta = $("meta[property='og:image']");
    const imagePath = imageMeta?.dataset.image || engagement.OPEN_GRAPH_IMAGE;
    setMeta("meta[property='og:image']", new URL(imagePath, canonical).href);

    const values = {
      brideName: engagement.BRIDE_NAME,
      groomName: engagement.GROOM_NAME,
      shortNames: engagement.SHORT_NAMES,
      eventDate: engagement.EVENT_DATE,
      eventTime: engagement.EVENT_TIME,
      eventType: engagement.EVENT_TYPE,
      venueName: engagement.VENUE_NAME,
      venueLocation: engagement.VENUE_LOCATION,
      timezone: getTimezoneLabel()
    };
    $$('[data-content]').forEach((element) => {
      const value = values[element.dataset.content];
      if (value !== undefined) element.textContent = value;
    });
    $$('[data-maps]').forEach((link) => { link.href = engagement.GOOGLE_MAPS_URL; });
    $$('[data-ring-photo]').forEach((image) => {
      const src = image.dataset.ringPhoto === "bride" ? engagement.BRIDE_RING : engagement.GROOM_RING;
      if (src) image.src = src;
    });
  }

  function showToast(message) {
    if (!toast) return;
    toast.textContent = message;
    toast.classList.add("is-visible");
    window.clearTimeout(toastTimer);
    toastTimer = window.setTimeout(() => toast.classList.remove("is-visible"), 3200);
  }

  function makePetals(count = 20) {
    if (!petalLayer || reducedMotion) return;
    petalLayer.replaceChildren();
    for (let index = 0; index < count; index += 1) {
      const petal = document.createElement("i");
      petal.className = "petal";
      petal.style.setProperty("--left", `${Math.random() * 100}%`);
      petal.style.setProperty("--size", `${6 + Math.random() * 8}px`);
      petal.style.setProperty("--duration", `${4 + Math.random() * 3.4}s`);
      petal.style.setProperty("--delay", `${Math.random() * .9}s`);
      petal.style.setProperty("--drift", `${-75 + Math.random() * 150}px`);
      petal.style.setProperty("--spin", `${360 + Math.random() * 640}deg`);
      petalLayer.append(petal);
    }
    window.setTimeout(() => petalLayer.replaceChildren(), 9000);
  }

  // Music begins only after a visitor taps the control.
  const musicButton = $("#music-control");
  const musicLabel = $(".music-label", musicButton);
  let musicTrack;
  let musicPlaying = false;

  function setMusicUi(playing) {
    musicPlaying = playing;
    musicButton.classList.toggle("is-paused", !playing);
    musicButton.setAttribute("aria-pressed", String(playing));
    musicButton.setAttribute("aria-label", `${playing ? "Pause" : "Play"} engagement music`);
    musicButton.title = `${playing ? "Pause" : "Play"} engagement music`;
    musicLabel.textContent = playing ? "MUSIC ON" : "PLAY MUSIC";
  }

  async function toggleMusic() {
    if (!musicTrack) {
      musicTrack = new Audio(engagement.BACKGROUND_MUSIC);
      musicTrack.loop = true;
      musicTrack.preload = "none";
      musicTrack.volume = .52;
      musicTrack.addEventListener("play", () => setMusicUi(true));
      musicTrack.addEventListener("pause", () => setMusicUi(false));
      musicTrack.addEventListener("error", () => showToast("The music file could not be loaded."));
    }
    try {
      if (musicPlaying) musicTrack.pause();
      else await musicTrack.play();
    } catch {
      showToast("Tap the music button again to start playback.");
    }
  }
  musicButton.addEventListener("click", toggleMusic);

  async function shareInvitation() {
    const url = engagement.PUBLIC_URL || location.href;
    const text = engagement.SHARE_MESSAGE;
    if (navigator.share) {
      try {
        await navigator.share({ title: engagement.OPEN_GRAPH_TITLE, text, url });
        return;
      } catch (error) {
        if (error.name === "AbortError") return;
      }
    }
    window.open(`https://wa.me/?text=${encodeURIComponent(`${text}\n\n${url}`)}`, "_blank", "noopener,noreferrer");
  }
  $$('[data-share]').forEach((button) => button.addEventListener("click", shareInvitation));

  let rsvpAnswer = "";
  const rsvpStatus = $("#rsvp-status");
  $$('[data-rsvp]').forEach((button) => button.addEventListener("click", () => {
    rsvpAnswer = button.dataset.rsvp;
    rsvpStatus.textContent = rsvpAnswer === "yes" ? engagement.RSVP_ATTENDING_CONFIRMATION : engagement.RSVP_DECLINING_CONFIRMATION;
    rsvpStatus.hidden = false;
    $$('[data-rsvp]').forEach((choice) => choice.setAttribute("aria-pressed", String(choice === button)));
  }));
  $("#rsvp-whatsapp").addEventListener("click", () => {
    const number = String(engagement.RSVP_WHATSAPP_NUMBER || "").replace(/[^0-9]/g, "");
    const choice = rsvpAnswer === "yes" ? "I will attend." : rsvpAnswer === "no" ? "I am unable to attend." : "I would like to RSVP.";
    const message = `${engagement.RSVP_WHATSAPP_MESSAGE}\n${choice}`;
    window.open(`https://wa.me/${number}?text=${encodeURIComponent(message)}`, "_blank", "noopener,noreferrer");
  });

  // Three scroll beats: the bride's ring lands, the groom's ring follows, then they meet.
  const ringSection = $("#ring-journey");
  const ringStage = $("#ring-stage");
  const brideRing = $("#bride-journey-ring");
  const groomRing = $("#groom-journey-ring");
  const stepNumber = $("#ring-step-number");
  const stepCopy = $("#ring-step-copy");
  let ringFramePending = false;
  let celebrationPlayed = false;

  function samplePath(progress, points) {
    for (let index = 1; index < points.length; index += 1) {
      if (progress <= points[index].p) {
        const start = points[index - 1];
        const end = points[index];
        const linear = Math.max(0, (progress - start.p) / (end.p - start.p));
        const eased = linear * linear * (3 - 2 * linear);
        return {
          x: start.x + (end.x - start.x) * eased,
          y: start.y + (end.y - start.y) * eased,
          rotation: start.rotation + (end.rotation - start.rotation) * eased
        };
      }
    }
    return points[points.length - 1];
  }

  function renderRingFlight() {
    ringFramePending = false;
    if (!ringSection || !ringStage || !brideRing || !groomRing) return;
    if (reducedMotion) {
      ringStage.classList.add("is-united");
      ringStage.dataset.step = "3";
      stepNumber.textContent = "TOGETHER";
      stepCopy.textContent = "TWO RINGS, ONE BEGINNING";
      return;
    }
    const bounds = ringSection.getBoundingClientRect();
    const stageHeight = ringStage.clientHeight;
    const scrollable = Math.max(1, ringSection.offsetHeight - stageHeight);
    const progress = Math.min(1, Math.max(0, -bounds.top / scrollable));

    const bride = samplePath(progress, [
      { p: 0, x: -12, y: -1.22, rotation: -31 },
      { p: .12, x: -12, y: -.76, rotation: -21 },
      { p: .30, x: -12, y: .22, rotation: 7 },
      { p: .47, x: -12, y: .22, rotation: 7 },
      { p: .69, x: -13, y: .22, rotation: 17 },
      { p: 1, x: -14, y: .22, rotation: 24 }
    ]);
    const groom = samplePath(progress, [
      { p: 0, x: 12, y: -1.28, rotation: 31 },
      { p: .34, x: 12, y: -1.28, rotation: 31 },
      { p: .48, x: 12, y: -.79, rotation: 18 },
      { p: .66, x: 12, y: .20, rotation: -5 },
      { p: .73, x: 12, y: .20, rotation: -5 },
      { p: 1, x: 14, y: .22, rotation: -24 }
    ]);
    brideRing.style.transform = `translate3d(${bride.x}vw, ${bride.y}vh, 0) translate(-50%, -50%) rotate(${bride.rotation}deg)`;
    groomRing.style.transform = `translate3d(${groom.x}vw, ${groom.y}vh, 0) translate(-50%, -50%) rotate(${groom.rotation}deg)`;

    const step = progress < .34 ? 1 : progress < .69 ? 2 : 3;
    ringStage.dataset.step = String(step);
    stepNumber.textContent = `SCROLL ${step}`;
    stepCopy.textContent = step === 1 ? "BRIDE RING\nFALLS FROM ABOVE" : step === 2 ? "GROOM RING\nFALLS FROM ABOVE" : "BOTH RINGS\nJOIN AT THE BOTTOM";
    const united = progress >= .87;
    ringStage.classList.toggle("is-united", united);
    if (united && !celebrationPlayed) {
      makePetals(22);
      celebrationPlayed = true;
    } else if (progress < .76) {
      celebrationPlayed = false;
    }
  }

  function scheduleRingFlight() {
    if (ringFramePending || reducedMotion) return;
    ringFramePending = true;
    window.requestAnimationFrame(renderRingFlight);
  }
  window.addEventListener("scroll", scheduleRingFlight, { passive: true });
  window.addEventListener("resize", scheduleRingFlight, { passive: true });

  configurePage();
  renderRingFlight();
})();
