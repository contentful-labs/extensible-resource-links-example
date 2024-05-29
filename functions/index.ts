import {
  FunctionEvent,
  FunctionEventContext,
  FunctionEventHandler,
  FunctionEventType
} from '@contentful/node-apps-toolkit';
import { ResourcesSearchRequest, searchHandler } from './searchHandler';
import { ResourcesLookupRequest, lookupHandler } from './lookupHandler';
import { AppInstallationParameters } from './types';

type Event = FunctionEvent | ResourcesSearchRequest | ResourcesLookupRequest;

export const handler = (
  event: Event,
  context: FunctionEventContext<AppInstallationParameters>
) => {
  switch (event.type) {
    case 'resources.search': {
      return searchHandler(event, context);
    }
    case 'resources.lookup': {
      return lookupHandler(event, context);
    }
    default:
      throw new Error('Bad Request');
  }
};
