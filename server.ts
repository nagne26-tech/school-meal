import express from 'express';
import path from 'path';
import { createServer as createViteServer } from 'vite';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = 3000;

app.use(express.json());

const NEIS_BASE_URL = 'https://open.neis.go.kr/hub';

// Helper to get NEIS API key from server environment
function getNeisApiKey(): string | undefined {
  const key = process.env.NEIS_API_KEY?.trim();
  return key && key.length > 0 ? key : undefined;
}

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok' });
});

// 1. Status API: Check if NEIS_API_KEY is configured
app.get('/api/neis/status', (req, res) => {
  const hasKey = Boolean(getNeisApiKey());
  res.json({
    status: 'ok',
    hasKey,
    source: '교육부 나이스(NEIS) 교육정보 개방포털',
    notice: hasKey
      ? '서버 Secret NEIS_API_KEY 인증키가 안전하게 연결되어 있습니다.'
      : 'NEIS_API_KEY가 미등록되어 공공 기본 한도로 호출 중입니다. Settings > Secrets에 NEIS_API_KEY를 등록하면 안정적인 대용량 조회가 가능합니다.',
  });
});

// 2. School Search API: schoolInfo
app.get('/api/neis/schools', async (req, res) => {
  const query = (req.query.query as string)?.trim();
  if (!query) {
    return res.status(400).json({ error: '학교명을 입력해주세요.' });
  }

  const apiKey = getNeisApiKey();
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '30',
    SCHUL_NM: query,
  });
  if (apiKey) params.append('KEY', apiKey);

  const url = `${NEIS_BASE_URL}/schoolInfo?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        status: 'connection_error',
        message: '나이스(NEIS) 서버 응답 오류가 발생했습니다. (HTTP ' + response.status + ')',
      });
    }

    const data: any = await response.json();

    // Check for NEIS RESULT error code
    if (data.RESULT) {
      if (data.RESULT.CODE === 'INFO-200') {
        return res.json({
          status: 'no_data',
          schools: [],
          message: '검색된 학교가 없습니다.',
        });
      }
      return res.status(400).json({
        status: 'api_error',
        code: data.RESULT.CODE,
        message: data.RESULT.MESSAGE || '학교 정보를 조회할 수 없습니다.',
      });
    }

    if (data.schoolInfo && data.schoolInfo[1] && Array.isArray(data.schoolInfo[1].row)) {
      const rows = data.schoolInfo[1].row;
      const schools = rows.map((r: any) => ({
        officeCode: r.ATPT_OFCDC_SC_CODE,
        officeName: r.ATPT_OFCDC_SC_NM,
        schoolCode: r.SD_SCHUL_CODE,
        schoolName: r.SCHUL_NM,
        schoolKind: r.SCHUL_KND_SC_NM,
        region: r.LCTN_SC_NM,
        address: r.ORG_RDNMA || r.ORG_RDNMA_INFO || r.LCTN_SC_NM || '',
        zipCode: r.ORG_RDNZP || '',
        tel: r.ORG_TELNO || '',
        homepage: r.HMPG_ADRES || '',
      }));
      return res.json({
        status: 'success',
        source: '교육부 나이스(NEIS) 교육정보 개방포털',
        schools,
      });
    }

    return res.json({
      status: 'no_data',
      schools: [],
      message: '검색된 학교가 없습니다.',
    });
  } catch (err: any) {
    console.error('NEIS schools fetch error:', err);
    return res.status(503).json({
      status: 'connection_error',
      message: '나이스(NEIS) 교육정보 서버에 연결할 수 없습니다. 네트워크 상태를 확인해주세요.',
      error: err?.message,
    });
  }
});

// 3. Meal Service API: mealServiceDietInfo
app.get('/api/neis/meals', async (req, res) => {
  const officeCode = (req.query.office as string)?.trim();
  const schoolCode = (req.query.school as string)?.trim();
  const date = (req.query.date as string)?.trim(); // YYYYMMDD
  const from = (req.query.from as string)?.trim(); // YYYYMMDD
  const to = (req.query.to as string)?.trim(); // YYYYMMDD
  const mealType = (req.query.mealType as string)?.trim(); // 1: 조식, 2: 중식, 3: 석식 (선택)

  if (!officeCode || !schoolCode) {
    return res.status(400).json({ error: '교육청 코드와 학교 코드가 필요합니다.' });
  }

  const apiKey = getNeisApiKey();
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: officeCode,
    SD_SCHUL_CODE: schoolCode,
  });
  if (apiKey) params.append('KEY', apiKey);

  if (date) {
    params.append('MLSV_YMD', date);
  } else if (from && to) {
    params.append('MLSV_FROM_YMD', from);
    params.append('MLSV_TO_YMD', to);
  }
  if (mealType) {
    params.append('MMEAL_SC_CODE', mealType);
  }

  const url = `${NEIS_BASE_URL}/mealServiceDietInfo?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        status: 'connection_error',
        message: '나이스(NEIS) 서버 응답 오류가 발생했습니다. (HTTP ' + response.status + ')',
      });
    }

    const data: any = await response.json();

    if (data.RESULT) {
      if (data.RESULT.CODE === 'INFO-200') {
        return res.json({
          status: 'no_data',
          meals: [],
          source: '교육부 나이스(NEIS) 교육정보 개방포털',
          message: '선택하신 날짜에 등록된 급식 정보가 없습니다. (주말, 방학 또는 식단 미등록)',
        });
      }
      return res.status(400).json({
        status: 'api_error',
        code: data.RESULT.CODE,
        message: data.RESULT.MESSAGE || '급식 정보를 조회할 수 없습니다.',
      });
    }

    if (data.mealServiceDietInfo && data.mealServiceDietInfo[1] && Array.isArray(data.mealServiceDietInfo[1].row)) {
      const rows = data.mealServiceDietInfo[1].row;
      const meals = rows.map((r: any) => ({
        date: r.MLSV_YMD, // YYYYMMDD
        mealCode: r.MMEAL_SC_CODE, // "1", "2", "3"
        mealName: r.MMEAL_SC_NM, // "조식", "중식", "석식"
        dishRaw: r.DDISH_NM,
        calories: r.CAL_INFO || '',
        nutritionRaw: r.NUTR_INFO || '',
        originRaw: r.ORPLC_INFO || '',
      }));

      return res.json({
        status: 'success',
        source: '교육부 나이스(NEIS) 교육정보 개방포털',
        meals,
      });
    }

    return res.json({
      status: 'no_data',
      meals: [],
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
      message: '해당 기간의 급식 정보가 없습니다.',
    });
  } catch (err: any) {
    console.error('NEIS meals fetch error:', err);
    return res.status(503).json({
      status: 'connection_error',
      message: '나이스(NEIS) 교육정보 서버에 연결할 수 없습니다. 잠시 후 다시 시도해주세요.',
      error: err?.message,
    });
  }
});

// 4. Academic Schedule API: SchoolSchedule
app.get('/api/neis/schedule', async (req, res) => {
  const officeCode = (req.query.office as string)?.trim();
  const schoolCode = (req.query.school as string)?.trim();
  const from = (req.query.from as string)?.trim(); // YYYYMMDD
  const to = (req.query.to as string)?.trim(); // YYYYMMDD

  if (!officeCode || !schoolCode || !from || !to) {
    return res.status(400).json({ error: '교육청 코드, 학교 코드, 시작일, 종료일이 필요합니다.' });
  }

  const apiKey = getNeisApiKey();
  const params = new URLSearchParams({
    Type: 'json',
    pIndex: '1',
    pSize: '100',
    ATPT_OFCDC_SC_CODE: officeCode,
    SD_SCHUL_CODE: schoolCode,
    AA_FROM_YMD: from,
    AA_TO_YMD: to,
  });
  if (apiKey) params.append('KEY', apiKey);

  const url = `${NEIS_BASE_URL}/SchoolSchedule?${params.toString()}`;

  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 6000);
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeout);

    if (!response.ok) {
      return res.status(502).json({
        status: 'connection_error',
        message: '나이스(NEIS) 학사일정 서버 응답 오류입니다.',
      });
    }

    const data: any = await response.json();

    if (data.RESULT) {
      if (data.RESULT.CODE === 'INFO-200') {
        return res.json({
          status: 'no_data',
          schedules: [],
          source: '교육부 나이스(NEIS) 교육정보 개방포털',
          message: '해당 기간에 등록된 학사일정이 없습니다.',
        });
      }
      return res.status(400).json({
        status: 'api_error',
        code: data.RESULT.CODE,
        message: data.RESULT.MESSAGE || '학사일정을 조회할 수 없습니다.',
      });
    }

    if (data.SchoolSchedule && data.SchoolSchedule[1] && Array.isArray(data.SchoolSchedule[1].row)) {
      const rows = data.SchoolSchedule[1].row;
      const schedules = rows.map((r: any) => ({
        date: r.AA_YMD, // YYYYMMDD
        eventName: r.EVENT_NM || '',
        content: r.EVENT_CNTNT || '',
        dayType: r.SBTR_DD_SC_NM || '', // '해당없음', '휴업일', '공휴일'
      }));

      return res.json({
        status: 'success',
        source: '교육부 나이스(NEIS) 교육정보 개방포털',
        schedules,
      });
    }

    return res.json({
      status: 'no_data',
      schedules: [],
      source: '교육부 나이스(NEIS) 교육정보 개방포털',
      message: '학사일정이 없습니다.',
    });
  } catch (err: any) {
    console.error('NEIS schedule fetch error:', err);
    return res.status(503).json({
      status: 'connection_error',
      message: '나이스(NEIS) 학사일정 서버에 연결할 수 없습니다.',
      error: err?.message,
    });
  }
});

// Vite middleware setup
async function startServer() {
  if (process.env.NODE_ENV !== 'production') {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Server running on http://0.0.0.0:${PORT}`);
  });
}

startServer();
