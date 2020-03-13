import * as React from 'react';
import {Box, Text, useToast, IToast} from '@chakra-ui/core';
import {useCurrencyState} from 'context';

interface Props {
  position?: IToast['position'];
  status?: IToast['status'];
  title?: IToast['title'];
}

export function Notification({status, title, position = 'top-left'}: Props): any {
  const toast = useToast();
  React.useEffect(() => {
    toast({
      //   description: "",
      // title: messages[error] ? messages[error] : messages.initial,
      // status,
      position: 'top-left',
      // duration: 5000,
      // isClosable: true,
      // eslint-disable-next-line react/display-name
      render: () => {
        return (
          <Box bg="white" width="64" p="4" m="4" boxShadow="2xl" borderRadius="lg" color="revo.gray">
            <Text>
              <Box as="span" fontWeight="medium">
                Please note.
              </Box>
              This app is for demonstration purpose only. Pockets (GBP, USD, EUR) are randomly generated.
            </Text>
          </Box>
        );
      },
    });
  }, []);
  return null;
}
