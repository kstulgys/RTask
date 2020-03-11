import * as React from 'react';
import {IconButton} from '@chakra-ui/core';
import {FiRepeat} from 'react-icons/fi';
import {useCurrencyState} from 'context';

export function IconSwapInputs(): JSX.Element {
  const {swapInputs} = useCurrencyState();
  return (
    <IconButton
      onClick={swapInputs}
      as={FiRepeat}
      aria-label="swap currencies"
      mx={['auto', 'auto', 12]}
      mt={[0, 0, 4]}
      mb={[12, 12, 0]}
      bg="none"
      _hover={{bg: 'none'}}
      cursor="pointer"
      _active={{
        bg: 'none',
      }}
    />
  );
}
