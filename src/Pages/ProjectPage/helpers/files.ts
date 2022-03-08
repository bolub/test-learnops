import { FILE_SIZE_UNITS } from 'utils/constants';

export const readableFileSize = (size: number) => {
  let i = 0;
  while (size >= 1024) {
    size /= 1024;
    ++i;
  }
  return size.toFixed(1) + ' ' + FILE_SIZE_UNITS[i];
};

export const getFileTypeFromName = (filename: string) => {
  const splittedFileName = filename.split('.');
  return splittedFileName.length === 2 ? `.${splittedFileName[1]}` : '';
};
