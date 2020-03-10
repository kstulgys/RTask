import * as React from 'react';
import {Box, Flex, Text, Input} from '@chakra-ui/core';
import {useCurrencyState} from '../../context';

const SYMBOLS: {[key: string]: string} = {
  EUR: '€',
  GBP: '£',
  USD: '$',
};

interface InputAmountProps {
  label: 'From' | 'To';
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
  const {fromCurrency, toCurrency} = useCurrencyState();

  const getCurrencySign = () => {
    if (currency && SYMBOLS[currency.name]) {
      return SYMBOLS[currency.name];
    } else if (currency && !SYMBOLS[currency.name]) {
      return 'K';
    }
  };

  const currency = label === 'From' ? fromCurrency : toCurrency;

  return (
    <Flex alignItems="baseline" my={[8, 12, 16]} {...props}>
      <Box display={['none', 'block']} width="20">
        <Text pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {getCurrencySign()}
        </Text>
      </Box>
      <Input
        // onFocus={() => setInputFocused(label === "From" ? true : false)}
        // value={!inputValue ? "" : inputValue}
        // onChange={(e: any) => setValue(e.target.value)}
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
