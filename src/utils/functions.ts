import { Option } from './customTypes';

export const getInitialValueForDropDown = (
  options: Option[],
  values: string[] | string | undefined
) => {
  if (!values) {
    return [];
  }
  return options.filter(
    (option) => values === option.value || values.includes(option.value)
  );
};
