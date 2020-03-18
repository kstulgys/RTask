import * as React from 'react';
import {Stat, StatHelpText, StatArrow, Box} from '@chakra-ui/core';
import {DataPoints} from 'app/types';

interface TodaysChangeProps {
  dataPoints: DataPoints;
}

export function TodaysChange({dataPoints}: TodaysChangeProps): JSX.Element {
  const change: number = dataPoints[dataPoints.length - 1].y - dataPoints[dataPoints.length - 2].y;
  const percent = (change * 100) / dataPoints[dataPoints.length - 1].y;

  const sign = Math.sign(change);

  return (
    <StatHelpText fontWeight="medium" fontSize="xl" color={sign === -1 ? 'red.500' : 'green.500'}>
      <StatArrow data-testid="current-change" type={sign === -1 ? 'decrease' : 'increase'} />
      {Math.abs(change).toFixed(4)} ({percent.toFixed(2)} %)
    </StatHelpText>
  );
}
