const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const pdfParse = require('pdf-parse');
const axios = require('axios');
const sharp = require('sharp');

// ================== ҚҰПИЯЛАР (МҰНДА ТҰР) ==================
const BOT_TOKEN = '8981884335:AAEOSGxNZCYppIiehOmhO6TCONpiOfdda9Y';
const SUPER_ADMIN_ID = 7662045200;
const KASPI_NUMBER = '+77473243971';
const DEEPSEEK_API_KEY = 'sk-878af99b038144749008bb29af47df7c';
const PHOTO_CHANNEL_ID = -1003945346272;
const PHOTO_CHANNEL_USERNAME = 'shargabaisitebot';
const SUPER_ADMIN_LOGIN = 'superadmin';
const SUPER_ADMIN_PASS = 'SHARGA2026';
const RESET_PRICE = 5000;

// ================== FIREBASE КОНФИГУРАЦИЯСЫ ==================
const serviceAccount = {
  "type": "service_account",
  "project_id": "shargabaiisite",
  "private_key_id": "431bf4b8cd2cf11f8fd0de7355007742c63dff43",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhrVkLv/QhRdId\nhNmNYp4loYJvHQ4YuQqqF8LVGyKoJyrN7R6s2XrgpyRbm3/zCBPchwygHqCU/B47\nd6fi7YwNsUH/Hd4RGmNxMZt4sQS/a/B9y/2CMiBAc1FvskaBQa/wXuIYGAbUT6DP\nfc8qas7XmuNV6dLyVEGs1ECabqYrXF3T0FX4oOaahBFVEzIIM6i8sLi+CBNQaWjl\nFYnxwhTURCkvTv8H0bn7K+o1+YD+yJsGah9hZLgpx1RZH0ipUH/dEOmuTh9iF1ru\nVqF6C9rHHoguCmRcrk1pb6dTRVv4DYykQzbx3nV1LiTUHRE+8xAHXP1a5WhFSvx0\nVpDx2lifAgMBAAECggEAGYhPPBu/jHQlzYkrmT9rEmmEzvrD5DArRgs3fnzPcvmG\nHOjoQONqGjikIxPOFLpOj54H46W+F/JeSUQZuSbpuDLce0yZxJLuZUQY3ugdgrq8\n6WlG3pAP7hAd9TvU65LO9lcF0CFdGcWDNXZ6axt3w2pBW4WqLsMxmv14lwBQdInh\nqhpKGn18uAUADaY5ikD4h6XYw2yLQygWMJ6ie9+ZzBWfexVr6+AbbCPEmANWM+5M\nM+mwzpPX1BWdLIVwemUbUyF7MML+/DHocVEHrBLVQMuzbAFZof+mwrKRkqt354ac\n5zFlCjbYFL79CA0BH/PC8BSVeDUktP4jE5zir6ZX4QKBgQDzCOa1r9mCWEcpao7z\n/6ymDnqTxwGG7M8SYblD19PeQFlvPKxLwzX4s70Ev0NYGFjlZ1uht5Cu4HnzotMd\nuFETUcixzxXH9XIQ0R5kY50GTuwD0/NcqQL5lvCINzEIZuybJUxErWsLAZG9cLRt\nLEy/+FITmRmZMoNpxZO6DT4JVQKBgQDtt2U5AEm+Y5mSVntW6/HyCmIjuWLBbn1V\n4+nFHfSlfJjkLvTEzv0BQk4j5QN3yH8Um2aH37Zx4U5BSeMgrmww67KGVHzN2qNh\nS+TtaL+2ptgBQTRYAlg1T+VPQ/SoWhN8gUd0DaCWwFZSzECBAdzDqGa+x3XUhhdB\nyPTMyvrKIwKBgBbgep8Vm3rahnBOmIA9S+ohqMYqUGl79w365u6M7WOZWRHQe0Ny\nb60mdh9xRYyQViXZ8dUqK1Nay//0Dr1YcUFJTIP4Q0ucPg15McwvWEOUwECn/dt2\nCVKnM6MO1u28in8cJq68SDwz/J0Bc+pm5h6X6Fnx6mfySk51i69Suck1AoGAWJkj\n5uzOj2E72ajV632g/V8VWM89mW5+1EZP2KHjjtIzgchmffvPnGqECSjP9BMMGjgZ\nLMcajrM0oWzSdFnOBSWzshFHOsokXp0Uw89otMDWfRE6Wxr0mVof0z02sJBx9tOQ\nOBbkJYumINHzsKFrEJlxQeXBauZXQLOPWczFUBUCgYEArhlqNpaRV9vTshW0fwTC\ntpSMXW/UPutXY4P1bnjvo8qKtq1i0dN37YT9X2wzjegKi9YMLYoH3WgvK9jbq1W1\nLkMDpKS4JHD0C+/hrG72GUqzyWNVxPZyuX3qKlsdT3Yl4/staVe0WD45hbvomwFp\neESWlaJEYaDsx0co8e5rhZI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@shargabaiisite.iam.gserviceaccount.com",
  "client_id": "104903887535443706109",
  "auth_uri": "https://accounts.google.com/o/oauth2/auth",
  "token_uri": "https://oauth2.googleapis.com/token",
  "auth_provider_x509_cert_url": "https://www.googleapis.com/oauth2/v1/certs",
  "client_x509_cert_url": "https://www.googleapis.com/robot/v1/metadata/x509/firebase-adminsdk-fbsvc%40shargabaiisite.iam.gserviceaccount.com"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount)
});
const db = admin.firestore();

// ================== БОТТЫ ІСКЕ ҚОСУ ==================
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================== ДЕРЕКТІ САҚТАУ ҚҰРЫЛЫМДАРЫ ==================
const sessions = {};        // Әр пайдаланушының сессиясы
const attempts = {};        // Қате әрекеттер саны
const usedChecks = [];      // Қолданылған чек нөмірлері

// ================== КӨМЕКШІ ФУНКЦИЯЛАР ==================

// 0 батырмасы
function getHomeButton() {
  return {
    reply_markup: {
      inline_keyboard: [[{ text: '0️⃣ Басты панельге оралу', callback_data: 'home' }]]
    }
  };
}

// Кафе мәзірінің клавиатурасы
function getCafeKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['📋 Мәзірді көру', '➕ Тауар қосу'],
        ['✏️ Тауар өзгерту', '🗑️ Тауар жою'],
        ['🖼️ Сурет жүктеу', '🎨 Түстер'],
        ['🔗 QR код', '📊 Статистика'],
        ['🚪 Шығу']
      ],
      resize_keyboard: true
    }
  };
}

// Супер-админ клавиатурасы
function getSuperKeyboard() {
  return {
    reply_markup: {
      keyboard: [
        ['📋 Барлық кафелер', '➕ Кафе қосу'],
        ['🗑️ Кафе өшіру', '📊 Статистика'],
        ['🚪 Шығу']
      ],
      resize_keyboard: true
    }
  };
}

// Клавиатураны өшіру
function removeKeyboard() {
  return { reply_markup: { remove_keyboard: true } };
}

// Кафе деректерін алу
async function getCafe(chatId) {
  const doc = await db.collection('cafes').doc(String(chatId)).get();
  return doc.exists ? doc.data() : null;
}

// Кафе мәзірін жаңарту
async function updateMenu(chatId, newMenu) {
  await db.collection('cafes').doc(String(chatId)).update({ menu: newMenu });
}

// ================== /START КОМАНДАСЫ ==================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = {};
  attempts[chatId] = 0;
  bot.sendMessage(chatId, '🍽️ *Shargabaii.site — Кафе басқару боты*\n\nҚош келдіңіз!', {
    parse_mode: 'Markdown',
    reply_markup: { keyboard: [['🚪 Кіру']], resize_keyboard: true }
  });
});

// ================== НЕГІЗГІ ХАБАРЛАМА ӨҢДЕГІШ ==================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  // Егер пайдаланушы әлі тіркелмеген болса
  if (!sessions[chatId]) {
    sessions[chatId] = {};
  }

  // ============= АНЫҚТАМА / АҚПАРАТ =============
  if (text === 'ℹ️ Анықтама') {
    bot.sendMessage(chatId, `📋 *Кафе басқару боты*\n\n• Тауарлар, суреттер, түстер\n• Статистика, QR код\n📢 Жарнама: ${KASPI_NUMBER}`, { parse_mode: 'Markdown' });
    return;
  }

  // ============= КІРУ (ЛОГИН) =============
  if (text === '🚪 Кіру') {
    sessions[chatId] = { step: 'login' };
    bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', ...removeKeyboard() });
    return;
  }

  // Логин қабылдау
  if (sessions[chatId]?.step === 'login') {
    sessions[chatId].login = text.trim();
    sessions[chatId].step = 'password';
    bot.sendMessage(chatId, '🔒 *Парольді енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  // Пароль қабылдау және тексеру
  if (sessions[chatId]?.step === 'password') {
    const login = sessions[chatId].login;
    const pass = text.trim();

    // 1. Супер-админ тексеру
    if (login === SUPER_ADMIN_LOGIN && pass === SUPER_ADMIN_PASS) {
      sessions[chatId] = { role: 'superadmin' };
      attempts[chatId] = 0;
      bot.sendMessage(chatId, '👑 *Супер-админ панелі*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
      return;
    }

    // 2. Кафе тексеру (Firebase-тен)
    const cafe = await getCafe(chatId);
    if (cafe && cafe.login === login && cafe.password === pass) {
      sessions[chatId] = { role: 'cafe', cafeId: String(chatId), cafeName: cafe.name || 'Кафе' };
      attempts[chatId] = 0;
      bot.sendMessage(chatId, `🏪 *${sessions[chatId].cafeName}*`, { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // 3. Қате әрекет
    attempts[chatId] = (attempts[chatId] || 0) + 1;
    const a = attempts[chatId];
    if (a >= 3) {
      delete sessions[chatId];
      bot.sendMessage(chatId, '🚫 *3 рет қате жібердіңіз! Бұғатталды!*', { parse_mode: 'Markdown' });
      return;
    }
    bot.sendMessage(chatId, `❌ *Қате!* (${a}/3)`, {
      parse_mode: 'Markdown',
      reply_markup: { keyboard: [['🔄 Қайталау'], ['🔑 Ұмыттым']], resize_keyboard: true }
    });
    delete sessions[chatId];
    return;
  }

  // ============= ҚАЙТАЛАУ / ҰМЫТТЫМ =============
  if (text === '🔄 Қайталау') {
    sessions[chatId] = { step: 'login' };
    bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', ...removeKeyboard() });
    return;
  }

  if (text === '🔑 Ұмыттым') {
    sessions[chatId] = { step: 'reset_phone' };
    bot.sendMessage(chatId, '📱 *WhatsApp нөміріңізді енгізіңіз (мысалы: 87001234567):*', { parse_mode: 'Markdown', ...removeKeyboard() });
    return;
  }

  // ============= ҚҰПИЯ СӨЗДІ ҚАЛПЫНА КЕЛТІРУ =============
  if (sessions[chatId]?.step === 'reset_phone') {
    const phone = text.replace(/\D/g, '');
    const cafe = await getCafe(chatId);
    if (!cafe || cafe.phone?.replace(/\D/g, '') !== phone) {
      bot.sendMessage(chatId, '❌ *Нөмір табылмады!*', { parse_mode: 'Markdown' });
      delete sessions[chatId];
      return;
    }
    sessions[chatId].resetCafeId = String(chatId);
    sessions[chatId].step = 'reset_check';
    bot.sendMessage(chatId, `💰 *${RESET_PRICE} ₸* Kaspi: ${KASPI_NUMBER}\n\nЧек скриншотын жіберіңіз.`, { parse_mode: 'Markdown', ...removeKeyboard() });
    return;
  }

  // ============= ЧЕКТІ ҚАБЫЛДАУ =============
  if (sessions[chatId]?.step === 'reset_check' && msg.photo) {
    sessions[chatId].step = 'reset_check_number';
    bot.sendMessage(chatId, '📝 *Чек нөмірін енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'reset_check_number') {
    const checkNum = text.trim();
    if (usedChecks.includes(checkNum)) {
      bot.sendMessage(chatId, '❌ *Бұл чек қолданылған!*', { parse_mode: 'Markdown' });
      delete sessions[chatId];
      return;
    }
    usedChecks.push(checkNum);
    sessions[chatId].step = 'reset_new_login';
    bot.sendMessage(chatId, '👤 *Жаңа логинді енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'reset_new_login') {
    sessions[chatId].newLogin = text.trim();
    sessions[chatId].step = 'reset_new_password';
    bot.sendMessage(chatId, '🔒 *Жаңа парольді енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'reset_new_password') {
    const newPass = text.trim();
    await db.collection('cafes').doc(sessions[chatId].resetCafeId).update({
      login: sessions[chatId].newLogin,
      password: newPass
    });
    bot.sendMessage(chatId, '✅ *Құпия сөз сәтті жаңартылды!*', { parse_mode: 'Markdown' });
    delete sessions[chatId];
    return;
  }

  // ============= ШЫҒУ =============
  if (text === '🚪 Шығу') {
    delete sessions[chatId];
    bot.sendMessage(chatId, '👋 *Сау бол!*', { parse_mode: 'Markdown', ...removeKeyboard() });
    return;
  }

  // ============= 0 БАТЫРМАСЫ (callback арқылы өңделеді) =============

  // ============= КАФЕ ФУНКЦИЯЛАРЫ (Тек кафе рөлінде) =============
  if (sessions[chatId]?.role === 'cafe') {
    // Мәзірді көру
    if (text === '📋 Мәзірді көру') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) {
        bot.sendMessage(chatId, '📭 *Мәзір бос*', { parse_mode: 'Markdown' });
        return;
      }
      let msg = '📋 *Мәзір:*\n\n';
      menu.forEach((item, i) => {
        msg += `${i+1}. ${item.name_kk} — ${item.price}₸\n`;
      });
      bot.sendMessage(chatId, msg, { parse_mode: 'Markdown' });
      return;
    }

    // Тауар қосу
    if (text === '➕ Тауар қосу') {
      sessions[chatId].step = 'add_name_kk';
      bot.sendMessage(chatId, '📝 *Қазақша атауын енгізіңіз:*', { parse_mode: 'Markdown', ...removeKeyboard() });
      return;
    }

    // Тауар өзгерту
    if (text === '✏️ Тауар өзгерту') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) {
        bot.sendMessage(chatId, '📭 *Мәзір бос*', { parse_mode: 'Markdown' });
        return;
      }
      const buttons = menu.map(item => [`✏️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'edit_select';
      bot.sendMessage(chatId, '✏️ *Қай тауарды өзгертесіз?*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
      return;
    }

    // Тауар жою
    if (text === '🗑️ Тауар жою') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) {
        bot.sendMessage(chatId, '📭 *Мәзір бос*', { parse_mode: 'Markdown' });
        return;
      }
      const buttons = menu.map(item => [`🗑️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'delete_select';
      bot.sendMessage(chatId, '🗑️ *Қай тауарды жоясыз?*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
      return;
    }

    // Сурет жүктеу
    if (text === '🖼️ Сурет жүктеу') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) {
        bot.sendMessage(chatId, '📭 *Мәзір бос*', { parse_mode: 'Markdown' });
        return;
      }
      const buttons = menu.map(item => [`📸 ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'photo_select';
      bot.sendMessage(chatId, '📸 *Қай тауарға сурет жүктегіңіз келеді?*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
      return;
    }

    // Түстер
    if (text === '🎨 Түстер') {
      sessions[chatId].step = 'theme_accent';
      bot.sendMessage(chatId, '🎨 *Екпін түстің хэш-кодын енгізіңіз (мысалы: #e94560):*', { parse_mode: 'Markdown', ...removeKeyboard() });
      return;
    }

    // QR код
    if (text === '🔗 QR код') {
      const cafe = await getCafe(chatId);
      const url = cafe?.siteUrl || 'https://sizdin_sayt.kz';
      const qr = await QRCode.toDataURL(url);
      bot.sendPhoto(chatId, qr, { caption: `📱 *${url}*`, parse_mode: 'Markdown' });
      return;
    }

    // Статистика
    if (text === '📊 Статистика') {
      const cafe = await getCafe(chatId);
      const stats = cafe?.stats || { views: 0, orders: 0 };
      bot.sendMessage(chatId, `📊 *Статистика*\n👁️ Қаралым: ${stats.views}\n🛒 Тапсырыс: ${stats.orders}`, { parse_mode: 'Markdown' });
      return;
    }

    // Артқа
    if (text === '🔙 Артқа') {
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // ============= ТАУАР ҚОСУ ҚАДАМДАРЫ =============
    if (sessions[chatId]?.step === 'add_name_kk') {
      sessions[chatId].newItem = { name_kk: text.trim(), img: '', badges: [] };
      sessions[chatId].step = 'add_name_ru';
      bot.sendMessage(chatId, '📝 *Орысша атауын енгізіңіз:*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'add_name_ru') {
      sessions[chatId].newItem.name_ru = text.trim();
      sessions[chatId].step = 'add_desc_kk';
      bot.sendMessage(chatId, '📝 *Қазақша сипаттамасын енгізіңіз:*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'add_desc_kk') {
      sessions[chatId].newItem.desc_kk = text.trim();
      sessions[chatId].step = 'add_desc_ru';
      bot.sendMessage(chatId, '📝 *Орысша сипаттамасын енгізіңіз:*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'add_desc_ru') {
      sessions[chatId].newItem.desc_ru = text.trim();
      sessions[chatId].step = 'add_price';
      bot.sendMessage(chatId, '💰 *Бағасын енгізіңіз (тек сан):*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'add_price') {
      sessions[chatId].newItem.price = parseInt(text.trim());
      sessions[chatId].step = 'add_cat';
      bot.sendMessage(chatId, '📂 *Категорияны таңдаңыз:*', {
        parse_mode: 'Markdown',
        reply_markup: {
          keyboard: [['Сеттер'], ['Гункандар'], ['Роллдар'], ['Пиццалар'], ['Сусындар'], ['Десерттер']],
          resize_keyboard: true
        }
      });
      return;
    }
    if (sessions[chatId]?.step === 'add_cat') {
      sessions[chatId].newItem.cat = text.trim();
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const newId = menu.length > 0 ? Math.max(...menu.map(i => i.id)) + 1 : 1;
      sessions[chatId].newItem.id = newId;
      menu.push(sessions[chatId].newItem);
      await db.collection('cafes').doc(String(chatId)).update({ menu });
      bot.sendMessage(chatId, '✅ *Тауар сәтті қосылды!*', { parse_mode: 'Markdown' });
      delete sessions[chatId].step;
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // ============= ТАУАР ӨЗГЕРТУ ҚАДАМДАРЫ =============
    if (sessions[chatId]?.step === 'edit_select' && text?.startsWith('✏️')) {
      const id = parseInt(text.split('.')[0].replace('✏️ ', ''));
      const cafe = await getCafe(chatId);
      const item = cafe?.menu?.find(i => i.id === id);
      if (!item) return;
      sessions[chatId].editItemId = id;
      sessions[chatId].step = 'edit_name_kk';
      bot.sendMessage(chatId, `📝 *Жаңа қазақша атауы (қазіргі: ${item.name_kk}):*`, { parse_mode: 'Markdown', ...removeKeyboard() });
      return;
    }
    if (sessions[chatId]?.step === 'edit_name_kk') {
      sessions[chatId].editData = { name_kk: text.trim() };
      sessions[chatId].step = 'edit_name_ru';
      bot.sendMessage(chatId, '📝 *Жаңа орысша атауы:*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'edit_name_ru') {
      sessions[chatId].editData.name_ru = text.trim();
      sessions[chatId].step = 'edit_price';
      bot.sendMessage(chatId, '💰 *Жаңа бағасы:*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'edit_price') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const item = menu.find(i => i.id === sessions[chatId].editItemId);
      if (item) {
        item.name_kk = sessions[chatId].editData.name_kk;
        item.name_ru = sessions[chatId].editData.name_ru;
        item.price = parseInt(text.trim());
        await db.collection('cafes').doc(String(chatId)).update({ menu });
      }
      bot.sendMessage(chatId, '✅ *Тауар сәтті өзгертілді!*', { parse_mode: 'Markdown' });
      delete sessions[chatId].step;
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // ============= ТАУАР ЖОЮ ҚАДАМДАРЫ =============
    if (sessions[chatId]?.step === 'delete_select' && text?.startsWith('🗑️')) {
      const id = parseInt(text.split('.')[0].replace('🗑️ ', ''));
      const cafe = await getCafe(chatId);
      const menu = (cafe?.menu || []).filter(i => i.id !== id);
      await db.collection('cafes').doc(String(chatId)).update({ menu });
      bot.sendMessage(chatId, '✅ *Тауар сәтті жойылды!*', { parse_mode: 'Markdown' });
      delete sessions[chatId].step;
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // ============= ТҮСТЕР ҚАДАМДАРЫ =============
    if (sessions[chatId]?.step === 'theme_accent') {
      sessions[chatId].theme = { accent: text.trim() };
      sessions[chatId].step = 'theme_bg';
      bot.sendMessage(chatId, '🎨 *Фон түсі (мысалы: #0d0d1a):*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'theme_bg') {
      sessions[chatId].theme.bg = text.trim();
      sessions[chatId].step = 'theme_card';
      bot.sendMessage(chatId, '🎨 *Карта түсі (мысалы: #1a1a2e):*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'theme_card') {
      sessions[chatId].theme.card = text.trim();
      sessions[chatId].step = 'theme_text';
      bot.sendMessage(chatId, '🎨 *Мәтін түсі (мысалы: #e8e8e8):*', { parse_mode: 'Markdown' });
      return;
    }
    if (sessions[chatId]?.step === 'theme_text') {
      sessions[chatId].theme.text = text.trim();
      await db.collection('cafes').doc(String(chatId)).update({ theme: sessions[chatId].theme });
      bot.sendMessage(chatId, '✅ *Түстер сәтті сақталды!*', { parse_mode: 'Markdown' });
      delete sessions[chatId].step;
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    // ============= СУРЕТ ЖҮКТЕУ ҚАДАМДАРЫ =============
    if (sessions[chatId]?.step === 'photo_select' && text?.startsWith('📸')) {
      const id = parseInt(text.split('.')[0].replace('📸 ', ''));
      sessions[chatId].photoItemId = id;
      sessions[chatId].step = 'photo_upload';
      bot.sendMessage(chatId, '📸 *Суретті жіберіңіз:*', { parse_mode: 'Markdown', ...removeKeyboard() });
      return;
    }
  }

  // ============= AI-КӨМЕКШІ (DeepSeek) =============
  if (!text.startsWith('/')) {
    try {
      const response = await axios.post('https://api.deepseek.com/chat/completions', {
        model: 'deepseek-chat',
        messages: [{ role: 'user', content: text }]
      }, {
        headers: { 'Authorization': `Bearer ${DEEPSEEK_API_KEY}` }
      });
      const answer = response.data.choices[0].message.content;
      bot.sendMessage(chatId, answer, { parse_mode: 'Markdown', ...getHomeButton() });
    } catch (e) {
      bot.sendMessage(chatId, '❌ AI-мен байланыс орнату сәтсіз. Кейінірек қайталаңыз.', { parse_mode: 'Markdown', ...getHomeButton() });
    }
    return;
  }
});

// ================== СУРЕТТІ ӨҢДЕУ (Photo) ==================
bot.on('photo', async (msg) => {
  const chatId = msg.chat.id;
  if (sessions[chatId]?.step !== 'photo_upload') return;

  const fileId = msg.photo[msg.photo.length - 1].file_id;
  const file = await bot.getFile(fileId);
  const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

  // Суретті топқа жіберу
  const sent = await bot.sendPhoto(PHOTO_CHANNEL_ID, fileId);
  const link = `https://t.me/${PHOTO_CHANNEL_USERNAME}/${sent.message_id}`;

  // Тауарға сілтемені сақтау
  const cafe = await getCafe(chatId);
  const menu = cafe?.menu || [];
  const item = menu.find(i => i.id === sessions[chatId].photoItemId);
  if (item) {
    item.img = link;
    await db.collection('cafes').doc(String(chatId)).update({ menu });
  }
  bot.sendMessage(chatId, `✅ *Сурет сақталды!*\n🔗 Сілтеме: ${link}`, { parse_mode: 'Markdown', ...getHomeButton() });
  delete sessions[chatId].step;
  bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
});

// ================== PDF ӨҢДЕУ (Чек) ==================
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.document.mime_type !== 'application/pdf') {
    bot.sendMessage(chatId, '❌ Тек PDF файл қабылданады.', { parse_mode: 'Markdown' });
    return;
  }

  const file = await bot.getFile(msg.document.file_id);
  const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;

  try {
    const response = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfData = await pdfParse(response.data);
    const text = pdfData.text;
    const match = text.match(/\b(\d[\d\s]*\d)\b/);
    if (!match) {
      bot.sendMessage(chatId, '❌ Чекте сома табылмады.', { parse_mode: 'Markdown' });
      return;
    }
    const amount = parseInt(match[0].replace(/\s/g, ''));
    if (amount >= 5000) {
      bot.sendMessage(chatId, '✅ *Төлем қабылданды!*', { parse_mode: 'Markdown' });
    } else {
      bot.sendMessage(chatId, `❌ Төлем сомасы ${amount} тг. 5000 тг қажет.`, { parse_mode: 'Markdown' });
    }
  } catch (e) {
    bot.sendMessage(chatId, '❌ PDF оқу қатесі.', { parse_mode: 'Markdown' });
  }
});

// ================== 0 БАТЫРМАСЫ (Callback) ==================
bot.on('callback_query', async (callback) => {
  const chatId = callback.message.chat.id;
  if (callback.data === 'home') {
    await bot.answerCallbackQuery(callback.id);
    if (sessions[chatId]?.role === 'superadmin') {
      bot.sendMessage(chatId, '👑 *Супер-админ панелі*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
    } else {
      bot.sendMessage(chatId, '🏪 *Басты мәзір*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }
  }
});

// ================== БОТТЫ ІСКЕ ҚОСУ ==================
console.log('🤖 Shargabaii.site боты толық нұсқада іске қосылды!');