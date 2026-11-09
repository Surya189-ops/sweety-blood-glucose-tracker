import { Router, type Request, type Response } from 'express';
import { Prisma } from '@prisma/client';
import { prisma } from '../prisma.js';
import { requireAuth } from '../middleware/auth.middleware.js';
import { readingSchema } from '../validation.js';

const router = Router();

router.use(requireAuth);

const slotLabels: Record<string, string> = {
  MORNING: 'Morning (fasting)',
  AFTER_BREAKFAST: 'After breakfast',
  AFTER_LUNCH: 'After lunch',
  AFTER_DINNER: 'After dinner',
};

function getValidationMessage(error: {
  issues: Array<{ message: string }>;
}) {
  return error.issues[0]?.message ?? 'Invalid reading data.';
}

function handleDatabaseError(error: unknown, res: Response) {
  if (
    error instanceof Prisma.PrismaClientKnownRequestError &&
    error.code === 'P2002'
  ) {
    return res.status(409).json({
      message: 'A reading already exists for this time slot and date.',
    });
  }

  console.error(error);
  return res.status(500).json({ message: 'Something went wrong.' });
}

// Add a glucose reading
router.post('/', async (req: Request, res: Response) => {
  const parsed = readingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error),
      errors: parsed.error.flatten(),
    });
  }

  try {
    const { date, slot, value } = parsed.data;
    const readingDate = new Date(`${date}T00:00:00.000Z`);
    const userId = req.userId!;

    const existing = await prisma.glucoseReading.findFirst({
      where: { userId, date: readingDate },
    });

    if (existing && existing.slot === slot) {
      return res.status(409).json({
        message: `You already have a ${slotLabels[slot]} reading for this date.`,
      });
    }

    const count = await prisma.glucoseReading.count({
      where: { userId, date: readingDate },
    });

    if (count >= 4) {
      return res.status(409).json({
        message: 'You can add only 4 readings per day.',
      });
    }

    const reading = await prisma.glucoseReading.create({
      data: { userId, date: readingDate, slot, value },
    });

    return res.status(201).json({
      message: 'Glucose reading added successfully.',
      reading,
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// List only the logged-in user's readings
router.get('/', async (req: Request, res: Response) => {
  try {
    const readings = await prisma.glucoseReading.findMany({
      where: { userId: req.userId! },
      orderBy: [{ date: 'desc' }, { slot: 'asc' }],
    });

    return res.json({ readings });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// Update a reading
router.put('/:id', async (req: Request, res: Response) => {
  const parsed = readingSchema.safeParse(req.body);

  if (!parsed.success) {
    return res.status(400).json({
      message: getValidationMessage(parsed.error),
      errors: parsed.error.flatten(),
    });
  }

  try {
    const { date, slot, value } = parsed.data;
    const userId = req.userId!;
    const readingDate = new Date(`${date}T00:00:00.000Z`);

    const current = await prisma.glucoseReading.findFirst({
      where: { id: req.params.id as string, userId },
    });

    if (!current) {
      return res.status(404).json({ message: 'Reading not found.' });
    }

    const duplicate = await prisma.glucoseReading.findFirst({
      where: {
        userId,
        date: readingDate,
        slot,
        NOT: { id: current.id },
      },
    });

    if (duplicate) {
      return res.status(409).json({
        message: `You already have a ${slotLabels[slot]} reading for this date.`,
      });
    }

    const count = await prisma.glucoseReading.count({
      where: {
        userId,
        date: readingDate,
        NOT: { id: current.id },
      },
    });

    if (count >= 4) {
      return res.status(409).json({
        message: 'You can add only 4 readings per day.',
      });
    }

    const reading = await prisma.glucoseReading.update({
      where: { id: current.id },
      data: { date: readingDate, slot, value },
    });

    return res.json({
      message: 'Glucose reading updated successfully.',
      reading,
    });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

// Delete a reading
router.delete('/:id', async (req: Request, res: Response) => {
  try {
    const current = await prisma.glucoseReading.findFirst({
      where: { id: req.params.id as string, userId: req.userId! },
    });

    if (!current) {
      return res.status(404).json({ message: 'Reading not found.' });
    }

    await prisma.glucoseReading.delete({
      where: { id: current.id },
    });

    return res.json({ message: 'Glucose reading deleted successfully.' });
  } catch (error) {
    return handleDatabaseError(error, res);
  }
});

export default router;
