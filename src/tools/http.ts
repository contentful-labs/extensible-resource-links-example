import { createClient } from 'contentful-management';
import type {
  APIError,
  APIResourceProvider,
  APIResourceType,
  ResourceProvider,
  ResourceType
} from './types';
import {
  accessToken,
  appDefinitionId,
  manifest,
  organizationId
} from './imports';

type ResourceProviderResult = APIError | APIResourceProvider;
type ResourceTypeResult = APIError | APIResourceType;

const client = createClient({ accessToken }, { type: 'plain' });

const createResource = async <T>({
  resource,
  url
}: {
  resource: string;
  url: string;
}) => {
  return client.raw.put<T>(url, resource).catch((err: Error) => {
    console.error('error:' + err);
    throw err;
  });
};

export const createResourceProvider = async (
  resourceProvider: ResourceProvider
) => {
  const url = `https://api.contentful.com/organizations/${organizationId}/app_definitions/${appDefinitionId}/resource_provider`;

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

  return createResource<ResourceProviderResult>({
    resource: body,
    url
  });
};

export const createResourceType = async (resourceType: ResourceType) => {
  const url = `https://api.contentful.com/organizations/${organizationId}/app_definitions/${appDefinitionId}/resource_provider/resource_types/${resourceType.sys.id}`;

  const body = JSON.stringify({ ...resourceType, sys: undefined });

  return createResource<ResourceTypeResult>({
    resource: body,
    url
  });
};
