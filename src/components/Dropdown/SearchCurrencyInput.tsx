import * as React from 'react';
import {Input, InputGroup, InputLeftElement, Icon} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {FromOrTo} from 'screens/types';

export default function SearchCurrencyInput({label}: {label: FromOrTo}): JSX.Element {
  const {currencies, filterFromCurrencies, filterToCurrencies} = useCurrencyState();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filterCurrencies = (): void => {
    if (label === 'From') {
      filterFromCurrencies(searchTerm, currencies);
    }
    if (label === 'To') {
      filterToCurrencies(searchTerm, currencies);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    filterCurrencies();
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
