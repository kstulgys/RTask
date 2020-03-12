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
  const withMinus = (input: number): string | number | undefined => {
    let stringify = String(input);
    if (!!Number(input) && stringify[0] !== '-') {
      const withMinus = stringify.split('');
      withMinus.unshift('-');
      stringify = withMinus.join('');
      return stringify;
    }
    return input;
  };
  const inputValue = label === Label.from ? withMinus(inputValueFrom) : inputValueTo;
  const currency = label === Label.from ? selectedFrom : selectedTo;

  const withoutMinus = (inputValue: string) => {
    if (inputValue[0] === '-') {
      inputValue = inputValue.substr(1);
    }
    return inputValue;
  };

  return (
    <Flex alignItems="baseline" my={[8, 12, 16]} {...props}>
      <Box display={['none', 'block']} pr="2">
        <Text pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {currency?.name && SYMBOLS[currency.name].symbol_native}
        </Text>
      </Box>
      {/* <input
        type="number"
        // onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
        //   changeInputValue({input: withoutMinus(e.target.value), type: label})
        // }
        // value={!!inputValue || inputValue.length > 1 ? inputValue : ''}
        placeholder="0"
      /> */}
      <Input type="number" onChange={(e: any) => console.log(e.target.value)} />
      {/* <Input
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          changeInputValue({input: withoutMinus(e.target.value), type: label})
        }
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
      /> */}
    </Flex>
  );
}
