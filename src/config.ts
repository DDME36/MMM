/** แก้ข้อมูลเว็บไซต์ทั้งหมดที่นี่ แล้วบันทึกไฟล์ ไม่ต้องแก้โครงสร้าง component */
export const CONFIG = {
  person: {
    name: 'มิมิว', englishName: 'Mimiw', age: 25,
    // ใช้ 22 ต.ค. 2544 เวลา 00:00 น. ตามที่ยืนยัน — เปลี่ยนได้โดยคงเขตเวลา +07:00
    birthDate: '2001-10-22T00:00:00+07:00',
    celebrationDate: '2026-10-22T00:00:00+07:00',
    locale: 'th-TH', timeZone: 'Asia/Bangkok',
  },
  meta: {
    title: 'Happy Birthday, Mimiw — a little birthday story',
    description: 'มีจดหมายและเซอร์ไพรส์เล็ก ๆ รอมิมิวอยู่ เปิดดูด้วยกันนะ',
    // เปลี่ยนที่นี่หากโดเมนจริงบน Vercel ได้ชื่ออื่น แล้ว build / deploy ใหม่
    siteUrl: 'https://mimiw-surprise.vercel.app',
    siteName: 'Mimiw — a little birthday surprise',
    shareTitle: 'สุขสันต์วันเกิด 25 ปีนะมิมิว',
    image: '/assets/images/mimiw-birthday-25-og-v1.jpg',
    imageAlt: 'Happy Birthday, Mimiw — ปกสีครีมชมพู ซองจดหมาย เค้กเทียนเลข 25 และผีเสื้อ',
    imageWidth: 1200, imageHeight: 630,
  },
  journey: {
    // สีจะไหลต่อกันตามตำแหน่งที่เลื่อน เปลี่ยนแต่ละบทได้ที่นี่
    chapters: [
      { label: 'เรื่องราวของมิว', color: '#f8f4ec' },
      { label: 'สิ่งเล็ก ๆ ที่เป็นมิว', color: '#e3e9d8' },
      { label: 'เก็บรอยยิ้มไว้', color: '#f2dfd2' },
      { label: 'วันธรรมดาที่พิเศษ', color: '#f3e9cb' },
      { label: 'และวันดี ๆ ข้างหน้า', color: '#e9dce3' },
      { label: 'ข้อความจากใจ', color: '#f0dfe0' },
      { label: 'คำอธิษฐานของมิว', color: '#e2e7da' },
    ],
    hint: 'เลื่อนเพื่อไปต่อ',
  },
  theme: {
    paper: '#f8f4ec', paperDeep: '#eee7dc', ink: '#433a36', muted: '#77675f',
    accent: '#a85367', accentDark: '#874052', sage: '#e8eadd', line: '#dcd2c5',
    blush: '#f1e7e1', glass: '#fffdf7b8', envelope: '#e4c9b9', envelopeFlap: '#ecd9cc',
    cake: '#d8a197', icing: '#fff4df', cakeShade: '#bc7d79', flame: '#e7a145', flameCore: '#fff3b2',
    confetti: ['#a85367', '#d7b9ab', '#b0b59c', '#e7cb92', '#f8f4ec'],
  },
  gate: {
    title: 'A little something,', emphasis: 'just for you.', description: 'มีจดหมายถึงมิวด้วยล่ะ',
    salutation: 'dear mimiw,', letterMessage: 'a lovely new chapter awaits.', sealNote: 'for mimiw, with love.',
    action: 'เปิดจดหมายเพื่อเข้าสู่เรื่องราววันเกิด', hint: 'แตะที่ซอง เพื่อเปิดเรื่องราวของมิว', opening: 'เรื่องราวเล็ก ๆ กำลังเริ่มต้นขึ้น',
  },
  hero: {
    title: 'Happy Birthday,', dedication: 'ขอให้โลกใจดีกับมิวขึ้นอีกนิดในทุก ๆ วัน',
    note: 'a little older. a lot more loved.', portrait: '/assets/images/7-web.webp',
    portraitAlt: 'มิมิวในภาพต้นฉบับพร้อมพื้นหลัง', photoCaption: 'my favourite kind of sunshine', sealTop: 'HAPPY', sealBottom: 'TO YOU',
    counterTitle: 'โลกใบนี้มีมิวมาแล้ว', counterNote: 'ทุกวินาที มีความหมายในแบบของมัน',
    counterLabels: ['วัน', 'ชั่วโมง', 'นาที', 'วินาที'], scroll: 'ค่อย ๆ เลื่อนนะ เรื่องราวยังมีต่อ',
  },
  bento: {
    title: 'A little collection', titleSecond: 'of', titleEmphasis: 'everything you.',
    description: 'ความน่ารัก เพลงโปรด และเรื่องเล็ก ๆ\nที่รวมกันแล้วเป็นมิมิว',
    aquarium: '/assets/images/aqrium-web.webp', aquariumAlt: 'ความทรงจำที่อควาเรียม',
    // เก็บรูปและเอฟเฟกต์เดิมของหน้า Bento ตามที่ขอ
    portrait: '/assets/images/mimiw.png', portraitAlt: 'มิมิว',
    nameWords: ['MIMIW', 'PHROM', 'MIMIW'], nameGradient: ['#f26500', '#B56BFF', '#5bb6ff'],
    loveGradients: [['#973BED', '#007CFF'], ['#FFC800', '#FF00FF'], ['#00E0ED', '#00DA72'], ['#FF6B6B', '#FFE66D']],
    triangleGradient: ['#ffbf48', '#be4a1d'],
    messages: [{ short: 'ทรย', full: 'ทำไรอยู่' }, { short: 'นร', full: 'น่ารัก' }, { short: 'คถ', full: 'คิดถึง' }, { short: 'ดม', full: 'โดม' }],
    ageUnit: 'ปี', musicLabel: 'Music', songTitle: 'เพลงนี้ให้มิว', album: '/assets/images/music album.jpg',
    songSubtitle: 'a song, just for you', playerTint: '#542732',
    note: 'years of being you.', wish: 'ขอให้วัย 25 มีแต่เรื่องดี ๆ เข้ามานะ', scroll: 'เลื่อนลง เพื่อดูภาพความทรงจำ',
  },
  memories: {
    title: 'Little moments.', emphasis: 'Lovely memories.',
    description: 'บางวันอาจจำไม่ได้แล้วว่าทำอะไร แต่รอยยิ้มในรูปพวกนี้ ยังทำให้ยิ้มตามได้อยู่เลย',
    touchHint: 'แตะรูป เพื่อเก็บมองใกล้ ๆ',
    photos: [
      { src: '/assets/images/1-web.webp', caption: 'รอยยิ้มแรก', note: 'a little sunshine.' },
      { src: '/assets/images/3.jpg', caption: 'มุมน่ารัก', note: 'one ordinary, lovely day.' },
      { src: '/assets/images/4-web.webp', caption: 'ความทรงจำดี ๆ', note: 'a moment worth keeping.' },
      { src: '/assets/images/5-web.webp', caption: 'สดใสเสมอ', note: 'the little things.' },
      { src: '/assets/images/6-web.webp', caption: 'วันพิเศษ', note: 'more days like this.' },
      { src: '/assets/images/8-web.webp', caption: 'มิมิวคนเก่ง', note: 'always cheering for you.' },
    ],
  },
  secrets: {
    title: 'A few things,', emphasis: 'from the heart.', description: 'มีคำอวยพรซ่อนอยู่ ลองแตะเปิดทีละใบสิ',
    reveal: 'แตะเพื่อเปิด', close: 'แตะเพื่อพับเก็บ',
    butterflyImage: '/assets/images/wish-butterfly.webp', completeStatus: 'เปิดคำอวยพรครบทุกใบแล้ว',
    cards: [
      { title: 'ถึงวันดี ๆ ของมิว', message: 'ขอให้ปีนี้มีแต่เรื่องดี ๆ เข้ามา ได้เจอคนใจดี มีเรื่องให้ยิ้มได้บ่อย ๆ และมีความสุขกับชีวิตในทุกวันนะ' },
      { title: 'ถึงงานใหม่และอนาคต', message: 'ขอให้ได้งานใหม่ดี ๆ ที่เหมาะกับมิว มีเพื่อนร่วมงานที่ดี และมีคนเห็นคุณค่าของความตั้งใจ ขอให้อนาคตมั่นคงและสดใสอย่างที่หวังไว้นะ' },
      { title: 'ถึงมิวที่น่ารักเสมอ', message: 'ความรักและความใส่ใจที่มิวมีให้พ่อกับแม่เป็นสิ่งที่น่ารักเสมอ ขอให้มิวกับพ่อแม่แข็งแรง มีความสุข และได้อยู่ยิ้มด้วยกันไปอีกนาน ๆ นะ' },
    ],
  },
  cake: {
    title: 'Make a little wish.', emphasis: 'This one is yours.',
    prompt: 'อธิษฐานแล้วแตะที่เปลวไฟเพื่อเป่าเทียน', blowAction: 'เป่าเทียนวันเกิด',
    blown: 'ขอให้คำอธิษฐานของมิวเป็นจริงนะ', dedication: 'ถึง มิมิวคนเก่ง',
    letterTitle: 'สุขสันต์วันเกิดมิมิว', signoff: 'always cheering for you.',
    mainWish: 'สุขสันต์วันเกิด 25 ปีนะมิมิว\nขอให้วัย 25 เป็นปีที่สดใสและมั่นคงอย่างที่หวังไว้นะ ได้เจอคนใจดี ได้งานใหม่ที่ใช่ในสภาพแวดล้อมที่ดี มีคนเห็นคุณค่าในความตั้งใจของมิว และได้เติบโตไปในแบบที่ตัวเองภูมิใจ\nมิวเป็นคนน่ารักที่ใส่ใจครอบครัวและคนรอบข้างเสมอ ขอให้ทั้งมิวและคุณพ่อคุณแม่สุขภาพแข็งแรง มีเรื่องให้ยิ้มด้วยกันเยอะๆ และขอให้ความรักความหวังดีที่มิวมอบให้คนอื่น กลับมาโอบกอดมิวในทุกๆ วันนะ ไม่ว่าปีนี้จะเจออะไร ก็ขอให้มีกำลังใจดีๆ อยู่ข้างๆ เสมอ มีความสุขมากๆ นะมิว!',
    showAll: 'อ่านข้อความทั้งหมด', status: 'เปิดคำอวยพรวันเกิดแล้ว',
  },
  audio: { ambient: '/assets/audio/ambient-cozy.mp3', song: '/assets/audio/music.mp3', ambientVolume: 0.35, songVolume: 0.8, duckVolume: 0.05 },
  // แอนิเมชันเปิดตลอดตามรูปแบบพรีเซนต์ที่ขอ ปรับจังหวะและจำนวนเอฟเฟกต์ได้ที่นี่
  motion: { particles: 18, typewriterMs: 24, gateOpenMs: 1050, fireworksMs: 2600, chapterScrollMs: 1150, wheelThreshold: 35, swipeThreshold: 45, butterflyFlightMs: 7200, butterflyFlapMs: 620 },
  labels: { soundOn: 'เปิดเสียงดนตรี', soundOff: 'ปิดเสียงดนตรี', playSong: 'เล่นเพลง', pauseSong: 'พักเพลง', audioUnavailable: 'เล่นเพลงไม่ได้ ลองเปิดเสียงอีกครั้ง', skip: 'ข้ามไปยังเนื้อหา', songPosition: 'ตำแหน่งเพลง', songVolume: 'ระดับเสียงเพลง', songBack: 'ย้อนเพลง 10 วินาที', songForward: 'ข้ามเพลง 10 วินาที' },
};
