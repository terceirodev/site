document.addEventListener('DOMContentLoaded', function () {
    const calendarDays = document.getElementById('calendar-days');
    const prevMonthBtn = document.getElementById('prev-month');
    const nextMonthBtn = document.getElementById('next-month');
    const calendarTitle = document.querySelector('.calendar-title');
    const eventForm = document.getElementById('event-form');
    const closeFormBtn = document.getElementById('close-form');
    const cancelBtn = document.getElementById('cancel-btn');
    const deleteBtn = document.getElementById('delete-btn');
    const eventDataForm = document.getElementById('event-data');
    const formTitle = document.getElementById('form-title');
    const adminLoginBtn = document.getElementById('admin-login');
    const adminStatus = document.getElementById('admin-status');
    const loginModal = document.getElementById('login-modal');
    const loginForm = document.getElementById('login-form');
    const loginCancelBtn = document.getElementById('login-cancel');
    const calendarContainer = document.getElementById('calendar-container');

    let currentDate = new Date();
    let events = JSON.parse(localStorage.getItem('calendarEvents')) || [];
    let isAdmin = localStorage.getItem('adminLoggedIn') === 'true';

    const ADMIN_CREDENTIALS = {
        username: "admin",
        password: "admin123"
    };

    updateAdminUI();
    renderCalendar();

    prevMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
    });

    nextMonthBtn.addEventListener('click', () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
    });

    closeFormBtn.addEventListener('click', closeEventForm);
    cancelBtn.addEventListener('click', closeEventForm);

    deleteBtn.addEventListener('click', function () {
        if (!isAdmin) return;
        const eventId = document.getElementById('event-id').value;
        if (eventId) {
            events = events.filter(event => event.id !== eventId);
            saveEvents();
            renderCalendar();
            closeEventForm();
        }
    });

    eventDataForm.addEventListener('submit', function (e) {
        e.preventDefault();
        saveEvent();
    });

    adminLoginBtn.addEventListener('click', function () {
        if (isAdmin) {
            logoutAdmin();
        } else {
            openLoginModal();
        }
    });

    loginForm.addEventListener('submit', function (e) {
        e.preventDefault();
        const username = document.getElementById('admin-username').value;
        const password = document.getElementById('admin-password').value;

        if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
            loginAdmin();
        } else {
            alert('Credenciais inválidas!');
        }
    });

    loginCancelBtn.addEventListener('click', closeLoginModal);

    function renderCalendar() {
        calendarDays.innerHTML = '';
        const monthNames = ['Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho', 'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro'];
        calendarTitle.textContent = `${monthNames[currentDate.getMonth()]} ${currentDate.getFullYear()}`;
        const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
        const lastDay = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0);
        const startDay = firstDay.getDay();
        const prevMonthLastDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 0).getDate();

        for (let i = startDay - 1; i >= 0; i--) {
            calendarDays.appendChild(createDayElement(prevMonthLastDay - i, true));
        }

        for (let i = 1; i <= lastDay.getDate(); i++) {
            const dayElement = createDayElement(i, false);
            const today = new Date();
            if (
                currentDate.getFullYear() === today.getFullYear() &&
                currentDate.getMonth() === today.getMonth() &&
                i === today.getDate()
            ) {
                dayElement.classList.add('today');
            }
            calendarDays.appendChild(dayElement);
        }

        const daysLeft = 42 - (startDay + lastDay.getDate());
        for (let i = 1; i <= daysLeft; i++) {
            calendarDays.appendChild(createDayElement(i, true));
        }
    }

    function createDayElement(day, isOtherMonth) {
        const dayElement = document.createElement('div');
        dayElement.className = 'day';
        if (isOtherMonth) dayElement.classList.add('other-month');

        const dayNumber = document.createElement('div');
        dayNumber.className = 'day-number';
        dayNumber.textContent = day;
        dayElement.appendChild(dayNumber);

        if (!isOtherMonth) {
            const dateKey = formatDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day));
            const dayEvents = events.filter(event => event.date === dateKey);
            dayEvents.forEach(event => {
                const eventElement = document.createElement('div');
                eventElement.className = 'event';
                eventElement.textContent = event.title;
                eventElement.addEventListener('click', (e) => {
                    e.stopPropagation();
                    if (isAdmin) {
                        openEventForm(event);
                    } else {
                        viewEventDetails(event);
                    }
                });
                dayElement.appendChild(eventElement);
            });
        }

        dayElement.addEventListener('click', function (e) {
            if (!isAdmin) return;
            if (e.target === dayElement || e.target === dayNumber) {
                const clickedDate = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
                openEventForm({ date: formatDate(clickedDate) });
            }
        });

        return dayElement;
    }

    function openEventForm(eventData = {}) {
        formTitle.textContent = eventData.id ? 'Editar Evento' : 'Adicionar Evento';
        document.getElementById('event-date').value = eventData.date || '';
        document.getElementById('event-id').value = eventData.id || '';
        document.getElementById('event-title').value = eventData.title || '';
        document.getElementById('event-description').value = eventData.description || '';
        document.getElementById('event-time').value = eventData.time || '';
        document.getElementById('event-title').readOnly = false;
        document.getElementById('event-description').readOnly = false;
        document.getElementById('event-time').disabled = false;
        deleteBtn.style.display = eventData.id ? 'block' : 'none';
        cancelBtn.style.display = 'inline-block';
        eventDataForm.querySelector('.save-btn').style.display = 'inline-block';
        eventForm.style.display = 'flex';
    }

    function viewEventDetails(eventData = {}) {
        formTitle.textContent = 'Detalhes do Evento';
        document.getElementById('event-date').value = eventData.date || '';
        document.getElementById('event-id').value = eventData.id || '';
        document.getElementById('event-title').value = eventData.title || '';
        document.getElementById('event-description').value = eventData.description || '';
        document.getElementById('event-time').value = eventData.time || '';
        document.getElementById('event-title').readOnly = true;
        document.getElementById('event-description').readOnly = true;
        document.getElementById('event-time').disabled = true;
        deleteBtn.style.display = 'none';
        cancelBtn.style.display = 'none';
        eventDataForm.querySelector('.save-btn').style.display = 'none';
        eventForm.style.display = 'flex';
    }

    function closeEventForm() {
        eventForm.style.display = 'none';
        eventDataForm.reset();
    }

    function saveEvent() {
        if (!isAdmin) return;
        const eventId = document.getElementById('event-id').value;
        const eventDate = document.getElementById('event-date').value;
        const eventTitle = document.getElementById('event-title').value;
        const eventDescription = document.getElementById('event-description').value;
        const eventTime = document.getElementById('event-time').value;
        if (!eventTitle) return;
        const event = {
            id: eventId || Date.now().toString(),
            date: eventDate,
            title: eventTitle,
            description: eventDescription,
            time: eventTime
        };
        if (eventId) {
            const index = events.findIndex(e => e.id === eventId);
            if (index !== -1) events[index] = event;
        } else {
            events.push(event);
        }
        saveEvents();
        renderCalendar();
        closeEventForm();
    }

    function saveEvents() {
        localStorage.setItem('calendarEvents', JSON.stringify(events));
    }

    function formatDate(date) {
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}-${month}-${day}`;
    }

    function openLoginModal() {
        loginModal.style.display = 'flex';
    }

    function closeLoginModal() {
        loginModal.style.display = 'none';
        loginForm.reset();
    }

    function loginAdmin() {
        isAdmin = true;
        localStorage.setItem('adminLoggedIn', 'true');
        updateAdminUI();
        closeLoginModal();
        renderCalendar();
    }

    function logoutAdmin() {
        isAdmin = false;
        localStorage.removeItem('adminLoggedIn');
        updateAdminUI();
        renderCalendar();
    }

    function updateAdminUI() {
        if (isAdmin) {
            adminLoginBtn.textContent = 'Logout Admin';
            adminStatus.textContent = '(Modo Administrador)';
            calendarContainer.classList.add('admin-mode');
            calendarContainer.classList.remove('view-mode');
        } else {
            adminLoginBtn.textContent = 'Login Admin';
            adminStatus.textContent = '';
            calendarContainer.classList.remove('admin-mode');
            calendarContainer.classList.add('view-mode');
        }
    }
});
