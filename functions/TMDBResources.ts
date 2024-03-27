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
  return {items: [], pages: {}}
};

const lookupHandler = (event: ResourcesLookupRequest, context: FunctionEventContext<AppInstallationParameters>): ResourcesLookupResponse => {
  return {items: [], pages: {}}
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
