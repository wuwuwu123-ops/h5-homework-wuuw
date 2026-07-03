function goToPage(url) {
    window.location.href = url;
}

function goBack() {
    const currentPath = window.location.pathname;
    const currentPage = currentPath.split('/').pop();
    const pageMap = {
        'materials.html': '../index.html',
        'process-pen.html': 'materials.html',
        'prep-brush.html': 'process-pen.html',
        'bind-brush.html': 'prep-brush.html',
        'trim-brush.html': 'bind-brush.html',
        'complete.html': 'trim-brush.html',
        'drawing.html': 'complete.html'
    };
    
    const target = pageMap[currentPage];
    if (target) {
        window.location.href = target;
    } else {
        window.history.back();
    }
}

let selectedMaterials = [];
let isMaterialProcessing = false;

function resetMaterials() {
    selectedMaterials = [];
    document.querySelectorAll('.material-card').forEach(card => {
        card.classList.remove('selected');
    });
    updateProgress();
    checkMaterialsComplete();
}

function selectMaterial(material) {
    if (isMaterialProcessing) return;
    isMaterialProcessing = true;
    
    const card = document.querySelector(`[data-material="${material}"]`);
    if (!card) {
        isMaterialProcessing = false;
        return;
    }
    
    if (selectedMaterials.includes(material)) {
        selectedMaterials = selectedMaterials.filter(m => m !== material);
        card.classList.remove('selected');
    } else {
        selectedMaterials.push(material);
        card.classList.add('selected');
        card.style.transform = 'scale(1.05)';
        setTimeout(() => card.style.transform = 'scale(1)', 200);
    }
    
    updateProgress();
    checkMaterialsComplete();
    
    setTimeout(() => isMaterialProcessing = false, 100);
}

function updateProgress() {
    const progressBar = document.querySelector('.progress-fill');
    if (!progressBar) return;
    
    const totalMaterials = 4;
    const progress = (selectedMaterials.length / totalMaterials) * 100;
    progressBar.style.width = `${progress}%`;
}

function checkMaterialsComplete() {
    const nextBtn = document.querySelector('.next-btn');
    const hint = document.querySelector('.interaction-hint');
    
    if (selectedMaterials.length === 4) {
        if (hint) {
            hint.innerHTML = '✓ 所有材料已准备就绪！点击箭头继续';
            hint.style.color = '#4CAF50';
        }
        if (nextBtn) {
            nextBtn.disabled = false;
            nextBtn.style.opacity = '1';
            nextBtn.style.cursor = 'pointer';
        }
    } else {
        if (hint) {
            hint.innerHTML = `请选择制作毛笔所需的材料（已选 ${selectedMaterials.length}/4）`;
            hint.style.color = '#b8860b';
        }
        if (nextBtn) {
            nextBtn.disabled = true;
            nextBtn.style.opacity = '0.5';
            nextBtn.style.cursor = 'not-allowed';
        }
    }
}

let currentStep = 0;
let isProcessing = false;
let isStepComplete = false;
const steps = [
    { action: 'cut', text: '切割竹杆', hint: '点击竹杆进行切割' },
    { action: 'drill', text: '钻孔', hint: '点击竹杆顶部钻孔' },
    { action: 'smooth', text: '打磨抛光', hint: '滑动手指打磨竹杆' },
    { action: 'carve', text: '雕刻装饰', hint: '点击竹杆雕刻花纹' }
];

function initStep() {
    updateStep();
    const progressBar = document.querySelector('.progress-fill');
    if (progressBar) {
        progressBar.style.width = '25%';
    }
}

function nextStep() {
    if (isProcessing || isStepComplete) return;
    isProcessing = true;
    
    const craftItem = document.querySelector('.craft-item');
    const stepText = document.querySelector('.step-text');
    const hint = document.querySelector('.interaction-hint');
    const progressBar = document.querySelector('.progress-fill');
    const workspace = document.querySelector('.workspace');
    
    currentStep++;
    
    if (currentStep < steps.length) {
        updateStep();
        
        if (progressBar) {
            const progress = ((currentStep + 1) / steps.length) * 100;
            progressBar.style.width = `${progress}%`;
        }
        
        if (craftItem) {
            craftItem.classList.add('animate');
            setTimeout(() => {
                craftItem.classList.remove('animate');
                isProcessing = false;
            }, 800);
        } else {
            isProcessing = false;
        }
    } else {
        isStepComplete = true;
        
        if (workspace) {
            workspace.style.pointerEvents = 'none';
        }
        
        if (hint) {
            hint.textContent = '✓ 笔杆处理完成！';
            hint.style.color = '#4CAF50';
        }
        
        if (craftItem) {
            craftItem.classList.add('animate');
        }
        
        setTimeout(() => goToPage('prep-brush.html'), 1500);
    }
}

function updateStep() {
    const stepText = document.querySelector('.step-text');
    const hint = document.querySelector('.interaction-hint');
    
    if (stepText) {
        stepText.textContent = steps[currentStep].text;
    }
    if (hint) {
        hint.textContent = steps[currentStep].hint;
    }
}

let brushProgress = 0;
let isBrushProcessing = false;

function processBrush() {
    if (isBrushProcessing) return;
    isBrushProcessing = true;
    
    brushProgress++;
    
    const craftItem = document.querySelector('.craft-item');
    const progressBar = document.querySelector('.progress-fill');
    const hint = document.querySelector('.interaction-hint');
    const workspace = document.querySelector('.workspace');
    
    if (craftItem) {
        craftItem.classList.add('animate');
        setTimeout(() => craftItem.classList.remove('animate'), 500);
    }
    
    if (progressBar) {
        progressBar.style.width = `${(brushProgress / 5) * 100}%`;
    }
    
    if (brushProgress >= 5) {
        if (workspace) {
            workspace.style.pointerEvents = 'none';
        }
        if (hint) {
            hint.textContent = '✓ 笔头准备完成！';
            hint.style.color = '#4CAF50';
        }
        setTimeout(() => goToPage('bind-brush.html'), 1500);
    } else {
        setTimeout(() => isBrushProcessing = false, 600);
    }
}

let bindProgress = 0;
let isBindProcessing = false;

function bindBrush() {
    if (isBindProcessing) return;
    isBindProcessing = true;
    
    bindProgress++;
    
    const craftItem = document.querySelector('.craft-item');
    const progressBar = document.querySelector('.progress-fill');
    const hint = document.querySelector('.interaction-hint');
    const workspace = document.querySelector('.workspace');
    
    if (craftItem) {
        craftItem.style.transform = `rotate(${bindProgress * 30}deg)`;
    }
    
    if (progressBar) {
        progressBar.style.width = `${(bindProgress / 4) * 100}%`;
    }
    
    if (bindProgress >= 4) {
        if (workspace) {
            workspace.style.pointerEvents = 'none';
        }
        if (hint) {
            hint.textContent = '✓ 绑制完成！';
            hint.style.color = '#4CAF50';
        }
        setTimeout(() => goToPage('trim-brush.html'), 1500);
    } else {
        setTimeout(() => isBindProcessing = false, 600);
    }
}

let trimProgress = 0;
let isTrimProcessing = false;

function trimBrush() {
    if (isTrimProcessing) return;
    isTrimProcessing = true;
    
    trimProgress++;
    
    const craftItem = document.querySelector('.craft-item');
    const progressBar = document.querySelector('.progress-fill');
    const hint = document.querySelector('.interaction-hint');
    const workspace = document.querySelector('.workspace');
    
    if (craftItem) {
        craftItem.classList.add('animate');
        setTimeout(() => craftItem.classList.remove('animate'), 500);
    }
    
    if (progressBar) {
        progressBar.style.width = `${(trimProgress / 3) * 100}%`;
    }
    
    if (trimProgress >= 3) {
        if (workspace) {
            workspace.style.pointerEvents = 'none';
        }
        if (hint) {
            hint.textContent = '✓ 修整完成！毛笔制作成功！';
            hint.style.color = '#4CAF50';
        }
        setTimeout(() => goToPage('complete.html'), 2000);
    } else {
        setTimeout(() => isTrimProcessing = false, 600);
    }
}

let canvas, ctx;
let isDrawing = false;
let lastX = 0;
let lastY = 0;
let brushSize = 5;

function initDrawing() {
    canvas = document.getElementById('drawingCanvas');
    if (!canvas) return;
    
    ctx = canvas.getContext('2d');
    
    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    
    canvas.addEventListener('mousedown', startDrawing);
    canvas.addEventListener('mousemove', draw);
    canvas.addEventListener('mouseup', stopDrawing);
    canvas.addEventListener('mouseout', stopDrawing);
    
    canvas.addEventListener('touchstart', handleTouchStart);
    canvas.addEventListener('touchmove', handleTouchMove);
    canvas.addEventListener('touchend', stopDrawing);
}

function resizeCanvas() {
    const container = canvas.parentElement;
    canvas.width = container.clientWidth - 40;
    canvas.height = 300;
    
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function startDrawing(e) {
    isDrawing = true;
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function handleTouchStart(e) {
    e.preventDefault();
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    lastX = touch.clientX - rect.left;
    lastY = touch.clientY - rect.top;
    isDrawing = true;
}

function handleTouchMove(e) {
    e.preventDefault();
    if (!isDrawing) return;
    
    const touch = e.touches[0];
    const rect = canvas.getBoundingClientRect();
    const x = touch.clientX - rect.left;
    const y = touch.clientY - rect.top;
    
    drawLine(lastX, lastY, x, y);
    [lastX, lastY] = [x, y];
}

function draw(e) {
    if (!isDrawing) return;
    
    drawLine(lastX, lastY, e.offsetX, e.offsetY);
    [lastX, lastY] = [e.offsetX, e.offsetY];
}

function drawLine(x1, y1, x2, y2) {
    ctx.beginPath();
    ctx.strokeStyle = '#1a1a1a';
    ctx.lineWidth = brushSize;
    ctx.lineCap = 'round';
    ctx.lineJoin = 'round';
    ctx.moveTo(x1, y1);
    ctx.lineTo(x2, y2);
    ctx.stroke();
}

function stopDrawing() {
    isDrawing = false;
}

function clearCanvas() {
    if (!canvas || !ctx) return;
    ctx.fillStyle = '#f5f5dc';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
}

function setBrushSize(size) {
    brushSize = size;
    document.querySelectorAll('.tool-btn').forEach(btn => btn.classList.remove('active'));
    event.target.classList.add('active');
}

function initDrag(id) {
    const el = document.getElementById(id);
    if (!el) return;
    
    // 检查是否是第四页的梳子或水刀，如果是则让专门的代码处理
    if (document.getElementById('friction-zone-indicator')) {
        return;
    }
    
    const handle = document.getElementById(id + '-handle');
    const dragTarget = handle || el;
    
    let isDragging = false;
    let startX, startY;
    let originalLeft = 0, originalTop = 0;
    let isPositioned = false;
    
    // 确保元素使用绝对定位
    function ensurePositioned() {
        if (!isPositioned) {
            const rect = el.getBoundingClientRect();
            el.style.position = 'fixed';
            el.style.left = rect.left + 'px';
            el.style.top = rect.top + 'px';
            el.style.transform = el.style.transform.replace(/translate\([^)]+\)/, '');
            isPositioned = true;
        }
    }
    
    function handlePointerMove(e) {
        if (!isDragging) return;
        const dx = e.clientX - startX;
        const dy = e.clientY - startY;
        el.style.left = (originalLeft + dx) + 'px';
        el.style.top = (originalTop + dy) + 'px';
    }
    
    function handlePointerUp() {
        if (isDragging) {
            isDragging = false;
            if (handle) {
                handle.style.cursor = 'grab';
            } else {
                el.style.cursor = 'grab';
            }
            el.style.zIndex = '100';
            
            // 恢复原始样式
            el.style.transition = 'transform 0.3s ease-out';
            if (id === 'shuidao-container') {
                el.style.position = '';
                el.style.left = '';
                el.style.top = '';
                el.style.transform = 'translate(calc(-50% + 300px), -50%) scale(0.1875)';
            } else if (id === 'shuzi-container') {
                el.style.position = '';
                el.style.left = '';
                el.style.top = '';
                el.style.transform = 'translate(calc(-50% + 200px), calc(-50% - 10px)) scale(0.3125)';
            }
            isPositioned = false;
        }
        document.removeEventListener('pointermove', handlePointerMove);
        document.removeEventListener('pointerup', handlePointerUp);
        document.removeEventListener('pointercancel', handlePointerUp);
    }
    
    dragTarget.addEventListener('pointerdown', (e) => {
        isDragging = true;
        if (handle) {
            handle.style.cursor = 'grabbing';
        } else {
            el.style.cursor = 'grabbing';
        }
        el.style.zIndex = '200';
        startX = e.clientX;
        startY = e.clientY;
        
        // 获取当前位置并切换到绝对定位
        const rect = el.getBoundingClientRect();
        originalLeft = rect.left;
        originalTop = rect.top;
        ensurePositioned();
        el.style.transition = 'none';
        el.style.transform = 'rotate(-30deg) scale(' + (id === 'shuidao-container' ? '0.1875' : '0.3125') + ')';
        
        document.addEventListener('pointermove', handlePointerMove);
        document.addEventListener('pointerup', handlePointerUp);
        document.addEventListener('pointercancel', handlePointerUp);
        
        dragTarget.setPointerCapture(e.pointerId);
        e.stopPropagation();
    });
}

function initCompleteDrag() {
    const stack = document.querySelector('.complete-maojian-stack');
    const maojian1 = document.querySelector('.complete-maojian-1');
    const maojian2 = document.querySelector('.complete-maojian-2');
    const maojian3 = document.querySelector('.complete-maojian-3');
    const swipeIndicator = document.querySelector('.swipe-indicator');
    const jiaoshui = document.querySelector('.complete-jiaoshui');
    const mohao = document.querySelector('.complete-mohao');
    const mohaobi = document.querySelector('.complete-mohaobi');
    const mohaokou = document.querySelector('.complete-mohaokou');
    const mohaoInteractionIndicator = document.querySelector('.mohao-interaction-indicator');
    const finalNextContainer = document.querySelector('.final-next-container');
    const interactionHint = document.getElementById('complete-hint');
    const hintText = document.getElementById('complete-hint-text');
    if (!stack || !maojian1 || !maojian2 || !maojian3) return;

    function showHint(text) {
        if (hintText && interactionHint) {
            hintText.textContent = text;
            interactionHint.classList.add('visible');
        }
    }

    function hideHint() {
        if (interactionHint) {
            interactionHint.classList.remove('visible');
        }
    }

    showHint('解开毛尖上的绳子');

    let isDragging = false;
    let isUnlocked = false;
    let dragStartX, dragStartY;
    let swipeStartX, swipeStartY;
    let isStartInSwipeZone = false;
    // 胶水交互相关变量
    let jiaoshuiInteractionCount = 0;
    let lastY = 0;
    let isMovingUp = false;
    let hasChangedDirection = false;
    const originalTransform = 'translate(-50%, -50%) translateX(-200px) translateY(-100px) rotate(-90deg)';

    // 辅助函数：从事件中获取坐标点
    function getPointFromEvent(e) {
        if (e.touches && e.touches.length > 0) {
            return e.touches[0];
        } else if (e.changedTouches && e.changedTouches.length > 0) {
            return e.changedTouches[0];
        }
        return e;
    }

    function handleDragMove(e) {
        if (!isDragging || !isUnlocked) return;

        const point = getPointFromEvent(e);
        const dx = point.clientX - dragStartX;
        const dy = point.clientY - dragStartY;

        const newTransform = `translate(-50%, -50%) translateX(${-200 + dx}px) translateY(${-100 + dy}px) rotate(-90deg)`;
        maojian1.style.transform = newTransform;
        maojian2.style.transform = newTransform;
        maojian3.style.transform = newTransform;

        // 检查胶水交互 - 只有当 jiaoshui 存在时才执行
        if (jiaoshui && jiaoshuiInteractionCount < 2) {
            const jiaoshuiRect = jiaoshui.getBoundingClientRect();
            // 检查是否在胶水图片中间
            const maojianCenterX = point.clientX;
            const maojianCenterY = point.clientY;
            const jiaoshuiCenterX = jiaoshuiRect.left + jiaoshuiRect.width / 2;
            const jiaoshuiCenterY = jiaoshuiRect.top + jiaoshuiRect.height / 2;
            
            const distanceX = Math.abs(maojianCenterX - jiaoshuiCenterX);
            const distanceY = Math.abs(maojianCenterY - jiaoshuiCenterY);
            
            // 在胶水图片中间范围内（30像素范围内）
            if (distanceX < jiaoshuiRect.width / 2 && distanceY < 30) {
                // 检测上下滑动
                if (lastY !== 0) {
                    const movingUpCurrent = point.clientY < lastY;
                    
                    // 如果方向改变了
                    if (movingUpCurrent !== isMovingUp) {
                        hasChangedDirection = true;
                        isMovingUp = movingUpCurrent;
                        // 每改变一次方向就增加计数（算一次滑动）
                        jiaoshuiInteractionCount++;
                        
                        // 如果滑动够两次了，就隐藏毛尖2
                        if (jiaoshuiInteractionCount >= 2) {
                        maojian2.style.transition = 'opacity 0.3s ease-out';
                        maojian2.style.opacity = '0';
                        showHint('将毛尖和笔杆连接');
                    }
                    }
                }
                lastY = point.clientY;
            }
        }
        if (e.cancelable) e.preventDefault();
    }

    function handleDragEnd(e) {
        if (isDragging) {
            isDragging = false;
            
            // 检查是否满足条件：毛尖2已经隐藏，并且毛尖任意部分进入了提示区域内
            let shouldTriggerNextStep = false;
            if (jiaoshuiInteractionCount >= 2 && mohaoInteractionIndicator) {
                const maojianRect = maojian3.getBoundingClientRect();
                const indicatorRect = mohaoInteractionIndicator.getBoundingClientRect();
                
                // 检查两个矩形是否有重叠（任意部分进入即可）
                if (!(maojianRect.right < indicatorRect.left || 
                      maojianRect.left > indicatorRect.right || 
                      maojianRect.bottom < indicatorRect.top || 
                      maojianRect.top > indicatorRect.bottom)) {
                    shouldTriggerNextStep = true;
                }
            }
            
            if (shouldTriggerNextStep) {
                // 直接消失，不回到原位
                maojian3.style.transition = 'none';
                maojian3.style.opacity = '0';
                // 隐藏mohao和mohaokou
                if (mohao) {
                    mohao.style.transition = 'none';
                    mohao.style.opacity = '0';
                }
                if (mohaokou) {
                    mohaokou.style.transition = 'none';
                    mohaokou.style.opacity = '0';
                }
                // 显示mohaobi并向中间移动
                if (mohaobi) {
                    mohaobi.style.transition = 'opacity 0.3s ease-out, transform 1s ease-out';
                    mohaobi.style.opacity = '1';
                    // 去掉左右位移，向上移动60像素，让它更接近屏幕中间
                    mohaobi.style.transform = 'translate(-50%, -50%) translateY(-10px) rotate(180deg)';
                    
                    // 监听动画结束事件
                    mohaobi.addEventListener('transitionend', function handler(e) {
                        if (e.propertyName === 'transform' && finalNextContainer) {
                            // 动画结束后显示按钮和文字
                            finalNextContainer.classList.add('visible');
                            // 隐藏提示
                            hideHint();
                            // 移除监听器，避免重复触发
                            mohaobi.removeEventListener('transitionend', handler);
                        }
                    });
                }
                // 让胶水渐渐消失
                if (jiaoshui) {
                    jiaoshui.style.opacity = '0';
                }
            } else {
                // 不满足条件，回到原位
                stack.style.cursor = isUnlocked ? 'grab' : 'default';
                maojian1.style.transition = 'transform 0.3s ease-out';
                maojian2.style.transition = 'transform 0.3s ease-out';
                maojian3.style.transition = 'transform 0.3s ease-out';
                maojian1.style.transform = originalTransform;
                maojian2.style.transform = originalTransform;
                maojian3.style.transform = originalTransform;
            }
        }
        document.removeEventListener('pointermove', handleDragMove);
        document.removeEventListener('mousemove', handleDragMove);
        document.removeEventListener('touchmove', handleDragMove);
        document.removeEventListener('pointermove', handleSwipeMove);
        document.removeEventListener('mousemove', handleSwipeMove);
        document.removeEventListener('touchmove', handleSwipeMove);
        document.removeEventListener('pointerup', handleDragEnd);
        document.removeEventListener('mouseup', handleDragEnd);
        document.removeEventListener('touchend', handleDragEnd);
        document.removeEventListener('pointercancel', handleDragEnd);
    }

    function handleSwipeMove(e) {
        if (isUnlocked || isDragging) return;
        if (e.cancelable) e.preventDefault();
    }

    function handleDown(e) {
        const point = getPointFromEvent(e);
        swipeStartX = point.clientX;
        swipeStartY = point.clientY;

        if (!isUnlocked) {
            // 检查是否在滑动区域内按下 - 使用实际的屏幕坐标
            const indicator = document.querySelector('.swipe-indicator');
            if (indicator) {
                const indicatorRect = indicator.getBoundingClientRect();
                isStartInSwipeZone = (
                    point.clientX >= indicatorRect.left &&
                    point.clientX <= indicatorRect.right &&
                    point.clientY >= indicatorRect.top &&
                    point.clientY <= indicatorRect.bottom
                );
            }
            document.addEventListener('pointermove', handleSwipeMove);
            document.addEventListener('mousemove', handleSwipeMove);
            document.addEventListener('touchmove', handleSwipeMove, { passive: false });
        } else {
            isDragging = true;
            dragStartX = point.clientX;
            dragStartY = point.clientY;
            stack.style.cursor = 'grabbing';
            maojian1.style.transition = 'none';
            maojian2.style.transition = 'none';
            maojian3.style.transition = 'none';
            // 初始化胶水交互状态
            lastY = point.clientY;
            isMovingUp = false;
            document.addEventListener('pointermove', handleDragMove);
            document.addEventListener('mousemove', handleDragMove);
            document.addEventListener('touchmove', handleDragMove, { passive: false });
        }

        document.addEventListener('pointerup', handleDragEnd);
        document.addEventListener('mouseup', handleDragEnd);
        document.addEventListener('touchend', handleDragEnd);
        document.addEventListener('pointercancel', handleDragEnd);

        if (e.pointerId !== undefined) {
            stack.setPointerCapture(e.pointerId);
        }
        e.stopPropagation();
        if (e.cancelable) e.preventDefault();
    }

    function handleUp(e) {
        if (!isUnlocked) {
            const point = getPointFromEvent(e);
            const dx = point.clientX - swipeStartX;
            const dy = point.clientY - swipeStartY;
            
            // 只有在滑动区域内开始的滑动才有效
            if (isStartInSwipeZone) {
                // 检查是否从左向右滑动（至少移动30px），允许垂直误差
                if (dx >= 30 && Math.abs(dy) < 50) {
                    // 解锁成功
                    isUnlocked = true;
                    maojian1.style.opacity = '0';
                    if (swipeIndicator) {
                        swipeIndicator.style.opacity = '0';
                    }
                    stack.style.cursor = 'grab';
                    showHint('用毛尖下端蘸取胶水');
                }
            }
        }
    }

    // 绑定所有事件类型
    stack.addEventListener('pointerdown', handleDown);
    stack.addEventListener('mousedown', handleDown);
    stack.addEventListener('touchstart', handleDown, { passive: false });
    
    stack.addEventListener('pointerup', handleUp);
    stack.addEventListener('mouseup', handleUp);
    stack.addEventListener('touchend', handleUp);
}

document.addEventListener('DOMContentLoaded', () => {
    initDrawing();
    initDrag('shuidao-container');
    initDrag('shuzi-container');
    initCompleteDrag();
});