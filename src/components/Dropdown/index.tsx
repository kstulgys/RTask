/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import {Box, Flex, Text, useColorMode} from '@chakra-ui/core'
import {FiChevronDown, FiChevronUp} from 'react-icons/fi'
import BorderAnimated from './BorderAnimated'
import SearchCurrencyInput from './SearchCurrencyInput'
import CurrencyItem from './CurrencyItem'
import {useOnClickOutside} from 'utils/hooks'
import {filterList, fPocket, getFiltered} from 'utils/helpers'
import {Currency, Currencies} from 'app/types'
import useStore from 'app/store'

interface DropdownProps {
  label: 'From' | 'To'
  [key: string]: any
}

const color = {
  light: 'revo.gray',
  dark: 'revo.lightGray',
}

const bg = {
  light: 'white',
  dark: 'gray.800',
}

export function Dropdown({label, ...rest}: DropdownProps) {
  const ref = React.useRef()
  const {isOpen, toggleOpen, handleSelect, currenciesList, pocketValue, selected, pocketValueColor} = useDropdown(
    label,
    ref,
  )
  const [filtered, setFiltered] = React.useState<Currencies>(currenciesList)
  const [searchTerm, setSearchTerm] = React.useState<string>('')
  const {colorMode} = useColorMode()
  React.useEffect(() => {
    setFiltered(currenciesList)
    setSearchTerm('')
  }, [currenciesList])
  const handleSearch = (searchTerm: string) => {
    if (searchTerm) {
      setFiltered(filterList(searchTerm, currenciesList))
      setSearchTerm(searchTerm)
    } else {
      setFiltered(currenciesList)
      setSearchTerm('')
    }
  }
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
        <Box onClick={toggleOpen} data-testid={`dropdown-${label.toLowerCase()}`}>
          <Flex alignItems="center" mb="2" height="5">
            <Text fontWeight="medium" color="revo.gray">
              {selected?.name}
            </Text>
            <Flex ml="auto" alignItems="center">
              <Text color={pocketValueColor} fontWeight="medium" data-testid={`pocket-${label.toLowerCase()}`}>
                {fPocket(pocketValue)}
              </Text>
              <Box ml="2" size="20px" as={isOpen ? FiChevronUp : FiChevronDown} color="revo.gray"></Box>
            </Flex>
          </Flex>
          <BorderAnimated open={isOpen} />
        </Box>
        {isOpen && (
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
                  // handleOnKeySelect={handleOnKeySelect}
                  key={`${item.name}-${idx}`}
                  handleSelect={handleSelect}
                  item={item}
                />
              )
            })}
          </Box>
        )}
      </Box>
    </Box>
  )
}

function useDropdown(label: 'From' | 'To', ref: any) {
  const selectedFrom = useStore(store => store.selectedFrom)
  const selectedTo = useStore(store => store.selectedTo)
  const currencies = useStore(store => store.currencies)
  const pocketValueFrom = useStore(store => store.pocketValueFrom)
  const pocketValueTo = useStore(store => store.pocketValueTo)
  const actions = useStore(store => store.actions)
  const {handleSelectFrom, handleSelectTo} = actions
  console.log({pocketValueFrom})
  const [isOpen, setOpen] = React.useState<boolean>(false)
  const [currenciesList, setList] = React.useState<Currencies>(getFiltered(currencies.value, selectedFrom, selectedTo))

  useOnClickOutside(ref, () => setOpen(false))

  const toggleOpen = (): void => setOpen(!isOpen)

  const selected = label === 'From' ? selectedFrom : selectedTo
  const pocketValue = label === 'From' ? pocketValueFrom : pocketValueTo
  const onSelect = label === 'From' ? handleSelectFrom : handleSelectTo
  const pocketValueColor = Math.sign(parseInt(pocketValue)) === -1 ? 'red.400' : 'revo.gray'

  const handleSelect = (item: Currency): void => {
    onSelect(item)
    setOpen(false)
  }

  React.useEffect(() => {
    if (!selectedFrom || !selectedTo || !currencies.value.length) return
    setList(getFiltered(currencies.value, selectedFrom, selectedTo))
  }, [currencies.value, selectedFrom?.name, selectedTo?.name])

  return {
    isOpen,
    toggleOpen,
    handleSelect,
    currenciesList,
    pocketValue,
    selected,
    pocketValueColor,
  }
}
