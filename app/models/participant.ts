import { Language } from './language';
import { Photo } from './photo';

export interface Participant {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  birthdate: string;
  age: number;
  gender: string;
  language: Language;
  photos?: Photo[];
}
