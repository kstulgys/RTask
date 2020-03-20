import * as React from 'react';
import {Button} from '@chakra-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'app/store';
import {submitValues} from 'app/appState';

interface ButtonContinueProps {
  text: string;
  handleSubmit: () => void;
  [key: string]: any;
}

export function ButtonContinue({text, handleSubmit, ...props}: ButtonContinueProps): JSX.Element {
  const {isSubmitting, canSubmit} = useSelector((state: RootState) => state.app);

  return (
    <Button
      className="submit-test"
      isLoading={isSubmitting}
      isDisabled={!canSubmit}
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
