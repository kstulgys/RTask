import * as React from 'react';
import {
  Box,
  Flex,
  Text,
  Input,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useColorMode,
  PseudoBox,
} from '@chakra-ui/core';
import {SYMBOLS} from './symbols';
// import {useDispatch} from 'react-redux';
import {Currency} from 'app/types';

interface InputAmountProps {
  [key: string]: any;
  inputValue: number | string;
  selected: Currency | undefined;
  autoFocus: boolean;
  handleChange: any;
}

export function InputAmount(props: InputAmountProps): JSX.Element {
  const {handleChange, selected, inputValue, autoFocus, ...rest} = props;
  const {colorMode} = useColorMode();
  const color = {
    light: 'gray.800',
    dark: 'revo.lightGray',
  };

  const bgInput = {
    light: 'white',
    dark: 'gray.800',
  };

  // const handleFocus = () => {};

  return (
    <Flex alignItems="center" my={[6, 12, 16]} {...rest}>
      <Box display={['none', 'block']} pr="2">
        <Text
          color={color[colorMode]}
          data-testid="currency-symbol"
          pr="1"
          lineHeight="none"
          fontSize="110px"
          fontWeight="lighter"
        >
          {selected && SYMBOLS[selected.name].symbol_native}
        </Text>
      </Box>
      <NumberInput>
        <NumberInputField
          // type="number"
          color={color[colorMode]}
          bg={bgInput[colorMode]}
          data-testid={autoFocus ? 'input-from' : 'input-to'}
          autoFocus={autoFocus}
          onChange={handleChange}
          value={!!inputValue ? +inputValue : ''}
          pl="0"
          px="0"
          py={[10, 12]}
          zIndex={1}
          border="none"
          // height="110px"
          fontSize={[80, 110]}
          fontWeight="lighter"
          placeholder="0"
          _focus={{
            boxShadow: 'none',
          }}
          _placeholder={{
            color: colorMode === 'light' ? 'revo.lightGray' : 'gray.600',
          }}
        />
      </NumberInput>
    </Flex>
  );
}
