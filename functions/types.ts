export type Scalar = string | number | boolean;

export type ResourcesSearchResponse = {
  items: object[];
  pages: {
    nextCursor?: string;
  };
};

export type ResourcesLookupResponse = ResourcesSearchResponse;

export type AppInstallationParameters = {
  tmdbAccessToken: string;
};

export type TmdbItem = {
  poster_path: string;
  profile_path: string;
  id: number;
};
