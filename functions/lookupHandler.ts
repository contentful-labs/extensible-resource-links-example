import { FunctionEventContext } from '@contentful/node-apps-toolkit';
import { fetchApi, getUrls, transformResult } from './helpers';
import { AppInstallationParameters } from './types/common';
import {
  ResourcesLookupRequest,
  ResourcesLookupResponse
} from './types/handler';
import { TmdbLookupResponse } from './types/tmdb';

const fetchLookup = async (
  urls: string[],
  prefix: string,
  context: FunctionEventContext<AppInstallationParameters>
) => {
  const items = await Promise.all(
    urls.map((url) =>
      fetchApi<TmdbLookupResponse>(url, context).then((response) =>
        transformResult(prefix)(response)
      )
    )
  );

  return { items, pages: {} };
};

export const lookupHandler = async (
  event: ResourcesLookupRequest,
  context: FunctionEventContext<AppInstallationParameters>
): Promise<ResourcesLookupResponse> => {
  const { lookupUrls, prefixUrl } = getUrls(event.resourceType, {
    urns: event.lookupBy.urns
  });

  return fetchLookup(lookupUrls, prefixUrl, context);
};
