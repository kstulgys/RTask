import * as React from 'react'
import {Button as BaseButton, Box} from '@chakra-ui/core'
import useStore from 'app/store'

interface ButtonContinueProps {
  // canSubmit: boolean
  // isSubmitting: boolean
  // handleSubmitValues: () => void
  [key: string]: any
}

export function ButtonContinue(props: ButtonContinueProps) {
  const canSubmit = useStore(state => state.canSubmit)
  const isSubmitting = useStore(state => state.submitValues.isSubmitting)
  const handleSubmitValues = useStore(state => state.asyncActions.handleSubmitValues)

  return (
    <Box {...props}>
      <BaseButton
        onClick={handleSubmitValues}
        isLoading={isSubmitting}
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

// function withStore(WrappedComponent: any, ownProps?: any) {
//   const canSubmit = useStore(state => state.canSubmit)
//   const isSubmitting = useStore(state => state.submitValues.isSubmitting)
//   const handleSubmitValues = useStore(state => state.actions.handleSubmitValues)

//   const props = {
//     canSubmit,
//     isSubmitting,
//     handleSubmitValues,
//   }

//   // ... and renders the wrapped component with the fresh data!
//   // Notice that we pass through any additional props
//   return <WrappedComponent {...props} {...ownProps} />
// }

// export const EnhancedComponent = withStore(ButtonContinue)
