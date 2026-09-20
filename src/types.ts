export interface DishItem {
  name: string;
  allergens: number[];
}

export interface NutritionInfo {
  calories: string;
  carb: string;
  protein: string;
  fat: string;
  carbPercent: number;
  proteinPercent: number;
  fatPercent: number;
  vitaminA?: string;
  vitaminC?: string;
  calcium?: string;
  iron?: string;
  fiber?: string;
  raw?: string;
}

export interface MealData {
  date: string; // YYYY-MM-DD
  ymd: string; // YYYYMMDD
  mealType: MealType;
  mealCode: string; // '1': 조식, '2': 중식, '3': 석식
  mealName: string;
  dishes: DishItem[];
  nutrition: NutritionInfo;
  originInfo: string;
  status: 'success' | 'no_data' | 'connection_error';
  errorMessage?: string;
  source: string;
  scheduleEvent?: string; // from SchoolSchedule
  dayType?: string; // '휴업일', '공휴일', '해당없음'
  isWeekend?: boolean;
}

export interface School {
  officeCode: string;
  officeName: string;
  schoolCode: string;
  schoolName: string;
  schoolKind?: string;
  region?: string;
  address: string;
  zipCode?: string;
  tel?: string;
  homepage?: string;
}

export interface AcademicScheduleItem {
  date: string; // YYYYMMDD
  eventName: string;
  content: string;
  dayType: string; // '휴업일', '공휴일', '해당없음'
}

export type ViewTab = 'today' | 'tomorrow' | 'weekly';
export type MealType = 'lunch' | 'dinner' | 'breakfast';
