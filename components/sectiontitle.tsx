import { SectionTitleProps } from '@/types';

const SectionTitle = ({ text }: SectionTitleProps) => {
  return (
    <div className="border-b border-base-300 pb-5">
      <h2 className="text-3xl font-medium tracking-wider capitalize text-center">
        {text}
      </h2>
    </div>
  );
};
export default SectionTitle;
