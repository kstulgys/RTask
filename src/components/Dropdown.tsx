import * as React from "react";
import {Box, Flex, Button, Text, Input, InputGroup, InputLeftElement, Icon} from "@chakra-ui/core";
import {FiChevronDown, FiChevronUp} from "react-icons/fi";
import {useOnClickOutside} from "../lib/hooks";
import {motion} from "framer-motion";
import theme from "../theme";
import numeral from "numeral";

function f(amount: number): string {
  return numeral(amount).format("00,000.00");
}

interface IDropdown {
  currencies: {name: string; value: number; flag: string}[];
}

export function Dropdown({currencies, selected, setSelected, label, ...props}: any) {
  const ref = React.useRef();
  const [open, setOpen] = React.useState(false);
  useOnClickOutside(ref, () => setOpen(false));

  const handleSelected = (item: {name: string; flag: string; value: string}) => {
    setOpen(false);
    setSelected(item);
  };

  const toggleOpen = () => setOpen(!open);

  return (
    <Box {...props}>
      <Box>
        <Text mb='2' fontWeight='bold' color='revo.gray' fontSize='xs'>
          {label}
        </Text>
      </Box>
      <Box position='relative' cursor='pointer'>
        <Box onClick={toggleOpen}>
          <Flex alignItems='center' mb='2' height='5'>
            <Text fontWeight='medium'>{selected && selected.name}</Text>
            <Flex ml='auto' alignItems='center'>
              <Text color='revo.gray' fontWeight='medium'>
                {selected && f(selected.value)}
              </Text>
              <Box ml='2' as={open ? FiChevronUp : FiChevronDown} color='revo.gray'></Box>
            </Flex>
          </Flex>
          <BorderBottom open={open} />
        </Box>
        {open && (
          <Box
            as='ul'
            ref={ref}
            zIndex={9999}
            position='absolute'
            top='12'
            left='0'
            listStyleType='none'
            boxShadow='2xl'
            width='full'
            bg='white'
            borderRadius='sm'
            height='315px'
            overflowY='scroll'
          >
            <SearchCurrency />
            {currencies.map((item: any) => {
              return (
                <Box as='li' my='1'>
                  <Button
                    height='12'
                    py='auto'
                    px='8'
                    width='full'
                    borderRadius='none'
                    bg='white'
                    onClick={() => handleSelected(item)}
                    // onKeyUp={() => setSelected(item)}
                  >
                    <Flex width='full' alignItems='center'>
                      <Flex mr='auto' alignItems='center'>
                        <Box as='span' fontSize='2xl' mr='2'>
                          {item.flag}
                        </Box>
                        <Box as='span' fontWeight='medium'>
                          {item.name}
                        </Box>
                      </Flex>
                      <Flex ml='auto'>
                        <Text color='revo.gray' fontWeight='medium'>
                          {f(item.value)}
                        </Text>
                      </Flex>
                    </Flex>
                  </Button>
                </Box>
              );
            })}
          </Box>
        )}
      </Box>
    </Box>
  );
}

function SearchCurrency() {
  return (
    <InputGroup my='1'>
      <InputLeftElement children={<Icon mt='2' ml='10' name='search' color='revo.gray' />} />
      <Input
        pl='16'
        height='12'
        borderRadius='none'
        border='none'
        type='search'
        placeholder='Search'
        _placeholder={{
          color: "revo.gray"
        }}
      />
    </InputGroup>
  );
}

function BorderBottom({open}: any) {
  return (
    <Box position='relative'>
      <motion.div
        style={{
          height: 2,
          width: 0,
          left: 0,
          top: 0,
          position: "absolute"
        }}
        initial='close'
        animate={open ? "open" : "close"}
        variants={{
          open: {
            zIndex: 9999,
            background: theme.colors.revo.blue,
            width: "100%",
            transition: {
              duration: 0.2
            }
          },
          close: {
            width: 0
          }
        }}
      />
      <Flex mt='3' height='2px' bg='revo.lightGray' />
    </Box>
  );
}
