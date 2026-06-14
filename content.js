// 标志，防止递归调用
let isProcessing = false;

function replaceWhiteSpaceStyles() {
  // 防止递归调用
  if (isProcessing) return;

  try {
    isProcessing = true;

    // 遍历所有 span 标签且 class="html-content-box" 的元素
    const allElements = document.querySelectorAll('span.html-content-box');

    // 限制处理的元素数量，避免性能问题
    const maxElements = 1000;
    const elementsToProcess = Array.from(allElements).slice(0, maxElements);

    elementsToProcess.forEach(element => {
      try {
        // 获取元素的当前样式
        const currentStyle = element.getAttribute('style') || '';

        // 检查是否已经包含 word-break:normal
        if (!currentStyle.includes('word-break:normal')) {
          // 在样式末尾添加 word-break:normal
          const newStyle = currentStyle ? currentStyle + ' word-break:normal;' : 'word-break:normal;';

          // 更新元素的样式
          element.setAttribute('style', newStyle);
        }
      } catch (e) {
        // 忽略错误，避免影响其他功能
      }
    });
  } catch (e) {
    // 忽略错误，避免影响其他功能
  } finally {
    isProcessing = false;
  }
}

function addCloneActivePageLink() {
  // 防止递归调用
  if (isProcessing) return;

  try {
    isProcessing = true;

    // 寻找目标链接元素
    const targetLinks = document.querySelectorAll('a.permission-manage2[href="javascript:;"]');

    // 遍历所有符合条件的链接
    for (const targetLink of targetLinks) {
      // 检查链接文本是否包含"权限设置"
      if (targetLink.textContent.includes('权限设置')) {
        // 检查是否已经存在导出签到按钮
        const existingExportBtn = targetLink.previousElementSibling;
        if (existingExportBtn && existingExportBtn.className === 'permission-manage2' && existingExportBtn.textContent === '导出签到') {
          break; // 已经存在导出签到按钮，跳过
        }

        // 创建导出签到按钮
        const exportBtn = document.createElement('a');
        exportBtn.href = 'javascript:;';
        exportBtn.className = 'permission-manage2';
        exportBtn.textContent = '导出签到';

        // 添加点击事件，按顺序点击所有导出签到数据链接
        exportBtn.addEventListener('click', function(e) {
          e.preventDefault();

          // 获取必要的参数
          const courseId = window.courseId;
          const classId = window.classId;
          const fid = window.fid || '4744';

          console.log('从 window 获取的参数:', { courseId, classId, fid });

          // 如果没有获取到必要参数，提示用户
          if (!courseId || !classId) {
            alert('无法获取课程ID或班级ID');
            return;
          }

          // 重新扫描页面上的所有签到活动
          const signinActivities = document.querySelectorAll('.list-name.icon-signin-g');
          const exportUrls = [];

          // 遍历所有签到活动，重新构建导出链接
          signinActivities.forEach(signinElement => {
            try {
              // 检查是否包含 drawLots class，如果包含则跳过
              if (signinElement.classList.contains('drawLots')) {
                return;
              }

              // 获取父级 li 元素，从中获取 activeid
              const liElement = signinElement.closest('li');
              if (!liElement) {
                return;
              }

              const activeId = liElement.getAttribute('activeid');
              if (!activeId) {
                return;
              }

              // 重新构建导出 URL
              const exportUrl = `https://mobilelearn.chaoxing.com/widget/pcpick/main/exportSingleData?courseId=${courseId}&classId=${classId}&activeId=${activeId}&appType=2&fid=${fid}`;
              exportUrls.push(exportUrl);
            } catch (e) {
              // 忽略错误，避免影响其他功能
            }
          });

          const confirmed = confirm(`即将导出 ${exportUrls.length} 个签到活动数据，是否继续？`);
            if (!confirmed) {
              return;
            }
          // 输出到 Console 并显示确认框
          if (exportUrls.length > 0) {
            console.log('即将导出签到活动数据：');
            exportUrls.forEach((url, index) => {
              setTimeout(() => {
                window.open(url, '_blank');
              }, index * 1000); // 每个链接间隔 1000ms
              console.log(`${index + 1}. ${url}`);
            });
          } else {
            alert('没有找到签到活动');
          }
        });

        // 在克隆活动按钮的左边插入导出签到按钮
        targetLink.parentNode.insertBefore(exportBtn, targetLink);

        // 检查是否已经存在克隆链接
        const existingCloneLink = targetLink.previousElementSibling;
        if (existingCloneLink && existingCloneLink.className === 'permission-manage2' && existingCloneLink.textContent === '克隆活动') {
          break; // 已经存在克隆链接，跳过
        }

        // 创建新的链接元素
        const cloneLink = document.createElement('a');
        cloneLink.href = 'javascript:;';
        cloneLink.className = 'permission-manage2';
        cloneLink.setAttribute('onclick', 'app.toCloneActivePage()');
        cloneLink.textContent = '克隆活动';

        // 在导出签到按钮的左边插入克隆链接
        targetLink.parentNode.insertBefore(cloneLink, exportBtn);

        // 跳出循环，只添加一次
        break;
      }
    }
  } catch (e) {
    // 忽略错误，避免影响其他功能
  } finally {
    isProcessing = false;
  }
}

function addToggleButton() {
  // 防止递归调用
  if (isProcessing) return;

  try {
    isProcessing = true;

    // 检查页面是否包含 class="wrapper-list" 的元素
    const wrapperListElements = document.querySelectorAll('.wrapper-list');
    if (wrapperListElements.length === 0) {
      return; // 页面中没有 wrapper-list 元素，直接返回
    }

    // 寻找 class 包含 "content"、"list"、"wrapper" 的 div 或 span 元素
    let targetContainer = null;

    // 尝试不同的 class 组合
    const classPatterns = [
      '.list-content-wrapper',
      '.activate-list'
    ];

    for (const pattern of classPatterns) {
      const elements = document.querySelectorAll(pattern);
      if (elements.length > 0) {
        targetContainer = elements[0];
        break;
      }
    }

    // 如果没有找到目标容器，回退到寻找 title-name 元素
    if (!targetContainer) {
      return;
    }

    // 检查是否已经添加了切换按钮
    if (targetContainer.querySelector('.toggle-wrapper-list-btn')) {
      return; // 已经添加了切换按钮，直接返回
    }

    // 创建切换链接
    const toggleLink = document.createElement('a');
    toggleLink.className = 'toggle-wrapper-list-btn';
    toggleLink.href = 'javascript:;';
    toggleLink.textContent = '收回全部';
    toggleLink.style.margin = '0 auto 10px';
    toggleLink.style.display = 'block';
    toggleLink.style.width = '100px';
    toggleLink.style.textAlign = 'center';
    toggleLink.style.color = '#3A8BFF';
    toggleLink.style.textDecoration = 'none';
    toggleLink.style.cursor = 'pointer';

    // 初始化所有 wrapper-list 元素为显示状态
    wrapperListElements.forEach(element => {
      try {
        element.style.display = 'block';
      } catch (e) {
        // 忽略错误，避免影响其他功能
      }
    });

    // 实现链接点击事件
    toggleLink.addEventListener('click', function(e) {
      e.preventDefault(); // 阻止默认链接行为
      // 切换链接文本
      if (toggleLink.textContent === '收回全部') {
        toggleLink.textContent = '展开全部';
        // 隐藏所有 wrapper-list 元素
        wrapperListElements.forEach(element => {
          try {
            element.style.display = 'none';
          } catch (e) {
            // 忽略错误，避免影响其他功能
          }
        });
      } else {
        toggleLink.textContent = '收回全部';
        // 显示所有 wrapper-list 元素
        wrapperListElements.forEach(element => {
          try {
            element.style.display = 'block';
          } catch (e) {
            // 忽略错误，避免影响其他功能
          }
        });
      }
    });

    // 在目标容器的第一个位置插入切换链接
    if (targetContainer.firstChild) {
      targetContainer.insertBefore(toggleLink, targetContainer.firstChild);
    } else {
      targetContainer.appendChild(toggleLink);
    }
  } catch (e) {
    // 忽略错误，避免影响其他功能
  } finally {
    isProcessing = false;
  }
}



function adjustEnglishTextInGroupTop() {
  // 防止递归调用
  if (isProcessing) return;

  try {
    isProcessing = true;

    // 寻找所有 class 包含 "groupTop" 和 "richtext" 的元素
    const groupTopElements = document.querySelectorAll('.groupTop.richtext, .richtext.groupTop');

    groupTopElements.forEach(element => {
      try {
        // 寻找元素中的所有 <p> 标签
        const paragraphs = element.querySelectorAll('p');

        paragraphs.forEach(p => {
          try {
            // 获取 <p> 标签的内容
            let content = p.innerHTML;

            // 处理英文字符，所有字母的 ASCII 码都减 5
            let processedContent = '';
            for (let i = 0; i < content.length; i++) {
              const char = content[i];
              const charCode = char.charCodeAt(0);

              // 处理大写字母
              if (charCode >= 65 && charCode <= 90) {
                let newCharCode = charCode - 5;
                if (newCharCode < 65) {
                  newCharCode += 26; // 循环到 Z
                }
                processedContent += String.fromCharCode(newCharCode);
              }
              // 处理小写字母
              else if (charCode >= 97 && charCode <= 122) {
                let newCharCode = charCode - 5;
                if (newCharCode < 97) {
                  newCharCode += 26; // 循环到 z
                }
                processedContent += String.fromCharCode(newCharCode);
              }
              // 其他字符保持不变
              else {
                processedContent += char;
              }
            }

            // 更新 <p> 标签的内容
            p.innerHTML = processedContent;
          } catch (e) {
            // 忽略错误，避免影响其他功能
          }
        });
      } catch (e) {
        // 忽略错误，避免影响其他功能
      }
    });
  } catch (e) {
    // 忽略错误，避免影响其他功能
  } finally {
    isProcessing = false;
  }
}

function addImageRotateButton() {
  // 防止递归调用
  if (isProcessing) return;

  try {
    isProcessing = true;

    // 寻找所有 class="ans-ued-img" 的图片
    const images = document.querySelectorAll('img.ans-ued-img');

    images.forEach(img => {
      try {
        // 检查是否已经添加了旋转按钮
        if (img.parentNode.querySelector('.rotate-img-btn-container')) {
          return; // 已经添加了旋转按钮，跳过
        }

        // 创建按钮容器
        const btnContainer = document.createElement('div');
        btnContainer.className = 'rotate-img-btn-container';
        btnContainer.style.marginBottom = '10px';
        btnContainer.style.display = 'flex';
        btnContainer.style.gap = '10px';
        btnContainer.style.justifyContent = 'center';

        // 初始化旋转角度
        let rotation = 0;

        // 顺时针旋转按钮 SVG 图标
        const clockwiseIcon = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5L12 9V4C16.42 4 20 7.58 20 12C20 16.42 16.42 20 12 20C7.58 20 4 16.42 4 12C4 11.45 4.45 11 5 11C5.55 11 6 11.45 6 12C6 15.31 8.69 18 12 18C15.31 18 18 15.31 18 12C18 8.69 15.31 6 12 6Z" fill="white"/>
          </svg>
        `;

        // 逆时针旋转按钮 SVG 图标
        const counterClockwiseIcon = `
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 4V1L8 5L12 9V4C7.58 4 4 7.58 4 12C4 16.42 7.58 20 12 20C16.42 20 20 16.42 20 12C20 11.45 19.55 11 19 11C18.45 11 18 11.45 18 12C18 15.31 15.31 18 12 18C8.69 18 6 15.31 6 12C6 8.69 8.69 6 12 6Z" fill="white"/>
          </svg>
        `;

        // 创建顺时针旋转按钮
        const clockwiseBtn = document.createElement('button');
        clockwiseBtn.className = 'rotate-img-btn';
        clockwiseBtn.innerHTML = clockwiseIcon;
        clockwiseBtn.style.padding = '8px';
        clockwiseBtn.style.backgroundColor = '#3A8BFF';
        clockwiseBtn.style.color = 'white';
        clockwiseBtn.style.border = 'none';
        clockwiseBtn.style.borderRadius = '4px';
        clockwiseBtn.style.cursor = 'pointer';
        clockwiseBtn.style.display = 'flex';
        clockwiseBtn.style.alignItems = 'center';
        clockwiseBtn.style.justifyContent = 'center';

        // 创建逆时针旋转按钮
        const counterClockwiseBtn = document.createElement('button');
        counterClockwiseBtn.className = 'rotate-img-btn';
        counterClockwiseBtn.innerHTML = counterClockwiseIcon;
        counterClockwiseBtn.style.padding = '8px';
        counterClockwiseBtn.style.backgroundColor = '#3A8BFF';
        counterClockwiseBtn.style.color = 'white';
        counterClockwiseBtn.style.border = 'none';
        counterClockwiseBtn.style.borderRadius = '4px';
        counterClockwiseBtn.style.cursor = 'pointer';
        counterClockwiseBtn.style.display = 'flex';
        counterClockwiseBtn.style.alignItems = 'center';
        counterClockwiseBtn.style.justifyContent = 'center';

        // 实现顺时针旋转按钮点击事件
        clockwiseBtn.addEventListener('click', function(e) {
          e.preventDefault();
          rotation -= 90;
          img.style.transform = `rotate(${rotation}deg)`;
          img.style.transition = 'transform 0.3s ease';
          // 解决旋转后图片太宽的问题 - 自适应缩放
          img.style.maxWidth = '100%';
          img.style.maxHeight = '80vh';
          img.style.height = 'auto';
          img.style.width = 'auto';
          img.style.objectFit = 'contain';
          // 确保图片容器正确显示
          const parent = img.parentNode;
          if (parent) {
            parent.style.display = 'block';
            parent.style.textAlign = 'center';
            parent.style.overflowX = 'hidden';
          }
        });

        // 实现逆时针旋转按钮点击事件
        counterClockwiseBtn.addEventListener('click', function(e) {
          e.preventDefault();
          rotation += 90;
          img.style.transform = `rotate(${rotation}deg)`;
          img.style.transition = 'transform 0.3s ease';
          // 解决旋转后图片太宽的问题 - 自适应缩放
          img.style.maxWidth = '100%';
          img.style.maxHeight = '80vh';
          img.style.height = 'auto';
          img.style.width = 'auto';
          img.style.objectFit = 'contain';
          // 确保图片容器正确显示
          const parent = img.parentNode;
          if (parent) {
            parent.style.display = 'block';
            parent.style.textAlign = 'center';
            parent.style.overflowX = 'hidden';
          }
        });

        // 将两个按钮添加到容器中
        btnContainer.appendChild(clockwiseBtn);
        btnContainer.appendChild(counterClockwiseBtn);

        // 在图片的上方插入按钮容器
        if (img.parentNode) {
          img.parentNode.insertBefore(btnContainer, img);
        }
      } catch (e) {
        // 忽略错误，避免影响其他功能
      }
    });
  } catch (e) {
    // 忽略错误，避免影响其他功能
  } finally {
    isProcessing = false;
  }
}

function addShowAllButton() {
  function tryAddButton(doc = document) {
    const pageDiv = doc.querySelector('.pageDiv#page');
    if (!pageDiv) {
      return false;
    }

    const toWorkLibrary = doc.querySelector('#toWorkLibrary');
    if (!toWorkLibrary) {
      return false;
    }

    if (toWorkLibrary.parentNode.querySelector('.show-all-btn')) {
      return true;
    }

    const showAllBtn = doc.createElement('a');
    showAllBtn.href = 'javascript:;';
    showAllBtn.className = 'btnBlue btn_92 fl fs14 show-all-btn';
    showAllBtn.textContent = '展示全部';

    showAllBtn.addEventListener('click', function() {
      const dd50 = pageDiv.querySelector('.pageShowNum .select-box dd:nth-child(3)');
      if (dd50) {
        dd50.click();
      }
    });

    toWorkLibrary.parentNode.insertBefore(showAllBtn, toWorkLibrary.nextSibling);
    return true;
  }

  setInterval(() => {
    tryAddButton();
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          tryAddButton(iframeDoc);
        }
      } catch (e) {
      }
    }
  }, 500);
}

function addUngradedButton() {
  function tryAddButton(doc = document) {
    const toWorkLibrary = doc.querySelector('#toWorkLibrary');
    if (!toWorkLibrary) {
      return false;
    }

    if (toWorkLibrary.parentNode.querySelector('.ungraded-btn')) {
      return true;
    }

    const ungradedBtn = doc.createElement('a');
    ungradedBtn.href = 'javascript:;';
    ungradedBtn.className = 'btnBlue btn_92 fl fs14 ungraded-btn';
    ungradedBtn.textContent = '未批改';
    ungradedBtn.style.marginLeft = '10px';

    ungradedBtn.addEventListener('click', function() {
      const emElements = doc.querySelectorAll('em.fs28');
      emElements.forEach(em => {
        em.style.minWidth = '40px';
        em.style.display = 'inline-block';
        em.style.textAlign = 'right';
        
        if (em.textContent.trim() === '0') {
          const li = em.closest('li');
          if (li) {
            li.style.display = li.style.display === 'none' ? '' : 'none';
          }
        }
      });
    });

    toWorkLibrary.parentNode.insertBefore(ungradedBtn, toWorkLibrary.nextSibling);
    return true;
  }

  setInterval(() => {
    tryAddButton();
    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          tryAddButton(iframeDoc);
        }
      } catch (e) {
      }
    }
  }, 500);
}

function addScoreButtonHandler() {
  // 检查URL是否匹配批阅页面
  const url = window.location.href;
  if (!url.includes('chaoxing.com/epub-h5') && !url.includes('objectIds=')) {
    return;
  }

  function setupScoreButtons(doc = document) {
    // 等待按钮加载完成
    const checkAndSetup = () => {
      const buttons = doc.querySelectorAll('.score-button');
      if (buttons.length === 0) {
        return false;
      }

      // 检查是否已经添加过60分按钮
      let hasSixtyButton = false;
      let zeroButton = null;
      let fullButton = null;
      
      buttons.forEach(button => {
        if (button.textContent.trim() === '60分') {
          hasSixtyButton = true;
        } else if (button.textContent.trim() === '0分') {
          zeroButton = button;
        } else if (button.textContent.trim() === '满分') {
          fullButton = button;
        }
      });

      // 如果还没有60分按钮，且有0分和满分按钮，则插入60分按钮
      if (!hasSixtyButton && zeroButton && fullButton) {
        // 创建60分按钮，复制0分按钮的所有属性
        const sixtyButton = doc.createElement('a');
        
        // 复制所有属性
        for (let i = 0; i < zeroButton.attributes.length; i++) {
          const attr = zeroButton.attributes[i];
          // 跳过data-has-score-handler属性
          if (attr.name !== 'data-has-score-handler') {
            sixtyButton.setAttribute(attr.name, attr.value);
          }
        }
        
        // 设置按钮文本和自定义属性
        sixtyButton.textContent = '60分';
        sixtyButton.dataset.hasScoreHandler = 'true';
        // 设置60分按钮为蓝底白字
        sixtyButton.style.backgroundColor = '#1890ff';
        sixtyButton.style.color = '#ffffff';
        sixtyButton.style.borderColor = '#1890ff';

        // 添加点击事件
        sixtyButton.addEventListener('click', function() {
          const scoreInput = doc.querySelector('#score input.el-input__inner');
          if (scoreInput) {
            scoreInput.value = '60';
            const event = new Event('input', { bubbles: true });
            scoreInput.dispatchEvent(event);
          }
        });

        // 在0分按钮后面插入60分按钮
        zeroButton.parentNode.insertBefore(sixtyButton, zeroButton.nextSibling);

        // 确保满分按钮保持绿底白字样式
        fullButton.style.backgroundColor = '#07c160';
        fullButton.style.color = '#ffffff';
        fullButton.style.borderColor = '#07c160';
      }

      return true;
    };

    // 立即检查一次
    if (!checkAndSetup()) {
      // 如果按钮还没加载，每500ms检查一次
      const interval = setInterval(() => {
        if (checkAndSetup()) {
          clearInterval(interval);
        }
      }, 500);
    }
  }

  // 监听iframe加载
  function monitorIframes() {
    setupScoreButtons();

    const iframes = document.querySelectorAll('iframe');
    for (const iframe of iframes) {
      try {
        const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
        if (iframeDoc) {
          setupScoreButtons(iframeDoc);
        }
      } catch (e) {
        // 忽略跨域错误
      }
    }
  }

  // 延迟执行，确保页面加载
  setTimeout(monitorIframes, 1000);
}

// 初始运行一次
setTimeout(() => {
  replaceWhiteSpaceStyles();
  addCloneActivePageLink();
  addToggleButton();
  addImageRotateButton();
  addShowAllButton();
  addUngradedButton();
  addScoreButtonHandler();
}, 1000); // 延迟执行，确保页面已加载