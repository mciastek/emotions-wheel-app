import { Language } from './language';

export interface Participant {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  age: number;
  gender: string;
  language: Language;
}
