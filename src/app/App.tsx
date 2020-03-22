/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import {Box, Flex, Text, Button, useColorMode, IconButton} from '@chakra-ui/core';
import {
  CurrencyChangeChart,
  Dropdown,
  CurrencyMetadata,
  InputAmount,
  TextHeader,
  ButtonContinue,
  IconSwapInputs,
  Loader,
  ErrorBoundary,
  ToggleTheme,
} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchCurrencies,
  fetchCurrentRate,
  updateSelectedTo,
  selectFrom,
  selectTo,
  fetchDataPoints,
  submitValues,
  onInputChangeFrom,
  onInputChangeTo,
} from 'app/appState';
import {RootState} from 'app/store';
import {useNotification} from 'utils/hooks';
import {getFiltered} from 'utils/helpers';

export default function CurrencyExchange() {
  const {
    isLoading,
    selectedFrom,
    selectedTo,
    pocketValueFrom,
    pocketValueTo,
    inputValueFrom,
    inputValueTo,
    currencies,
    dataPoints,
  } = useSelector((state: RootState) => state.app);
  useFetchCurrencies();
  useNotification();
  useHandleUpdates();
  useCurrencyToUpdates();
  const dispatch = useDispatch();

  const filtered = React.useMemo(() => getFiltered(currencies, selectedFrom, selectedTo), [
    currencies,
    selectedFrom,
    selectedTo,
  ]);

  const handleSubmit = React.useCallback((): void => {
    if (!selectedFrom || !selectedTo) return;
    const from = {name: selectedFrom.name, value: +inputValueFrom};
    const to = {name: selectedTo.name, value: +inputValueTo};
    dispatch(submitValues({selectedFrom: from, selectedTo: to}));
  }, [inputValueFrom, inputValueTo]);

  const handleChangeFrom = React.useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(onInputChangeFrom(e.target.value));
  }, []);

  const handleChangeTo = React.useCallback((e: React.ChangeEvent<HTMLInputElement>): void => {
    dispatch(onInputChangeTo(e.target.value));
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  return (
    <ContainerScreen>
      <ContainerApp>
        <AppErrorBoundary>
          <TextHeader text="Exchange money" />
          <Flex flexDirection={['column', 'column', 'row']} alignItems="start">
            <ContainerInputs>
              <Dropdown
                label="From"
                selected={selectedFrom}
                pocketValue={pocketValueFrom}
                currencies={filtered}
                selectCurrency={selectFrom}
              />
              <InputAmount
                autoFocus={true}
                inputValue={inputValueFrom}
                selected={selectedFrom}
                handleChange={handleChangeFrom}
              />
              <Box display={['none', 'none', 'block']}>
                <ButtonContinue text="Continue" handleSubmit={handleSubmit} />
              </Box>
            </ContainerInputs>
            <IconSwapInputs />
            <ContainerInputs>
              <Dropdown
                label="To"
                selected={selectedTo}
                pocketValue={pocketValueTo}
                currencies={filtered}
                selectCurrency={selectTo}
              />
              <InputAmount
                autoFocus={false}
                inputValue={inputValueTo}
                selected={selectedTo}
                handleChange={handleChangeTo}
              />
              <Box display={['block', 'block', 'none']} mb="12">
                <ButtonContinue text="Continue" handleSubmit={handleSubmit} />
              </Box>
              <CurrencyMetadata />
            </ContainerInputs>
          </Flex>
          <CurrencyChangeChart data={dataPoints} mt="6" />
        </AppErrorBoundary>
      </ContainerApp>
    </ContainerScreen>
  );
}

function AppErrorBoundary(props: any) {
  return (
    <ErrorBoundary
      render={() => (
        <Text fontSize="3xl" color="revo.gray" textAlign="center">
          Something went wrong. Please try again later.
        </Text>
      )}
      {...props}
    />
  );
}

interface ContainerProps {
  [key: string]: any;
}
function ContainerScreen(props: ContainerProps): JSX.Element {
  const {colorMode} = useColorMode();
  const bg = {
    light: 'white',
    dark: 'gray.800',
  };

  return (
    <Flex
      as="main"
      minHeight="100vh"
      bg={bg[colorMode]}
      width="full"
      flexDirection="column"
      position="relative"
      {...props}
    >
      <ToggleTheme />
      {props.children}
    </Flex>
  );
}
function ContainerApp(props: ContainerProps): JSX.Element {
  return (
    <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4" {...props} />
  );
}
function ContainerInputs(props: ContainerProps): JSX.Element {
  return <Flex flexDir="column" width={['full', 'full', '50%']} {...props} />;
}

function useCurrencyToUpdates() {
  const dispatch = useDispatch();
  const {selectedFrom, currentRate} = useSelector((state: RootState) => state.app);

  React.useEffect(() => {
    if (!selectedFrom || !currentRate) return;
    dispatch(updateSelectedTo());
  }, [currentRate, selectedFrom]);
}

function useFetchCurrencies() {
  const dispatch = useDispatch();
  const {timesSubmitted} = useSelector((state: RootState) => state.app);
  React.useEffect(() => {
    dispatch(fetchCurrencies());
  }, [timesSubmitted]);
}

function useHandleUpdates() {
  const dispatch = useDispatch();
  const {selectedFrom, selectedTo} = useSelector((state: RootState) => state.app);
  React.useEffect(() => {
    if (!selectedFrom || !selectedTo) return;
    // get new currentRate
    dispatch(fetchDataPoints(selectedFrom.name, selectedTo.name));
    // get new dataPoints
    dispatch(fetchCurrentRate(selectedFrom.name, selectedTo.name));
    // save currency names to local storage
    window.localStorage.setItem(
      'currencies',
      JSON.stringify({currencyFrom: selectedFrom.name, currencyTo: selectedTo.name}),
    );
    // start new currentRate polling
    function startPolling(currencyFrom: string, currencyTo: string) {
      dispatch(fetchCurrentRate(currencyFrom, currencyTo));
    }
    let timer: any = null;
    timer = setInterval(() => {
      if (!selectedFrom || !selectedTo) return;
      startPolling(selectedFrom.name, selectedTo.name);
    }, 10000);
    // unsubscribe from previous rate polling
    return () => clearInterval(timer);
  }, [selectedFrom, selectedTo]);
}
