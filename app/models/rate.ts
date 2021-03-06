export interface Rate {
  id?: number,
  name: string;
  pos_x: number;
  pos_y: number;
  start_time: number | string;
  end_time: number | string;
  time: number;

  photo_id: number;
  experiment_id: number;
  participant_id: number;
}
