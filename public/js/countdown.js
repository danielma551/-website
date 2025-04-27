// 工作周倒计时组件
document.addEventListener('DOMContentLoaded', function() {
  // 创建倒计时容器
  const countdownContainer = document.createElement('div');
  countdownContainer.id = 'workweek-countdown';
  countdownContainer.style.cssText = `
    position: fixed;
    bottom: 100px;
    right: 20px;
    width: 240px;
    background: rgba(255, 255, 255, 0.9);
    backdrop-filter: blur(5px);
    border-radius: 12px;
    padding: 16px;
    box-shadow: 0 4px 20px rgba(0, 0, 0, 0.15);
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
    color: #333;
    z-index: 2000;
    transition: all 0.3s ease;
  `;
  
  // 鼠标悬停效果
  countdownContainer.addEventListener('mouseenter', function() {
    this.style.transform = 'translateY(-5px)';
    this.style.boxShadow = '0 8px 30px rgba(0, 0, 0, 0.2)';
  });
  
  countdownContainer.addEventListener('mouseleave', function() {
    this.style.transform = 'translateY(0)';
    this.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.15)';
  });
  
  // 创建标题
  const title = document.createElement('h3');
  title.textContent = '距离周末还有';
  title.style.cssText = `
    margin: 0 0 12px 0;
    font-size: 16px;
    font-weight: 600;
    text-align: center;
  `;
  
  // 创建时间显示
  const timeDisplay = document.createElement('div');
  timeDisplay.style.cssText = `
    display: flex;
    justify-content: center;
    margin-bottom: 14px;
  `;
  
  // 创建时间单位显示
  const units = ['天', '小时', '分钟', '秒'];
  const timeElements = [];
  
  units.forEach((unit, index) => {
    const timeElement = document.createElement('div');
    timeElement.style.cssText = `
      text-align: center;
      margin: 0 5px;
    `;
    
    const value = document.createElement('div');
    value.className = `time-value time-${unit}`;
    value.textContent = '00';
    value.style.cssText = `
      font-size: 20px;
      font-weight: 700;
      color: #2D3748;
    `;
    
    const label = document.createElement('div');
    label.textContent = unit;
    label.style.cssText = `
      font-size: 12px;
      color: #718096;
      margin-top: 2px;
    `;
    
    timeElement.appendChild(value);
    timeElement.appendChild(label);
    timeDisplay.appendChild(timeElement);
    timeElements.push(value);
    
    // 添加冒号分隔符（除了最后一个单位）
    if (index < units.length - 1) {
      const separator = document.createElement('div');
      separator.textContent = ':';
      separator.style.cssText = `
        font-size: 20px;
        font-weight: 700;
        margin-top: 0px;
        color: #A0AEC0;
        align-self: flex-start;
      `;
      timeDisplay.appendChild(separator);
    }
  });
  
  // 创建进度条容器
  const progressContainer = document.createElement('div');
  progressContainer.style.cssText = `
    background-color: #E2E8F0;
    height: 8px;
    border-radius: 4px;
    overflow: hidden;
    margin-bottom: 10px;
  `;
  
  // 创建进度条
  const progressBar = document.createElement('div');
  progressBar.style.cssText = `
    height: 100%;
    width: 0%;
    background: linear-gradient(90deg, #4299E1, #667EEA);
    border-radius: 4px;
    transition: width 0.5s ease;
  `;
  progressContainer.appendChild(progressBar);
  
  // 创建进度文本
  const progressText = document.createElement('div');
  progressText.style.cssText = `
    font-size: 12px;
    color: #718096;
    text-align: center;
  `;
  
  // 组装组件
  countdownContainer.appendChild(title);
  countdownContainer.appendChild(timeDisplay);
  countdownContainer.appendChild(progressContainer);
  countdownContainer.appendChild(progressText);
  
  // 添加到页面
  document.body.appendChild(countdownContainer);
  
  // 倒计时逻辑
  function updateCountdown() {
    const now = new Date();
    const dayOfWeek = now.getDay(); // 0 是周日，6 是周六
    
    // 如果是周末，显示不同的消息
    if (dayOfWeek === 0 || dayOfWeek === 6) {
      title.textContent = '周末愉快！';
      timeElements[0].parentNode.parentNode.style.display = 'none';
      progressContainer.style.display = 'none';
      progressText.textContent = '享受休息时光';
      return;
    }
    
    // 计算本周五下午6点的时间
    const friday = new Date(now);
    friday.setDate(now.getDate() + (5 - dayOfWeek));
    friday.setHours(18, 0, 0, 0);
    
    // 计算剩余时间
    const diff = friday - now;
    if (diff <= 0) {
      title.textContent = '周末愉快！';
      timeElements[0].parentNode.parentNode.style.display = 'none';
      progressContainer.style.display = 'none';
      progressText.textContent = '享受休息时光';
      return;
    }
    
    // 计算天、小时、分钟和秒
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
    const seconds = Math.floor((diff % (1000 * 60)) / 1000);
    
    // 更新显示
    timeElements[0].textContent = String(days).padStart(2, '0');
    timeElements[1].textContent = String(hours).padStart(2, '0');
    timeElements[2].textContent = String(minutes).padStart(2, '0');
    timeElements[3].textContent = String(seconds).padStart(2, '0');
    
    // 计算周进度
    const weekStart = new Date(now);
    weekStart.setDate(now.getDate() - dayOfWeek + 1);
    weekStart.setHours(9, 0, 0, 0);
    
    const totalWeekTime = friday - weekStart;
    const elapsed = now - weekStart;
    const progressPercentage = Math.min(100, Math.max(0, (elapsed / totalWeekTime) * 100));
    
    progressBar.style.width = `${progressPercentage}%`;
    progressText.textContent = `本周已完成 ${progressPercentage.toFixed(1)}%`;
  }
  
  // 立即更新一次
  updateCountdown();
  
  // 每秒更新一次
  setInterval(updateCountdown, 1000);
  
  // 添加关闭按钮
  const closeButton = document.createElement('button');
  closeButton.innerHTML = '&times;';
  closeButton.style.cssText = `
    position: absolute;
    top: 5px;
    right: 10px;
    background: none;
    border: none;
    font-size: 18px;
    cursor: pointer;
    color: #A0AEC0;
    padding: 0;
    line-height: 1;
  `;
  
  closeButton.addEventListener('click', function() {
    countdownContainer.style.display = 'none';
    // 设置 cookie 以记住用户关闭了组件
    document.cookie = "hideCountdown=true; max-age=86400"; // 保存一天
  });
  
  countdownContainer.appendChild(closeButton);
  
  // 检查 cookie 是否指示隐藏倒计时
  if (document.cookie.indexOf('hideCountdown=true') !== -1) {
    countdownContainer.style.display = 'none';
  }
  
  console.log('工作周倒计时组件已加载');
}); 