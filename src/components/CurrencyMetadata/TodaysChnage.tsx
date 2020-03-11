import * as React from 'react';
import {Stat, StatHelpText, StatArrow} from '@chakra-ui/core';
import {DataPoints} from 'context/types';

interface TodaysChangeProps {
  chartData: DataPoints;
}

export function TodaysChange({chartData}: TodaysChangeProps): JSX.Element {
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
