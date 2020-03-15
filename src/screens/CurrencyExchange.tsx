import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
import {
  CurrencyChangeChart,
  Dropdown,
  CurrencyMetadata,
  InputAmount,
  TextHeader,
  ButtonContinue,
  Notification,
  IconSwapInputs,
  Loader,
  ErrorBoundary,
} from 'components';
import {
  selectFromCurrency,
  selectToCurrency,
  handleInputValueToChange,
  handleInputValueFromChange,
} from 'context/actions';
import {useCurrencyState, useCurrencyDispatch} from 'context';
import {Label} from './types';
import {useNotification} from 'lib/hooks';
import {setInitialData, handleCurencyRateChange} from 'context/actions';
import {useCurrencyRatePolling} from 'lib/hooks';

export function CurrencyExchange() {
  const state = useCurrencyState();
  const {
    isLoading,
    selectedFrom,
    selectedTo,
    pocketValueFrom,
    pocketValueTo,
    currencies,
    dataPoints,
    inputValueFrom,
    inputValueTo,
    status,
    currentRate,
  } = state;
  const dispatch = useCurrencyDispatch();
  useCurrencyRatePolling({dispatch, selectedFrom, selectedTo, currentRate});
  useNotification({status});

  React.useEffect(() => {
    setInitialData(dispatch);
  }, []);

  React.useEffect(() => {
    handleCurencyRateChange(dispatch, state);
  }, [currentRate]);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ContainerScreen>
      <ContainerApp>
        <ErrorBoundary
          render={() => (
            <Text fontSize="3xl" color="revo.gray" textAlign="center">
              Something went wrong. Please try again later.
            </Text>
          )}
        >
          <TextHeader text="Exchange money" />
          <Flex flexDirection={['column', 'column', 'row']} alignItems="start">
            <ContainerInputs>
              <Dropdown
                label={Label.from}
                selected={selectedFrom}
                pocketValue={pocketValueFrom}
                currencies={currencies.filter(c => c.name !== selectedTo?.name)}
                selectCurrency={selectFromCurrency}
              />
              <InputAmount
                autoFocus={true}
                inputValue={inputValueFrom}
                selected={selectedFrom}
                handleChange={handleInputValueFromChange}
              />
              <Box display={['none', 'none', 'block']}>
                <ButtonContinue text="Continue" />
              </Box>
            </ContainerInputs>
            <IconSwapInputs />
            <ContainerInputs>
              <Dropdown
                label={Label.to}
                selected={selectedTo}
                pocketValue={pocketValueTo}
                currencies={currencies.filter(c => c.name !== selectedFrom?.name)}
                selectCurrency={selectToCurrency}
              />
              <InputAmount
                autoFocus={false}
                inputValue={inputValueTo}
                selected={selectedTo}
                handleChange={handleInputValueToChange}
              />
              <Box display={['block', 'block', 'none']} mb="12">
                <ButtonContinue text="Continue" />
              </Box>
              <CurrencyMetadata />
            </ContainerInputs>
          </Flex>
          <CurrencyChangeChart data={dataPoints} mt="6" />
        </ErrorBoundary>
      </ContainerApp>
    </ContainerScreen>
  );
}

interface ContainerProps {
  [key: string]: any;
}
function ContainerScreen(props: ContainerProps): JSX.Element {
  return <Flex as="main" minHeight="100vh" bg="white" width="full" flexDirection="column" {...props} />;
}
function ContainerApp(props: ContainerProps): JSX.Element {
  return (
    <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4" {...props} />
  );
}
function ContainerInputs(props: ContainerProps): JSX.Element {
  return <Flex flexDir="column" width={['full', 'full', '50%']} {...props} />;
}
