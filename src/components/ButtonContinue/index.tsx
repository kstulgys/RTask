import * as React from 'react';
import {Button as BaseButton, Box} from '@chakra-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {submitValues, stateSelector} from 'app/appState';

export function ButtonContinue(props: {[key: string]: any}): JSX.Element {
  const dispatch = useDispatch();
  const {isSubmitting, canSubmit, selectedFrom, selectedTo, inputValueFrom, inputValueTo} = useSelector(stateSelector);

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
        Continue
      </BaseButton>
    </Box>
  );
}
