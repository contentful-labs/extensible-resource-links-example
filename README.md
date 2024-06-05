This app demonstrates external resource links using the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

# Prerequisites

We're assuming you are familiar with the following concepts:

- [App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/), including [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/) and [App Installation](https://www.contentful.com/developers/docs/extensibility/app-framework/app-installation/)
- [Functions](https://www.contentful.com/developers/docs/extensibility/app-framework/functions/)

A valid API token for the TMDB API is required to run this app. You can get one by signing up at [TMDB](https://www.themoviedb.org/signup).

# Description

Extensible Resource Links provide a streamlined method to connect and work with third-party systems in Contentful, ensuring standardized operations when configuring content model architecture, creating content with entries/assets from these systems, and retrieving content that includes these assets.

This means you have a standardized way of connecting third-party content with Contentful content from different spaces.

This project aims to provide an example of the setup for Extensible Resource Links. In this example, we are connecting to the TMDB API to retrieve `Movie` and `Person` entities, which can be rendered in Contentful Web UI.

## Entities

Extensible Resource Links introduce concepts of two resource entities that allow us to model the data from third-party systems in Contentful. These entities are:

- `Resource Providers` - a third-party system that provides resources. Each provider can have multiple resource types.
- `Resource Types` - a specific type of resource that is provided by a resource provider.

In this example, we have a `TMDB` provider that provides `Movie` and `Person` resource types.

## Functions

Functions are serverless workloads that run on Contentful’s infrastructure to provide enhanced flexibility and customization. You can use Functions to:

- connect to external systems and enrich the response of requests issued through Contentful's APIs, or
- filter, transform, and handle events coming from Contentful without having to set up your own backend

The Function event handler for Extensible Resource Links can parse two different types of events:

- `search` - retrieval of specific content based on search queries
- `lookup` - retrieval of specific content based on URNs (IDs)

Example code for these handlers can be found in `functions/lookupHandler.ts` and `functions/searchHandler.ts` files.

### Search request

Search handler expects the following shape for outgoing requests:

```typescript
type ResourcesSearchRequest = {
  type: "resources.search";
  resourceType: string;
  query: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};
```

| property         | type                          | description                                                                                                                        |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| limit            | number (required)             | Number defining the maximum of items that should be returned                                                                       |
| pages            | object (optional)             |
| pages.nextCursor | string (required)             | Cursor string pointing to the specific page of results to be used as a starting point for the request                              |
| resourceType     | string (required)             | String consisting of the name of the provider and the resource within the provider, in a format `{Provider}:{Type}, eg. TMDB:Movie |
| type             | `resources.search` (required) | Identifier for the type of the event                                                                                               |
| query            | string (optional)             | Search query to be passed to Contentful Function, which in turn passes it down to the 3rd party system's search API                |

### Lookup request

Lookup handler expects the following shape for outgoing requests:

```typescript
type Scalar = string | number | boolean;

type ResourcesLookupRequest<
  L extends Record<string, Scalar[]> = Record<string, Scalar[]>,
> = {
  type: "resources.lookup";
  lookupBy: L;
  resourceType: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};
```

| property         | type                          | description                                                                                                                        |
| ---------------- | ----------------------------- | ---------------------------------------------------------------------------------------------------------------------------------- |
| limit            | number (required)             | Number defining the maximum of items that should be returned                                                                       |
| pages            | object (optional)             |
| pages.nextCursor | string (required)             | Cursor string pointing to the specific page of results to be used as a starting point for the request                              |
| resourceType     | string (required)             | String consisting of the name of the provider and the resource within the provider, in a format `{Provider}:{Type}, eg. TMDB:Movie |
| type             | `resources.lookup` (required) | Identifier for the type of the event                                                                                               |
| lookupBy         | object (required)             |
| lookupBy.urn     | string[]                      | List of IDs of entities to be fetched                                                                                              |

### Response

Both events return the same shape of the response:

```typescript
type Resource = {
  urn: string;
} & Record<string, unknown>;

type ResourcesSearchResponse = {
  items: Resource[];
  pages: {
    nextCursor?: string;
  };
};

type ResourcesLookupResponse = {
  items: Resource[];
  pages: {
    nextCursor?: string;
  };
};
```

| property         | type                  | description                                              |
| ---------------- | --------------------- | -------------------------------------------------------- |
| items            | Resource[] (required) | List of returned resources                               |
| items[].urn      | string (required)     | Unique identifier for each of the returned resources     |
| pages            | object (required)     |                                                          |
| pages.nextCursor | string (optional)     | Cursor string to be used to request next page of results |

### Example

Assuming that TMDB API exposes `Person` entities with the following (simplified) shape:

```json
{
  "results": [
    {
      "id": 1245,
      "gender": 1,
      "name": "Scarlett Johansson",
      "known_for_department": "Acting"
    }
    {
      "id": 488,
      "gender": 2,
      "name": "Steven Spielberg",
      "known_for_department": "Directing"
    },
    {
      "id": 31,
      "gender": 2,
      "name": "Tom Hanks",
      "known_for_department": "Acting"
    }
  ]
}
```

An example search event request could look like this:

```typescript
const searchRequest: ResourcesSearchRequest = {
  type: "resources.search",
  resourceType: "TMDB:Person",
  query: "Tom",
};
```

And an example lookup event request could look like this:

```typescript
const lookupRequest: ResourcesLookupRequest = {
  type: "resources.lookup",
  resourceType: "TMDB:Person",
  lookupBy: {
    urn: ["31", "1245"],
  },
};
```

In the examples above, we would expect:

- the search event to return the resource with the URN `31` (Tom Hanks),
- the lookup event to return the resources with the URNs `31` (Tom Hanks) and `1245` (Scarlett Johansson).

# Instructions

## Creating a custom app definition

<!-- TODO: REPLACE WITH CLI -->
<!-- `npm run create-app-definition` -->

Functions are part of Contentful's Apps. We first need to set up a custom app. To do this:

1. Log in to the Contentful web app.
2. In the top-left corner, click the organization name and select Organization settings & subscriptions.
3. Go to the "Apps" tab and select Create app.
4. Select "Create app".
5. Configure the app settings as follows:

- Change the app name to "TMDB App".
- Select the App configuration screen option as we need this screen to provide the TMDB API token.

App definition stores the shape of the app configuration. The specific values of the config are defined during the app installation process.

In our example, first we need to provide the configuration shape that contains the TMDB API token. To do this:

1. Click _Add instance parameter definition_.
2. Set the Display name field to _TMDB Access Token_ (the ID is automatically generated).
3. Select the Required parameter check box.
4. Set the Type field to Short text.
5. Click Save to store the parameter.

Your custom app is now configured. As a final step, click Save to persist the app configuration.

## Uploading the bundle

here we define the steps with CLI

## Installing and configuring the app

After we have defined the app configuration in one of the previous steps, we can install the app in our desired environment. To do so:

1. Go to your space and click Apps in the top menu bar.
2. Select Custom Apps. The list of custom apps available in your space is displayed.
3. Click the three dotted icon next to your app (which we set up earlier in the tutorial), and select Install.

- NOTE: You have to grant access to your space the app will be installed in.

4. After granting access, the configuration screen, which is rendered by the `<ConfigScreen />` component, is displayed. Put in your TMDB token in the form.
5. Click Save.

Your app is now installed and configured.

The form that will save the token when we install the app has been defined in `src/locations/ConfigScreen.tsx`. More information how configuration screens are set up can be foune in [this App Configuration tutorial](https://www.contentful.com/developers/docs/extensibility/app-framework/app-configuration/).

<!-- TODOS -->
<!-- 1. Remove all UI config in favor of environment variables and CLI -->
<!-- 2. Add an explanation of the JSON files and maybe? what create-resource-entities script does (will do - to be done in a follow up) -->
<!-- 3. Improve the `resourceCardView` mapping with some better properties -->

## Available Scripts

In the project directory, you can run:

#### `npm start`

Creates or updates your app definition in Contentful, and runs the app in development mode.
Open your app to view it in the browser.

The page will reload if you make edits.
You will also see any lint errors in the console.

#### `npm run build`

Builds the app for production to the `build` folder.
It correctly bundles React in production mode and optimizes the build for the best performance.

The build is minified and the filenames include the hashes.
Your app is ready to be deployed!

#### `npm run upload`

Uploads the build folder to contentful and creates a bundle that is automatically activated.
The command guides you through the deployment process and asks for all required arguments.
Read [here](https://www.contentful.com/developers/docs/extensibility/app-framework/create-contentful-app/#deploy-with-contentful) for more information about the deployment process.

#### `npm run upload-ci`

Similar to `npm run upload` it will upload your app to contentful and activate it. The only difference is  
that with this command all required arguments are read from the environment variables, for example when you add
the upload command to your CI pipeline.

For this command to work, the following environment variables must be set:

- `CONTENTFUL_ORG_ID` - The ID of your organization
- `CONTENTFUL_APP_DEF_ID` - The ID of the app to which to add the bundle
- `CONTENTFUL_ACCESS_TOKEN` - A personal [access token](https://www.contentful.com/developers/docs/references/content-management-api/#/reference/personal-access-tokens)
