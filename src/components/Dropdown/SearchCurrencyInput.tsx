import * as React from 'react';
import {Input, InputGroup, InputLeftElement, Icon} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {FromOrTo, Label} from 'screens/types';

export default function SearchCurrencyInput({label}: {label: FromOrTo}): JSX.Element {
  const {filterCurrencies} = useCurrencyState();
  const [searchTerm, setSearchTerm] = React.useState('');

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    filterCurrencies({type: label, searchTerm});
  }, [searchTerm]);

  return (
    <InputGroup my="1">
      {/* eslint-disable-next-line react/no-children-prop */}
      <InputLeftElement children={<Icon mt="2" ml="10" name="search" color="revo.gray" />} />
      <Input
        onChange={handleSearch}
        pl="16"
        height="12"
        borderRadius="none"
        border="none"
        type="search"
        placeholder="Search"
        _placeholder={{
          color: 'revo.gray',
        }}
      />
    </InputGroup>
  );
}
