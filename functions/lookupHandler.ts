import { FunctionEventContext } from '@contentful/node-apps-toolkit';
import { fetchApi, getUrls, transformResult } from './helpers';
import {
  AppInstallationParameters,
  ResourcesLookupResponse,
  Scalar,
  TmdbItem
} from './types';

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

export type TmdbLookupResponse = TmdbItem;

const fetchLookup = async (
  url: string,
  prefix: string,
  context: FunctionEventContext<AppInstallationParameters>
) => {
  const tmdbResponse = (await fetchApi(url, context)) as TmdbLookupResponse;

  if (!tmdbResponse) {
    return { items: [], pages: {} };
  }

  return { items: [transformResult(prefix)(tmdbResponse)], pages: {} };
};

export const lookupHandler = async (
  event: ResourcesLookupRequest,
  context: FunctionEventContext<AppInstallationParameters>
): Promise<ResourcesLookupResponse> => {
  const { lookupUrl, prefixUrl } = getUrls(event.resourceType, {
    urn: event.lookupBy.urns[0]
  });

  return fetchLookup(lookupUrl, prefixUrl, context);
};
