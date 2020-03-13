import * as React from 'react';
import {Box, Flex, Spinner} from '@chakra-ui/core';
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
import {Side, Label, LeftOrRight} from './types';

export function CurrencyExchange(): JSX.Element {
  const {isLoading, dataPoints} = useCurrencyState();
  if (isLoading) {
    return <Loader />;
  }
  return (
    <ContainerScreen>
      <ContainerApp>
        <Notification />
        <TextHeader text="Exchange money" />
        <Flex flexDirection={['column', 'column', 'row']} alignItems="start">
          <ContainerInputs side={Side.left}>
            <Dropdown label={Label.from} />
            <InputAmount label={Label.from} />
            <Box display={['none', 'none', 'block']}>
              <ButtonContinue text="Continue" />
            </Box>
          </ContainerInputs>
          <IconSwapInputs />
          <ContainerInputs side={Side.right}>
            <Dropdown label={Label.to} />
            <InputAmount label={Label.to} />
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

function ContainerScreen(props: {[key: string]: any}): JSX.Element {
  return <Flex as="main" minHeight="100vh" bg="white" width="full" flexDirection="column" {...props} />;
}

function ContainerApp(props: {[key: string]: any}): JSX.Element {
  return (
    <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4" {...props} />
  );
}

interface ContainerInputsProps {
  side: LeftOrRight;
  [key: string]: any;
}

function ContainerInputs({side, ...props}: ContainerInputsProps): JSX.Element {
  return <Flex flexDir="column" width={['full', 'full', '50%']} {...props} />;
}
