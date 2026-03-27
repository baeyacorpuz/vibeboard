import { collection, doc, onSnapshot, setDoc, serverTimestamp, getDoc, updateDoc, getDocs, query, orderBy, writeBatch, type Unsubscribe } from 'firebase/firestore'
import { db } from './firebase'
import { getUserId } from './utils'

export type Mood = 'happy' | 'neutral' | 'stressed' | 'productive' | 'tired'

export interface RoomData {
  id: string
  createdAt: Date | null
  name: string | null
  createdBy: string | null
  // Kept for backwards compatibility
  archived?: boolean
  archivedAt?: Date | null
  moodSnapshot?: MoodSnapshot[]
}

export interface MoodSnapshot {
  mood: string
  count: number
}

export interface MoodData {
  mood: string
  updatedAt: Date | null
}

export interface SnapshotData {
  id: string
  createdAt: Date | null
  createdBy: string | null
  moods: MoodSnapshot[]
  totalParticipants: number
}

// Create or join a room
export async function joinRoom(roomId: string): Promise<RoomData> {
  const userId = getUserId()
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  
  if (!roomSnap.exists()) {
    // Create room if it doesn't exist
    await setDoc(roomRef, {
      createdAt: serverTimestamp(),
      createdBy: userId,
    })
  }
  
  return getRoom(roomId)
}

// Get room data
export async function getRoom(roomId: string): Promise<RoomData> {
  const roomRef = doc(db, 'rooms', roomId)
  const roomSnap = await getDoc(roomRef)
  
  if (!roomSnap.exists()) {
    throw new Error('Room not found')
  }
  
  const data = roomSnap.data()
  return {
    id: roomSnap.id,
    createdAt: data.createdAt?.toDate() || null,
    name: data.name || null,
    createdBy: data.createdBy || null,
    archived: data.archived || false,
    archivedAt: data.archivedAt?.toDate() || null,
    moodSnapshot: data.moodSnapshot || [],
  }
}

// Update room name
export async function updateRoomName(roomId: string, name: string): Promise<void> {
  const roomRef = doc(db, 'rooms', roomId)
  const trimmedName = name.trim().slice(0, 50)
  
  await updateDoc(roomRef, {
    name: trimmedName,
  })
}

// Create a snapshot of current moods and clear them
export async function createSnapshot(roomId: string): Promise<string> {
  const userId = getUserId()
  
  // Fetch all current moods
  const moodsCollection = collection(db, 'rooms', roomId, 'moods')
  const moodsSnap = await getDocs(moodsCollection)
  
  // Count moods
  const moodCounts: Record<string, number> = {}
  let totalParticipants = 0
  moodsSnap.forEach((docSnap) => {
    const mood = docSnap.data().mood
    moodCounts[mood] = (moodCounts[mood] || 0) + 1
    totalParticipants++
  })
  
  // Convert to snapshot array
  const moodSnapshot: MoodSnapshot[] = Object.entries(moodCounts).map(([mood, count]) => ({
    mood,
    count,
  }))
  
  // Create snapshot document
  const snapshotId = crypto.randomUUID()
  const snapshotRef = doc(db, 'rooms', roomId, 'snapshots', snapshotId)
  
  await setDoc(snapshotRef, {
    createdAt: serverTimestamp(),
    createdBy: userId,
    moods: moodSnapshot,
    totalParticipants,
  })
  
  // Clear all moods from the room using batch delete
  if (totalParticipants > 0) {
    const batch = writeBatch(db)
    moodsSnap.forEach((docSnap) => {
      batch.delete(docSnap.ref)
    })
    await batch.commit()
  }
  
  return snapshotId
}

// Get all snapshots for a room
export async function getSnapshots(roomId: string): Promise<SnapshotData[]> {
  const snapshotsRef = collection(db, 'rooms', roomId, 'snapshots')
  const q = query(snapshotsRef, orderBy('createdAt', 'desc'))
  
  const snapshot = await getDocs(q)
  return snapshot.docs.map((doc) => {
    const data = doc.data()
    return {
      id: doc.id,
      createdAt: data.createdAt?.toDate() || null,
      createdBy: data.createdBy || null,
      moods: data.moods || [],
      totalParticipants: data.totalParticipants || 0,
    }
  })
}

// Get a specific snapshot
export async function getSnapshot(roomId: string, snapshotId: string): Promise<SnapshotData> {
  const snapshotRef = doc(db, 'rooms', roomId, 'snapshots', snapshotId)
  const snapshotSnap = await getDoc(snapshotRef)
  
  if (!snapshotSnap.exists()) {
    throw new Error('Snapshot not found')
  }
  
  const data = snapshotSnap.data()
  return {
    id: snapshotSnap.id,
    createdAt: data.createdAt?.toDate() || null,
    createdBy: data.createdBy || null,
    moods: data.moods || [],
    totalParticipants: data.totalParticipants || 0,
  }
}

// Get archived rooms (kept for backwards compatibility)
export async function getArchivedRooms(): Promise<RoomData[]> {
  const roomsRef = collection(db, 'rooms')
  
  const snapshot = await getDocs(roomsRef)
  return snapshot.docs
    .map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        createdAt: data.createdAt?.toDate() || null,
        name: data.name || null,
        createdBy: data.createdBy || null,
        archived: data.archived || false,
        archivedAt: data.archivedAt?.toDate() || null,
        moodSnapshot: data.moodSnapshot || [],
      }
    })
    .filter((room) => room.archived)
    .sort((a, b) => {
      const dateA = a.archivedAt?.getTime() || 0
      const dateB = b.archivedAt?.getTime() || 0
      return dateB - dateA
    })
}

// Get archived room with mood snapshot (kept for backwards compatibility)
export async function getArchivedRoom(roomId: string): Promise<RoomData> {
  const room = await getRoom(roomId)
  
  if (!room.archived) {
    throw new Error('Room is not archived')
  }
  
  return room
}

export async function submitMood(roomId: string, mood: Mood): Promise<void> {
  const userId = getUserId()
  const moodRef = doc(db, 'rooms', roomId, 'moods', userId)
  
  await setDoc(moodRef, {
    mood,
    updatedAt: serverTimestamp(),
  }, { merge: true })
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

// Get the current user's mood in a room
export async function getUserMood(roomId: string): Promise<Mood | null> {
  const userId = getUserId()
  const moodRef = doc(db, 'rooms', roomId, 'moods', userId)
  const moodSnap = await getDoc(moodRef)
  
  if (!moodSnap.exists()) {
    return null
  }
  
  return moodSnap.data().mood as Mood
}