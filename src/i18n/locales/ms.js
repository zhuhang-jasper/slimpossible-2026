// Bahasa Melayu (BM) translation bundle. Keys mirror the EN bundle (en.js).
// Brand names, hashtags and ZUS product names are kept in their original form.
const ms = {
  lang: { en: "EN", ms: "BM", switchLabel: "Bahasa", toEn: "Switch to English", toMs: "Tukar ke Bahasa Melayu" },

  hero: {
    title: "🏋️ SlimPossible 2026",
    sub: "14 minggu",
    dates: "22 Jun – 27 Sep 2026",
    infoLabel: "Buka butiran cabaran",
    help: "Bantuan",
    trackerLink: "Lark Base Tracker",
    wikiLink: "Wiki rasmi",
  },

  table: {
    week: "Minggu",
    booster: "Booster Dwi-Mingguan",
    weekTarget: "Mata sasaran",
    toggleWeekPlan: "Togol pelan minggu {{wk}}",
    dayPlanLabel: "Pelan harian minggu {{wk}}",
    boosterWiki: "Klik di sini untuk lihat wiki booster",
  },

  copy: { copy: "Salin", copied: "Disalin!", copyLabel: "Salin hashtag", copiedLabel: "Hashtag disalin" },

  pointsInfoLabel: "Cara mata dikira — buka butiran cabaran",

  drawer: {
    title: "📖 Butiran cabaran",
    close: "Tutup butiran",
    ariaLabel: "Butiran cabaran",

    everyWeekTitle: "🔁 Buat ini SETIAP minggu (W1–W14)",
    everyWeekMax: "sehingga {{max}} mata/mgg",
    everyWeekScope: "— Semua penghantaran ke Lark Base Tracker",

    bonusTitle: "🌟 Aktiviti bonus",
    bonusMax: "sehingga 40++ mata/mgg",
    bonusScope: "— BOOSTER SAHAJA (TIDAK terpakai untuk timbang berat / langkah / senaman)",

    legendTitle: "📌 Cara membaca ini",
    legend: {
      everyWeek: "<b>3 tugas setiap minggu di atas berlaku setiap minggu</b> — timbang berat (Isnin), log langkah, dan 3 senaman.",
      boosterRotates: "<b>Booster bertukar setiap 2 minggu.</b> Cuma semak baris minggu anda untuk lihat apa yang istimewa.",
      boosterPts:
        "<b>Mata booster = 30 / 40:</b> <req>30</req> = penghantaran Lark Base (wajib untuk sebarang mata). <opt>40</opt> = Lark Base <i>+</i> kongsi di ZUS Moments dengan hashtag.",
      weekTarget:
        "<b>Sasaran minggu = {{weekMax}}:</b> siling realistik — 100 langkah + 100 senaman + 40 booster. <b>Timbang berat dikecualikan</b> (anda tak boleh dapat tahap turun 40 mata setiap minggu). Maksimum dwi-mingguan ialah <b>{{biweekly}}</b>; siling penuh cabaran ialah <b>{{full}}</b> — penanda aras papan pendahulu anda.",
      bookends:
        "<b>Setiap minggu ada dua peringkat penghantaran</b> (kembangkan minggu untuk lihat): <b>① Buka</b> — pada Isnin, borang timbang berat: pilih minggu itu, masukkan berat pagi Isnin anda, biarkan yang lain kosong. <b>② Laporan</b> — aktiviti minggu itu (langkah + senaman + booster + bonus), dengan berat dibiarkan kosong.",
      dueDate:
        "<b>Laporan perlu dihantar sebelum Isnin BERIKUTNYA</b> — tetapi anda boleh hantar lebih awal (cth. setiap senaman pada hari ia dilakukan). <b>Minggu 1 hanyalah timbang berat asas</b> untuk membuka cabaran.",
      oneWorkout:
        '<b>Setiap borang Lark Base mengambil hanya SATU senaman</b> ("Type Of Activity" pilih satu sahaja), jadi 3 senaman bermaksud 3 borang. Langkah, booster dan kiriman ZUS Moments boleh dimuatkan dalam mana-mana borang itu, atau berasingan — pilihan anda.',
      proof:
        "<b>Setiap medan mendedahkan muat naik buktinya sendiri</b> sebaik sahaja anda isi — berat perlukan foto penimbang, langkah satu tangkapan skrin, setiap senaman foto/video wajah, booster buktinya, dan kiriman ZUS Moments satu tangkapan skrin.",
      boosterNotWorkout:
        "Walaupun booster ialah aktiviti jenis senaman (Buddy Steps, Pace), ia <b>tidak</b> dikira sebagai salah satu daripada 3 senaman anda — booster dan setiap senaman ialah penghantaran berasingan.",
      outsideHours: "Semua aktiviti mesti dilakukan <b>di luar waktu kerja</b>. Hanya <i>penurunan</i> berat dapat mata (kekal/naik = 0).",
      finalReport: "<b>Laporan akhir: 28 Sep</b> — sehari selepas W14 ditutup; kedudukan akhir dikira ketika itu.",
    },

    linksTitle: "🔗 Pautan rasmi",
    trackerLink: "📋 Lark Base Tracker",
    trackerNote: "Hantar setiap timbang berat, log langkah, senaman & booster di sini",
    wikiLink: "📖 Wiki rasmi cabaran",
    wikiNote: "Peraturan & butiran penuh daripada penganjur",
  },

  weeklyTasks: {
    weighIn: {
      title: "Timbang berat",
      cap: "had 40/mgg",
      desc: "Setiap Isnin. Foto/video penimbang (kaki + paparan kelihatan). Hanya penurunan dapat mata.",
      maintainOrGain: "Kekal atau naik",
      lose05: "Turun > 0.5 kg",
      lose1: "Turun > 1 kg",
    },
    steps: {
      title: "Kiraan langkah",
      cap: "had 100/mgg",
      desc: "Log sekali seminggu. Tangkapan skrin mana-mana apl langkah (Google Fit, Fitbit…).",
      s20k: "20k langkah",
      s25k: "25k langkah",
      s30k: "30k langkah",
      s35k: "35k langkah",
      s40k: "> 40k langkah",
    },
    workouts: {
      title: "Senaman",
      cap: "had 100/mgg",
      desc: "Pada hari berasingan. Foto/video menunjukkan wajah anda.",
      w1: "1 senaman",
      w2: "2 senaman",
      w3: "3+ senaman",
    },
  },

  bonusTasks: {
    joinBooster: {
      title: "Sertai booster (Lark Base)",
      badge: "30 mata",
      desc: "Lengkapkan booster minggu itu dan muat naik bukti anda ke Lark Base Tracker. Wajib — dapat 30 mata asas.",
    },
    postMoments: {
      title: "Kongsi di ZUS Moments",
      badge: "+10 mata",
      desc: "Pada sesuatu booster, berkongsi ke ZUS Moments dengan hashtag menaikkan booster itu daripada 30 → 40 mata.",
    },
    showMerch: {
      title: "Tunjuk merch ZUS anda",
      badge: "dalam klip",
      desc: "Dalam klip booster Pace / Hydration, paparkan tumbler, cawan, minuman tin atau merch ZUS anda untuk mengukuhkan penghantaran.",
    },
  },

  boosters: {
    buddy: "Buddy Steps",
    snapfuel: "ZUS SnapFuel",
    pace1: "ZUS Pace Challenge",
    hydration: "Hydration Hustle",
    pace2: "Pace Challenge: Level Up",
    zen: "ZUS Zen Time",
    mind: "ZUS Mind Break Mission",
    buddyW1: "Berjalan/berjoging dengan rakan (termasuk keluarga/haiwan peliharaan). Foto atau video semasa aktiviti.",
    buddyW2:
      "Berjalan/berjoging dengan rakan (termasuk keluarga/haiwan peliharaan). Foto atau video semasa aktiviti. Maksimum 2 penghantaran merentas W1+W2.",
    snapfuelW3: "Masak hidangan/smoothie sihat buatan sendiri. Muat naik video time-lapse pendek.",
    snapfuelW4:
      "Masak hidangan/smoothie sihat buatan sendiri. Muat naik video time-lapse pendek. Hanya hidangan yang dimasak semasa minggu cabaran dikira.",
    pace1Desc: "Selesaikan 2km dalam 20 minit. Tunjuk jarak + masa.",
    hydrationDesc: "Minum ≥2L air setiap hari. Rakam klip 15–30s: ambil satu teguk + kongsi 1 fakta kesihatan.",
    pace2Desc: "Selesaikan 2km dalam 15 minit. Tunjuk jarak + masa.",
    zenW11: "Sertai kelas yoga/Zumba/meditasi/kesihatan (dalam talian atau bersemuka). Time-lapse 15–30s.",
    zenW12:
      "Sertai kelas yoga/Zumba/meditasi/kesihatan (dalam talian atau bersemuka). Time-lapse 15–30s. Tiada penghantaran berulang bagi sesi yang sama.",
    mindW13: "Hadiri Ceramah Kesihatan Mental / sesi Kesejahteraan ZUS. Log satu refleksi atau foto.",
    mindW14: "Hadiri Ceramah Kesihatan Mental / sesi Kesejahteraan ZUS. Log satu refleksi atau foto. Penghantaran wajib selepas menghadiri.",
  },

  boosterMeta: {
    buddy: { proof: "foto/video semasa berjalan/joging" },
    snapfuel: { proof: "video memasak time-lapse" },
    pace1: { proof: "tangkapan skrin: jarak 2km + masa" },
    hydration: { proof: "klip 15–30s: teguk + 1 fakta kesihatan" },
    pace2: { proof: "tangkapan skrin: jarak 2km + masa" },
    zen: { proof: "time-lapse 15–30s sesi itu" },
    mind: { proof: "refleksi atau foto di ceramah" },
  },

  extras: {
    tagColleague: "tag seorang rakan sekerja",
    catchyTitle: "tambah tajuk menarik",
    showMerch: "tunjuk merch/tumbler ZUS",
    funCaption: "tambah kapsyen menarik",
  },

  plan: {
    start: {
      heading: "① Mulakan minggu — Isnin",
      weighIn: "Timbang berat (biar yang lain kosong)",
      weighInBaseline: "Timbang berat awal (asas)",
      weighInCue: "borang sendiri · pilih minggu ini · berat + foto penimbang (kaki + nombor)",
    },
    report: {
      heading: "② Hantar laporan — sebelum Isnin depan (biar berat kosong)",
      steps: "Kiraan langkah berjalan 40k+",
      stepsCue: "jumlah langkah minggu ini · tangkapan skrin dari mana-mana apl langkah",
      workout1: "Senaman 1",
      workout1Cue: "hari berasingan · foto/video wajah",
      booster: "Booster: {{name}}",
      bonusBadge: "BONUS",
      postMoments: "Kongsi di ZUS Moments",
      postMomentsCue: "dengan hashtag di bawah · tangkap skrin sebagai bukti",
      tip: "petua: {{tip}}",
      dueNote: "🗓️ Perlu dihantar sebelum <b>Isnin berikutnya</b>",
      dueNoteWeek: " (sebelum anda buat timbang berat <b>{{wk}}</b>)",
      dueNoteTail: ", atau hantar lebih awal pada hari setiap aktiviti.",
    },
    form3: {
      workout2: "Senaman 2",
      workout2Cue: "borang sendiri · hari berasingan · foto/video wajah · biar yang lain kosong",
    },
    form4: {
      workout3: "Senaman 3",
      workout3Cue: "borang sendiri · hari berasingan · foto/video wajah · dihadkan pada 3+ senaman · biar yang lain kosong",
    },
  },

  install: {
    bannerLabel: "Pasang apl ini",
    title: "Tambah ke skrin utama anda",
    text: "Tambah <b>SlimPossible 2026</b> ke skrin utama anda untuk akses pantas dengan satu ketikan. Ia hanyalah laman web ini — tiada apa untuk dimuat turun.",
    iosHintPre: "Ia hanyalah laman ini — tiada apa untuk dimuat turun. Ketik",
    iosHintMid: "kemudian",
    iosHintAdd: "Tambah ke Skrin Utama",
    shareLabel: "butang Kongsi",
    install: "Pasang",
    dismiss: "Tutup gesaan pemasangan",
    cardTitle: "📲 Pasang apl ini",
    cardText:
      "Tambah <b>SlimPossible 2026</b> ke skrin utama anda untuk akses skrin penuh dengan satu ketikan. Ia hanyalah laman web ini — tiada apa untuk dimuat turun.",
  },

  footer: { rights: "© 2026 Jasper Loo Zhu Hang · Hak cipta terpelihara ·" },
};

export default ms;
