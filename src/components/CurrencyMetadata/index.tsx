import * as React from 'react';
import {Box, Flex, Text, Stat, StatHelpText, StatArrow} from '@chakra-ui/core';
import {useCurrencyState} from '../../context';

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

interface DataPoints {
  chartData: {x: number; y: number}[];
}

function TodaysChange({chartData}: DataPoints): JSX.Element {
  const change: number = chartData[chartData.length - 1].y - chartData[chartData.length - 2].y;
  const percent = (change * 100) / chartData[chartData.length - 1].y;

  const sign = Math.sign(change);

  return (
    <Stat>
      <StatHelpText fontWeight="medium" fontSize="xl" color={sign === -1 ? 'red.500' : 'green.500'}>
        <StatArrow type={sign === -1 ? 'decrease' : 'increase'} />
        {Math.abs(change).toFixed(4)} ({percent.toFixed(2)} %)
      </StatHelpText>
    </Stat>
  );
}
