import * as React from 'react';
import {Input, InputGroup, InputLeftElement, Icon} from '@chakra-ui/core';

interface SearchCurrencyInputProps {
  handleSearch: (searchTerm: string) => void;
  searchTerm: string;
}

export default function SearchCurrencyInput({handleSearch, searchTerm}: SearchCurrencyInputProps): JSX.Element {
  const handleInputChange = (e: any): void => {
    handleSearch(e.target.value);
  };

  return (
    <InputGroup my="1">
      {/* eslint-disable-next-line react/no-children-prop */}
      <InputLeftElement children={<Icon mt="2" ml="10" name="search" color="revo.gray" />} />
      <Input
        value={searchTerm}
        onChange={handleInputChange}
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
