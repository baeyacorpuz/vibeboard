// Generate and persist anonymous user ID
export function getUserId(): string {
  let uid: string | null = null;

  try {
    uid = localStorage.getItem('moodmeter_uid');
  } catch (e) {
    console.warn('localStorage not available, using session-only ID');
  }

  if (!uid) {
    uid = crypto.randomUUID();
    try {
      localStorage.setItem('moodmeter_uid', uid);
    } catch (e) {
      // Silent fail - ID will be regenerated on page reload
      // This is acceptable for an anonymous mood app
    }
  }

  return uid;
}
