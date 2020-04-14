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
  const {
    isOpen,
    toggleOpen,
    handleSelect,
    currenciesList,
    pocketValue,
    selected,
    pocketValueColor,
    handleOnKeyUp,
  } = useDropdown(label, ref)
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
        <Text mb="2" fontWeight="bold" color={color[colorMode]} fontSize="xs">
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
                  key={`${item.name}-${idx}`}
                  handleOnKeyUp={handleOnKeyUp}
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

export function useDropdown(label: 'From' | 'To', ref: any) {
  const selectedFrom = useStore(state => state.selectedFrom)
  const selectedTo = useStore(state => state.selectedTo)
  const currencies = useStore(state => state.currencies)
  const pocketValueFrom = useStore(state => state.pocketValueFrom)
  const pocketValueTo = useStore(state => state.pocketValueTo)
  const actions = useStore(state => state.actions)
  const {handleSelectFrom, handleSelectTo} = actions
  const [isOpen, setOpen] = React.useState<boolean>(() => false)
  const [currenciesList, setList] = React.useState<Currencies>([])
  useOnClickOutside(ref, () => setOpen(false))

  const selected = label === 'From' ? selectedFrom : selectedTo
  const pocketValue = label === 'From' ? pocketValueFrom : pocketValueTo
  const onSelect = label === 'From' ? handleSelectFrom : handleSelectTo

  const toggleOpen = (): void => setOpen(!isOpen)

  const handleSelect = (item: Currency): void => {
    onSelect(item)
    setOpen(false)
  }

  const handleOnKeyUp = (item: Currency): void => {
    onSelect(item)
  }

  const pocketValueColor = Math.sign(parseInt(pocketValue)) === -1 ? 'red.400' : 'revo.gray'

  React.useEffect(() => {
    if (!selectedTo || !selectedFrom || !currencies.value.length) return
    if (label === 'From') {
      setList(getFiltered(currencies.value, selectedTo))
    }
    if (label === 'To') {
      setList(getFiltered(currencies.value, selectedFrom))
    }
  }, [currencies.value, selectedFrom?.name, selectedTo?.name])

  return {
    isOpen,
    toggleOpen,
    handleSelect,
    currenciesList,
    pocketValue,
    selected,
    handleOnKeyUp,
    pocketValueColor,
  }
}
