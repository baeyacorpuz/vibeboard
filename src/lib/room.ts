import { collection, doc, onSnapshot, setDoc, serverTimestamp, getDoc, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import { getUserId } from './utils'

export type Mood = 'happy' | 'neutral' | 'stressed' | 'productive' | 'tired'

// Create or join a room
export async function joinRoom(roomId: string): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  
  if (!roomSnap.exists()) {
    // Create room if it doesn't exist
    await setDoc(roomRef, {
      createdAt: serverTimestamp(),
    })
  }
}

export async function submitMood(roomId: string, mood: Mood): Promise<void> {
  const userId = getUserId()
  const moodRef = doc(db, 'rooms', roomId, 'moods', userId)
  
  await setDoc(moodRef, {
    mood,
    updatedAt: serverTimestamp(),
  }, { merge: true })
}

export interface MoodData {
  mood: string
  updatedAt: Date | null
}

export function subscribeToMoods(
  roomId: string,
  callback: (moods: MoodData[]) => void
): Unsubscribe {
  const moodsCollection = collection(db, 'rooms', roomId, 'moods')
  
  return onSnapshot(moodsCollection, (snapshot) => {
    const moods: MoodData[] = snapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        mood: data.mood,
        updatedAt: data.updatedAt?.toDate() || null,
      }
    })
    callback(moods)
  })
}
