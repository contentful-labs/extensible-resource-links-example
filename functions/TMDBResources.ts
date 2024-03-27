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

const transformResult = (result: any) => {
  return ({
    ...result,
    id: String(result.id),
    image: {
      url: `https://image.tmdb.org/t/p/w200${result.poster_path}`
    },
  })
}

const fetchApi = async (url: string, context: FunctionEventContext<AppInstallationParameters>) => {
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

  if(!result){
    return {items: [], pages: {}}
  }

  if(Array.isArray( result.results)){
    return {
      items: result.results.map(transformResult),
      pages: {
        nextCursor: result.total_pages > result.page ? String(result.page + 1) : undefined
      }
    }
  }

  return { items: [transformResult(result)], pages: {}}
}

const searchHandler = async (event: ResourcesSearchRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesSearchResponse> => {
  let url = `https://api.themoviedb.org/3/movie/popular?language=en-US&page=${event.pages?.nextCursor ?? 1}`;
  if(event.query){
    url = `https://api.themoviedb.org/3/search/movie?query=${event.query}&include_adult=false&language=en-US&page=${event.pages?.nextCursor ?? 1}`;
  }

  return fetchApi(url, context)
};

const lookupHandler = async (event: ResourcesLookupRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesLookupResponse> => {
  const url = `https://api.themoviedb.org/3/movie/${event.lookupBy.urns[0]}?language=en-US`;

  return fetchApi(url, context)
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
