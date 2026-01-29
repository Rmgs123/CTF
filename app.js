const $ = (id) => document.getElementById(id);

function normalizeAnswer(s) {
  return (s || "").trim().toLowerCase();
}

function showMsg(text, ok) {
  const box = $("msg");
  box.textContent = text;
  box.className = "msg " + (ok ? "ok" : "err");
  box.style.display = "block";
}

function clearMsg() {
  const box = $("msg");
  box.style.display = "none";
  box.textContent = "";
  box.className = "msg";
}

async function sha256Hex(str) {
  const enc = new TextEncoder().encode(str);
  const buf = await crypto.subtle.digest("SHA-256", enc);
  const arr = Array.from(new Uint8Array(buf));
  return arr.map(b => b.toString(16).padStart(2, "0")).join("");
}

function b64ToBytes(b64) {
  const bin = atob(b64);
  const bytes = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) bytes[i] = bin.charCodeAt(i);
  return bytes;
}

async function tokenFromAnswer(ansNorm) {
  const h = await sha256Hex("token:" + ansNorm);
  return h.slice(0, 12);
}

async function checkStageAnswer(stageObj, ansNorm) {
  const h = await sha256Hex(stageObj.salt + "|" + ansNorm);
  return h === stageObj.hash;
}

async function aesGcmDecryptFromPassphrase(passphrase, ivB64, ctB64, aadStr) {
  const keyHex = await sha256Hex(passphrase);
  const raw = new Uint8Array(keyHex.match(/.{1,2}/g).map(h => parseInt(h, 16)));

  const key = await crypto.subtle.importKey(
    "raw",
    raw,
    { name: "AES-GCM" },
    false,
    ["decrypt"]
  );

  const iv = b64ToBytes(ivB64);
  const ct = b64ToBytes(ctB64);
  const aad = new TextEncoder().encode(aadStr);

  const ptBuf = await crypto.subtle.decrypt(
    { name: "AES-GCM", iv, additionalData: aad },
    key,
    ct
  );

  return new TextDecoder().decode(ptBuf);
}

function resetHintUI() {
  $("hintBox").style.display = "none";
  $("hintsList").innerHTML = "";
  $("hintBtn").disabled = false;
}

function renderStage(token, stageObj) {
  $("stageCard").style.display = "block";
  $("stageBody").innerHTML = stageObj.body;

  $("tokenView").textContent = token;
  $("tokenLine").style.display = "block";

  resetHintUI();
  (stageObj.hints || []).forEach(h => {
    const li = document.createElement("li");
    li.textContent = h;
    $("hintsList").appendChild(li);
  });

  if (!stageObj.hints || stageObj.hints.length === 0) {
    $("hintBtn").disabled = true;
  }

  $("answerInput").value = "";
  clearMsg();
}

function renderFinalStage(token) {
  $("stageCard").style.display = "block";

  $("stageBody").innerHTML = `
    <pre>binary|finalkey|clbf</pre>
    <pre>IV: ${window.FINAL_STAGE.ivB64}
CT: ${window.FINAL_STAGE.ctB64}
AAD: ${window.FINAL_STAGE.aad}</pre>
  `;

  $("tokenView").textContent = token;
  $("tokenLine").style.display = "block";

  resetHintUI();
  $("hintBtn").disabled = true;

  $("answerInput").value = "";
  clearMsg();
}

async function handleCheck() {
  clearMsg();

  const token = (location.hash || "#start").slice(1) || "start";
  const ansNorm = normalizeAnswer($("answerInput").value);

  if (!ansNorm) {
    showMsg("Пусто.", false);
    return;
  }

  if (token === window.FINAL_STAGE.token) {
    try {
      await aesGcmDecryptFromPassphrase(
        ansNorm,
        window.FINAL_STAGE.ivB64,
        window.FINAL_STAGE.ctB64,
        window.FINAL_STAGE.aad
      );
      showMsg("Поздравляем, вы добрались!", true);
    } catch {
      showMsg("Неверно.", false);
    }
    return;
  }

  const stageObj = window.STAGES[token];
  if (!stageObj) {
    showMsg("Неизвестный token.", false);
    return;
  }

  const ok = await checkStageAnswer(stageObj, ansNorm);
  if (!ok) {
    showMsg("Неверно.", false);
    return;
  }

  const nextToken = await tokenFromAnswer(ansNorm);
  location.hash = "#" + nextToken;
}

function handleHint() {
  // показываем только кнопкой, и потом уже не скрываем
  if ($("hintBtn").disabled) return;
  $("hintBox").style.display = "block";
  $("hintBtn").disabled = true;
}

function handleRoute() {
  clearMsg();
  const token = (location.hash || "#start").slice(1) || "start";

  if (token === window.FINAL_STAGE.token) {
    renderFinalStage(token);
    return;
  }

  const stageObj = window.STAGES[token];
  if (!stageObj) {
    location.hash = "#start";
    return;
  }

  renderStage(token, stageObj);
}

window.addEventListener("hashchange", handleRoute);

window.addEventListener("DOMContentLoaded", () => {
  $("checkBtn").addEventListener("click", handleCheck);
  $("hintBtn").addEventListener("click", handleHint);
  $("answerInput").addEventListener("keydown", (e) => {
    if (e.key === "Enter") handleCheck();
  });

  if (!location.hash) location.hash = "#start";
  handleRoute();
});
