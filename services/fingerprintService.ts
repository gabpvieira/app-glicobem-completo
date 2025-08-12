// Simple hash function. Not cryptographically secure, but good enough for a stable fingerprint.
const hashString = (str: string): string => {
  let hash = 0;
  if (str.length === 0) return hash.toString();
  for (let i = 0; i < str.length; i++) {
    const char = str.charCodeAt(i);
    hash = (hash << 5) - hash + char;
    hash |= 0; // Convert to 32bit integer
  }
  return hash.toString();
};

export const getFingerprint = async (): Promise<string> => {
    // Collect browser/device characteristics
    const components = [
        navigator.userAgent,
        navigator.language,
        new Date().getTimezoneOffset().toString(),
        window.screen.height.toString(),
        window.screen.width.toString(),
        window.screen.colorDepth.toString(),
        (navigator.hardwareConcurrency || 'unknown').toString(),
        ((navigator as any).deviceMemory || 'unknown').toString(),
    ];

    const fingerprintString = components.join('||');
    return hashString(fingerprintString);
};