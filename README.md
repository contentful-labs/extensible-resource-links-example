This app demonstrates external resource links using the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

# Prerequisites

* [Functions](https://www.contentful.com/developers/docs/extensibility/app-framework/functions/)

# Instructions

## Description

Extensible Resource Links provide a streamlined method to connect and work with third-party systems in Contentful, ensuring standardized operations when configuring content model architecture, creating content with entries/assets from these systems, and retrieving content that includes these assets. 

This means that you have a standardized way of connecting 3rd party content with Contentful content from different spaces.

This project aims to give an example of the setup for Extensible Resource Links. In this example we are connecting to TMDB API to retrieve `Movie` and `Person` entities, that can be rendered in Contentful Web UI.

Below we have an overview and steps how to use it.

## 1. Functions

Functions are serverless workloads that run on Contentful’s infrastructure to provide enhanced flexibility and customization. You can use Functions to:

* connect to external systems and enrich the response of requests issued through Contentful's APIs, or
* filter, transform, and handle events coming from Contentful without having to set up your own backend

Extensible Resource Links require you to handle 2 events:
* `search` - retrieval of specific content based on search queries
* `lookup` - retrieval of specific content based on URNs

The starting point is `functions/index.ts` where handlers for these events are used (they are defined in `functions/lookupHandler.ts` and `functions/searchHandler.ts`) and which is an entry point for our backend to use functions from this project (as defined in `contentful-app-manifest.json`).

### Search

Search handler expects specific shapes for incoming requests

```
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

| property | type | description |
| --- | --- | --- |
| limit |	number (required)	| Number defining the maximum of items that should be returned |
| pages |	object (optional)	|
| pages.nextCursor |	string (required) |	Cursor string pointing to the specific page of results to be used as a starting point for the request |
| resourceType |	string (required) |	String consisting of the name of the provider and the resource within the provider, eg. Shopify:Product |
| type	| `resources.search` (required) |	Identifier for the type of the event |
| query |	string (optional)	| Search query to be passed to Contentful Function, which in turn passes it down to the 3rd party system's search API |

### Lookup

Lookup handler expects specific shapes for incoming requests

```
type ResourcesLookupRequest = {
  type: 'resources.lookup';
  lookupBy: L;
  resourceType: string;
  limit?: number;
  pages?: {
    nextCursor: string;
  };
};
```

| property | type | description |
| --- | --- | --- |
| limit |	number (required)	| Number defining the maximum of items that should be returned |
| pages |	object (optional)	|
| pages.nextCursor |	string (required) |	Cursor string pointing to the specific page of results to be used as a starting point for the request |
| resourceType |	string (required) |	String consisting of the name of the provider and the resource within the provider, eg. Shopify:Product |
| type | `resources.lookup` (required) |	Identifier for the type of the event |
| lookupBy |	object (required) |	
| lookupBy.urn |	string[] |	List of IDs of entities to be fetched |


## 2. Config Screen


## 3. Set up Contentful application and upload the bundle


## 4. Resource Providers and Resource Types


## Example configuration

Assuming the provider name is `TMDB` you can set the following to get all currently supported entities: `Movie`, `Series`, and `Person`.

```json
[
    {
        "id": "TMDB:Movie",
        "name": "Movie",
        "providerId": "TMDB",
        "defaultView": {
            "title": "{ /title }",
            "subtitle": "Movie ID: {/id}",
            "image": "{/image}",
            "externalUrl": "{/externalUrl}",
            "description": "{/overview}"
        }
    },
    {
        "id": "TMDB:Series",
        "name": "Series",
        "externalUrl": "{/externalUrl}",
        "providerId": "TMDB",
        "defaultView": {
            "title": "{ /name }",
            "subtitle": "Series ID: {/id}",
            "image": "{/image}",
            "description": "{/overview}"
        }
    },
    {
        "id": "TMDB:Person",
        "name": "Person",
        "externalUrl": "{/externalUrl}",
        "providerId": "TMDB",
        "defaultView": {
            "title": "{ /name }",
            "subtitle": "Person ID: {/id}",
            "image": "{/image}"
        }
    }
]
```

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