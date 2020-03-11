import * as React from 'react';
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
  useToast,
} from '@chakra-ui/core';
// import '../node_modules/react-vis/dist/style.css';

// function SelectRange({setDaysAgo, daysAgo}: any) {
//   const tabs = [
//     {name: "10D", value: 10, id: 0},
//     {name: "1W", value: 7, id: 1},
//     {name: "1M", value: 30, id: 2},
//     {name: "3M", value: 90, id: 3},
//     {name: "6M", value: 180, id: 4},
//     {name: "1Y", value: 360, id: 5},
//     {name: "5Y", value: 1800, id: 6}
//   ];

//   const currentIdx: {name: string; value: number; id: number} | {id: 0} = tabs.find(
//     (t) => t.value === daysAgo
//   ) || {id: 0};

//   return (
//     <Tabs index={currentIdx.id}>
//       <TabList>
//         {tabs.map(({value, name}) => {
//           return (
//             <Tab
//               lineHeight='taller'
//               color='gray.400'
//               fontSize='sm'
//               fontWeight='bold'
//               _selected={{
//                 color: "gray.900",
//                 borderColor: "revo.red",
//                 boxShadow: "none",
//                 borderBottomWidth: "2px"
//               }}
//               onClick={() => setDaysAgo(value)}
//             >
//               {name}
//             </Tab>
//           );
//         })}
//       </TabList>
//     </Tabs>
//   );
// }
