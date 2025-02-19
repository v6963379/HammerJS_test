let gestureData = [];

document.addEventListener('DOMContentLoaded', function() {
    const gestureArea = document.getElementById('gestureArea');
    const hammer = new Hammer(gestureArea);

    // Включаем распознавание всех жестов
    hammer.get('pan').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('swipe').set({ direction: Hammer.DIRECTION_ALL });
    hammer.get('pinch').set({ enable: true });
    hammer.get('rotate').set({ enable: true });

    // Обработчики жестов
    hammer.on('pan', handleGesture);
    hammer.on('swipe', handleGesture);
    hammer.on('pinch', handleGesture);
    hammer.on('rotate', handleGesture);
    hammer.on('tap', handleGesture);

    // Обработчики кнопок
    document.getElementById('downloadBtn').addEventListener('click', downloadData);
    document.getElementById('analyzeBtn').addEventListener('click', analyzeData);
    document.getElementById('clearBtn').addEventListener('click', clearData);
});

function handleGesture(event) {
    const gestureInfo = {
        type: event.type,
        timestamp: new Date().toISOString(),
        details: {
            deltaX: event.deltaX,
            deltaY: event.deltaY,
            velocity: event.velocity,
            scale: event.scale,
            rotation: event.rotation
        }
    };
    
    gestureData.push(gestureInfo);
    updateGestureArea(event.type);
}

function updateGestureArea(gestureType) {
    const gestureArea = document.getElementById('gestureArea');
    gestureArea.innerHTML = `<p>Последний жест: ${gestureType}</p>
                            <p>Всего жестов: ${gestureData.length}</p>`;
}

function downloadData() {
    const dataStr = JSON.stringify(gestureData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'gesture-data.json';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

function clearData() {
    gestureData = [];
    updateGestureArea('');
    document.getElementById('analyticsContent').innerHTML = '';
} 