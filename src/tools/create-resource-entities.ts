import tmdb from './entities/tmdb.json';
import movie from './entities/movie.json';
import person from './entities/person.json';
import manifest from '../../contentful-app-manifest.json';
import assert from 'assert';
import {
  APIError,
  APIResourceProvider,
  ResourceProvider,
  ResourceType
} from './types';

assert.equal(
  typeof manifest,
  'object',
  'Manifest is not an object, please check the content of `contentful-app-manifest.json`'
);
assert.ok(
  Array.isArray(manifest.functions),
  'Functions are not defined as an array in the manifest, please check the content of `contentful-app-manifest.json`'
);

const {
  CONTENTFUL_ORG_ID: organizationId,
  CONTENTFUL_APP_DEF_ID: appDefinitionId,
  CONTENTFUL_ACCESS_TOKEN: accessToken
} = process.env;

assert.ok(
  organizationId !== '',
  `CONTENTFUL_ORG_ID environment variable must be defined`
);

type ResourceProviderResult = APIError | APIResourceProvider;
type ResourceTypeResult = APIError;

const fetchApi = async <T>(
  url: string,
  method: 'PUT' | 'GET',
  body?: string
) => {
  const options = {
    method,
    headers: {
      accept: 'application/json',
      Authorization: `Bearer ${accessToken}`
    },
    body
  };

  return fetch(url, options)
    .then((res: Response): Promise<T> => res.json())
    .catch((err: Error) => {
      console.error('error:' + err);
      throw err;
    });
};

const createResourceProvider = async (
  resourceProvider: ResourceProvider
): Promise<ResourceProviderResult> => {
  const URL = `https://api.contentful.com/organizations/${organizationId}/app_definitions/${appDefinitionId}/resource_provider`;

  const resourceProviderWithFunctionId: ResourceProvider = {
    ...resourceProvider,
    function: {
      ...resourceProvider.function,
      sys: {
        ...resourceProvider.function.sys,
        id: manifest.functions[0].id
      }
    }
  };

  const body = JSON.stringify(resourceProviderWithFunctionId);

  return fetchApi(URL, 'PUT', body);
};

const createResourceType = async (
  resourceType: ResourceType
): Promise<ResourceTypeResult> => {
  const URL = `https://api.contentful.com/organizations/${organizationId}/app_definitions/${appDefinitionId}/resource_provider/resource_types/${resourceType.sys.id}`;

  const body = JSON.stringify({ ...resourceType, sys: undefined });

  return fetchApi(URL, 'PUT', body);
};

const main = async () => {
  const tmdbResult = await createResourceProvider(tmdb);
  const [movieResult, personResult] = await Promise.all([
    createResourceType(movie),
    createResourceType(person)
  ]);

  console.dir(tmdbResult, { depth: 5 });
  console.dir(movieResult, { depth: 5 });
  console.dir(personResult, { depth: 5 });
};

main();
