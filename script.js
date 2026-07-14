// ============================================
// ДАННЫЕ
// ============================================
let DATA = {
    passport: {
        'ФИО': 'Иванов Иван Иванович',
        'Дата рождения': '15.05.1990',
        'Место рождения': 'г. Москва',
        'Пол': 'Мужской',
        'Гражданство': 'Российская Федерация',
        'Серия': '45 12',
        'Номер': '345678',
        'Кем выдан': 'Отделом УФМС России по г. Москве',
        'Дата выдачи': '20.06.2015',
        'Срок действия': '20.06.2025',
        'Код подразделения': '770-001',
        'Город': 'г. Москва',
        'Улица': 'ул. Тверская, д. 10, кв. 25',
        'Дата регистрации': '25.06.2015'
    },
    contacts: {
        'Телефон': '+7 (999) 123-45-67',
        'Email': 'ivanov@example.com',
        'Telegram': '@ivanov'
    },
    dates: {
        'День рождения': '15.05.1990'
    },
    career: {
        experience: [
            { id: 1, period: '2020–н.в.', position: 'Senior Developer', company: 'ТехноПро', responsibilities: 'Разработка' }
        ],
        skills: ['JavaScript', 'React', 'Python'],
        languages: ['Русский', 'Английский']
    },
    family: {
        spouse: { name: 'Иванова Мария', birthDate: '12.08.1992', occupation: 'Врач' },
        children: [
            { id: 2, name: 'Иванов Алексей', birthDate: '05.03.2018', gender: 'Мужской' }
        ],
        parents: {
            father: { name: 'Иванов Иван', birthDate: '10.02.1965', occupation: 'Инженер' },
            mother: { name: 'Иванова Елена', birthDate: '25.07.1967', occupation: 'Учитель' }
        },
        siblings: [
            { id: 3, name: 'Петрова Ольга', birthDate: '18.12.1995', relationship: 'Сестра' }
        ]
    },
    education: {
        higher: [
            { id: 4, institution: 'МГТУ им. Баумана', specialty: 'Прикладная математика', degree: 'Магистр', yearEnd: 2013 }
        ],
        additional: [],
        courses: [
            { id: 5, name: 'Machine Learning', platform: 'Coursera', year: 2019, hours: 120 }
        ]
    },
    customTabs: {}
};

let idCounter = 10;
let tabCounter = 0;
let currentFilter = 'all';

// ============================================
// ЗАГРУЗКА
// ============================================
window.onload = function() {
    const saved = localStorage.getItem('profileData');
    if (saved) {
        try {
            DATA = JSON.parse(saved);
            const allIds = [];
            DATA.career.experience.forEach(e => allIds.push(e.id));
            DATA.family.children.forEach(c => allIds.push(c.id));
            DATA.family.siblings.forEach(s => allIds.push(s.id));
            DATA.education.higher.forEach(h => allIds.push(h.id));
            DATA.education.additional.forEach(a => allIds.push(a.id));
            DATA.education.courses.forEach(c => allIds.push(c.id));
            idCounter = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
            const customKeys = Object.keys(DATA.customTabs || {});
            tabCounter = customKeys.length;
        } catch(e) { console.error(e); }
    }
    renderAll();
    renderCustomTabs();
};

// ============================================
// СОХРАНЕНИЕ
// ============================================
function saveToStorage() {
    localStorage.setItem('profileData', JSON.stringify(DATA));
}

// ============================================
// ============ ВЫПАДАЮЩЕЕ МЕНЮ ============
// ============================================
function toggleDropdown() {
    const dropdown = document.getElementById('addDropdown');
    dropdown.classList.toggle('show');
}

document.addEventListener('click', function(e) {
    const dropdown = document.getElementById('addDropdown');
    const btn = document.querySelector('.add-main-btn');
    if (!dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('show');
    }
});

// ============================================
// ============ ОТКРЫТИЕ ФОРМ ============
// ============================================
function openAddForm(type) {
    document.getElementById('addDropdown').classList.remove('show');
    document.querySelectorAll('.add-form').forEach(f => f.style.display = 'none');
    const form = document.getElementById(type + '-form');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
}

function closeAddForm(formId) {
    document.getElementById(formId).style.display = 'none';
}

// ============================================
// ============ ФИЛЬТРЫ ============
// ============================================
function filterCards(type) {
    currentFilter = type;
    document.querySelectorAll('.filter-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.filter-btn').forEach(btn => {
        if (btn.textContent === 'Все' && type === 'all') btn.classList.add('active');
        if (btn.textContent.includes('Паспорт') && type === 'passport') btn.classList.add('active');
        if (btn.textContent.includes('Контакты') && type === 'contacts') btn.classList.add('active');
        if (btn.textContent.includes('Даты') && type === 'dates') btn.classList.add('active');
        if (btn.textContent.includes('Карьера') && type === 'career') btn.classList.add('active');
        if (btn.textContent.includes('Семья') && type === 'family') btn.classList.add('active');
        if (btn.textContent.includes('Образование') && type === 'education') btn.classList.add('active');
    });
    renderCards();
}

// ============================================
// ============ ОТРИСОВКА КАРТОЧЕК ============
// ============================================
function renderAll() {
    renderCards();
    saveToStorage();
}

function renderCards() {
    const container = document.getElementById('cardsContainer');
    let allCards = [];
    let filter = currentFilter;
    
    // Паспорт - собираем все поля как карточки
    if (filter === 'all' || filter === 'passport') {
        const passportFields = {
            'ФИО': DATA.passport['ФИО'],
            'Дата рождения': DATA.passport['Дата рождения'],
            'Место рождения': DATA.passport['Место рождения'],
            'Пол': DATA.passport['Пол'],
            'Гражданство': DATA.passport['Гражданство'],
            'Серия': DATA.passport['Серия'],
            'Номер': DATA.passport['Номер'],
            'Кем выдан': DATA.passport['Кем выдан'],
            'Дата выдачи': DATA.passport['Дата выдачи'],
            'Срок действия': DATA.passport['Срок действия'],
            'Код подразделения': DATA.passport['Код подразделения'],
            'Город': DATA.passport['Город'],
            'Улица': DATA.passport['Улица'],
            'Дата регистрации': DATA.passport['Дата регистрации']
        };
        
        Object.keys(passportFields).forEach(key => {
            if (passportFields[key]) {
                allCards.push({
                    id: 'passport_' + key,
                    type: 'passport',
                    label: '📇 ' + key,
                    value: passportFields[key],
                    sub: '',
                    details: { 'Поле': key, 'Значение': passportFields[key] }
                });
            }
        });
    }
    
    // Контакты
    if (filter === 'all' || filter === 'contacts') {
        Object.keys(DATA.contacts || {}).forEach(key => {
            allCards.push({
                id: 'contacts_' + key,
                type: 'contacts',
                label: '📱 ' + key,
                value: DATA.contacts[key],
                sub: '',
                details: { 'Тип': key, 'Значение': DATA.contacts[key] || '—' }
            });
        });
    }
    
    // Даты
    if (filter === 'all' || filter === 'dates') {
        Object.keys(DATA.dates || {}).forEach(key => {
            allCards.push({
                id: 'dates_' + key,
                type: 'dates',
                label: '📅 ' + key,
                value: DATA.dates[key],
                sub: '',
                details: { 'Событие': key, 'Дата': DATA.dates[key] || '—' }
            });
        });
    }
    
    // Карьера - опыт работы
    if (filter === 'all' || filter === 'career') {
        DATA.career.experience.forEach(exp => {
            allCards.push({
                id: 'career_exp_' + exp.id,
                type: 'career',
                label: '💼 ' + exp.company,
                value: exp.position,
                sub: exp.period || '',
                deleteId: exp.id,
                deleteType: 'experience',
                details: {
                    'Должность': exp.position,
                    'Компания': exp.company,
                    'Период': exp.period || '—',
                    'Обязанности': exp.responsibilities || '—'
                }
            });
        });
    }
    
    // Навыки
    if (filter === 'all' || filter === 'career') {
        DATA.career.skills.forEach((skill, i) => {
            allCards.push({
                id: 'skill_' + i,
                type: 'skill',
                label: '🛠 Навык',
                value: skill,
                sub: '',
                deleteIndex: i,
                deleteType: 'skill',
                details: { 'Навык': skill }
            });
        });
    }
    
    // Языки
    if (filter === 'all' || filter === 'career') {
        DATA.career.languages.forEach((lang, i) => {
            allCards.push({
                id: 'language_' + i,
                type: 'language',
                label: '🌍 Язык',
                value: lang,
                sub: '',
                deleteIndex: i,
                deleteType: 'language',
                details: { 'Язык': lang }
            });
        });
    }
    
    // Семья - супруг
    if (filter === 'all' || filter === 'family') {
        if (DATA.family.spouse) {
            const s = DATA.family.spouse;
            allCards.push({
                id: 'family_spouse',
                type: 'family',
                label: '💑 Супруг(а)',
                value: s.name,
                sub: s.occupation || '',
                deleteType: 'spouse',
                details: {
                    'Имя': s.name,
                    'Дата рождения': s.birthDate || '—',
                    'Профессия': s.occupation || '—'
                }
            });
        }
    }
    
    // Семья - дети
    if (filter === 'all' || filter === 'family') {
        DATA.family.children.forEach(child => {
            allCards.push({
                id: 'family_child_' + child.id,
                type: 'family',
                label: '👶 Ребенок',
                value: child.name,
                sub: child.birthDate || '',
                deleteId: child.id,
                deleteType: 'child',
                details: {
                    'Имя': child.name,
                    'Дата рождения': child.birthDate || '—',
                    'Пол': child.gender || '—'
                }
            });
        });
    }
    
    // Семья - родители
    if (filter === 'all' || filter === 'family') {
        if (DATA.family.parents.father) {
            const f = DATA.family.parents.father;
            allCards.push({
                id: 'family_father',
                type: 'family',
                label: '👨 Отец',
                value: f.name,
                sub: f.occupation || '',
                deleteType: 'father',
                details: {
                    'Имя': f.name,
                    'Дата рождения': f.birthDate || '—',
                    'Профессия': f.occupation || '—'
                }
            });
        }
        if (DATA.family.parents.mother) {
            const m = DATA.family.parents.mother;
            allCards.push({
                id: 'family_mother',
                type: 'family',
                label: '👩 Мать',
                value: m.name,
                sub: m.occupation || '',
                deleteType: 'mother',
                details: {
                    'Имя': m.name,
                    'Дата рождения': m.birthDate || '—',
                    'Профессия': m.occupation || '—'
                }
            });
        }
    }
    
    // Семья - братья/сёстры
    if (filter === 'all' || filter === 'family') {
        DATA.family.siblings.forEach(sib => {
            allCards.push({
                id: 'family_sibling_' + sib.id,
                type: 'family',
                label: '👫 ' + (sib.relationship || 'Родственник'),
                value: sib.name,
                sub: sib.birthDate || '',
                deleteId: sib.id,
                deleteType: 'sibling',
                details: {
                    'Имя': sib.name,
                    'Дата рождения': sib.birthDate || '—',
                    'Кто': sib.relationship || '—'
                }
            });
        });
    }
    
    // Образование - высшее
    if (filter === 'all' || filter === 'education') {
        DATA.education.higher.forEach(item => {
            allCards.push({
                id: 'edu_higher_' + item.id,
                type: 'education',
                label: '🎓 ' + (item.degree || 'Образование'),
                value: item.institution,
                sub: item.specialty || '',
                deleteId: item.id,
                deleteType: 'higher',
                details: {
                    'Заведение': item.institution,
                    'Специальность': item.specialty || '—',
                    'Степень': item.degree || '—',
                    'Год': item.yearEnd || '—'
                }
            });
        });
    }
    
    // Образование - курсы
    if (filter === 'all' || filter === 'education') {
        DATA.education.courses.forEach(item => {
            allCards.push({
                id: 'edu_course_' + item.id,
                type: 'education',
                label: '📖 Курс',
                value: item.name,
                sub: item.platform || '',
                deleteId: item.id,
                deleteType: 'course',
                details: {
                    'Название': item.name,
                    'Платформа': item.platform || '—',
                    'Год': item.year || '—',
                    'Часов': item.hours || '—'
                }
            });
        });
    }
    
    // Кастомные вкладки
    if (DATA.customTabs) {
        Object.keys(DATA.customTabs).forEach(tabId => {
            const tab = DATA.customTabs[tabId];
            if (filter === 'all' || filter === 'custom_' + tabId) {
                Object.keys(tab.data || {}).forEach(key => {
                    allCards.push({
                        id: 'custom_' + tabId + '_' + key,
                        type: 'custom',
                        label: '📂 ' + tab.name,
                        value: tab.data[key],
                        sub: key,
                        customTabId: tabId,
                        customKey: key,
                        deleteType: 'customField',
                        details: {
                            'Раздел': tab.name,
                            'Поле': key,
                            'Значение': tab.data[key] || '—'
                        }
                    });
                });
            }
        });
    }
    
    // Рендерим карточки
    if (allCards.length === 0) {
        container.innerHTML = `
            <div class="empty-message">
                📭 Нет данных в этом разделе<br>
                <span style="font-size:14px; color:#bbb;">Нажмите "➕ Добавить" чтобы создать</span>
            </div>
        `;
        return;
    }
    
    let html = '';
    allCards.forEach(card => {
        const deleteAttr = card.deleteType === 'experience' ? `onclick="event.stopPropagation(); deleteExperience(${card.deleteId})"` :
                          card.deleteType === 'skill' ? `onclick="event.stopPropagation(); deleteSkill(${card.deleteIndex})"` :
                          card.deleteType === 'language' ? `onclick="event.stopPropagation(); deleteLanguage(${card.deleteIndex})"` :
                          card.deleteType === 'child' ? `onclick="event.stopPropagation(); deleteChild(${card.deleteId})"` :
                          card.deleteType === 'sibling' ? `onclick="event.stopPropagation(); deleteSibling(${card.deleteId})"` :
                          card.deleteType === 'father' ? `onclick="event.stopPropagation(); deleteParent('father')"` :
                          card.deleteType === 'mother' ? `onclick="event.stopPropagation(); deleteParent('mother')"` :
                          card.deleteType === 'spouse' ? `onclick="event.stopPropagation(); deleteSpouse()"` :
                          card.deleteType === 'higher' ? `onclick="event.stopPropagation(); deleteHigher(${card.deleteId})"` :
                          card.deleteType === 'course' ? `onclick="event.stopPropagation(); deleteCourse(${card.deleteId})"` :
                          card.deleteType === 'customField' ? `onclick="event.stopPropagation(); deleteCustomField('${card.customTabId}', '${card.customKey}')"` :
                          `onclick="event.stopPropagation(); deleteCard('${card.id}')"`;
        
        const detailStr = JSON.stringify(card.details).replace(/"/g, '&quot;');
        
        html += `
            <div class="card-item type-${card.type}" onclick="openModal('${card.label}', '${detailStr}')">
                <button class="card-delete" ${deleteAttr}>✕</button>
                <div class="card-label">${card.label}</div>
                <div class="card-value">${card.value}</div>
                ${card.sub ? `<div class="card-sub">${card.sub}</div>` : ''}
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// ============ МОДАЛЬНОЕ ОКНО ============
// ============================================
function openModal(title, detailsJSON) {
    const modal = document.getElementById('cardModal');
    document.getElementById('modalTitle').textContent = title;
    
    let html = '';
    const details = JSON.parse(detailsJSON);
    Object.keys(details).forEach(key => {
        html += `
            <div class="detail-row">
                <span class="detail-label">${key}</span>
                <span class="detail-value">${details[key]}</span>
            </div>
        `;
    });
    
    document.getElementById('modalBody').innerHTML = html;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    document.getElementById('cardModal').style.display = 'none';
    document.body.style.overflow = 'auto';
}

document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeModal();
});

// ============================================
// ============ ДОБАВЛЕНИЕ ПАСПОРТА (РАСШИРЕННОЕ) ============
// ============================================
function addPassportFull() {
    const fields = {
        'ФИО': document.getElementById('passport-fullname').value.trim(),
        'Дата рождения': document.getElementById('passport-birthdate').value.trim(),
        'Место рождения': document.getElementById('passport-birthplace').value.trim(),
        'Пол': document.getElementById('passport-gender').value.trim(),
        'Гражданство': document.getElementById('passport-nationality').value.trim(),
        'Серия': document.getElementById('passport-seria').value.trim(),
        'Номер': document.getElementById('passport-number').value.trim(),
        'Кем выдан': document.getElementById('passport-issued-by').value.trim(),
        'Дата выдачи': document.getElementById('passport-issue-date').value.trim(),
        'Срок действия': document.getElementById('passport-expiry-date').value.trim(),
        'Код подразделения': document.getElementById('passport-code').value.trim(),
        'Город': document.getElementById('passport-reg-city').value.trim(),
        'Улица': document.getElementById('passport-reg-street').value.trim(),
        'Дата регистрации': document.getElementById('passport-reg-date').value.trim()
    };
    
    // Проверяем, что заполнено хотя бы ФИО
    if (!fields['ФИО']) {
        alert('Пожалуйста, заполните ФИО!');
        return;
    }
    
    // Сохраняем только заполненные поля
    Object.keys(fields).forEach(key => {
        if (fields[key]) {
            DATA.passport[key] = fields[key];
        }
    });
    
    // Очищаем поля
    document.querySelectorAll('#passport-form input').forEach(input => input.value = '');
    closeAddForm('passport-form');
    renderAll();
}

// ============================================
// ============ ОСТАЛЬНЫЕ ФУНКЦИИ ДОБАВЛЕНИЯ ============
// ============================================
function addContactsField() {
    const key = document.getElementById('contacts-type').value.trim();
    const value = document.getElementById('contacts-value').value.trim();
    if (!key) { alert('Введите тип контакта!'); return; }
    if (!DATA.contacts) DATA.contacts = {};
    DATA.contacts[key] = value || '—';
    document.getElementById('contacts-type').value = '';
    document.getElementById('contacts-value').value = '';
    closeAddForm('contacts-form');
    renderAll();
}

function addDatesField() {
    const key = document.getElementById('dates-name').value.trim();
    const value = document.getElementById('dates-value').value.trim();
    if (!key) { alert('Введите название события!'); return; }
    if (!DATA.dates) DATA.dates = {};
    DATA.dates[key] = value || '—';
    document.getElementById('dates-name').value = '';
    document.getElementById('dates-value').value = '';
    closeAddForm('dates-form');
    renderAll();
}

function addCareerExperience() {
    const period = document.getElementById('career-period').value.trim();
    const position = document.getElementById('career-position').value.trim();
    const company = document.getElementById('career-company').value.trim();
    const responsibilities = document.getElementById('career-responsibilities').value.trim();
    if (!position || !company) { alert('Заполните должность и компанию!'); return; }
    DATA.career.experience.push({ id: idCounter++, period: period || '—', position, company, responsibilities: responsibilities || '—' });
    document.getElementById('career-period').value = '';
    document.getElementById('career-position').value = '';
    document.getElementById('career-company').value = '';
    document.getElementById('career-responsibilities').value = '';
    closeAddForm('career-form');
    renderAll();
}

function addSkillField() {
    const name = document.getElementById('skill-name').value.trim();
    if (!name) { alert('Введите название навыка!'); return; }
    DATA.career.skills.push(name);
    document.getElementById('skill-name').value = '';
    closeAddForm('skill-form');
    renderAll();
}

function addLanguageField() {
    const name = document.getElementById('language-name').value.trim();
    if (!name) { alert('Введите название языка!'); return; }
    DATA.career.languages.push(name);
    document.getElementById('language-name').value = '';
    closeAddForm('language-form');
    renderAll();
}

function addFamilyMember() {
    const name = document.getElementById('family-name').value.trim();
    const birth = document.getElementById('family-birth').value.trim();
    const type = document.getElementById('family-type').value.trim().toLowerCase();
    const occupation = document.getElementById('family-occupation').value.trim();
    if (!name) { alert('Введите имя!'); return; }
    const member = { name, birthDate: birth || '—', occupation: occupation || '' };
    if (type === 'ребенок' || type === 'ребёнок' || type === 'child') {
        DATA.family.children.push({ id: idCounter++, ...member, gender: '' });
    } else if (type === 'брат' || type === 'сестра' || type === 'sibling') {
        DATA.family.siblings.push({ id: idCounter++, ...member, relationship: type });
    } else if (type === 'отец' || type === 'папа' || type === 'father') {
        DATA.family.parents.father = { ...member };
    } else if (type === 'мать' || type === 'мама' || type === 'mother') {
        DATA.family.parents.mother = { ...member };
    } else if (type === 'супруг' || type === 'супруга' || type === 'spouse') {
        DATA.family.spouse = { ...member };
    } else {
        alert('Укажите кого добавляете: ребенок, брат, сестра, отец, мать, супруг');
        return;
    }
    document.getElementById('family-name').value = '';
    document.getElementById('family-birth').value = '';
    document.getElementById('family-type').value = '';
    document.getElementById('family-occupation').value = '';
    closeAddForm('family-form');
    renderAll();
}

function addEducationField() {
    const institution = document.getElementById('edu-institution').value.trim();
    const specialty = document.getElementById('edu-specialty').value.trim();
    const degree = document.getElementById('edu-degree').value.trim();
    const year = document.getElementById('edu-year').value.trim();
    if (!institution) { alert('Введите название!'); return; }
    DATA.education.higher.push({ id: idCounter++, institution, specialty: specialty || '—', degree: degree || '—', yearEnd: year || '—' });
    document.getElementById('edu-institution').value = '';
    document.getElementById('edu-specialty').value = '';
    document.getElementById('edu-degree').value = '';
    document.getElementById('edu-year').value = '';
    closeAddForm('education-form');
    renderAll();
}

function addCourseField() {
    const name = document.getElementById('course-name').value.trim();
    const platform = document.getElementById('course-platform').value.trim();
    if (!name) { alert('Введите название курса!'); return; }
    DATA.education.courses.push({ id: idCounter++, name, platform: platform || '—', year: '', hours: '' });
    document.getElementById('course-name').value = '';
    document.getElementById('course-platform').value = '';
    closeAddForm('course-form');
    renderAll();
}

// ============================================
// ============ ФУНКЦИИ УДАЛЕНИЯ ============
// ============================================
function deleteExperience(id) {
    if (confirm('Удалить запись о работе?')) {
        DATA.career.experience = DATA.career.experience.filter(e => e.id !== id);
        renderAll();
    }
}

function deleteSkill(index) {
    if (confirm('Удалить навык?')) {
        DATA.career.skills.splice(index, 1);
        renderAll();
    }
}

function deleteLanguage(index) {
    if (confirm('Удалить язык?')) {
        DATA.career.languages.splice(index, 1);
        renderAll();
    }
}

function deleteChild(id) {
    if (confirm('Удалить ребенка?')) {
        DATA.family.children = DATA.family.children.filter(c => c.id !== id);
        renderAll();
    }
}

function deleteSibling(id) {
    if (confirm('Удалить брата/сестру?')) {
        DATA.family.siblings = DATA.family.siblings.filter(s => s.id !== id);
        renderAll();
    }
}

function deleteParent(role) {
    if (confirm('Удалить?')) {
        DATA.family.parents[role] = null;
        renderAll();
    }
}

function deleteSpouse() {
    if (confirm('Удалить супруга(у)?')) {
        DATA.family.spouse = null;
        renderAll();
    }
}

function deleteHigher(id) {
    if (confirm('Удалить запись об образовании?')) {
        DATA.education.higher = DATA.education.higher.filter(item => item.id !== id);
        renderAll();
    }
}

function deleteCourse(id) {
    if (confirm('Удалить курс?')) {
        DATA.education.courses = DATA.education.courses.filter(item => item.id !== id);
        renderAll();
    }
}

function deleteCard(id) {
    if (confirm('Удалить?')) {
        const parts = id.split('_');
        if (parts[0] === 'custom') {
            const tabId = parts[1];
            const key = parts.slice(2).join('_');
            deleteCustomField(tabId, key);
        }
    }
}

function deleteCustomField(tabId, key) {
    if (confirm(`Удалить поле "${key}"?`)) {
        if (DATA.customTabs[tabId]) {
            delete DATA.customTabs[tabId].data[key];
            renderAll();
        }
    }
}

// ============================================
// ============ КАСТОМНЫЕ ВКЛАДКИ ============
// ============================================
function addNewTab() {
    const name = document.getElementById('new-tab-name').value.trim();
    if (!name) {
        alert('Введите название вкладки!');
        return;
    }

    const tabId = 'tab_' + (++tabCounter);
    if (!DATA.customTabs) DATA.customTabs = {};
    DATA.customTabs[tabId] = { name: name, data: {} };

    document.getElementById('new-tab-name').value = '';
    closeAddForm('newtab-form');

    addCustomFilterButton(tabId, name);
    addCustomDropdownItem(tabId, name);
    
    renderAll();
    saveToStorage();
}

function renderCustomTabs() {
    const customFilterContainer = document.getElementById('customFilterButtons');
    const customDropdownContainer = document.getElementById('customDropdownItems');
    customFilterContainer.innerHTML = '';
    customDropdownContainer.innerHTML = '';
    
    if (DATA.customTabs) {
        Object.keys(DATA.customTabs).forEach(tabId => {
            const tab = DATA.customTabs[tabId];
            addCustomFilterButton(tabId, tab.name);
            addCustomDropdownItem(tabId, tab.name);
        });
    }
}

function addCustomFilterButton(tabId, name) {
    const container = document.getElementById('customFilterButtons');
    const btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = '📂 ' + name;
    btn.onclick = function() { filterCards('custom_' + tabId); };
    container.appendChild(btn);
}

function addCustomDropdownItem(tabId, name) {
    const container = document.getElementById('customDropdownItems');
    const btn = document.createElement('button');
    btn.textContent = '📂 ' + name;
    btn.onclick = function() { openAddForm('custom_' + tabId); };
    container.appendChild(btn);
}

// ============================================
// ============ ЭКСПОРТ / ИМПОРТ ============
// ============================================
function saveToFile() {
    const blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'profile_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadFromFile() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            DATA = JSON.parse(e.target.result);
            const allIds = [];
            DATA.career.experience.forEach(exp => allIds.push(exp.id));
            DATA.family.children.forEach(c => allIds.push(c.id));
            DATA.family.siblings.forEach(s => allIds.push(s.id));
            DATA.education.higher.forEach(h => allIds.push(h.id));
            DATA.education.additional.forEach(a => allIds.push(a.id));
            DATA.education.courses.forEach(c => allIds.push(c.id));
            idCounter = allIds.length > 0 ? Math.max(...allIds) + 1 : 1;
            renderAll();
            renderCustomTabs();
            alert('✅ Данные загружены!');
        } catch(err) {
            alert('❌ Ошибка: ' + err.message);
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAll() {
    if (confirm('🗑️ Удалить всё?')) {
        if (confirm('Точно?')) {
            DATA = {
                passport: {},
                contacts: {},
                dates: {},
                career: { experience: [], skills: [], languages: [] },
                family: { spouse: null, children: [], parents: { father: null, mother: null }, siblings: [] },
                education: { higher: [], additional: [], courses: [] },
                customTabs: {}
            };
            idCounter = 1;
            tabCounter = 0;
            renderAll();
            renderCustomTabs();
            alert('✅ Сброшено');
        }
    }
}

window.addEventListener('beforeunload', () => saveToStorage());
