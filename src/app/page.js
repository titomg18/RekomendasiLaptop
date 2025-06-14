"use client"

import { useState, useMemo } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, BarChart, Bar } from "recharts";

const laptopDatabase = [
  {
    name: "ASUS VivoBook 14",
    price: 7,
    batteryLife: 8,
    weight: 1.4,
    cpuBenchmark: 12500,
    ramSize: 8,
    storageSize: 512,
    screenSize: 14,
    brand: "ASUS",
    specs: "Ryzen 5 5500U, 8GB DDR4, 512GB SSD"
  },
  {
    name: "Acer Aspire 5",
    price: 8,
    batteryLife: 7,
    weight: 1.8,
    cpuBenchmark: 13200,
    ramSize: 8,
    storageSize: 512,
    screenSize: 15.6,
    brand: "Acer",
    specs: "Intel i5-1135G7, 8GB DDR4, 512GB SSD"
  },
  {
    name: "Lenovo IdeaPad Gaming 3",
    price: 12,
    batteryLife: 5,
    weight: 2.2,
    cpuBenchmark: 18500,
    ramSize: 8,
    storageSize: 512,
    screenSize: 15.6,
    brand: "Lenovo",
    specs: "Ryzen 5 5600H, GTX 1650, 8GB DDR4"
  },
  {
    name: "HP Pavilion 14",
    price: 9,
    batteryLife: 9,
    weight: 1.5,
    cpuBenchmark: 12800,
    ramSize: 8,
    storageSize: 256,
    screenSize: 14,
    brand: "HP",
    specs: "Intel i5-1135G7, 8GB DDR4, 256GB SSD"
  },
  {
    name: "ASUS ROG Strix G15",
    price: 18,
    batteryLife: 4,
    weight: 2.5,
    cpuBenchmark: 22000,
    ramSize: 16,
    storageSize: 512,
    screenSize: 15.6,
    brand: "ASUS",
    specs: "Ryzen 7 5800H, RTX 3060, 16GB DDR4"
  },
  {
    name: "MacBook Air M1",
    price: 15,
    batteryLife: 12,
    weight: 1.3,
    cpuBenchmark: 17500,
    ramSize: 8,
    storageSize: 256,
    screenSize: 13.3,
    brand: "Apple",
    specs: "Apple M1, 8GB Unified, 256GB SSD"
  },
  {
    name: "Dell Inspiron 15 3000",
    price: 6,
    batteryLife: 6,
    weight: 2.0,
    cpuBenchmark: 8500,
    ramSize: 4,
    storageSize: 1000,
    screenSize: 15.6,
    brand: "Dell",
    specs: "Intel i3-1115G4, 4GB DDR4, 1TB HDD"
  },
  {
    name: "Lenovo ThinkPad E14",
    price: 11,
    batteryLife: 10,
    weight: 1.7,
    cpuBenchmark: 14500,
    ramSize: 8,
    storageSize: 512,
    screenSize: 14,
    brand: "Lenovo",
    specs: "Intel i5-1135G7, 8GB DDR4, 512GB SSD"
  },
  {
    name: "ASUS ZenBook 14",
    price: 13,
    batteryLife: 7,
    weight: 1.4,
    cpuBenchmark: 16000,
    ramSize: 16,
    storageSize: 512,
    screenSize: 14,
    brand: "ASUS",
    specs: "Intel i7-1165G7, 16GB DDR4, 512GB SSD"
  },
  {
    name: "Acer Predator Helios 300",
    price: 20,
    batteryLife: 4,
    weight: 2.3,
    cpuBenchmark: 21500,
    ramSize: 16,
    storageSize: 512,
    screenSize: 15.6,
    brand: "Acer",
    specs: "Intel i7-10750H, RTX 3060, 16GB DDR4"
  }
];

const FuzzyLaptopRecommendation = () => {
  const [inputs, setInputs] = useState({
    budget: 15,
    batteryNeeded: 8,
    mobilityFreq: 2,
    cpuIntensive: 30,
    multitaskingLevel: 8
  });

  const [showGraphs, setShowGraphs] = useState(false);

  // Fungsi membership fuzzy
  const budgetMembership = (laptopPrice, budget) => {
    if (laptopPrice <= budget * 0.8) return 1.0;
    if (laptopPrice <= budget) return 0.9;
    if (laptopPrice <= budget * 1.1) return 0.6;
    if (laptopPrice <= budget * 1.3) return 0.3;
    return 0.1;
  };

  const batteryMembership = (laptopBattery, needed) => {
    if (laptopBattery >= needed * 1.2) return 1.0;
    if (laptopBattery >= needed) return 0.9;
    if (laptopBattery >= needed * 0.8) return 0.7;
    if (laptopBattery >= needed * 0.6) return 0.4;
    return 0.2;
  };

  const mobilityMembership = (laptopWeight, frequency) => {
    const maxAcceptableWeight = frequency > 3 ? 1.5 : frequency > 2 ? 1.8 : frequency > 1 ? 2.0 : 2.5;
    if (laptopWeight <= maxAcceptableWeight * 0.7) return 1.0;
    if (laptopWeight <= maxAcceptableWeight * 0.85) return 0.8;
    if (laptopWeight <= maxAcceptableWeight) return 0.6;
    if (laptopWeight <= maxAcceptableWeight * 1.2) return 0.3;
    return 0.1;
  };

  const performanceMembership = (laptopCPU, intensity) => {
    const minRequiredCPU = 8000 + (intensity / 100) * 15000;
    if (laptopCPU >= minRequiredCPU * 1.3) return 1.0;
    if (laptopCPU >= minRequiredCPU * 1.1) return 0.9;
    if (laptopCPU >= minRequiredCPU) return 0.8;
    if (laptopCPU >= minRequiredCPU * 0.8) return 0.5;
    return 0.2;
  };

  const multitaskingMembership = (laptopRAM, level) => {
    const minRequiredRAM = Math.max(4, Math.ceil(level * 0.8));
    if (laptopRAM >= minRequiredRAM * 2) return 1.0;
    if (laptopRAM >= minRequiredRAM * 1.5) return 0.9;
    if (laptopRAM >= minRequiredRAM) return 0.8;
    if (laptopRAM >= minRequiredRAM * 0.75) return 0.4;
    return 0.1;
  };

  const sugenoMethod = (memberships) => {
    const weights = [0.3, 0.2, 0.15, 0.25, 0.1];
    let weightedSum = 0;
    let totalWeight = 0;
    for (let i = 0; i < memberships.length; i++) {
      if (memberships[i] > 0) {
        weightedSum += memberships[i] * weights[i];
        totalWeight += weights[i];
      }
    }
    return totalWeight > 0 ? weightedSum / totalWeight : 0;
  };

  const recommendations = useMemo(() => {
    const results = laptopDatabase.map(laptop => {
      const budgetScore = budgetMembership(laptop.price, inputs.budget);
      const batteryScore = batteryMembership(laptop.batteryLife, inputs.batteryNeeded);
      const mobilityScore = mobilityMembership(laptop.weight, inputs.mobilityFreq);
      const performanceScore = performanceMembership(laptop.cpuBenchmark, inputs.cpuIntensive);
      const multitaskingScore = multitaskingMembership(laptop.ramSize, inputs.multitaskingLevel);

      const memberships = [budgetScore, batteryScore, mobilityScore, performanceScore, multitaskingScore];
      const finalScore = sugenoMethod(memberships);

      return {
        laptop,
        score: finalScore,
        details: {
          budget: budgetScore,
          battery: batteryScore,
          mobility: mobilityScore,
          performance: performanceScore,
          multitasking: multitaskingScore
        }
      };
    });

    return results.sort((a, b) => b.score - a.score);
  }, [inputs]);

  const generateMembershipSets = () => {
    const sets = {
      budget: { murah: [], sedang: [], mahal: [] },
      battery: { pendek: [], sedang: [], panjang: [] },
      mobility: { ringan: [], sedang: [], berat: [] },
      performance: { rendah: [], sedang: [], tinggi: [] },
      multitasking: { ringan: [], sedang: [], berat: [] }
    };

    for (let i = 5; i <= 25; i += 0.5) {
      sets.budget.murah.push({ x: i, membership: i <= 8 ? 1.0 : i <= 12 ? Math.max(0, (12 - i) / 4) : 0 });
      sets.budget.sedang.push({ x: i, membership: i <= 8 ? 0 : i <= 13 ? (i - 8) / 5 : i <= 18 ? (18 - i) / 5 : 0 });
      sets.budget.mahal.push({ x: i, membership: i <= 15 ? 0 : i <= 20 ? (i - 15) / 5 : 1.0 });
    }

    for (let i = 4; i <= 15; i += 0.2) {
      sets.battery.pendek.push({ x: i, membership: i <= 6 ? 1.0 : i <= 8 ? (8 - i) / 2 : 0 });
      sets.battery.sedang.push({ x: i, membership: i <= 6 ? 0 : i <= 9 ? (i - 6) / 3 : i <= 12 ? (12 - i) / 3 : 0 });
      sets.battery.panjang.push({ x: i, membership: i <= 10 ? 0 : i <= 12 ? (i - 10) / 2 : 1.0 });
    }

    for (let i = 1; i <= 3; i += 0.05) {
      sets.mobility.ringan.push({ x: i, membership: i <= 1.5 ? 1.0 : i <= 1.8 ? (1.8 - i) / 0.3 : 0 });
      sets.mobility.sedang.push({ x: i, membership: i <= 1.5 ? 0 : i <= 1.9 ? (i - 1.5) / 0.4 : i <= 2.3 ? (2.3 - i) / 0.4 : 0 });
      sets.mobility.berat.push({ x: i, membership: i <= 2.0 ? 0 : i <= 2.5 ? (i - 2.0) / 0.5 : 1.0 });
    }

    for (let i = 8000; i <= 23000; i += 500) {
      sets.performance.rendah.push({ x: i, membership: i <= 10000 ? 1.0 : i <= 13000 ? (13000 - i) / 3000 : 0 });
      sets.performance.sedang.push({ x: i, membership: i <= 10000 ? 0 : i <= 15000 ? (i - 10000) / 5000 : i <= 20000 ? (20000 - i) / 5000 : 0 });
      sets.performance.tinggi.push({ x: i, membership: i <= 15000 ? 0 : i <= 18000 ? (i - 15000) / 3000 : 1.0 });
    }

    for (let i = 4; i <= 16; i += 0.5) {
      sets.multitasking.ringan.push({ x: i, membership: i <= 6 ? 1.0 : i <= 8 ? (8 - i) / 2 : 0 });
      sets.multitasking.sedang.push({ x: i, membership: i <= 6 ? 0 : i <= 10 ? (i - 6) / 4 : i <= 12 ? (12 - i) / 2 : 0 });
      sets.multitasking.berat.push({ x: i, membership: i <= 10 ? 0 : i <= 12 ? (i - 10) / 2 : 1.0 });
    }

    return sets;
  };

  const membershipSets = useMemo(() => generateMembershipSets(), []);

  const renderMembershipGraph = ({ title, data, xLabel, colors }) => (
    <div className="mb-6" role="region" aria-label={title}>
      <h4 className="text-md font-semibold mb-3 text-gray-700">{title}</h4>
      <ResponsiveContainer width="100%" height={200}>
        <LineChart margin={{ top: 10, right: 30, left: 0, bottom: 20 }}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis 
            type="number" 
            dataKey="x" 
            domain={['dataMin', 'dataMax']}
            label={{ value: xLabel, position: 'insideBottom', offset: -10 }} 
            tickFormatter={(value) => value.toFixed(1)}
          />
          <YAxis 
            label={{ value: 'Membership', angle: -90, position: 'insideLeft', offset: 10 }} 
            domain={[0, 1]}
            tickFormatter={(value) => value.toFixed(2)}
          />
          <Tooltip formatter={(value) => [value.toFixed(3), 'Membership']} />
          <Legend verticalAlign="top" height={36} />
          {Object.keys(data).map((key, index) => (
            <Line 
              key={key}
              type="monotone" 
              dataKey="membership" 
              data={data[key]}
              stroke={colors[index]} 
              strokeWidth={2} 
              dot={false}
              name={key.charAt(0).toUpperCase() + key.slice(1)}
            />
          ))}
        </LineChart>
      </ResponsiveContainer>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-6">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8">
            <h1 className="text-4xl font-bold mb-2">🖥️ Sistem Rekomendasi Laptop</h1>
            <p className="text-xl opacity-90">Fuzzy Logic Sugeno dengan Himpunan Keanggotaan</p>
          </div>

          <div className="p-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <div className="bg-gray-50 p-6 rounded-xl border-2 border-gray-200">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Input Kriteria Terukur</h2>
                <div className="space-y-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="budget">
                      Budget (Juta Rupiah): {inputs.budget}
                    </label>
                    <input
                      id="budget"
                      type="range"
                      min="5"
                      max="25"
                      step="0.5"
                      value={inputs.budget}
                      onChange={(e) => setInputs({...inputs, budget: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-blue-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-blue-500"
                      aria-label={`Budget slider: ${inputs.budget} juta rupiah`}
                    />
                    <div className="text-xs text-gray-500 mt-1">Rp 5 juta - Rp 25 juta</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="battery">
                      Kebutuhan Daya Tahan Baterai (Jam): {inputs.batteryNeeded}
                    </label>
                    <input
                      id="battery"
                      type="range"
                      min="4"
                      max="15"
                      step="0.5"
                      value={inputs.batteryNeeded}
                      onChange={(e) => setInputs({...inputs, batteryNeeded: parseFloat(e.target.value)})}
                      className="w-full h-2 bg-green-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-green-500"
                      aria-label={`Battery life slider: ${inputs.batteryNeeded} jam`}
                    />
                    <div className="text-xs text-gray-500 mt-1">4 jam - 15 jam penggunaan</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="mobility">
                      Frekuensi Mobilitas (kali/hari): {inputs.mobilityFreq}
                    </label>
                    <input
                      id="mobility"
                      type="range"
                      min="0"
                      max="5"
                      step="1"
                      value={inputs.mobilityFreq}
                      onChange={(e) => setInputs({...inputs, mobilityFreq: parseInt(e.target.value)})}
                      className="w-full h-2 bg-purple-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-purple-500"
                      aria-label={`Mobility frequency slider: ${inputs.mobilityFreq} kali/hari`}
                    />
                    <div className="text-xs text-gray-500 mt-1">0 - 5 kali berpindah tempat per hari</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="cpu">
                      Intensitas CPU (%): {inputs.cpuIntensive}
                    </label>
                    <input
                      id="cpu"
                      type="range"
                      min="0"
                      max="100"
                      step="5"
                      value={inputs.cpuIntensive}
                      onChange={(e) => setInputs({...inputs, cpuIntensive: parseInt(e.target.value)})}
                      className="w-full h-2 bg-red-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-red-500"
                      aria-label={`CPU intensity slider: ${inputs.cpuIntensive}%`}
                    />
                    <div className="text-xs text-gray-500 mt-1">0% - 100% workload CPU intensive</div>
                  </div>

                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2" htmlFor="multitasking">
                      Level Multitasking (aplikasi): {inputs.multitaskingLevel}
                    </label>
                    <input
                      id="multitasking"
                      type="range"
                      min="1"
                      max="20"
                      step="1"
                      value={inputs.multitaskingLevel}
                      onChange={(e) => setInputs({...inputs, multitaskingLevel: parseInt(e.target.value)})}
                      className="w-full h-2 bg-yellow-200 rounded-lg appearance-none cursor-pointer focus:outline-none focus:ring-2 focus:ring-yellow-500"
                      aria-label={`Multitasking level slider: ${inputs.multitaskingLevel} aplikasi`}
                    />
                    <div className="text-xs text-gray-500 mt-1">1 - 20 aplikasi bersamaan</div>
                  </div>
                </div>

                <button
                  onClick={() => setShowGraphs(!showGraphs)}
                  className="w-full mt-6 bg-gradient-to-r from-blue-500 to-purple-500 text-white py-3 px-6 rounded-lg font-semibold hover:from-blue-600 hover:to-purple-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  aria-label={showGraphs ? 'Sembunyikan grafik himpunan keanggotaan' : 'Tampilkan grafik himpunan keanggotaan'}
                >
                  {showGraphs ? '📊 Sembunyikan Grafik' : '📈 Tampilkan Himpunan Keanggotaan'}
                </button>
              </div>

              <div className="bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Hasil Rekomendasi</h2>
                {recommendations.length > 0 ? (
                  <>
                    <div className="bg-gradient-to-r from-green-400 to-emerald-500 text-white p-6 rounded-xl mb-6 shadow-lg">
                      <div className="text-center">
                        <div className="text-4xl font-bold mb-2">
                          {(recommendations[0].score * 100).toFixed(1)}%
                        </div>
                        <div className="text-xl font-semibold">
                          {recommendations[0].laptop.name}
                        </div>
                        <div className="text-sm opacity-90 mt-1">
                          {recommendations[0].laptop.specs}
                        </div>
                      </div>
                    </div>

                    <div className="bg-gray-50 p-4 rounded-lg mb-6">
                      <h3 className="font-semibold text-gray-800 mb-3">Detail Skor Fuzzy (Laptop Teratas):</h3>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between">
                          <span>Budget Match:</span>
                          <span className="font-semibold">{(recommendations[0].details.budget * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Battery Match:</span>
                          <span className="font-semibold">{(recommendations[0].details.battery * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Mobility Match:</span>
                          <span className="font-semibold">{(recommendations[0].details.mobility * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Performance Match:</span>
                          <span className="font-semibold">{(recommendations[0].details.performance * 100).toFixed(1)}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Multitasking Match:</span>
                          <span className="font-semibold">{(recommendations[0].details.multitasking * 100).toFixed(1)}%</span>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-3">
                      <h3 className="font-semibold text-gray-800">Top 5 Rekomendasi:</h3>
                      {recommendations.slice(0, 5).map((rec, index) => (
                        <div key={rec.laptop.name} className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow">
                          <div className="flex justify-between items-start">
                            <div className="flex-1">
                              <div className="font-semibold text-gray-800">
                                {index + 1}. {rec.laptop.name}
                              </div>
                              <div className="text-sm text-gray-600 mt-1">
                                {rec.laptop.specs}
                              </div>
                              <div className="text-xs text-gray-500 mt-1">
                                Rp {rec.laptop.price}jt | {rec.laptop.batteryLife}h | {rec.laptop.weight}kg | {rec.laptop.ramSize}GB RAM
                              </div>
                            </div>
                            <div className="text-lg font-bold text-green-600 ml-4">
                              {(rec.score * 100).toFixed(1)}%
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg">
                    <strong className="font-bold">Error:</strong>
                    <span className="block sm:inline"> Tidak ada rekomendasi yang tersedia. Silakan coba sesuaikan input Anda.</span>
                  </div>
                )}
              </div>
            </div>

            {showGraphs && (
              <div className="mt-8 bg-white border-2 border-gray-200 rounded-xl p-6">
                <h2 className="text-2xl font-bold text-gray-800 mb-6">Grafik Himpunan Keanggotaan Fuzzy</h2>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  {renderMembershipGraph({
                    title: "Budget (Harga Laptop)",
                    data: membershipSets.budget,
                    xLabel: "Harga (Juta Rupiah)",
                    colors: ["#3B82F6", "#10B981", "#EF4444"]
                  })}
                  {renderMembershipGraph({
                    title: "Daya Tahan Baterai",
                    data: membershipSets.battery,
                    xLabel: "Jam",
                    colors: ["#F59E0B", "#8B5CF6", "#10B981"]
                  })}
                  {renderMembershipGraph({
                    title: "Mobilitas (Berat Laptop)",
                    data: membershipSets.mobility,
                    xLabel: "Berat (Kg)",
                    colors: ["#10B981", "#F59E0B", "#EF4444"]
                  })}
                  {renderMembershipGraph({
                    title: "Performa CPU",
                    data: membershipSets.performance,
                    xLabel: "Benchmark Score",
                    colors: ["#EF4444", "#3B82F6", "#10B981"]
                  })}
                  {renderMembershipGraph({
                    title: "Kapasitas Multitasking",
                    data: membershipSets.multitasking,
                    xLabel: "RAM (GB)",
                    colors: ["#06B6D4", "#F59E0B", "#8B5CF6"]
                  })}
                  <div className="lg:col-span-2">
                    <h3 className="text-lg font-semibold mb-3">Perbandingan Skor Top 5 Laptop</h3>
                    <ResponsiveContainer width="100%" height={300}>
                      <BarChart data={recommendations.slice(0, 5).map(rec => ({
                        name: rec.laptop.name.length > 15 ? rec.laptop.name.substring(0, 15) + '...' : rec.laptop.name,
                        score: rec.score * 100,
                        budget: rec.details.budget * 100,
                        battery: rec.details.battery * 100,
                        mobility: rec.details.mobility * 100,
                        performance: rec.details.performance * 100,
                        multitasking: rec.details.multitasking * 100
                      }))}>
                        <CartesianGrid strokeDasharray="3 3" />
                        <XAxis dataKey="name" />
                        <YAxis domain={[0, 100]} tickFormatter={(value) => `${value}%`} />
                        <Tooltip formatter={(value) => [`${value.toFixed(1)}%`, '']} />
                        <Legend verticalAlign="top" height={36} />
                        <Bar dataKey="score" fill="#10B981" name="Total Score" />
                        <Bar dataKey="budget" fill="#3B82F6" name="Budget" />
                        <Bar dataKey="battery" fill="#F59E0B" name="Battery" />
                        <Bar dataKey="mobility" fill="#8B5CF6" name="Mobility" />
                        <Bar dataKey="performance" fill="#EF4444" name="Performance" />
                        <Bar dataKey="multitasking" fill="#06B6D4" name="Multitasking" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            <div className="mt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
              <button
                onClick={() => setInputs({
                  budget: 15,
                  batteryNeeded: 8,
                  mobilityFreq: 2,
                  cpuIntensive: 30,
                  multitaskingLevel: 8
                })}
                className="w-full sm:w-auto bg-gray-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-gray-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-500"
                aria-label="Reset semua input ke nilai awal"
              >
                🔄 Reset Input
              </button>
              <button
                onClick={() => {
                  const csvContent = [
                    ['Rank', 'Name', 'Score', 'Price (Juta)', 'Battery (Jam)', 'Weight (Kg)', 'RAM (GB)', 'Specs'],
                    ...recommendations.slice(0, 5).map((rec, index) => [
                      index + 1,
                      `"${rec.laptop.name}"`,
                      (rec.score * 100).toFixed(1),
                      rec.laptop.price,
                      rec.laptop.batteryLife,
                      rec.laptop.weight,
                      rec.laptop.ramSize,
                      `"${rec.laptop.specs}"`
                    ])
                  ].map(row => row.join(',')).join('\n');

                  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                  const url = URL.createObjectURL(blob);
                  const link = document.createElement('a');
                  link.setAttribute('href', url);
                  link.setAttribute('download', 'laptop_recommendations.csv');
                  link.click();
                  URL.revokeObjectURL(url);
                }}
                className="w-full sm:w-auto bg-green-500 text-white py-3 px-6 rounded-lg font-semibold hover:bg-green-600 transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-green-500"
                aria-label="Download rekomendasi sebagai file CSV"
              >
                ⬇️ Download Rekomendasi (CSV)
              </button>
            </div>

            {recommendations.length === 0 && (
              <div className="mt-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg" role="alert">
                <strong className="font-bold">Error:</strong>
                <span className="block sm:inline"> Tidak ada rekomendasi yang tersedia. Silakan coba sesuaikan input Anda.</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default FuzzyLaptopRecommendation;