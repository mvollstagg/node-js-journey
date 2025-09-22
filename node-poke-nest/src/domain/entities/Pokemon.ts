export type Pokemon = {
  id: number;
  name: string;
  height: number;
  weight: number;
  types: string[];
  sprite?: string | null;
};