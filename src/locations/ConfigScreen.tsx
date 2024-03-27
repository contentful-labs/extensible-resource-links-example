import React, { useCallback, useState, useEffect } from 'react';
import { ConfigAppSDK } from '@contentful/app-sdk';
import { Heading, Form, Flex, TextInput, FormControl } from '@contentful/f36-components';
import { useSDK } from '@contentful/react-apps-toolkit';

interface AppInstallationParameters {
  apiEndpoint?: string;
  storefrontAccessToken?: string;
  secretExternalResourceProvider?: string;
  resourceTypes?: string;
  providerName?: string;
}

const ConfigScreen = () => {
  const [parameters, setParameters] = useState<AppInstallationParameters>({});
  const sdk = useSDK<ConfigAppSDK>();

  const onConfigure = useCallback(async () => {
    const currentState = await sdk.app.getCurrentState();
    return {
      parameters,
      targetState: currentState,
    };
  }, [parameters, sdk]);

  function updateParameters<T extends keyof AppInstallationParameters>(parameterName: T)  {
    return (e: React.ChangeEvent<HTMLInputElement>) => {
      const value = e.target.value;
      setParameters({ ...parameters, [parameterName]: value });
    }
  }

  useEffect(() => {
    sdk.app.onConfigure(onConfigure);
  }, [sdk, onConfigure]);

  useEffect(() => {
    (async () => {
      const currentParameters: AppInstallationParameters | null = await sdk.app.getParameters();

      if (currentParameters) {
        setParameters(currentParameters);
      }

      sdk.app.setReady();
    })();
  }, [sdk]);

  return (
      <Flex flexDirection="column" margin="spacingL">
        <Heading>App Config</Heading>
        <Form>
          <FormControl isRequired isInvalid={!parameters.apiEndpoint}>
            <FormControl.Label>API endpoint</FormControl.Label>
            <TextInput
                value={parameters.apiEndpoint}
                type="url"
                name="apiEndpoint"
                onChange={updateParameters("apiEndpoint")}
            />
            <FormControl.HelpText>
              Provide the url to the API endpoint of the shop
            </FormControl.HelpText>
            {!parameters.apiEndpoint && (
                <FormControl.ValidationMessage>
                  Please, provide API endpoint
                </FormControl.ValidationMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!parameters.storefrontAccessToken}>
            <FormControl.Label>API token</FormControl.Label>
            <TextInput
                value={parameters.storefrontAccessToken}
                name="storefrontAccessToken"
                onChange={updateParameters("storefrontAccessToken")}
            />
            <FormControl.HelpText>
              Provide the access token of the shop
            </FormControl.HelpText>
            {!parameters.storefrontAccessToken && (
                <FormControl.ValidationMessage>
                  Please, provide valid API token
                </FormControl.ValidationMessage>
            )}
          </FormControl>
          <FormControl isRequired isInvalid={!parameters.secretExternalResourceProvider}>
            <FormControl.Label>Secret External Resource Provider</FormControl.Label>
            <TextInput
                value={parameters.secretExternalResourceProvider}
                type="url"
                name="apiEndpoint"
                onChange={updateParameters("secretExternalResourceProvider")}
            />
            <FormControl.HelpText>
              Provide the url to the API endpoint of the shop
            </FormControl.HelpText>
            {!parameters.secretExternalResourceProvider && (
                <FormControl.ValidationMessage>
                  Please, provide API endpoint
                </FormControl.ValidationMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!parameters.resourceTypes}>
            <FormControl.Label>Resource Types</FormControl.Label>
            <TextInput
                value={parameters.resourceTypes}
                type="url"
                name="apiEndpoint"
                onChange={updateParameters("resourceTypes")}
            />
            <FormControl.HelpText>
              Provide the url to the API endpoint of the shop
            </FormControl.HelpText>
            {!parameters.resourceTypes && (
                <FormControl.ValidationMessage>
                  Please, provide API endpoint
                </FormControl.ValidationMessage>
            )}
          </FormControl>

          <FormControl isRequired isInvalid={!parameters.providerName}>
            <FormControl.Label>Provider Name</FormControl.Label>
            <TextInput
                value={parameters.providerName}
                type="url"
                name="apiEndpoint"
                onChange={updateParameters("providerName")}
            />
            <FormControl.HelpText>
              Provide the url to the API endpoint of the shop
            </FormControl.HelpText>
            {!parameters.providerName && (
                <FormControl.ValidationMessage>
                  Please, provide API endpoint
                </FormControl.ValidationMessage>
            )}
          </FormControl>
        </Form>
      </Flex>
  );
};

export default ConfigScreen;
