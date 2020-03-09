import * as React from "react";
import {Text, Flex} from "@chakra-ui/core";
import {LineSeries, FlexibleWidthXYPlot, Hint} from "react-vis";

export function CurrencyChangeChart({data, ...props}: any) {
  const [hoveredNode, setHoveredNode] = React.useState<null | {x: number; y: number}>(null);
  return (
    <Flex {...props} height='175px'>
      <FlexibleWidthXYPlot height={175} onMouseLeave={() => setHoveredNode(null)}>
        <LineSeries
          color='#0075EB'
          data={data}
          animation
          onNearestXY={(value: any) => {
            console.log({value});
            setHoveredNode(value);
          }}
        />
        {hoveredNode && (
          <Hint value={hoveredNode}>
            <Text color='gray.400'>{hoveredNode.y.toFixed(4)}</Text>
          </Hint>
        )}
      </FlexibleWidthXYPlot>
    </Flex>
  );
}
