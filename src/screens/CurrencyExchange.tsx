import * as React from 'react';
import {Box, Flex, Spinner} from '@chakra-ui/core';
import {TextHeader, ButtonContinue, Notification} from '../lib/components';
import {CurrencyChangeChart, Dropdown, CurrencyMetadata, InputAmount} from '../components';
import {useCurrencyState} from '../context';

enum Label {
  from = 'From',
  to = 'To',
}

enum Side {
  left = 'Left',
  right = 'Right',
}

export function CurrencyExchange(): JSX.Element {
  const {isLoading} = useCurrencyState();

  return (
    <ContainerScreen>
      {isLoading ? (
        <Spinner mx="auto" mt="64" color="revo.red" />
      ) : (
        <ContainerApp>
          <Notification />
          <TextHeader text="Exchange money" />
          <Flex flexDirection={['column', 'column', 'row']}>
            <ContainerInputs side={Side.left}>
              <Dropdown label={Label.from} />
              <InputAmount label="From" />
              <Box display={['none', 'none', 'block']}>
                <ButtonContinue text="Continue" />
              </Box>
            </ContainerInputs>
            <ContainerInputs side={Side.right}>
              <Dropdown label={Label.to} />
              <InputAmount label="To" />
              <Box display={['block', 'block', 'none']} mb="12">
                <ButtonContinue text="Continue" />
              </Box>
              <CurrencyMetadata />
            </ContainerInputs>
          </Flex>
          {/* <Box mt='12'>
          <SelectRange setDaysAgo={setDaysAgo} daysAgo={daysAgo} />
          <CurrencyChangeChart data={chartData} mt='6' />
        </Box> */}
        </ContainerApp>
      )}
    </ContainerScreen>
  );
}

function ContainerScreen(props: any): JSX.Element {
  return <Flex as="main" minHeight="100vh" bg="white" width="full" flexDirection="column" {...props} />;
}

function ContainerApp(props: any): JSX.Element {
  return (
    <Flex width={['full', 'full', 'full', '60%']} flexDirection="column" mx="auto" mt={[0, 16]} px="4" {...props} />
  );
}

interface ContainerInputsProps {
  side: Side.left | Side.right;
  [key: string]: any;
}

function ContainerInputs({side, ...props}: ContainerInputsProps): JSX.Element {
  console.log({side});
  const pl = side === Side.right ? [0, 0, 6] : 0;
  const pr = side === Side.left ? [0, 0, 6] : 0;

  return <Flex flexDir="column" width={['full', 'full', '50%']} pr={pr} pl={pl} {...props} />;
}
