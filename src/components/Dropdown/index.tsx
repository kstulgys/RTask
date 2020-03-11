import * as React from 'react';
import {Box, Flex, Button, Text} from '@chakra-ui/core';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {useOnClickOutside} from 'lib/hooks';
import numeral from 'numeral';
import {useCurrencyState} from 'context';
import {Currency} from 'context/types';
import {FromOrTo, Label} from 'screens/types';
import BorderAnimated from './BorderAnimated';
import SearchCurrencyInput from './SearchCurrencyInput';
import CurrencyItem from './CurrencyItem';

interface DropdownProps {
  label: FromOrTo;
  [key: string]: any;
}

export function Dropdown({label, ...props}: DropdownProps): JSX.Element {
  const {
    fromCurrency,
    toCurrency,
    currenciesFromFiltered,
    currenciesToFiltered,
    selectFromCurrency,
    selectToCurrency,
  } = useCurrencyState();

  const ref = React.useRef();
  const [open, setOpen] = React.useState<boolean>(false);
  const toggleOpen = (): void => setOpen(!open);
  useOnClickOutside(ref, () => setOpen(false));

  const currencies = label === Label.from ? currenciesFromFiltered : currenciesToFiltered;

  const handleOnKeySelect = (item: Currency): void => {
    if (label === Label.from) {
      selectFromCurrency(item);
    }
    if (label === Label.to) {
      selectToCurrency(item);
    }
  };

  const handleSelect = (item: Currency): void => {
    setOpen(false);
    handleOnKeySelect(item);
  };

  const selected = label === Label.from ? fromCurrency : toCurrency;

  return (
    <Box {...props}>
      <Box>
        <Text mb="2" fontWeight="bold" color="revo.gray" fontSize="xs">
          {label}
        </Text>
      </Box>
      <Box position="relative" cursor="pointer">
        <Box onClick={toggleOpen}>
          <Flex alignItems="center" mb="2" height="5">
            <Text fontWeight="medium">{selected && selected.name}</Text>
            <Flex ml="auto" alignItems="center">
              <Text color="revo.gray" fontWeight="medium">
                {selected && numeral(selected.value).format('00,000.00')}
              </Text>
              <Box ml="2" as={open ? FiChevronUp : FiChevronDown} color="revo.gray"></Box>
            </Flex>
          </Flex>
          <BorderAnimated open={open} />
        </Box>
        {open && (
          <Box
            as="ul"
            ref={ref}
            zIndex={9999}
            position="absolute"
            top="12"
            left="0"
            listStyleType="none"
            boxShadow="2xl"
            width="full"
            bg="white"
            borderRadius="sm"
            height="315px"
            overflowY="scroll"
          >
            <SearchCurrencyInput label={label} />
            {currencies.map((item: Currency) => {
              return (
                <CurrencyItem
                  key={item.name}
                  handleSelect={handleSelect}
                  handleOnKeySelect={handleOnKeySelect}
                  item={item}
                />
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}
