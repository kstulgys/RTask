import * as React from 'react';
import {Box, Flex, Text, useColorMode, StatHelpText, StatArrow} from '@chakra-ui/core';
import {useSelector, useDispatch} from 'react-redux';
import {RootState} from 'app/store';
import {motion, AnimatePresence} from 'framer-motion';

export function CurrencyMetadata({...props}: {[key: string]: string}): JSX.Element {
  return (
    <Flex {...props}>
      <CurrentRate minWidth="20" mr={[10, 12]} />
      <TodaysChange width="full" />
    </Flex>
  );
}

function TodaysChange(props: any) {
  const {dataPoints = []} = useSelector((state: RootState) => state.app);
  const change: number = dataPoints[dataPoints.length - 1].y - dataPoints[dataPoints.length - 2].y;
  const percent = (change * 100) / dataPoints[dataPoints.length - 1].y;
  const sign = Math.sign(change);

  return (
    <Box {...props}>
      <Text fontSize="xs" color="revo.gray" fontWeight="medium">
        {`Today's change`}
      </Text>
      <StatHelpText fontWeight="medium" fontSize="xl" color={sign === -1 ? 'red.400' : 'green.400'}>
        <StatArrow data-testid="current-change" type={sign === -1 ? 'decrease' : 'increase'} />
        <AnimatePresence>
          <motion.span
            key={change}
            initial={{opacity: 0, y: -50}}
            animate={{opacity: 1, y: 0}}
            exit={{opacity: 0, y: 50}}
            style={{position: 'absolute'}}
          >
            {Math.abs(change).toFixed(4)} ({percent.toFixed(2)} %)
          </motion.span>
        </AnimatePresence>
      </StatHelpText>
    </Box>
  );
}

function CurrentRate(props: any) {
  const {currentRate} = useSelector((state: RootState) => state.app);
  const {colorMode} = useColorMode();
  const color = {
    light: 'gray.800',
    dark: 'revo.lightGray',
  };
  return (
    <Box {...props}>
      <Text fontSize="xs" color="revo.gray" fontWeight="medium">
        Current rate
      </Text>
      <Text color={color[colorMode]} data-testid="current-rate" fontWeight="medium" fontSize="xl">
        <AnimateChange change={currentRate}>{!!currentRate && currentRate}</AnimateChange>
      </Text>
    </Box>
  );
}

function AnimateChange({children, change}: any) {
  return (
    <AnimatePresence>
      <motion.span
        key={change}
        initial={{opacity: 0, y: -50}}
        animate={{opacity: 1, y: 0}}
        exit={{opacity: 0, y: 50}}
        style={{position: 'absolute'}}
      >
        {children}
      </motion.span>
    </AnimatePresence>
  );
}
