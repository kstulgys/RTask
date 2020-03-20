import * as React from 'react';
import {Box, Flex, Text, Input} from '@chakra-ui/core';
import {SYMBOLS} from './symbols';
// import {useDispatch} from 'react-redux';
import {Currency} from 'app/types';
import {isInteger} from 'lodash';

interface InputAmountProps {
  [key: string]: any;
  inputValue: number;
  selected: Currency | null;
  autoFocus: boolean;
  handleChange: any;
}

export function InputAmount(props: InputAmountProps): JSX.Element {
  const {handleChange, selected, inputValue, autoFocus, ...rest} = props;

  return (
    <Flex alignItems="baseline" my={[6, 12, 16]} {...rest}>
      <Box display={['none', 'block']} pr="2">
        <Text data-testid="currency-symbol" pr="1" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {selected && SYMBOLS[selected.name].symbol_native}
        </Text>
      </Box>

      <Input
        data-testid={autoFocus ? 'input-from' : 'input-to'}
        autoFocus={autoFocus}
        onChange={handleChange}
        value={!!inputValue ? inputValue : ''}
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
