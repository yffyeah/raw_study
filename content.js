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
        
        // 在目标链接的左边插入新链接
        targetLink.parentNode.insertBefore(cloneLink, targetLink);
        
        // 跳出循环，只添加一个克隆链接
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

function replaceI18NConfig() {
  // 防止递归调用
  if (isProcessing) return;
  
  try {
    isProcessing = true;
    
    // 从 i18n.txt 加载配置
    fetch(chrome.runtime.getURL('i18n.txt'))
      .then(response => response.text())
      .then(text => {
        try {
          // 提取 I18N_Config 对象
          const configMatch = text.match(/I18N_Config\s*=\s*({[\s\S]*?});/);
          if (configMatch && configMatch[1]) {
            // 在页面中执行脚本，替换 I18N_Config
            const script = document.createElement('script');
            script.textContent = `
              try {
                // 替换页面中的 I18N_Config
                if (typeof I18N_Config !== 'undefined') {
                  I18N_Config = ${configMatch[1]};
                }
              } catch (e) {
                console.error('替换 I18N_Config 失败:', e);
              }
            `;
            document.head.appendChild(script);
            document.head.removeChild(script);
          }
        } catch (e) {
          // 忽略错误，避免影响其他功能
        }
      })
      .catch(e => {
        // 忽略错误，避免影响其他功能
      });
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

// 初始运行一次
setTimeout(() => {
  replaceWhiteSpaceStyles();
  addCloneActivePageLink();
  addToggleButton();
  adjustEnglishTextInGroupTop();
  // replaceI18NConfig();
}, 1000); // 延迟执行，确保页面已加载