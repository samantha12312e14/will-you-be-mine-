(() => { 
  "use strict"; 
  const DATE_TYPES = [ 
    { emoji: "🌠", label: "Star Gazing" }, 
    { emoji: "🌃", label: "Late Night Walk" }, 
    { emoji: "🌳", label: "Picnic Date" }, 
    { emoji: "🖼️", label: "Museum Date" }, 
    { emoji: "🎮", label: "Game Date" }, 
    { emoji: "📚", label: "Study Date" } 
  ];

  const FOOD_TYPES = [ 
    { emoji: "🧋", label: "Milk Tea" }, 
    { emoji: "🍟", label: "Fries & Snacks" }, 
    { emoji: "🍲", label: "Hotpot" }, 
    { emoji: "🍗", label: "Samgyupsal" }, 
    { emoji: "🥘", label: "Korean Food" }, 
    { emoji: "🍱", label: "Japanese Food" } 
  ];
  const $ = (sel) => document.querySelector(sel); 
  const stepLanding = $("#step-landing"); 
  const stepDate = $("#step-date"); 
  const stepCalendar = $("#step-calendar"); 
  const stepTime = $("#step-time"); 
  const stepFood = $("#step-food"); 
  const stepResult = $("#step-result"); 
  const btnYes = $("#btn-yes"); 
  const btnNo = $("#btn-no"); 
  const dateOptions = $("#date-options"); 
  const foodOptions = $("#food-options"); 
  const btnDateNext = $("#date-next"); 
  const datePicker = $("#date-picker"); 
  const btnCalNext = $("#cal-next"); 
  const timePicker = $("#time-picker"); 
  const btnTimeBack = $("#time-back"); 
  const btnTimeNext = $("#time-next"); 
  const btnFoodNext = $("#food-next"); 
  const btnFoodBack = $("#food-back"); 
  const btnSavePlan = $("#save-plan"); 
  const btnRestart = $("#restart"); 

  let pickedDate = null; 
  let pickedDay = null; 
  let pickedTime = null; 
  let pickedFood = null; 
  let growLevel = 0; 
  let noCount = 0; 
  let noOnBody = false; 
  const noOriginalParent = btnNo.parentNode; 
  const noOriginalNext = btnNo.nextSibling; 
  const noMessage = $("#no-message"); 
  const CACHE_KEY = "willYouBeMyDate"; 
  const steps = [stepLanding, stepDate, stepCalendar, stepTime, stepFood, stepResult]; 
  const NO_LABELS = [ 
    "Ayoko 😅", 
    "Ayoko nga 🙃", 
    "Ayaw 😭", 
    "Ang kulet💔", 
    "Sabing Ayaw", 
    "AYOKOO!!!" 
  ]; 

  function cacheGifs() { 
    const gifs = [ 
      "dudu-flow-kiss-cute-dudu.gif", 
      "cuddle-cute.gif", 
      "bubu-dudu.gif" 
    ];
    gifs.forEach((src) => { 
      const img = new Image(); 
      img.src = src; 
    });
  }
  cacheGifs(); 

  function saveState() { 
    const state = { 
      date: pickedDate, 
      day: pickedDay, 
      time: pickedTime, 
      food: pickedFood 
    };
    try { 
      localStorage.setItem(CACHE_KEY, JSON.stringify(state)); 
    } catch (err) { 
      
    }
  }

  function restoreState() { 
    let state = null; 
    try { 
      state = JSON.parse(localStorage.getItem(CACHE_KEY)); 
    } catch (err) { 
      state = null; 
    }
    if (!state || !state.date && !state.day && !state.time && !state.food) return; 

    pickedDate = state.date || null; 
    pickedDay = state.day || null; 
    pickedTime = state.time || null; 
    pickedFood = state.food || null; 

    if (pickedDate) { 
      btnDateNext.disabled = false; 
    }
    if (pickedDay) { 
      datePicker.value = pickedDay; 
      btnCalNext.disabled = false; 
    }
    if (pickedTime) { 
      timePicker.value = pickedTime; 
      btnTimeNext.disabled = false; 
    }
    if (pickedFood) { 
      btnFoodNext.disabled = false; 
    }

    
    document.querySelectorAll("#date-options .option").forEach((btn) => { 
      if (btn.dataset.date === pickedDate) btn.classList.add("selected"); 
    });
    document.querySelectorAll("#food-options .option").forEach((btn) => { 
      if (btn.dataset.food === pickedFood) btn.classList.add("selected"); 
    });

    
  }
  restoreState(); 
  const BG_ITEMS = [ 
    { emoji: "♡", cls: "heart" }, 
    { emoji: "💞", cls: "heart" }, 
    { emoji: "💌", cls: "heart" }, 
    { emoji: "✦", cls: "sparkle" }, 
    { emoji: "✧", cls: "sparkle" }, 
    { emoji: "🎀", cls: "balloon" }, 
    { emoji: "🩷", cls: "butterfly" } 
  ];

  function spawnFloat() { 
    const item = BG_ITEMS[Math.floor(Math.random() * BG_ITEMS.length)]; 
    const el = document.createElement("div"); 
    el.className = "float-item " + item.cls; 
    el.innerHTML = "<span>" + item.emoji + "</span>"; 
    const size = 16 + Math.random() * 22; 
    el.style.left = Math.random() * 100 + "vw"; 
    el.firstChild.style.fontSize = size + "px"; 
    el.style.animationDuration = 8 + Math.random() * 10 + "s"; 
    el.style.animationDelay = Math.random() * 2 + "s"; 
    el.style.opacity = 0.5 + Math.random() * 0.3; 
    $("#hearts").appendChild(el); 
    setTimeout(() => el.remove(), 20000); 
  }

  setInterval(() => { 
    if (Math.random() < 0.6) spawnFloat(); 
  }, 500); 

  for (let i = 0; i < 8; i++) setTimeout(spawnFloat, i * 250); 
  function seedStars() { 
    for (let i = 0; i < 15; i++) { 
      const star = document.createElement("div"); 
      star.className = "bg-star"; 
      star.textContent = ["✦", "✧", "•", "+"][Math.floor(Math.random() * 4)]; 
      star.style.left = Math.random() * 100 + "vw"; 
      star.style.top = Math.random() * 100 + "vh"; 
      star.style.fontSize = (7 + Math.random() * 12) + "px"; 
      star.style.animationDuration = (1.8 + Math.random() * 2.2) + "s"; 
      star.style.animationDelay = Math.random() * 2 + "s"; 
      $("#hearts").appendChild(star); 
    }
  }
  seedStars(); 
  let lastSpark = 0; 

  document.addEventListener("pointermove", (e) => { 
    const now = Date.now(); 
    if (now - lastSpark < 120) return; 
    lastSpark = now; 

    const s = document.createElement("div"); 
    s.className = "float-item sparkle"; 
    s.innerHTML = "<span>✨</span>"; 
    s.style.animation = "none"; 
    s.style.position = "fixed"; 
    s.style.left = (e.clientX - 8) + "px"; 
    s.style.top = (e.clientY - 8) + "px"; 
    s.firstChild.style.fontSize = (10 + Math.random() * 8) + "px"; 
    s.style.transition = "transform 0.9s ease-out, opacity 0.9s ease-out"; 
    s.style.opacity = "1"; 
    $("#hearts").appendChild(s); 
    requestAnimationFrame(() => { 
      s.style.transform = "translateY(-40px) rotate(120deg)"; 
      s.style.opacity = "0"; 
    });
    setTimeout(() => s.remove(), 950); 
  }, { passive: true }); 
  const NO_CRIES = [ 
    "Tsk, parang naglalaro ka pa 😭", 
    "Ayan, dramatic pause muna ako 💔", 
    "Aww, ang cute mo naman, wag ka ganyan 😳", 
    "No? Ang lakas maka-heart attack mo 😢", 
    "Nakakainis ka, pinapainit mo na naman puso ko 💔💗", 
    "Please, wag mo akong iwan ng ganito 🥺", 
    "Ginawa ko lahat 'to para sayo eh 😭", 
    "Still here, patiently waiting with a smile 😌", 
    "Okay fine… pero say yes na before I cry happy tears 💧💖" 
  ];

  function cryBurst(x, y) { 
    const tears = ["💧", "💧", "😢", "😭", "💔", "😿"]; 
    for (let i = 0; i < 8; i++) { 
      const t = document.createElement("span"); 
      t.className = "tear"; 
      t.textContent = tears[Math.floor(Math.random() * tears.length)]; 
      t.style.left = (x - 12 + Math.random() * 26) + "px"; 
      t.style.top = y + "px"; 
      t.style.fontSize = (14 + Math.random() * 14) + "px"; 
      t.style.setProperty("--dx", (Math.random() * 60 - 30).toFixed(0)); 
      t.style.animationDuration = (1 + Math.random() * 0.8) + "s"; 
      document.body.appendChild(t); 
      setTimeout(() => t.remove(), 2400); 
    }
  }

  function updateNoMessages() { 
    const idx = Math.min(noCount - 1, NO_CRIES.length - 1); 
    noMessage.textContent = NO_CRIES[idx]; 
    noMessage.classList.remove("bump"); 
    void noMessage.offsetWidth; 
    noMessage.classList.add("bump"); 

    const labelIdx = Math.min(noCount - 1, NO_LABELS.length - 1); 
    btnNo.textContent = NO_LABELS[labelIdx]; 

    showCryGif(); 
  }

  function showCryGif() { 
    noMessage.classList.add("has-gif"); 
  }

  function dodgeNoButton() { 
    if (!noOnBody) { 
      noOnBody = true; 
      document.body.appendChild(btnNo); 
    }

    btnNo.classList.add("fixed"); 

    const btnW = btnNo.offsetWidth; 
    const btnH = btnNo.offsetHeight; 
    const margin = 16; 

    const viewportW = window.innerWidth; 
    const viewportH = window.innerHeight; 

    const maxW = Math.max(margin, viewportW - btnW - margin * 2); 
    const maxH = Math.max(margin, viewportH - btnH - margin * 2); 

    const x = margin + Math.random() * maxW; 
    const y = margin + Math.random() * maxH; 

    btnNo.style.left = x + "px"; 
    btnNo.style.top = y + "px"; 
    btnNo.style.transform = "rotate(" + (Math.random() * 30 - 15) + "deg)"; 

    noCount++; 
    const rect = btnNo.getBoundingClientRect(); 
    cryBurst(rect.left + rect.width / 2, rect.top); 
    updateNoMessages(); 

    growLevel += 0.15; 
    const scale = Math.min(1 + growLevel, 3); 
    btnYes.style.setProperty("--grow", scale); 
    btnYes.style.boxShadow = "0 " + (10 + growLevel * 25) + "px " + (30 + growLevel * 40) + 
      "px rgba(255, 77, 136, " + Math.min(0.5 + growLevel * 0.1, 0.9) + ")"; 
  }

  btnNo.addEventListener("mouseover", dodgeNoButton); 
  btnNo.addEventListener("touchstart", (e) => { e.preventDefault(); dodgeNoButton(); }, { passive: false }); 
  btnNo.addEventListener("click", dodgeNoButton); 
  function resetNoButton() { 
    if (noOnBody) { 
      noOnBody = false; 
      noOriginalParent.insertBefore(btnNo, noOriginalNext); 
    }
    btnNo.classList.remove("fixed"); 
    btnNo.style.left = ""; 
    btnNo.style.top = ""; 
    btnNo.style.transform = ""; 
    btnNo.textContent = NO_LABELS[0]; 
  }

  function goToStep(target) { 
    steps.forEach((s) => s.classList.remove("active")); 
    target.classList.add("active"); 
    window.scrollTo({ top: 0, behavior: "smooth" }); 
    if (target !== stepLanding) resetNoButton(); 
  }

  btnYes.addEventListener("click", () => goToStep(stepDate)); 
  function buildOptions(container, data, onPick, type) { 
    container.innerHTML = ""; 
    data.forEach((item) => { 
      const button = document.createElement("button"); 
      button.type = "button"; 
      button.className = "option"; 
      button.dataset[type] = item.label; 
      button.innerHTML = 
        '<span class="opt-emoji" aria-hidden="true">' + item.emoji + "</span>" + 
        "<span>" + item.label + "</span>"; 

      button.addEventListener("click", () => { 
        container.querySelectorAll(".option") 
          .forEach((el) => el.classList.remove("selected")); 
        button.classList.add("selected"); 
        onPick(item.label); 
      });

      container.appendChild(button); 
    });
  }

  buildOptions(dateOptions, DATE_TYPES, (label) => { 
    pickedDate = label; 
    btnDateNext.disabled = false; 
    saveState(); 
  }, "date"); 

  buildOptions(foodOptions, FOOD_TYPES, (label) => { 
    pickedFood = label; 
    btnFoodNext.disabled = false; 
    saveState(); 
  }, "food"); 

  btnDateNext.addEventListener("click", () => goToStep(stepCalendar)); 
  btnCalNext.addEventListener("click", () => goToStep(stepTime)); 
  btnTimeBack.addEventListener("click", () => goToStep(stepCalendar)); 
  btnFoodBack.addEventListener("click", () => goToStep(stepTime)); 
  datePicker.addEventListener("input", () => { 
    if (datePicker.value) { 
      pickedDay = datePicker.value; 
      btnCalNext.disabled = false; 
      saveState(); 
    } else { 
      btnCalNext.disabled = true; 
    }
  });

  timePicker.addEventListener("input", () => { 
    if (timePicker.value) { 
      pickedTime = timePicker.value; 
      btnTimeNext.disabled = false; 
      saveState(); 
    } else { 
      btnTimeNext.disabled = true; 
    }
  });

  btnTimeNext.addEventListener("click", () => goToStep(stepFood)); 

  btnFoodNext.addEventListener("click", () => { 
    $("#result-date").textContent = pickedDate; 
    $("#result-day").textContent = formatDay(pickedDay); 
    $("#result-time").textContent = formatTime(pickedTime); 
    $("#result-food").textContent = pickedFood; 
    goToStep(stepResult); 
    burstConfetti(); 
  });

  function formatDay(dateStr) { 
    if (!dateStr) return "—"; 
    const d = new Date(dateStr + "T00:00:00"); 
    return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" }); 
  }

  function formatTime(timeStr) { 
    if (!timeStr) return "—"; 
    const [h, m] = timeStr.split(":").map(Number); 
    const suffix = h >= 12 ? "PM" : "AM"; 
    const hour12 = ((h + 11) % 12) + 1; 
    return hour12 + ":" + (m < 10 ? "0" + m : m) + " " + suffix; 
  }
  const COLORS = ["#ff4d88", "#ff80ab", "#b24592", "#ffd166", "#00bbf9", "#9b5de5", "#00f5d4"]; 

  function burstConfetti() { 
    const count = Math.min(140, Math.floor(window.innerWidth / 7)); 
    for (let i = 0; i < count; i++) { 
      const piece = document.createElement("div"); 
      piece.className = "confetti"; 
      piece.style.left = Math.random() * 100 + "vw"; 
      piece.style.top = -20 + Math.random() * -40 + "px"; 
      piece.style.background = COLORS[Math.floor(Math.random() * COLORS.length)]; 
      piece.style.width = 6 + Math.random() * 10 + "px"; 
      piece.style.height = 8 + Math.random() * 12 + "px"; 
      piece.style.borderRadius = Math.random() > 0.5 ? "50%" : "2px"; 
      piece.style.animationDuration = 2.5 + Math.random() * 2.5 + "s"; 
      piece.style.animationDelay = Math.random() * 0.6 + "s"; 
      piece.style.opacity = 0.85; 
      document.body.appendChild(piece); 
      setTimeout(() => piece.remove(), 6500); 
    }
  }
  function buildTxtContent() { 
    const dateLabel = pickedDate || "—"; 
    const dayLabel = formatDay(pickedDay); 
    const timeLabel = formatTime(pickedTime); 
    const foodLabel = pickedFood || "—"; 
    return [ 
      "========================================", 
      "         PLAN NATIN, LOVEYAH! 💗", 
      "========================================", 
      "", 
      "Date natin : " + dateLabel, 
      "Araw       : " + dayLabel, 
      "Oras       : " + timeLabel, 
      "Kain       : " + foodLabel, 
      "", 
      "Salamat sa yes mo!", 
      "Mahal na mahal kita <3", 
      "========================================" 
    ].join("\n"); 
  }

  function buildHtmlContent() { 
    const dateLabel = pickedDate || "—"; 
    const dayLabel = formatDay(pickedDay); 
    const timeLabel = formatTime(pickedTime); 
    const foodLabel = pickedFood || "—"; 
    return `<!DOCTYPE html> <!-- The saved plan is itself a valid HTML document -->
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Plan Natin 💕</title>
  <style>
    body { font-family: 'Segoe UI', sans-serif; background: linear-gradient(135deg, #ffd6e7, #ffe6f0); min-height: 100vh; display: flex; align-items: center; justify-content: center; margin: 0; padding: 20px; color: #3a1a33; }
    .card { background: rgba(255,255,255,0.85); border-radius: 24px; padding: 40px; max-width: 480px; width: 100%; box-shadow: 0 20px 50px rgba(179,47,122,0.3); text-align: center; }
    h1 { font-size: 34px; margin: 0 0 6px; }
    h2 { font-size: 20px; font-weight: 600; opacity: 0.8; margin: 0 0 24px; }
    .row { background: rgba(255,77,136,0.08); border: 2px solid rgba(255,77,136,0.2); border-radius: 14px; padding: 14px; margin: 10px 0; }
    .label { font-size: 12px; text-transform: uppercase; letter-spacing: 1.5px; opacity: 0.6; }
    .value { font-size: 22px; font-weight: 800; color: #7b2b6e; margin-top: 4px; }
    .love { font-size: 28px; font-weight: bold; margin-top: 18px; }
  </style>
</head>
<body>
  <div class="card">
    <h1>Yayyy! Hindi ko na mapigil! 💫</h1>
    <h2>Ayan na yung plan natin…</h2>
    <div class="row"><div class="label">Date natin</div><div class="value">${dateLabel}</div></div>
    <div class="row"><div class="label">Araw</div><div class="value">${dayLabel}</div></div>
    <div class="row"><div class="label">Oras</div><div class="value">${timeLabel}</div></div>
    <div class="row"><div class="label">Kain</div><div class="value">${foodLabel}</div></div>
    <div class="love">Salamat sa yes mo,<br/>Mahal na mahal kita ❤️</div>
  </div>
</body>
</html>`; 
  }

  async function savePlanFiles() { 
    if (typeof window.showDirectoryPicker !== "function") { 
      alert("Your browser doesn't support saving files directly. Please use Chrome or Edge to save the plan."); 
      return; 
    }
    if (!pickedDate && !pickedDay && !pickedTime && !pickedFood) { 
      alert("Please plan your date first, then save it."); 
      return; 
    }
    const txtContent = buildTxtContent(); 
    const htmlContent = buildHtmlContent(); 
    try { 
      const dir = await window.showDirectoryPicker(); 
      const txtHandle = await dir.getFileHandle("our-date-plan.txt", { create: true }); 
      const txtWritable = await txtHandle.createWritable(); 
      await txtWritable.write(txtContent); 
      await txtWritable.close(); 

      const htmlHandle = await dir.getFileHandle("our-date-plan.html", { create: true }); 
      const htmlWritable = await htmlHandle.createWritable(); 
      await htmlWritable.write(htmlContent); 
      await htmlWritable.close(); 

      alert("Saved! You can now find 'our-date-plan.txt' and 'our-date-plan.html' in the folder you picked."); 
    } catch (err) { 
      
    }
  }

  btnSavePlan.addEventListener("click", savePlanFiles); 
  if (btnRestart) btnRestart.addEventListener("click", () => { 
    pickedDate = null; 
    pickedDay = null; 
    pickedTime = null; 
    pickedFood = null; 
    btnDateNext.disabled = true; 
    btnCalNext.disabled = true; 
    btnTimeNext.disabled = true; 
    btnFoodNext.disabled = true; 
    datePicker.value = ""; 
    timePicker.value = ""; 
    document.querySelectorAll(".option.selected").forEach((b) => b.classList.remove("selected")); 
    localStorage.removeItem(CACHE_KEY); 
    resetNoButton(); 
    noCount = 0; 
    noMessage.textContent = ""; 
    noMessage.classList.remove("bump"); 
    noMessage.classList.remove("has-gif"); 
    growLevel = 0; 
    btnYes.style.setProperty("--grow", 1); 
    btnYes.style.boxShadow = ""; 
    goToStep(stepLanding); 
  });
  window.addEventListener("resize", () => { 
    if (!btnNo.classList.contains("fixed")) return; 
    const btnW = Math.max(btnNo.offsetWidth, 80); 
    const btnH = Math.max(btnNo.offsetHeight, 40); 
    const margin = 16; 
    const x = Math.min(Math.max(parseFloat(btnNo.style.left) || 0, margin), window.innerWidth - btnW - margin); 
    const y = Math.min(Math.max(parseFloat(btnNo.style.top) || 0, margin), window.innerHeight - btnH - margin); 
    btnNo.style.left = x + "px"; 
    btnNo.style.top = y + "px"; 
  });
})(); 