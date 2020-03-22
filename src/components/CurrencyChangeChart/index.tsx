/* eslint-disable react/display-name */
import * as React from 'react';
import {Text, Flex} from '@chakra-ui/core';
import {LineSeries, FlexibleWidthXYPlot, Hint} from 'react-vis';
import '../../..//node_modules/react-vis/dist/style.css';

function Chart({data, ...props}: any): JSX.Element {
  const [hoveredNode, setHoveredNode] = React.useState<null | {x: number; y: number}>(null);
  return (
    <Flex {...props} height="175px" ml="-30px" my="16">
      <FlexibleWidthXYPlot height={175} onMouseLeave={() => setHoveredNode(null)}>
        <LineSeries
          color="#0075EB"
          data={data}
          animation
          onNearestXY={(value: any) => {
            console.log({value});
            setHoveredNode(value);
          }}
        />
        {hoveredNode && (
          <Hint value={hoveredNode}>
            <Text color="gray.400">{hoveredNode.y.toFixed(4)}</Text>
          </Hint>
        )}
      </FlexibleWidthXYPlot>
    </Flex>
  );
}

export const CurrencyChangeChart = React.memo(Chart);
