export interface Thing {
  id: number;
  user_name: string;
  img_name: string;
  thing_title: string;
  date: Date;
  location: string;
  category: 'nature'|'city'|'ufo'|'ghost';
  votes: number;
}
