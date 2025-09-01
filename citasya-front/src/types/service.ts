export interface SpecialtyData {
  id: number;
  name: string;
}

export interface ServiceData {
  id: string;
  name: string;
  specialty: SpecialtyData;
  description: string;
  minutes_duration: number;
  price: number;
  status: string;
}