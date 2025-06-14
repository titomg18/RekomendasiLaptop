"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Laptop, ArrowLeft, Cpu, MemoryStickIcon as Memory, Battery, Monitor, Info } from "lucide-react"
import { calculateRecommendation } from "@/lib/fuzzy-sugeno"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"

export default function RecommendationResult({ answers, onReset }) {
  const [recommendations, setRecommendations] = useState([])
  const [loading, setLoading] = useState(true)
  const [answeredQuestions, setAnsweredQuestions] = useState([])

  useEffect(() => {
    // Calculate recommendations using the Fuzzy Sugeno algorithm
    const results = calculateRecommendation(answers)
    setRecommendations(results)
    setAnsweredQuestions(Object.keys(answers))
    setLoading(false)
  }, [answers])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-pulse flex flex-col items-center">
          <Laptop className="h-16 w-16 text-purple-500 mb-4" />
          <p className="text-lg font-medium text-gray-700">Menganalisis preferensi Anda...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-50 to-gray-100 p-4">
      <div className="w-full max-w-4xl">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <Laptop className="h-6 w-6 text-purple-600" />
            <h1 className="text-2xl font-bold text-gray-900">Rekomendasi Laptop</h1>
          </div>
          <Button variant="outline" onClick={onReset}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Mulai Ulang
          </Button>
        </div>

        <Card className="mb-4 border-purple-200 shadow-md">
          <CardHeader className="pb-2">
            <CardTitle>Preferensi Anda</CardTitle>
            <CardDescription>Berdasarkan {answeredQuestions.length} pertanyaan yang Anda jawab</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-2 text-sm">
              {answeredQuestions.map((question) => (
                <div key={question} className="bg-gray-50 p-2 rounded">
                  <span className="font-medium">{formatQuestionName(question)}:</span>{" "}
                  <span>{formatAnswerValue(question, answers[question])}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="mb-8 border-purple-200 shadow-md">
          <CardHeader>
            <CardTitle>Hasil Rekomendasi</CardTitle>
            <CardDescription>Berikut adalah laptop yang kami rekomendasikan</CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="top">
              <TabsList className="mb-4">
                <TabsTrigger value="top">Top 3</TabsTrigger>
                <TabsTrigger value="gaming">Gaming</TabsTrigger>
                <TabsTrigger value="productivity">Produktivitas</TabsTrigger>
                <TabsTrigger value="portable">Portabel</TabsTrigger>
              </TabsList>

              <TabsContent value="top">
                <div className="grid gap-6 md:grid-cols-3">
                  {recommendations.slice(0, 3).map((laptop) => (
                    <LaptopCard key={laptop.id} laptop={laptop} userAnswers={answers} />
                  ))}
                </div>
              </TabsContent>

              <TabsContent value="gaming">
                <div className="grid gap-6 md:grid-cols-3">
                  {recommendations
                    .filter((laptop) => laptop.category === "gaming")
                    .slice(0, 3)
                    .map((laptop) => (
                      <LaptopCard key={laptop.id} laptop={laptop} userAnswers={answers} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="productivity">
                <div className="grid gap-6 md:grid-cols-3">
                  {recommendations
                    .filter((laptop) => laptop.category === "productivity")
                    .slice(0, 3)
                    .map((laptop) => (
                      <LaptopCard key={laptop.id} laptop={laptop} userAnswers={answers} />
                    ))}
                </div>
              </TabsContent>

              <TabsContent value="portable">
                <div className="grid gap-6 md:grid-cols-3">
                  {recommendations
                    .filter((laptop) => laptop.category === "ultraportable")
                    .slice(0, 3)
                    .map((laptop) => (
                      <LaptopCard key={laptop.id} laptop={laptop} userAnswers={answers} />
                    ))}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
          <CardFooter className="flex justify-between">
            <p className="text-sm text-gray-500">
              Skor dihitung menggunakan algoritma Fuzzy Sugeno berdasarkan preferensi Anda
            </p>
          </CardFooter>
        </Card>
      </div>
    </div>
  )
}

function LaptopCard({ laptop, userAnswers }) {
  // Generate explanation for why this laptop was recommended
  const getExplanation = () => {
    const matches = []
    const mismatches = []

    // Check each user answer against laptop attributes
    for (const [key, userValue] of Object.entries(userAnswers)) {
      if (laptop.attributes[key] !== undefined) {
        const laptopValue = laptop.attributes[key]
        const difference = Math.abs(laptopValue - userValue)

        // If the values are close (difference <= 1), consider it a match
        if (difference <= 1) {
          matches.push({
            attribute: key,
            userValue,
            laptopValue,
          })
        } else if (difference >= 2) {
          // If the values are far apart (difference >= 2), consider it a mismatch
          mismatches.push({
            attribute: key,
            userValue,
            laptopValue,
          })
        }
      }
    }

    return { matches, mismatches }
  }

  const { matches, mismatches } = getExplanation()

  return (
    <Card className="overflow-hidden border-gray-200 transition-all hover:shadow-md">
      <div className="aspect-video bg-gray-100 relative">
        <div className="absolute top-2 right-2 bg-purple-600 text-white text-xs font-bold px-2 py-1 rounded-full">
          {laptop.score.toFixed(1)}
        </div>
        <img
          src={laptop.imageUrl || `/placeholder.svg?height=200&width=300`}
          alt={laptop.name}
          className="w-full h-full object-cover"
        />
      </div>
      <CardHeader className="p-4 pb-0">
        <CardTitle className="text-lg">{laptop.name}</CardTitle>
        <CardDescription>{laptop.price}</CardDescription>
      </CardHeader>
      <CardContent className="p-4 pt-2">
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div className="flex items-center gap-1">
            <Cpu className="h-3 w-3 text-gray-500" />
            <span className="truncate">{laptop.processor}</span>
          </div>
          <div className="flex items-center gap-1">
            <Memory className="h-3 w-3 text-gray-500" />
            <span>{laptop.ram}</span>
          </div>
          <div className="flex items-center gap-1">
            <Monitor className="h-3 w-3 text-gray-500" />
            <span className="truncate">{laptop.display}</span>
          </div>
          <div className="flex items-center gap-1">
            <Battery className="h-3 w-3 text-gray-500" />
            <span>{laptop.battery}</span>
          </div>
        </div>
      </CardContent>
      <CardFooter className="p-4 pt-0 flex flex-col gap-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button variant="outline" className="w-full flex items-center gap-2">
              <Info className="h-4 w-4" />
              Mengapa Direkomendasikan?
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Mengapa {laptop.name} Direkomendasikan</DialogTitle>
              <DialogDescription>
                Berdasarkan jawaban Anda, berikut adalah alasan laptop ini direkomendasikan
              </DialogDescription>
            </DialogHeader>
            <div className="space-y-4">
              <div>
                <h4 className="font-medium mb-2">Kesesuaian dengan Preferensi Anda:</h4>
                {matches.length > 0 ? (
                  <div className="space-y-2">
                    {matches.map((match, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                          Cocok
                        </Badge>
                        <span>
                          {formatQuestionName(match.attribute)}: Anda memilih{" "}
                          <strong>{formatAnswerValue(match.attribute, match.userValue)}</strong>, laptop ini{" "}
                          <strong>{formatAnswerValue(match.attribute, match.laptopValue)}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="text-gray-500 text-sm">Tidak ada kecocokan yang signifikan.</p>
                )}
              </div>

              {mismatches.length > 0 && (
                <div>
                  <h4 className="font-medium mb-2">Perbedaan dengan Preferensi Anda:</h4>
                  <div className="space-y-2">
                    {mismatches.map((mismatch, index) => (
                      <div key={index} className="flex items-center gap-2">
                        <Badge variant="outline" className="bg-amber-50 text-amber-700 border-amber-200">
                          Berbeda
                        </Badge>
                        <span>
                          {formatQuestionName(mismatch.attribute)}: Anda memilih{" "}
                          <strong>{formatAnswerValue(mismatch.attribute, mismatch.userValue)}</strong>, laptop ini{" "}
                          <strong>{formatAnswerValue(mismatch.attribute, mismatch.laptopValue)}</strong>
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <h4 className="font-medium mb-2">Kategori Laptop:</h4>
                <p>
                  {laptop.name} adalah laptop <strong>{getCategoryName(laptop.category)}</strong> dengan skor{" "}
                  <strong>{laptop.score.toFixed(1)}</strong> dari 10.
                </p>
              </div>
            </div>
          </DialogContent>
        </Dialog>
        <Button variant="default" className="w-full">
          Lihat Detail
        </Button>
      </CardFooter>
    </Card>
  )
}

// Helper function to format question names for display
function formatQuestionName(questionId) {
  const nameMap = {
    budget: "Budget",
    gaming: "Gaming",
    videoEditing: "Editing Video",
    portability: "Portabilitas",
    battery: "Baterai",
    screenSize: "Ukuran Layar",
    performance: "Performa",
    multitasking: "Multitasking",
    design: "Desain",
    cooling: "Pendinginan",
    buildQuality: "Kualitas Build",
    touchscreen: "Layar Sentuh",
    noiseLevel: "Tingkat Kebisingan",
  }

  return nameMap[questionId] || questionId
}

// Helper function to format answer values for display
function formatAnswerValue(questionId, value) {
  const valueMap = {
    budget: {
      1: "< 5 juta",
      2: "5-8 juta",
      3: "8-12 juta",
      4: "12-20 juta",
      5: "> 20 juta",
    },
    gaming: {
      1: "Tidak pernah",
      2: "Jarang",
      3: "Kadang-kadang",
      4: "Sering",
      5: "Sangat sering",
    },
    screenSize: {
      1: "Sangat kecil",
      2: "Kecil",
      3: "Sedang",
      4: "Besar",
      5: "Sangat besar",
    },
  }

  // If we have a specific mapping for this question and value
  if (valueMap[questionId] && valueMap[questionId][value]) {
    return valueMap[questionId][value]
  }

  // Generic mapping based on value
  const genericMap = {
    1: "Sangat rendah",
    2: "Rendah",
    3: "Sedang",
    4: "Tinggi",
    5: "Sangat tinggi",
  }

  return genericMap[value] || value.toString()
}

// Helper function to get category name
function getCategoryName(category) {
  const categoryMap = {
    gaming: "Gaming",
    productivity: "Produktivitas",
    ultraportable: "Portabel",
  }

  return categoryMap[category] || category
}
