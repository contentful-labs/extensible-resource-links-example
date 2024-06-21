This app demonstrates external resource links using the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

# Table of Contents

1. [Prerequisites](#prerequisites)
2. [Description](#description)
3. [Instructions to create and run the app](#instructions-to-create-and-run-the-app)

- [Creating a custom app definition](#creating-a-custom-app-definition)
- [Building and uploading the app](#building-and-uploading-the-app)
  - [Running the app locally](#running-the-app-locally)
- [Creating resource entities](#creating-resource-entities)
- [Installing the app](#installing-the-app)

4. [Code structure](#code-structure)

- [Functions](#functions)
  - [Search request](#search-request)
  - [Lookup request](#lookup-request)
  - [Response](#response)
  - [Example](#example)
- [Property mapping for rendering in the Web app](#property-mapping-for-rendering-in-the-web-app)

5. [Available Scripts](#available-scripts)

# Prerequisites

We're assuming you are familiar with the following concepts:

- [App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/), including [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/) and [App Installation](https://www.contentful.com/developers/docs/extensibility/app-framework/app-installation/)
- [Functions](https://www.contentful.com/developers/docs/extensibility/app-framework/functions/)
- A valid API token for the TMDB API is required to run this app. You can get one by signing up at [TMDB](https://www.themoviedb.org/signup).
- Your system has installed:
  - [Git](https://git-scm.com/book/en/v2/Getting-Started-Installing-Git)
  - The latest LTS version of [Node.js](https://nodejs.org/en/)

# Description

Contentful provides a method for integrating content from external sources using the [App Framework](https://www.contentful.com/developers/docs/extensibility/app-framework/). The [App Marketplace](https://www.contentful.com/marketplace/) currently offers complete solutions tailored for specific systems such as Shopify or Commercetools. Nevertheless, connecting to other systems necessitates the development of custom frontend apps with bespoke implementation.

To overcome these challenges, we are enhancing the process by offering a more streamlined and cohesive approach to linking third-party systems through existing content model Reference Fields. This upgraded version of fields is referred to as _Extensible Resource Links_.

This example is designed to help you build an app with the beta version of the extended linking feature. Currently, the application setup primarily revolves around command line operations; however, you will also have the ability to view the connected content displayed in the user interface. The external system we will be connecting to in this example is [the Movie Database](https://www.themoviedb.org/).

With Extensible Resource Links we introduce the following new entity types that allow us to model the data from third-party systems in Contentful:

- `Resource Provider` - a third-party system that provides resources. Each provider can have multiple resource types. In our example: a `TMDB` provider.
- `Resource Type` - a specific type of resource (not the resource itself) that is provided by a resource provider. In our example: `Movie` and `Person`.
- `Resource` - a representation of real data in an external system. For instance, `Jaws`.

# Instructions to create and run the app

## Creating a custom app definition

Before we can upload our code to Contentful, we need to create an _App Definition_ for the app that will be associated with our code. To do this, run the script `npm run create-app-definition`. You will need to answer the following questions on the terminal. Feel free to proceed with the default options provided.

1. **Name of your application**. This is how your app will be named and it will show up in a few places throughout the UI. The default is the name of the folder you created.
2. **Select where your app can be rendered**. This shows potential [app locations](https://www.contentful.com/developers/docs/extensibility/app-framework/locations/) where an app can be rendered within the Contentful Web app. Select App configuration screen, as we will utilize the configuration screen to provide the\*\* API token for the app.
3. **Contentful CMA endpoint URL**. This refers to the url being used to interact with Contentful's Management APIs.
4. **App Parameters**. These are configurable values that can be used to set default values or define custom validation rules. As we need to define these for the API token:

- Opt for Y to advance with the process of defining the parameters.
- Choose Installation.
- Input TMDB access token as Parameter name and tmdbAccessToken as ID.
- Select Symbol as type and mark the parameter as required.

5. Next steps will lead you through the process of providing a Contentful access token to the application and specifying the organization to which the application should be assigned. **Please ensure that the organization ID you select here is the same as the ID of the organization that has the Extensible Resource Links feature turned on**.

You now have a basic application that is prepared to be enriched with additional information in order to enable the example project you downloaded to function properly.

## Building and uploading the app

After creating the app definition, we can take care of uploading the code by running these commands:

```bash
npm install
npm run build
npm run upload
```

The interactive CLI will prompt you to provide few additional details, such as a CMA endpoint URL. Select _Yes_ when prompted if you’d like to activate the bundle after upload.

### Running the app locally

The steps above will upload the app to Contentful's infrastructure. However, you can also run the app locally to be able to easier debug the code. To do this:

- Run `npm run open-settings`, which will open the web page with the App details.
- Deselect the _Hosted by Contentful_ option and fill the text field below with `http://localhost:3000`.
- Save the changes.

This process is reversible and at any point you can go back to the setup that uses the bundle uploaded to Contentful's infrastructure.

## Creating resource entities

Executing the provided command in your terminal will generate three extra entities within the app definition, which are described in more details in [[#]]

```bash
npm run create-resource-entities
```

This will tell Contentful that we want to connect to TMDB via our function and that the same function can provide `TMDB:Movie` and `TMDB:Person` resource types.

> create-resource-entities script generates new entities within the system, and prints out a minimal log when the operation has succeeded.
>
> If you would like to list all the previously created entities, you can utilize a similar script that prints out more verbose details: `npm run show-resource-entities`.

## Installing the app

- After you successfully upload your app, install it to an existing space by running the command: `npm run install-app`.
- Select the space and environment in which you would prefer to install the example app from the dialog that appears. You will have to grant access to the space the app will be installed in.
- After granting access, the configuration screen, which is rendered by the <ConfigScreen /> component, is displayed. Put in your TMDB token in the form.
- Click Save.

Your app is now installed and configured.

The form that will save the token when we install the app has been defined in `src/locations/ConfigScreen.tsx`. More information how configuration screens are set up can be found in [this App Configuration tutorial](https://www.contentful.com/developers/docs/extensibility/app-framework/app-configuration/).

# Code structure

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

Functions are designed without prior knowledge of the response data structure from third-party systems. Therefore, an additional transformation is required to ensure that all Function events return responses with a consistent shape of `Resource`s. This transformation is carried out by the `transformResult` function located in the `function/helpers.ts` file. In our example, we are expecting `Resource` to conform to a particular shape:

```typescript
type Resource = {
  id: string;
  name: string;
  image?: {
    url: string;
  };
  externalUrl: string;
};
```

Both events return the same shape of the response:

```typescript
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

## Property mapping for rendering in the Web app

Contentful web app displays entries using components that require specific data structures to fill their UI elements.

The mapping between these components and external system data is established using [JSON pointers](https://datatracker.ietf.org/doc/html/rfc6901). This mapping is defined in the `defaultFieldMapping` property of each `Resource Type` and must adhere to the structure used for mapping the values shown in the entry component:

| property      | type              |
| ------------- | ----------------- |
| title         | string (required) |
| subtitle      | string (optional) |
| description   | string (optional) |
| externalUrl   | string (optional) |
| image         | object (optional) |
| image.url     | string (required) |
| image.altText | string (optional) |
| badge         | object (optional) |
| badge.label   | string (required) |
| badge.variant | string (required) |

Definitions of `Movie` and `Person` _Resource Type_ representations can be found in `src/tools/entities/movie.json` and `src/tools/entities/person.json` files respectively.

# Available Scripts

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

#### `npm run open-settings`

Opens the settings in the Contentful web app so that you can use the UI to change the settings of an [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/).

#### `npm run install-app`

Opens a dialog to select the space and environment where the app associated with the given [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/) should be installed.

#### `npm run create-app-definition`

An interactive CLI that will prompt you to provide necessary details to create an [App Definition](https://www.contentful.com/developers/docs/extensibility/app-framework/app-definition/).

#### `npm run create-resource-entities`

A script that reads the `entities` folder and creates new entities within the system. It will print out a minimal log when the operation has succeeded.

#### `npm run show-resource-entities`

A script that lists all the previously created entities. It will print out more verbose details about the entities.
