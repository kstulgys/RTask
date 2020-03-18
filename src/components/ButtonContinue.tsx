import * as React from 'react';
import {Button} from '@chakra-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'app/store';
import {submitValues} from 'app/appState';
interface ButtonContinueProps {
  text: string;
  [key: string]: any;
}

export function ButtonContinue({text, ...props}: ButtonContinueProps): JSX.Element {
  const {selectedFrom, selectedTo, inputValueFrom, inputValueTo, isSubmitting, canSubmit} = useSelector(
    (state: RootState) => state.app,
  );
  const dispatch = useDispatch();

  const handleSubmit = (): void => {
    if (!selectedFrom || !selectedTo) return;
    const from = {name: selectedFrom.name, value: inputValueFrom};
    const to = {name: selectedTo.name, value: inputValueTo};
    dispatch(submitValues({selectedFrom: from, selectedTo: to}));
  };

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
