import { Scalar } from './common';
import { Resource } from './tmdb';

export type ResourcesLookupRequest<
  L extends Record<string, Scalar[]> = Record<string, Scalar[]>
> = {
  type: 'resources.lookup';
  lookupBy: L;
  resourceType: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};

export type ResourcesLookupResponse = {
  items: Resource[];
  pages: {
    nextCursor?: string;
  };
};

export type ResourcesSearchRequest = {
  type: 'resources.search';
  resourceType: string;
  query: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};

export type ResourcesSearchResponse = {
  items: Resource[];
  pages: {
    nextCursor?: string;
  };
};
