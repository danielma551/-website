import { useState, useEffect } from 'react';
import React from 'react';
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
  Select,
  SimpleGrid,
  Center,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  PopoverHeader,
  PopoverCloseButton,
  Icon,
  Tooltip,
  Badge,
  Image,
  Flex,
  ChakraProvider,
  extendTheme,
  InputGroup,
  InputLeftElement
} from '@chakra-ui/react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip as ChartTooltip,
  Legend
} from 'chart.js';
import { Line, Bar } from 'react-chartjs-2';
import { CalendarIcon, RepeatIcon, CheckCircleIcon, TimeIcon, WarningIcon, StarIcon, ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';
import Head from 'next/head';
import Script from 'next/script';

// 注册 ChartJS 组件
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  ChartTooltip,
  Legend
);

// 定義主題
const theme = extendTheme({
  colors: {
    brand: {
      50: "#E6FFFA",
      100: "#B2F5EA",
      500: "#38B2AC",
      900: "#234E52",
    },
    coffee: {
      50: "#F5EDE7",
      100: "#E6D2C3",
      200: "#D7B79F",
      300: "#C89C7B",
      400: "#B98157",
      500: "#A96733",
      600: "#87522A",
      700: "#653E20",
      800: "#422915",
      900: "#21150B",
    }
  },
  fonts: {
    heading: 'Inter, sans-serif',
    body: 'Inter, sans-serif',
  },
  styles: {
    global: {
      body: {
        bg: "#F5EDE7",
        color: "gray.800",
      },
    },
  },
});

// 香港公众假期数据
const hkPublicHolidays2024 = [
  "2024-01-01", // 元旦
  "2024-02-10", // 农历年初一
  "2024-02-11", // 农历年初二
  "2024-02-12", // 农历年初三
  "2024-02-13", // 农历年初四
  "2024-03-29", // 耶稣受难节
  "2024-03-30", // 耶稣受难节翌日
  "2024-04-01", // 复活节星期一
  "2024-04-04", // 清明节
  "2024-05-01", // 劳动节
  "2024-05-15", // 佛诞
  "2024-06-10", // 端午节
  "2024-07-01", // 香港特别行政区成立纪念日
  "2024-09-17", // 中秋节
  "2024-10-01", // 国庆日
  "2024-10-17", // 重阳节
  "2024-12-25", // 圣诞节
  "2024-12-26", // 圣诞节翌日
];

const hkPublicHolidays2025 = [
  "2025-01-01", // 元旦
  "2025-01-29", // 农历年初一
  "2025-01-30", // 农历年初二
  "2025-01-31", // 农历年初三
  "2025-04-04", // 清明节
  "2025-04-18", // 耶稣受难节
  "2025-04-19", // 耶稣受难节翌日
  "2025-04-21", // 复活节星期一
  "2025-05-01", // 劳动节
  "2025-05-05", // 佛诞
  "2025-05-31", // 端午节
  "2025-07-01", // 香港特别行政区成立纪念日
  "2025-10-01", // 国庆日
  "2025-10-07", // 中秋节翌日
  "2025-10-29", // 重阳节
  "2025-12-25", // 圣诞节
  "2025-12-26", // 圣诞节后第一个周日
];

// 修改假期名称数据
const holidayNames = {
  // 2024年假期
  "2024-01-01": "元旦",
  "2024-02-10": "农历年初一",
  "2024-02-11": "农历年初二",
  "2024-02-12": "农历年初三",
  "2024-02-13": "农历年初四",
  "2024-03-29": "耶稣受难节",
  "2024-03-30": "耶稣受难节翌日",
  "2024-04-01": "复活节星期一",
  "2024-04-04": "清明节",
  "2024-05-01": "劳动节",
  "2024-05-15": "佛诞",
  "2024-06-10": "端午节",
  "2024-07-01": "香港特别行政区成立纪念日",
  "2024-09-17": "中秋节",
  "2024-10-01": "国庆日",
  "2024-10-17": "重阳节",
  "2024-12-25": "圣诞节",
  "2024-12-26": "圣诞节翌日",
  // 2025年假期
  "2025-01-01": "元旦",
  "2025-01-29": "农历年初一",
  "2025-01-30": "农历年初二",
  "2025-01-31": "农历年初三",
  "2025-04-04": "清明节",
  "2025-04-18": "耶稣受难节",
  "2025-04-19": "耶稣受难节翌日",
  "2025-04-21": "复活节星期一",
  "2025-05-01": "劳动节",
  "2025-05-05": "佛诞",
  "2025-05-31": "端午节",
  "2025-07-01": "香港特别行政区成立纪念日",
  "2025-10-01": "国庆日",
  "2025-10-07": "中秋节翌日",
  "2025-10-29": "重阳节",
  "2025-12-25": "圣诞节",
  "2025-12-26": "圣诞节后第一个周日"
};

// 添加一个辅助函数来格式化日期
const formatDate = (date) => {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// 添加動畫樣式
const AnimationStyles = () => (
  <style jsx global>{`
    @keyframes bounce {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-20px); }
    }
    
    @keyframes wiggle {
      0%, 100% { transform: rotate(0); }
      25% { transform: rotate(-5deg); }
      75% { transform: rotate(5deg); }
    }
    
    @keyframes float {
      0%, 100% { transform: translateY(0); }
      50% { transform: translateY(-15px); }
    }
    
    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }
    
    @keyframes steam {
      0%, 100% { opacity: 0.3; transform: translateY(0) scale(1); }
      50% { opacity: 0.5; transform: translateY(-10px) scale(1.2); }
    }
    
    .bounce-animation {
      animation: bounce 4s ease-in-out infinite;
    }
    
    .wiggle-animation {
      animation: wiggle 3s ease-in-out infinite;
    }
    
    .float-animation {
      animation: float 6s ease-in-out infinite;
    }
    
    .steam-animation {
      animation: steam 3s ease-in-out infinite;
    }
    
    .spin-animation {
      animation: spin 10s linear infinite;
    }
    
    .calendar-container {
      transition: all 0.3s ease;
    }
    
    .calendar-container:hover {
      transform: scale(1.02);
      box-shadow: 0px 8px 30px rgba(0, 0, 0, 0.15);
    }
  `}</style>
);

// 更新 TotoroIcon 組件
const TotoroIcon = ({ boxSize }) => (
  <Box width={boxSize} height={boxSize}>
    <svg viewBox="0 0 200 200" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M100 180C144.183 180 180 144.183 180 100C180 55.8172 144.183 20 100 20C55.8172 20 20 55.8172 20 100C20 144.183 55.8172 180 100 180Z" fill="#92908E" />
      <path d="M65 80C71.0751 80 76 75.0751 76 69C76 62.9249 71.0751 58 65 58C58.9249 58 54 62.9249 54 69C54 75.0751 58.9249 80 65 80Z" fill="white" />
      <path d="M68 69C69.6569 69 71 67.6569 71 66C71 64.3431 69.6569 63 68 63C66.3431 63 65 64.3431 65 66C65 67.6569 66.3431 69 68 69Z" fill="#333333" />
      <path d="M135 80C141.075 80 146 75.0751 146 69C146 62.9249 141.075 58 135 58C128.925 58 124 62.9249 124 69C124 75.0751 128.925 80 135 80Z" fill="white" />
      <path d="M132 69C133.657 69 135 67.6569 135 66C135 64.3431 133.657 63 132 63C130.343 63 129 64.3431 129 66C129 67.6569 130.343 69 132 69Z" fill="#333333" />
      <path d="M85 100L100 115L115 100" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
      <path d="M75 40L85 20" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
      <path d="M125 40L115 20" stroke="#333333" strokeWidth="3" strokeLinecap="round" />
      <path d="M65 135C75 155 125 155 135 135" fill="#FFFFFF" />
    </svg>
  </Box>
);

// Totoro Component
const Totoro = () => {
  return (
    <Box className="bounce-animation" position="absolute" top="20px" left="20px" zIndex="1" opacity="0.8">
      <TotoroIcon boxSize="150px" />
    </Box>
  );
};

// SmallTotoro Component
const SmallTotoro = () => {
  return (
    <Box className="wiggle-animation" position="absolute" bottom="20px" right="20px" zIndex="1" opacity="0.7">
      <TotoroIcon boxSize="80px" />
    </Box>
  );
};

// 添加草葉元素組件
const GrassLeaf = ({ bottom, left, rotation, height, delay = 0 }) => (
  <Box
    position="absolute"
    bottom={bottom}
    left={left}
    height={height}
    width="15px"
    borderRadius="0 100% 0 100%"
    bg="green.300"
    transform={`rotate(${rotation}deg)`}
    transformOrigin="bottom"
    opacity={0.7}
    className="wiggle-animation"
    style={{ animationDelay: `${delay}s` }}
    zIndex={1}
  />
);

// 添加煤灰精靈組件
const SootSprite = ({ top, left, size, delay = 0 }) => (
  <Box
    position="absolute"
    top={top}
    left={left}
    width={size}
    height={size}
    borderRadius="50%"
    bg="gray.800"
    className="float-animation"
    style={{ animationDelay: `${delay}s` }}
    opacity={0.6}
    zIndex={1}
  >
    <Box
      position="absolute"
      top="20%"
      left="20%"
      width="30%"
      height="30%"
      borderRadius="50%"
      bg="white"
      opacity={0.5}
    />
  </Box>
);

// 添加草葉元素
const GrassLeaves = () => (
  <>
    <GrassLeaf bottom="0" left="5%" rotation="15" height="100px" delay={0.5} />
    <GrassLeaf bottom="0" left="10%" rotation="-10" height="80px" delay={0.2} />
    <GrassLeaf bottom="0" left="15%" rotation="20" height="120px" delay={0.8} />
    <GrassLeaf bottom="0" left="75%" rotation="-15" height="90px" delay={0.3} />
    <GrassLeaf bottom="0" left="80%" rotation="10" height="110px" delay={0.7} />
    <GrassLeaf bottom="0" left="90%" rotation="-5" height="70px" delay={0.1} />
  </>
);

// 添加魔法球塵
const DustSprites = () => (
  <>
    <SootSprite top="20%" left="5%" size="10px" delay={0.5} />
    <SootSprite top="30%" left="15%" size="8px" delay={1.2} />
    <SootSprite top="15%" left="25%" size="12px" delay={0.8} />
    <SootSprite top="40%" left="80%" size="9px" delay={0.3} />
    <SootSprite top="25%" left="85%" size="11px" delay={1.5} />
    <SootSprite top="35%" left="90%" size="7px" delay={0.7} />
  </>
);

// 添加龍貓吉祥物
const TotoroFamily = () => (
  <>
    {/* 大龍貓 */}
    <Box
      position="absolute"
      bottom="30px"
      right="100px"
      className="bounce-animation"
      zIndex={1}
      cursor="pointer"
      _hover={{ transform: "scale(1.1)" }}
      transition="transform 0.3s"
    >
      <TotoroIcon boxSize="120px" />
    </Box>
    
    {/* 中龍貓 */}
    <Box
      position="absolute"
      bottom="20px"
      right="220px"
      className="float-animation"
      zIndex={1}
      cursor="pointer"
      _hover={{ transform: "scale(1.1)" }}
      transition="transform 0.3s"
      style={{ animationDelay: "0.5s" }}
    >
      <TotoroIcon boxSize="80px" />
    </Box>
    
    {/* 小龍貓 */}
    <Box
      position="absolute"
      bottom="15px"
      right="300px"
      className="wiggle-animation"
      zIndex={1}
      cursor="pointer"
      _hover={{ transform: "scale(1.1)" }}
      transition="transform 0.3s"
      style={{ animationDelay: "0.3s" }}
    >
      <TotoroIcon boxSize="50px" />
    </Box>
  </>
);

// 添加咖啡图标组件
const CoffeeIcon = ({ boxSize, color = "coffee.600" }) => (
  <Box width={boxSize} height={boxSize}>
    <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M18 8H19C21.2091 8 23 9.79086 23 12C23 14.2091 21.2091 16 19 16H18" 
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M2 8H18V17C18 19.2091 16.2091 21 14 21H6C3.79086 21 2 19.2091 2 17V8Z" 
        fill="currentColor" opacity="0.4"/>
      <path d="M6 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M10 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
      <path d="M14 1V4" stroke="currentColor" strokeWidth="2" strokeLinecap="round"/>
    </svg>
  </Box>
);

// 添加咖啡杯组件
const CoffeeCup = ({ position = "absolute", top, right, left, bottom, size = "60px", delay = 0 }) => (
  <Box
    position={position}
    top={top}
    right={right}
    left={left}
    bottom={bottom}
    width={size}
    height={size}
    zIndex={1}
    className="float-animation"
    style={{ animationDelay: `${delay}s` }}
  >
    <Box position="relative">
      <Box 
        position="absolute"
        top="-15px"
        left="50%"
        transform="translateX(-50%)"
        width="20px"
        height="8px"
        borderRadius="50%"
        bg="coffee.200"
        className="steam-animation"
        style={{ animationDelay: `${delay + 0.2}s` }}
      />
      <Box 
        position="absolute"
        top="-15px"
        left="35%"
        transform="translateX(-50%)"
        width="10px"
        height="6px"
        borderRadius="50%"
        bg="coffee.200"
        className="steam-animation"
        style={{ animationDelay: `${delay + 0.5}s` }}
      />
      <Box 
        position="absolute"
        top="-15px"
        left="65%"
        transform="translateX(-50%)"
        width="15px"
        height="7px"
        borderRadius="50%"
        bg="coffee.200"
        className="steam-animation"
        style={{ animationDelay: `${delay + 0.8}s` }}
      />
      <CoffeeIcon boxSize={size} color="coffee.600" />
    </Box>
  </Box>
);

// 添加咖啡组
const CoffeeElements = () => (
  <>
    <CoffeeCup top="15%" left="5%" size="40px" delay={0.3} />
    <CoffeeCup top="40%" left="10%" size="30px" delay={0.7} />
    <CoffeeCup top="25%" right="5%" size="50px" delay={0.5} />
    <CoffeeCup top="60%" right="8%" size="35px" delay={0.2} />
  </>
);

// 倒計時組件
const CountdownComponent = () => {
  const [timeLeft, setTimeLeft] = useState({
    days: '00',
    hours: '00',
    minutes: '00',
    seconds: '00'
  });
  const [progress, setProgress] = useState(0);
  const [isWeekend, setIsWeekend] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const dayOfWeek = now.getDay(); // 0 是周日，6 是周六
      
      // 如果是周末，顯示不同的消息
      if (dayOfWeek === 0 || dayOfWeek === 6) {
        setIsWeekend(true);
        return;
      }
      
      setIsWeekend(false);
      
      // 計算本週五下午6點的時間
      const friday = new Date(now);
      friday.setDate(now.getDate() + (5 - dayOfWeek));
      friday.setHours(18, 0, 0, 0);
      
      // 計算剩餘時間
      const diff = friday - now;
      if (diff <= 0) {
        setIsWeekend(true);
        return;
      }
      
      // 計算天、小時、分鐘和秒
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((diff % (1000 * 60)) / 1000);
      
      // 更新顯示
      setTimeLeft({
        days: String(days).padStart(2, '0'),
        hours: String(hours).padStart(2, '0'),
        minutes: String(minutes).padStart(2, '0'),
        seconds: String(seconds).padStart(2, '0')
      });
      
      // 計算週進度
      const weekStart = new Date(now);
      weekStart.setDate(now.getDate() - dayOfWeek + 1);
      weekStart.setHours(9, 0, 0, 0);
      
      const totalWeekTime = friday - weekStart;
      const elapsed = now - weekStart;
      const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalWeekTime) * 100));
      
      setProgress(progressPercentage);
    };
    
    // 立即更新一次
    updateCountdown();
    
    // 每秒更新一次
    const interval = setInterval(updateCountdown, 1000);
    
    // 清理函數
    return () => clearInterval(interval);
  }, []);

  // 如果用戶通過本地存儲選擇隱藏組件，則不顯示
  const [showCountdown, setShowCountdown] = useState(true);
  
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const hideCountdown = localStorage.getItem('hideCountdown') === 'true';
      setShowCountdown(!hideCountdown);
    }
  }, []);

  if (!showCountdown) return null;

  return (
    <Box
      position="fixed"
      bottom="100px"
      right="20px"
      width="240px"
      bg="rgba(255, 255, 255, 0.9)"
      backdropFilter="blur(5px)"
      borderRadius="12px"
      padding="16px"
      boxShadow="0 4px 20px rgba(0, 0, 0, 0.15)"
      color="#333"
      zIndex={2000}
      transition="all 0.3s ease"
      _hover={{
        transform: 'translateY(-5px)',
        boxShadow: '0 8px 30px rgba(0, 0, 0, 0.2)'
      }}
    >
      <Button
        position="absolute"
        top="5px"
        right="10px"
        bg="none"
        border="none"
        fontSize="18px"
        p="0"
        color="#A0AEC0"
        lineHeight="1"
        onClick={() => {
          setShowCountdown(false);
          localStorage.setItem('hideCountdown', 'true');
        }}
      >
        &times;
      </Button>
      
      <Heading as="h3" size="sm" mb="12px" textAlign="center">
        {isWeekend ? '周末愉快！' : '距離周末還有'}
      </Heading>
      
      {!isWeekend && (
        <HStack spacing={1} justify="center" mb="14px">
          {Object.entries(timeLeft).map(([unit, value], index, arr) => (
            <React.Fragment key={unit}>
              <VStack spacing={0} mx={1}>
                <Text fontSize="20px" fontWeight="700" color="#2D3748">
                  {value}
                </Text>
                <Text fontSize="12px" color="#718096">
                  {unit === 'days' ? '天' : 
                   unit === 'hours' ? '小時' : 
                   unit === 'minutes' ? '分鐘' : '秒'}
                </Text>
              </VStack>
              {index < arr.length - 1 && (
                <Text fontSize="20px" fontWeight="700" color="#A0AEC0" mt="-4px">
                  :
                </Text>
              )}
            </React.Fragment>
          ))}
        </HStack>
      )}
      
      {!isWeekend && (
        <Box bg="#E2E8F0" height="8px" borderRadius="4px" mb="10px" overflow="hidden">
          <Box 
            height="100%" 
            width={`${progress}%`} 
            bgGradient="linear(to-r, #4299E1, #667EEA)"
            borderRadius="4px"
            transition="width 0.5s ease"
          />
        </Box>
      )}
      
      <Text fontSize="12px" color="#718096" textAlign="center">
        {isWeekend ? '享受休息時光' : `本週已完成 ${progress.toFixed(1)}%`}
      </Text>
    </Box>
  );
};

export default function Home() {
  const [monthlySalary, setMonthlySalary] = useState(0);
  const [dailySalary, setDailySalary] = useState(1000);
  const [workType, setWorkType] = useState('remittance'); // 添加工作类型状态
  const [workCounts, setWorkCounts] = useState({
    remittance: 0,
    aml: 0,
    collectChgs: 0
  }); // 修改为多类型工作数量
  const [perItemEarning, setPerItemEarning] = useState({
    remittance: 0,
    aml: 0,
    collectChgs: 0
  }); // 每项工作的收益
  const [records, setRecords] = useState([]);
  const [timeRange, setTimeRange] = useState('7'); // 默认显示7天
  const [holidays, setHolidays] = useState([]);
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date()); // 添加选中日期状态
  
  const toast = useToast();

  // 在组件加载时从localStorage读取数据
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const savedMonthlySalary = localStorage.getItem('monthlySalary');
      if (savedMonthlySalary) {
        setMonthlySalary(Number(savedMonthlySalary));
      }

      const savedSalary = localStorage.getItem('dailySalary');
      if (savedSalary) {
        setDailySalary(Number(savedSalary));
      }

      const savedRecords = localStorage.getItem('remittanceRecords');
      if (savedRecords) {
        setRecords(JSON.parse(savedRecords));
      }

      const savedHolidays = localStorage.getItem('holidays');
      if (savedHolidays) {
        setHolidays(JSON.parse(savedHolidays));
      }
    }
  }, []);

  useEffect(() => {
    // 计算每种类型工作的单项收益
    const totalCount = workCounts.remittance + workCounts.aml + workCounts.collectChgs;
    if (totalCount > 0) {
      setPerItemEarning({
        remittance: workCounts.remittance > 0 ? dailySalary / totalCount : 0,
        aml: workCounts.aml > 0 ? dailySalary / totalCount : 0,
        collectChgs: workCounts.collectChgs > 0 ? dailySalary / totalCount : 0
      });
    }
  }, [dailySalary, workCounts]);

  // 计算当月工作日数（不包括周末和公众假期）
  const calculateWorkingDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const lastDay = new Date(year, month + 1, 0).getDate();
    let workingDays = 0;

    for (let day = 1; day <= lastDay; day++) {
      const date = new Date(year, month, day);
      const dateStr = formatDate(date);
      const isWeekend = date.getDay() === 0 || date.getDay() === 6;
      const isHoliday = hkPublicHolidays2024.includes(dateStr) || 
                       hkPublicHolidays2025.includes(dateStr) ||
                       holidays.includes(dateStr);

      if (!isWeekend && !isHoliday) {
        workingDays++;
      }
    }

    return workingDays;
  };

  // 当月薪变化时自动计算日薪
  const handleMonthlySalaryChange = (e) => {
    const monthly = parseInt(e.target.value) || 0;
    setMonthlySalary(monthly);
    localStorage.setItem('monthlySalary', monthly.toString());

    const workingDays = calculateWorkingDays();
    const daily = workingDays > 0 ? Math.round(monthly / workingDays) : 0;
    setDailySalary(daily);
    localStorage.setItem('dailySalary', daily.toString());
  };

  const handleCountChange = (e) => {
    const count = parseInt(e.target.value) || 0;
    setWorkCounts(prev => ({
      ...prev,
      [workType]: count
    }));
  };

  const handleSalaryChange = (e) => {
    const salary = parseInt(e.target.value) || 0;
    setDailySalary(salary);
    localStorage.setItem('dailySalary', salary.toString());
  };

  const handleSave = () => {
    const totalCount = workCounts.remittance + workCounts.aml + workCounts.collectChgs;
    if (totalCount <= 0) {
      toast({
        title: "错误",
        description: "请输入有效的工作数量",
        status: "error",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    // 使用当前选择的日期
    const newRecord = {
      date: selectedDate.toLocaleDateString(),
      counts: { ...workCounts },
      salary: dailySalary,
      perItemEarning: { ...perItemEarning },
      timestamp: selectedDate.getTime()
    };

    // 检查是否已经存在同一天的记录
    const existingRecordIndex = records.findIndex(
      record => new Date(record.date).toDateString() === selectedDate.toDateString()
    );

    let updatedRecords;
    if (existingRecordIndex !== -1) {
      // 更新现有记录
      updatedRecords = [...records];
      updatedRecords[existingRecordIndex] = newRecord;
    } else {
      // 添加新记录
      updatedRecords = [newRecord, ...records];
    }

    setRecords(updatedRecords);
    localStorage.setItem('remittanceRecords', JSON.stringify(updatedRecords));

    // 重置所有工作数量
    setWorkCounts({
      remittance: 0,
      aml: 0,
      collectChgs: 0
    });

    toast({
      title: "已保存",
      description: `今日工作统计：汇款 ${workCounts.remittance} 笔，AML ${workCounts.aml} 笔，收费处理 ${workCounts.collectChgs} 笔`,
      status: "success",
      duration: 3000,
      isClosable: true,
    });
  };

  // 根据选择的时间范围过滤数据
  const getFilteredRecords = () => {
    const now = new Date();
    const days = parseInt(timeRange);
    const cutoffDate = new Date(now.setDate(now.getDate() - days));
    
    return [...records].filter(record => {
      const recordDate = new Date(record.timestamp);
      return recordDate >= cutoffDate;
    }).reverse();
  };

  const filteredRecords = getFilteredRecords();
  
  const chartData = {
    labels: filteredRecords.map(record => record.date),
    datasets: [
      {
        label: '汇款数量',
        data: filteredRecords.map(record => record.counts?.remittance || 0),
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
        tension: 0.1
      },
      {
        label: 'AML数量',
        data: filteredRecords.map(record => record.counts?.aml || 0),
        borderColor: 'rgb(168, 85, 247)',
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
        tension: 0.1
      },
      {
        label: 'Collect Chgs数量',
        data: filteredRecords.map(record => record.counts?.collectChgs || 0),
        borderColor: 'rgb(249, 115, 22)',
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
        tension: 0.1
      }
    ],
  };

  const earningsData = {
    labels: filteredRecords.map(record => record.date),
    datasets: [
      {
        label: '汇款收益',
        data: filteredRecords.map(record => record.perItemEarning?.remittance || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.5)',
      },
      {
        label: 'AML收益',
        data: filteredRecords.map(record => record.perItemEarning?.aml || 0),
        backgroundColor: 'rgba(168, 85, 247, 0.5)',
      },
      {
        label: 'Collect Chgs收益',
        data: filteredRecords.map(record => record.perItemEarning?.collectChgs || 0),
        backgroundColor: 'rgba(249, 115, 22, 0.5)',
      }
    ],
  };

  // 修改统计数据计算
  const statsData = {
    totalCounts: {
      remittance: filteredRecords.reduce((sum, record) => sum + (record.counts?.remittance || 0), 0),
      aml: filteredRecords.reduce((sum, record) => sum + (record.counts?.aml || 0), 0),
      collectChgs: filteredRecords.reduce((sum, record) => sum + (record.counts?.collectChgs || 0), 0)
    },
    avgCounts: {
      remittance: Math.round(filteredRecords.reduce((sum, record) => sum + (record.counts?.remittance || 0), 0) / (filteredRecords.length || 1)),
      aml: Math.round(filteredRecords.reduce((sum, record) => sum + (record.counts?.aml || 0), 0) / (filteredRecords.length || 1)),
      collectChgs: Math.round(filteredRecords.reduce((sum, record) => sum + (record.counts?.collectChgs || 0), 0) / (filteredRecords.length || 1))
    },
    avgEarnings: {
      remittance: filteredRecords.reduce((sum, record) => sum + (record.perItemEarning?.remittance || 0), 0) / (filteredRecords.length || 1),
      aml: filteredRecords.reduce((sum, record) => sum + (record.perItemEarning?.aml || 0), 0) / (filteredRecords.length || 1),
      collectChgs: filteredRecords.reduce((sum, record) => sum + (record.perItemEarning?.collectChgs || 0), 0) / (filteredRecords.length || 1)
    }
  };

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '工作数量趋势',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' 笔';
          }
        }
      }
    }
  };

  const earningsOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
      },
      title: {
        display: true,
        text: '每笔收益统计',
        font: {
          size: 16
        }
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          callback: function(value) {
            return value + ' 元';
          }
        }
      }
    }
  };

  // 添加日期切换函数
  const handleDateChange = (increment) => {
    const newDate = new Date(selectedDate);
    newDate.setDate(selectedDate.getDate() + increment);
    setSelectedDate(newDate);
  };

  // 格式化显示日期
  const formatDisplayDate = (date) => {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekDays = ['日', '一', '二', '三', '四', '五', '六'];
    const weekDay = weekDays[date.getDay()];
    return `${year}年${month}月${day}日 星期${weekDay}`;
  };

  // 修改判断是否为假日的函数，使用传入的日期
  const isHoliday = (date) => {
    const dateStr = formatDate(date);
    const isWeekend = date.getDay() === 0 || date.getDay() === 6;
    return isWeekend || 
           hkPublicHolidays2024.includes(dateStr) || 
           hkPublicHolidays2025.includes(dateStr) ||
           holidays.includes(dateStr);
  };

  // 获取假期名称，使用传入的日期
  const getHolidayName = (date) => {
    const dateStr = formatDate(date);
    if (holidayNames[dateStr]) {
      return holidayNames[dateStr];
    }
    if (date.getDay() === 0) {
      return "周日";
    }
    if (date.getDay() === 6) {
      return "周六";
    }
    if (holidays.includes(dateStr)) {
      return "个人休假日";
    }
    return "";
  };

  // 修改生成月历数据函数
  const generateCalendarDays = () => {
    const year = currentMonth.getFullYear();
    const month = currentMonth.getMonth();
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const days = [];

    // 修改星期计算逻辑
    // 在中国/香港，周一是一周的第一天，所以需要调整
    let firstDayOfWeek = firstDay.getDay() || 7; // 如果是周日(0)，改为7
    firstDayOfWeek = firstDayOfWeek - 1; // 调整为周一为1的系统

    // 添加上个月的剩余天数
    for (let i = firstDayOfWeek - 1; i >= 0; i--) {
      const date = new Date(year, month, -i);
      const dateStr = formatDate(date);
      days.push({
        date: date,
        isCurrentMonth: false,
        isHoliday: holidays.includes(dateStr) || isHoliday(date),
        dateStr: dateStr
      });
    }

    // 添加当前月的天数
    for (let i = 1; i <= lastDay.getDate(); i++) {
      const date = new Date(year, month, i);
      const dateStr = formatDate(date);
      days.push({
        date: date,
        isCurrentMonth: true,
        isHoliday: holidays.includes(dateStr) || isHoliday(date),
        dateStr: dateStr
      });
    }

    // 添加下个月的开始几天以填满网格
    const remainingDays = 42 - days.length;
    for (let i = 1; i <= remainingDays; i++) {
      const date = new Date(year, month + 1, i);
      const dateStr = formatDate(date);
      days.push({
        date: date,
        isCurrentMonth: false,
        isHoliday: holidays.includes(dateStr) || isHoliday(date),
        dateStr: dateStr
      });
    }

    return days;
  };

  const handleDateClick = (date) => {
    const dateStr = formatDate(date);
    const newHolidays = holidays.includes(dateStr)
      ? holidays.filter(d => d !== dateStr)
      : [...holidays, dateStr];
    
    setHolidays(newHolidays);
    localStorage.setItem('holidays', JSON.stringify(newHolidays));
  };

  const handleMonthChange = (increment) => {
    setCurrentMonth(new Date(currentMonth.setMonth(currentMonth.getMonth() + increment)));
  };

  // 修改渲染日历组件
  const CalendarComponent = () => (
    <VStack spacing={2} align="stretch">
      <HStack w="100%" justifyContent="space-between" mb={2}>
        <Button size="sm" onClick={() => handleMonthChange(-1)} bg="coffee.100" color="coffee.700" _hover={{ bg: "coffee.200" }}>上个月</Button>
        <Heading size="sm" color="coffee.800">
          {currentMonth.getFullYear()}年{currentMonth.getMonth() + 1}月
        </Heading>
        <Button size="sm" onClick={() => handleMonthChange(1)} bg="coffee.100" color="coffee.700" _hover={{ bg: "coffee.200" }}>下个月</Button>
      </HStack>

      <SimpleGrid columns={7} spacing={1} w="100%">
        {['一', '二', '三', '四', '五', '六', '日'].map(day => (
          <Center key={day} py={1} fontSize="xs" bg="coffee.50" color="coffee.700">
            {day}
          </Center>
        ))}
        {generateCalendarDays().map((day, index) => {
          const holidayName = holidayNames[day.dateStr];
          return (
            <Tooltip key={index} label={holidayName || (day.isHoliday ? "个人休假日" : "")} isDisabled={!day.isHoliday}>
              <Center
                py={1}
                cursor="pointer"
                onClick={() => handleDateClick(day.date)}
                bg={day.isHoliday ? 'red.100' : day.isCurrentMonth ? 'white' : 'coffee.50'}
                opacity={day.isCurrentMonth ? 1 : 0.5}
                borderWidth={1}
                borderColor="coffee.100"
                fontSize="xs"
                _hover={{
                  bg: day.isHoliday ? 'red.200' : 'coffee.100'
                }}
              >
                {day.date.getDate()}
              </Center>
            </Tooltip>
          );
        })}
      </SimpleGrid>
    </VStack>
  );

  // 添加删除记录的处理函数
  const handleDeleteRecord = (timestamp) => {
    if (window.confirm('确定要删除这条记录吗？')) {
      const updatedRecords = records.filter(record => record.timestamp !== timestamp);
      setRecords(updatedRecords);
      localStorage.setItem('remittanceRecords', JSON.stringify(updatedRecords));
      
      toast({
        title: "已删除",
        description: "记录已成功删除",
        status: "success",
        duration: 2000,
        isClosable: true,
      });
    }
  };

  // 添加货币图标组件
  const CurrencyIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M11.8 10.9c-2.27-.59-3-1.2-3-2.15 0-1.09 1.01-1.85 2.7-1.85 1.78 0 2.44.85 2.5 2.1h2.21c-.07-1.72-1.12-3.3-3.21-3.81V3h-3v2.16c-1.94.42-3.5 1.68-3.5 3.61 0 2.31 1.91 3.46 4.7 4.13 2.5.6 3 1.48 3 2.41 0 .69-.49 1.79-2.7 1.79-2.06 0-2.87-.92-2.98-2.1h-2.2c.12 2.19 1.76 3.42 3.68 3.83V21h3v-2.15c1.95-.37 3.5-1.5 3.5-3.55 0-2.84-2.43-3.81-4.7-4.4z"
      />
    </Icon>
  );

  // 添加转账图标组件
  const TransferIcon = (props) => (
    <Icon viewBox="0 0 24 24" {...props}>
      <path
        fill="currentColor"
        d="M9.01 14H2v2h7.01v3L13 15l-3.99-4v3zm5.98-1v-3H22V8h-7.01V5L11 9l3.99 4z"
      />
    </Icon>
  );

  return (
    <ChakraProvider theme={theme}>
      <AnimationStyles />
      
      <Head>
        <title>工作統計工具</title>
        <meta name="description" content="跟踪每日工作量和收益統計" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      
      <Box
        minH="100vh"
        p={5}
        bgGradient="linear(to-b, coffee.50, blue.50)"
        position="relative"
        overflow="hidden"
        _before={{
          content: '""',
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "200px",
          background: "linear-gradient(to bottom, transparent, rgba(169,103,51,0.1))",
          zIndex: 0
        }}
      >
        <GrassLeaves />
        <DustSprites />
        <TotoroFamily />
        <CoffeeElements />
        
        {/* 添加倒計時組件 */}
        <CountdownComponent />
        
        <Box maxW="1200px" mx="auto" position="relative" zIndex={2}>
          {/* 日期导航 */}
          <HStack spacing={4} mb={4} justifyContent="center">
            <Button
              leftIcon={<ChevronLeftIcon />}
              onClick={() => handleDateChange(-1)}
              colorScheme="coffee"
              variant="outline"
            >
              前一天
            </Button>
            <Heading size="md">{formatDisplayDate(selectedDate)}</Heading>
            <Button
              rightIcon={<ChevronRightIcon />}
              onClick={() => handleDateChange(1)}
              colorScheme="coffee"
              variant="outline"
            >
              後一天
            </Button>
          </HStack>

          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={10}>
            <Box>
              {/* 工作数据录入部分 */}
              <Box
                p={6}
                rounded="lg"
                boxShadow="md"
                bg="white"
                mb={6}
                position="relative"
                overflow="hidden"
                borderTop="4px solid"
                borderColor="coffee.400"
              >
                <Box position="absolute" top="5px" right="5px" className={isHoliday(selectedDate) ? "bounce-animation" : ""}>
                  <TotoroIcon boxSize={12} />
                </Box>
                <Box position="absolute" top="5px" left="5px">
                  <CoffeeIcon boxSize={8} />
                </Box>
                
                <VStack spacing={6} mt={6}>
                  <HStack w="100%">
                    <Text w="150px" fontSize="lg" color="coffee.700">月薪（元）：</Text>
                    <InputGroup size="lg">
                      <InputLeftElement>
                        <CurrencyIcon ml={2} color="coffee.500" />
                      </InputLeftElement>
                      <Input 
                        type="number" 
                        value={monthlySalary} 
                        onChange={handleMonthlySalaryChange}
                        placeholder="输入月薪"
                        bg="white"
                        borderColor="coffee.200"
                        _hover={{ borderColor: "coffee.300" }}
                        _focus={{ borderColor: "coffee.400", boxShadow: "0 0 0 1px #B98157" }}
                      />
                    </InputGroup>
                  </HStack>

                  <HStack w="100%">
                    <Text w="150px" fontSize="lg" color="coffee.700">日薪（元）：</Text>
                    <InputGroup size="lg">
                      <InputLeftElement>
                        <CurrencyIcon ml={2} color="coffee.500" />
                      </InputLeftElement>
                      <Input 
                        type="number" 
                        value={dailySalary} 
                        onChange={handleSalaryChange}
                        placeholder="输入日薪"
                        isReadOnly={monthlySalary > 0}
                        bg="white"
                        borderColor="coffee.200"
                        _hover={{ borderColor: "coffee.300" }}
                        _focus={{ borderColor: "coffee.400", boxShadow: "0 0 0 1px #B98157" }}
                      />
                    </InputGroup>
                    <Badge colorScheme="brown" bg="coffee.100" color="coffee.700" fontSize="sm">
                      {monthlySalary > 0 ? `当月工作日：${calculateWorkingDays()}天` : ''}
                    </Badge>
                  </HStack>

                  <HStack w="100%" alignItems="flex-start">
                    <Text w="150px" fontSize="lg" pt={2} color="coffee.700">工作类型：</Text>
                    <VStack align="stretch" spacing={4} flex={1}>
                      <Select
                        value={workType}
                        onChange={(e) => setWorkType(e.target.value)}
                        size="lg"
                        icon={<RepeatIcon />}
                        bg="white"
                        borderColor="coffee.200"
                        _hover={{ borderColor: "coffee.300" }}
                        _focus={{ borderColor: "coffee.400", boxShadow: "0 0 0 1px #B98157" }}
                      >
                        <option value="remittance">汇款处理</option>
                        <option value="aml">AML处理</option>
                        <option value="collectChgs">Collect Chgs</option>
                      </Select>
                      <InputGroup size="lg">
                        <InputLeftElement>
                          <StarIcon ml={2} color="yellow.500" />
                        </InputLeftElement>
                        <Input 
                          type="number" 
                          value={workCounts[workType]} 
                          onChange={handleCountChange}
                          placeholder={`输入${workType === 'remittance' ? '汇款' : workType === 'aml' ? 'AML' : 'Collect Chgs'}处理数量`}
                          bg="white"
                          borderColor="coffee.200"
                          _hover={{ borderColor: "coffee.300" }}
                          _focus={{ borderColor: "coffee.400", boxShadow: "0 0 0 1px #B98157" }}
                        />
                      </InputGroup>
                      <HStack spacing={4} fontSize="sm" color="gray.600">
                        <Text>已输入：</Text>
                        <Badge colorScheme="green">汇款 {workCounts.remittance} 笔</Badge>
                        <Badge colorScheme="purple">AML {workCounts.aml} 笔</Badge>
                        <Badge colorScheme="orange">Collect Chgs {workCounts.collectChgs} 笔</Badge>
                      </HStack>
                    </VStack>
                  </HStack>
                </VStack>
              </Box>

              {isHoliday(selectedDate) ? (
                <Box 
                  w="100%" 
                  p={8} 
                  borderWidth={1} 
                  borderRadius="lg" 
                  bg="rgba(255, 229, 229, 0.8)"
                  backdropFilter="blur(5px)"
                  boxShadow="0 4px 15px rgba(0, 0, 0, 0.05)"
                  position="relative"
                  overflow="hidden"
                  _after={{
                    content: '""',
                    position: "absolute",
                    top: "50%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "400px",
                    height: "400px",
                    background: "radial-gradient(circle, rgba(255,0,0,0.05) 0%, rgba(255,255,255,0) 70%)",
                    pointerEvents: "none",
                  }}
                >
                  <VStack spacing={4}>
                    <Box 
                      animation="float 2s ease-in-out infinite"
                      sx={{
                        '@keyframes float': {
                          '0%': { transform: 'translateY(0)' },
                          '50%': { transform: 'translateY(-10px)' },
                          '100%': { transform: 'translateY(0)' }
                        }
                      }}
                    >
                      <WarningIcon boxSize={8} color="red.400" />
                    </Box>
                    <Text fontSize="xl" color="red.500">
                      {formatDisplayDate(selectedDate)}是{getHolidayName(selectedDate)}，休息日
                    </Text>
                    <Text fontSize="md" color="gray.600">
                      休息日无需统计工作量
                    </Text>
                  </VStack>
                </Box>
              ) : (
                <Box 
                  w="100%" 
                  p={8} 
                  borderWidth={1} 
                  borderRadius="lg" 
                  bg="rgba(255, 255, 255, 0.8)"
                  backdropFilter="blur(5px)"
                  boxShadow="0 4px 15px rgba(0, 0, 0, 0.05)"
                  position="relative"
                  _before={{
                    content: '""',
                    position: "absolute",
                    top: 0,
                    left: 0,
                    right: 0,
                    height: "4px",
                    background: "linear-gradient(90deg, #B98157, #D7B79F)",
                    borderTopRadius: "lg",
                  }}
                >
                  <VStack spacing={6}>
                    <HStack w="100%">
                      <Text w="150px" fontSize="lg" color="coffee.700">每项工作收益</Text>
                      <Text w="150px" fontSize="lg" color="coffee.700">今日总收益</Text>
                    </HStack>
                    <HStack w="100%">
                      <Text w="150px" fontSize="lg" color="coffee.700">汇款：{perItemEarning.remittance.toFixed(2)} 元</Text>
                      <Text w="150px" fontSize="lg" color="coffee.700">{dailySalary} 元</Text>
                    </HStack>
                    <HStack w="100%">
                      <Text w="150px" fontSize="lg" color="coffee.700">AML：{perItemEarning.aml.toFixed(2)} 元</Text>
                    </HStack>
                    <HStack w="100%">
                      <Text w="150px" fontSize="lg" color="coffee.700">Collect Chgs：{perItemEarning.collectChgs.toFixed(2)} 元</Text>
                    </HStack>
                  </VStack>
                </Box>
              )}

              <Button 
                colorScheme="coffee" 
                size="lg" 
                px={8} 
                onClick={handleSave}
                isDisabled={isHoliday(selectedDate)}
                leftIcon={<CoffeeIcon boxSize={6} />}
                _hover={{
                  transform: "translateY(-2px)",
                  boxShadow: "lg",
                }}
                transition="all 0.2s"
              >
                保存记录
              </Button>
            </Box>

            {/* Records 部分 */}
            <Box
              p={6}
              rounded="lg"
              boxShadow="md"
              bg="white"
              my={6}
              position="relative"
              borderTop="4px solid"
              borderColor="coffee.400"
            >
              <HStack mb={4}>
                <CoffeeIcon boxSize={6} />
                <Heading size="md" color="coffee.700">歷史記錄</Heading>
              </HStack>
              
              <Tabs isFitted variant="enclosed" colorScheme="coffee">
                <TabList mb="1em">
                  <Tab fontSize="lg" py={4} color="coffee.700" _selected={{ color: "coffee.800", bg: "coffee.50", borderColor: "coffee.200" }}>数据图表</Tab>
                  <Tab fontSize="lg" py={4} color="coffee.700" _selected={{ color: "coffee.800", bg: "coffee.50", borderColor: "coffee.200" }}>历史记录</Tab>
                </TabList>
                <TabPanels>
                  <TabPanel>
                    <VStack spacing={8}>
                      <HStack w="100%" justifyContent="space-between">
                        <Select 
                          value={timeRange} 
                          onChange={(e) => setTimeRange(e.target.value)}
                          w="200px"
                          size="lg"
                          borderColor="coffee.200"
                          _hover={{ borderColor: "coffee.300" }}
                          _focus={{ borderColor: "coffee.400", boxShadow: "0 0 0 1px #B98157" }}
                        >
                          <option value="7">最近7天</option>
                          <option value="14">最近14天</option>
                          <option value="30">最近30天</option>
                          <option value="90">最近3个月</option>
                        </Select>
                      </HStack>

                      <StatGroup 
                        w="100%" 
                        borderWidth={1} 
                        borderRadius="lg" 
                        p={8}
                        bg="rgba(255, 255, 255, 0.6)"
                        borderColor="coffee.100"
                      >
                        <Stat>
                          <StatLabel fontSize="lg" color="coffee.700">总工作量</StatLabel>
                          <StatNumber fontSize="md">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge colorScheme="green">汇款</Badge>
                                <Text>{statsData.totalCounts.remittance} 笔</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="purple">AML</Badge>
                                <Text>{statsData.totalCounts.aml} 笔</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="orange">Collect Chgs</Badge>
                                <Text>{statsData.totalCounts.collectChgs} 笔</Text>
                              </HStack>
                            </VStack>
                          </StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel fontSize="lg" color="coffee.700">日均工作量</StatLabel>
                          <StatNumber fontSize="md">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge colorScheme="green">汇款</Badge>
                                <Text>{statsData.avgCounts.remittance} 笔</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="purple">AML</Badge>
                                <Text>{statsData.avgCounts.aml} 笔</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="orange">Collect Chgs</Badge>
                                <Text>{statsData.avgCounts.collectChgs} 笔</Text>
                              </HStack>
                            </VStack>
                          </StatNumber>
                        </Stat>
                        <Stat>
                          <StatLabel fontSize="lg" color="coffee.700">平均每笔收益</StatLabel>
                          <StatNumber fontSize="md">
                            <VStack align="start" spacing={1}>
                              <HStack>
                                <Badge colorScheme="green">汇款</Badge>
                                <Text>{statsData.avgEarnings.remittance.toFixed(2)} 元</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="purple">AML</Badge>
                                <Text>{statsData.avgEarnings.aml.toFixed(2)} 元</Text>
                              </HStack>
                              <HStack>
                                <Badge colorScheme="orange">Collect Chgs</Badge>
                                <Text>{statsData.avgEarnings.collectChgs.toFixed(2)} 元</Text>
                              </HStack>
                            </VStack>
                          </StatNumber>
                        </Stat>
                      </StatGroup>

                      <Box w="100%" h="400px" p={4} bg="white" borderRadius="md">
                        <Line options={chartOptions} data={chartData} />
                      </Box>
                      <Box w="100%" h="400px" p={4} bg="white" borderRadius="md">
                        <Bar options={earningsOptions} data={earningsData} />
                      </Box>
                    </VStack>
                  </TabPanel>
                  <TabPanel>
                    <Box w="100%" overflowX="auto">
                      <Table variant="simple" size="lg">
                        <Thead>
                          <Tr bg="coffee.50">
                            <Th fontSize="md" color="coffee.700">日期</Th>
                            <Th isNumeric fontSize="md" color="coffee.700">汇款数量</Th>
                            <Th isNumeric fontSize="md" color="coffee.700">AML数量</Th>
                            <Th isNumeric fontSize="md" color="coffee.700">Collect Chgs数量</Th>
                            <Th isNumeric fontSize="md" color="coffee.700">日薪（元）</Th>
                            <Th isNumeric fontSize="md" color="coffee.700">每笔收益（元）</Th>
                            <Th fontSize="md" color="coffee.700">操作</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {records.map((record, index) => (
                            <Tr 
                              key={record.timestamp}
                              bg={index % 2 === 0 ? "white" : "coffee.50"}
                              _hover={{ bg: "coffee.100", transition: "all 0.3s" }}
                            >
                              <Td fontSize="md">{record.date}</Td>
                              <Td isNumeric fontSize="md">{record.counts?.remittance || 0}</Td>
                              <Td isNumeric fontSize="md">{record.counts?.aml || 0}</Td>
                              <Td isNumeric fontSize="md">{record.counts?.collectChgs || 0}</Td>
                              <Td isNumeric fontSize="md">{record.salary}</Td>
                              <Td isNumeric fontSize="md">
                                <VStack align="end" spacing={0}>
                                  <Text>汇款：{record.perItemEarning?.remittance?.toFixed(2) || '0.00'}</Text>
                                  <Text>AML：{record.perItemEarning?.aml?.toFixed(2) || '0.00'}</Text>
                                  <Text>Collect Chgs：{record.perItemEarning?.collectChgs?.toFixed(2) || '0.00'}</Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Button
                                  colorScheme="red"
                                  size="sm"
                                  onClick={() => handleDeleteRecord(record.timestamp)}
                                  opacity={0.8}
                                  _hover={{ opacity: 1 }}
                                >
                                  删除
                                </Button>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>
                  </TabPanel>
                </TabPanels>
              </Tabs>
            </Box>
          </SimpleGrid>

          {/* Calendar 部分 */}
          <Box 
            position="fixed" 
            top="20px" 
            right="20px" 
            width="280px"
            zIndex={10}
            bg="white"
            p={4}
            rounded="lg"
            boxShadow="lg"
            display={{ base: "none", lg: "block" }}
            borderWidth="1px"
            borderColor="coffee.200"
            className="calendar-container"
          >
            <VStack spacing={2} mb={2} align="center">
              <HStack>
                <CoffeeIcon boxSize={6} className="wiggle-animation" />
                <Heading size="sm" color="coffee.700">日曆</Heading>
              </HStack>
              <CalendarComponent />
              <Text fontSize="xs" color="gray.600">
                点击日期可以标记/取消标记为休息日
              </Text>
              <Text fontSize="xs" color="coffee.500">
                鼠标悬停可查看假期名称
              </Text>
              <Text fontSize="xs" color="coffee.600" fontStyle="italic" mt={2}>
                ☕ 每天一杯咖啡，工作效率加倍
              </Text>
            </VStack>
          </Box>
        </Box>
      </Box>
    </ChakraProvider>
  );
} 