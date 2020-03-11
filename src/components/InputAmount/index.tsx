import * as React from 'react';
import {Box, Flex, Text, Input} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {SYMBOLS} from './symbols';
import {Label, FromOrTo} from 'screens/types';

interface InputAmountProps {
  label: FromOrTo;
  [key: string]: any;
}

export function InputAmount({
  // currency,
  // inputValue,
  // setValue,
  // currentRate,
  // fromInputFocused,
  // setInputFocused,
  label,
  ...props
}: InputAmountProps): JSX.Element {
  const {fromCurrency, toCurrency, fromInputValue, toInputValue, changeInputValue} = useCurrencyState();
  console.log({fromInputValue});
  console.log({toInputValue});

  const getCurrencySign = (): string | undefined => {
    if (currency && SYMBOLS[currency.name]) {
      return SYMBOLS[currency.name];
    } else if (currency && !SYMBOLS[currency.name]) {
      return 'K';
    }
    return undefined;
  };
  const inputValue = label === Label.from ? fromInputValue : toInputValue;
  const currency = label === Label.from ? fromCurrency : toCurrency;

  return (
    <Flex alignItems="baseline" my={[8, 12, 16]} {...props}>
      <Box display={['none', 'block']} width="20">
        <Text pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {getCurrencySign()}
        </Text>
      </Box>
      <Input
        value={!!inputValue ? inputValue : ''}
        onChange={(e: React.ChangeEvent<HTMLInputElement>): void =>
          changeInputValue({input: e.target.value, type: label})
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
          color: 'gray.300',
        }}
      />
    </Flex>
  );
}
