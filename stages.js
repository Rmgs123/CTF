window.STAGES = {
  "start": {
    body: `<pre>Y2lwaGVyX3RyYWlsX3N0YXJ0</pre>`,
    hints: ["Base64."],
    salt: "a2fd72fc0c5dda62",
    hash: "6f7143c4af4a7a6316d313d0fd3ad6248619f36afed525a056f60622a279e052",
  },

  "8f7aa9a64915": {
    body: `<pre>Arkg xrl: ebgngvba_xrl</pre>`,
    hints: ["ROT13."],
    salt: "f179ff4cabff096d",
    hash: "ad440a5e314673b2123b27513d837590a35774c5d3f4a05e8bfdb83192a81e91",
  },

  "56f0ce4808ae": {
    body: `<pre>XRKSVIYLLP</pre>`,
    hints: ["A↔Z, B↔Y, ..."],
    salt: "c4ef8b445e143fbb",
    hash: "fbfe26533fd8b8a9fe8f85f545e392f1c3564943ac65494cce2a4776b376476a",
  },

  "f5599f779fa3": {
    body: `<pre>L ORYH FUBSWRJUDSKB</pre>`,
    hints: ["Цезарь."],
    salt: "9c6d11e12940cd34",
    hash: "853331fe0118c0fe1d5f4b15d628543ff4d33a90f9e532dc07dc92324ca77d5e",
  },

  "8ef3c6ec3984": {
    body: `
      <pre>When the tide rises
A secret becomes visible
Vary the alphabet
Encrypt with a key</pre>
      <pre>ribijemi_hatin</pre>
    `,
    hints: ["Первые буквы строк.", "Подчёркивание не шифруется."],
    salt: "00f0ba1700c87bf6",
    hash: "f9d1b7d9c68d979dfa9f7f6668a6367e77ea36ae43ecd670c7d93ad4d4b9bc24",
  },

  "135e61c6e3cc": {
    body: `<pre>140009041c1c</pre>`,
    hints: ["XOR(hex) с повторяющимся ключом (ответ прошлого шага)."],
    salt: "18899c04f023c5ea",
    hash: "b2921ad1555140342f4fda7fcdeea4115f95d57ab2b9a1e02e18769dbdd9579c",
  },

  "c2f0d343e007": {
    body: `
      <pre>A:B:C</pre>
      <pre>A = шаг 3
B = шаг 5
C = шаг 6</pre>
    `,
    hints: ["Дальше — SHA-256 от собранной строки; ответ = первые 10 hex."],
    salt: "e3f5137f51bb1962",
    hash: "0aca411c7159f12abd3de76da99929bc6e73c1804e9eaeca3c9d20ce97fc2835",
  },

  "ebc7cebaf82e": {
    body: `<pre>Wm1sdVlXeHJaWGs9</pre>`,
    hints: ["Base64 несколько раз."],
    salt: "3c6c033f5fd2a2b6",
    hash: "ecec6d7f41f9433e30fda47057369e8d59123b0a2e2d43956e48f7fad75b134d",
  },

  "e4d2f335387a": {
    body: `
      <pre>1) step3[0]
2) step5.split('_')[1][0]
3) step6[0]
4) step8[0]</pre>
    `,
    hints: ["Собери 4 буквы в одну строку."],
    salt: "b1098c9fb0d4e1ae",
    hash: "3c5de83ed5af067b55a6c7ff8206b457eee777dd98ef788b4279eb2852dc98b0",
  },
};

window.FINAL_STAGE = {
  token: "70b3be9a6158",
  aad: "ctf2026",
  ivB64: "p+f2K1CQgFp3t+0f",
  ctB64: "+0IWUyBONSwQaXMOEfg4t03B+pL4k/WjzYwqz7EWaoa4QyfMvxV2Kg=="
};
