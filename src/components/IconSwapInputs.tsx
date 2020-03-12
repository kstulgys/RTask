import * as React from 'react';
import {IconButton} from '@chakra-ui/core';
import {FiRepeat} from 'react-icons/fi';
import {useCurrencyState} from 'context';

export function IconSwapInputs(): JSX.Element {
  const {swapInputs} = useCurrencyState();
  return (
    <IconButton
      aria-label="swap currencies"
      onClick={swapInputs}
      as={FiRepeat}
      color="revo.blue"
      mx={['auto', 'auto', 12]}
      mt={[0, 0, 6]}
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
