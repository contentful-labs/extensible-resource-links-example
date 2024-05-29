import { FunctionEventContext } from '@contentful/node-apps-toolkit';
import { AppInstallationParameters, Scalar } from './types';
import { TmdbSearchResponse } from './searchHandler';
import { TmdbLookupResponse } from './lookupHandler';

export const transformResult = (externalUrlPrefix: string) => (result: any) => {
  const imageUrl = result.poster_path || result.profile_path;

  return {
    ...result,
    id: String(result.id),
    ...(imageUrl && {
      image: {
        url: `https://image.tmdb.org/t/p/w200${result.poster_path || result.profile_path}`
      }
    }),
    externalUrl: `${externalUrlPrefix}${result.id}`
  };
};

export const fetchApi = async (
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
    .then((json: TmdbSearchResponse | TmdbLookupResponse) => {
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
  urn?: Scalar;
};

export const getUrls = (resourceType: string, { query, page, urn }: Params) => {
  const type = resourceType === 'TMDB:Movie' ? 'movie' : 'person';

  return {
    prefixUrl: `https://www.themoviedb.org/${type}/`,
    searchUrl: `https://api.themoviedb.org/3/search/${type}?query=${query}&include_adult=false&language=en-US&page=${page}`,
    lookupUrl: `https://api.themoviedb.org/3/${type}/${urn}?language=en-US`
  };
};
