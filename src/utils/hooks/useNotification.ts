import * as React from 'react';
import {useToast} from '@chakra-ui/core';
import {useSelector} from 'react-redux';
import {RootState} from 'app/store';

export function useNotification(): any {
  const {error} = useSelector((state: RootState) => state.app);

  const toast = useToast();
  React.useEffect(() => {
    if (!error) return;
    toast({
      title: error.message,
      description: error.type,
      status: error.type,
      position: 'top',
      duration: 5000,
      isClosable: true,
    });
  }, [error]);
}
