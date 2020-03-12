import * as React from 'react';
import {Box, Flex, Text, Input} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {SYMBOLS} from './symbols';
import {Label, FromOrTo} from 'screens/types';

interface InputAmountProps {
  label: FromOrTo;
  [key: string]: any;
}

export function InputAmount({label, ...props}: InputAmountProps): JSX.Element {
  const {selectedFrom, selectedTo, inputValueFrom, inputValueTo, changeInputValue} = useCurrencyState();
  const addMinus = (input: number): number => (!!input ? -Math.abs(input) : 0);
  const removeMinus = (input: string): string => Math.abs(+input) + '';
  const inputValue = label === Label.from ? addMinus(inputValueFrom) : inputValueTo;
  const selected = label === Label.from ? selectedFrom : selectedTo;

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    changeInputValue({input: removeMinus(e.target.value), type: label});
  };

  return (
    <Flex alignItems="baseline" my={[8, 12, 16]} {...props}>
      <Box display={['none', 'block']} pr="2">
        <Text pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {selected?.name && SYMBOLS[selected.name].symbol_native}
        </Text>
      </Box>
      <Input
        onChange={handleInputChange}
        value={!!inputValue ? inputValue : ''}
        type="number"
        pl="0"
        px={[0]}
        zIndex={1}
        border="none"
        height="110px"
        fontSize="110px"
        fontWeight="lighter"
        placeholder="0"
        _focus={{
          boxShadow: 'none',
        }}
        _placeholder={{
          color: 'revo.lightGray',
        }}
      />
    </Flex>
  );
}
