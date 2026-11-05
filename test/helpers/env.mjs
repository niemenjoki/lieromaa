// Sets environment variables for the duration of fn and restores them afterwards.
// An undefined value removes the variable: assigning undefined to process.env
// would store the string "undefined" instead.
export async function withEnv(env, fn) {
  const previousValues = new Map();

  for (const [key, value] of Object.entries(env)) {
    previousValues.set(key, process.env[key]);

    if (value === undefined) {
      delete process.env[key];
    } else {
      process.env[key] = value;
    }
  }

  try {
    return await fn();
  } finally {
    for (const [key, value] of previousValues.entries()) {
      if (value === undefined) {
        delete process.env[key];
      } else {
        process.env[key] = value;
      }
    }
  }
}
