import * as React from 'react';
import {Box, Flex, Button, Text, useColorMode} from '@chakra-ui/core';
import {currencyFlags} from './currencyFlags';
import {Currency} from 'app/types';
import numeral from 'numeral';

interface CurrencyItemProps {
  handleSelect: (item: Currency) => void;
  handleOnKeySelect: (item: Currency) => void;
  item: Currency;
}

export default function CurrencyItem({handleSelect, handleOnKeySelect, item}: CurrencyItemProps): JSX.Element {
  const {colorMode} = useColorMode();

  const color = {
    light: 'gray.800',
    dark: 'revo.lightGray',
  };

  const bg = {
    light: 'white',
    dark: 'gray.800',
  };
  return (
    <Box as="li" my="1">
      <Button
        data-testid={`item-${item.name}`}
        height="12"
        py="auto"
        px="8"
        width="full"
        borderRadius="none"
        bg={bg[colorMode]}
        onClick={(): void => handleSelect(item)}
        onKeyUp={(): void => handleOnKeySelect(item)}
      >
        <Flex width="full" alignItems="center">
          <Flex mr="auto" alignItems="center">
            <Box as="span" fontSize="2xl" mr="2">
              {currencyFlags[item.name]}
            </Box>
            <Box color={color[colorMode]} as="span" fontWeight="medium">
              {item.name}
            </Box>
          </Flex>
          <Flex ml="auto">
            <Text color="revo.gray" fontWeight="medium">
              {!!item.value && numeral(item.value).format('00,000.00')}
            </Text>
          </Flex>
        </Flex>
      </Button>
    </Box>
  );
}
