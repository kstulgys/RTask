/* eslint-disable @typescript-eslint/no-use-before-define */
import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
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
} from 'components';
import {useSelector, useDispatch} from 'react-redux';
import {
  fetchCurrencies,
  fetchCurrentRate,
  updateSelectedTo,
  onInputChangeFrom,
  onInputChangeTo,
  selectFrom,
  selectTo,
  fetchDataPoints,
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

  const filtered = React.useMemo(() => getFiltered(currencies, selectedFrom, selectedTo), [
    currencies,
    selectedFrom,
    selectedTo,
  ]);

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
                handleChange={onInputChangeFrom}
              />
              <Box display={['none', 'none', 'block']}>
                <ButtonContinue text="Continue" />
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
                handleChange={onInputChangeTo}
              />
              <Box display={['block', 'block', 'none']} mb="12">
                <ButtonContinue text="Continue" />
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
    // start new currentRate pooling
    function startPolling(currencyFrom: string, currencyTo: string) {
      dispatch(fetchCurrentRate(currencyFrom, currencyTo));
    }
    let timer: any = null;
    timer = setInterval(() => {
      if (!selectedFrom || !selectedTo) return;
      startPolling(selectedFrom.name, selectedTo.name);
    }, 10000);
    return () => clearInterval(timer);
  }, [selectedFrom, selectedTo]);
}
