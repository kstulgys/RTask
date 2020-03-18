import * as React from 'react';
import {Input, InputGroup, InputLeftElement, Icon} from '@chakra-ui/core';

// text: string = (<HTMLInputElement>var.target).value;

export default function SearchCurrencyInput({handleSearch}: {handleSearch: (searchTerm: string) => void}): JSX.Element {
  const handleInputChange = (e: any): void => {
    // const {target as HTMLTextAreaElement} = e
    handleSearch(e.target.value);
  };

  return (
    <InputGroup my="1">
      {/* eslint-disable-next-line react/no-children-prop */}
      <InputLeftElement children={<Icon mt="2" ml="10" name="search" color="revo.gray" />} />
      <Input
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
