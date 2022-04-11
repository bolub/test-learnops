import { AxiosInstance } from 'axios';
import { PickerFileMetadata } from 'filestack-js';
import get from 'lodash/get';
import config from 'config/Config';
import { initAxios } from 'utils/axios';

class CloudFrontAPI {
  instance: AxiosInstance;

  constructor() {
    this.instance = initAxios(config.get('backendURL'));
  }

  generateCloudFrontSignedURL: (file: PickerFileMetadata) => Promise<string> =
    async (file) => {
      const cloudfrontUrls = config.get('cloudfrontUrls');
      let signedUrl = '';
      if (file.key) {
        const key = file.key;
        const container = file.container || '';
        const selectedCloudfrontUrl =
          cloudfrontUrls[container] || Object.values(cloudfrontUrls)[0];
        const url = `${selectedCloudfrontUrl}/${encodeURIComponent(
          key
        ).replaceAll('%20', '+')}`;
        const response = await this.instance.post(
          'design/cloudfront/permission',
          {
            payload: { url },
          }
        );
        signedUrl = get(response, 'data.payload.signedUrl');
      }
      return signedUrl;
    };
}

export default new CloudFrontAPI();
