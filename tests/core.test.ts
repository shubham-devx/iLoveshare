import test from 'node:test';
import assert from 'node:assert/strict';
import {
  MAX_PHOTOS,
  MAX_PHOTO_SIZE_BYTES,
  MAX_PDF_SIZE_BYTES,
  MAX_AUDIO_SIZE_BYTES,
  ALLOWED_IMAGE_TYPES,
  ALLOWED_PDF_TYPES,
  ALLOWED_AUDIO_TYPES,
} from '../src/lib/constants.ts';
import {
  generateToken,
  formatFileSize,
  isValidEmail,
  getInitials,
  slugify,
} from '../src/lib/utils.ts';
import {
  experienceCreateSchema,
  responseSubmissionSchema,
  contactFormSchema,
  profileUpdateSchema,
  sanitizePlainText,
} from '../src/lib/validations.ts';
import { checkRateLimit } from '../src/lib/rate-limit.ts';

test('File upload limits enforce 4 photos and 5MB per photo', () => {
  assert.equal(MAX_PHOTOS, 4);
  assert.equal(MAX_PHOTO_SIZE_BYTES, 5 * 1024 * 1024);
  assert.equal(MAX_PDF_SIZE_BYTES, 10 * 1024 * 1024);
  assert.equal(MAX_AUDIO_SIZE_BYTES, 20 * 1024 * 1024);
  assert.ok(ALLOWED_IMAGE_TYPES.includes('image/jpeg'));
  assert.ok(ALLOWED_IMAGE_TYPES.includes('image/png'));
  assert.ok(ALLOWED_PDF_TYPES.includes('application/pdf'));
  assert.ok(ALLOWED_AUDIO_TYPES.includes('audio/mpeg'));
});

test('generateToken produces unguessable URL-safe unique tokens', () => {
  const t1 = generateToken(32);
  const t2 = generateToken(32);
  assert.equal(t1.length, 32);
  assert.equal(t2.length, 32);
  assert.notEqual(t1, t2);
  assert.match(t1, /^[A-Za-z0-9]+$/);
});

test('utility helpers format and validate properly', () => {
  assert.equal(formatFileSize(500), '500 B');
  assert.equal(formatFileSize(2048), '2.0 KB');
  assert.equal(formatFileSize(5 * 1024 * 1024), '5.0 MB');
  assert.equal(isValidEmail('user@iloveshare.com'), true);
  assert.equal(isValidEmail('not-an-email'), false);
  assert.equal(getInitials('Priya Sharma'), 'PS');
  assert.equal(slugify('Happy Birthday!'), 'happy-birthday');
});

test('experienceCreateSchema validates valid and invalid payloads', () => {
  const valid = experienceCreateSchema.safeParse({
    title: 'Birthday for Priya',
    type: 'birthday',
    recipient_type: 'friend',
    recipient_name: 'Priya',
    sender_name: 'Aarav',
    message: 'Happy birthday!',
    theme: 'romantic',
    animations: ['confetti', 'cake'],
    language: 'en',
  });
  assert.equal(valid.success, true);

  const invalid = experienceCreateSchema.safeParse({
    title: '',
    type: 'birthday',
    recipient_type: 'friend',
    recipient_name: '',
    sender_name: 'Aarav',
  });
  assert.equal(invalid.success, false);
});

test('responseSubmissionSchema enforces 1-5 star rating and required token', () => {
  const valid = responseSubmissionSchema.safeParse({
    token: 'abc123456789',
    response_type: 'thank_you',
    response_value: 'Thank You',
    star_rating: 5,
    written_feedback: 'Loved it!',
  });
  assert.equal(valid.success, true);

  const invalidRating = responseSubmissionSchema.safeParse({
    token: 'abc123456789',
    response_type: 'thank_you',
    response_value: 'Thank You',
    star_rating: 6,
  });
  assert.equal(invalidRating.success, false);
});

test('contactFormSchema and profileUpdateSchema validate inputs', () => {
  assert.equal(
    contactFormSchema.safeParse({
      name: 'Riya',
      email: 'riya@example.com',
      subject: 'Question',
      message: 'Hello, I have a question about iLoveShare.',
    }).success,
    true
  );

  assert.equal(
    profileUpdateSchema.safeParse({
      full_name: 'Riya Kapoor',
      bio: 'Creating surprises.',
    }).success,
    true
  );

  assert.equal(sanitizePlainText('<script>alert(1)</script>'), '&lt;script&gt;alert(1)&lt;/script&gt;');
});

test('checkRateLimit enforces sliding window limit', () => {
  const key = `test-${Date.now()}`;
  const r1 = checkRateLimit(key, 2, 60_000);
  const r2 = checkRateLimit(key, 2, 60_000);
  const r3 = checkRateLimit(key, 2, 60_000);
  assert.equal(r1.allowed, true);
  assert.equal(r2.allowed, true);
  assert.equal(r3.allowed, false);
  assert.equal(r3.remaining, 0);
});
