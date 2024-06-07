import resourceProvider from './entities/resource-provider.json';
import movie from './entities/movie.json';
import person from './entities/person.json';
import manifest from '../../contentful-app-manifest.json';
import assert from 'assert';

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
  CONTENTFUL_MANAGEMENT_TOKEN: accessToken
} = process.env;

assert.ok(
  organizationId !== '',
  `CONTENTFUL_ORG_ID environment variable must be defined`
);

console.log({ resourceProvider, movie, person, manifest });
