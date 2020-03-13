import * as React from 'react';
import {useToast, IToast} from '@chakra-ui/core';
import {ActionTypes} from 'context/actionTypes';
import {useCurrencyDispatch} from 'context';
interface Props {
  status: IToast['status'];
}

export function useNotification({status}: Props): any {
  const dispatch = useCurrencyDispatch();
  const toast = useToast();
  React.useEffect(() => {
    if (status) {
      console.log({status});
      toast({
        title: messages[status].title,
        description: '',
        status: messages[status].statusName,
        position: 'top',
        duration: 5000,
        isClosable: true,
      });
      dispatch({
        type: ActionTypes.STATUS_CLEANUP,
        payload: {status: null},
      });
    }
  }, [status]);
}

const messages: {[key: string]: {title: string; statusName: IToast['status']}} = {
  success: {
    title: 'Success.',
    statusName: 'success',
  },
  error: {
    title: 'Something went wrong.',
    statusName: 'error',
  },
};
