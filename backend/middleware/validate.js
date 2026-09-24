// Small, dependency-free validation helpers used by controllers.

const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function isNonEmptyString(value) {
  return typeof value === 'string' && value.trim().length > 0;
}

function isValidEmail(value) {
  return typeof value === 'string' && EMAIL_REGEX.test(value.trim());
}

function isValidPassword(value) {
  return typeof value === 'string' && value.length >= 6;
}

function isValidPriority(value) {
  return ['low', 'medium', 'high'].includes(value);
}

function isValidStatus(value) {
  return ['open', 'in_progress', 'closed'].includes(value);
}

module.exports = {
  isNonEmptyString,
  isValidEmail,
  isValidPassword,
  isValidPriority,
  isValidStatus,
};
