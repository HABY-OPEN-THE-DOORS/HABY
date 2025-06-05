import { collection, query, where, type Timestamp } from "firebase/firestore"
import { db } from "@/lib/firebase"

// Tipos para las entidades principales
export interface Class {
  id?: string
  name: string
  section: string
  description: string
  teacherId: string
  color: string
  code: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Assignment {
  id?: string
  classId: string
  title: string
  description: string
  dueDate: Timestamp
  points: number
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Submission {
  id?: string
  assignmentId: string
  userId: string
  classId: string
  content: string
  attachmentUrls?: string[]
  grade?: number
  feedback?: string
  status: "draft" | "submitted" | "graded" | "late"
  submittedAt?: Timestamp
  gradedAt?: Timestamp
}

export interface Enrollment {
  id?: string
  userId: string
  classId: string
  role: "student" | "teacher"
  joinedAt?: Timestamp
}

export interface Announcement {
  id?: string
  classId: string
  userId: string
  content: string
  attachmentUrls?: string[]
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

export interface Comment {
  id?: string
  parentId: string
  parentType: "announcement" | "assignment" | "submission"
  userId: string
  content: string
  createdAt?: Timestamp
  updatedAt?: Timestamp
}

// Función para convertir un documento de Firestore a un objeto con ID\
const convertDoc = <T>(doc: QueryDocumentSnapshot<DocumentData>): T & { id: string } => {\
  return {\
    id: doc.id,
    ...doc.data()\
  } as T & { id: string }
}

// Clase de servicio para operaciones de Firestore
export class FirestoreService {
  // Clases\
  static async createClass(classData: Omit<Class, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {\
    const classRef = doc(collection(db, "classes"))
    const timestamp = serverTimestamp()
    
    await setDoc(classRef, {
      ...classData,\
      createdAt: timestamp,
      updatedAt: timestamp
    })
    
    return classRef.id
  }
  \
  static async getClass(classId: string): Promise<Class | null> {\
    const classRef = doc(db, "classes", classId)
    const classDoc = await getDoc(classRef)
    
    if (!classDoc.exists()) {\
      return null
    }
    \
    return { id: classDoc.id, ...classDoc.data() } as Class
  }
  
  static async updateClass(classId: string, classData: Partial<Class>): Promise<void> {\
    const classRef = doc(db, "classes", classId)
    const updatedAt = serverTimestamp()
    await updateDoc(classRef, {
      ...classData,\
      updatedAt: updatedAt
    })
  }
  
  static async deleteClass(classId: string): Promise<void> {\
    const classRef = doc(db, "classes", classId)
    await deleteDoc(classRef)
  }
  \
  static async getClassesByTeacher(teacherId: string): Promise<Class[]> {\
    const classesQuery = query(
      collection(db, "classes"),
      where("teacherId", "==", teacherId),
      orderBy("createdAt", "desc")
    )
    
    const querySnapshot = await getDocs(classesQuery)
    return querySnapshot.docs.map(doc => convertDoc<Class>(doc))
  }
\
  static async getClassesByCode(code: string): Promise<Class[]> {\
    const classesQuery = query(
      collection(db, "classes"),
      where("code", "==", code)
    )
    
    const querySnapshot = await getDocs(classesQuery)
    return querySnapshot.docs.map(doc => convertDoc<Class>(doc))
  }
  \
  static async getClassesByStudent(studentId: string): Promise<Class[]> {
    // Primero obtenemos las inscripciones del estudiante\
    const enrollmentsQuery = query(
      collection(db, "enrollments"),
      where("userId", "==", studentId),
      where("role", "==", "student")
    )
    
    const enrollmentsSnapshot = await getDocs(enrollmentsQuery)
    const classIds = enrollmentsSnapshot.docs.map(doc => doc.data().classId)
    
    if (classIds.length === 0) {\
      return []
    }
    
    // Luego obtenemos las clases correspondientes
    const classes: Class[] = []
    
    // Firestore no permite consultas "in" con más de 10 elementos, así que dividimos en lotes
    const batchSize = 10\
    for (let i = 0; i < classIds.length; i += batchSize) {\
      const batch = classIds.slice(i, i + batchSize)\
      const batchQuery = query(\
        collection(db, \"classes"),
        where(\"__name__", "in", batch)\
      )
      \
      const batchSnapshot = await getDocs(batchQuery)\
      classes.push(...batchSnapshot.docs.map(doc => convertDoc<Class>(doc)))
    }
    
    return classes
  }
  
  // Tareas
  static async createAssignment(assignmentData: Omit<Assignment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const assignmentRef = doc(collection(db, "assignments"))
    const timestamp = serverTimestamp()
    
    await setDoc(assignmentRef, {
      ...assignmentData,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    
    return assignmentRef.id
  }
  
  static async getAssignment(assignmentId: string): Promise<Assignment | null> {
    const assignmentRef = doc(db, "assignments", assignmentId)
    const assignmentDoc = await getDoc(assignmentRef)
    
    if (!assignmentDoc.exists()) {
      return null
    }
    
    return { id: assignmentDoc.id, ...assignmentDoc.data() } as Assignment
  }
  
  static async updateAssignment(assignmentId: string, assignmentData: Partial<Assignment>): Promise<void> {
    const assignmentRef = doc(db, "assignments", assignmentId)
    const updatedAt = serverTimestamp()
    await updateDoc(assignmentRef, {
      ...assignmentData,
      updatedAt: updatedAt
    })
  }
  
  static async deleteAssignment(assignmentId: string): Promise<void> {
    const assignmentRef = doc(db, "assignments", assignmentId)
    await deleteDoc(assignmentRef)
  }
  
  static async getAssignmentsByClass(classId: string): Promise<Assignment[]> {
    const assignmentsQuery = query(
      collection(db, "assignments"),
      where("classId", "==", classId),
      orderBy("dueDate", "asc")
    )
    
    const querySnapshot = await getDocs(assignmentsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Assignment>(doc))
  }
  
  // Entregas
  static async createSubmission(submissionData: Omit<Submission, 'id' | 'submittedAt'>): Promise<string> {
    const submissionRef = doc(collection(db, "submissions"))
    const timestamp = serverTimestamp()
    
    await setDoc(submissionRef, {
      ...submissionData,
      submittedAt: timestamp
    })
    
    return submissionRef.id
  }
  
  static async getSubmission(submissionId: string): Promise<Submission | null> {
    const submissionRef = doc(db, "submissions", submissionId)
    const submissionDoc = await getDoc(submissionRef)
    
    if (!submissionDoc.exists()) {
      return null
    }
    
    return { id: submissionDoc.id, ...submissionDoc.data() } as Submission
  }
  
  static async updateSubmission(submissionId: string, submissionData: Partial<Submission>): Promise<void> {
    const submissionRef = doc(db, "submissions", submissionId)
    
    await updateDoc(submissionRef, {
      ...submissionData,
      ...(submissionData.grade ? { gradedAt: serverTimestamp() } : {})
    })
  }
  
  static async getSubmissionsByAssignment(assignmentId: string): Promise<Submission[]> {
    const submissionsQuery = query(
      collection(db, "submissions"),
      where("assignmentId", "==", assignmentId)
    )
    
    const querySnapshot = await getDocs(submissionsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Submission>(doc))
  }
  
  static async getSubmissionsByStudent(userId: string, classId?: string): Promise<Submission[]> {
    let submissionsQuery
    
    if (classId) {
      submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId),
        where("classId", "==", classId)
      )
    } else {
      submissionsQuery = query(
        collection(db, "submissions"),
        where("userId", "==", userId)
      )
    }
    
    const querySnapshot = await getDocs(submissionsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Submission>(doc))
  }
  
  // Inscripciones
  static async enrollStudent(enrollment: Omit<Enrollment, 'id' | 'joinedAt'>): Promise<string> {
    const enrollmentRef = doc(collection(db, "enrollments"))
    
    await setDoc(enrollmentRef, {
      ...enrollment,
      joinedAt: serverTimestamp()
    })
    
    return enrollmentRef.id
  }
  
  static async unenrollStudent(userId: string, classId: string): Promise<void> {
    const enrollmentsQuery = query(
      collection(db, "enrollments"),
      where("userId", "==", userId),
      where("classId", "==", classId)
    )
    
    const querySnapshot = await getDocs(enrollmentsQuery)
    
    if (!querySnapshot.empty) {
      const enrollmentRef = doc(db, "enrollments", querySnapshot.docs[0].id)
      await deleteDoc(enrollmentRef)
    }
  }
  
  static async getClassEnrollments(classId: string, role?: "student" | "teacher"): Promise<Enrollment[]> {
    let enrollmentsQuery
    
    if (role) {
      enrollmentsQuery = query(
        collection(db, "enrollments"),
        where("classId", "==", classId),
        where("role", "==", role)
      )
    } else {
      enrollmentsQuery = query(
        collection(db, "enrollments"),
        where("classId", "==", classId)
      )
    }
    
    const querySnapshot = await getDocs(enrollmentsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Enrollment>(doc))
  }
  
  // Anuncios
  static async createAnnouncement(announcementData: Omit<Announcement, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const announcementRef = doc(collection(db, "announcements"))
    const timestamp = serverTimestamp()
    
    await setDoc(announcementRef, {
      ...announcementData,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    
    return announcementRef.id
  }
  
  static async getAnnouncementsByClass(classId: string, limitCount = 20): Promise<Announcement[]> {
    const announcementsQuery = query(
      collection(db, "announcements"),
      where("classId", "==", classId),
      orderBy("createdAt", "desc"),
      limit(limitCount)
    )
    
    const querySnapshot = await getDocs(announcementsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Announcement>(doc))
  }
  
  // Comentarios
  static async createComment(commentData: Omit<Comment, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const commentRef = doc(collection(db, "comments"))
    const timestamp = serverTimestamp()
    
    await setDoc(commentRef, {
      ...commentData,
      createdAt: timestamp,
      updatedAt: timestamp
    })
    
    return commentRef.id
  }
  
  static async getCommentsByParent(parentId: string, parentType: "announcement" | "assignment" | "submission"): Promise<Comment[]> {
    const commentsQuery = query(
      collection(db, "comments"),
      where("parentId", "==", parentId),
      where("parentType", "==", parentType),
      orderBy("createdAt", "asc")
    )
    
    const querySnapshot = await getDocs(commentsQuery)
    return querySnapshot.docs.map(doc => convertDoc<Comment>(doc))
  }
}
