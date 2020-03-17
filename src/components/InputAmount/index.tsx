import * as React from 'react';
import {Box, Flex, Text, Input} from '@chakra-ui/core';
import {useCurrencyState, useCurrencyDispatch} from 'context';
import {SYMBOLS} from './symbols';
import {Currency, CurrencyDispatch, CurrencyState} from 'context/types';

interface InputAmountProps {
  [key: string]: any;
  inputValue: number;
  selected: Currency | null;
  autoFocus: boolean;
  handleChange: (dispatch: CurrencyDispatch, state: CurrencyState, inputValue: string) => void;
}

export function InputAmount(props: InputAmountProps): JSX.Element {
  const {handleChange, selected, inputValue, autoFocus, ...rest} = props;
  const state = useCurrencyState();
  const dispatch = useCurrencyDispatch();

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const inputValue = e.target.value;
    handleChange(dispatch, state, inputValue);
  };

  return (
    <Flex alignItems="baseline" my={[6, 12, 16]} {...rest}>
      <Box display={['none', 'block']} pr="2">
        <Text data-testid="currency-symbol" pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {selected?.name && SYMBOLS[selected.name].symbol_native}
        </Text>
      </Box>
      <Input
        data-testid={autoFocus ? 'input-from' : 'input-to'}
        autoFocus={autoFocus}
        onChange={handleInputChange}
        value={inputValue ? inputValue : ''}
        type="number"
        pl="0"
        px={[0]}
        zIndex={1}
        border="none"
        height="110px"
        fontSize={[80, 110]}
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
