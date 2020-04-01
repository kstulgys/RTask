import * as React from 'react'
import {Button as BaseButton, Box} from '@chakra-ui/core'
import {useSelector, useDispatch} from 'react-redux'
import {selectCurrencySelector, inputChangeSelector, currentRateSelector} from 'app/store'

// import {submitValues, stateSelector} from 'app/appSlice'

export function ButtonContinue(props: {[key: string]: any}) {
  const dispatch = useDispatch()
  // const {isSubmitting} = useSelector(stateSelector)
  const {selectedFrom, selectedTo} = useSelector(selectCurrencySelector)
  const {inputValueFrom, inputValueTo, canSubmit} = useSelector(inputChangeSelector)

  const handleSubmit = React.useCallback((): void => {
    if (!selectedFrom || !selectedTo) return
    const from = {name: selectedFrom.name, value: +inputValueFrom}
    const to = {name: selectedTo.name, value: +inputValueTo}
    // dispatch(submitValues({selectedFrom: from, selectedTo: to}))
  }, [inputValueFrom, inputValueTo])

  return (
    <Box {...props}>
      <BaseButton
        onClick={handleSubmit}
        // isLoading={isSubmitting}
        isDisabled={!canSubmit}
        type="submit"
        width="full"
        rounded="full"
        fontSize="sm"
        size="lg"
        bg="revo.red"
        color="white"
        _hover={{bg: 'revo.red'}}
      >
        Continue
      </BaseButton>
    </Box>
  )
}
