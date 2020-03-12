import * as React from 'react';
import {Button} from '@chakra-ui/core';
import {useCurrencyState} from 'context';

interface ButtonContinueProps {
  text: string;
  [key: string]: any;
}

export function ButtonContinue({text, ...props}: ButtonContinueProps): JSX.Element {
  const {inputValueFrom, inputValueTo, selectedFrom, currentRate} = useCurrencyState();
  const value = !!inputValueFrom && (selectedFrom.value - inputValueFrom).toFixed(2);
  const isDisabled = !value || !inputValueFrom || value[0] === '-';

  return (
    <Button
      isDisabled={isDisabled}
      type="submit"
      width="full"
      rounded="full"
      fontSize="sm"
      size="lg"
      bg="revo.red"
      color="white"
      _hover={{bg: 'revo.red'}}
      {...props}
    >
      {text}
    </Button>
  );
}
