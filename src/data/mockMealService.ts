import { MealData, MealType } from '../types';

export const LUNCH_SETS = [
  {
    dishes: [
      { name: '혼합잡곡밥', allergens: [] },
      { name: '쇠고기미역국', allergens: [5, 6, 16] },
      { name: '수제치킨까스', allergens: [1, 2, 5, 6, 15] },
      { name: '골뱅이채소무침', allergens: [5, 6, 17, 18] },
      { name: '배추김치', allergens: [9] },
      { name: '유기농 사과주스', allergens: [] },
    ],
    calories: '840.5 Kcal',
    carb: '118g',
    protein: '36g',
    fat: '24g',
    carbPercent: 57,
    proteinPercent: 24,
    fatPercent: 19,
    originInfo: '쌀(국내산), 쇠고기(한우), 닭고기(국내산 무항생제), 김치(국내산 배추, 고춧가루)',
  },
  {
    dishes: [
      { name: '찰보리밥', allergens: [] },
      { name: '돼지고기김치찌개', allergens: [5, 6, 9, 10] },
      { name: '치즈계란말이', allergens: [1, 2] },
      { name: '시금치나물무침', allergens: [5, 6] },
      { name: '깍두기', allergens: [9] },
      { name: '샤인머스캣', allergens: [] },
    ],
    calories: '785.2 Kcal',
    carb: '108g',
    protein: '34g',
    fat: '23g',
    carbPercent: 56,
    proteinPercent: 25,
    fatPercent: 19,
    originInfo: '돼지고기(국내산 1등급), 계란(무항생제 1등급), 쌀(국내산), 고춧가루(국내산)',
  },
  {
    dishes: [
      { name: '차수수밥', allergens: [] },
      { name: '맑은콩나물국', allergens: [5] },
      { name: '안동찜닭', allergens: [5, 6, 15] },
      { name: '해물해초파전', allergens: [1, 5, 6, 9, 17] },
      { name: '열무김치', allergens: [9] },
      { name: '친환경 방울토마토', allergens: [12] },
    ],
    calories: '812.0 Kcal',
    carb: '112g',
    protein: '38g',
    fat: '21g',
    carbPercent: 58,
    proteinPercent: 26,
    fatPercent: 16,
    originInfo: '닭고기(국내산), 오징어(국내산), 쌀(친환경 유기농), 김치(국내산)',
  },
  {
    dishes: [
      { name: '발아현미밥', allergens: [] },
      { name: '어묵우동국', allergens: [1, 5, 6, 7] },
      { name: '매콤돼지갈비찜', allergens: [5, 6, 10] },
      { name: '도토리묵야채무침', allergens: [5, 6] },
      { name: '배추김치', allergens: [9] },
      { name: '감귤', allergens: [] },
    ],
    calories: '860.4 Kcal',
    carb: '122g',
    protein: '35g',
    fat: '25g',
    carbPercent: 58,
    proteinPercent: 23,
    fatPercent: 19,
    originInfo: '돼지고기(국내산), 어묵(명태연육), 쌀(국내산), 김치(국내산)',
  },
  {
    dishes: [
      { name: '클로렐라밥', allergens: [] },
      { name: '순두부백탕', allergens: [1, 5, 6, 18] },
      { name: '소불고기표고볶음', allergens: [5, 6, 16] },
      { name: '단호박범벅샐러드', allergens: [1, 2] },
      { name: '깍두기', allergens: [9] },
      { name: '망고푸딩', allergens: [1, 2] },
    ],
    calories: '792.8 Kcal',
    carb: '115g',
    protein: '32g',
    fat: '22g',
    carbPercent: 59,
    proteinPercent: 23,
    fatPercent: 18,
    originInfo: '쇠고기(한우), 순두부(국내산 대두), 쌀(국내산), 김치(국내산)',
  },
];

export const DINNER_SETS = [
  {
    dishes: [
      { name: '찰흑미밥', allergens: [] },
      { name: '부대찌개&라면사리', allergens: [1, 2, 5, 6, 9, 10, 15, 16] },
      { name: '감자채베이컨볶음', allergens: [10] },
      { name: '오이부추생채', allergens: [] },
      { name: '석박지', allergens: [9] },
      { name: '비타민음료', allergens: [] },
    ],
    calories: '890.1 Kcal',
    carb: '126g',
    protein: '33g',
    fat: '28g',
    carbPercent: 57,
    proteinPercent: 21,
    fatPercent: 22,
    originInfo: '햄/베이컨(돼지고기:국내산), 쌀(국내산), 김치(국내산)',
  },
  {
    dishes: [
      { name: '기장밥', allergens: [] },
      { name: '참치김치찌개', allergens: [5, 6, 9] },
      { name: '함박스테이크&데미소스', allergens: [1, 2, 5, 6, 10, 16] },
      { name: '마카로니콘샐러드', allergens: [1, 5, 6] },
      { name: '깍두기', allergens: [9] },
      { name: '요구르트', allergens: [2] },
    ],
    calories: '845.0 Kcal',
    carb: '116g',
    protein: '34g',
    fat: '25g',
    carbPercent: 57,
    proteinPercent: 23,
    fatPercent: 20,
    originInfo: '쇠고기(호주산), 돼지고기(국내산), 쌀(국내산), 배추(국내산)',
  },
];

export function getMealForDate(date: Date, mealType: MealType): MealData {
  const dayOfWeek = date.getDay();
  const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const dateStr = `${year}-${month}-${day}`;
  const ymd = `${year}${month}${day}`;

  if (isWeekend) {
    return {
      date: dateStr,
      ymd,
      mealType,
      mealCode: mealType === 'breakfast' ? '1' : mealType === 'dinner' ? '3' : '2',
      mealName: mealType === 'breakfast' ? '조식' : mealType === 'dinner' ? '석식' : '중식',
      status: 'no_data',
      isWeekend: true,
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
      dishes: [],
      nutrition: {
        calories: '0 Kcal',
        carb: '0g',
        protein: '0g',
        fat: '0g',
        carbPercent: 0,
        proteinPercent: 0,
        fatPercent: 0,
      },
      originInfo: '',
    };
  }

  // Pick deterministic set based on date day
  const pool = mealType === 'lunch' ? LUNCH_SETS : DINNER_SETS;
  const setIndex = (date.getDate() + (mealType === 'dinner' ? 1 : 0)) % pool.length;
  const mealItem = pool[setIndex];

  return {
    date: dateStr,
    ymd,
    mealType,
    mealCode: mealType === 'breakfast' ? '1' : mealType === 'dinner' ? '3' : '2',
    mealName: mealType === 'breakfast' ? '조식' : mealType === 'dinner' ? '석식' : '중식',
    status: 'success',
    source: '교육부 나이스(NEIS) 교육정보 개방포털',
    isWeekend: false,
    dishes: mealItem.dishes,
    nutrition: {
      calories: mealItem.calories,
      carb: mealItem.carb,
      protein: mealItem.protein,
      fat: mealItem.fat,
      carbPercent: mealItem.carbPercent,
      proteinPercent: mealItem.proteinPercent,
      fatPercent: mealItem.fatPercent,
    },
    originInfo: mealItem.originInfo,
  };
}

export function formatKoreanDate(date: Date): string {
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const dayName = days[date.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

export function getWeekDates(referenceDate: Date): Date[] {
  const day = referenceDate.getDay();
  const diffToMon = referenceDate.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(referenceDate);
  monday.setDate(diffToMon);

  const week: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}
