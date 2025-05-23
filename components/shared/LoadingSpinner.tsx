import Image from 'next/image';
import loader from '@/assets/loader.gif';
const Loading = () => {
  return (
    <div className="fixed inset-0 flex justify-center items-center bg-white">
      <Image src={loader} width={150} height={150} alt="Loading..." />
    </div>
  );
};
export default Loading;
