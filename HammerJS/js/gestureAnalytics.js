function analyzeData() {
    if (gestureData.length === 0) {
        document.getElementById('analyticsContent').innerHTML = '<p>Нет данных для анализа</p>';
        return;
    }

    const analytics = {
        totalGestures: gestureData.length,
        gestureTypes: {},
        velocityStats: {
            min: Infinity,
            max: -Infinity,
            avg: 0,
            total: 0
        },
        directionStats: {
            left: 0,
            right: 0,
            up: 0,
            down: 0
        },
        timeStats: {
            start: new Date(gestureData[0].timestamp),
            end: new Date(gestureData[gestureData.length - 1].timestamp),
            intervalsBetweenGestures: []
        },
        rotationStats: {
            totalRotation: 0,
            avgRotation: 0,
            maxRotation: 0
        },
        pinchStats: {
            avgScale: 0,
            maxScale: 0,
            minScale: Infinity
        }
    };

    // Детальный анализ каждого жеста
    for (let i = 0; i < gestureData.length; i++) {
        const gesture = gestureData[i];
        
        // Подсчет типов жестов
        analytics.gestureTypes[gesture.type] = (analytics.gestureTypes[gesture.type] || 0) + 1;

        // Анализ скорости
        if (gesture.details.velocity) {
            analytics.velocityStats.total += gesture.details.velocity;
            analytics.velocityStats.min = Math.min(analytics.velocityStats.min, gesture.details.velocity);
            analytics.velocityStats.max = Math.max(analytics.velocityStats.max, gesture.details.velocity);
        }

        // Анализ направления
        if (gesture.details.deltaX || gesture.details.deltaY) {
            if (Math.abs(gesture.details.deltaX) > Math.abs(gesture.details.deltaY)) {
                gesture.details.deltaX > 0 ? analytics.directionStats.right++ : analytics.directionStats.left++;
            } else {
                gesture.details.deltaY > 0 ? analytics.directionStats.down++ : analytics.directionStats.up++;
            }
        }

        // Анализ вращения
        if (gesture.details.rotation) {
            analytics.rotationStats.totalRotation += Math.abs(gesture.details.rotation);
            analytics.rotationStats.maxRotation = Math.max(analytics.rotationStats.maxRotation, Math.abs(gesture.details.rotation));
        }

        // Анализ масштабирования
        if (gesture.details.scale) {
            analytics.pinchStats.avgScale += gesture.details.scale;
            analytics.pinchStats.maxScale = Math.max(analytics.pinchStats.maxScale, gesture.details.scale);
            analytics.pinchStats.minScale = Math.min(analytics.pinchStats.minScale, gesture.details.scale);
        }

        // Анализ интервалов между жестами
        if (i > 0) {
            const interval = new Date(gesture.timestamp) - new Date(gestureData[i-1].timestamp);
            analytics.timeStats.intervalsBetweenGestures.push(interval);
        }
    }

    // Вычисление средних значений
    analytics.velocityStats.avg = analytics.velocityStats.total / analytics.totalGestures;
    analytics.rotationStats.avgRotation = analytics.rotationStats.totalRotation / analytics.totalGestures;
    analytics.pinchStats.avgScale = analytics.pinchStats.avgScale / analytics.totalGestures;

    const avgInterval = analytics.timeStats.intervalsBetweenGestures.reduce((a, b) => a + b, 0) / 
                       analytics.timeStats.intervalsBetweenGestures.length;

    // Формирование HTML для вывода анализа
    const analyticsHTML = `
        <div class="analytics-grid">
            <div class="analytics-card">
                <h3>Общая статистика</h3>
                <p>Всего жестов: <span class="stat-value">${analytics.totalGestures}</span></p>
                <p>Длительность сессии: <span class="stat-value">${Math.round((analytics.timeStats.end - analytics.timeStats.start) / 1000)}с</span></p>
                <p>Среднее время между жестами: <span class="stat-value">${Math.round(avgInterval)}мс</span></p>
            </div>

            <div class="analytics-card">
                <h3>Типы жестов</h3>
                ${Object.entries(analytics.gestureTypes)
                    .map(([type, count]) => `
                        <p>${type}: <span class="stat-value">${count}</span> 
                        (${Math.round(count/analytics.totalGestures*100)}%)</p>
                    `).join('')}
            </div>

            <div class="analytics-card">
                <h3>Статистика скорости</h3>
                <p>Средняя скорость: <span class="stat-value">${analytics.velocityStats.avg.toFixed(2)}</span></p>
                <p>Максимальная скорость: <span class="stat-value">${analytics.velocityStats.max.toFixed(2)}</span></p>
                <p>Минимальная скорость: <span class="stat-value">${analytics.velocityStats.min.toFixed(2)}</span></p>
            </div>

            <div class="analytics-card">
                <h3>Направления жестов</h3>
                <p>Влево: <span class="stat-value">${analytics.directionStats.left}</span></p>
                <p>Вправо: <span class="stat-value">${analytics.directionStats.right}</span></p>
                <p>Вверх: <span class="stat-value">${analytics.directionStats.up}</span></p>
                <p>Вниз: <span class="stat-value">${analytics.directionStats.down}</span></p>
            </div>

            <div class="analytics-card">
                <h3>Статистика вращения</h3>
                <p>Среднее вращение: <span class="stat-value">${analytics.rotationStats.avgRotation.toFixed(2)}°</span></p>
                <p>Максимальное вращение: <span class="stat-value">${analytics.rotationStats.maxRotation.toFixed(2)}°</span></p>
            </div>

            <div class="analytics-card">
                <h3>Статистика масштабирования</h3>
                <p>Среднее масштабирование: <span class="stat-value">${analytics.pinchStats.avgScale.toFixed(2)}</span></p>
                <p>Максимальное увеличение: <span class="stat-value">${analytics.pinchStats.maxScale.toFixed(2)}</span></p>
                <p>Максимальное уменьшение: <span class="stat-value">${analytics.pinchStats.minScale.toFixed(2)}</span></p>
            </div>
        </div>
    `;

    document.getElementById('analyticsContent').innerHTML = analyticsHTML;
} 