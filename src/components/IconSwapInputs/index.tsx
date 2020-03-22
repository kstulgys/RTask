/* eslint-disable react/display-name */
import * as React from 'react';
import {IconButton, Box} from '@chakra-ui/core';
import {FiRepeat} from 'react-icons/fi';
import {swapCurrencies} from 'app/appState';
import {useDispatch, useSelector} from 'react-redux';
import {RootState} from 'app/store';
import {debounce} from 'debounce';
import {motion} from 'framer-motion';

export function IconSwapInputs(): JSX.Element {
  const [count, setCount] = React.useState(0);
  const {selectedFrom, selectedTo} = useSelector((state: RootState) => state.app);
  const dispatch = useDispatch();

  const handleSwap = debounce(() => {
    if (!selectedFrom || !selectedTo) return;
    dispatch(swapCurrencies({selectedFrom: selectedTo.name, selectedTo: selectedFrom.name}));
    setCount(count + 1);
  }, 250);

  return (
    <Box height="auto" mx={['auto', 'auto', 12]} mt={[0, 0, 6]} mb={[8, 12, 0]}>
      <MemoizedRotate key={count}>
        <IconButton
          data-testid="button-swap"
          aria-label="swap currencies"
          onClick={handleSwap}
          as={FiRepeat}
          color="revo.blue"
          bg="none"
          _hover={{bg: 'none'}}
          cursor="pointer"
          _active={{
            bg: 'none',
          }}
        />
      </MemoizedRotate>
    </Box>
  );
}

function Rotate({children}: any) {
  return (
    <motion.div
      animate={{
        scale: 1.1,
        rotate: 180,
      }}
    >
      {children}
    </motion.div>
  );
}

const MemoizedRotate = React.memo(Rotate);
