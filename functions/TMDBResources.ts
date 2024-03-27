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
const searchHandler = async (event: ResourcesSearchRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesSearchResponse> => {
  const url = 'https://api.themoviedb.org/3/movie/popular?language=en-US&page=1';
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

  return { items: result.results?.map(({id, ...rest}: any) => ({id: String(id), ...rest})) ?? [], pages: {}}
};

const lookupHandler = async (event: ResourcesLookupRequest, context: FunctionEventContext<AppInstallationParameters>): Promise<ResourcesLookupResponse> => {
  const url = `https://api.themoviedb.org/3/movie/${event.lookupBy.urns[0]}?language=en-US`;
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

  return { items: result ? [{...result, id: String(result.id)}] : [], pages: {}}
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
