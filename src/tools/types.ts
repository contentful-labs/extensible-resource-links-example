export type ResourceProvider = {
  sys: { id: string };
  name: string;
  type: string;
  function: { sys: { id: string; type: string; linkType: string } };
};

export type ResourceType = {
  sys: { id: string };
  name: string;
  defaultFieldMapping: {
    title: string;
    subtitle: string;
    externalUrl: string;
    image: {
      url: string;
      altText: string;
    };
  };
};

export type APIResourceProvider = {
  sys: {
    id: string;
    type: 'ResourceProvider';
    createdAt: string;
    updatedAt: string;
    createdBy: {
      sys: { type: string; linkType: string; id: string };
    };
    updatedBy: {
      sys: { type: string; linkType: string; id: string };
    };
    organization: {
      sys: {
        type: string;
        linkType: string;
        id: string;
      };
    };
    appDefinition: {
      sys: {
        type: 'string';
        linkType: string;
        id: string;
      };
    };
  };
  name: string;
  type: 'function';
  function: { sys: { type: string; linkType: string; id: string } };
};

export type APIError = {
  sys: { type: 'Error'; id: string };
  message: string;
  details: {
    errors: { name: string; reason: string }[];
  };
};
