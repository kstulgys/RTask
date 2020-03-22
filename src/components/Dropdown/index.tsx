import * as React from 'react';
import {Box, Flex, Text, useColorMode} from '@chakra-ui/core';
import {FiChevronDown, FiChevronUp} from 'react-icons/fi';
import BorderAnimated from './BorderAnimated';
import SearchCurrencyInput from './SearchCurrencyInput';
import CurrencyItem from './CurrencyItem';
import {useOnClickOutside} from 'utils/hooks';
import {filterList, fPocket, getFiltered} from 'utils/helpers';
import {useSelector, useDispatch} from 'react-redux';
import {Currency, Currencies} from 'app/types';
import {RootState} from 'app/store';

interface DropdownProps {
  label: string;
  selected: Currency | undefined;
  pocketValue: number;
  currencies: Currencies;
  selectCurrency: (currency: Currency) => void;
  [key: string]: any;
}

export function Dropdown(props: DropdownProps): JSX.Element {
  const {label, selected, pocketValue, selectCurrency, ...rest} = props;
  const {selectedFrom, selectedTo, currencies} = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();
  const [open, setOpen] = React.useState<boolean>(false);
  const filteredCurrenciesOnChange = React.useMemo(() => getFiltered(currencies, selectedFrom, selectedTo), [
    currencies,
    selectedFrom,
    selectedTo,
  ]);
  const [filtered, setFiltered] = React.useState<Currencies>(filteredCurrenciesOnChange);
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const ref = React.useRef();
  useOnClickOutside(ref, () => setOpen(false));
  const {colorMode} = useColorMode();
  const color = {
    light: 'revo.gray',
    dark: 'revo.lightGray',
  };

  const bg = {
    light: 'white',
    dark: 'gray.800',
  };

  React.useEffect(() => {
    setFiltered(filteredCurrenciesOnChange);
    setSearchTerm('');
  }, [filteredCurrenciesOnChange]);

  const toggleOpen = (): void => setOpen(!open);

  const handleOnKeySelect = (item: Currency): void => {
    dispatch(selectCurrency(item));
    setOpen(true);
  };

  const handleSelect = (item: Currency): void => {
    setOpen(false);
    dispatch(selectCurrency(item));
  };

  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      const filtered = filterList(searchTerm, filteredCurrenciesOnChange);
      setFiltered(filtered);
      setSearchTerm(searchTerm);
    } else {
      setFiltered(filteredCurrenciesOnChange);
      setSearchTerm('');
    }
  };

  const pocketValueColor = Math.sign(pocketValue) === -1 ? 'red.400' : 'revo.gray';

  return (
    <Box {...rest}>
      <Box>
        <Text
          data-testid={`selected-${label.toLowerCase()}`}
          mb="2"
          fontWeight="bold"
          color={color[colorMode]}
          fontSize="xs"
        >
          {label}
        </Text>
      </Box>
      <Box position="relative" cursor="pointer">
        <Box data-testid={`dropdown-${label.toLowerCase()}`}>
          <Flex onClick={toggleOpen} alignItems="center" mb="2" height="5">
            <Text fontWeight="medium" color="revo.gray">
              {selected?.name}
            </Text>
            <Flex ml="auto" alignItems="center">
              <Text color={pocketValueColor} fontWeight="medium" data-testid={`pocket-${label.toLowerCase()}`}>
                {fPocket(pocketValue)}
              </Text>
              <Box ml="2" size="20px" as={open ? FiChevronUp : FiChevronDown} color="revo.gray"></Box>
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
            bg={bg[colorMode]}
            borderRadius="sm"
            height="315px"
            overflowY="scroll"
          >
            <SearchCurrencyInput handleSearch={handleSearch} searchTerm={searchTerm} />
            {filtered.map((item: Currency, idx: number) => {
              return (
                <CurrencyItem
                  key={`${item.name}-${idx}`}
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
