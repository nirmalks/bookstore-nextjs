import { FormControl, FormItem, FormLabel } from '@/components/ui/form';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ShippingAddress } from '@/types';

const AddressList = ({
  addresses,
  selectedAddress,
  onSelect,
}: {
  addresses: ShippingAddress[];
  selectAddress: ShippingAddress;
  onSelect: (address: ShippingAddress) => void;
}) => {
  return (
    <RadioGroup
      defaultValue={selectedAddress?.id}
      onValueChange={(value) => {
        const address = addresses.find((addr) => addr.id === value);
        if (address) onSelect(address);
      }}
      className="space-y-4"
    >
      {addresses.map((address) => (
        <FormItem
          key={address.id}
          className="flex items-center space-x-3 space-y-0"
        >
          <FormControl>
            <RadioGroupItem value={address.id || ''} />
          </FormControl>
          <FormLabel className="font-normal">
            {address.fullName}, {address.streetAddress}, {address.city},{' '}
            {address.state}, {address.country}, {address.pinCode}
          </FormLabel>
        </FormItem>
      ))}
    </RadioGroup>
  );
};

export default AddressList;
