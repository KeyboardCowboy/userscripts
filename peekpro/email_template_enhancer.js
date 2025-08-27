// Email Template List Enhancer - Greasemonkey/Userscript
// Adds filtering and sorting to email template management interface

(function() {
    'use strict';

    // Wait for DOM to be ready
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initializeEnhancements);
    } else {
        initializeEnhancements();
    }

    function initializeEnhancements() {
        const tableList = document.querySelector('ul.striped-table');
        if (!tableList) {
            console.log('Email template table not found, retrying...');
            setTimeout(initializeEnhancements, 500);
            return;
        }

        // Create and inject control panel
        createControlPanel(tableList);
        
        // Initialize data structure
        const emailData = parseEmailData(tableList);
        
        // Setup filtering and sorting
        setupControls(tableList, emailData);
        
        console.log('Email template enhancer loaded!', emailData);
    }

    function createControlPanel(tableList) {
        const controlPanel = document.createElement('div');
        controlPanel.id = 'email-enhancer-controls';
        controlPanel.style.cssText = `
            background: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 15px;
            margin-bottom: 15px;
            display: flex;
            flex-wrap: wrap;
            gap: 15px;
            align-items: center;
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
        `;

        controlPanel.innerHTML = `
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-weight: 600; color: #495057;">Filter by Name:</label>
                <input type="text" id="name-filter" placeholder="Search email names..." 
                       style="padding: 6px 12px; border: 1px solid #ced4da; border-radius: 4px; width: 200px;">
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-weight: 600; color: #495057;">Filter by Activity:</label>
                <select id="activity-filter" style="padding: 6px 12px; border: 1px solid #ced4da; border-radius: 4px; min-width: 180px;">
                    <option value="">All Activities</option>
                </select>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-weight: 600; color: #495057;">Schedule Type:</label>
                <select id="schedule-filter" style="padding: 6px 12px; border: 1px solid #ced4da; border-radius: 4px;">
                    <option value="">All Types</option>
                    <option value="Auto Send">Auto Send</option>
                    <option value="Manual">Manual</option>
                </select>
            </div>
            
            <div style="display: flex; align-items: center; gap: 8px;">
                <label style="font-weight: 600; color: #495057;">Sort by:</label>
                <select id="sort-control" style="padding: 6px 12px; border: 1px solid #ced4da; border-radius: 4px;">
                    <option value="">Default Order</option>
                    <option value="name-asc">Name (A-Z)</option>
                    <option value="name-desc">Name (Z-A)</option>
                    <option value="schedule-asc">Schedule Type (A-Z)</option>
                    <option value="activities-asc">Activity Count (Low-High)</option>
                    <option value="activities-desc">Activity Count (High-Low)</option>
                </select>
            </div>
            
            <button id="clear-filters" style="
                padding: 6px 16px; 
                background: #6c757d; 
                color: white; 
                border: none; 
                border-radius: 4px; 
                cursor: pointer;
                font-weight: 500;
            ">Clear All</button>
            
            <div id="results-count" style="
                margin-left: auto; 
                font-weight: 600; 
                color: #495057;
                padding: 6px 12px;
                background: #e9ecef;
                border-radius: 4px;
            "></div>
        `;

        tableList.parentNode.insertBefore(controlPanel, tableList);
    }

    function parseEmailData(tableList) {
        const rows = Array.from(tableList.querySelectorAll('li.row:not(.row-header)'));
        
        return rows.map((row, index) => {
            const nameEl = row.querySelector('.pk-1-4:first-child');
            const activitiesEl = row.querySelector('.pk-1-4:nth-child(2)');
            const scheduleEl = row.querySelector('.pk-1-4:nth-child(3)');
            
            const name = nameEl ? nameEl.textContent.trim() : '';
            const schedule = scheduleEl ? scheduleEl.textContent.trim() : '';
            
            // Parse activities
            const activitySpans = activitiesEl ? activitiesEl.querySelectorAll('.activity-name') : [];
            const activities = Array.from(activitySpans).map(span => span.textContent.trim());
            const activityText = activitiesEl ? activitiesEl.textContent.trim() : '';
            
            return {
                element: row,
                index,
                name,
                activities,
                activityText,
                schedule,
                activityCount: activities.length || (activityText === 'All Activities' ? 999 : activityText === 'n/a' ? 0 : 1)
            };
        });
    }

    function setupControls(tableList, emailData) {
        // Populate activity filter dropdown
        const activityFilter = document.getElementById('activity-filter');
        const allActivities = new Set();
        
        emailData.forEach(item => {
            if (item.activityText === 'All Activities') {
                allActivities.add('All Activities');
            } else if (item.activityText === 'n/a') {
                allActivities.add('n/a');
            } else {
                item.activities.forEach(activity => allActivities.add(activity));
            }
        });
        
        Array.from(allActivities).sort().forEach(activity => {
            const option = document.createElement('option');
            option.value = activity;
            option.textContent = activity;
            activityFilter.appendChild(option);
        });

        // Filter and sort handlers
        function applyFiltersAndSort() {
            const nameFilter = document.getElementById('name-filter').value.toLowerCase();
            const activityFilter = document.getElementById('activity-filter').value;
            const scheduleFilter = document.getElementById('schedule-filter').value;
            const sortBy = document.getElementById('sort-control').value;
            
            let filteredData = emailData.filter(item => {
                // Name filter
                if (nameFilter && !item.name.toLowerCase().includes(nameFilter)) {
                    return false;
                }
                
                // Activity filter
                if (activityFilter) {
                    if (activityFilter === 'All Activities' && item.activityText !== 'All Activities') {
                        return false;
                    } else if (activityFilter === 'n/a' && item.activityText !== 'n/a') {
                        return false;
                    } else if (activityFilter !== 'All Activities' && activityFilter !== 'n/a') {
                        if (!item.activities.includes(activityFilter)) {
                            return false;
                        }
                    }
                }
                
                // Schedule filter
                if (scheduleFilter && item.schedule !== scheduleFilter) {
                    return false;
                }
                
                return true;
            });
            
            // Apply sorting
            if (sortBy) {
                filteredData.sort((a, b) => {
                    switch (sortBy) {
                        case 'name-asc':
                            return a.name.localeCompare(b.name);
                        case 'name-desc':
                            return b.name.localeCompare(a.name);
                        case 'schedule-asc':
                            return a.schedule.localeCompare(b.schedule);
                        case 'activities-asc':
                            return a.activityCount - b.activityCount;
                        case 'activities-desc':
                            return b.activityCount - a.activityCount;
                        default:
                            return 0;
                    }
                });
            }
            
            // Update display
            updateDisplay(emailData, filteredData);
        }
        
        function updateDisplay(allData, filteredData) {
            const visibleIndices = new Set(filteredData.map(item => item.index));
            
            // Show/hide rows
            allData.forEach(item => {
                item.element.style.display = visibleIndices.has(item.index) ? '' : 'none';
            });
            
            // Re-order visible rows
            const tableContainer = tableList;
            const header = tableContainer.querySelector('.row-header');
            
            // Remove all non-header rows
            const allRows = Array.from(tableContainer.querySelectorAll('li.row:not(.row-header)'));
            allRows.forEach(row => row.remove());
            
            // Add back filtered rows in new order
            filteredData.forEach(item => {
                tableContainer.appendChild(item.element);
            });
            
            // Update results count
            const resultsCount = document.getElementById('results-count');
            resultsCount.textContent = `${filteredData.length} of ${allData.length} emails`;
        }
        
        // Attach event listeners
        document.getElementById('name-filter').addEventListener('input', applyFiltersAndSort);
        document.getElementById('activity-filter').addEventListener('change', applyFiltersAndSort);
        document.getElementById('schedule-filter').addEventListener('change', applyFiltersAndSort);
        document.getElementById('sort-control').addEventListener('change', applyFiltersAndSort);
        
        document.getElementById('clear-filters').addEventListener('click', () => {
            document.getElementById('name-filter').value = '';
            document.getElementById('activity-filter').value = '';
            document.getElementById('schedule-filter').value = '';
            document.getElementById('sort-control').value = '';
            applyFiltersAndSort();
        });
        
        // Initial count display
        updateDisplay(emailData, emailData);
    }
})();