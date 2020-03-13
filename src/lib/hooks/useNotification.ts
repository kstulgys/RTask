import * as React from 'react';
import {Box, Text, useToast, IToast} from '@chakra-ui/core';

interface Props {
  status?: IToast['status'];
}
// title: "Account created.",
// description: "We've created your account for you.",
// status: "success",
// duration: 9000,
// isClosable: true,
// })
export function useNotification({status}: Props): any {
  const toast = useToast();
  React.useEffect(() => {
    if (status) {
      console.log({status});
      toast({
        title: messages[status].title,
        description: '',
        status: messages[status].statusName,
        position: 'top-left',
        duration: 5000,
        isClosable: true,
      });
    }
  }, [status]);
}

const messages: {[key: string]: {title: string; statusName: IToast['status']}} = {
  success: {
    title: 'Success',
    statusName: 'success',
  },
  error: {
    title: 'Something went wrong.',
    statusName: 'error',
  },
};
