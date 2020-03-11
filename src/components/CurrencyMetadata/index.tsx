import * as React from 'react';
import {Box, Flex, Text} from '@chakra-ui/core';
import {useCurrencyState} from 'context';
import {TodaysChange} from './TodaysChnage';

export function CurrencyMetadata({...props}: {[key: string]: string}): JSX.Element {
  const {currentRate, chartData} = useCurrencyState();

  return (
    <Flex {...props}>
      <Box width="30%">
        <Text fontSize="xs" color="revo.gray" fontWeight="medium">
          Current rate
        </Text>
        <Text fontWeight="medium" fontSize="xl">
          {currentRate}
        </Text>
      </Box>
      <Box width="70%">
        <Text fontSize="xs" color="revo.gray" fontWeight="medium">
          {`Today's change`}
        </Text>
        {chartData.length > 1 && <TodaysChange chartData={chartData} />}
      </Box>
    </Flex>
  );
}
