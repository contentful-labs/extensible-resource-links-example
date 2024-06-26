import type {
  ResourcesLookupRequest,
  ResourcesSearchRequest
} from '../../functions/types/handler';
import {
  TmdbItem,
  TmdbLookupResponse,
  TmdbSearchResponse
} from '../../functions/types/tmdb';

export const context = {} as any;

export const createSearchEvent = (): ResourcesSearchRequest => ({
  type: 'resources.search',
  resourceType: 'TMDB:Person',
  query: 'test query'
});

const createSingleTmdbResponse = (id: number): TmdbItem => ({
  id,
  name: 'John Doe',
  profile_path: `/profile${id}.jpg`
});

export const createTmdbSearchResponse = ({
  page = 0
} = {}): TmdbSearchResponse => ({
  results: [createSingleTmdbResponse(1), createSingleTmdbResponse(2)],
  total_pages: 2,
  page
});

export const createLookupEvent = (): ResourcesLookupRequest => ({
  type: 'resources.lookup',
  resourceType: 'TMDB:Person',
  lookupBy: { urns: ['15', '22'] }
});

export const createTmdbLookupResponse = (id = 1): TmdbLookupResponse =>
  createSingleTmdbResponse(id);
