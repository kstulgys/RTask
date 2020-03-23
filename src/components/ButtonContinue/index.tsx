/* eslint-disable react/display-name */
import * as React from 'react';
import {Button as BaseButton, Box} from '@chakra-ui/core';
import {useSelector} from 'react-redux';
import {RootState} from 'app/store';
import {submitValues} from 'app/appState';
import {useDispatch} from 'react-redux';

interface ButtonContinueProps {
  text: string;
  [key: string]: any;
}

export function ButtonContinue({text, ...props}: ButtonContinueProps): JSX.Element {
  const {isSubmitting, canSubmit, selectedFrom, selectedTo, inputValueFrom, inputValueTo} = useSelector(
    (state: RootState) => state.app,
  );
  const dispatch = useDispatch();
  const handleSubmit = React.useCallback((): void => {
    if (!selectedFrom || !selectedTo) return;
    const from = {name: selectedFrom.name, value: +inputValueFrom};
    const to = {name: selectedTo.name, value: +inputValueTo};
    dispatch(submitValues({selectedFrom: from, selectedTo: to}));
  }, [inputValueFrom, inputValueTo]);

  return (
    <Box {...props}>
      <BaseButton
        onClick={handleSubmit}
        className="submit-test"
        isLoading={isSubmitting}
        isDisabled={!canSubmit}
        type="submit"
        width="full"
        rounded="full"
        fontSize="sm"
        size="lg"
        bg="revo.red"
        color="white"
        _hover={{bg: 'revo.red'}}
      >
        {text}
      </BaseButton>
    </Box>
  );
}
