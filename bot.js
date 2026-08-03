require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const admin = require('firebase-admin');
const QRCode = require('qrcode');
const pdfParse = require('pdf-parse');
const axios = require('axios');

// ================== ҚҰПИЯЛАР ==================
const BOT_TOKEN = '8981884335:AAEOSGxNZCYppIiehOmhO6TCONpiOfdda9Y';
const SUPER_ADMIN_ID = 7662045200;
const KASPI_NUMBER = '+77473243971';
const PHOTO_CHANNEL_ID = -1003945346272;
const PHOTO_CHANNEL_USERNAME = 'shargabaisitebot';
const SUPER_ADMIN_LOGIN = 'superadmin';
const SUPER_ADMIN_PASS = 'SHARGA2026';
const RESET_PRICE = 5000;

// ================== FIREBASE (Firestore + Realtime) ==================
const serviceAccount = {
  "type": "service_account",
  "project_id": "shargabaiisite",
  "private_key_id": "431bf4b8cd2cf11f8fd0de7355007742c63dff43",
  "private_key": "-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQDhrVkLv/QhRdId\nhNmNYp4loYJvHQ4YuQqqF8LVGyKoJyrN7R6s2XrgpyRbm3/zCBPchwygHqCU/B47\nd6fi7YwNsUH/Hd4RGmNxMZt4sQS/a/B9y/2CMiBAc1FvskaBQa/wXuIYGAbUT6DP\nfc8qas7XmuNV6dLyVEGs1ECabqYrXF3T0FX4oOaahBFVEzIIM6i8sLi+CBNQaWjl\nFYnxwhTURCkvTv8H0bn7K+o1+YD+yJsGah9hZLgpx1RZH0ipUH/dEOmuTh9iF1ru\nVqF6C9rHHoguCmRcrk1pb6dTRVv4DYykQzbx3nV1LiTUHRE+8xAHXP1a5WhFSvx0\nVpDx2lifAgMBAAECggEAGYhPPBu/jHQlzYkrmT9rEmmEzvrD5DArRgs3fnzPcvmG\nHOjoQONqGjikIxPOFLpOj54H46W+F/JeSUQZuSbpuDLce0yZxJLuZUQY3ugdgrq8\n6WlG3pAP7hAd9TvU65LO9lcF0CFdGcWDNXZ6axt3w2pBW4WqLsMxmv14lwBQdInh\nqhpKGn18uAUADaY5ikD4h6XYw2yLQygWMJ6ie9+ZzBWfexVr6+AbbCPEmANWM+5M\nM+mwzpPX1BWdLIVwemUbUyF7MML+/DHocVEHrBLVQMuzbAFZof+mwrKRkqt354ac\n5zFlCjbYFL79CA0BH/PC8BSVeDUktP4jE5zir6ZX4QKBgQDzCOa1r9mCWEcpao7z\n/6ymDnqTxwGG7M8SYblD19PeQFlvPKxLwzX4s70Ev0NYGFjlZ1uht5Cu4HnzotMd\nuFETUcixzxXH9XIQ0R5kY50GTuwD0/NcqQL5lvCINzEIZuybJUxErWsLAZG9cLRt\LEy/+FITmRmZMoNpxZO6DT4JVQKBgQDtt2U5AEm+Y5mSVntW6/HyCmIjuWLBbn1V\4+nFHfSlfJjkLvTEzv0BQk4j5QN3yH8Um2aH37Zx4U5BSeMgrmww67KGVHzN2qNh\S+TtaL+2ptgBQTRYAlg1T+VPQ/SoWhN8gUd0DaCWwFZSzECBAdzDqGa+x3XUhhdB\nyPTMyvrKIwKBgBbgep8Vm3rahnBOmIA9S+ohqMYqUGl79w365u6M7WOZWRHQe0Ny\nb60mdh9xRYyQViXZ8dUqK1Nay//0Dr1YcUFJTIP4Q0ucPg15McwvWEOUwECn/dt2\nCVKnM6MO1u28in8cJq68SDwz/J0Bc+pm5h6X6Fnx6mfySk51i69Suck1AoGAWJkj\n5uzOj2E72ajV632g/V8VWM89mW5+1EZP2KHjjtIzgchmffvPnGqECSjP9BMMGjgZ\nLMcajrM0oWzSdFnOBSWzshFHOsokXp0Uw89otMDWfRE6Wxr0mVof0z02sJBx9tOQ\nOBbkJYumINHzsKFrEJlxQeXBauZXQLOPWczFUBUCgYEArhlqNpaRV9vTshW0fwTC\ntpSMXW/UPutXY4P1bnjvo8qKtq1i0dN37YT9X2wzjegKi9YMLYoH3WgvK9jbq1W1\nLkMDpKS4JHD0C+/hrG72GUqzyWNVxPZyuX3qKlsdT3Yl4/staVe0WD45hbvomwFp\neESWlaJEYaDsx0co8e5rhZI=\n-----END PRIVATE KEY-----\n",
  "client_email": "firebase-adminsdk-fbsvc@shargabaiisite.iam.gserviceaccount.com",
  "client_id": "104903887535443706109"
};

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://shargabaiisite-default-rtdb.asia-southeast1.firebasedatabase.app"
});
const db = admin.firestore();
const rtdb = admin.database();
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// ================== СЕССИЯЛАР ==================
const sessions = {};
const attempts = {};
const usedChecks = [];

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
    keyboard: [
      ['📋 Барлық кафелер', '➕ Кафе қосу'],
      ['📊 Статистика', '🚪 Шығу']
    ], resize_keyboard: true
  }};
}

async function updateRealtimeAndFirestore(cafeId, updateData) {
  await db.collection('cafes').doc(cafeId).set(updateData, { merge: true });
  await rtdb.ref(`cafes/${cafeId}`).update(updateData);
}

async function getCafe(chatId) {
  const doc = await db.collection('cafes').doc(String(chatId)).get();
  return doc.exists ? doc.data() : null;
}

// ================== /START ==================
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  sessions[chatId] = {};
  attempts[chatId] = 0;
  bot.sendMessage(chatId, '🍽️ *Shargabaii.site — Кафе басқару боты*\n\nҚош келдіңіз!', {
    parse_mode: 'Markdown',
    reply_markup: { keyboard: [['🚪 Кіру']], resize_keyboard: true }
  });
});

// ================== ХАБАРЛАМАЛАРДЫ ӨҢДЕУ ==================
bot.on('message', async (msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;
  if (!text) return;

  if (text === '🚪 Кіру') {
    sessions[chatId] = { step: 'login' };
    bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }
  
  if (sessions[chatId]?.step === 'login') {
    sessions[chatId].login = text.trim();
    sessions[chatId].step = 'password';
    bot.sendMessage(chatId, '🔒 *Парольді енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'password') {
    const login = sessions[chatId].login;
    const pass = text.trim();

    if (login === SUPER_ADMIN_LOGIN && pass === SUPER_ADMIN_PASS) {
      sessions[chatId] = { role: 'superadmin' };
      attempts[chatId] = 0;
      bot.sendMessage(chatId, '👑 *Супер-админ панеліне қош келдіңіз!*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
      return;
    }

    const cafe = await getCafe(chatId);
    if (cafe && cafe.login === login && cafe.password === pass) {
      sessions[chatId] = { role: 'cafe', cafeId: String(chatId), cafeName: cafe.name || 'Кафе' };
      attempts[chatId] = 0;
      bot.sendMessage(chatId, `🏪 *${sessions[chatId].cafeName} панелі*`, { parse_mode: 'Markdown', ...getCafeKeyboard() });
      return;
    }

    attempts[chatId] = (attempts[chatId] || 0) + 1;
    const a = attempts[chatId];
    if (a >= 3) {
      delete sessions[chatId];
      bot.sendMessage(chatId, '🚫 *3 рет қате енгізілді! Бұғатталды.*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
      return;
    }
    bot.sendMessage(chatId, `❌ *Қате логин немесе пароль!* (${a}/3)`, {
      parse_mode: 'Markdown',
      reply_markup: { keyboard: [['🔄 Қайталау'], ['🔑 Ұмыттым']], resize_keyboard: true }
    });
    delete sessions[chatId];
    return;
  }

  if (text === '🔄 Қайталау') {
    sessions[chatId] = { step: 'login' };
    bot.sendMessage(chatId, '👤 *Логинді енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }

  if (text === '🔑 Ұмыттым') {
    sessions[chatId] = { step: 'reset_phone' };
    bot.sendMessage(chatId, '📱 *Кафеге тіркелген WhatsApp нөмірін енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }

  if (sessions[chatId]?.step === 'reset_phone') {
    const phone = text.replace(/\D/g, '');
    const cafe = await getCafe(chatId);
    if (!cafe || cafe.phone?.replace(/\D/g, '') !== phone) {
      bot.sendMessage(chatId, '❌ *Мұндай нөмір базадан табылмады!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
      delete sessions[chatId];
      return;
    }
    sessions[chatId].resetCafeId = String(chatId);
    sessions[chatId].step = 'reset_check';
    bot.sendMessage(chatId, `💰 *${RESET_PRICE} ₸* сомасын Kaspi арқылы мына нөмірге жіберіңіз: ${KASPI_NUMBER}\n\nТөлемнен кейін чек скриншотын немесе чек PDF файлын жіберіңіз.`, { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }

  if (sessions[chatId]?.step === 'reset_check' && msg.photo) {
    sessions[chatId].step = 'reset_check_number';
    bot.sendMessage(chatId, '📝 *Чек нөмірін (немесе операция кодын) енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'reset_check_number') {
    const checkNum = text.trim();
    if (usedChecks.includes(checkNum)) {
      bot.sendMessage(chatId, '❌ *Бұл чек бұрын қолданылған!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
      delete sessions[chatId];
      return;
    }
    usedChecks.push(checkNum);
    sessions[chatId].step = 'reset_new_login';
    bot.sendMessage(chatId, '👤 *Жаңа логинді енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }

  if (sessions[chatId]?.step === 'reset_new_login') {
    sessions[chatId].newLogin = text.trim();
    sessions[chatId].step = 'reset_new_password';
    bot.sendMessage(chatId, '🔒 *Жаңа парольді енгізіңіз:*', { parse_mode: 'Markdown' });
    return;
  }

  if (sessions[chatId]?.step === 'reset_new_password') {
    await updateRealtimeAndFirestore(sessions[chatId].resetCafeId, {
      login: sessions[chatId].newLogin,
      password: text.trim()
    });
    bot.sendMessage(chatId, '✅ *Құпия сөз бен логин сәтті жаңартылды!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    delete sessions[chatId];
    return;
  }

  if (text === '🚪 Шығу') {
    delete sessions[chatId];
    bot.sendMessage(chatId, '👋 *Жүйеден сәтті шықтыңыз!*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    return;
  }

  // ================== СУПЕР-АДМИН РӨЛІ ==================
  if (sessions[chatId]?.role === 'superadmin' || chatId === SUPER_ADMIN_ID) {
    if (!sessions[chatId]) sessions[chatId] = { role: 'superadmin' };

    if (text === '📋 Барлық кафелер') {
      const snap = await db.collection('cafes').get();
      if (snap.empty) {
        return bot.sendMessage(chatId, '📭 *Әзірге тіркелген кафелер жоқ.*', { parse_mode: 'Markdown' });
      }
      
      for (const doc of snap.docs) {
        const d = doc.data();
        let info = `📌 *Кафе туралы ақпарат:*\n`;
        info += `🆔 ID / ChatID: \`${doc.id}\`\n`;
        info += `🏢 Атауы: *${d.name || 'Атаусыз'}*\n`;
        info += `👤 Логин: \`${d.login || 'Жоқ'}\`\n`;
        info += `🔑 Пароль: \`${d.password || 'Жоқ'}\`\n`;
        info += `🔗 Сайт сілтемесі: ${d.siteUrl || 'Жоқ'}\n\n`;

        const menu = d.menu || [];
        if (menu.length > 0) {
          info += `📋 *Мәзір тізімі (${menu.length} тауар):*\n`;
          menu.forEach(item => {
            info += `- [${item.id}] ${item.name_kk || item.name_ru} — ${item.price} ₸ (${item.cat || 'Категориясыз'})\n`;
          });
        } else {
          info += `📭 *Мәзірі бос*\n`;
        }
        
        await bot.sendMessage(chatId, info, { parse_mode: 'Markdown' });
      }
      return;
    }

    if (text === '➕ Кафе қосу') {
      sessions[chatId].step = 'new_cafe_id';
      sessions[chatId].newCafe = {};
      return bot.sendMessage(chatId, '🆔 *Жаңа кафе үшін Телеграм Chat ID немесе бірегей сан енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (text === '📊 Статистика' && sessions[chatId]?.role === 'superadmin') {
      const snap = await db.collection('cafes').get();
      return bot.sendMessage(chatId, `📊 *Жалпы жүйе статистикасы*\n👥 Барлық тіркелген кафелер саны: *${snap.size}*`, { parse_mode: 'Markdown' });
    }

    // Супер-админ қосу қадамдары
    if (sessions[chatId]?.step === 'new_cafe_id') {
      sessions[chatId].newCafe.id = text.trim();
      sessions[chatId].step = 'new_cafe_name';
      return bot.sendMessage(chatId, '📌 *Кафе атауын енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (sessions[chatId]?.step === 'new_cafe_name') {
      sessions[chatId].newCafe.name = text.trim();
      sessions[chatId].step = 'new_cafe_login';
      return bot.sendMessage(chatId, '👤 *Кафе үшін логин енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (sessions[chatId]?.step === 'new_cafe_login') {
      sessions[chatId].newCafe.login = text.trim();
      sessions[chatId].step = 'new_cafe_pass';
      return bot.sendMessage(chatId, '🔒 *Кафе үшін пароль енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (sessions[chatId]?.step === 'new_cafe_pass') {
      const cafeId = sessions[chatId].newCafe.id;
      const cafeData = {
        name: sessions[chatId].newCafe.name,
        login: sessions[chatId].newCafe.login,
        password: text.trim(),
        menu: [],
        stats: { views: 0, orders: 0 },
        siteUrl: `https://shargabaii.site/cafe/${cafeId}`
      };

      await updateRealtimeAndFirestore(cafeId, cafeData);
      sessions[chatId].step = null;
      delete sessions[chatId].newCafe;

      return bot.sendMessage(chatId, '✅ *Кафе жүйеге сәтті қосылды!*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
    }
  }

  // ================== КАФЕ РӨЛІ ==================
  if (sessions[chatId]?.role === 'cafe') {
    if (text === '📋 Мәзірді көру') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Сіздің мәзіріңіз әзірге бос.*', { parse_mode: 'Markdown' });
      let menuMsg = '📋 *Сіздің мәзіріңіз:*\n\n';
      menu.forEach((item, i) => menuMsg += `${i+1}. ${item.name_kk} — ${item.price} ₸\n`);
      return bot.sendMessage(chatId, menuMsg, { parse_mode: 'Markdown' });
    }

    if (text === '➕ Тауар қосу') {
      sessions[chatId].step = 'add_name_kk';
      return bot.sendMessage(chatId, '📝 *Тауардың қазақша атауын енгізіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (text === '✏️ Тауар өзгерту') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Өзгертетін тауарлар жоқ, мәзір бос.*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`✏️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'edit_select';
      return bot.sendMessage(chatId, '✏️ *Қай тауарды өзгерткіңіз келеді? Төменнен таңдаңыз:*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
    }

    if (text === '🗑️ Тауар жою') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Жоятын тауарлар жоқ, мәзір бос.*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`🗑️ ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'delete_select';
      return bot.sendMessage(chatId, '🗑️ *Қай тауарды жойғыңыз келеді? Төменнен таңдаңыз:*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
    }

    if (text === '🖼️ Сурет жүктеу') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      if (!menu.length) return bot.sendMessage(chatId, '📭 *Сурет жүктейтін тауарлар жоқ.*', { parse_mode: 'Markdown' });
      const buttons = menu.map(item => [`📸 ${item.id}. ${item.name_kk}`]);
      buttons.push(['🔙 Артқа']);
      sessions[chatId].step = 'photo_select';
      return bot.sendMessage(chatId, '📸 *Қай тауарға сурет жүктегіңіз келеді?*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: buttons, resize_keyboard: true }
      });
    }

    if (text === '🎨 Түстер') {
      sessions[chatId].step = 'theme_accent';
      return bot.sendMessage(chatId, '🎨 *Кафе сайтының екпін түсін енгізіңіз (мысалы: #e94560):*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }

    if (text === '🔗 QR код') {
      const cafe = await getCafe(chatId);
      const url = cafe?.siteUrl || 'https://shargabaii.site';
      const qr = await QRCode.toDataURL(url);
      const base64Data = qr.replace(/^data:image\/png;base64,/, "");
      const imgBuffer = Buffer.from(base64Data, 'base64');
      return bot.sendPhoto(chatId, imgBuffer, { caption: `📱 *Кафеңіздің QR коды:*\n${url}`, parse_mode: 'Markdown' });
    }

    if (text === '📊 Статистика') {
      const cafe = await getCafe(chatId);
      const stats = cafe?.stats || { views: 0, orders: 0 };
      return bot.sendMessage(chatId, `📊 *Кафе статистикасы*\n👁️ Жалпы қаралым: *${stats.views}*\n🛒 Жалпы тапсырыс: *${stats.orders}*`, { parse_mode: 'Markdown' });
    }

    if (text === '🔙 Артқа') {
      delete sessions[chatId].step;
      return bot.sendMessage(chatId, '🏪 *Кафе басқару панелі*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар қосу қадамдары ---
    if (sessions[chatId]?.step === 'add_name_kk') {
      sessions[chatId].newItem = { name_kk: text.trim(), img: '', badges: [] };
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
      return bot.sendMessage(chatId, '💰 *Бағасын енгізіңіз (тек сан):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'add_price') {
      sessions[chatId].newItem.price = parseInt(text.trim()) || 0;
      sessions[chatId].step = 'add_cat';
      return bot.sendMessage(chatId, '📂 *Категорияны таңдаңыз:*', {
        parse_mode: 'Markdown',
        reply_markup: { keyboard: [['Сеттер'], ['Гункандар'], ['Роллдар'], ['Сусындар'], ['Десерттер']], resize_keyboard: true }
      });
    }
    if (sessions[chatId]?.step === 'add_cat') {
      sessions[chatId].newItem.cat = text.trim();
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const newId = menu.length > 0 ? Math.max(...menu.map(i => i.id)) + 1 : 1;
      sessions[chatId].newItem.id = newId;
      menu.push(sessions[chatId].newItem);
      await updateRealtimeAndFirestore(String(chatId), { menu });
      delete sessions[chatId].step;
      return bot.sendMessage(chatId, '✅ *Жаңа тауар сәтті қосылды!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар өзгерту қадамдары ---
    if (sessions[chatId]?.step === 'edit_select' && text?.startsWith('✏️')) {
      const id = parseInt(text.split('.')[0].replace('✏️ ', ''));
      const cafe = await getCafe(chatId);
      const item = cafe?.menu?.find(i => i.id === id);
      if (!item) return;
      sessions[chatId].editItemId = id;
      sessions[chatId].step = 'edit_name_kk';
      return bot.sendMessage(chatId, `📝 *Жаңа қазақша атауы (қазіргі: ${item.name_kk}):*`, { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
    if (sessions[chatId]?.step === 'edit_name_kk') {
      sessions[chatId].editData = { name_kk: text.trim() };
      sessions[chatId].step = 'edit_name_ru';
      return bot.sendMessage(chatId, '📝 *Жаңа орысша атауы:*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'edit_name_ru') {
      sessions[chatId].editData.name_ru = text.trim();
      sessions[chatId].step = 'edit_price';
      return bot.sendMessage(chatId, '💰 *Жаңа бағасы:*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'edit_price') {
      const cafe = await getCafe(chatId);
      const menu = cafe?.menu || [];
      const item = menu.find(i => i.id === sessions[chatId].editItemId);
      if (item) {
        item.name_kk = sessions[chatId].editData.name_kk;
        item.name_ru = sessions[chatId].editData.name_ru;
        item.price = parseInt(text.trim()) || item.price;
      }
      await updateRealtimeAndFirestore(String(chatId), { menu });
      delete sessions[chatId].step;
      return bot.sendMessage(chatId, '✅ *Тауар деректері сәтті өзгертілді!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Тауар жою ---
    if (sessions[chatId]?.step === 'delete_select' && text?.startsWith('🗑️')) {
      const id = parseInt(text.split('.')[0].replace('🗑️ ', ''));
      const cafe = await getCafe(chatId);
      const menu = (cafe?.menu || []).filter(i => i.id !== id);
      await updateRealtimeAndFirestore(String(chatId), { menu });
      delete sessions[chatId].step;
      return bot.sendMessage(chatId, '✅ *Тауар мәзірден сәтті жойылды!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Түстерді баптау ---
    if (sessions[chatId]?.step === 'theme_accent') {
      sessions[chatId].theme = { accent: text.trim() };
      sessions[chatId].step = 'theme_bg';
      return bot.sendMessage(chatId, '🎨 *Фон түсін енгізіңіз (мысалы: #0d0d1a):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_bg') {
      sessions[chatId].theme.bg = text.trim();
      sessions[chatId].step = 'theme_card';
      return bot.sendMessage(chatId, '🎨 *Карта түсін енгізіңіз (мысалы: #1a1a2e):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_card') {
      sessions[chatId].theme.card = text.trim();
      sessions[chatId].step = 'theme_text';
      return bot.sendMessage(chatId, '🎨 *Мәтін түсін енгізіңіз (мысалы: #e8e8e8):*', { parse_mode: 'Markdown' });
    }
    if (sessions[chatId]?.step === 'theme_text') {
      sessions[chatId].theme.text = text.trim();
      await updateRealtimeAndFirestore(String(chatId), { theme: sessions[chatId].theme });
      delete sessions[chatId].step;
      return bot.sendMessage(chatId, '✅ *Дизайн түстері сәтті сақталды!*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    }

    // --- Сурет таңдау ---
    if (sessions[chatId]?.step === 'photo_select' && text?.startsWith('📸')) {
      const id = parseInt(text.split('.')[0].replace('📸 ', ''));
      sessions[chatId].photoItemId = id;
      sessions[chatId].step = 'photo_upload';
      return bot.sendMessage(chatId, '📸 *Енді осы тауардың суретін чатқа жіберіңіз:*', { parse_mode: 'Markdown', reply_markup: { remove_keyboard: true } });
    }
  }

  // Егер ешбір шартқа сәйкес келмесе
  bot.sendMessage(chatId, '⚠️ *Мұндай команда немесе мәзір түймесі табылмады.*\nТөмендегі батырмаларды пайдаланыңыз немесе жүйеге кіріңіз.', { parse_mode: 'Markdown', ...getHomeButton() });
});

// ================== СУРЕТ ЖҮКТЕУ (Канал арқылы) ==================
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
    delete sessions[chatId].step;
    return bot.sendMessage(chatId, `✅ *Сурет сәтті жүктелді!*\n🔗 ${link}`, { parse_mode: 'Markdown', ...getCafeKeyboard() });
  } catch (err) {
    return bot.sendMessage(chatId, '❌ Суретті жүктеу кезінде қате орын алды.', { parse_mode: 'Markdown', ...getCafeKeyboard() });
  }
});

// ================== PDF ЧЕКТЕРДІ ОҚУ ==================
bot.on('document', async (msg) => {
  const chatId = msg.chat.id;
  if (msg.document.mime_type !== 'application/pdf') return bot.sendMessage(chatId, '❌ Тек PDF форматындағы чектер қабылданады.', { parse_mode: 'Markdown' });
  try {
    const file = await bot.getFile(msg.document.file_id);
    const url = `https://api.telegram.org/file/bot${BOT_TOKEN}/${file.file_path}`;
    const res = await axios.get(url, { responseType: 'arraybuffer' });
    const pdfData = await pdfParse(res.data);
    const match = pdfData.text.match(/\b(\d[\d\s]*\d)\b/);
    if (!match) return bot.sendMessage(chatId, '❌ Чектен сома табылмады.', { parse_mode: 'Markdown' });
    const amount = parseInt(match[0].replace(/\s/g, ''));
    if (amount >= RESET_PRICE) return bot.sendMessage(chatId, '✅ *Төлем расталды! Құпия сөзді қалпына келтіруге рұқсат етілді.*', { parse_mode: 'Markdown', ...getHomeButton() });
    else return bot.sendMessage(chatId, `❌ Төлем сомасы жеткіліксіз: ${amount} ₸ (Талап етілетін: ${RESET_PRICE} ₸)`, { parse_mode: 'Markdown', ...getHomeButton() });
  } catch { 
    return bot.sendMessage(chatId, '❌ PDF файлын оқу кезінде қате шықты.', { parse_mode: 'Markdown', ...getHomeButton() }); 
  }
});

// ================== CALLBACK QUERY ==================
bot.on('callback_query', async (callback) => {
  const chatId = callback.message.chat.id;
  if (callback.data === 'home') {
    await bot.answerCallbackQuery(callback.id);
    if (sessions[chatId]) {
      sessions[chatId].step = null;
    }
    if (sessions[chatId]?.role === 'superadmin') {
      return bot.sendMessage(chatId, '👑 *Супер-админ панелі*', { parse_mode: 'Markdown', ...getSuperKeyboard() });
    } else if (sessions[chatId]?.role === 'cafe') {
      return bot.sendMessage(chatId, '🏪 *Кафе панелі*', { parse_mode: 'Markdown', ...getCafeKeyboard() });
    } else {
      return bot.sendMessage(chatId, '🍽️ *Басты бет*', { parse_mode: 'Markdown', reply_markup: { keyboard: [['🚪 Кіру']], resize_keyboard: true } });
    }
  }
});

console.log('🚀 Бот таза логикамен, қатесіз сәтті іске қосылды!');