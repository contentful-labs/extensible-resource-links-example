import {FunctionEventHandler, FunctionEventType} from '@contentful/node-apps-toolkit';
import {FunctionEventContext} from "@contentful/node-apps-toolkit/lib/requests/typings/function";
import {
  ResourcesLookupRequest,
  ResourcesLookupResponse,
  ResourcesSearchRequest,
  ResourcesSearchResponse
} from "./types";


type AppInstallationParameters = {
  storefrontAccessToken: string
}

const transformResult = (externalUrlPrefix: string) => (result: any) => {
  const imageUrl = result.poster_path || result.profile_path;

  return ({
    ...result,
    id: String(result.id),
    ...(imageUrl && {
      image: {
        url: `https://image.tmdb.org/t/p/w200${result.poster_path || result.profile_path}`
      }
    }),
    externalUrl: `${externalUrlPrefix}${result.id}`
  })
}

const fetchApi = async (url: string, externalUrlPrefix: string, context: FunctionEventContext<AppInstallationParameters>) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${context.appInstallationParameters.storefrontAccessToken}`
    }
  };

  const result = await fetch(url, options)
    .then((res: any) => res.json())
    .then((json: any) => {
      console.log(json)
      return json
    })
    .catch((err: any) => {
      console.error('error:' + err)
      throw err
    });

  if (!result) {
    return {items: [], pages: {}}
  }

  if (Array.isArray(result.results)) {
    return {
      items: result.results.map(transformResult(externalUrlPrefix)),
      pages: {
        nextCursor: result.total_pages > result.page ? String(result.page + 1) : undefined
      }
    }
  }

  return {items: [transformResult(externalUrlPrefix)(result)], pages: {}}
}

const searchHandler = async (event: ResourcesSearchRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesSearchResponse> => {
  let url: string;
  let externalUrlPrefix: string;
  switch (event.resourceType) {
    case 'TMDB:Movie':
      externalUrlPrefix = 'https://www.themoviedb.org/movie/';
      url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      if (event.query) {
        url = `https://api.themoviedb.org/3/search/movie?query=${event.query}&include_adult=false&language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      }
      break;
    case 'TMDB:Series':
      externalUrlPrefix = 'https://www.themoviedb.org/tv/';
      url = `https://api.themoviedb.org/3/tv/popular?language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      if (event.query) {
        url = `https://api.themoviedb.org/3/search/tv?query=${event.query}&include_adult=false&language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      }
      break;
    case 'TMDB:Person':
      externalUrlPrefix = 'https://www.themoviedb.org/person/';
        url = `https://api.themoviedb.org/3/person/popular?language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      if (event.query) {
        url = `https://api.themoviedb.org/3/search/person?query=${event.query}&include_adult=false&language=en-US&page=${event.pages?.nextCursor ?? 1}`;
      }
      break;
    default:
      throw new Error("Bad Request");
  }

  return fetchApi(url, externalUrlPrefix, context)
};

const lookupHandler = async (event: ResourcesLookupRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesLookupResponse> => {
  let url: string;
  let externalUrlPrefix: string;
  switch (event.resourceType) {
    case 'TMDB:Movie':
      externalUrlPrefix = 'https://www.themoviedb.org/movie/';
      url = `https://api.themoviedb.org/3/movie/${event.lookupBy.urns[0]}?language=en-US`;
      break;
    case 'TMDB:Series':
      externalUrlPrefix = 'https://www.themoviedb.org/tv/';
      url = `https://api.themoviedb.org/3/tv/${event.lookupBy.urns[0]}?language=en-US`;
      break;
    case 'TMDB:Person':
      externalUrlPrefix = 'https://www.themoviedb.org/person/';
      url = `https://api.themoviedb.org/3/person/${event.lookupBy.urns[0]}?language=en-US`;
      break;
    default:
      throw new Error("Bad Request");
  }

  return fetchApi(url, externalUrlPrefix, context)
};

// @ts-expect-error ...
export const handler: FunctionEventHandler<FunctionEventType, any> = (event, context) => {
  switch (event.type) {
    // @ts-expect-error ...
    case "resources.search": {
      return searchHandler(event, context);
    }
    // @ts-expect-error ...
    case "resources.lookup": {
      return lookupHandler(event, context);
    }
    default:
      throw new Error("Bad Request");
  }
};
