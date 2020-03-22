import * as React from 'react';
import {Box, Text, useColorMode} from '@chakra-ui/core';

function Header({text}: {text: string}): JSX.Element {
  // const ref = React.useRef(0);
  // console.log('TextHeader rendered times', ref.current++);
  const {colorMode} = useColorMode();
  const color = {
    light: 'revo.gray',
    dark: 'revo.lightGray',
  };
  return (
    <Box mx="auto" textAlign="center" my={[10, 20]}>
      <Text as="h1" fontSize="2xl" color={color[colorMode]}>
        {text}
      </Text>
    </Box>
  );
}

export const TextHeader = React.memo(Header);
