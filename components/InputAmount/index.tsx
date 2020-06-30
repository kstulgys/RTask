/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import { Box, Flex, Text, NumberInput, NumberInputField, useColorMode, IconButton } from '@chakra-ui/core'
import { SYMBOLS } from './symbols'
import { FiPlus, FiMinus } from 'react-icons/fi'
import useStore from 'store'

const style = {
  color: {
    light: 'gray.800',
    dark: 'revo.lightGray',
  },
  bgInput: {
    light: 'white',
    dark: 'gray.800',
  },
  colorPl: {
    light: 'revo.lightGray',
    dark: 'gray.600',
  },
}

export function InputAmount({ label }: { label: 'From' | 'To' }) {
  const { inputValue, handleChange, symbol, sign, isDisabled } = useInputAmount(label)
  const { colorMode } = useColorMode()
  const inputRef = React.useRef(null)

  React.useEffect(() => {
    if (label === 'From') inputRef.current.focus()
  }, [label])

  return (
    <Flex alignItems="center" my={[6, 12, 16]}>
      <Box display={['none', 'block']}>
        <Text pr="1" color={style.color[colorMode]} data-testid="currency-symbol" lineHeight="none" fontSize="110px" fontWeight="lighter">
          {symbol}
        </Text>
      </Box>
      {!!inputValue && (
        <Flex flexDirection="column" height="full">
          <IconButton my="auto" py="0" size="lg" data-testid="button-swap" aria-label="sign" as={sign} color="revo.blue" bg="none" />
        </Flex>
      )}
      <NumberInput height={['80px', '110px']}>
        <NumberInputField
          isDisabled={isDisabled}
          ref={inputRef}
          lineHeight="none"
          color={style.color[colorMode]}
          bg={style.bgInput[colorMode]}
          onChange={handleChange}
          value={inputValue ? inputValue : ''}
          pl="0"
          px="0"
          height="full"
          zIndex={1}
          border="none"
          fontSize={['80px', '110px']}
          fontWeight="lighter"
          placeholder="0"
          _focus={{
            boxShadow: 'none',
          }}
          _placeholder={{
            color: style.colorPl[colorMode],
          }}
        />
      </NumberInput>
    </Flex>
  )
}

function useInputAmount(label: 'To' | 'From') {
  const { selectedFrom, selectedTo, inputValueFrom, inputValueTo } = useStore(state => state)
  const { handleInputChangeFrom, handleInputChangeTo } = useStore(state => state.actions)

  const onChnage = label === 'From' ? handleInputChangeFrom : handleInputChangeTo
  const selected = label === 'From' ? selectedFrom : selectedTo
  const inputValue = label === 'From' ? inputValueFrom : inputValueTo
  const symbol = selected && SYMBOLS[selected.name].symbol_native
  const sign = label === 'From' ? FiMinus : FiPlus
  const isDisabled = !selectedFrom || !selectedTo

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => onChnage(e.target.value)

  return { inputValue, handleChange, isDisabled, symbol, sign }
}
