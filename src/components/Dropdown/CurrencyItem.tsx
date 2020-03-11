import * as React from 'react';
import {Box, Flex, Button, Text} from '@chakra-ui/core';
import {currencyFlags} from './currencyFlags';
import {Currency} from 'context/types';
import numeral from 'numeral';

interface CurrencyItemProps {
  handleSelect: (item: Currency) => void;
  handleOnKeySelect: (item: Currency) => void;
  item: Currency;
}

export default function CurrencyItem({handleSelect, handleOnKeySelect, item}: CurrencyItemProps): JSX.Element {
  return (
    <Box as="li" my="1">
      <Button
        height="12"
        py="auto"
        px="8"
        width="full"
        borderRadius="none"
        bg="white"
        onClick={(): void => handleSelect(item)}
        onKeyUp={(): void => handleOnKeySelect(item)}
      >
        <Flex width="full" alignItems="center">
          <Flex mr="auto" alignItems="center">
            <Box as="span" fontSize="2xl" mr="2">
              {currencyFlags[item.name]}
            </Box>
            <Box as="span" fontWeight="medium">
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
