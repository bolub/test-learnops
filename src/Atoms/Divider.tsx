import { tailwindOverride } from '@getsynapse/design-system';

const Divider = ({ className }: { className?: string }) => {
  return (
    <hr className={tailwindOverride('mt-10 text-neutral-lighter', className)} />
  );
};
export default Divider;
