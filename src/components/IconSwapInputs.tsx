import * as React from 'react';
import {IconButton, Box} from '@chakra-ui/core';
import {FiRepeat} from 'react-icons/fi';
import {useCurrencyState, useCurrencyDispatch} from 'context';
import {handleCurrenciesSwapp} from 'context/actions';

export function IconSwapInputs(): JSX.Element {
  const state = useCurrencyState();
  const dispatch = useCurrencyDispatch();

  const handleClick = () => {
    handleCurrenciesSwapp(dispatch, state);
  };

  return (
    <Box height="auto" mx={['auto', 'auto', 12]} mt={[0, 0, 6]} mb={[10, 12, 0]}>
      <IconButton
        aria-label="swap currencies"
        onClick={handleClick}
        as={FiRepeat}
        color="revo.blue"
        bg="none"
        _hover={{bg: 'none'}}
        cursor="pointer"
        _active={{
          bg: 'none',
        }}
      />
    </Box>
  );
}
