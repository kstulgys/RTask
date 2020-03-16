import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import {CurrencyDispatch, CurrencyState, Currency, Currencies} from 'context/types';
import {FromOrTo} from 'screens/types';
import {useCurrencyState, useCurrencyDispatch} from 'context';
import BorderAnimated from './BorderAnimated';
import SearchCurrencyInput from './SearchCurrencyInput';
import CurrencyItem from './CurrencyItem';
import {useOnClickOutside} from 'lib/hooks';
import {getFiltered} from 'lib/utils/helpers';
import numeral from 'numeral';

interface DropdownProps {
  label: FromOrTo;
  selected: Currency | null;
  pocketValue: number;
  currencies: Currencies;
  selectCurrency: (dispatch: CurrencyDispatch, state: CurrencyState, name: string) => void;
  [key: string]: any;
}

export function Dropdown(props: DropdownProps): JSX.Element {
  const {label, selected, pocketValue, currencies, selectCurrency, ...rest} = props;
  const state = useCurrencyState();
  const dispatch = useCurrencyDispatch();

  const [open, setOpen] = React.useState<boolean>(false);
  const [filtered, setFiltered] = React.useState<Currencies>(currencies);
  const ref = React.useRef();
  useOnClickOutside(ref, () => setOpen(false));
  const toggleOpen = (): void => setOpen(!open);

  const handleOnKeySelect = (item: Currency): void => {
    selectCurrency(dispatch, state, item.name);
  };

  const handleSelect = (item: Currency): void => {
    setOpen(false);
    handleOnKeySelect(item);
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      const filtered = getFiltered(searchTerm, currencies);
      setFiltered(filtered);
    } else {
      setFiltered(currencies);
    }
  };

  const pocketValueColor = Math.sign(pocketValue) === -1 ? 'revo.red' : 'revo.gray';

  return (
    <Box {...rest}>
      <Box>
        <Text mb="2" fontWeight="bold" color="revo.gray" fontSize="xs">
          {label}
        </Text>
      </Box>
      <Box position="relative" cursor="pointer">
        <Box onClick={toggleOpen}>
          <Flex alignItems="center" mb="2" height="5">
            <Text fontWeight="medium">{selected?.name}</Text>
            <Flex ml="auto" alignItems="center">
              <Text color={pocketValueColor} fontWeight="medium" data-testid={`pocket-${label.toLocaleLowerCase()}`}>
                {numeral(pocketValue).format('00,000.00')}
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
            <SearchCurrencyInput handleSearch={handleSearch} />
            {filtered.map((item: Currency) => {
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
