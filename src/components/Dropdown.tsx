import * as React from 'react';
import {Box, Flex, Button, Text, Input, InputGroup, InputLeftElement, Icon} from '@chakra-ui/core';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {useOnClickOutside} from '../lib/hooks';
import {motion} from 'framer-motion';
import theme from '../theme';
import numeral from 'numeral';
import {
  useCurrencyState,
  useCurrencyDispatch,
  selectFromCurrency,
  selectToCurrency,
  filterFromCurrencies,
  filterToCurrencies,
} from '../context';

const currencyFlags: {[key: string]: string} = {
  GBP: '🇬🇧',
  EUR: '🇪🇺',
  USD: '🇺🇸',
  CAD: '🇨🇦',
  HKD: '🇭🇰',
  ISK: '🇮🇸',
  PHP: '🇵🇭',
  DKK: '🇩🇰',
  HUF: '🇭🇺',
  CZK: '🇨🇿',
  AUD: '🇦🇺',
  RON: '🇷🇴',
  SEK: '🇸🇪',
  IDR: '🇮🇩',
  INR: '🇮🇳',
  BRL: '🇧🇷',
  RUB: '🇷🇺',
  HRK: '🇭🇷',
  JPY: '🇯🇵',
  THB: '🇹🇭',
  CHF: '🇨🇭',
  SGD: '🇸🇬',
  PLN: '🇵🇱',
  BGN: '🇧🇪',
  TRY: '🇹🇷',
  CNY: '🇨🇳',
  NOK: '🇳🇴',
  NZD: '🇳🇿',
  ZAR: '🇿🇦',
  MXN: '🇲🇽',
  ILS: '🇮🇱',
  KRW: '🇰🇷',
  MYR: '🇲🇾',
};

function f(amount: number): string {
  return numeral(amount).format('00,000.00');
}

interface Currency {
  name: string;
  value: number;
}

interface DropdownProps {
  label: Label.from | Label.to;
  [key: string]: any;
}

enum Label {
  from = 'From',
  to = 'To',
}

export function Dropdown({label, ...props}: DropdownProps): JSX.Element {
  const {fromCurrency, toCurrency, currenciesFromFiltered, currenciesToFiltered} = useCurrencyState();
  const dispatch = useCurrencyDispatch();
  const ref = React.useRef();
  const [open, setOpen] = React.useState<boolean>(false);
  const toggleOpen = (): void => setOpen(!open);
  useOnClickOutside(ref, () => setOpen(false));

  const currencies = label === Label.from ? currenciesFromFiltered : currenciesToFiltered;

  const handleOnKeySelect = (item: Currency): void => {
    if (label === Label.from) {
      selectFromCurrency(dispatch, item);
    }
    if (label === Label.to) {
      selectToCurrency(dispatch, item);
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
                {selected && f(selected.value)}
              </Text>
              <Box ml="2" as={open ? FiChevronUp : FiChevronDown} color="revo.gray"></Box>
            </Flex>
          </Flex>
          <BorderBottom open={open} />
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
            <SearchCurrency label={label} />
            {currencies.map((item: Currency, idx) => {
              return (
                <Box as="li" my="1" key={item.name}>
                  <Button
                    height="12"
                    py="auto"
                    px="8"
                    width="full"
                    borderRadius="none"
                    bg="white"
                    onClick={() => handleSelect(item)}
                    onKeyUp={() => handleOnKeySelect(item)}
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
                          {!!item.value && f(item.value)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

interface SearchCurrencyProps {
  label: Label.from | Label.to;
}

function SearchCurrency({label}: SearchCurrencyProps): JSX.Element {
  const dispatch = useCurrencyDispatch();
  const {currencies} = useCurrencyState();
  const [searchTerm, setSearchTerm] = React.useState('');

  const filterCurrencies = () => {
    if (label === 'From') {
      filterFromCurrencies(dispatch, searchTerm, currencies);
    }
    if (label === 'To') {
      filterToCurrencies(dispatch, searchTerm, currencies);
    }
  };

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>): void => {
    setSearchTerm(e.target.value);
  };

  React.useEffect(() => {
    filterCurrencies();
  }, [searchTerm]);

  return (
    <InputGroup my="1">
      {/* eslint-disable-next-line react/no-children-prop */}
      <InputLeftElement children={<Icon mt="2" ml="10" name="search" color="revo.gray" />} />
      <Input
        onChange={handleSearch}
        pl="16"
        height="12"
        borderRadius="none"
        border="none"
        type="search"
        placeholder="Search"
        _placeholder={{
          color: 'revo.gray',
        }}
      />
    </InputGroup>
  );
}

interface BorderBottomProps {
  open: boolean;
}

function BorderBottom({open}: BorderBottomProps): JSX.Element {
  return (
    <Box position="relative">
      <motion.div
        style={{
          height: 2,
          width: 0,
          left: 0,
          top: 0,
          position: 'absolute',
        }}
        initial="close"
        animate={open ? 'open' : 'close'}
        variants={{
          open: {
            zIndex: 9999,
            background: theme.colors.revo.blue,
            width: '100%',
            transition: {
              duration: 0.2,
            },
          },
          close: {
            width: 0,
          },
        }}
      />
      <Flex mt="3" height="2px" bg="revo.lightGray" />
    </Box>
  );
}
