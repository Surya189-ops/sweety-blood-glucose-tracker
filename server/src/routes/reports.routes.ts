import { Router, type Request, type Response } from 'express';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.middleware.js';

const router = Router();

router.use(requireAuth);

const slotOrder = [
  'MORNING',
  'AFTER_BREAKFAST',
  'AFTER_LUNCH',
  'AFTER_DINNER',
];

function getSelectedDate(value: unknown): Date | null {
  if (typeof value !== 'string' || !/^\d{4}-\d{2}-\d{2}$/.test(value)) {
    return null;
  }

  const date = new Date(`${value}T00:00:00.000Z`);

  if (
    Number.isNaN(date.getTime()) ||
    date.toISOString().slice(0, 10) !== value
  ) {
    return null;
  }

  return date;
}

function getSummary(readings: { value: number }[]) {
  const values = readings.map((reading) => reading.value);

  if (values.length === 0) {
    return {
      highest: null,
      lowest: null,
      average: null,
      totalReadings: 0,
      hasData: false,
    };
  }

  return {
    highest: Math.max(...values),
    lowest: Math.min(...values),
    average: Number(
      (values.reduce((sum, value) => sum + value, 0) / values.length).toFixed(1)
    ),
    totalReadings: values.length,
    hasData: true,
  };
}

async function fetchReport(
  userId: string,
  startDate: Date,
  endDate: Date,
) {
  const readings = await prisma.glucoseReading.findMany({
    where: {
      userId,
      date: {
        gte: startDate,
        lt: endDate,
      },
    },
    orderBy: [{ date: 'asc' }, { slot: 'asc' }],
  });

  readings.sort((a, b) => {
    const dateDifference = a.date.getTime() - b.date.getTime();

    if (dateDifference !== 0) return dateDifference;

    return slotOrder.indexOf(a.slot) - slotOrder.indexOf(b.slot);
  });

  return {
    ...getSummary(readings),
    readings,
  };
}

// Daily report
router.get('/daily', async (req: Request, res: Response) => {
  const date = getSelectedDate(req.query.date);

  if (!date) {
    return res.status(400).json({
      message: 'Please provide a valid date in YYYY-MM-DD format.',
    });
  }

  const tomorrow = new Date(date);
  tomorrow.setUTCDate(tomorrow.getUTCDate() + 1);

  try {
    const report = await fetchReport(req.userId!, date, tomorrow);

    return res.json({
      reportType: 'daily',
      date: req.query.date,
      ...report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to generate daily report.' });
  }
});

// Month-to-date report
router.get('/month-to-date', async (req: Request, res: Response) => {
  const date = getSelectedDate(req.query.date);

  if (!date) {
    return res.status(400).json({
      message: 'Please provide a valid date in YYYY-MM-DD format.',
    });
  }

  const startDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    1,
  ));

  const endDate = new Date(date);
  endDate.setUTCDate(endDate.getUTCDate() + 1);

  try {
    const report = await fetchReport(req.userId!, startDate, endDate);

    return res.json({
      reportType: 'month-to-date',
      startDate: startDate.toISOString().slice(0, 10),
      endDate: req.query.date,
      ...report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to generate month-to-date report.' });
  }
});

// Previous calendar month report
router.get('/monthly', async (req: Request, res: Response) => {
  const date = getSelectedDate(req.query.date);

  if (!date) {
    return res.status(400).json({
      message: 'Please provide a valid date in YYYY-MM-DD format.',
    });
  }

  const startDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth() - 1,
    1,
  ));

  const endDate = new Date(Date.UTC(
    date.getUTCFullYear(),
    date.getUTCMonth(),
    1,
  ));

  try {
    const report = await fetchReport(req.userId!, startDate, endDate);

    return res.json({
      reportType: 'monthly',
      startDate: startDate.toISOString().slice(0, 10),
      endDate: new Date(endDate.getTime() - 86400000)
        .toISOString().slice(0, 10),
      ...report,
    });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: 'Unable to generate monthly report.' });
  }
});

export default router;
