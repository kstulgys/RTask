import * as React from 'react';
import {Button} from '@chakra-ui/core';

export function ButtonContinue({text, ...props}: any) {
  return (
    <Button
      isDisabled
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
