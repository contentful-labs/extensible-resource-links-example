import {FunctionEventHandler, FunctionEventType} from '@contentful/node-apps-toolkit';
import {FunctionEventContext} from "@contentful/node-apps-toolkit/lib/requests/typings/function";
import {
  ResourcesLookupRequest,
  ResourcesLookupResponse,
  ResourcesSearchRequest,
  ResourcesSearchResponse
} from "./types";


type AppInstallationParameters = {
  accessToken: string
}
const searchHandler = (event: ResourcesSearchRequest, context: FunctionEventContext<AppInstallationParameters>): ResourcesSearchResponse => {
  return {items: [{id: 'efcwret', title: 'Dune', overview: 'A great movie'}], pages: {}}
};

const lookupHandler = (event: ResourcesLookupRequest, context: FunctionEventContext<AppInstallationParameters>): ResourcesLookupResponse => {
  let items
  // const options = {
  //   method: 'GET',
  //   headers: {
  //     Authorization: 'Bearer ',
  //     accept: 'application/json'
  //   }
  // };
  //
  // fetch('https://api.themoviedb.org/3/movie/popular?include_adult=false&include_video=false&language=en-US&page=1&sort_by=popularity.desc', options)
  //     .then(response => response.json())
  //     .then(response => console.log(response))
  //     .catch(err => console.error(err));
  return {items: [{title: 'Dune'}], pages: {}}
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
