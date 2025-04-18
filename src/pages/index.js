import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Heading,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  useToast,
  StatGroup,
  Stat,
  StatLabel,
  StatNumber,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

export default function Home() {
  const [dailySalary, setDailySalary] = useState(1000);
  const [remittanceCount, setRemittanceCount] = useState(0);
  const [perRemittanceEarning, setPerRemittanceEarning] = useState(0);
  const [records, setRecords] = useState([]);
  const toast = useToast();

  // 在组件加载时从localStorage读取数据
  useEffect(() => {
    const savedSalary = localStorage.getItem('dailySalary');
    if (savedSalary) {
      setDailySalary(Number(savedSalary));
    }

    const savedRecords = localStorage.getItem('remittanceRecords');
    if (savedRecords) {
      setRecords(JSON.parse(savedRecords));
    }
  }, []);

  useEffect(() => {
    if (remittanceCount > 0) {
      setPerRemittanceEarning(dailySalary / remittanceCount);
    }
  }, [dailySalary, remittanceCount]);

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setRemittanceCount(count);
  };

  const handleSalaryChange = (e) => {
    const salary = parseInt(e.target.value) || 0;
    setDailySalary(salary);
    localStorage.setItem('dailySalary', salary.toString());
  };

  const handleSave = () => {
    if (remittanceCount <= 0) {
      toast({
        title: "错误",
        description: "请输入有效的汇款数量",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const newRecord = {
      date: new Date().toLocaleDateString(),
      count: remittanceCount,
      salary: dailySalary,
      perRemittance: perRemittanceEarning,
      timestamp: new Date().getTime()
    };

    const updatedRecords = [newRecord, ...records];
    setRecords(updatedRecords);
    localStorage.setItem('remittanceRecords', JSON.stringify(updatedRecords));

    setRemittanceCount(0); // 重置输入框

    toast({
      title: "已保存",
      description: `今日处理了 ${remittanceCount} 笔汇款，每笔收益 ${perRemittanceEarning.toFixed(2)} 元`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // 准备图表数据
  const last7Records = [...records].reverse().slice(0, 7).reverse();
  
  const chartData = {
    labels: last7Records.map(record => record.date),
    datasets: [
      {
        label: '汇款数量',
        data: last7Records.map(record => record.count),
        borderColor: 'rgb(75, 192, 192)',
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      }
    ],
  };

  const earningsData = {
    labels: last7Records.map(record => record.date),
    datasets: [
      {
        label: '每笔收益（元）',
        data: last7Records.map(record => record.perRemittance),
        backgroundColor: 'rgba(53, 162, 235, 0.5)',
      }
    ],
  };

  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '最近7天汇款数量趋势',
      },
    },
    scales: {
      y: {
        beginAtZero: true
      }
    }
  };

  const earningsOptions = {
    ...chartOptions,
    plugins: {
      ...chartOptions.plugins,
      title: {
        display: true,
        text: '最近7天每笔收益统计',
      },
    },
  };

  return (
    <Container maxW="container.md" py={10}>
      <VStack spacing={8}>
        <Heading>汇款工作统计</Heading>
        
        <Box w="100%" p={5} borderWidth={1} borderRadius="lg">
          <VStack spacing={4}>
            <HStack w="100%">
              <Text w="120px">日薪（元）：</Text>
              <Input 
                type="number" 
                value={dailySalary} 
                onChange={handleSalaryChange}
                placeholder="输入日薪"
              />
            </HStack>
            
            <HStack w="100%">
              <Text w="120px">汇款数量：</Text>
              <Input 
                type="number" 
                value={remittanceCount} 
                onChange={handleCountChange}
                placeholder="输入今日处理的汇款数量"
              />
            </HStack>
          </VStack>
        </Box>

        <StatGroup w="100%" borderWidth={1} borderRadius="lg" p={5}>
          <Stat>
            <StatLabel>每笔汇款收益</StatLabel>
            <StatNumber>{perRemittanceEarning.toFixed(2)} 元</StatNumber>
          </Stat>
          <Stat>
            <StatLabel>今日总收益</StatLabel>
            <StatNumber>{dailySalary} 元</StatNumber>
          </Stat>
        </StatGroup>

        <Button colorScheme="blue" onClick={handleSave}>
          保存记录
        </Button>

        {records.length > 0 && (
          <Box w="100%">
            <Tabs isFitted variant="enclosed">
              <TabList mb="1em">
                <Tab>数据图表</Tab>
                <Tab>历史记录</Tab>
              </TabList>
              <TabPanels>
                <TabPanel>
                  <VStack spacing={8}>
                    <Box w="100%" h="300px">
                      <Line options={chartOptions} data={chartData} />
                    </Box>
                    <Box w="100%" h="300px">
                      <Bar options={earningsOptions} data={earningsData} />
                    </Box>
                  </VStack>
                </TabPanel>
                <TabPanel>
                  <Box w="100%" overflowX="auto">
                    <Table variant="simple">
                      <Thead>
                        <Tr>
                          <Th>日期</Th>
                          <Th isNumeric>汇款数量</Th>
                          <Th isNumeric>日薪（元）</Th>
                          <Th isNumeric>每笔收益（元）</Th>
                        </Tr>
                      </Thead>
                      <Tbody>
                        {records.map((record) => (
                          <Tr key={record.timestamp}>
                            <Td>{record.date}</Td>
                            <Td isNumeric>{record.count}</Td>
                            <Td isNumeric>{record.salary}</Td>
                            <Td isNumeric>{record.perRemittance.toFixed(2)}</Td>
                          </Tr>
                        ))}
                      </Tbody>
                    </Table>
                  </Box>
                </TabPanel>
              </TabPanels>
            </Tabs>
          </Box>
        )}
      </VStack>
    </Container>
  );
} 