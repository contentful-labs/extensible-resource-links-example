This app demonstrates external resource links using the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

# Prerequisites

We're assuming you are familiar with the following concepts:

- [App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/), including [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/) and [App Installation](https://www.contentful.com/developers/docs/extensibility/app-framework/app-installation/)
- [Functions](https://www.contentful.com/developers/docs/extensibility/app-framework/functions/)

A valid API token for the TMDB API is required to run this app. You can get one by signing up at [TMDB](https://www.themoviedb.org/signup).

# Description

Extensible Resource Links provide a streamlined method to connect and work with third-party systems in Contentful, ensuring standardized operations when configuring content model architecture, as well as creating and retrieving content with entities from these systems.

This means you have a standardized way of connecting third-party content with Contentful content from different spaces.

This project aims to provide an example of the setup for Extensible Resource Links. In this example, we are connecting to the TMDB API to retrieve `Movie` and `Person` entities, which can be rendered in Contentful Web UI.

## Entities

With Extensible Resource Links we introduce two new entity types that allow us to model the data from third-party systems in Contentful. These entities are:

- `Resource Provider` - a third-party system that provides resources. Each provider can have multiple resource types. In this example, we have a `TMDB` provider.
- `Resource Type` - a specific type of resource that is provided by a resource provider. In our example, we introduce `Movie` and `Person` resource types.

## Functions

The Function event handler for Extensible Resource Links can parse two different types of events:

- `search` - retrieval of specific content based on search queries
- `lookup` - retrieval of specific content based on URNs (IDs)

Example code for these handlers can be found in `functions/lookupHandler.ts` and `functions/searchHandler.ts` files.

### Search request

Search handler expects the following shape for outgoing requests:

```typescript
type ResourcesSearchRequest = {
  type: 'resources.search';
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
  L extends Record<string, Scalar[]> = Record<string, Scalar[]>
> = {
  type: 'resources.lookup';
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
| lookupBy.urns    | string[]                      | List of IDs of entities to be fetched                                                                                              |

### Response

Both events return the same shape of the response:

```typescript
type Resource = Record<string, unknown>;

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
| pages            | object (required)     |                                                          |
| pages.nextCursor | string (optional)     | Cursor string to be used to request next page of results |

### Example

Assuming that TMDB API exposes `Person` entities with the following (simplified) shape:

```json
{
  "results": [
    {
      "id": 1245,
      "name": "Scarlett Johansson",
      "profile_path": "/6NsMbJXRlDZuDzatN2akFdGuTvx.jpg"
    }
    {
      "id": 488,
      "name": "Steven Spielberg",
      "profile_path": "/tZxcg19YQ3e8fJ0pOs7hjlnmmr6.jpg"
    },
    {
      "id": 31,
      "name": "Tom Hanks",
      "profile_path": "/mKr8PN8sn80LzVaZMg8L52kmakm.jpg"
    }
  ]
}
```

An example search event request could look like this:

```typescript
const searchRequest: ResourcesSearchRequest = {
  type: 'resources.search',
  resourceType: 'TMDB:Person',
  query: 'Tom'
};
```

And an example lookup event request could look like this:

```typescript
const lookupRequest: ResourcesLookupRequest = {
  type: 'resources.lookup',
  resourceType: 'TMDB:Person',
  lookupBy: {
    urn: ['31', '1245']
  }
};
```

In the examples above, we would expect:

- the search event to return the resource with the URN `31` (Tom Hanks),
- the lookup event to return the resources with the URNs `31` (Tom Hanks) and `1245` (Scarlett Johansson).

# Instructions to create and run the app

## Creating a custom app definition

Before we can upload our code to Contentful, we need to create an _App Definition_ for the app that will be associated with our code. To do this:

1. Run the script `npm run create-app-definition`. You will see a prompt asking for the name of the app. Enter `TMDB App` and press Enter to confirm.
2. Next prompt will ask for the location where the app will be rendered. Select _App configuration screen_ and press Enter to confirm.
3. Next step asks about the endpoint used for the app. As the default value is correct, press Enter to confirm.
4. Next question asks us if we would like to specify App Parameters. Type `Y` and press Enter. Select _Installation_, then type `TMDB access token` as _Parameter name_ and `tmdbAccessToken` as _ID_. Select _Symbol_ as type and mark it as required.
5. Next prompt will ask for the access token. In the background, a new browser tab will open with a Contentful token value (you might need to log in first). Copy the token and paste it into the terminal. Press Enter to confirm.
6. In the next step we need to define which organization the app will be associated with. Select the organization you want to use and press Enter to confirm.

Your custom app is now configured. As a final step, click Save to persist the app configuration.

## Running and installing the app

We can start with running the code locally to see how it works. To do this, execute:

```bash
$ npm install
$ npm run build
$ npm run start
```

Next, install the app. To install the app:

1. Go to your space and click _Apps_ in the top menu bar.
2. Select _Custom Apps_. The list of custom apps available in your space is displayed.
3. Click the _Install_ button next to your app (which we set up earlier in the tutorial).
   NOTE: You have to grant access to your space the app will be installed in.
4. After granting access, the configuration screen, which is rendered by the <ConfigScreen /> component, is displayed. Put in your TMDB token in the form.
5. Click Save.

Your app is now installed and configured.

The form that will save the token when we install the app has been defined in `src/locations/ConfigScreen.tsx`. More information how configuration screens are set up can be found in [this App Configuration tutorial](https://www.contentful.com/developers/docs/extensibility/app-framework/app-configuration/).

## Create resource entities

<!-- TODO: Explain how to run the script to create entities -->
<!-- TODO: Explain how to utilize the code in content modeling -->
<!-- TODO: Fix / remove generic tests -->

## Uploading the bundle

So far the code has been running locally on your machine. Functions can be also deployed to Contentful's infrastructure. To do this, we need to build and upload the bundle to Contentful:

```bash
$ npm run build
$ npm run upload
```

The `upload` command will guide you through the deployment process and ask for all required arguments.

At any moment you can go back to the setup of running the code locally instead of uploading the bundle to Contentful's infrastructure by the following steps:

- Run `npm run open-settings`, which will open the web page with the App details.
- Deselect the _Hosted by Contentful_ option and fill the text field below with `http://localhost:3000`.
- Save the changes.

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

#### `npm run create-app-definition`

<!-- TODO -->

#### `npm run create-resource-entities`

<!-- TODO -->
