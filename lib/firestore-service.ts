import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  type DocumentData,
  type QueryConstraint,
  Timestamp,
} from "firebase/firestore"
import { db } from "./firebase"

// Generic type for database operations
export async function getDocument<T>(collectionName: string, id: string): Promise<T | null> {
  try {
    const docRef = doc(db, collectionName, id)
    const docSnap = await getDoc(docRef)

    if (docSnap.exists()) {
      return { id: docSnap.id, ...docSnap.data() } as T
    } else {
      return null
    }
  } catch (error) {
    console.error(`Error getting document from ${collectionName}:`, error)
    throw error
  }
}

export async function getDocuments<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
  try {
    const collectionRef = collection(db, collectionName)
    const q = query(collectionRef, ...constraints)
    const querySnapshot = await getDocs(q)

    return querySnapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }) as T)
  } catch (error) {
    console.error(`Error getting documents from ${collectionName}:`, error)
    throw error
  }
}

export async function addDocument<T extends DocumentData>(collectionName: string, data: T): Promise<string> {
  try {
    const collectionRef = collection(db, collectionName)
    const docRef = await addDoc(collectionRef, {
      ...data,
      createdAt: Timestamp.now(),
    })
    return docRef.id
  } catch (error) {
    console.error(`Error adding document to ${collectionName}:`, error)
    throw error
  }
}

export async function updateDocument<T extends DocumentData>(
  collectionName: string,
  id: string,
  data: Partial<T>,
): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)
    await updateDoc(docRef, {
      ...data,
      updatedAt: Timestamp.now(),
    })
  } catch (error) {
    console.error(`Error updating document in ${collectionName}:`, error)
    throw error
  }
}

export async function deleteDocument(collectionName: string, id: string): Promise<void> {
  try {
    const docRef = doc(db, collectionName, id)
    await deleteDoc(docRef)
  } catch (error) {
    console.error(`Error deleting document from ${collectionName}:`, error)
    throw error
  }
}

// Class-specific operations
export async function getClassById(id: string) {
  return getDocument<Class>("classes", id)
}

export async function getClassesByTeacher(teacherId: string) {
  return getDocuments<Class>("classes", [where("teacherId", "==", teacherId), orderBy("createdAt", "desc")])
}

export async function getClassByCode(code: string) {
  const classes = await getDocuments<Class>("classes", [where("code", "==", code), limit(1)])
  return classes.length > 0 ? classes[0] : null
}

export async function createClass(classData: Omit<Class, "id" | "createdAt">) {
  return addDocument<Omit<Class, "id">>("classes", classData)
}

export async function updateClass(id: string, data: Partial<Class>) {
  return updateDocument<Class>("classes", id, data)
}

export async function deleteClass(id: string) {
  return deleteDocument("classes", id)
}

// Assignment operations
export async function getAssignmentsByClass(classId: string) {
  return getDocuments<Assignment>("assignments", [where("classId", "==", classId), orderBy("dueDate", "asc")])
}

export async function createAssignment(assignmentData: Omit<Assignment, "id" | "createdAt">) {
  return addDocument<Omit<Assignment, "id">>("assignments", assignmentData)
}

// Submission operations
export async function getSubmissionsByAssignment(assignmentId: string) {
  return getDocuments<Submission>("submissions", [where("assignmentId", "==", assignmentId)])
}

export async function getSubmissionsByStudent(userId: string, classId: string) {
  return getDocuments<Submission>("submissions", [where("userId", "==", userId), where("classId", "==", classId)])
}

// Enrollment operations
export async function getEnrollmentsByClass(classId: string) {
  return getDocuments<Enrollment>("enrollments", [where("classId", "==", classId)])
}

export async function getEnrollmentsByUser(userId: string) {
  return getDocuments<Enrollment>("enrollments", [where("userId", "==", userId)])
}

export async function enrollUserInClass(enrollmentData: Omit<Enrollment, "id" | "joinedAt">) {
  return addDocument<Omit<Enrollment, "id">>("enrollments", enrollmentData)
}

// Announcement operations
export async function getAnnouncementsByClass(classId: string) {
  return getDocuments<Announcement>("announcements", [where("classId", "==", classId), orderBy("createdAt", "desc")])
}

export async function createAnnouncement(announcementData: Omit<Announcement, "id" | "createdAt">) {
  return addDocument<Omit<Announcement, "id">>("announcements", announcementData)
}

// Comment operations
export async function getCommentsByParent(parentId: string, parentType: string) {
  return getDocuments<Comment>("comments", [
    where("parentId", "==", parentId),
    where("parentType", "==", parentType),
    orderBy("createdAt", "asc"),
  ])
}

export async function createComment(commentData: Omit<Comment, "id" | "createdAt">) {
  return addDocument<Omit<Comment, "id">>("comments", commentData)
}

// Type definitions
export interface Class {
  id: string
  name: string
  section: string
  description: string
  teacherId: string
  code: string
  color?: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Assignment {
  id: string
  classId: string
  title: string
  description: string
  dueDate: Timestamp
  points: number
  submissionType?: "document" | "text" | "link" | "multiple"
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Submission {
  id: string
  assignmentId: string
  userId: string
  classId: string
  content: string
  attachmentUrls?: string[]
  grade?: number
  feedback?: string
  status: "draft" | "submitted" | "graded" | "late"
  submittedAt: Timestamp
  gradedAt?: Timestamp
}

export interface Enrollment {
  id: string
  userId: string
  classId: string
  role: "student" | "teacher"
  joinedAt: Timestamp
}

export interface Announcement {
  id: string
  classId: string
  userId: string
  content: string
  attachmentUrls?: string[]
  createdAt: Timestamp
  updatedAt?: Timestamp
}

export interface Comment {
  id: string
  parentId: string
  parentType: "announcement" | "assignment" | "submission"
  userId: string
  content: string
  createdAt: Timestamp
  updatedAt?: Timestamp
}
