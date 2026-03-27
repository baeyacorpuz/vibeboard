// Generate and persist anonymous user ID
export function getUserId(): string {
  let uid = localStorage.getItem('moodmeter_uid')
  if (!uid) {
    uid = crypto.randomUUID()
    localStorage.setItem('moodmeter_uid', uid)
  }
  return uid
}
