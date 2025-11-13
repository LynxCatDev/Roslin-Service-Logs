const DRAFTS_KEY = 'service-logs-drafts';
const LOGS_KEY = 'service-logs';

// Drafts
export const saveDrafts = <T>(drafts: T[]): void => {
  localStorage.setItem(DRAFTS_KEY, JSON.stringify(drafts));
};

export const getDrafts = <T>(): T[] => {
  const data = localStorage.getItem(DRAFTS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveDraft = <T extends { id: string }>(draft: T): void => {
  const drafts = getDrafts<T>();
  const index = drafts.findIndex((d: any) => d.id === draft.id);

  if (index !== -1) {
    drafts[index] = draft;
  } else {
    drafts.push(draft);
  }

  saveDrafts(drafts);
};

export const deleteDraft = (id: string): void => {
  const drafts = getDrafts<any>();
  const filtered = drafts.filter((d) => d.id !== id);
  saveDrafts(filtered);
};

export const clearAllDrafts = (): void => {
  localStorage.removeItem(DRAFTS_KEY);
};

// Service Logs
export const saveLogs = <T>(logs: T[]): void => {
  localStorage.setItem(LOGS_KEY, JSON.stringify(logs));
};

export const getLogs = <T>(): T[] => {
  const data = localStorage.getItem(LOGS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveLog = <T extends { id: string }>(log: T): void => {
  const logs = getLogs<T>();
  const index = logs.findIndex((l: any) => l.id === log.id);

  if (index !== -1) {
    logs[index] = log;
  } else {
    logs.push(log);
  }

  saveLogs(logs);
};

export const deleteLog = (id: string): void => {
  const logs = getLogs<any>();
  const filtered = logs.filter((l) => l.id !== id);
  saveLogs(filtered);
};
