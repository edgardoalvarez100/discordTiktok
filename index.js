require("dotenv").config();
const axios = require("axios");

// Configuración
const TIKTOK_USERNAME = process.env.TIKTOK_USERNAME;
const DISCORD_WEBHOOK_URL = process.env.DISCORD_WEBHOOK_URL;

let isLive = false; // Para evitar spam de notificaciones

async function checkLiveStatus() {
  try {
    console.log("🔍 Verificando si TikTok Live está en vivo...");
    const url = `https://www.tiktok.com/@${TIKTOK_USERNAME}/live`;
    const response = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/110.0.0.0 Safari/537.36",
        "Accept-Language": "en-US,en;q=0.9",
        Referer: "https://www.tiktok.com/",
        "Sec-Fetch-Mode": "navigate",
      },
    });

    // Buscar un patrón específico en el HTML
    const isLiveNow = /"status":2/.test(response.data); // "status":2 indica que está en vivo en la respuesta de TikTok

    if (isLiveNow) {
      if (!isLive) {
        console.log(`🔴 ${TIKTOK_USERNAME} está en vivo.`);
        await sendDiscordNotification();
        isLive = true;
        setTimeout(function () {
          console.log("This printed after about 15 min");
        }, 15 * 60000);
      }
    } else {
      isLive = false;
    }
  } catch (error) {
    console.error("Error verificando TikTok Live:", error.message);
  }
}

async function sendDiscordNotification() {
  try {
    await axios.post(DISCORD_WEBHOOK_URL, {
      content: `@everyone 🎥 ¡${TIKTOK_USERNAME} está en vivo en TikTok! 🚀\n🔴 Entra ahora: https://www.tiktok.com/@${TIKTOK_USERNAME}/live`,
    });
    console.log("✅ Notificación enviada a Discord.");
  } catch (error) {
    console.error("❌ Error enviando la notificación:", error.message);
  }
}

// Verificar cada 30 segundos
setInterval(checkLiveStatus, 30000);
