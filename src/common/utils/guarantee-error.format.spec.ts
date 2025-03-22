// Ajuste le chemin si nécessaire

import { guaranteeErrorFormat } from './guarantee-error.format';

describe('guaranteeErrorFormat', () => {
  // 1️⃣ Cas normal : L'objet contient bien `code', `message', et `stack`
  it('should return true for an object with valid code, message, and stack', () => {
    const error = {
      code: 'DB_ERROR',
      message: 'Database failed',
      stack: 'stack trace',
    };
    expect(guaranteeErrorFormat(error)).toBe(true);
  });

  // 2️⃣ Cas où `message` est absent (optionnel)
  it('should return true if only code and stack are present', () => {
    const error = { code: 'DB_ERROR', stack: 'stack trace' };
    expect(guaranteeErrorFormat(error)).toBe(true);
  });

  // 3️⃣ Cas où `stack` est absent (optionnel)
  it('should return true if only code and message are present', () => {
    const error = { code: 'DB_ERROR', message: 'Some error' };
    expect(guaranteeErrorFormat(error)).toBe(true);
  });

  // 4️⃣ Cas où `code` est un nombre (incorrect)
  it('should return false if code is not a string', () => {
    const error = { code: 123, message: 'Invalid code', stack: 'stack trace' };
    expect(guaranteeErrorFormat(error)).toBe(false);
  });

  // 5️⃣ Cas où `code` est totalement absent
  it('should return false if code is missing', () => {
    const error = { message: 'No code', stack: 'stack trace' };
    expect(guaranteeErrorFormat(error)).toBe(false);
  });

  // 6️⃣ Cas où `message` n'est pas un string
  it('should return false if message is not a string', () => {
    const error = { code: 'DB_ERROR', message: 404, stack: 'stack trace' };
    expect(guaranteeErrorFormat(error)).toBe(false);
  });

  // 7️⃣ Cas où `stack` n'est pas un string
  it('should return false if stack is not a string', () => {
    const error = {
      code: 'DB_ERROR',
      message: 'Something went wrong',
      stack: 12345,
    };
    expect(guaranteeErrorFormat(error)).toBe(false);
  });

  // 8️⃣ Cas où l'objet est complètement vide
  it('should return false for an empty object', () => {
    const error = {};
    expect(guaranteeErrorFormat(error)).toBe(false);
  });

  // 9️⃣ Cas où `error` est `null`
  it('should return false for null', () => {
    expect(guaranteeErrorFormat(null)).toBe(false);
  });

  // 🔟 Cas où `error` est `undefined`
  it('should return false for undefined', () => {
    expect(guaranteeErrorFormat(undefined)).toBe(false);
  });

  // 1️⃣1️⃣ Cas où `error` est une chaîne de caractères
  it('should return false for a string', () => {
    expect(guaranteeErrorFormat('Some error message')).toBe(false);
  });

  // 1️⃣2️⃣ Cas où `error` est un tableau
  it('should return false for an array', () => {
    expect(guaranteeErrorFormat(['DB_ERROR', 'stack trace'])).toBe(false);
  });

  // 1️⃣3️⃣ Cas où `error` est une fonction
  it('should return false for a function', () => {
    expect(guaranteeErrorFormat(() => {})).toBe(false);
  });

  // 1️⃣4️⃣ Cas où `error` est un nombre
  it('should return false for a number', () => {
    expect(guaranteeErrorFormat(404)).toBe(false);
  });
});
