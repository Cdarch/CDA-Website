// ===========================================================================
// projects.js — מקור הנתונים של פרויקטי האתר
// כדי להוסיף / לערוך / להסיר פרויקטים: ערכו ישירות את המערך מטה.
// השדות:
//   id        - מזהה ייחודי (יופיע בכתובת URL של הפרויקט). אנגלית, ללא רווחים.
//   name      - שם הפרויקט המוצג
//   location  - מיקום (אופציונלי, למשל "תל אביב")
//   developer - שם היזם
//   buildings - מספר בניינים (אופציונלי)
//   units     - יח"ד
//   floors    - קומות
//   parking   - מרתפי חניה
//   area      - שטח במ"ר
//   type      - סוג פרויקט (אופציונלי, למשל "תמ"א חיזוק")
//   status    - סטטוס (אופציונלי, "בתכנון" / "בביצוע" / "הושלם")
//   note      - הערה תחתונה (אופציונלי)
//   cover     - נתיב לתמונת הכריכה (יחסי לתיקיית site/)
//   images    - מערך תמונות לגלריה / lightbox
// כדי להוסיף תמונה: שמרו את הקובץ ב-assets/projects/ והוסיפו את הנתיב למערך.
// ===========================================================================
window.PROJECTS = [
  {
    id: "yehuda-hanasi",
    name: 'יהודה הנשיא 9-11',
    location: '',
    developer: 'שלום את נתן',
    buildings: '2 בניינים',
    units: '72 יח"ד',
    floors: '10 קומות',
    parking: '3 מרתפי חניה',
    area: '13,500 מ"ר',
    status: 'בתכנון',
    note: 'תוכנן והוגש תחת אתגר נול אדריכלים',
    cover: 'assets/projects/yehuda-hanasi-1.jpg',
    images: [
      'assets/projects/yehuda-hanasi-1.jpg',
      'assets/projects/yehuda-hanasi-2.jpg',
    ],
  },
  {
    id: 'einstein-19',
    name: 'איינשטיין 19',
    location: '',
    developer: 'שלום את נתן – אזורים',
    buildings: '2 בניינים',
    units: '78 יח"ד',
    floors: '9-10 קומות',
    parking: '3.5 מרתפי חניה',
    area: '14,900 מ"ר',
    cover: 'assets/projects/einstein-19-3.jpg',
    images: [
      'assets/projects/einstein-19-3.jpg',
      'assets/projects/einstein-19-1.jpg',
      'assets/projects/einstein-19-2.jpg',
    ],
  },
  {
    id: 'einstein-21-27',
    name: 'איינשטיין 21-27',
    location: '',
    developer: 'אבן דרך - שיכון ובינוי',
    units: '67 יח"ד',
    floors: '9 קומות',
    parking: '3 מרתפי חניה',
    area: '13,300 מ"ר',
    cover: 'assets/projects/einstein-21-27.jpg',
    images: ['assets/projects/einstein-21-27.jpg'],
  },
  {
    id: 'amoraim-andersen',
    name: 'אמוראים – אנדרסן',
    location: '',
    developer: 'אקרו נדל"ן – יובלים',
    buildings: '3 בניינים',
    units: '107 יח"ד',
    floors: '10 קומות',
    parking: '3 מרתפי חניה',
    area: '21,000 מ"ר',
    cover: 'assets/projects/amoraim-andersen-1.jpg',
    images: [
      'assets/projects/amoraim-andersen-1.jpg',
      'assets/projects/amoraim-andersen-2.jpg',
      'assets/projects/amoraim-andersen-3.jpg',
    ],
  },
  {
    id: 'onkelos-13',
    name: 'אונקלוס 13',
    location: '',
    developer: 'ינושבסקי בע"מ',
    units: '28 יח"ד',
    floors: '8 קומות',
    parking: '2 מרתפי חניה',
    area: '4,300 מ"ר',
    cover: 'assets/projects/onkelos-13.jpg',
    images: ['assets/projects/onkelos-13.jpg', 'assets/projects/onkelos-13-2.jpg'],
  },
  {
    id: 'weizmann-105',
    name: 'ויצמן 105',
    location: '',
    developer: 'ינושבסקי',
    units: '21 יח"ד',
    floors: '9 קומות',
    parking: '3 מרתפי חניה',
    area: '3,600 מ"ר',
    cover: 'assets/projects/weizmann-105.jpg',
    images: ['assets/projects/weizmann-105.jpg'],
  },
  {
    id: 'feivel-6',
    name: 'פייבל 6',
    location: '',
    developer: 'ינושבסקי',
    units: '16 יח"ד',
    floors: '8 קומות',
    parking: '2 מרתפי חניה',
    area: '3,400 מ"ר',
    cover: 'assets/projects/feivel-6.jpg',
    images: ['assets/projects/feivel-6.jpg'],
  },
  {
    id: 'arba-aratzot-23',
    name: 'ארבע ארצות 23',
    location: '',
    developer: 'ורד תשובה',
    type: 'תמ"א חיזוק',
    units: '13 יח"ד',
    floors: '6 קומות',
    parking: 'מרתף חניה רובוטי',
    area: '1,600 מ"ר',
    cover: 'assets/projects/arba-aratzot-23-front.jpg',
    images: [
      'assets/projects/arba-aratzot-23-front.jpg',
      'assets/projects/arba-aratzot-23-back.jpg',
    ],
  },
  {
    id: 'arba-aratzot-25',
    name: 'ארבע ארצות 25',
    location: '',
    developer: 'ורד תשובה',
    type: 'תמ"א חיזוק',
    units: '17 יח"ד',
    floors: '6 קומות',
    parking: 'מרתף חניה רובוטי',
    area: '1,800 מ"ר',
    cover: 'assets/projects/arba-aratzot-25-front.jpg',
    images: [
      'assets/projects/arba-aratzot-25-front.jpg',
      'assets/projects/arba-aratzot-25-back.jpg',
    ],
  },
  {
    id: 'zhabotinsky-40-42',
    name: 'ז\'בוטינסקי 40-42',
    location: 'תל אביב',
    developer: 'קבוצת גבאי',
    status: 'בביצוע',
    units: '29 יח"ד',
    floors: '7 קומות',
    parking: '2 מרתפי חניה',
    area: '3,627 מ"ר',
    note: 'במסגרת עבודתי בדאובר אדריכלים',
    cover: 'assets/projects/zhabotinsky-40-42.jpg',
    images: ['assets/projects/zhabotinsky-40-42.jpg'],
  },
  {
    id: 'shilo-3',
    name: 'שילה 3',
    location: 'תל אביב',
    developer: 'רון משולמי',
    status: 'בתכנון',
    units: '22 יח"ד',
    floors: '8 קומות',
    parking: '3 מרתפי חניה',
    area: '2,900 מ"ר',
    note: 'במסגרת עבודתי באתגר נול אדריכלים',
    cover: 'assets/projects/shilo-3.jpg',
    images: ['assets/projects/shilo-3.jpg'],
  },
  {
    id: 'binyamini-18',
    name: 'בנימיני 18',
    location: '',
    developer: '',
    cover: 'assets/projects/binyamini-18.jpg',
    images: ['assets/projects/binyamini-18.jpg'],
  },
];

window.CLIENTS = [
  { name: 'אזורים', logo: 'assets/clients/azorim.jpeg' },
  { name: 'אבן דרך', logo: 'assets/clients/even-derech.jpeg' },
  { name: 'שיכון ובינוי', logo: 'assets/clients/shikun-binui.jpeg' },
  { name: 'ינושבסקי', logo: 'assets/clients/yanushevski.jpeg' },
  { name: 'יובלים', logo: 'assets/clients/yuvalim.jpeg' },
  { name: 'אקרו נדל"ן', logo: 'assets/clients/akro.jpeg' },
];

window.FEATURED_IDS = [
  'yehuda-hanasi',
  'einstein-19',
  'amoraim-andersen',
  'zhabotinsky-40-42',
  'einstein-21-27',
  'arba-aratzot-23',
];
