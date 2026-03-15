import { Salto } from "./salto";

export interface SaltoGroup {
  title: string;
  type: 'front' | 'back';
  items: Salto[];
}
