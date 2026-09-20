/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { School, ViewTab, MealType, MealData, AcademicScheduleItem } from './types';
import { SCHOOL_PRESETS, ALLERGEN_MAP } from './data/constants';
import {
  getKSTDate,
  formatKSTYmd,
  formatKSTHyphenDate,
  checkNeisStatus,
  fetchNeisMeals,
  fetchAcademicSchedule,
  parseNeisDishRaw,
  parseNeisNutrition,
  cleanOriginInfo,
  getKSTWeekDates,
} from './services/neisService';
import { Header } from './components/Header';
import { SchoolCard } from './components/SchoolCard';
import { HeroBanner } from './components/HeroBanner';
import { DateSelector } from './components/DateSelector';
import { AllergyFilter } from './components/AllergyFilter';
import { MealDetailView } from './components/MealDetailView';
import { EmptyMealState } from './components/EmptyMealState';
import { WeeklyMealView } from './components/WeeklyMealView';
import { ScheduleCard } from './components/ScheduleCard';
import { AllergenGuideCard } from './components/AllergenGuideCard';
import { NeisKeyGuideCard } from './components/NeisKeyGuideCard';
import { SchoolModal } from './components/SchoolModal';
import { AllergyModal } from './components/AllergyModal';
import { BottomNav } from './components/BottomNav';
import { Toast } from './components/Toast';

export default function App() {
  // Current School
  const [currentSchool, setCurrentSchool] = useState<School>(() => {
    try {
      const saved = localStorage.getItem('school_meal_school_neis');
      if (saved) return JSON.parse(saved);
    } catch {
      // ignore
    }
    return SCHOOL_PRESETS[0];
  });

  // Selected Date - In KST
  const [selectedDate, setSelectedDate] = useState<Date>(() => getKSTDate());

  // Meal Type (lunch: '2' | dinner: '3' | breakfast: '1')
  const [mealType, setMealType] = useState<MealType>('lunch');

  // Active View Tab ('today' | 'tomorrow' | 'weekly')
  const [viewTab, setViewTab] = useState<ViewTab>('today');

  // Selected Allergens for warning (defaults to 1: 난류, 6: 밀)
  const [selectedAllergens, setSelectedAllergens] = useState<Set<number>>(() => {
    try {
      const saved = localStorage.getItem('school_meal_allergens');
      if (saved) return new Set(JSON.parse(saved));
    } catch {
      // ignore
    }
    return new Set([1, 6]);
  });

  // NEIS API Key status
  const [neisKeyStatus, setNeisKeyStatus] = useState<{
    hasKey: boolean;
    source: string;
    notice: string;
  }>({
    hasKey: false,
    source: '교육부 나이스(NEIS) 교육정보 개방포털',
    notice: '',
  });

  // Meals Cache & State
  const [currentMeal, setCurrentMeal] = useState<MealData | null>(null);
  const [isLoadingMeal, setIsLoadingMeal] = useState<boolean>(true);

  // Weekly meals map
  const [weeklyMealsMap, setWeeklyMealsMap] = useState<Record<string, MealData>>({});
  const [isLoadingWeekly, setIsLoadingWeekly] = useState<boolean>(false);

  // Academic schedule
  const [schedules, setSchedules] = useState<AcademicScheduleItem[]>([]);
  const [isLoadingSchedule, setIsLoadingSchedule] = useState<boolean>(false);

  // Modals & Toast state
  const [schoolModalOpen, setSchoolModalOpen] = useState(false);
  const [allergyModalOpen, setAllergyModalOpen] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage((prev) => (prev === msg ? null : prev));
    }, 2500);
  };

  // Check server NEIS key status on mount
  useEffect(() => {
    checkNeisStatus().then((status) => {
      setNeisKeyStatus(status);
    });
  }, []);

  // Save current school to local storage
  useEffect(() => {
    try {
      localStorage.setItem('school_meal_school_neis', JSON.stringify(currentSchool));
    } catch {
      // ignore
    }
  }, [currentSchool]);

  // Save allergens to local storage
  useEffect(() => {
    try {
      localStorage.setItem(
        'school_meal_allergens',
        JSON.stringify(Array.from(selectedAllergens))
      );
    } catch {
      // ignore
    }
  }, [selectedAllergens]);

  // Handle allergy filter toggling
  const handleToggleAllergen = (id: number) => {
    setSelectedAllergens((prev) => {
      const next = new Set(prev);
      const isAdding = !next.has(id);
      if (isAdding) {
        next.add(id);
        showToast(`'${ALLERGEN_MAP[id]}' 알레르기 경고가 추가되었습니다.`);
      } else {
        next.delete(id);
        showToast(`'${ALLERGEN_MAP[id]}' 알레르기 경고가 해제되었습니다.`);
      }
      return next;
    });
  };

  // Compute active week dates
  const weekDates = useMemo(() => getKSTWeekDates(selectedDate), [selectedDate]);

  // Fetch academic schedule for the active week
  const loadWeekSchedule = useCallback(async () => {
    if (!currentSchool.officeCode || !currentSchool.schoolCode || weekDates.length === 0) return;

    const fromYmd = formatKSTYmd(weekDates[0]);
    const toYmd = formatKSTYmd(weekDates[weekDates.length - 1]);

    setIsLoadingSchedule(true);
    const res = await fetchAcademicSchedule(
      currentSchool.officeCode,
      currentSchool.schoolCode,
      fromYmd,
      toYmd
    );
    setIsLoadingSchedule(false);
    if (res.status === 'success') {
      setSchedules(res.schedules);
    } else {
      setSchedules([]);
    }
  }, [currentSchool, weekDates]);

  useEffect(() => {
    loadWeekSchedule();
  }, [loadWeekSchedule]);

  // Fetch Single Day Meal via NEIS mealServiceDietInfo
  const loadSingleDayMeal = useCallback(async () => {
    const ymd = formatKSTYmd(selectedDate);
    const kstDay = getKSTDate(selectedDate).getDay();
    const isWeekend = kstDay === 0 || kstDay === 6;

    // Check if there is an academic schedule event for this day
    const dayEvent = schedules.find((s) => s.date === ymd);

    setIsLoadingMeal(true);

    const mealCode = mealType === 'breakfast' ? '1' : mealType === 'dinner' ? '3' : '2';
    const mealName = mealType === 'breakfast' ? '조식' : mealType === 'dinner' ? '석식' : '중식';

    const res = await fetchNeisMeals(currentSchool.officeCode, currentSchool.schoolCode, {
      date: ymd,
      mealType,
    });

    setIsLoadingMeal(false);

    if (res.status === 'connection_error') {
      setCurrentMeal({
        date: formatKSTHyphenDate(selectedDate),
        ymd,
        mealType,
        mealCode,
        mealName,
        dishes: [],
        nutrition: {
          calories: '',
          carb: '',
          protein: '',
          fat: '',
          carbPercent: 0,
          proteinPercent: 0,
          fatPercent: 0,
        },
        originInfo: '',
        status: 'connection_error',
        errorMessage: res.message,
        source: res.source,
        scheduleEvent: dayEvent?.eventName,
        dayType: dayEvent?.dayType,
        isWeekend,
      });
      return;
    }

    if (res.status === 'no_data' || !res.meals || res.meals.length === 0) {
      setCurrentMeal({
        date: formatKSTHyphenDate(selectedDate),
        ymd,
        mealType,
        mealCode,
        mealName,
        dishes: [],
        nutrition: {
          calories: '',
          carb: '',
          protein: '',
          fat: '',
          carbPercent: 0,
          proteinPercent: 0,
          fatPercent: 0,
        },
        originInfo: '',
        status: 'no_data',
        errorMessage: res.message,
        source: res.source,
        scheduleEvent: dayEvent?.eventName,
        dayType: dayEvent?.dayType,
        isWeekend,
      });
      return;
    }

    // Match requested meal type
    const foundMeal = res.meals.find((m) => m.mealCode === mealCode) || res.meals[0];

    const dishes = parseNeisDishRaw(foundMeal.dishRaw);
    const nutrition = parseNeisNutrition(foundMeal.nutritionRaw, foundMeal.calories);
    const originInfo = cleanOriginInfo(foundMeal.originRaw);

    setCurrentMeal({
      date: formatKSTHyphenDate(selectedDate),
      ymd,
      mealType,
      mealCode: foundMeal.mealCode,
      mealName: foundMeal.mealName || mealName,
      dishes,
      nutrition,
      originInfo,
      status: 'success',
      source: res.source,
      scheduleEvent: dayEvent?.eventName,
      dayType: dayEvent?.dayType,
      isWeekend,
    });
  }, [currentSchool, selectedDate, mealType, schedules]);

  // Fetch Full Week Meals (Monday through Friday) via NEIS mealServiceDietInfo
  const loadWeeklyMeals = useCallback(async () => {
    if (weekDates.length === 0) return;
    const fromYmd = formatKSTYmd(weekDates[0]);
    const toYmd = formatKSTYmd(weekDates[weekDates.length - 1]);

    setIsLoadingWeekly(true);

    const mealCode = mealType === 'breakfast' ? '1' : mealType === 'dinner' ? '3' : '2';

    const res = await fetchNeisMeals(currentSchool.officeCode, currentSchool.schoolCode, {
      from: fromYmd,
      to: toYmd,
      mealType,
    });

    setIsLoadingWeekly(false);

    const mealMap: Record<string, MealData> = {};

    if (res.status === 'success' && Array.isArray(res.meals)) {
      res.meals.forEach((m) => {
        if (m.mealCode === mealCode) {
          const dishes = parseNeisDishRaw(m.dishRaw);
          const nutrition = parseNeisNutrition(m.nutritionRaw, m.calories);
          const originInfo = cleanOriginInfo(m.originRaw);

          mealMap[m.date] = {
            date: `${m.date.slice(0, 4)}-${m.date.slice(4, 6)}-${m.date.slice(6, 8)}`,
            ymd: m.date,
            mealType,
            mealCode: m.mealCode,
            mealName: m.mealName,
            dishes,
            nutrition,
            originInfo,
            status: 'success',
            source: res.source,
          };
        }
      });
    }

    setWeeklyMealsMap(mealMap);
  }, [currentSchool, weekDates, mealType]);

  // Trigger loads when dependencies change
  useEffect(() => {
    if (viewTab === 'weekly') {
      loadWeeklyMeals();
    } else {
      loadSingleDayMeal();
    }
  }, [viewTab, loadSingleDayMeal, loadWeeklyMeals]);

  // Date Navigation handlers
  const handlePrevDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() - 1);
      return d;
    });
    setViewTab('today');
  };

  const handleNextDay = () => {
    setSelectedDate((prev) => {
      const d = new Date(prev);
      d.setDate(d.getDate() + 1);
      return d;
    });
    setViewTab('today');
  };

  const handleJumpToday = () => {
    setSelectedDate(getKSTDate());
    setViewTab('today');
    showToast('오늘 날짜(KST)로 이동했습니다.');
  };

  const handleJumpNextWeekday = () => {
    const next = new Date(selectedDate);
    do {
      next.setDate(next.getDate() + 1);
    } while (getKSTDate(next).getDay() === 0 || getKSTDate(next).getDay() === 6);

    setSelectedDate(next);
    setViewTab('today');
    showToast('다음 평일 식단으로 이동했습니다.');
  };

  // Direct tab selection (No AI generation, direct NEIS query)
  const handleSelectTab = (tab: ViewTab) => {
    setViewTab(tab);
    if (tab === 'today') {
      setSelectedDate(getKSTDate());
      showToast('오늘 식단을 나이스(NEIS)에서 조회합니다.');
    } else if (tab === 'tomorrow') {
      const tom = getKSTDate();
      tom.setDate(tom.getDate() + 1);
      setSelectedDate(tom);
      showToast('내일 식단을 나이스(NEIS)에서 조회합니다.');
    } else if (tab === 'weekly') {
      showToast('이번 주 주간 식단표를 나이스(NEIS)에서 조회합니다.');
    }
  };

  const handleSelectMealType = (type: MealType) => {
    setMealType(type);
    const label = type === 'breakfast' ? '조식' : type === 'dinner' ? '석식' : '중식';
    showToast(`${label} 식단으로 전환되었습니다.`);
  };

  const handleSelectSchool = (school: School) => {
    setCurrentSchool(school);
    showToast(`${school.schoolName} 급식 정보로 변경되었습니다.`);
  };

  const handleRetry = () => {
    showToast('나이스(NEIS) 서버에 다시 요청 중입니다...');
    if (viewTab === 'weekly') {
      loadWeeklyMeals();
    } else {
      loadSingleDayMeal();
    }
    loadWeekSchedule();
  };

  return (
    <div className="min-h-screen bg-[#f8f9ff] text-[#0b1c30] flex flex-col font-sans selection:bg-blue-100 selection:text-blue-900">
      {/* 1. Fixed Top Header */}
      <Header
        school={currentSchool}
        onOpenSchoolModal={() => setSchoolModalOpen(true)}
        onOpenAllergyModal={() => setAllergyModalOpen(true)}
      />

      {/* 2. Main Scrollable Content */}
      <main className="flex-1 w-full max-w-4xl mx-auto px-4 pt-24 pb-28 flex flex-col">
        {/* Top School & Meal Type Switcher Card */}
        <SchoolCard
          school={currentSchool}
          selectedDate={selectedDate}
          mealType={mealType}
          onSelectMealType={handleSelectMealType}
          onOpenSchoolModal={() => setSchoolModalOpen(true)}
          source={neisKeyStatus.source}
        />

        {/* NEIS API Key Status & Settings Guide Card */}
        <NeisKeyGuideCard
          hasKey={neisKeyStatus.hasKey}
          source={neisKeyStatus.source}
        />

        {/* Visual Hero Banner with Hotlinked Photo */}
        <HeroBanner />

        {/* 3-Tab Segmented Switcher & 5-Day Quick Strip */}
        <DateSelector
          currentTab={viewTab}
          onSelectTab={handleSelectTab}
          selectedDate={selectedDate}
          onSelectDate={(d) => {
            setSelectedDate(d);
            setViewTab('today');
          }}
          onPrevDay={handlePrevDay}
          onNextDay={handleNextDay}
        />

        {/* Academic Schedule Card from NEIS SchoolSchedule */}
        <ScheduleCard
          schedules={schedules}
          loading={isLoadingSchedule}
          schoolName={currentSchool.schoolName}
        />

        {/* Allergy Quick Filter Pill Strip */}
        <AllergyFilter
          selectedAllergens={selectedAllergens}
          onToggleAllergen={handleToggleAllergen}
        />

        {/* Dynamic Meal Content Area (Direct NEIS Query Output) */}
        {viewTab === 'weekly' ? (
          <WeeklyMealView
            weekDates={weekDates}
            weekMealsMap={weeklyMealsMap}
            schedules={schedules}
            mealType={mealType}
            loading={isLoadingWeekly}
            onSelectDay={(d) => {
              setSelectedDate(d);
              setViewTab('today');
            }}
            source={neisKeyStatus.source}
          />
        ) : isLoadingMeal ? (
          <div className="py-14 bg-white rounded-2xl border border-blue-50 flex flex-col items-center justify-center gap-3 text-[#004ac6]">
            <span className="w-7 h-7 border-2 border-[#004ac6] border-t-transparent rounded-full animate-spin"></span>
            <span className="text-[14px] font-bold">
              나이스(NEIS) 학생식단 Open API 실시간 조회 중...
            </span>
          </div>
        ) : currentMeal && currentMeal.status === 'success' && currentMeal.dishes.length > 0 ? (
          <MealDetailView
            meal={currentMeal}
            selectedAllergens={selectedAllergens}
          />
        ) : (
          <EmptyMealState
            status={currentMeal?.status === 'connection_error' ? 'connection_error' : 'no_data'}
            isWeekend={currentMeal?.isWeekend}
            scheduleEvent={currentMeal?.scheduleEvent}
            dayType={currentMeal?.dayType}
            errorMessage={currentMeal?.errorMessage}
            onJumpToday={handleJumpToday}
            onJumpNextWeekday={handleJumpNextWeekday}
            onRetry={handleRetry}
          />
        )}

        {/* 19 Allergen Guide Reference Card */}
        <AllergenGuideCard
          selectedAllergens={selectedAllergens}
          onToggleAllergen={handleToggleAllergen}
        />

        {/* Official Data Source Footer */}
        <footer className="mt-8 pt-4 pb-6 text-center text-[#434655]">
          <div className="flex items-center justify-center gap-1.5 mb-1 text-[#00668a]">
            <span className="material-symbols-outlined text-[16px]">cloud_done</span>
            <span className="text-[12px] font-semibold">
              교육부 나이스(NEIS) 교육정보 개방포털 Open API 실시간 연계
            </span>
          </div>
          <p className="text-[11px] text-[#737686] mb-1">
            식단 및 알레르기 유발물질 정보는 학교 사정 또는 나이스 등록 상황에 따라 변동될 수 있습니다.
          </p>
          <p className="text-[11px] text-[#737686]/70">
            © 2024 School Meal Notice · Powered by NEIS Open API
          </p>
        </footer>
      </main>

      {/* 3. Fixed Bottom Navigation */}
      <BottomNav
        currentTab={viewTab}
        onSelectTab={handleSelectTab}
        onOpenAllergyModal={() => setAllergyModalOpen(true)}
      />

      {/* Modals & Dialogs */}
      <SchoolModal
        isOpen={schoolModalOpen}
        onClose={() => setSchoolModalOpen(false)}
        currentSchool={currentSchool}
        onSelectSchool={handleSelectSchool}
      />

      <AllergyModal
        isOpen={allergyModalOpen}
        onClose={() => setAllergyModalOpen(false)}
        selectedAllergens={selectedAllergens}
        onToggleAllergen={handleToggleAllergen}
      />

      {/* Floating Action Feedback Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
