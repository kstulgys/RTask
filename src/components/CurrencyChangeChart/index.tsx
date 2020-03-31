import * as React from 'react'
import {Text, Flex} from '@chakra-ui/core'
import {LineSeries, FlexibleWidthXYPlot, Hint} from 'react-vis'
import {useSelector, useDispatch} from 'react-redux'
import {stateSelector} from 'app/appState'
import '../../..//node_modules/react-vis/dist/style.css'

export function CurrencyChangeChart(props: any): JSX.Element {
  const {dataPoints} = useSelector(stateSelector)
  const [hoveredNode, setHoveredNode] = React.useState<null | {x: number; y: number}>(null)
  return (
    <Flex {...props} height="175px" ml="-30px" my="16">
      <FlexibleWidthXYPlot height={175} onMouseLeave={() => setHoveredNode(null)}>
        <LineSeries
          color="#0075EB"
          data={dataPoints}
          animation
          onNearestXY={(value: any) => {
            setHoveredNode(value)
          }}
        />
        {hoveredNode && (
          <Hint value={hoveredNode}>
            <Text color="gray.400">{hoveredNode.y.toFixed(4)}</Text>
          </Hint>
        )}
      </FlexibleWidthXYPlot>
    </Flex>
  )
}
