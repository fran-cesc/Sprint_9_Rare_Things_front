export interface Thing {
  thing_id: number;
  user_name: string;
  img_name: string;
  thing_title: string;
  date: Date;
  location: string;
  category: 'nature'|'city'|'ufo'|'ghost';
  votes: number;
  user_id: number;
}

