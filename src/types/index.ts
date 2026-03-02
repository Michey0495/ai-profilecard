export interface ProfileInput {
  name: string;
  interests: string;
  personality: string;
  style: string;
}

export interface ProfileStat {
  label: string;
  value: number;
}

export interface ProfileResult {
  id: string;
  input: ProfileInput;
  title: string;
  catchcopy: string;
  type: string;
  description: string;
  stats: ProfileStat[];
  hashtags: string[];
  createdAt: string;
}
