import { FunctionEventContext } from '@contentful/node-apps-toolkit';
import { AppInstallationParameters, Scalar } from './types/common';
import {
  TmdbItem,
  TmdbLookupResponse,
  TmdbSearchResponse,
  Resource
} from './types/tmdb';

export const transformResult =
  (externalUrlPrefix: string) =>
  (result: TmdbItem): Resource => {
    const imageUrl =
      'poster_path' in result ? result.poster_path : result.profile_path;
    const name = 'title' in result ? result.title : result.name;

    return {
      ...result,
      name,
      id: String(result.id),
      ...(imageUrl && {
        image: {
          url: `https://image.tmdb.org/t/p/w200${imageUrl}`
        }
      }),
      externalUrl: `${externalUrlPrefix}${result.id}`
    };
  };

export const fetchApi = async <
  T extends TmdbSearchResponse | TmdbLookupResponse
>(
  url: string,
  context: FunctionEventContext<AppInstallationParameters>
) => {
  const options = {
    method: 'GET',
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${context.appInstallationParameters.tmdbAccessToken}`
    }
  };

  const tmdbResponse = await fetch(url, options)
    .then((res: Response) => res.json())
    .then((json: T) => {
      console.log('Returned Object from TMDB API:', json);
      return json;
    })
    .catch((err: Error) => {
      console.error('error:' + err);
      throw err;
    });

  return tmdbResponse;
};

type Params = {
  query?: string;
  page?: string;
  urns?: Scalar[];
};

export const getUrls = (
  resourceType: string,
  { query = '', page = '', urns = [] }: Params
) => {
  const type = resourceType === 'TMDB:Movie' ? 'movie' : 'person';

  return {
    prefixUrl: `https://www.themoviedb.org/${type}/`,
    searchUrl: `https://api.themoviedb.org/3/search/${type}?query=${query}&include_adult=false&language=en-US&page=${page}`,
    lookupUrls: urns.map(
      (urn) => `https://api.themoviedb.org/3/${type}/${urn}?language=en-US`
    )
  };
};