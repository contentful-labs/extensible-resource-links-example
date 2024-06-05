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

type Person = {
  id: number;
  gender: number;
  name: string;
  known_for_department: string;
};

type Movie = {
  id: number;
  poster_path: string;
  profile_path: string;
};

export type TmdbItem = Movie | Person;
