



// import { useState, useMemo } from "react";
// import { motion } from "framer-motion";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import { Globe, Check, Wifi, CreditCard, Calculator } from "lucide-react";
// import { useTranslation } from "react-i18next";

// import { Button } from "@/components/ui/button";
// import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableFooter,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
// import L from "leaflet";

// import {
//   step5Schema,
//   type Step5FormData,
//   type Step4FormData,
//   DOMESTIC_OPERATORS,
//   FOREIGN_OPERATORS,
// } from "@/types/registration";

// // Fix for default markers in React-Leaflet
// delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
// L.Icon.Default.mergeOptions({
//   iconRetinaUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
//   iconUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
//   shadowUrl:
//     "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
// });

// // Custom icons for different regions
// const createCustomIcon = (color: string, emoji: string) => {
//   return L.divIcon({
//     html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 16px;">${emoji}</div>`,
//     className: "custom-marker",
//     iconSize: [30, 30],
//     iconAnchor: [15, 15],
//   });
// };

// interface Step5OperatorSelectionProps {
//   onSubmit: (data: Step5FormData) => void;
//   onBack: () => void;
//   step4Data: Step4FormData;
// }

// const containerVariants = {
//   hidden: { opacity: 0, y: 20 },
//   visible: {
//     opacity: 1,
//     y: 0,
//     transition: { duration: 0.6 },
//   },
//   exit: {
//     opacity: 0,
//     y: -20,
//     transition: { duration: 0.3 },
//   },
// };

// const operatorItemVariants = {
//   hidden: { opacity: 0, x: -20 },
//   visible: (index: number) => ({
//     opacity: 1,
//     x: 0,
//     transition: {
//       delay: index * 0.1,
//       duration: 0.5,
//     },
//   }),
// };

// // Coverage regions for different countries (city names kept as-is)
// const coverageRegions = {
//   iran: {
//     center: [32.4279, 53.688] as [number, number],
//     color: "#dc2626",
//     name: "Iran",
//   },
//   asia: [
//     { center: [35.6762, 139.6503] as [number, number], name: "Tokyo", country: "Japan" },
//     { center: [1.3521, 103.8198] as [number, number], name: "Singapore", country: "Singapore" },
//     { center: [22.3193, 114.1694] as [number, number], name: "Hong Kong", country: "China" },
//     { center: [37.5665, 126.978] as [number, number], name: "Seoul", country: "South Korea" },
//     { center: [13.7563, 100.5018] as [number, number], name: "Bangkok", country: "Thailand" },
//   ],
//   europe: [
//     { center: [51.5074, -0.1278] as [number, number], name: "London", country: "United Kingdom" },
//     { center: [48.8566, 2.3522] as [number, number], name: "Paris", country: "France" },
//     { center: [52.3676, 4.9041] as [number, number], name: "Amsterdam", country: "Netherlands" },
//     { center: [50.1109, 8.6821] as [number, number], name: "Frankfurt", country: "Germany" },
//     { center: [59.3293, 18.0686] as [number, number], name: "Stockholm", country: "Sweden" },
//   ],
//   americas: [
//     { center: [40.7128, -74.006] as [number, number], name: "New York", country: "USA" },
//     { center: [34.0522, -118.2437] as [number, number], name: "Los Angeles", country: "USA" },
//     { center: [43.6532, -79.3832] as [number, number], name: "Toronto", country: "Canada" },
//     { center: [-23.5505, -46.6333] as [number, number], name: "São Paulo", country: "Brazil" },
//   ],
//   middleEast: [
//     { center: [25.2048, 55.2708] as [number, number], name: "Dubai", country: "UAE" },
//     { center: [41.0082, 28.9784] as [number, number], name: "Istanbul", country: "Turkey" },
//     { center: [25.2854, 51.531] as [number, number], name: "Doha", country: "Qatar" },
//   ],
// };

// export function Step5OperatorSelection({
//   onSubmit,
//   onBack,
//   step4Data,
// }: Step5OperatorSelectionProps) {
//   const { t, i18n } = useTranslation();

//   const [selectedDomesticOperators, setSelectedDomesticOperators] = useState<string[]>([]);
//   const [selectedForeignOperators, setSelectedForeignOperators] = useState<string[]>([]);
//   const [mapError] = useState<boolean>(false);

//   const form = useForm<Step5FormData>({
//     resolver: zodResolver(step5Schema),
//     defaultValues: {
//       domesticOperators: [],
//       foreignOperators: [],
//     },
//   });

//   // normalize line type across locales (fa/en)
//   const isCredit = useMemo(() => {
//     const creditLabels = [
//       t("step4.esimLineTypes.esimCredit"),
//       "خط eSIM اعتباری",
//       "Credit eSIM Line",
//     ];
//     return creditLabels.includes(step4Data.esimLineType as unknown as string);
//   }, [step4Data.esimLineType, i18n.language, t]);

//   const isPermanent = useMemo(() => {
//     const permLabels = [
//       t("step4.esimLineTypes.esimPermanent"),
//       "خط eSIM دائمی",
//       "Permanent eSIM Line",
//     ];
//     return permLabels.includes(step4Data.esimLineType as unknown as string);
//   }, [step4Data.esimLineType, i18n.language, t]);

//   // Cost calculation logic
//   const costBreakdown = useMemo(() => {
//     const costs = {
//       esimCost: 0,
//       domesticOperatorsCost: selectedDomesticOperators.length * 1_000_000,
//       foreignOperatorsCost: selectedForeignOperators.length * 1_500_000,
//       servicesCost: 0,
//     };

//     if (isCredit) costs.esimCost = 1_500_000;
//     else if (isPermanent) costs.esimCost = 6_000_000;

//     const total =
//       costs.esimCost +
//       costs.domesticOperatorsCost +
//       costs.foreignOperatorsCost +
//       costs.servicesCost;

//     return {
//       ...costs,
//       total,
//       formatted: {
//         esimCost: costs.esimCost.toLocaleString(i18n.language === "fa" ? "fa-IR" : "en-US"),
//         domesticOperatorsCost: costs.domesticOperatorsCost.toLocaleString(
//           i18n.language === "fa" ? "fa-IR" : "en-US"
//         ),
//         foreignOperatorsCost: costs.foreignOperatorsCost.toLocaleString(
//           i18n.language === "fa" ? "fa-IR" : "en-US"
//         ),
//         servicesCost: costs.servicesCost.toLocaleString(
//           i18n.language === "fa" ? "fa-IR" : "en-US"
//         ),
//         total: total.toLocaleString(i18n.language === "fa" ? "fa-IR" : "en-US"),
//       },
//     };
//   }, [
//     isCredit,
//     isPermanent,
//     selectedDomesticOperators.length,
//     selectedForeignOperators.length,
//     i18n.language,
//   ]);

//   const toggleDomesticOperator = (operator: string) => {
//     setSelectedDomesticOperators((prev) => {
//       const isSelected = prev.includes(operator);
//       const newSelected = isSelected ? prev.filter((op) => op !== operator) : [...prev, operator];
//       form.setValue("domesticOperators", newSelected);
//       return newSelected;
//     });
//   };

//   const toggleForeignOperator = (operator: string) => {
//     setSelectedForeignOperators((prev) => {
//       const isSelected = prev.includes(operator);
//       const newSelected = isSelected ? prev.filter((op) => op !== operator) : [...prev, operator];
//       form.setValue("foreignOperators", newSelected);
//       return newSelected;
//     });
//   };

//   return (
//     <motion.div
//       key="step5"
//       variants={containerVariants}
//       initial="hidden"
//       animate="visible"
//       exit="exit"
//       className="w-full"
//     >
//       <div className="text-center mb-8">
//         <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
//           <Globe className="w-8 h-8 text-white" />
//         </div>
//         <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
//           {t("step5.title")}
//         </h2>
//         <p className="text-lg text-gray-600 dark:text-gray-300">
//           {t("step5.subtitle")}
//         </p>
//       </div>

//       {/* Main Layout with Large Map and Sidebar Operators */}
//       <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
//         {/* Left Sidebar - Operator Selections */}
//         <div className="lg:col-span-1 xl:col-span-1 space-y-6">
//           {/* Domestic Operators Section */}
//           <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-4">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="p-1.5 bg-red-500 rounded-lg">
//                 <Wifi className="w-4 h-4 text-white" />
//               </div>
//               <h3 className="text-base font-bold text-gray-900 dark:text-white">
//                 {t("step5.domestic.title")}
//               </h3>
//             </div>

//             <div className="space-y-2">
//               {DOMESTIC_OPERATORS.map((operator, index) => (
//                 <motion.div
//                   key={operator}
//                   custom={index}
//                   variants={operatorItemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className={`relative p-2 rounded-lg border cursor-pointer transition-all duration-300 ${
//                     selectedDomesticOperators.includes(operator)
//                       ? "border-red-500 bg-red-50 dark:bg-red-900/30"
//                       : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-green-300"
//                   }`}
//                   onClick={() => toggleDomesticOperator(operator)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
//                         selectedDomesticOperators.includes(operator)
//                           ? "border-red-500 bg-red-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {selectedDomesticOperators.includes(operator) && (
//                         <Check className="w-2.5 h-2.5 text-white" />
//                       )}
//                     </div>
//                     <label className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
//                       {operator}
//                     </label>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {selectedDomesticOperators.length > 0 && (
//               <div className="mt-3 p-2 bg-red-100 dark:bg-red-800/30 rounded-lg">
//                 <p className="text-xs font-medium text-green-800 dark:text-green-200">
//                   {t("step5.domestic.selected", { count: selectedDomesticOperators.length })}
//                 </p>
//               </div>
//             )}
//           </div>

//           {/* Foreign Operators Section */}
//           <div className="bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
//             <div className="flex items-center gap-2 mb-4">
//               <div className="p-1.5 bg-gray-500 rounded-lg">
//                 <Globe className="w-4 h-4 text-white" />
//               </div>
//               <h3 className="text-base font-bold text-gray-900 dark:text-white">
//                 {t("step5.foreign.title")}
//               </h3>
//             </div>

//             <div className="space-y-2">
//               {FOREIGN_OPERATORS.map((operator, index) => (
//                 <motion.div
//                   key={operator}
//                   custom={index + 3}
//                   variants={operatorItemVariants}
//                   initial="hidden"
//                   animate="visible"
//                   className={`relative p-2 rounded-lg border cursor-pointer transition-all duration-300 ${
//                     selectedForeignOperators.includes(operator)
//                       ? "border-gray-500 bg-gray-50 dark:bg-gray-900/30"
//                       : "border-gray-200 dark:border-gray-600 bg-white dark:bg-gray-800 hover:border-gray-300"
//                   }`}
//                   onClick={() => toggleForeignOperator(operator)}
//                 >
//                   <div className="flex items-center gap-2">
//                     <div
//                       className={`w-4 h-4 rounded border flex items-center justify-center transition-all ${
//                         selectedForeignOperators.includes(operator)
//                           ? "border-gray-500 bg-gray-500"
//                           : "border-gray-300 dark:border-gray-600"
//                       }`}
//                     >
//                       {selectedForeignOperators.includes(operator) && (
//                         <Check className="w-2.5 h-2.5 text-white" />
//                       )}
//                     </div>
//                     <label className="block text-sm font-medium text-gray-900 dark:text-white cursor-pointer">
//                       {operator}
//                     </label>
//                   </div>
//                 </motion.div>
//               ))}
//             </div>

//             {selectedForeignOperators.length > 0 && (
//               <div className="mt-3 p-2 bg-gray-100 dark:bg-gray-800/30 rounded-lg">
//                 <p className="text-xs font-medium text-gray-800 dark:text-gray-200">
//                   {t("step5.foreign.selected", { count: selectedForeignOperators.length })}
//                 </p>
//               </div>
//             )}
//           </div>
//         </div>

//         {/* Main Content - Large eSIM Coverage Map */}
//         <div className="lg:col-span-1 xl:col-span-3">
//           <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-full">
//             <div className="flex items-center gap-3 mb-6">
//               <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
//                 <Globe className="w-6 h-6 text-white" />
//               </div>
//               <div>
//                 <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                   {t("step5.map.title")}
//                 </h3>
//                 <p className="text-sm text-gray-600 dark:text-gray-400">
//                   {t("step5.map.subtitle")}
//                 </p>
//               </div>
//             </div>

//             {/* Large Map Container */}
//             <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border shadow-lg overflow-hidden">
//               {mapError ? (
//                 <div className="flex items-center justify-center h-[400px] text-gray-500">
//                   <div className="text-center">
//                     <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
//                     <p className="text-lg font-medium">
//                       {t("step5.map.loadingTitle")}
//                     </p>
//                     <p className="text-sm">{t("step5.map.loadingSubtitle")}</p>
//                   </div>
//                 </div>
//               ) : (
//                 <MapContainer
//                   center={[20, 0]}
//                   zoom={2}
//                   className="w-full h-[400px] rounded-lg"
//                   style={{ background: "transparent" }}
//                 >
//                   <TileLayer
//                     attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
//                     url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
//                   />

//                   {/* Iran headquarters marker */}
//                   <Marker position={coverageRegions.iran.center} icon={createCustomIcon("#dc2626", "🏢")}>
//                     <Popup>
//                       <div className="text-center p-2">
//                         <h3 className="font-bold text-red-600">{t("step5.legend.hq")}</h3>
//                         <p className="text-sm">{t("step5.legend.iran")}</p>
//                       </div>
//                     </Popup>
//                   </Marker>

//                   {/* Coverage circles for Iran */}
//                   <Circle
//                     center={coverageRegions.iran.center}
//                     radius={1_500_000}
//                     pathOptions={{
//                       color: "#dc2626",
//                       fillColor: "#dc2626",
//                       fillOpacity: 0.1,
//                       weight: 2,
//                     }}
//                   />

//                   {/* Asia region markers and coverage */}
//                   {coverageRegions.asia.map((point) => (
//                     <div key={point.name}>
//                       <Marker position={point.center} icon={createCustomIcon("#10b981", "📡")}>
//                         <Popup>
//                           <div className="text-center p-2">
//                             <h3 className="font-bold text-green-600">{point.name}</h3>
//                             <p className="text-sm">{point.country}</p>
//                             <p className="text-xs text-gray-500">{t("step5.regions.asia")}</p>
//                           </div>
//                         </Popup>
//                       </Marker>
//                       <Circle
//                         center={point.center}
//                         radius={800_000}
//                         pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.08, weight: 1 }}
//                       />
//                     </div>
//                   ))}

//                   {/* Europe */}
//                   {coverageRegions.europe.map((point) => (
//                     <div key={point.name}>
//                       <Marker position={point.center} icon={createCustomIcon("#3b82f6", "🌐")}>
//                         <Popup>
//                           <div className="text-center p-2">
//                             <h3 className="font-bold text-red-600">{point.name}</h3>
//                             <p className="text-sm">{point.country}</p>
//                             <p className="text-xs text-gray-500">{t("step5.regions.europe")}</p>
//                           </div>
//                         </Popup>
//                       </Marker>
//                       <Circle
//                         center={point.center}
//                         radius={600_000}
//                         pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1 }}
//                       />
//                     </div>
//                   ))}

//                   {/* Americas */}
//                   {coverageRegions.americas.map((point) => (
//                     <div key={point.name}>
//                       <Marker position={point.center} icon={createCustomIcon("#8b5cf6", "🚀")}>
//                         <Popup>
//                           <div className="text-center p-2">
//                             <h3 className="font-bold text-purple-600">{point.name}</h3>
//                             <p className="text-sm">{point.country}</p>
//                             <p className="text-xs text-gray-500">{t("step5.regions.americas")}</p>
//                           </div>
//                         </Popup>
//                       </Marker>
//                       <Circle
//                         center={point.center}
//                         radius={1_000_000}
//                         pathOptions={{ color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.08, weight: 1 }}
//                       />
//                     </div>
//                   ))}

//                   {/* Middle East */}
//                   {coverageRegions.middleEast.map((point) => (
//                     <div key={point.name}>
//                       <Marker position={point.center} icon={createCustomIcon("#f59e0b", "🕌")}>
//                         <Popup>
//                           <div className="text-center p-2">
//                             <h3 className="font-bold text-orange-600">{point.name}</h3>
//                             <p className="text-sm">{point.country}</p>
//                             <p className="text-xs text-gray-500">{t("step5.regions.middleEast")}</p>
//                           </div>
//                         </Popup>
//                       </Marker>
//                       <Circle
//                         center={point.center}
//                         radius={700_000}
//                         pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.08, weight: 1 }}
//                       />
//                     </div>
//                   ))}
//                 </MapContainer>
//               )}
//             </div>

//             {/* Enhanced Coverage Legend */}
//             <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
//               <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
//                 <div className="w-4 h-4 bg-red-600 rounded-full"></div>
//                 <div>
//                   <p className="text-sm font-semibold text-red-800 dark:text-red-300">
//                     {t("step5.legend.iran")}
//                   </p>
//                   <p className="text-xs text-red-600 dark:text-red-400">{t("step5.legend.hq")}</p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
//                 <div className="w-4 h-4 bg-red-500 rounded-full"></div>
//                 <div>
//                   <p className="text-sm font-semibold text-green-800 dark:text-green-300">
//                     {t("step5.regions.asia")}
//                   </p>
//                   <p className="text-xs text-green-600 dark:text-green-400">
//                     {t("step5.legend.cities", { count: coverageRegions.asia.length })}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
//                 <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
//                 <div>
//                   <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">
//                     {t("step5.regions.europe")}
//                   </p>
//                   <p className="text-xs text-gray-600 dark:text-gray-400">
//                     {t("step5.legend.cities", { count: coverageRegions.europe.length })}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-black/20 rounded-lg border border-black/20 dark:border-black/40">
//                 <div className="w-4 h-4 bg-black rounded-full"></div>
//                 <div>
//                   <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">
//                     {t("step5.regions.americas")}
//                   </p>
//                   <p className="text-xs text-purple-600 dark:text-purple-400">
//                     {t("step5.legend.cities", { count: coverageRegions.americas.length })}
//                   </p>
//                 </div>
//               </div>
//               <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
//                 <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
//                 <div>
//                   <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">
//                     {t("step5.regions.middleEast")}
//                   </p>
//                   <p className="text-xs text-orange-600 dark:text-orange-400">
//                     {t("step5.legend.cities", { count: coverageRegions.middleEast.length })}
//                   </p>
//                 </div>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Cost Table Section */}
//       <motion.div
//         initial={{ opacity: 0, y: 20 }}
//         animate={{ opacity: 1, y: 0 }}
//         transition={{ delay: 0.4 }}
//         className="mt-8"
//       >
//         <div className="bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-700 p-6">
//           <div className="flex items-center gap-3 mb-6">
//             <div className="p-3 bg-green-500 rounded-lg">
//               <Calculator className="w-6 h-6 text-white" />
//             </div>
//             <div>
//               <h3 className="text-xl font-bold text-gray-900 dark:text-white">
//                 {t("step5.cost.title")}
//               </h3>
//               <p className="text-sm text-gray-600 dark:text-gray-400">
//                 {t("step5.cost.subtitle")}
//               </p>
//             </div>
//           </div>

//           <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
//             <Table>
//               <TableHeader>
//                 <TableRow className="bg-gray-50 dark:bg-gray-900/50">
//                   <TableHead className="text-right font-bold text-gray-900 dark:text-white">
//                     {t("step5.cost.columns.item")}
//                   </TableHead>
//                   <TableHead className="text-center font-bold text-gray-900 dark:text-white">
//                     {t("step5.cost.columns.qtyType")}
//                   </TableHead>
//                   <TableHead className="text-right font-bold text-gray-900 dark:text-white">
//                     {t("step5.cost.columns.cost")}
//                   </TableHead>
//                 </TableRow>
//               </TableHeader>
//               <TableBody>
//                 {/* eSIM Cost Row */}
//                 <TableRow>
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {t("step5.cost.rows.esimType")}
//                   </TableCell>
//                   <TableCell className="text-center text-gray-600 dark:text-gray-300">
//                     {step4Data.esimLineType || t("common.select")}
//                   </TableCell>
//                   <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
//                     {costBreakdown.formatted.esimCost}
//                   </TableCell>
//                 </TableRow>

//                 {/* Domestic Operators Row */}
//                 {/* <TableRow>
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {t("step5.cost.rows.domestic")}
//                   </TableCell>
//                   <TableCell className="text-center text-gray-600 dark:text-gray-300">
//                     {t("step5.count.operators", { count: selectedDomesticOperators.length })}
//                   </TableCell>
//                   <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
//                     {costBreakdown.formatted.domesticOperatorsCost}
//                   </TableCell>
//                 </TableRow> */}

//                 {/* Foreign Operators Row */}
//                 {/* <TableRow>
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {t("step5.cost.rows.foreign")}
//                   </TableCell>
//                   <TableCell className="text-center text-gray-600 dark:text-gray-300">
//                     {t("step5.count.operators", { count: selectedForeignOperators.length })}
//                   </TableCell>
//                   <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
//                     {costBreakdown.formatted.foreignOperatorsCost}
//                   </TableCell>
//                 </TableRow> */}

//                 {/* Services Row */}
//                 <TableRow>
//                   <TableCell className="font-medium text-gray-900 dark:text-white">
//                     {t("step5.cost.rows.services")}
//                   </TableCell>
//                   <TableCell className="text-center text-gray-600 dark:text-gray-300">
//                     {t("step5.count.services", {
//                       count: step4Data.selectedServices?.length || 0,
//                     })}
//                   </TableCell>
//                   <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
//                     {t("step5.cost.rows.servicesFree")}
//                   </TableCell>
//                 </TableRow>
//               </TableBody>
//               <TableFooter>
//                 <TableRow className="bg-gradient-to-r from-green-100 to-green-100 dark:from-green-900/40 dark:to-green-900/40">
//                   <TableCell className="font-bold text-lg text-gray-900 dark:text-white">
//                     {t("step5.cost.total")}
//                   </TableCell>
//                   <TableCell></TableCell>
//                   <TableCell className="text-right font-bold text-xl text-green-600 dark:text-green-400">
//                     {t("step5.cost.totalWith", { total: costBreakdown.formatted.total })}
//                   </TableCell>
//                 </TableRow>
//               </TableFooter>
//             </Table>
//           </div>

//           {/* Services List */}
//           {step4Data.selectedServices && step4Data.selectedServices.length > 0 && (
//             <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
//               <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
//                 {t("step5.servicesSelected.title")}
//               </h4>
//               <div className="flex flex-wrap gap-2">
//                 {step4Data.selectedServices.map((service) => (
//                   <span
//                     key={service}
//                     className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
//                   >
//                     {service}
//                   </span>
//                 ))}
//               </div>
//             </div>
//           )}

//           {/* No Services Selected Message */}
//           {(!step4Data.selectedServices || step4Data.selectedServices.length === 0) && (
//             <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
//               <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
//                 {t("step5.noServices")}
//               </p>
//             </div>
//           )}
//         </div>
//       </motion.div>

//       {/* Form Actions */}
//       <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
//         <Form {...form}>
//           <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
//             {/* Hidden form fields for validation */}
//             <FormField
//               control={form.control}
//               name="domesticOperators"
//               render={() => (
//                 <FormItem className="hidden">
//                   <FormControl>
//                     <input type="hidden" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />
//             <FormField
//               control={form.control}
//               name="foreignOperators"
//               render={() => (
//                 <FormItem className="hidden">
//                   <FormControl>
//                     <input type="hidden" />
//                   </FormControl>
//                 </FormItem>
//               )}
//             />

//             {/* Action Buttons */}
//             <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto">
//               <Button
//                 type="button"
//                 variant="outline"
//                 onClick={onBack}
//                 className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
//               >
//                 {t("step5.cta.prev")}
//               </Button>
//               <Button
//                 type="button"
//                 onClick={() => form.handleSubmit(onSubmit)()}
//                 className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all"
//                 disabled={
//                   (selectedDomesticOperators.length === 0 &&
//                     selectedForeignOperators.length === 0) ||
//                   costBreakdown.total === 0
//                 }
//               >
//                 {t("step5.cta.pay", { total: costBreakdown.formatted.total })}
//                 <CreditCard className="mr-3 h-6 w-6" />
//               </Button>
//             </div>

//             {/* Summary */}
//             {(selectedDomesticOperators.length > 0 || selectedForeignOperators.length > 0) && (
//               <div className="text-center">
//                 <p className="text-lg text-gray-600 dark:text-gray-300">
//                   {t("step5.summary", {
//                     domestic: selectedDomesticOperators.length,
//                     foreign: selectedForeignOperators.length,
//                   })}
//                 </p>
//               </div>
//             )}
//           </form>
//         </Form>
//       </div>
//     </motion.div>
//   );
// }



import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Globe, CreditCard, Calculator } from "lucide-react";
import { useTranslation } from "react-i18next";

import { Button } from "@/components/ui/button";
import { Form, FormControl, FormField, FormItem } from "@/components/ui/form";
import {
  Select,
  SelectItem,
  SelectValue,
  SelectTrigger,
  SelectContent,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import L from "leaflet";

import {
  step5Schema,
  type Step5FormData,
  type Step4FormData,
  CONTINENTS,
  DISABLED_CONTINENTS,
  COUNTRY_BY_CONTINENT,
} from "@/types/registration";

/* ------------------- React-Leaflet default marker fix --------------------- */
delete (L.Icon.Default.prototype as unknown as { _getIconUrl: unknown })._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

/* ------------------------- Custom Map Marker Icon ------------------------- */
const createCustomIcon = (color: string, emoji: string) =>
  L.divIcon({
    html: `<div style="background-color: ${color}; width: 30px; height: 30px; border-radius: 50%; display: flex; align-items: center; justify-content: center; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3); font-size: 16px;">${emoji}</div>`,
    className: "custom-marker",
    iconSize: [30, 30],
    iconAnchor: [15, 15],
  });

/* ---------------------------- Component Props ----------------------------- */
interface Step5OperatorSelectionProps {
  onSubmit: (data: Step5FormData) => void;
  onBack: () => void;
  step4Data: Step4FormData;
}

/* ----------------------------- Animations --------------------------------- */
const containerVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6 },
  },
  exit: {
    opacity: 0,
    y: -20,
    transition: { duration: 0.3 },
  },
};

/* ----------------------------- Map Coverage ------------------------------- */
const coverageRegions = {
  iran: {
    center: [32.4279, 53.688] as [number, number],
    color: "#dc2626",
    name: "Iran",
  },
  asia: [
    { center: [35.6762, 139.6503] as [number, number], name: "Tokyo", country: "Japan" },
    { center: [1.3521, 103.8198] as [number, number], name: "Singapore", country: "Singapore" },
    { center: [22.3193, 114.1694] as [number, number], name: "Hong Kong", country: "China" },
    { center: [37.5665, 126.978] as [number, number], name: "Seoul", country: "South Korea" },
    { center: [13.7563, 100.5018] as [number, number], name: "Bangkok", country: "Thailand" },
  ],
  europe: [
    { center: [51.5074, -0.1278] as [number, number], name: "London", country: "United Kingdom" },
    { center: [48.8566, 2.3522] as [number, number], name: "Paris", country: "France" },
    { center: [52.3676, 4.9041] as [number, number], name: "Amsterdam", country: "Netherlands" },
    { center: [50.1109, 8.6821] as [number, number], name: "Frankfurt", country: "Germany" },
    { center: [59.3293, 18.0686] as [number, number], name: "Stockholm", country: "Sweden" },
  ],
  americas: [
    { center: [40.7128, -74.006] as [number, number], name: "New York", country: "USA" },
    { center: [34.0522, -118.2437] as [number, number], name: "Los Angeles", country: "USA" },
    { center: [43.6532, -79.3832] as [number, number], name: "Toronto", country: "Canada" },
    { center: [-23.5505, -46.6333] as [number, number], name: "São Paulo", country: "Brazil" },
  ],
  middleEast: [
    { center: [25.2048, 55.2708] as [number, number], name: "Dubai", country: "UAE" },
    { center: [41.0082, 28.9784] as [number, number], name: "Istanbul", country: "Turkey" },
    { center: [25.2854, 51.531] as [number, number], name: "Doha", country: "Qatar" },
  ],
};

export function Step5OperatorSelection({
  onSubmit,
  onBack,
  step4Data,
}: Step5OperatorSelectionProps) {
  const { i18n } = useTranslation();

  const [mapError] = useState<boolean>(false);

  const form = useForm<Step5FormData>({
    resolver: zodResolver(step5Schema),
    mode: "onChange",
    defaultValues: {
      continent: undefined,
      country: undefined,
    },
  });

  // Normalize line type across locales (fa/en)
  const isCredit = useMemo(() => {
    // Support both i18n key and literal values you may pass into step4Data.esimLineType
    const creditLabels = ["esimCredit", "خط eSIM اعتباری", "Credit eSIM Line"];
    return creditLabels.includes(step4Data.esimLineType as unknown as string);
  }, [step4Data.esimLineType]);

  const isPermanent = useMemo(() => {
    const permLabels = ["esimPermanent", "خط eSIM دائمی", "Permanent eSIM Line"];
    return permLabels.includes(step4Data.esimLineType as unknown as string);
  }, [step4Data.esimLineType]);

  // Cost calculation (operators removed; only eSIM type & services)
  const costBreakdown = useMemo(() => {
    const costs = {
      esimCost: 0,
      servicesCost: 0, // Free
    };

    if (isCredit) costs.esimCost = 1_500_000; // 1.5M
    else if (isPermanent) costs.esimCost = 6_000_000; // 6M

    const total = costs.esimCost + costs.servicesCost;

    const locale = i18n.language === "fa" ? "fa-IR" : "en-US";
    return {
      ...costs,
      total,
      formatted: {
        esimCost: costs.esimCost.toLocaleString(locale),
        servicesCost: costs.servicesCost.toLocaleString(locale),
        total: total.toLocaleString(locale),
      },
    };
  }, [isCredit, isPermanent, i18n.language]);

  const continent = form.watch("continent");
  const country = form.watch("country");

  const countryOptions = useMemo(() => {
    if (continent === "Asia") return COUNTRY_BY_CONTINENT.Asia.map((c) => ({ label: c, value: c }));
    if (continent === "Europe") return COUNTRY_BY_CONTINENT.Europe.map((c) => ({ label: c, value: c }));
    return [];
  }, [continent]);

  // Clear country when continent changes to an incompatible value
  useMemo(() => {
    if (!countryOptions.find((c) => c.value === country)) {
      form.setValue("country", undefined);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [continent, countryOptions, form]);

  return (
    <motion.div
      key="step5"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      exit="exit"
      className="w-full"
    >
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-r from-red-500 to-red-600 rounded-full mb-4">
          <Globe className="w-8 h-8 text-white" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-3">
          انتخاب منطقه و کشور (eSIM)
        </h2>
        <p className="text-lg text-gray-600 dark:text-gray-300">
          قاره را انتخاب کنید؛ برای آسیا/اروپا کشور الزامی است.
        </p>
      </div>

      {/* Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-4 gap-4 lg:gap-6 xl:gap-8">
        {/* Left Sidebar: Continent + Country */}
        <div className="lg:col-span-1 xl:col-span-1 space-y-6">
          {/* Continent */}
          <div className="bg-gradient-to-r from-red-50 to-red-50 dark:from-red-900/20 dark:to-red-900/20 rounded-xl border border-red-200 dark:border-red-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-red-500 rounded-lg">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">The continent</h3>
            </div>

            <Form {...form}>
              <FormField
                control={form.control}
                name="continent"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select onValueChange={field.onChange} value={field.value}>
                        <SelectTrigger className="w-full">
                          <SelectValue placeholder="Select continent" />
                        </SelectTrigger>
                        <SelectContent>
                          {CONTINENTS.map((c) => (
                            <SelectItem
                              key={c}
                              value={c}
                              disabled={DISABLED_CONTINENTS.includes(c as any)}
                            >
                              {c}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>

            <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
              America, Australia, and Africa are temporarily unavailable.
            </p>
          </div>

          {/* Country */}
          <div className="bg-gradient-to-r from-gray-50 to-gray-50 dark:from-gray-900/20 dark:to-gray-900/20 rounded-xl border border-gray-200 dark:border-gray-700 p-4">
            <div className="flex items-center gap-2 mb-4">
              <div className="p-1.5 bg-gray-500 rounded-lg">
                <Globe className="w-4 h-4 text-white" />
              </div>
              <h3 className="text-base font-bold text-gray-900 dark:text-white">Country</h3>
            </div>

            <Form {...form}>
              <FormField
                control={form.control}
                name="country"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        value={field.value}
                        disabled={!(continent === "Asia" || continent === "Europe")}
                      >
                        <SelectTrigger className="w-full">
                          <SelectValue
                            placeholder={
                              continent === "Asia" || continent === "Europe"
                                ? "Select country"
                                : "Select a continent first"
                            }
                          />
                        </SelectTrigger>
                        <SelectContent>
                          {countryOptions.map((opt) => (
                            <SelectItem key={opt.value} value={opt.value}>
                              {opt.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </FormControl>
                  </FormItem>
                )}
              />
            </Form>

            {(continent === "Asia" || continent === "Europe") && (
              <p className="mt-2 text-xs text-gray-600 dark:text-gray-300">
                {continent === "Asia" ? "Available: Iran, Arabia" : "Available: Germany"}
              </p>
            )}
          </div>
        </div>

        {/* Right: Map */}
        <div className="lg:col-span-1 xl:col-span-3">
          <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-900/20 dark:to-gray-900/20 rounded-xl border border-slate-200 dark:border-slate-700 p-6 h-full">
            <div className="flex items-center gap-3 mb-6">
              <div className="p-3 bg-gradient-to-r from-red-500 to-red-600 rounded-lg">
                <Globe className="w-6 h-6 text-white" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                  نقشه پوشش جهانی eSIM داریا سل
                </h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  مناطق پوشش شده در سراسر جهان
                </p>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-4 border shadow-lg overflow-hidden">
              {mapError ? (
                <div className="flex items-center justify-center h-[400px] text-gray-500">
                  <div className="text-center">
                    <Globe className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                    <p className="text-lg font-medium">در حال بارگذاری نقشه...</p>
                    <p className="text-sm">پوشش جهانی eSIM داریا سل</p>
                  </div>
                </div>
              ) : (
                <MapContainer
                  center={[20, 0]}
                  zoom={2}
                  className="w-full h-[400px] rounded-lg"
                  style={{ background: "transparent" }}
                >
                  <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  />

                  {/* HQ */}
                  <Marker position={coverageRegions.iran.center} icon={createCustomIcon("#dc2626", "🏢")}>
                    <Popup>
                      <div className="text-center p-2">
                        <h3 className="font-bold text-red-600">دفتر مرکزی</h3>
                        <p className="text-sm">Iran</p>
                      </div>
                    </Popup>
                  </Marker>
                  <Circle
                    center={coverageRegions.iran.center}
                    radius={1_500_000}
                    pathOptions={{ color: "#dc2626", fillColor: "#dc2626", fillOpacity: 0.1, weight: 2 }}
                  />

                  {/* Asia */}
                  {coverageRegions.asia.map((point) => (
                    <div key={point.name}>
                      <Marker position={point.center} icon={createCustomIcon("#10b981", "📡")}>
                        <Popup>
                          <div className="text-center p-2">
                            <h3 className="font-bold text-green-600">{point.name}</h3>
                            <p className="text-sm">{point.country}</p>
                            <p className="text-xs text-gray-500">Asia</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={point.center}
                        radius={800_000}
                        pathOptions={{ color: "#10b981", fillColor: "#10b981", fillOpacity: 0.08, weight: 1 }}
                      />
                    </div>
                  ))}

                  {/* Europe */}
                  {coverageRegions.europe.map((point) => (
                    <div key={point.name}>
                      <Marker position={point.center} icon={createCustomIcon("#3b82f6", "🌐")}>
                        <Popup>
                          <div className="text-center p-2">
                            <h3 className="font-bold text-red-600">{point.name}</h3>
                            <p className="text-sm">{point.country}</p>
                            <p className="text-xs text-gray-500">Europe</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={point.center}
                        radius={600_000}
                        pathOptions={{ color: "#3b82f6", fillColor: "#3b82f6", fillOpacity: 0.08, weight: 1 }}
                      />
                    </div>
                  ))}

                  {/* Americas */}
                  {coverageRegions.americas.map((point) => (
                    <div key={point.name}>
                      <Marker position={point.center} icon={createCustomIcon("#8b5cf6", "🚀")}>
                        <Popup>
                          <div className="text-center p-2">
                            <h3 className="font-bold text-purple-600">{point.name}</h3>
                            <p className="text-sm">{point.country}</p>
                            <p className="text-xs text-gray-500">Americas</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={point.center}
                        radius={1_000_000}
                        pathOptions={{ color: "#8b5cf6", fillColor: "#8b5cf6", fillOpacity: 0.08, weight: 1 }}
                      />
                    </div>
                  ))}

                  {/* Middle East */}
                  {coverageRegions.middleEast.map((point) => (
                    <div key={point.name}>
                      <Marker position={point.center} icon={createCustomIcon("#f59e0b", "🕌")}>
                        <Popup>
                          <div className="text-center p-2">
                            <h3 className="font-bold text-orange-600">{point.name}</h3>
                            <p className="text-sm">{point.country}</p>
                            <p className="text-xs text-gray-500">Middle East</p>
                          </div>
                        </Popup>
                      </Marker>
                      <Circle
                        center={point.center}
                        radius={700_000}
                        pathOptions={{ color: "#f59e0b", fillColor: "#f59e0b", fillOpacity: 0.08, weight: 1 }}
                      />
                    </div>
                  ))}
                </MapContainer>
              )}
            </div>

            {/* Legend */}
            <div className="mt-6 grid grid-cols-2 md:grid-cols-5 gap-3">
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <div className="w-4 h-4 bg-red-600 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-red-800 dark:text-red-300">Iran</p>
                  <p className="text-xs text-red-600 dark:text-red-400">HQ</p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-red-50 dark:bg-red-900/20 rounded-lg border border-red-200 dark:border-red-700">
                <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-green-800 dark:text-green-300">Asia</p>
                  <p className="text-xs text-green-600 dark:text-green-400">
                    {coverageRegions.asia.length} cities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="w-4 h-4 bg-gray-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-300">Europe</p>
                  <p className="text-xs text-gray-600 dark:text-gray-400">
                    {coverageRegions.europe.length} cities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-black/5 dark:bg-black/20 rounded-lg border border-black/20 dark:border-black/40">
                <div className="w-4 h-4 bg-black rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-purple-800 dark:text-purple-300">Americas</p>
                  <p className="text-xs text-purple-600 dark:text-purple-400">
                    {coverageRegions.americas.length} cities
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3 p-3 bg-orange-50 dark:bg-orange-900/20 rounded-lg border border-orange-200 dark:border-orange-700">
                <div className="w-4 h-4 bg-orange-500 rounded-full"></div>
                <div>
                  <p className="text-sm font-semibold text-orange-800 dark:text-orange-300">Middle East</p>
                  <p className="text-xs text-orange-600 dark:text-orange-400">
                    {coverageRegions.middleEast.length} cities
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Cost Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="mt-8"
      >
        <div className="bg-gradient-to-r from-green-50 to-green-50 dark:from-green-900/20 dark:to-green-900/20 rounded-xl border border-green-200 dark:border-green-700 p-6">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-3 bg-green-500 rounded-lg">
              <Calculator className="w-6 h-6 text-white" />
            </div>
            <div>
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">جدول هزینه‌ها</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400">محاسبه هزینه سرویس شما</p>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-xl border shadow-sm overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-gray-50 dark:bg-gray-900/50">
                  <TableHead className="text-right font-bold text-gray-900 dark:text-white">
                    آیتم
                  </TableHead>
                  <TableHead className="text-center font-bold text-gray-900 dark:text-white">
                    تعداد/نوع
                  </TableHead>
                  <TableHead className="text-right font-bold text-gray-900 dark:text-white">
                    هزینه (تومان)
                  </TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    نوع سیم کارت eSIM
                  </TableCell>
                  <TableCell className="text-center text-gray-600 dark:text-gray-300">
                    {step4Data.esimLineType || "انتخاب نشده"}
                  </TableCell>
                  <TableCell className="text-right font-semibold text-gray-900 dark:text-white">
                    {costBreakdown.formatted.esimCost}
                  </TableCell>
                </TableRow>

                <TableRow>
                  <TableCell className="font-medium text-gray-900 dark:text-white">
                    سرویس‌های انتخابی
                  </TableCell>
                  <TableCell className="text-center text-gray-600 dark:text-gray-300">
                    {step4Data.selectedServices?.length || 0} سرویس
                  </TableCell>
                  <TableCell className="text-right font-semibold text-green-600 dark:text-green-400">
                    رایگان
                  </TableCell>
                </TableRow>
              </TableBody>
              <TableFooter>
                <TableRow className="bg-gradient-to-r from-green-100 to-green-100 dark:from-green-900/40 dark:to-green-900/40">
                  <TableCell className="font-bold text-lg text-gray-900 dark:text-white">
                    مجموع کل
                  </TableCell>
                  <TableCell />
                  <TableCell className="text-right font-bold text-xl text-green-600 dark:text-green-400">
                    {costBreakdown.formatted.total} تومان
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </div>

          {/* Services List */}
          {step4Data.selectedServices && step4Data.selectedServices.length > 0 ? (
            <div className="mt-4 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-700">
              <h4 className="font-semibold text-blue-800 dark:text-blue-300 mb-2">
                سرویس‌های رایگان انتخاب شده:
              </h4>
              <div className="flex flex-wrap gap-2">
                {step4Data.selectedServices.map((service) => (
                  <span
                    key={service}
                    className="px-3 py-1 bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-300 rounded-full text-sm"
                  >
                    {service}
                  </span>
                ))}
              </div>
            </div>
          ) : (
            <div className="mt-4 p-4 bg-gray-50 dark:bg-gray-900/20 rounded-lg border border-gray-200 dark:border-gray-700">
              <p className="text-center text-gray-600 dark:text-gray-400 text-sm">
                هیچ سرویسی انتخاب نشده است - همه سرویس‌ها رایگان هستند
              </p>
            </div>
          )}
        </div>
      </motion.div>

      {/* Actions */}
      <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-8">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="flex flex-col sm:flex-row justify-center w-full gap-4 sm:gap-6 max-w-lg mx-auto">
              <Button
                type="button"
                variant="outline"
                onClick={onBack}
                className="flex-1 py-4 px-8 text-lg font-semibold rounded-xl border-2 hover:bg-gray-50 dark:hover:bg-gray-800"
              >
                مرحله قبل
              </Button>

              <Button
                type="submit"
                className="flex-1 py-4 px-8 text-lg font-semibold bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white shadow-xl hover:shadow-2xl rounded-xl transition-all"
                disabled={!form.formState.isValid || costBreakdown.total === 0}
              >
                پرداخت {costBreakdown.formatted.total} تومان
                <CreditCard className="mr-3 h-6 w-6" />
              </Button>
            </div>

            {/* Summary */}
            {(continent || country) && (
              <div className="text-center">
                <p className="text-lg text-gray-600 dark:text-gray-300">
                  قاره انتخابی: <span className="font-bold text-green-600">{continent || "-"}</span>
                  {"  "}— کشور: <span className="font-bold text-red-600">{country || "-"}</span>
                </p>
              </div>
            )}
          </form>
        </Form>
      </div>
    </motion.div>
  );
}
