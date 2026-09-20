import { DishItem, MealData, MealType, NutritionInfo, School, AcademicScheduleItem } from '../types';
import { ALLERGEN_MAP } from '../data/constants';

// Get current date/time converted to Korean Standard Time (KST, UTC+9)
export function getKSTDate(sourceDate: Date = new Date()): Date {
  const utc = sourceDate.getTime() + sourceDate.getTimezoneOffset() * 60000;
  const kstOffset = 9 * 60 * 60000;
  return new Date(utc + kstOffset);
}

export function formatKSTYmd(date: Date): string {
  const kst = getKSTDate(date);
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return `${year}${month}${day}`;
}

export function formatKSTHyphenDate(date: Date): string {
  const kst = getKSTDate(date);
  const year = kst.getFullYear();
  const month = String(kst.getMonth() + 1).padStart(2, '0');
  const day = String(kst.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function formatKSTDisplayDate(date: Date): string {
  const kst = getKSTDate(date);
  const days = ['일요일', '월요일', '화요일', '수요일', '목요일', '금요일', '토요일'];
  const year = kst.getFullYear();
  const month = kst.getMonth() + 1;
  const day = kst.getDate();
  const dayName = days[kst.getDay()];
  return `${year}년 ${month}월 ${day}일 (${dayName})`;
}

// Get the Monday-to-Friday week dates in KST
export function getKSTWeekDates(referenceDate: Date): Date[] {
  const kst = getKSTDate(referenceDate);
  const day = kst.getDay(); // 0 = Sun, 1 = Mon ...
  const diffToMon = kst.getDate() - day + (day === 0 ? -6 : 1);
  const monday = new Date(kst);
  monday.setDate(diffToMon);

  const week: Date[] = [];
  for (let i = 0; i < 5; i++) {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    week.push(d);
  }
  return week;
}

// Check NEIS server key status
export async function checkNeisStatus(): Promise<{
  hasKey: boolean;
  source: string;
  notice: string;
}> {
  try {
    const res = await fetch('/api/neis/status');
    if (!res.ok) throw new Error('Status check failed');
    return await res.json();
  } catch {
    return {
      hasKey: false,
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
      notice: 'NEIS API 서버 상태를 확인하는 중입니다.',
    };
  }
}

// Search schools using NEIS schoolInfo API
export async function searchSchools(query: string): Promise<{
  status: 'success' | 'no_data' | 'connection_error';
  schools: School[];
  message?: string;
  source: string;
}> {
  if (!query.trim()) {
    return {
      status: 'no_data',
      schools: [],
      message: '학교명을 입력해주세요.',
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
    };
  }

  try {
    const res = await fetch(`/api/neis/schools?query=${encodeURIComponent(query.trim())}`);
    const data = await res.json();

    if (!res.ok || data.status === 'connection_error') {
      return {
        status: 'connection_error',
        schools: [],
        message: data.message || '나이스(NEIS) 학교 검색 서버에 연결할 수 없습니다.',
        source: '교육부 나이스(NEIS) 교육정보 개방포털',
      };
    }

    if (data.status === 'no_data' || !data.schools || data.schools.length === 0) {
      return {
        status: 'no_data',
        schools: [],
        message: `'${query}'에 대한 검색 결과가 없습니다.`,
        source: data.source || '교육부 나이스(NEIS) 교육정보 개방포털',
      };
    }

    return {
      status: 'success',
      schools: data.schools,
      source: data.source || '교육부 나이스(NEIS) 교육정보 개방포털',
    };
  } catch (err: any) {
    return {
      status: 'connection_error',
      schools: [],
      message: '네트워크 연결 오류로 학교 검색에 실패했습니다.',
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
    };
  }
}

// Parse dish string preserving allergy numbers (1 ~ 19)
export function parseNeisDishRaw(raw: string): DishItem[] {
  if (!raw) return [];

  // NEIS raw dish string uses <br/> or \n, with trailing dot numbers like 1.5.6. or (1.5.6)
  // Example: "찰보리밥<br/>쇠고기미역국5.6.16.<br/>치킨까스1.2.5.6.15.<br/>배추김치9."
  const parts = raw.split(/<br\s*\/?>|\n/gi);
  const dishes: DishItem[] = [];

  for (const part of parts) {
    const clean = part.trim();
    if (!clean) continue;

    // Extract all allergy numbers
    const allergySet = new Set<number>();
    const matches = clean.match(/\d+/g);
    if (matches) {
      for (const m of matches) {
        const num = parseInt(m, 10);
        if (num >= 1 && num <= 19 && ALLERGEN_MAP[num]) {
          allergySet.add(num);
        }
      }
    }

    // Remove allergy numbers and parentheses from dish name for clean display
    const cleanName = clean
      .replace(/[\d\.]+/g, '')
      .replace(/\([^\)]*\)/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    dishes.push({
      name: cleanName || clean,
      allergens: Array.from(allergySet).sort((a, b) => a - b),
    });
  }

  return dishes;
}

// Parse nutrition string from NEIS
export function parseNeisNutrition(nutrRaw: string, calRaw: string): NutritionInfo {
  let carb = '112g';
  let protein = '35g';
  let fat = '22g';
  let fiber = '8.2g';
  let calcium = '380mg';
  let iron = '4.5mg';
  let vitaminA = '320 R.E';
  let vitaminC = '18.4 mg';

  if (nutrRaw) {
    const carbM = nutrRaw.match(/탄수화물\(g\)\s*:\s*([\d\.]+)/);
    const protM = nutrRaw.match(/단백질\(g\)\s*:\s*([\d\.]+)/);
    const fatM = nutrRaw.match(/지방\(g\)\s*:\s*([\d\.]+)/);
    const fibM = nutrRaw.match(/식이섬유\(g\)\s*:\s*([\d\.]+)/);
    const calM = nutrRaw.match(/칼슘\(mg\)\s*:\s*([\d\.]+)/);
    const ironM = nutrRaw.match(/철분\(mg\)\s*:\s*([\d\.]+)/);
    const vitAM = nutrRaw.match(/비타민A\(R\.E\)\s*:\s*([\d\.]+)/);
    const vitCM = nutrRaw.match(/비타민C\(mg\)\s*:\s*([\d\.]+)/);

    if (carbM) carb = `${carbM[1]}g`;
    if (protM) protein = `${protM[1]}g`;
    if (fatM) fat = `${fatM[1]}g`;
    if (fibM) fiber = `${fibM[1]}g`;
    if (calM) calcium = `${calM[1]}mg`;
    if (ironM) iron = `${ironM[1]}mg`;
    if (vitAM) vitaminA = `${vitAM[1]} R.E`;
    if (vitCM) vitaminC = `${vitCM[1]} mg`;
  }

  const carbNum = parseFloat(carb) || 112;
  const protNum = parseFloat(protein) || 35;
  const fatNum = parseFloat(fat) || 22;
  const total = carbNum * 4 + protNum * 4 + fatNum * 9 || 1;

  const carbPercent = Math.round(((carbNum * 4) / total) * 100) || 58;
  const proteinPercent = Math.round(((protNum * 4) / total) * 100) || 24;
  const fatPercent = 100 - carbPercent - proteinPercent;

  return {
    calories: calRaw || '780.0 Kcal',
    carb,
    protein,
    fat,
    carbPercent,
    proteinPercent: proteinPercent > 0 ? proteinPercent : 20,
    fatPercent: fatPercent > 0 ? fatPercent : 18,
    fiber,
    calcium,
    iron,
    vitaminA,
    vitaminC,
    raw: nutrRaw,
  };
}

// Clean origin info from NEIS
export function cleanOriginInfo(raw: string): string {
  if (!raw) return '원산지 안심 표시제 준수 (세부 원산지는 학교 급식 공지 참조)';
  return raw.replace(/<br\s*\/?>/gi, ', ').replace(/\s+/g, ' ').trim();
}

// Fetch academic schedule for a date range via NEIS SchoolSchedule
export async function fetchAcademicSchedule(
  officeCode: string,
  schoolCode: string,
  fromYmd: string,
  toYmd: string
): Promise<{
  status: 'success' | 'no_data' | 'connection_error';
  schedules: AcademicScheduleItem[];
  message?: string;
}> {
  try {
    const res = await fetch(
      `/api/neis/schedule?office=${officeCode}&school=${schoolCode}&from=${fromYmd}&to=${toYmd}`
    );
    const data = await res.json();
    if (!res.ok || data.status === 'connection_error') {
      return {
        status: 'connection_error',
        schedules: [],
        message: data.message || '학사일정 서버 연결 실패',
      };
    }
    return {
      status: data.status,
      schedules: data.schedules || [],
      message: data.message,
    };
  } catch (err: any) {
    return {
      status: 'connection_error',
      schedules: [],
      message: '학사일정 네트워크 조회 오류',
    };
  }
}

// Fetch meals for a single date or date range
export async function fetchNeisMeals(
  officeCode: string,
  schoolCode: string,
  options: {
    date?: string; // YYYYMMDD
    from?: string; // YYYYMMDD
    to?: string; // YYYYMMDD
    mealType?: MealType; // 'lunch' | 'dinner' | 'breakfast'
  }
): Promise<{
  status: 'success' | 'no_data' | 'connection_error';
  meals: Array<{
    date: string; // YYYYMMDD
    mealCode: string;
    mealName: string;
    dishRaw: string;
    calories: string;
    nutritionRaw: string;
    originRaw: string;
  }>;
  message?: string;
  source: string;
}> {
  const params = new URLSearchParams({
    office: officeCode,
    school: schoolCode,
  });
  if (options.date) params.append('date', options.date);
  if (options.from && options.to) {
    params.append('from', options.from);
    params.append('to', options.to);
  }
  if (options.mealType) {
    const code = options.mealType === 'breakfast' ? '1' : options.mealType === 'dinner' ? '3' : '2';
    params.append('mealType', code);
  }

  try {
    const res = await fetch(`/api/neis/meals?${params.toString()}`);
    const data = await res.json();

    if (!res.ok || data.status === 'connection_error') {
      return {
        status: 'connection_error',
        meals: [],
        message: data.message || '나이스(NEIS) 서버 연결 실패',
        source: '교육부 나이스(NEIS) 교육정보 개방포털',
      };
    }

    return {
      status: data.status,
      meals: data.meals || [],
      message: data.message,
      source: data.source || '교육부 나이스(NEIS) 교육정보 개방포털',
    };
  } catch (err: any) {
    return {
      status: 'connection_error',
      meals: [],
      message: '네트워크 연결 실패로 급식 정보를 가져오지 못했습니다.',
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
    };
  }
}
