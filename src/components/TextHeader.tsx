import * as React from 'react';
import {Box, Text} from '@chakra-ui/core';

export function TextHeader({text}: {text: string}): JSX.Element {
  return (
    <Box mx="auto" textAlign="center" my="20">
      <Text as="h1" fontSize="2xl">
        {text}
      </Text>
    </Box>
  );
}
