import * as React from "react";
import {
  Box,
  Flex,
  Text,
  AccordionItem,
  AccordionHeader,
  AccordionPanel,
  AccordionIcon,
  PseudoBox,
  Input,
  Button,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatHelpText,
  StatArrow
} from "@chakra-ui/core";
import "../node_modules/react-vis/dist/style.css";
import {getCurrenciesName, getCurrentRate, getHistoryData} from "./services/exchange-rates-api";
import {AppWrapper} from "./lib/components";
import {CurrencyChangeChart} from "./components";
// import {DaysAgo} from "./lib/types";

const SYMBOLS: any = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  JPY: "¥"
};

function randomInt(min: number, max: number) {
  // min and max included
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export default function App() {
  return (
    <AppWrapper>
      <CurrencyExchangeScreen />
    </AppWrapper>
  );
}

function CurrencyExchangeScreen() {
  const [currencies, setCurrencies] = React.useState<{[key: string]: number}[]>([]);
  const [fromCurrency, setFrom] = React.useState<string>("GBP");
  const [toCurrency, setTo] = React.useState<string>("EUR");
  const [chartData, setData] = React.useState<{x: number; y: number}[]>([]);
  const [currentRate, setCurrentRate] = React.useState<number | null>(null);
  const [daysAgo, setDaysAgo] = React.useState<10 | 7 | 30 | 90 | 180 | 360 | 1800>(30);
  const [pockets, setPockets] = React.useState<{[key: string]: number}>({
    USD: randomInt(0, 50000),
    EUR: randomInt(0, 50000),
    GBP: randomInt(0, 50000)
  });
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    let interval: any = null;
    if (fromCurrency && toCurrency) {
      (function foo() {
        getCurrentRate({fromCurrency, toCurrency}).then(setCurrentRate);
        interval = setTimeout(foo, 10000);
      })();
    }
    return () => interval && clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  React.useEffect(() => {
    if (fromCurrency && toCurrency && daysAgo) {
      getHistoryData({daysAgo, toCurrency, fromCurrency}).then(setData);
    }
  }, [fromCurrency, toCurrency, daysAgo]);

  React.useEffect(() => {
    getCurrenciesName().then(setCurrencies);
  }, []);

  return (
    <Flex minHeight='100vh' bg='white' alignItems='start'>
      <Flex
        p='16'
        px={[4, 4, "64"]}
        flexDirection='column'
        width={["full", "80%"]}
        bg='white'
        mx='auto'
        mt={[0, 20]}
        // boxShadow='2xl'
        overflow='hidden'
      >
        <Box mx='auto' textAlign='center' mb='20'>
          <Text fontSize='2xl'>Exchange mmoney</Text>
        </Box>
        <Flex flexDirection={["column", "row"]}>
          <Flex flexDir='column' width={["full", "50%"]} pr={[0, 6]}>
            <Box mb='12'>
              <SelectCurrency
                label='From'
                fromCurrency={fromCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box mb='12'>
              <AmountInput currency={fromCurrency} />
            </Box>
            <Box display={["none", "block"]}>
              <ButtonContinue />
            </Box>
          </Flex>
          <Flex flexDir='column' width={["full", "50%"]} pl={[0, 6]}>
            <Box mb='12'>
              <SelectCurrency
                label='To'
                fromCurrency={toCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box mb='12'>
              <AmountInput currency={toCurrency} />
            </Box>
            <Box display={["block", "none"]} mb='12'>
              <ButtonContinue />
            </Box>
            <Flex>
              <Box width='30%'>
                <Text fontSize='xs' color='gray.400' fontWeight='semibold'>
                  Current rate
                </Text>
                <Text fontWeight='semibold' fontSize='xl'>
                  {currentRate}
                </Text>
              </Box>
              <Box width='70%'>
                <Text fontSize='xs' color='gray.400' fontWeight='semibold'>
                  Today's change
                </Text>
                {chartData.length > 1 && <Text>{getTodaysChange(chartData)}</Text>}
              </Box>
            </Flex>
          </Flex>
        </Flex>
        <Box mt='12'>
          <SelectRange setDaysAgo={setDaysAgo} daysAgo={daysAgo} />
          <CurrencyChangeChart data={chartData} mt='6' />
        </Box>
      </Flex>
    </Flex>
  );
}

function getTodaysChange(chartData: any) {
  let change: any = chartData[chartData.length - 1].y - chartData[chartData.length - 2].y;
  let percent = (change * 100) / chartData[chartData.length - 1].y;

  let sign = Math.sign(change);

  return (
    <Stat>
      <StatHelpText
        fontWeight='semibold'
        fontSize='xl'
        color={sign === -1 ? "red.500" : "green.500"}
      >
        <StatArrow type={sign === -1 ? "decrease" : "increase"} />
        {Math.abs(change).toFixed(4)} ({percent.toFixed(2)} %)
      </StatHelpText>
    </Stat>
  );
}

function SelectRange({setDaysAgo, daysAgo}: any) {
  const tabs = [
    {name: "10D", value: 10, id: 0},
    {name: "1W", value: 7, id: 1},
    {name: "1M", value: 30, id: 2},
    {name: "3M", value: 90, id: 3},
    {name: "6M", value: 180, id: 4},
    {name: "1Y", value: 360, id: 5},
    {name: "5Y", value: 1800, id: 6}
  ];

  const currentIdx: {name: string; value: number; id: number} | {id: 0} = tabs.find(
    (t) => t.value === daysAgo
  ) || {id: 0};

  return (
    <Tabs index={currentIdx.id}>
      <TabList>
        {tabs.map(({value, name}) => {
          return (
            <Tab
              lineHeight='taller'
              color='gray.400'
              fontSize='sm'
              fontWeight='bold'
              _selected={{
                color: "gray.900",
                borderColor: "revo.red",
                boxShadow: "none",
                borderBottomWidth: "2px"
              }}
              onClick={() => setDaysAgo(value)}
            >
              {name}
            </Tab>
          );
        })}
      </TabList>
    </Tabs>
  );
}

function ButtonContinue() {
  return (
    <Button
      isDisabled
      type='submit'
      width='full'
      rounded='full'
      fontSize='sm'
      size='lg'
      bg='revo.red'
      color='white'
      _hover={{bg: "revo.red"}}
    >
      Continue
    </Button>
  );
}

function AmountInput({currency}: any) {
  return (
    <Flex alignItems='baseline'>
      <Box display={["none", "block"]}>
        <Text pr='1' lineHeight='none' fontSize='110px' fontWeight='lighter'>
          {SYMBOLS[currency]}
        </Text>
      </Box>
      <Input
        pl='0'
        zIndex={1}
        border='none'
        height='110px'
        fontSize='110px'
        fontWeight='lighter'
        placeholder='0'
        _focus={{
          boxShadow: "none"
        }}
        _placeholder={{
          color: "gray.300"
        }}
      />
    </Flex>
  );
}

function SelectCurrency({label, fromCurrency, currencies, setFrom}: any) {
  const ref = React.useRef();
  const [open, setOpen] = React.useState(false);
  useOnClickOutside(ref, () => setOpen(false));

  return (
    <Box>
      <Text fontSize='xs' color='gray.400' fontWeight='semibold'>
        {label}
      </Text>
      <AccordionItem
        zIndex={10}
        ref={ref}
        border='none'
        width='full'
        isOpen={open}
        onClick={() => setOpen(!open)}
        position='relative'
      >
        <DropdownHead fromCurrency={fromCurrency} />
        <DropdownBody currencies={currencies} setFrom={setFrom} />
      </AccordionItem>
    </Box>
  );
}

function DropdownHead({fromCurrency}: any) {
  return (
    <AccordionHeader
      pt='1'
      px='0'
      _focus={{
        boxShadow: "none"
      }}
      _hover={{
        bg: "none"
      }}
    >
      <Flex flexDirection='column' width='full'>
        <Flex width='full'>
          <Flex flex='1' alignItems='baseline'>
            <Text>{fromCurrency}</Text>
            <Text ml='auto' mr='2' color='gray.400' fontWeight='semibold'>
              50,239.62
            </Text>
          </Flex>
          <AccordionIcon ml='auto' mt='2px' color='gray.400' />
        </Flex>
        <Box mt='2' width='full' height='2px' bg='gray.200' />
      </Flex>
    </AccordionHeader>
  );
}

function DropdownBody({currencies, setFrom}: any) {
  return (
    <AccordionPanel
      overflowY='scroll'
      position='absolute'
      width='full'
      bg='white'
      boxShadow='2xl'
      height='64'
      zIndex={9999}
      px='0'
      py='0'
    >
      <Box as='ul' listStyleType='none'>
        {currencies.map((c: string) => {
          return (
            <PseudoBox
              onClick={() => setFrom(c)}
              onKeyUp={() => setFrom(c)}
              cursor='pointer'
              key={c}
              as='li'
              tabIndex={0}
              py='3'
              pl='6'
              _hover={{bg: "gray.900", color: "white"}}
              _focus={{bg: "gray.900", color: "white"}}
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
function useOnClickOutside(ref: any, handler: any) {
  React.useEffect(() => {
    const listener = (event: any) => {
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
