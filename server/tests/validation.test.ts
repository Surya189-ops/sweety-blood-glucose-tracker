import { describe, expect, it } from 'vitest';
import {
  registerSchema,
  loginSchema,
  readingSchema,
} from '../src/validation.js';

const today = new Intl.DateTimeFormat('en-CA', {
  timeZone: 'Asia/Kolkata',
}).format(new Date());

const validReading = {
  date: today,
  slot: 'MORNING',
  value: 110,
};

describe('Registration validation', () => {
  it('accepts valid registration data', () => {
    expect(registerSchema.safeParse({
      name: 'Surya',
      email: 'surya@example.com',
      password: 'Password123',
    }).success).toBe(true);
  });

  it('rejects invalid email and short password', () => {
    expect(registerSchema.safeParse({
      name: 'Surya',
      email: 'invalid',
      password: '123',
    }).success).toBe(false);
  });
});

describe('Login validation', () => {
  it('accepts valid login data', () => {
    expect(loginSchema.safeParse({
      email: 'surya@example.com',
      password: 'password123',
    }).success).toBe(true);
  });

  it('rejects missing password', () => {
    expect(loginSchema.safeParse({
      email: 'surya@example.com',
      password: '',
    }).success).toBe(false);
  });
});

describe('Glucose reading validation', () => {
  it('accepts a valid reading', () => {
    expect(readingSchema.safeParse(validReading).success).toBe(true);
  });

  it('accepts boundary values 40 and 600', () => {
    expect(readingSchema.safeParse({ ...validReading, value: 40 }).success).toBe(true);
    expect(readingSchema.safeParse({ ...validReading, value: 600 }).success).toBe(true);
  });

  it('rejects values below 40 and above 600', () => {
    expect(readingSchema.safeParse({ ...validReading, value: 39 }).success).toBe(false);
    expect(readingSchema.safeParse({ ...validReading, value: 601 }).success).toBe(false);
  });

  it('rejects decimal values', () => {
    expect(readingSchema.safeParse({ ...validReading, value: 110.5 }).success).toBe(false);
  });

  it('rejects future dates', () => {
    expect(readingSchema.safeParse({
      ...validReading,
      date: '2099-01-01',
    }).success).toBe(false);
  });

  it('rejects impossible calendar dates', () => {
    expect(readingSchema.safeParse({
      ...validReading,
      date: '2026-02-30',
    }).success).toBe(false);
  });

  it('rejects invalid time slots', () => {
    expect(readingSchema.safeParse({
      ...validReading,
      slot: 'MIDNIGHT',
    }).success).toBe(false);
  });

  it('rejects missing glucose values', () => {
    const { value, ...missingValue } = validReading;
    expect(readingSchema.safeParse(missingValue).success).toBe(false);
  });
});
