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
  StatArrow,
  useToast
} from "@chakra-ui/core";
import "../node_modules/react-vis/dist/style.css";
import {getCurrenciesName, getCurrentRate, getHistoryData} from "./services/exchange-rates-api";
import {AppWrapper} from "./lib/components";
import {CurrencyChangeChart, Dropdown} from "./components";
import numeral from "numeral";

function f(amount: number): string {
  return numeral(amount).format("0.00");
}

export default function App() {
  return (
    <AppWrapper>
      <CurrencyExchangeScreen />
    </AppWrapper>
  );
}
type Currency = {name: string; value: number; flag: string};
type Currencies = Currency[];
type DataPoint = {x: number; y: number};
type DataPoints = DataPoint[];

function CurrencyExchangeScreen() {
  const [currencies, setCurrencies] = React.useState<Currencies>([]);
  const [fromCurrency, setFrom] = React.useState<Currency>();
  const [toCurrency, setTo] = React.useState<Currency>();
  const [chartData, setData] = React.useState<DataPoints>([]);
  const [currentRate, setCurrentRate] = React.useState<number | null>(null);
  const [daysAgo, setDaysAgo] = React.useState<10 | 7 | 30 | 90 | 180 | 360 | 1800>(30);
  const [error, setError] = React.useState<string | null>(null);
  const [fromInputValue, setFromInputValue] = React.useState<string>("");
  const [toInputValue, setToInputValue] = React.useState<string>("");
  const [fromInputFocused, setInputFocused] = React.useState<boolean>(true);

  const toast = useToast();

  React.useEffect(() => {
    if (currentRate && fromInputValue) {
      if (fromInputFocused) {
        const fixedValue = (parseFloat(fromInputValue) * currentRate).toFixed(2);
        setToInputValue(fixedValue);
      }
    } else {
      setToInputValue("");
    }
  }, [currentRate, fromInputValue]);

  React.useEffect(() => {
    if (currentRate && toInputValue) {
      if (!fromInputFocused) {
        const fixedValue = (parseFloat(toInputValue) / currentRate).toFixed(2);
        setFromInputValue(fixedValue);
      }
    } else {
      setFromInputValue("");
    }
  }, [currentRate, toInputValue]);

  React.useEffect(() => {
    if (currencies.length > 0) {
      const from = currencies.find((c) => c.name === "GBP");
      const to = currencies.find((c) => c.name === "USD");
      to && setTo(to);
      from && setFrom(from);
    }
  }, [currencies]);

  React.useEffect(() => {
    // let interval: any = null;
    if (fromCurrency && toCurrency) {
      // (function foo() {
      getCurrentRate({fromCurrency, toCurrency}).then(setCurrentRate);
      //     interval = setTimeout(foo, 10000);
      //   })();
    }
    // return () => interval && clearInterval(interval);
  }, [fromCurrency, toCurrency]);

  React.useEffect(() => {
    if (fromCurrency && toCurrency && daysAgo) {
      getHistoryData({daysAgo, toCurrency, fromCurrency}).then(setData);
    }
  }, [fromCurrency, toCurrency, daysAgo]);

  React.useEffect(() => {
    getCurrenciesName().then(setCurrencies);
  }, []);

  React.useEffect(() => {
    toast({
      position: "bottom-left",
      title: "Account created.",
      description: "We've created your account for you.",
      status: "success",
      duration: 9000,
      isClosable: true,
      render: () => {
        return (
          <Box width='xs' p='4' m='4' boxShadow='2xl' borderRadius='lg' color='revo.gray'>
            <Text fontWeight='bold'>Please note.</Text>
            <Text>
              This app is for demonstration purpose only and pockets (GBP, USD, EUR) are randomly
              generated.
            </Text>
          </Box>
        );
      }
    });
  }, []);

  return (
    <Flex minHeight='100vh' bg='white' width='full' flexDirection='column'>
      <Flex
        // p='16'
        // px={[4, 4, "64"]}
        // bg='white'
        // boxShadow='2xl'
        // overflow='hidden'
        width={["full", "60%"]}
        flexDirection='column'
        mx='auto'
        mt={[0, 16]}
        px='4'
      >
        <Box mx='auto' textAlign='center' mb='20'>
          <Text fontSize='2xl'>Exchange money</Text>
        </Box>
        <Flex flexDirection={["column", "row"]}>
          <Flex flexDir='column' width={["full", "50%"]} pr={[0, 6]}>
            <Dropdown
              currencies={currencies}
              selected={fromCurrency}
              label='From'
              setSelected={setFrom}
            />
            <AmountInput
              my='16'
              label='From'
              fromInputFocused={fromInputFocused}
              setInputFocused={setInputFocused}
              currentRate={currentRate}
              currency={fromCurrency}
              inputValue={fromInputValue}
              setValue={setFromInputValue}
            />
            <Box display={["none", "block"]}>
              <ButtonContinue />
            </Box>
          </Flex>
          <Flex flexDir='column' width={["full", "50%"]} pl={[0, 6]}>
            <Dropdown
              currencies={currencies}
              selected={toCurrency}
              label='To'
              setSelected={setTo}
            />
            <AmountInput
              my='16'
              label='To'
              fromInputFocused={fromInputFocused}
              setInputFocused={setInputFocused}
              currentRate={currentRate}
              currency={toCurrency}
              inputValue={toInputValue}
              setValue={setToInputValue}
            />
            <Box display={["block", "none"]} mb='12'>
              <ButtonContinue />
            </Box>
            <ExchangeMetadata currentRate={currentRate} chartData={chartData} />
          </Flex>
        </Flex>
        {/* <Box mt='12'>
          <SelectRange setDaysAgo={setDaysAgo} daysAgo={daysAgo} />
          <CurrencyChangeChart data={chartData} mt='6' />
        </Box> */}
      </Flex>
    </Flex>
  );
}

function ExchangeMetadata({currentRate, chartData}: any) {
  return (
    <Flex>
      <Box width='30%'>
        <Text fontSize='xs' color='revo.gray' fontWeight='medium'>
          Current rate
        </Text>
        <Text fontWeight='medium' fontSize='xl'>
          {currentRate}
        </Text>
      </Box>
      <Box width='70%'>
        <Text fontSize='xs' color='revo.gray' fontWeight='medium'>
          Today's change
        </Text>
        {chartData.length > 1 && getTodaysChange(chartData)}
      </Box>
    </Flex>
  );
}

function getTodaysChange(chartData: any) {
  let change: any = chartData[chartData.length - 1].y - chartData[chartData.length - 2].y;
  let percent = (change * 100) / chartData[chartData.length - 1].y;

  let sign = Math.sign(change);

  return (
    <Stat>
      <StatHelpText fontWeight='medium' fontSize='xl' color={sign === -1 ? "red.500" : "green.500"}>
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

const SYMBOLS: any = {
  EUR: "€",
  GBP: "£",
  USD: "$",
  JPY: "¥"
};
function AmountInput({
  currency,
  inputValue,
  setValue,
  currentRate,
  label,
  fromInputFocused,
  setInputFocused,
  ...props
}: any) {
  return (
    <Flex alignItems='baseline' {...props}>
      <Box display={["none", "block"]} width='20'>
        <Text pr='1' lineHeight='none' fontSize='110px' fontWeight='lighter'>
          {currency && SYMBOLS[currency.name]}
        </Text>
      </Box>
      <Input
        onFocus={() => setInputFocused(label === "From" ? true : false)}
        value={!inputValue ? "" : inputValue}
        onChange={(e: any) => setValue(e.target.value)}
        type='number'
        pl='0'
        px={[0]}
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

// function SelectCurrency({label, fromCurrency, currencies, setFrom}: any) {
//   const ref = React.useRef();
//   const [open, setOpen] = React.useState(false);
//   useOnClickOutside(ref, () => setOpen(false));

//   return (
//     <Box>
//       <Text fontSize='xs' color='gray.400' fontWeight='semibold'>
//         {label}
//       </Text>
//       <AccordionItem
//         zIndex={10}
//         ref={ref}
//         border='none'
//         width='full'
//         isOpen={open}
//         onClick={() => setOpen(!open)}
//         position='relative'
//       >
//         <DropdownHead fromCurrency={fromCurrency} />
//         <DropdownBody currencies={currencies} setFrom={setFrom} />
//       </AccordionItem>
//     </Box>
//   );
// }
