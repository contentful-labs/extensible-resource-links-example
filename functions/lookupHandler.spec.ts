import { lookupHandler } from './lookupHandler';
import * as helpers from './helpers';
import {
  context,
  createLookupEvent,
  createTmdbLookupResponse
} from '../test/mocks';

describe('Lookup handler', () => {
  let mockApi: jest.SpyInstance;

  beforeEach(() => {
    mockApi = jest.spyOn(helpers, 'fetchApi');
  });

  it('returns an empty response if TMDB does not return any results', async () => {
    mockApi.mockImplementation(() => Promise.resolve(undefined));

    const response = await lookupHandler(createLookupEvent(), context);
    expect(response).toEqual({ items: [], pages: {} });
  });

  it('returns an empty response if one of TMDB requests fails', async () => {
    mockApi.mockImplementation(() =>
      Promise.resolve(createTmdbLookupResponse())
    );
    mockApi.mockImplementationOnce(() => Promise.resolve(undefined));

    const response = await lookupHandler(createLookupEvent(), context);

    expect(response).toEqual({ items: [], pages: {} });
  });

  it('returns a response with populated items', async () => {
    const event = createLookupEvent();
    mockApi.mockImplementationOnce(() =>
      Promise.resolve(createTmdbLookupResponse(Number(event.lookupBy.urns[0])))
    );
    mockApi.mockImplementationOnce(() =>
      Promise.resolve(createTmdbLookupResponse(Number(event.lookupBy.urns[1])))
    );

    const response = await lookupHandler(event, context);

    expect(response).toHaveProperty('items');
    expect(response.items).toEqual([
      {
        id: '15',
        name: 'John Doe',
        externalUrl: 'https://www.themoviedb.org/person/15',
        image: { url: 'https://image.tmdb.org/t/p/w200/profile15.jpg' }
      },
      {
        id: '22',
        name: 'John Doe',
        externalUrl: 'https://www.themoviedb.org/person/22',
        image: { url: 'https://image.tmdb.org/t/p/w200/profile22.jpg' }
      }
    ]);
  });
});