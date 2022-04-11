import config from 'config/Config';

export const getFileStackConfig = () => {
  const baseConfig = config.get('fileStack');
  const { sources, ...otherConfig } = baseConfig;
  return {
    ...otherConfig,
    fromSources: sources,
    storeTo: {
      location: 'S3',
      container: config.get('s3BucketName'),
      region: config.get('authentication.region'),
    },
  };
};
