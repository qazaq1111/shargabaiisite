// ==========================================
// 📦 ҚАЖЕТТІ КІТАПХАНАЛАР
// ==========================================
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const pdfParse = require('pdf-parse');
const axios = require('axios');

// ==========================================
// 🛠 БАСТАПҚЫ КОНФИГУРАЦИЯ ЖӘНЕ ҚҰПИЯЛАР
// ==========================================
const BOT_TOKEN = '8981884335:AAEOSGxNZCYppIiehOmhO6TCONpiOfdda9Y';
const SUPER_ADMIN_ID = 7662045200;
const KASPI_NUMBER = '+77473243971';
const DEEPSEEK_API_KEY = 'sk-878af99b038144749008bb29af47df7c';
const PHOTO_CHANNEL_ID = -1003945346272;
const PHOTO_CHANNEL_USERNAME = 'shargabaisitebot';
const SUPER_ADMIN_LOGIN = 'superadmin';
const SUPER_ADMIN_PASS = 'SHARGA2026';
const RESET_PRICE = 5000;

// Firebase Service Account
const serviceAccount = {
  "type": "service_account",
  "project_id": "shargabaiisite",
  "private_key_id": "431bf4b8cd2cf11f8fd0de7355007742c63dff43",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhrVkLv/QhRdId\nhNmNYp4loYJvHQ4YuQqqF8LVGyKoJyrN7R6s2XrgpyRbm3/zCBPchwygHqCU/B47\nd6fi7YwNsUH/Hd4RGmNxMZt4sQS/a/B9y/2CMiBAc1FvskaBQa/wXuIYGAbUT6DP\nfc8qas7XmuNV6dLyVEGs1ECabqYrXF3T0FX4oOaahBFVEzIIM6i8sLi+CBNQaWjl\nFYnxwhTURCkvTv8H0bn7K+o1+YD+yJsGah9hZLgpx1RZH0ipUH/dEOmuTh9iF1ru\nVqF6C9rHHoguCmRcrk1pb6dTRVv4DYykQzbx3nV1LiTUHRE+8xAHXP1a5WhFSvx0\nVpDx2lifAgMBAAECggEAGYhPPBu/jHQlzYkrmT9rEmmEzvrD5DArRgs3fnzPcvmG\nHOjoQONqGjikIxPOFLpOj54H46W+F/JeSUQZuSbpuDLce0yZxJLuZUQY3ugdgrq8\n6WlG3pAP7hAd9TvU65LO9lcF0CFdGcWDNXZ6axt3w2pBW4WqLsMxmv14lwBQdInh\nqhpKGn18uAUADaY5ikD4h6XYw2yLQygWMJ6ie9+ZzBWfexVr6+AbbCPEmANWM+5M\nM+mwzpPX1BWdLIVwemUbUyF7MML+/DHocVEHrBLVQMuzbAFZof+mwrKRkqt354ac\n5zFlCjbYFL79CA0BH/PC8BSVeDUktP4jE5zir6ZX4QKBgQDzCOa1r9mCWEcpao7z\n/6ymDnqTxwGG7M8SYblD19PeQFlvPKxLwzX4s70Ev0NYGFjlZ1uht5Cu4HnzotMd\nuFETUcixzxXH9XIQ0R5kY50GTuwD0/NcqQL5lvCINzEIZuybJUxErWsLAZG9cLRt\nLEy/+FITmRmZMoNpxZO6DT4JVQKBgQDtt2U5AEm+Y5mSVntW6/HyCmIjuWLBbn1V\n4+nFHfSlfJjkLvTEzv0BQk4j5QN3yH8Um2aH37Zx4U5BSeMgrmww67KGVHzN2qNh\nS+TtaL+2ptgBQTRYAlg1T+VPQ/SoWhN8gUd0DaCWwFZSzECBAdzDqGa+x3XUhhdB\nyPTMyvrKIwKBgBbgep8Vm3rahnBOmIA9S+ohqMYqUGl79w365u6M7WOZWRHQe0Ny\nb60mdh9xRYyQViXZ8dUqK1Nay//0Dr1YcUFJTIP4Q0ucPg15McwvWEOUwECn/dt2\nCVKnM6MO1u28in8cJq68SDwz/J0Bc+pm5h6X6Fnx6mfySk51i69Suck1AoGAWJkj\n5uzOj2E72ajV632g/V8VWM89mW5+1EZP2KHjjtIzgchmffvPnGqECSjP9BMMGjgZ\nLMcajrM0oWzSdFnOBSWzshFHOsokXp0Uw89otMDWfRE6Wxr0mVof0z02sJBx9tOQ\nOBbkJYumINHzsKFrEJlxQeXBauZXQLOPWczFUBUCgYEArhlqNpaRV9vTshW0fwTC\ntpSMXW/UPutXY4P1bnjvo8qKtq1i0dN37YT9X2wzjegKi9YMLYoH3WgvK9jbq1W1\nLkMDpKS4JHD0C+/hrG72GUqzyWNVxPZyuX3qKlsdT3Yl4/staVe0WD45hbvomwFp\neESWlaJEYaDsx0co8e5rhZI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@shargabaiisite.iam.gserviceaccount.com",
  "client_id": "104903887535443706109"
};

// ================== FIREBASE ЖӘНЕ БОТҚА ҚОСЫЛУ ==================
admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shargabaiisite-default-rtdb.asia-southeast1.firebasedatabase.app"
});

const db = admin.firestore();
const rtdb = admin.database();
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================== СЕССИЯЛАР ЖӘНЕ ЖАД ==================
const sessions = {};
const attempts = {};
const usedChecks = [];

// ================== КӨМЕКШІ ФУНКЦИЯЛАР ==================
function getHomeButton() {
  return { reply_markup: { inline_keyboard: [[{ text: '0️⃣ Басты панельге оралу', callback_data: 'home' }]] } };
}

function getCafeKeyboard() {
  return { reply_markup: {
    keyboard: [
      ['📋 Мәзірді көру', '➕ Тауар қосу'],
      ['✏️ Тауар өзгерту', '🗑️ Тауар жою'],
      ['🖼️ Сурет жүктеу', '🎨 Түстер'],
      ['🔗 QR код', '📊 Статистика'],
      ['🚪 Шығу']
    ], resize_keyboard: true
  }};
}

function getSuperKeyboard() {
  return { reply_markup: {
    keyboard: [['📋 Барлық кафелер', '📊 Статистика'], ['🚪 Шығу']], resize_keyboard: true
  }};
}

// Firestore + Realtime Database қатар жаңарту функциясы[cite: 1]
async function updateRealtimeAndFirestore(cafeId, updateData) {
  try {
    await db.collection('cafes').doc(cafeId).set(updateData, { merge: true });
    await rtdb.ref(`cafes/${cafeId}`).update(updateData);
  } catch (err) {
    console.error("Дерекқорды жаңарту қатесі:", err);
  }
}

async function getCafe(chatId) {
  try {
    const doc = await db.collection('cafes').doc(String(chatId)).get();
    return doc.exists ? doc.data() : null;
  } catch (e) {
    return null;
  }
}

// ================== /START КОМАНДАСЫ ==================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = {};
  attempts[chatId] = 0;
  bot.sendMessage(chatId, '🍽️ *Shargabaii.site — Кафе басқару боты*\n\nЖүйеге кіру үшін төмендегі батырманы басыңыз:', {
    parse_mode: 'Markdown',
    reply_markup: { keyboard: [['🚪 Кіру']], resize_keyboard: true }
  });
});

// ================== МӘТІНДЕРДІ ЖӘНЕ ҚАДАМДАРДЫ ӨҢДЕУ ==================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  // 1. Кіру батырмасы
  if (text === '🚪 Кіру') {
    sessions[chatId] = { step: 'login' };
    return bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  // 2. Логин қабылдау
  if (sessions[chatId]?.step === 'login') {
    sessions[chatId].login = text.trim();
    sessions[chatId].step = 'password';
    return bot.sendMessage(chatId, '🔒 *Парольді енгізіңіз:*', { parse_mode: 'Markdown' });
  }

  // 3. Пароль қабылдау және тексеру
  if (sessions[chatId]?.step === 'password') {
    const login = sessions[chatId].login;
    const pass = text.trim();

    // Супер админ тексерісі
    if (login === SUPER_ADMIN_LOGIN && pass === SUPER_ADMIN_PASS) {
      sessions[chatId] = { role: 'superadmin' };
      attempts[chatId] = 0;
      return bot.sendMessage(chatId, '👑 *Супер-админ панеліне қош келдіңіз!*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
    }

    // Кафе тексерісі (Firestore арқылы)
    const cafe = await getCafe(chatId);
    if (cafe && cafe.login === login && cafe.password === pass) {
      sessions[chatId] = { role: 'cafe', cafeId: String(chatId), cafeName: cafe.name || 'Кафе' };
      attempts[chatId] = 0;
      return bot.sendMessage(chatId, `🏪 *${sessions[chatId].cafeName} басқару панелі:*`, { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // Қате енгізу санағы
    attempts[chatId] = (attempts[chatId] || 0) + 1;
    if (attempts[chatId] >= 3) {
      delete sessions[chatId];
      return bot.sendMessage(chatId, '🚫 *3 рет қате енгізінді! Бот бұғатталды. /start басыңыз.*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    delete sessions[chatId];
    return bot.sendMessage(chatId, `❌ *Логин немесе пароль қате!* (${attempts[chatId]}/3 әрекет)`, {
      parse_mode: 'Markdown',
      reply_markup: { keyboard: [['🔄 Қайталау'], ['🔑 Ұмыттым']], resize_keyboard: true }
    });
  }

  if (text === '🔄 Қайталау') {
    sessions[chatId] = { step: 'login' };
    return bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  if (text === '🔑 Ұмыттым') {
    sessions[chatId] = { step: 'reset_phone' };
    return bot.sendMessage(chatId, '📱 *Кафеңізге тіркелген WhatsApp / телефон нөмірін енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  // Құпия сөзді қалпына келтіру логикасы
  if (sessions[chatId]?.step === 'reset_phone') {
    const phone = text.replace(/\D/g, '');
    const cafe = await getCafe(chatId);
    if (!cafe || cafe.phone?.replace(/\D/g, '') !== phone) {
      delete sessions[chatId];
      return bot.sendMessage(chatId, '❌ *Бұл нөмір жүйеден табылмады!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
    sessions[chatId].resetCafeId = String(chatId);
    sessions[chatId].step = 'reset_check_number';
    return bot.sendMessage(chatId, `💰 *Құпия сөзді қалпына келтіру үшін ${RESET_PRICE} ₸ төлеңіз.*\nKaspi нөмір: \`${KASPI_NUMBER}\`\n\nТөлем жасаған соң, чек (квитанция) нөмірін осында жазыңыз:`, { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  if (sessions[chatId]?.step === 'reset_check_number') {
    const checkNum = text.trim();
    if (usedChecks.includes(checkNum)) {
      delete sessions[chatId];
      return bot.sendMessage(chatId, '❌ *Бұл чек нөмірі бұрын қолданылған!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
    usedChecks.push(checkNum);
    sessions[chatId].tempCheck = checkNum;
    sessions[chatId].step = 'reset_new_login';
    return bot.sendMessage(chatId, '✅ Чек расталды! Жаңа логинді енгізіңіз:', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  if (sessions[chatId]?.step === 'reset_new_login') {
    sessions[chatId].newLogin = text.trim();
    sessions[chatId].step = 'reset_new_password';
    return bot.sendMessage(chatId, '🔒 Жаңа парольді енгізіңіз:', { parse_mode: 'Markdown' });
  }

  if (sessions[chatId]?.step === 'reset_new_password') {
    await updateRealtimeAndFirestore(sessions[chatId].resetCafeId, {
      login: sessions[chatId].newLogin,
      password: text.trim()
    });
    delete sessions[chatId];
    return bot.sendMessage(chatId, '✅ *Құпия сөз бен логин сәтті өзгертілді!* Енді /start басып кіре аласыз.', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  if (text === '🚪 Шығу') {
    delete sessions[chatId];
    return bot.sendMessage(chatId, '👋 *Жүйеден сәтті шықтыңыз.*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
  }

  // ================== КАФЕ РӨЛІНІҢ ФУНКЦИЯЛАРЫ ==================
  if (sessions[chatId]?.role === 'cafe') {
    const cafeId = sessions[chatId].cafeId;

    if (text === '📋 Мәзірді көру') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Мәзіріңіз әзірге бос.*', { parse_mode: 'Markdown' });
      let res = '📋 *Кафе мәзірі:*\n\n';
      menu.forEach(item => res += `🔹 ID: ${item.id} | *${item.name_kk}* — ${item.price}₸ [${item.cat}]\n`);
      return bot.sendMessage(chatId, res, { parse_mode: 'Markdown' });
    }

    if (text === '➕ Тауар қосу') {
      sessions[chatId].step = 'add_name_kk';
      sessions[chatId].newItem = {};
      return bot.sendMessage(chatId, '📝 *Жаңа тауар атауын (Қазақша) енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (text === '✏️ Тауар өзгерту') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Өзгертетін тауар жоқ (мәзір бос).*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`✏️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'edit_select';
      return bot.sendMessage(chatId, '✏️ *Өзгерткіңіз келетін тауарды басыңыз:*', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    }

    if (text === '🗑️ Тауар жою') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Жоятын тауар жоқ.*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`🗑️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'delete_select';
      return bot.sendMessage(chatId, '🗑️ *Жойғыңыз келетін тауарды таңдаңыз:*', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    }

    if (text === '🖼️ Сурет жүктеу') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Тауарлар тізімі бос.*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`📸 ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'photo_select';
      return bot.sendMessage(chatId, '📸 *Сурет жүктейтін тауарды таңдаңыз:*', { parse_mode: 'Markdown', reply_markup: { keyboard: buttons, resize_keyboard: true } });
    }

    if (text === '🎨 Түстер') {
      sessions[chatId].step = 'theme_accent';
      sessions[chatId].theme = {};
      return bot.sendMessage(chatId, '🎨 *Сайттың акцент түсін енгізіңіз (мысалы: #e94560):*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (text === '🔗 QR код') {
      const cafe = await getCafe(chatId);
      const url = cafe?.siteUrl || `https://shargabaii.site`;
      try {
        const qrBuffer = await QRCode.toBuffer(url);
        return bot.sendPhoto(chatId, qrBuffer, { caption: `📱 *Сіздің сайт сілтемеңіз:* ${url}`, parse_mode: 'Markdown' });
      } catch (e) {
        return bot.sendMessage(chatId, '❌ QR код жасау қатесі орын алды.', { parse_mode: 'Markdown' });
      }
    }

    if (text === '📊 Статистика') {
      const cafe = await getCafe(chatId);
      const stats = cafe?.stats || { views: 0, orders: 0 };
      return bot.sendMessage(chatId, `📊 *Кафе статистикасы*\n👁️ Қаралымдар: ${stats.views}\n🛒 Тапсырыстар саны: ${stats.orders}`, { parse_mode: 'Markdown' });
    }

    if (text === '🔙 Артқа') {
      sessions[chatId].step = null;
      return bot.sendMessage(chatId, '🏪 *Басты мәзірге оралдыңыз:*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар қосу қадамдары ---
    if (sessions[chatId]?.step === 'add_name_kk') {
      sessions[chatId].newItem.name_kk = text.trim();
      sessions[chatId].step = 'add_name_ru';
      return bot.sendMessage(chatId, '📝 *Орысша атауын енгізіңіз:*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'add_name_ru') {
      sessions[chatId].newItem.name_ru = text.trim();
      sessions[chatId].step = 'add_desc_kk';
      return bot.sendMessage(chatId, '📝 *Қазақша сипаттамасын енгізіңіз:*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'add_desc_kk') {
      sessions[chatId].newItem.desc_kk = text.trim();
      sessions[chatId].step = 'add_desc_ru';
      return bot.sendMessage(chatId, '📝 *Орысша сипаттамасын енгізіңіз:*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'add_desc_ru') {
      sessions[chatId].newItem.desc_ru = text.trim();
      sessions[chatId].step = 'add_price';
      return bot.sendMessage(chatId, '💰 *Тауар бағасын енгізіңіз (тек сан):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'add_price') {
      sessions[chatId].newItem.price = parseInt(text.trim()) || 0;
      sessions[chatId].step = 'add_cat';
      return bot.sendMessage(chatId, '📂 *Категорияны таңдаңыз немесе жазыңыз:*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [['Сеттер'], ['Роллдар'], ['Сусындар'], ['Десерттер']], resize_keyboard: true }
      });
    }
    if (sessions[chatId]?.step === 'add_cat') {
      sessions[chatId].newItem.cat = text.trim();
      sessions[chatId].newItem.img = '';
      sessions[chatId].newItem.badges = [];

      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const newId = menu.length > 0 ? Math.max(...menu.map(i => i.id)) + 1 : 1;
      sessions[chatId].newItem.id = newId;

      menu.push(sessions[chatId].newItem);
      await updateRealtimeAndFirestore(cafeId, { menu });

      sessions[chatId].step = null;
      return bot.sendMessage(chatId, '✅ *Тауар мәзірге сәтті қосылды!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар өзгерту қадамдары ---
    if (sessions[chatId]?.step === 'edit_select' && text.startsWith('✏️')) {
      const id = parseInt(text.split('.')[0].replace('✏️ ', ''));
      const cafe = await getCafe(chatId);
      const item = cafe?.menu?.find(i => i.id === id);
      if (!item) return;

      sessions[chatId].editItemId = id;
      sessions[chatId].step = 'edit_new_name';
      return bot.sendMessage(chatId, `📝 *Жаңа қазақша атауын жазыңыз* (ескісі: ${item.name_kk}):`, { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
    if (sessions[chatId]?.step === 'edit_new_name') {
      sessions[chatId].editName = text.trim();
      sessions[chatId].step = 'edit_new_price';
      return bot.sendMessage(chatId, '💰 *Жаңа бағасын енгізіңіз (тек сан):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'edit_new_price') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const item = menu.find(i => i.id === sessions[chatId].editItemId);
      if (item) {
        item.name_kk = sessions[chatId].editName;
        item.price = parseInt(text.trim()) || item.price;
        await updateRealtimeAndFirestore(cafeId, { menu });
      }
      sessions[chatId].step = null;
      return bot.sendMessage(chatId, '✅ *Тауар сәтті өзгертілді!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар жою қадамы ---
    if (sessions[chatId]?.step === 'delete_select' && text.startsWith('🗑️')) {
      const id = parseInt(text.split('.')[0].replace('🗑️ ', ''));
      const cafe = await getCafe(chatId);
      const menu = (cafe?.menu || []).filter(i => i.id !== id);
      await updateRealtimeAndFirestore(cafeId, { menu });
      sessions[chatId].step = null;
      return bot.sendMessage(chatId, '✅ *Тауар мәзірден өшірілді!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Түстерді өзгерту қадамдары ---
    if (sessions[chatId]?.step === 'theme_accent') {
      sessions[chatId].theme.accent = text.trim();
      sessions[chatId].step = 'theme_bg';
      return bot.sendMessage(chatId, '🎨 Фон түсін енгізіңіз (HEX, мысалы: #0d0d1a):', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_bg') {
      sessions[chatId].theme.bg = text.trim();
      sessions[chatId].step = 'theme_card';
      return bot.sendMessage(chatId, '🎨 Карта түсін енгізіңіз (HEX):', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_card') {
      sessions[chatId].theme.card = text.trim();
      sessions[chatId].step = 'theme_text';
      return bot.sendMessage(chatId, '🎨 Мәтін түсін енгізіңіз (HEX):', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_text') {
      sessions[chatId].theme.text = text.trim();
      await updateRealtimeAndFirestore(cafeId, { theme: sessions[chatId].theme });
      sessions[chatId].step = null;
      return bot.sendMessage(chatId, '✅ *Түстер сәтті сақталды!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Сурет таңдау ---
    if (sessions[chatId]?.step === 'photo_select' && text.startsWith('📸')) {
      const id = parseInt(text.split('.')[0].replace('📸 ', ''));
      sessions[chatId].photoItemId = id;
      sessions[chatId].step = 'photo_upload';
      return bot.sendMessage(chatId, '📸 *Осы тауардың суретін фото ретінде жіберіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
  }

  // ================== СУПЕР-АДМИН РӨЛІ ==================
  if (sessions[chatId]?.role === 'superadmin') {
    if (text === '📋 Барлық кафелер') {
      const snap = await db.collection('cafes').get();
      let list = '📋 *Тіркелген кафелер тізімі:*\n\n';
      snap.forEach(doc => {
        const d = doc.data();
        list += `🔹 ${d.name || 'Атаусыз'} | Логин: \`${d.login}\`\n`;
      });
      return bot.sendMessage(chatId, list, { parse_mode: 'Markdown' });
    }
    if (text === '📊 Статистика') {
      const snap = await db.collection('cafes').get();
      return bot.sendMessage(chatId, `📊 *Жалпы жүйе статистикасы*\n👥 Барлық кафелер саны: ${snap.size}`, { parse_mode: 'Markdown' });
    }
  }

  // ================== DEEPSEEK AI КӨМЕКШІСІ ==================
  if (!text.startsWith('/')) {
    try {
      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: text }]
      }, { headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` } });

      const reply = response.data.choices[0].message.content;
      return bot.sendMessage(chatId, reply, { parse_mode: 'Markdown', ...getHomeButton() });
    } catch (err) {
      return bot.sendMessage(chatId, '❌ AI жауап беру кезінде қате орын алды.', { parse_mode: 'Markdown', ...getHomeButton() });
    }
  }
});

// ================== СУРЕТТІ ҚАБЫЛДАУ ЖӘНЕ КАНАЛҒА ЖІБЕРУ ==================
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (sessions[chatId]?.step !== 'photo_upload') return;

  try {
    const fileId = msg.photo[msg.photo.length - 1].file_id;
    const sent = await bot.sendPhoto(PHOTO_CHANNEL_ID, fileId);
    const link = `https://t.me/${PHOTO_CHANNEL_USERNAME}/${sent.message_id}`;

    const cafe = await getCafe(chatId);
    const menu = cafe?.menu || [];
    const item = menu.find(i => i.id === sessions[chatId].photoItemId);
    
    if (item) {
      item.img = link;
      await updateRealtimeAndFirestore(String(chatId), { menu });
    }

    sessions[chatId].step = null;
    return bot.sendMessage(chatId, `✅ *Сурет сәтті жүктелді!*\n🔗 Сілтеме: ${link}`, { parse_mode: 'Markdown', ...getCafeKeyboard() });
  } catch (e) {
    return bot.sendMessage(chatId, '❌ Суретті өңдеу кезінде қате шықты.', { parse_mode: 'Markdown', ...getCafeKeyboard() });
  }
});

// ================== PDF ЧЕКТЕРДІ ТЕКСЕРУ ==================
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.document.mime_type !== 'application/pdf') {
    return bot.sendMessage(chatId, '❌ Тек PDF форматындағы чектер қабылданады.', { parse_mode: 'Markdown' });
  }

  try {
    const file = await bot.getFile(msg.document.file_id);
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    
    const pdfData = await pdfParse(res.data);
    const match = pdfData.text.match(/\b(\d[\d\s]*\d)\b/);
    
    if (!match) return bot.sendMessage(chatId, '❌ Чек ішінен төлем сомасы табылмады.', { parse_mode: 'Markdown' });

    const amount = parseInt(match[0].replace(/\s/g, ''));
    if (amount >= RESET_PRICE) {
      return bot.sendMessage(chatId, '✅ *Төлем сәтті қабылданды!*', { parse_mode: 'Markdown', ...getHomeButton() });
    } else {
      return bot.sendMessage(chatId, `❌ Төлем сомасы аз: ${amount} ₸. Кемінде ${RESET_PRICE} ₸ қажет.`, { parse_mode: 'Markdown', ...getHomeButton() });
    }
  } catch (e) {
    return bot.sendMessage(chatId, '❌ PDF файлын оқу кезінде қате орын алды.', { parse_mode: 'Markdown', ...getHomeButton() });
  }
});

// ================== 0️⃣ БАТЫРМАСЫ (CALLBACK QUERY) ==================
bot.on('callback_query', async (query) => {
  const chatId = query.message.chat.id;
  if (query.data === 'home') {
    await bot.answerCallbackQuery(query.id);
    sessions[chatId].step = null;
    if (sessions[chatId]?.role === 'superadmin') {
      return bot.sendMessage(chatId, '👑 *Супер-админ панелі*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
    } else if (sessions[chatId]?.role === 'cafe') {
      return bot.sendMessage(chatId, '🏪 *Кафе басқару панелі*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    } else {
      return bot.sendMessage(chatId, '🍽️ *Басты бет*', { parse_mode: 'Markdown', reply_markup: { keyboard: [['🚪 Кіру']], resize_keyboard: true } });
    }
  }
});

console.log('🚀 Бот 100% дайын күйде іске қосылды!');