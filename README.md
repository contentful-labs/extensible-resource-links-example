This app demonstrates external resource links using the [TMDB API](https://developer.themoviedb.org/docs/getting-started).

This project was bootstrapped with [Create Contentful App](https://github.com/contentful/create-contentful-app).

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