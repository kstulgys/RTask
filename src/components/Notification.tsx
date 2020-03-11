import * as React from 'react';
import {Box, Flex, Text, useToast} from '@chakra-ui/core';

export function Notification({duration, position, text}: any) {
  const toast = useToast();

  React.useEffect(() => {
    toast({
      //   title: "",
      //   description: "",
      //   status: "success",
      position: 'top-left',
      duration: 5000,
      isClosable: true,
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
