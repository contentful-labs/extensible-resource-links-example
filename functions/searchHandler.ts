import { FunctionEventContext } from '@contentful/node-apps-toolkit';
import { fetchApi, getUrls, transformResult } from './helpers';
import {
  AppInstallationParameters,
  ResourcesSearchResponse,
  TmdbItem
} from './types';

export type ResourcesSearchRequest = {
  type: 'resources.search';
  resourceType: string;
  query: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};

export type TmdbSearchResponse = {
  results: TmdbItem[];
  total_pages: number;
  page: number;
};

const fetchSearch = async (
  url: string,
  prefix: string,
  context: FunctionEventContext<AppInstallationParameters>
) => {
  const tmdbResponse = (await fetchApi(url, context)) as TmdbSearchResponse;

  if (!tmdbResponse) {
    return { items: [], pages: {} };
  }

  return {
    items: tmdbResponse.results.map(transformResult(prefix)),
    pages: {
      nextCursor:
        tmdbResponse.total_pages > tmdbResponse.page
          ? String(tmdbResponse.page + 1)
          : undefined
    }
  };
};

export const searchHandler = async (
  event: ResourcesSearchRequest,
  context: FunctionEventContext<AppInstallationParameters>
): Promise<ResourcesSearchResponse> => {
  const { prefixUrl, searchUrl } = getUrls(event.resourceType, {
    query: event.query,
    page: event.pages?.nextCursor ?? '1'
  });

  return fetchSearch(searchUrl, prefixUrl, context);
};
