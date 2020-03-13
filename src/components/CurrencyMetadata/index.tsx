import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {TodaysChange} from './TodaysChnage';

export function CurrencyMetadata({...props}: {[key: string]: string}): JSX.Element {
  const {currentRate, dataPoints} = useCurrencyState();

  return (
    <Flex {...props}>
      <Box width="40">
        <Text fontSize="xs" color="revo.gray" fontWeight="medium">
          Current rate
        </Text>
        <Text fontWeight="medium" fontSize="xl">
          {!!currentRate && currentRate}
        </Text>
      </Box>
      <Box width="full">
        <Text fontSize="xs" color="revo.gray" fontWeight="medium">
          {`Today's change`}
        </Text>
        {dataPoints.length > 1 && <TodaysChange dataPoints={dataPoints} />}
      </Box>
    </Flex>
  );
}
