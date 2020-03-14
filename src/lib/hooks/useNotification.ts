import * as React from 'react';
import {useToast} from '@chakra-ui/core';
import {ActionTypes} from 'context/actionTypes';
import {useCurrencyDispatch} from 'context';
import {Status, StatusTypes} from 'context/types';

interface Props {
  status: Status;
}

export function useNotification({status}: Props): any {
  const dispatch = useCurrencyDispatch();
  const toast = useToast();
  React.useEffect(() => {
    if (status && status.name !== 'idle') {
      console.log({status});
      toast({
        title: status.message,
        description: '',
        status: status.name,
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
      dispatch({
        type: ActionTypes.STATUS_CLEANUP,
        payload: {status: StatusTypes.idl},
      });
    }
  }, [status]);
}
