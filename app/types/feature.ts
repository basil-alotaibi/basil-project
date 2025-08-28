export type RowStatus = "Active" | "Inactive";

export type FeatureRow = {
  code: string;
  englishTitle?: string;
  arabicTitle?: string;
  status: RowStatus;
  iconUrl?: string;
};

export type Feature = {
  id: string;
  englishTitle: string;
  arabicTitle: string;
  iconUrl?: string;
  active: boolean;
};
