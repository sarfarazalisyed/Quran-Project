export interface Reciter {
  id: string;
  name: string;
  style: string;
  language: string;
}

export const TOP_RECITERS: Reciter[] = [
  { id: "ar.alafasy", name: "Mishary Rashid Alafasy", style: "Murattal", language: "Arabic" },
  { id: "ar.abdulbasitmurattal", name: "Abdul Basit (Murattal)", style: "Murattal", language: "Arabic" },
  { id: "ar.abdulbasitmujawwad", name: "Abdul Basit (Mujawwad)", style: "Mujawwad", language: "Arabic" },
  { id: "ar.husary", name: "Mahmoud Khalil Al-Husary", style: "Murattal", language: "Arabic" },
  { id: "ar.husarymujawwad", name: "Mahmoud Khalil Al-Husary", style: "Mujawwad", language: "Arabic" },
  { id: "ar.minshawi", name: "Mohamed Siddiq Al-Minshawi", style: "Murattal", language: "Arabic" },
  { id: "ar.minshawimujawwad", name: "Mohamed Siddiq Al-Minshawi", style: "Mujawwad", language: "Arabic" },
  { id: "ar.muhammadjibreel", name: "Muhammad Jibreel", style: "Murattal", language: "Arabic" },
  { id: "ar.saoodshuraym", name: "Saud Al-Shuraim", style: "Murattal", language: "Arabic" },
  { id: "ar.abdurrahmaansudais", name: "Abdurrahmaan As-Sudais", style: "Murattal", language: "Arabic" }
];
