const input = document.getElementById('todo-input');
        const timeInput = document.getElementById('todo-time');
        const soundSelect = document.getElementById('sound-select');
        const addBtn = document.getElementById('add-btn');
        const todoList = document.getElementById('todo-list');
        const alarmSound = document.getElementById('alarm-sound');
        const previewSound = document.getElementById('preview-sound');

        // Set Default Time to Now
        function setDefaultTime() {
            const now = new Date();
            now.setMinutes(now.getMinutes() - now.getTimezoneOffset());
            timeInput.value = now.toISOString().slice(0, 16);
        }
        setDefaultTime();

        document.getElementById('current-date').innerText = new Date().toLocaleDateString(undefined, { weekday: 'long', month: 'long', day: 'numeric' });

        // --- NEW: SOUND PREVIEW LOGIC ---
        soundSelect.addEventListener('change', () => {
            // Stop any ongoing alarm sound for a second to hear preview
            previewSound.src = soundSelect.value;
            previewSound.currentTime = 0;
            previewSound.play();
            
            setTimeout(() => {
                previewSound.pause();
            }, 2000);
        });

        if (Notification.permission !== "granted") {
            Notification.requestPermission();
        }

        function addTask() {
            const text = input.value;
            const time = timeInput.value;
            const selectedSound = soundSelect.value;

            if (text.trim() === "") return;

            const li = document.createElement('li');
            const taskId = Date.now();
            li.setAttribute('data-id', taskId);
            li.setAttribute('data-sound', selectedSound);

            li.innerHTML = `
                <input type="checkbox" class="checkbox" onchange="toggleTask(this, ${taskId})">
                <div class="task-info">
                    <span>${text}</span>
                    <small>⏰ ${new Date(time).toLocaleString()}</small>
                </div>
                <button class="delete-btn" onclick="removeTask(${taskId})">×</button>
            `;

            todoList.prepend(li);

            if (time) {
                const alarmTime = new Date(time).getTime();
                const checkInterval = setInterval(() => {
                    const now = new Date().getTime();
                    const item = document.querySelector(`[data-id="${taskId}"]`);
                    
                    if (!item) { clearInterval(checkInterval); return; }

                    if (now >= alarmTime && !item.classList.contains('completed')) {
                        if (!item.classList.contains('ringing')) {
                            item.classList.add('ringing');
                            playAlarm(selectedSound);
                            
                            if (Notification.permission === "granted") {
                                new Notification("Task Alert!", { body: text });
                            }
                        }
                    } else if (item.classList.contains('completed')) {
                        clearInterval(checkInterval);
                        stopAlarmIfNoRinging();
                    }
                }, 1000);
            }

            input.value = "";
            setDefaultTime();
        }

        function playAlarm(soundUrl) {
            alarmSound.src = soundUrl;
            alarmSound.play();
        }

        function toggleTask(checkbox, id) {
            const li = checkbox.parentElement;
            li.classList.toggle('completed');
            if (li.classList.contains('completed')) {
                li.classList.remove('ringing');
                stopAlarmIfNoRinging();
            }
        }

        function removeTask(id) {
            const item = document.querySelector(`[data-id="${id}"]`);
            if (item) {
                item.remove();
                stopAlarmIfNoRinging();
            }
        }

        function stopAlarmIfNoRinging() {
            const ringingItems = document.querySelectorAll('.ringing');
            if (ringingItems.length === 0) {
                alarmSound.pause();
                alarmSound.currentTime = 0;
            } else {
                alarmSound.src = ringingItems[0].getAttribute('data-sound');
                alarmSound.play();
            }
        }

        addBtn.addEventListener('click', addTask);
        input.addEventListener('keypress', (e) => { if (e.key === 'Enter') addTask(); });