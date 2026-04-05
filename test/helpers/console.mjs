export async function withMutedConsole(fn, methods = ['error']) {
  const originals = new Map();

  for (const method of methods) {
    originals.set(method, console[method]);
    console[method] = () => {};
  }

  try {
    return await fn();
  } finally {
    for (const [method, original] of originals.entries()) {
      console[method] = original;
    }
  }
}
