import * as React from "react";
import {
  ThemeProvider,
  CSSReset,
  Box,
  Flex,
  Text,
  Accordion,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  PseudoBox,
  Input,
  Button
} from "@chakra-ui/core";
import axios from "axios";

// import "./styles.css";
//https://api.exchangeratesapi.io/latest
//https://api.exchangeratesapi.io/latest?symbols=USD,GBP
//https://api.exchangeratesapi.io/latest?base=USD

export default function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <Screen />
    </ThemeProvider>
  );
}

function Screen() {
  const [currencies, setCurrencies] = React.useState({});
  const [fromCurrency, setFrom] = React.useState("EUR" || "");
  const [toCurrency, setTo] = React.useState("");
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    (async () => {
      const { data } = await axios("https://api.exchangeratesapi.io/latest");
      // console.log(data.rates);
      setCurrencies({ ...data.rates, [data.base]: "" });
    })();
  }, []);
  return (
    <Flex height="100vh" bg="#FAFAFA" alignItems="start">
      <Flex
        px={[4, 4, "400px"]}
        flexDirection="column"
        width={["full", "90%"]}
        bg="white"
        mx="auto"
        mt="20"
        boxShadow="2xl"
        overflow="hidden"
      >
        <Box mx="auto" textAlign="center" mb="20">
          <Text fontSize="2xl">Exchange mmoney</Text>
        </Box>
        <Flex>
          <Flex flexDir="column" width="50%" pr="4">
            <Box mb="12">
              <SelectCurrency
                fromCurrency={fromCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box zIndex={1} mb="12">
              <AmountInput />
            </Box>
            <Box>
              <Button
                width="full"
                rounded="full"
                fontSize="sm"
                size="md"
                bg="#EB008D"
                color="white"
              >
                Continue
              </Button>
            </Box>
          </Flex>
          <Flex flexDir="column" width="50%" pl="4">
            <Box mb="12">
              <SelectCurrency
                fromCurrency={fromCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box zIndex={1} mb="12">
              <AmountInput />
            </Box>
            <Box>
              <Button
                width="full"
                rounded="full"
                fontSize="sm"
                size="md"
                bg="#EB008D"
                color="white"
              >
                Continue
              </Button>
            </Box>
          </Flex>
        </Flex>
        <Flex height="64" />
      </Flex>
    </Flex>
  );
}

function AmountInput() {
  return (
    <Input
      zIndex={1}
      border="none"
      height="100px"
      fontSize="100px"
      fontWeight="lighter"
      placeholder="200"
      _focus={{
        boxShadow: "none"
      }}
    />
  );
}

function SelectCurrency({ fromCurrency, currencies, setFrom }) {
  const ref = React.useRef();
  const [open, setOpen] = React.useState(false);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <AccordionItem
      zIndex={10}
      ref={ref}
      border="none"
      width="full"
      isOpen={open}
      onClick={() => setOpen(!open)}
      position="relative"
    >
      <DropdownHead fromCurrency={fromCurrency} />
      <DropdownBody currencies={currencies} setFrom={setFrom} />
    </AccordionItem>
  );
}

function DropdownHead({ fromCurrency }) {
  return (
    <AccordionHeader
      px="0"
      _focus={{
        boxShadow: "none"
      }}
      _hover={{
        bg: "none"
      }}
    >
      <Flex flexDirection="column" width="full">
        <Flex width="full">
          <Flex flex="1" alignItems="baseline">
            <Text>{fromCurrency}</Text>
            <Text ml="auto" mr="2" color="gray.400" fontWeight="semibold">
              50,239.62
            </Text>
          </Flex>
          <AccordionIcon ml="auto" mt="2px" color="gray.400" />
        </Flex>
        <Box mt="2" width="full" height="2px" bg="gray.200" />
      </Flex>
    </AccordionHeader>
  );
}

function DropdownBody({ currencies, setFrom }) {
  return (
    <AccordionPanel
      overflowY="scroll"
      position="absolute"
      width="full"
      bg="white"
      boxShadow="2xl"
      height="64"
      zIndex={9999}
      px="0"
      py="0"
    >
      <Box as="ul" listStyleType="none">
        {Object.keys(currencies).map(c => {
          return (
            <PseudoBox
              onClick={() => setFrom(c)}
              onKeyUp={() => setFrom(c)}
              cursor="pointer"
              key={c}
              as="li"
              tabIndex={0}
              py="3"
              pl="6"
              _hover={{ bg: "gray.900", color: "white" }}
              _focus={{ bg: "gray.900", color: "white" }}
            >
              {c}
            </PseudoBox>
          );
        })}
      </Box>
    </AccordionPanel>
  );
}

// Hook
function useOnClickOutside(ref, handler) {
  React.useEffect(() => {
    const listener = event => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }

      handler(event);
    };

    document.addEventListener("mousedown", listener);
    document.addEventListener("touchstart", listener);

    return () => {
      document.removeEventListener("mousedown", listener);
      document.removeEventListener("touchstart", listener);
    };
  }, [ref, handler]); // ... passing it into this hook. // ... but to optimize you can wrap handler in useCallback before ... // ... callback/cleanup to run every render. It's not a big deal ... // ... function on every render that will cause this effect ... // It's worth noting that because passed in handler is a new ... // Add ref and handler to effect dependencies
}
