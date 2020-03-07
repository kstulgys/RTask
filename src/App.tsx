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
  Button,
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  InputGroup,
  InputLeftAddon,
  InputRightAddon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
  StatGroup
} from "@chakra-ui/core";
import axios from "axios";
import "../node_modules/react-vis/dist/style.css";
import {
  XYPlot,
  LineSeries,
  HorizontalGridLines,
  VerticalGridLines,
  XAxis,
  YAxis,
  makeVisFlexible,
  FlexibleXYPlot,
  FlexibleWidthXYPlot,
  Hint
} from "react-vis";
import moment from "moment";
import numeral from "numeral";
import {format, compareAsc} from "date-fns";
// import "./styles.css";
//https://api.exchangeratesapi.io/latest
//https://api.exchangeratesapi.io/latest?symbols=USD,GBP
//https://api.exchangeratesapi.io/latest?base=USD
//https://api.exchangeratesapi.io/history?start_at=2018-01-01&end_at=2018-09-01&symbols=USD,GBP
//https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=2020-03-01&symbols=AUD

interface Res {
  rates: Object;
}

interface Item {
  x: number;
  y: number;
  // yLabel: number;
}

function getTimestamp(date: string) {
  let array = date.split("-");
  let res: string = array[0] + "/" + array[1] + "/" + array[2];
  // console.log({res});
  let time = new Date(res).getTime();
  return time;
}

function CustomTooltipContent(props: any) {
  console.log({props});
  return null;
}

const numberFormatter = (item: any) => numeral(item).format("0,0");
const dateFormatter = (item: any) => {
  console.log({item});
  return moment(item).format("MMM DD");
};

function MyChart({data}: any) {
  const [hoveredNode, setHoveredNode] = React.useState<null | {x: number; y: number}>(null);

  return (
    <FlexibleWidthXYPlot height={200} onMouseLeave={() => setHoveredNode(null)}>
      <LineSeries
        data={data}
        animation
        onNearestXY={(value: any) => {
          console.log({value});
          setHoveredNode(value);
        }}
      />
      {hoveredNode && (
        <Hint value={hoveredNode}>
          <Text color='#EB008D'>{hoveredNode.y.toFixed(4)}</Text>
        </Hint>
      )}
    </FlexibleWidthXYPlot>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <CSSReset />
      <Screen />
    </ThemeProvider>
  );
}

const currentDate = format(new Date(), "yyyy-mm-dd");

function Screen() {
  const [currencies, setCurrencies] = React.useState({});
  const [fromCurrency, setFrom] = React.useState("USD");
  const [toCurrency, setTo] = React.useState("AUD");
  const [error, setError] = React.useState("");
  const [chartData, setData] = React.useState<Item[]>([]);
  const [currentRate, setCurrentRate] = React.useState("");
  // const [currentDate, _] = React.useState(() => format(new Date(), "yyyy-mm-dd"));

  React.useEffect(() => {
    (async () => {
      const {data} = await axios(
        `https://api.exchangeratesapi.io/latest?symbols=${toCurrency}&base=${fromCurrency}`
      );
      console.log({data});
      let res = data.rates[toCurrency].toFixed(4);
      setCurrentRate(res);
    })();
  }, [fromCurrency, toCurrency]);

  React.useEffect(() => {
    (async () => {
      const currentDate = format(new Date(), "yyyy-MM-dd");
      console.log({currentDate});
      const {data} = await axios.get<Res>(
        `https://api.exchangeratesapi.io/history?start_at=2020-01-01&end_at=${currentDate}&symbols=${toCurrency}&base=${fromCurrency}`
      );

      const formated = data.rates;
      console.log({formated});
      const arr: Item[] = Object.entries(formated).map(([key, value], i) => {
        return {x: getTimestamp(key), y: value[toCurrency]};
      });

      const sorted = arr.sort((a, b) => {
        return a.x - b.x;
      });
      setData(sorted);
    })();
  }, [fromCurrency, currentDate, toCurrency]);

  React.useEffect(() => {
    (async () => {
      const {data} = await axios(`https://api.exchangeratesapi.io/latest`);
      let all = {...data.rates, EUR: ""};
      setCurrencies(all);
    })();
  }, []);

  return (
    <Flex minHeight='100vh' bg='#FAFAFA' alignItems='start'>
      <Flex
        p='16'
        px={[4, 4, "300px"]}
        flexDirection='column'
        width={["full", "80%"]}
        bg='white'
        mx='auto'
        mt={[0, 20]}
        boxShadow='2xl'
        overflow='hidden'
      >
        <Box mx='auto' textAlign='center' mb='20'>
          <Text fontSize='2xl'>Exchange mmoney</Text>
        </Box>
        <Flex flexDirection={["column", "row"]}>
          <Flex flexDir='column' width={["full", "50%"]} pr={[0, 4]}>
            <Box mb='12'>
              <SelectCurrency
                label='From'
                fromCurrency={fromCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box zIndex={1} mb='12'>
              <AmountInput currency={fromCurrency} />
            </Box>
            <Box display={["none", "block"]}>
              <ButtonContinue />
            </Box>
          </Flex>
          <Flex flexDir='column' width={["full", "50%"]} pl={[0, 4]}>
            <Box mb='12'>
              <SelectCurrency
                label='To'
                fromCurrency={toCurrency}
                currencies={currencies}
                setFrom={setFrom}
              />
            </Box>

            <Box zIndex={1} mb='12'>
              <AmountInput />
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
          <SelectRange />
          <MyChart data={chartData} />
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

function SelectRange() {
  return (
    <Tabs>
      <TabList>
        <Tab
          lineHeight='taller'
          color='gray.400'
          fontSize='sm'
          fontWeight='bold'
          _selected={{
            color: "gray.900",
            borderColor: "#EB008D",
            boxShadow: "none",
            borderBottomWidth: "2px"
          }}
        >
          10d
        </Tab>
        <Tab
          lineHeight='taller'
          color='gray.400'
          fontSize='sm'
          fontWeight='bold'
          _selected={{
            color: "gray.900",
            borderColor: "#EB008D",
            boxShadow: "none",
            borderBottomWidth: "2px"
          }}
        >
          1W
        </Tab>
        {/* <Tab _focus={{boxShadow: "none"}}>1M</Tab>
        <Tab _focus={{boxShadow: "none"}}>3M</Tab>
        <Tab _focus={{boxShadow: "none"}}>6M</Tab>
        <Tab _focus={{boxShadow: "none"}}>1Y</Tab>
        <Tab _focus={{boxShadow: "none"}}>5Y</Tab> */}
      </TabList>

      <TabPanels>
        <TabPanel>
          <p>one!</p>
        </TabPanel>
        <TabPanel>
          <p>two!</p>
        </TabPanel>
        <TabPanel>
          <p>three!</p>
        </TabPanel>
      </TabPanels>
    </Tabs>
  );
}

function ButtonContinue() {
  return (
    <Button width='full' rounded='full' fontSize='sm' size='lg' bg='#EB008D' color='white'>
      Continue
    </Button>
  );
}

function AmountInput({currency}: any) {
  return (
    <Flex alignItems='baseline'>
      <Box display={["none", "block"]}>
        <Text width='12' fontWeight='bolder'>
          {currency}
        </Text>
      </Box>
      <Input
        pl='0'
        zIndex={1}
        border='none'
        height='100px'
        fontSize='100px'
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
        {Object.keys(currencies).map((c) => {
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
