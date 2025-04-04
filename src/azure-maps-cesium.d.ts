import { ImageryProvider as CesiumImageryProvider } from 'cesium';

declare module 'cesium' {
  export class AzureMapsImageryProvider extends CesiumImageryProvider {
    constructor(options: {
      authOptions: {
        authType: 'subscriptionKey' | 'aad';
        subscriptionKey?: string;
        clientId?: string;
        getToken?: (
          resolve: (token: string) => void,
          reject: (error: any) => void,
          map: any
        ) => void;
      };
      tilesetId: string;
      language?: string;
      // Additional options as needed.
    });
  }
}
