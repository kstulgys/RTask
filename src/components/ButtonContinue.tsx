import * as React from 'react';
import {Button} from '@chakra-ui/core';
import {useCurrencyState, useCurrencyDispatch} from 'context';
import {handleValuesSubmit} from 'context/actions';

interface ButtonContinueProps {
  text: string;
  [key: string]: any;
}

export function ButtonContinue({text, ...props}: ButtonContinueProps): JSX.Element {
  const state = useCurrencyState();
  const dispatch = useCurrencyDispatch();

  const handleSubmit = () => {
    handleValuesSubmit(dispatch, state);
  };

  return (
    <Button
      isLoading={state.isSubmitting}
      isDisabled={!state.canSubmit}
      onClick={handleSubmit}
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
