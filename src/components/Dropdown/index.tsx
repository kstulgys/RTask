import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import BorderAnimated from './BorderAnimated';
import SearchCurrencyInput from './SearchCurrencyInput';
import CurrencyItem from './CurrencyItem';
import {useOnClickOutside} from 'utils/hooks';
import {filterList, fPocket} from 'utils/helpers';
import {useSelector, useDispatch} from 'react-redux';
import {Currency, Currencies} from 'app/types';

interface DropdownProps {
  label: string;
  selected: Currency | null;
  pocketValue: number;
  currencies: Currencies;
  selectCurrency: (currency: Currency) => void;
  [key: string]: any;
}

export function Dropdown(props: DropdownProps): JSX.Element {
  const {label, selected, pocketValue, currencies, selectCurrency, ...rest} = props;
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState<boolean>(false);
  const [filtered, setFiltered] = React.useState<Currencies>(currencies);
  const ref = React.useRef();
  useOnClickOutside(ref, () => setOpen(false));
  const toggleOpen = (): void => setOpen(!open);

  const handleOnKeySelect = (item: Currency): void => {
    setOpen(true);
    dispatch(selectCurrency(item));
  };

  const handleSelect = (item: Currency): void => {
    setOpen(false);
    dispatch(selectCurrency(item));
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      const filtered = filterList(searchTerm, currencies);
      setFiltered(filtered);
    } else {
      setFiltered(currencies);
    }
  };

  const pocketValueColor = Math.sign(pocketValue) === -1 ? 'revo.red' : 'revo.gray';

  return (
    <Box {...rest}>
      <Box>
        <Text data-testid={`selected-${label.toLowerCase()}`} mb="2" fontWeight="bold" color="revo.gray" fontSize="xs">
          {label}
        </Text>
      </Box>
      <Box position="relative" cursor="pointer">
        <Box onClick={toggleOpen} data-testid={`dropdown-${label.toLowerCase()}`}>
          <Flex alignItems="center" mb="2" height="5">
            <Text fontWeight="medium">{selected?.name}</Text>
            <Flex ml="auto" alignItems="center">
              <Text color={pocketValueColor} fontWeight="medium" data-testid={`pocket-${label.toLowerCase()}`}>
                {fPocket(pocketValue)}
              </Text>
              <Box ml="2" as={open ? FiChevronUp : FiChevronDown} color="revo.gray"></Box>
            </Flex>
          </Flex>
          <BorderAnimated open={open} />
        </Box>
        {open && (
          <Box
            data-testid={`dropdown-list-${label.toLowerCase()}`}
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
