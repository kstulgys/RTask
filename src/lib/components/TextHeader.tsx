import * as React from 'react';
import {Box, Text} from '@chakra-ui/core';

export function TextHeader({text}: any): JSX.Element {
  return (
    <Box mx="auto" textAlign="center" my="20">
      <Text fontSize="2xl">{text}</Text>
    </Box>
  );
}
