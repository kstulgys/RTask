/* eslint-disable react/display-name */
import * as React from 'react';
import {Button as BaseButton} from '@chakra-ui/core';
import {useSelector} from 'react-redux';
import {RootState} from 'app/store';

interface ButtonContinueProps {
  text: string;
  handleSubmit: () => void;
  [key: string]: any;
}

export function ButtonContinue({text, handleSubmit, ...props}: ButtonContinueProps): JSX.Element {
  const {isSubmitting, canSubmit} = useSelector((state: RootState) => state.app);

  return (
    <BaseButton
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
    </BaseButton>
  );
}
