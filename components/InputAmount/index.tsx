/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react'
import { Box, Flex, Text, NumberInput, NumberInputField, useColorMode, IconButton } from '@chakra-ui/core'
import { SYMBOLS } from './symbols'
import { FiPlus, FiMinus } from 'react-icons/fi'
import useStore from 'store'
import { filterList, fPocket, getFiltered } from 'utils/helpers'

interface InputAmountProps {
  autoFocus?: boolean
  label: 'From' | 'To'
  [key: string]: any
}

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

export function InputAmount(props: InputAmountProps) {
  const { autoFocus, label, ...rest } = props
  const { inputValue, handleChange, symbol, sign } = useInputAmount(label)
  const { colorMode } = useColorMode()

  return (
    <Flex alignItems="center" my={[6, 12, 16]} {...rest}>
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
          lineHeight="none"
          color={style.color[colorMode]}
          bg={style.bgInput[colorMode]}
          data-testid={autoFocus ? 'input-from' : 'input-to'}
          autoFocus={autoFocus}
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
  const selectedFrom = useStore(state => state.selectedFrom)
  const selectedTo = useStore(state => state.selectedTo)
  const inputValueFrom = useStore(state => state.inputValueFrom)
  const inputValueTo = useStore(state => state.inputValueTo)
  const actions = useStore(state => state.actions)
  const { handleInputChangeFrom, handleInputChangeTo } = actions

  const onChnage = label === 'From' ? handleInputChangeFrom : handleInputChangeTo
  const selected = label === 'From' ? selectedFrom : selectedTo
  const inputValue = label === 'From' ? inputValueFrom : inputValueTo
  const symbol = selected && SYMBOLS[selected.name].symbol_native
  const sign = label === 'From' ? FiMinus : FiPlus

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    onChnage(e.target.value)
  }

  return { inputValue, handleChange, symbol, sign }
}
