import * as React from 'react';
import {Box, Flex} from '@chakra-ui/core';
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
} from 'components';
import {useCurrencyState} from 'context';
import {Label} from './types';
import {
  selectFromCurrency,
  selectToCurrency,
  handleInputValueToChange,
  handleInputValueFromChange,
} from 'context/actions';
import {useNotification} from 'lib/hooks';

export function CurrencyExchange(): JSX.Element {
  const {
    isLoading,
    selectedFrom,
    selectedTo,
    selectedFromPocketValue,
    selectedToPocketValue,
    currencies,
    dataPoints,
    inputValueFrom,
    inputValueTo,
    status,
  } = useCurrencyState();
  useNotification({status});

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ContainerScreen>
      <ContainerApp>
        <Notification />
        <TextHeader text="Exchange money" />
        <Flex flexDirection={['column', 'column', 'row']} alignItems="start">
          <ContainerInputs>
            <Dropdown
              label={Label.from}
              selected={selectedFrom}
              pocketValue={selectedFromPocketValue}
              currencies={currencies.filter(c => c.name !== selectedTo?.name)}
              selectCurrency={selectFromCurrency}
            />
            <InputAmount
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
              pocketValue={selectedToPocketValue}
              currencies={currencies.filter(c => c.name !== selectedFrom?.name)}
              selectCurrency={selectToCurrency}
            />
            <InputAmount inputValue={inputValueTo} selected={selectedTo} handleChange={handleInputValueToChange} />
            <Box display={['block', 'block', 'none']} mb="12">
              <ButtonContinue text="Continue" />
            </Box>
            <CurrencyMetadata />
          </ContainerInputs>
        </Flex>
        <CurrencyChangeChart data={dataPoints} mt="6" />
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
