export const measureCRP = () => {
  if (typeof window === 'undefined' || !window.performance) return null;

  const timing = window.performance.timing;
  const interactive = timing.domInteractive - timing.navigationStart;
  const dcl = timing.domContentLoadedEventEnd - timing.navigationStart;
  const complete = timing.domComplete - timing.navigationStart;

  return {
    interactive,
    dcl,
    complete
  };
};

export const measureLCP = (callback: (duration: number) => void) => {
  if (typeof window === 'undefined') return;

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      callback(entry.startTime);
    }
  }).observe({ entryTypes: ['largest-contentful-paint'] });
};

export const measureFID = (callback: (duration: number) => void) => {
  if (typeof window === 'undefined') return;

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      callback(entry.processingStart - entry.startTime);
    }
  }).observe({ entryTypes: ['first-input'] });
};

export const measureCLS = (callback: (value: number) => void) => {
  if (typeof window === 'undefined') return;

  let clsValue = 0;
  let clsEntries: any[] = [];

  new PerformanceObserver((entryList) => {
    for (const entry of entryList.getEntries()) {
      if (!entry.hadRecentInput) {
        const firstSessionEntry = clsEntries[0];
        const lastSessionEntry = clsEntries[clsEntries.length - 1];

        if (
          firstSessionEntry &&
          entry.startTime - lastSessionEntry.startTime < 1000 &&
          entry.startTime - firstSessionEntry.startTime < 5000
        ) {
          clsValue += entry.value;
          clsEntries.push(entry);
        } else {
          clsEntries = [entry];
          clsValue = entry.value;
        }
      }
    }
    callback(clsValue);
  }).observe({ entryTypes: ['layout-shift'] });
};