/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import {Box, Flex, Text, Input, NumberInput, NumberInputField, useColorMode, IconButton} from '@chakra-ui/core';
import {SYMBOLS} from './symbols';
import {Currency} from 'app/types';
import {FiPlus, FiMinus} from 'react-icons/fi';

interface InputAmountProps {
  [key: string]: any;
  inputValue: number | string;
  selected: Currency | undefined;
  autoFocus: boolean;
  handleChange: any;
  label: 'From' | 'To';
}

export function InputAmount(props: InputAmountProps): JSX.Element {
  const {handleChange, selected, inputValue, autoFocus, label, ...rest} = props;
  const {colorMode} = useColorMode();

  const sign = label === 'From' ? FiMinus : FiPlus;

  const color = {
    light: 'gray.800',
    dark: 'revo.lightGray',
  };

  const bgInput = {
    light: 'white',
    dark: 'gray.800',
  };

  const colorPl = {
    light: 'revo.lightGray',
    dark: 'gray.600',
  };

  return (
    <Flex alignItems="center" my={[6, 12, 16]} {...rest}>
      <Box display={['none', 'block']}>
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
      {!!inputValue && (
        <Flex flexDirection="column" height="full">
          <IconButton
            my="auto"
            py="0"
            size="lg"
            data-testid="button-swap"
            aria-label="sign"
            as={sign}
            color="revo.blue"
            bg="none"
          />
        </Flex>
      )}
      <NumberInput height={['80px', '110px']}>
        <NumberInputField
          lineHeight="none"
          color={color[colorMode]}
          bg={bgInput[colorMode]}
          data-testid={autoFocus ? 'input-from' : 'input-to'}
          autoFocus={autoFocus}
          onChange={handleChange}
          value={!!inputValue ? inputValue : ''}
          pl="0"
          px="0"
          height="full"
          zIndex={1}
          border="none"
          fontSize={['80px', '110px']}
          fontWeight="lighter"
          placeholder="0"
          _focus={{
            boxShadow: 'none',
          }}
          _placeholder={{
            color: colorPl[colorMode],
          }}
        />
      </NumberInput>
    </Flex>
  );
}
