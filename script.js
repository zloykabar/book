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
        'День рождения': '15.05.1990',
        'Свадьба': '01.06.2015'
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
let currentEditCard = null;

// ============================================
// ЗАГРУЗКА
// ============================================
window.onload = function() {
    var saved = localStorage.getItem('profileData');
    if (saved) {
        try {
            DATA = JSON.parse(saved);
            var allIds = [];
            DATA.career.experience.forEach(function(e) { allIds.push(e.id); });
            DATA.family.children.forEach(function(c) { allIds.push(c.id); });
            DATA.family.siblings.forEach(function(s) { allIds.push(s.id); });
            DATA.education.higher.forEach(function(h) { allIds.push(h.id); });
            DATA.education.additional.forEach(function(a) { allIds.push(a.id); });
            DATA.education.courses.forEach(function(c) { allIds.push(c.id); });
            idCounter = allIds.length > 0 ? Math.max.apply(null, allIds) + 1 : 1;
            var customKeys = Object.keys(DATA.customTabs || {});
            tabCounter = customKeys.length;
        } catch(e) { console.error(e); }
    }
    renderAll();
    renderCustomTabs();
    
    var select = document.getElementById('family-type-select');
    if (select) {
        select.addEventListener('change', function() {
            var customContainer = document.getElementById('family-custom-type-container');
            if (this.value === 'другой') {
                customContainer.style.display = 'block';
            } else {
                customContainer.style.display = 'none';
            }
        });
    }
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
    var dropdown = document.getElementById('addDropdown');
    if (dropdown) {
        dropdown.classList.toggle('show');
    }
}

document.addEventListener('click', function(e) {
    var dropdown = document.getElementById('addDropdown');
    var btn = document.querySelector('.add-main-btn');
    if (dropdown && btn && !dropdown.contains(e.target) && e.target !== btn) {
        dropdown.classList.remove('show');
    }
});

// ============================================
// ============ ОТКРЫТИЕ ФОРМ ============
// ============================================
function openAddForm(type) {
    var dropdown = document.getElementById('addDropdown');
    if (dropdown) dropdown.classList.remove('show');
    
    document.querySelectorAll('.add-form').forEach(function(f) { f.style.display = 'none'; });
    
    var form = document.getElementById(type + '-form');
    if (form) {
        form.style.display = 'block';
        form.scrollIntoView({ behavior: 'smooth', block: 'center' });
    } else {
        alert('Форма не найдена: ' + type);
    }
}

function closeAddForm(formId) {
    var form = document.getElementById(formId);
    if (form) form.style.display = 'none';
}

// ============================================
// ============ ФИЛЬТРЫ ============
// ============================================
function filterCards(type) {
    if (currentFilter === type) {
        currentFilter = 'all';
        document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
    } else {
        currentFilter = type;
        document.querySelectorAll('.filter-btn').forEach(function(btn) { btn.classList.remove('active'); });
        document.querySelectorAll('.filter-btn').forEach(function(btn) {
            var text = btn.textContent;
            if (text.indexOf('Паспорт') !== -1 && type === 'passport') btn.classList.add('active');
            if (text.indexOf('Контакты') !== -1 && type === 'contacts') btn.classList.add('active');
            if (text.indexOf('Даты') !== -1 && type === 'dates') btn.classList.add('active');
            if (text.indexOf('Карьера') !== -1 && type === 'career') btn.classList.add('active');
            if (text.indexOf('Семья') !== -1 && type === 'family') btn.classList.add('active');
            if (text.indexOf('Образование') !== -1 && type === 'education') btn.classList.add('active');
        });
        document.querySelectorAll('#customFilterButtons .filter-btn').forEach(function(btn) {
            if (btn.textContent.indexOf(type.replace('custom_', '')) !== -1) {
                btn.classList.add('active');
            }
        });
    }
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
    var container = document.getElementById('cardsContainer');
    if (!container) return;
    
    var allCards = [];
    var filter = currentFilter;
    var showAll = filter === 'all';
    
    // ====== ПАСПОРТ ======
    if (showAll || filter === 'passport') {
        var passportData = DATA.passport || {};
        var hasData = Object.keys(passportData).length > 0;
        if (hasData) {
            var details = {};
            Object.keys(passportData).forEach(function(key) {
                details[key] = passportData[key] || '—';
            });
            var mainValue = passportData['ФИО'] || 'Паспортные данные';
            var subValue = '';
            if (passportData['Серия'] && passportData['Номер']) {
                subValue = 'Серия ' + passportData['Серия'] + ' № ' + passportData['Номер'];
            } else if (passportData['Серия']) {
                subValue = 'Серия ' + passportData['Серия'];
            } else if (passportData['Номер']) {
                subValue = '№ ' + passportData['Номер'];
            }
            allCards.push({
                id: 'passport_all',
                type: 'passport',
                label: '📇 Паспортные данные',
                value: mainValue,
                sub: subValue,
                details: details,
                deleteType: 'passport_all'
            });
        }
    }
    
    // ====== КОНТАКТЫ ======
    if (showAll || filter === 'contacts') {
        var contactsData = DATA.contacts || {};
        var hasData = Object.keys(contactsData).length > 0;
        if (hasData) {
            var details = {};
            Object.keys(contactsData).forEach(function(key) {
                details[key] = contactsData[key] || '—';
            });
            var keys = Object.keys(contactsData);
            var mainValue = keys.length > 0 ? contactsData[keys[0]] : 'Нет контактов';
            var subValue = keys.length > 0 ? keys.length + ' контактов' : '';
            allCards.push({
                id: 'contacts_all',
                type: 'contacts',
                label: '📱 Контакты',
                value: mainValue,
                sub: subValue,
                details: details,
                deleteType: 'contacts_all'
            });
        }
    }
    
    // ====== ДАТЫ ======
    if (showAll || filter === 'dates') {
        var datesData = DATA.dates || {};
        var hasData = Object.keys(datesData).length > 0;
        if (hasData) {
            var details = {};
            Object.keys(datesData).forEach(function(key) {
                details[key] = datesData[key] || '—';
            });
            var keys = Object.keys(datesData);
            var mainValue = keys.length > 0 ? datesData[keys[0]] : 'Нет дат';
            var subValue = keys.length > 0 ? keys.length + ' дат' : '';
            allCards.push({
                id: 'dates_all',
                type: 'dates',
                label: '📅 Даты',
                value: mainValue,
                sub: subValue,
                details: details,
                deleteType: 'dates_all'
            });
        }
    }
    
    // ====== КАРЬЕРА ======
    if (showAll || filter === 'career') {
        DATA.career.experience.forEach(function(exp) {
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
        DATA.career.skills.forEach(function(skill, i) {
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
        DATA.career.languages.forEach(function(lang, i) {
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
    
    // ====== СЕМЬЯ ======
    if (showAll || filter === 'family') {
        if (DATA.family.spouse) {
            var s = DATA.family.spouse;
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
        DATA.family.children.forEach(function(child) {
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
        if (DATA.family.parents.father) {
            var f = DATA.family.parents.father;
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
            var m = DATA.family.parents.mother;
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
        DATA.family.siblings.forEach(function(sib) {
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
    
    // ====== ОБРАЗОВАНИЕ ======
    if (showAll || filter === 'education') {
        DATA.education.higher.forEach(function(item) {
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
        DATA.education.courses.forEach(function(item) {
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
    
    // ====== КАСТОМНЫЕ ВКЛАДКИ ======
    if (DATA.customTabs) {
        Object.keys(DATA.customTabs).forEach(function(tabId) {
            var tab = DATA.customTabs[tabId];
            if (showAll || filter === 'custom_' + tabId) {
                var tabData = tab.data || {};
                var hasData = Object.keys(tabData).length > 0;
                if (hasData) {
                    var details = {};
                    Object.keys(tabData).forEach(function(key) {
                        details[key] = tabData[key] || '—';
                    });
                    var keys = Object.keys(tabData);
                    var mainValue = keys.length > 0 ? tabData[keys[0]] : 'Нет данных';
                    var subValue = keys.length > 0 ? keys.length + ' полей' : '';
                    allCards.push({
                        id: 'custom_' + tabId + '_all',
                        type: 'custom',
                        label: '📂 ' + tab.name,
                        value: mainValue,
                        sub: subValue,
                        customTabId: tabId,
                        deleteType: 'customTabAll',
                        details: details
                    });
                }
            }
        });
    }
    
    if (allCards.length === 0) {
        container.innerHTML = '<div class="empty-message">📭 Нет данных<br><span style="font-size:14px; color:#bbb;">Нажмите "➕ Добавить" чтобы создать</span></div>';
        return;
    }
    
    var html = '';
    allCards.forEach(function(card) {
        var deleteAttr = '';
        if (card.deleteType === 'experience') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteExperience(' + card.deleteId + ')"';
        } else if (card.deleteType === 'skill') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteSkill(' + card.deleteIndex + ')"';
        } else if (card.deleteType === 'language') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteLanguage(' + card.deleteIndex + ')"';
        } else if (card.deleteType === 'child') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteChild(' + card.deleteId + ')"';
        } else if (card.deleteType === 'sibling') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteSibling(' + card.deleteId + ')"';
        } else if (card.deleteType === 'father') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteParent(\'father\')"';
        } else if (card.deleteType === 'mother') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteParent(\'mother\')"';
        } else if (card.deleteType === 'spouse') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteSpouse()"';
        } else if (card.deleteType === 'higher') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteHigher(' + card.deleteId + ')"';
        } else if (card.deleteType === 'course') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteCourse(' + card.deleteId + ')"';
        } else if (card.deleteType === 'passport_all') {
            deleteAttr = 'onclick="event.stopPropagation(); deletePassportAll()"';
        } else if (card.deleteType === 'contacts_all') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteContactsAll()"';
        } else if (card.deleteType === 'dates_all') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteDatesAll()"';
        } else if (card.deleteType === 'customTabAll') {
            deleteAttr = 'onclick="event.stopPropagation(); deleteCustomTabAll(\'' + card.customTabId + '\')"';
        } else {
            deleteAttr = 'onclick="event.stopPropagation(); deleteCard(\'' + card.id + '\')"';
        }
        
        var safeDetails = JSON.stringify(card.details).replace(/"/g, '&quot;').replace(/'/g, '&#39;');
        var safeId = card.id.replace(/'/g, '\\\'');
        var safeLabel = card.label.replace(/'/g, '\\\'');
        
        html += '<div class="card-item type-' + card.type + '" onclick="openModal(\'' + safeId + '\', \'' + safeLabel + '\', \'' + safeDetails + '\')">';
        html += '<button class="card-delete" ' + deleteAttr + '>✕</button>';
        html += '<div class="card-label">' + card.label + '</div>';
        html += '<div class="card-value">' + card.value + '</div>';
        if (card.sub) html += '<div class="card-sub">' + card.sub + '</div>';
        html += '</div>';
    });
    
    container.innerHTML = html;
}

// ============================================
// ============ МОДАЛЬНОЕ ОКНО ============
// ============================================
function openModal(cardId, title, detailsJSON) {
    var modal = document.getElementById('cardModal');
    if (!modal) return;
    
    currentEditCard = cardId;
    document.getElementById('modalTitle').textContent = title || 'Подробности';
    
    var html = '';
    try {
        var decoded = detailsJSON.replace(/&quot;/g, '"').replace(/&#39;/g, "'");
        var details = JSON.parse(decoded);
        
        if (typeof details === 'object' && details !== null) {
            Object.keys(details).forEach(function(key) {
                var value = details[key];
                if (typeof value === 'string' && value.indexOf('\n') !== -1) {
                    value = value.replace(/\n/g, '<br>');
                }
                html += '<div class="detail-row">';
                html += '<span class="detail-label">' + key + '</span>';
                html += '<span class="detail-value">' + (value || '—') + '</span>';
                html += '</div>';
            });
        } else {
            html = '<p>Нет данных для отображения</p>';
        }
    } catch(e) {
        console.error('Ошибка парсинга:', e);
        html = '<p style="color:red;">Ошибка отображения данных</p>';
    }
    
    document.getElementById('modalBody').innerHTML = html;
    modal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeModal(event) {
    if (event && event.target !== event.currentTarget) return;
    var modal = document.getElementById('cardModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

// ============================================
// ============ РЕДАКТИРОВАНИЕ ============
// ============================================
function openEditModal() {
    if (!currentEditCard) {
        alert('Не выбрана карточка для редактирования');
        return;
    }
    
    closeModal();
    
    var editModal = document.getElementById('editModal');
    var editBody = document.getElementById('editModalBody');
    
    var editData = null;
    var editType = '';
    
    // Проверяем опыт работы
    if (currentEditCard.indexOf('career_exp_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.career.experience.find(function(e) { return e.id === id; });
        if (item) {
            editData = item;
            editType = 'experience';
        }
    }
    
    // Проверяем навыки
    if (!editData && currentEditCard.indexOf('skill_') === 0) {
        var index = parseInt(currentEditCard.split('_')[1]);
        if (DATA.career.skills[index]) {
            editData = { value: DATA.career.skills[index], index: index };
            editType = 'skill';
        }
    }
    
    // Проверяем языки
    if (!editData && currentEditCard.indexOf('language_') === 0) {
        var index = parseInt(currentEditCard.split('_')[1]);
        if (DATA.career.languages[index]) {
            editData = { value: DATA.career.languages[index], index: index };
            editType = 'language';
        }
    }
    
    // Проверяем образование
    if (!editData && currentEditCard.indexOf('edu_higher_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.education.higher.find(function(e) { return e.id === id; });
        if (item) {
            editData = item;
            editType = 'higher';
        }
    }
    
    // Проверяем курсы
    if (!editData && currentEditCard.indexOf('edu_course_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.education.courses.find(function(c) { return c.id === id; });
        if (item) {
            editData = item;
            editType = 'course';
        }
    }
    
    // Проверяем семью - дети
    if (!editData && currentEditCard.indexOf('family_child_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.family.children.find(function(c) { return c.id === id; });
        if (item) {
            editData = item;
            editType = 'family_child';
        }
    }
    
    // Проверяем семью - братья/сестры
    if (!editData && currentEditCard.indexOf('family_sibling_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.family.siblings.find(function(s) { return s.id === id; });
        if (item) {
            editData = item;
            editType = 'family_sibling';
        }
    }
    
    // Проверяем семью - супруг
    if (!editData && currentEditCard === 'family_spouse') {
        if (DATA.family.spouse) {
            editData = DATA.family.spouse;
            editType = 'family_spouse';
        }
    }
    
    // Проверяем семью - отец
    if (!editData && currentEditCard === 'family_father') {
        if (DATA.family.parents.father) {
            editData = DATA.family.parents.father;
            editType = 'family_father';
        }
    }
    
    // Проверяем семью - мать
    if (!editData && currentEditCard === 'family_mother') {
        if (DATA.family.parents.mother) {
            editData = DATA.family.parents.mother;
            editType = 'family_mother';
        }
    }
    
    if (!editData) {
        alert('Редактирование для этого типа карточки пока не поддерживается');
        return;
    }
    
    var formHtml = '';
    
    if (editType === 'experience') {
        formHtml = `
            <div class="form-section">
                <label>Компания</label>
                <input id="edit-company" value="${editData.company || ''}">
            </div>
            <div class="form-section">
                <label>Должность</label>
                <input id="edit-position" value="${editData.position || ''}">
            </div>
            <div class="form-section">
                <label>Период</label>
                <input id="edit-period" value="${editData.period || ''}">
            </div>
            <div class="form-section">
                <label>Обязанности</label>
                <textarea id="edit-responsibilities" rows="3">${editData.responsibilities || ''}</textarea>
            </div>
        `;
    } else if (editType === 'skill') {
        formHtml = `
            <div class="form-section">
                <label>Навык</label>
                <input id="edit-skill" value="${editData.value || ''}">
            </div>
        `;
    } else if (editType === 'language') {
        formHtml = `
            <div class="form-section">
                <label>Язык</label>
                <input id="edit-language" value="${editData.value || ''}">
            </div>
        `;
    } else if (editType === 'higher') {
        formHtml = `
            <div class="form-section">
                <label>Учебное заведение</label>
                <input id="edit-institution" value="${editData.institution || ''}">
            </div>
            <div class="form-section">
                <label>Специальность</label>
                <input id="edit-specialty" value="${editData.specialty || ''}">
            </div>
            <div class="form-section">
                <label>Степень</label>
                <input id="edit-degree" value="${editData.degree || ''}">
            </div>
            <div class="form-section">
                <label>Год окончания</label>
                <input id="edit-year" value="${editData.yearEnd || ''}">
            </div>
        `;
    } else if (editType === 'course') {
        formHtml = `
            <div class="form-section">
                <label>Название курса</label>
                <input id="edit-course-name" value="${editData.name || ''}">
            </div>
            <div class="form-section">
                <label>Платформа</label>
                <input id="edit-course-platform" value="${editData.platform || ''}">
            </div>
            <div class="form-section">
                <label>Год</label>
                <input id="edit-course-year" value="${editData.year || ''}">
            </div>
        `;
    } else if (editType === 'family_child' || editType === 'family_sibling') {
        formHtml = `
            <div class="form-section">
                <label>Имя</label>
                <input id="edit-name" value="${editData.name || ''}">
            </div>
            <div class="form-section">
                <label>Дата рождения</label>
                <input id="edit-birth" value="${editData.birthDate || ''}">
            </div>
            ${editType === 'family_child' ? `
            <div class="form-section">
                <label>Пол</label>
                <input id="edit-gender" value="${editData.gender || ''}">
            </div>` : `
            <div class="form-section">
                <label>Кто</label>
                <input id="edit-relationship" value="${editData.relationship || ''}">
            </div>`}
        `;
    } else if (editType === 'family_spouse' || editType === 'family_father' || editType === 'family_mother') {
        formHtml = `
            <div class="form-section">
                <label>Имя</label>
                <input id="edit-name" value="${editData.name || ''}">
            </div>
            <div class="form-section">
                <label>Дата рождения</label>
                <input id="edit-birth" value="${editData.birthDate || ''}">
            </div>
            <div class="form-section">
                <label>Профессия</label>
                <input id="edit-occupation" value="${editData.occupation || ''}">
            </div>
        `;
    }
    
    editBody.innerHTML = formHtml;
    editModal.style.display = 'block';
    document.body.style.overflow = 'hidden';
}

function closeEditModal(event) {
    if (event && event.target !== event.currentTarget) return;
    var modal = document.getElementById('editModal');
    if (modal) {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }
}

function saveEdit() {
    if (!currentEditCard) {
        alert('Нет данных для сохранения');
        return;
    }
    
    if (currentEditCard.indexOf('career_exp_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.career.experience.find(function(e) { return e.id === id; });
        if (item) {
            var companyEl = document.getElementById('edit-company');
            var positionEl = document.getElementById('edit-position');
            var periodEl = document.getElementById('edit-period');
            var respEl = document.getElementById('edit-responsibilities');
            
            if (companyEl) item.company = companyEl.value.trim() || item.company;
            if (positionEl) item.position = positionEl.value.trim() || item.position;
            if (periodEl) item.period = periodEl.value.trim() || item.period;
            if (respEl) item.responsibilities = respEl.value.trim() || item.responsibilities;
        }
    } else if (currentEditCard.indexOf('skill_') === 0) {
        var index = parseInt(currentEditCard.split('_')[1]);
        var skillEl = document.getElementById('edit-skill');
        if (skillEl && skillEl.value.trim()) {
            DATA.career.skills[index] = skillEl.value.trim();
        }
    } else if (currentEditCard.indexOf('language_') === 0) {
        var index = parseInt(currentEditCard.split('_')[1]);
        var langEl = document.getElementById('edit-language');
        if (langEl && langEl.value.trim()) {
            DATA.career.languages[index] = langEl.value.trim();
        }
    } else if (currentEditCard.indexOf('edu_higher_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.education.higher.find(function(e) { return e.id === id; });
        if (item) {
            var instEl = document.getElementById('edit-institution');
            var specEl = document.getElementById('edit-specialty');
            var degEl = document.getElementById('edit-degree');
            var yearEl = document.getElementById('edit-year');
            
            if (instEl) item.institution = instEl.value.trim() || item.institution;
            if (specEl) item.specialty = specEl.value.trim() || item.specialty;
            if (degEl) item.degree = degEl.value.trim() || item.degree;
            if (yearEl) item.yearEnd = yearEl.value.trim() || item.yearEnd;
        }
    } else if (currentEditCard.indexOf('edu_course_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.education.courses.find(function(c) { return c.id === id; });
        if (item) {
            var nameEl = document.getElementById('edit-course-name');
            var platEl = document.getElementById('edit-course-platform');
            var yearEl = document.getElementById('edit-course-year');
            
            if (nameEl) item.name = nameEl.value.trim() || item.name;
            if (platEl) item.platform = platEl.value.trim() || item.platform;
            if (yearEl) item.year = yearEl.value.trim() || item.year;
        }
    } else if (currentEditCard.indexOf('family_child_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.family.children.find(function(c) { return c.id === id; });
        if (item) {
            var nameEl = document.getElementById('edit-name');
            var birthEl = document.getElementById('edit-birth');
            var genderEl = document.getElementById('edit-gender');
            
            if (nameEl) item.name = nameEl.value.trim() || item.name;
            if (birthEl) item.birthDate = birthEl.value.trim() || item.birthDate;
            if (genderEl) item.gender = genderEl.value.trim() || item.gender;
        }
    } else if (currentEditCard.indexOf('family_sibling_') === 0) {
        var id = parseInt(currentEditCard.split('_')[2]);
        var item = DATA.family.siblings.find(function(s) { return s.id === id; });
        if (item) {
            var nameEl = document.getElementById('edit-name');
            var birthEl = document.getElementById('edit-birth');
            var relEl = document.getElementById('edit-relationship');
            
            if (nameEl) item.name = nameEl.value.trim() || item.name;
            if (birthEl) item.birthDate = birthEl.value.trim() || item.birthDate;
            if (relEl) item.relationship = relEl.value.trim() || item.relationship;
        }
    } else if (currentEditCard === 'family_spouse') {
        if (DATA.family.spouse) {
            var nameEl = document.getElementById('edit-name');
            var birthEl = document.getElementById('edit-birth');
            var occEl = document.getElementById('edit-occupation');
            
            if (nameEl) DATA.family.spouse.name = nameEl.value.trim() || DATA.family.spouse.name;
            if (birthEl) DATA.family.spouse.birthDate = birthEl.value.trim() || DATA.family.spouse.birthDate;
            if (occEl) DATA.family.spouse.occupation = occEl.value.trim() || DATA.family.spouse.occupation;
        }
    } else if (currentEditCard === 'family_father') {
        if (DATA.family.parents.father) {
            var nameEl = document.getElementById('edit-name');
            var birthEl = document.getElementById('edit-birth');
            var occEl = document.getElementById('edit-occupation');
            
            if (nameEl) DATA.family.parents.father.name = nameEl.value.trim() || DATA.family.parents.father.name;
            if (birthEl) DATA.family.parents.father.birthDate = birthEl.value.trim() || DATA.family.parents.father.birthDate;
            if (occEl) DATA.family.parents.father.occupation = occEl.value.trim() || DATA.family.parents.father.occupation;
        }
    } else if (currentEditCard === 'family_mother') {
        if (DATA.family.parents.mother) {
            var nameEl = document.getElementById('edit-name');
            var birthEl = document.getElementById('edit-birth');
            var occEl = document.getElementById('edit-occupation');
            
            if (nameEl) DATA.family.parents.mother.name = nameEl.value.trim() || DATA.family.parents.mother.name;
            if (birthEl) DATA.family.parents.mother.birthDate = birthEl.value.trim() || DATA.family.parents.mother.birthDate;
            if (occEl) DATA.family.parents.mother.occupation = occEl.value.trim() || DATA.family.parents.mother.occupation;
        }
    }
    
    closeEditModal();
    renderAll();
    alert('✅ Данные обновлены!');
}

// ============================================
// ============ ФУНКЦИИ ДОБАВЛЕНИЯ ============
// ============================================
function addPassportFull() {
    var fields = {
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
    
    if (!fields['ФИО']) {
        alert('Пожалуйста, заполните ФИО!');
        return;
    }
    
    Object.keys(fields).forEach(function(key) {
        if (fields[key]) {
            DATA.passport[key] = fields[key];
        }
    });
    
    document.querySelectorAll('#passport-form input').forEach(function(input) { input.value = ''; });
    closeAddForm('passport-form');
    renderAll();
}

function addContactsField() {
    var key = document.getElementById('contacts-type').value.trim();
    var value = document.getElementById('contacts-value').value.trim();
    if (!key) { alert('Введите тип контакта!'); return; }
    if (!DATA.contacts) DATA.contacts = {};
    DATA.contacts[key] = value || '—';
    document.getElementById('contacts-type').value = '';
    document.getElementById('contacts-value').value = '';
    closeAddForm('contacts-form');
    renderAll();
}

function addDatesField() {
    var key = document.getElementById('dates-name').value.trim();
    var value = document.getElementById('dates-value').value.trim();
    if (!key) { alert('Введите название события!'); return; }
    if (!DATA.dates) DATA.dates = {};
    DATA.dates[key] = value || '—';
    document.getElementById('dates-name').value = '';
    document.getElementById('dates-value').value = '';
    closeAddForm('dates-form');
    renderAll();
}

function addCareerExperience() {
    var period = document.getElementById('career-period').value.trim();
    var position = document.getElementById('career-position').value.trim();
    var company = document.getElementById('career-company').value.trim();
    var responsibilities = document.getElementById('career-responsibilities').value.trim();
    if (!position || !company) { alert('Заполните должность и компанию!'); return; }
    DATA.career.experience.push({ id: idCounter++, period: period || '—', position: position, company: company, responsibilities: responsibilities || '—' });
    document.getElementById('career-period').value = '';
    document.getElementById('career-position').value = '';
    document.getElementById('career-company').value = '';
    document.getElementById('career-responsibilities').value = '';
    closeAddForm('career-form');
    renderAll();
}

function addSkillField() {
    var name = document.getElementById('skill-name').value.trim();
    if (!name) { alert('Введите название навыка!'); return; }
    DATA.career.skills.push(name);
    document.getElementById('skill-name').value = '';
    closeAddForm('skill-form');
    renderAll();
}

function addLanguageField() {
    var name = document.getElementById('language-name').value.trim();
    if (!name) { alert('Введите название языка!'); return; }
    DATA.career.languages.push(name);
    document.getElementById('language-name').value = '';
    closeAddForm('language-form');
    renderAll();
}

function addFamilyMember() {
    var name = document.getElementById('family-name').value.trim();
    var birth = document.getElementById('family-birth').value.trim();
    var occupation = document.getElementById('family-occupation').value.trim();
    var select = document.getElementById('family-type-select');
    var type = select ? select.value : '';
    
    if (type === 'другой') {
        type = document.getElementById('family-custom-type').value.trim().toLowerCase();
        if (!type) {
            alert('Пожалуйста, укажите кто это!');
            return;
        }
    }
    
    if (!name) {
        alert('Введите имя!');
        return;
    }
    
    if (!type) {
        alert('Выберите или укажите кто это!');
        return;
    }
    
    var member = { 
        name: name, 
        birthDate: birth || '—', 
        occupation: occupation || '' 
    };
    
    var typeLower = type.toLowerCase();
    var relationshipMap = {
        'отец': { target: 'father', label: 'Отец' },
        'мать': { target: 'mother', label: 'Мать' },
        'супруг': { target: 'spouse', label: 'Супруг' },
        'супруга': { target: 'spouse', label: 'Супруга' },
        'сын': { target: 'child', label: 'Сын' },
        'дочь': { target: 'child', label: 'Дочь' },
        'ребенок': { target: 'child', label: 'Ребенок' },
        'брат': { target: 'sibling', label: 'Брат' },
        'сестра': { target: 'sibling', label: 'Сестра' },
        'дедушка': { target: 'sibling', label: 'Дедушка' },
        'бабушка': { target: 'sibling', label: 'Бабушка' }
    };
    
    var relation = relationshipMap[typeLower];
    
    if (relation) {
        switch(relation.target) {
            case 'father':
                DATA.family.parents.father = { ...member };
                break;
            case 'mother':
                DATA.family.parents.mother = { ...member };
                break;
            case 'spouse':
                DATA.family.spouse = { ...member };
                break;
            case 'child':
                DATA.family.children.push({ 
                    id: idCounter++, 
                    ...member, 
                    gender: relation.label === 'Сын' ? 'Мужской' : relation.label === 'Дочь' ? 'Женский' : ''
                });
                break;
            case 'sibling':
                DATA.family.siblings.push({ 
                    id: idCounter++, 
                    ...member, 
                    relationship: relation.label 
                });
                break;
            default:
                DATA.family.siblings.push({ 
                    id: idCounter++, 
                    ...member, 
                    relationship: type 
                });
        }
    } else {
        DATA.family.siblings.push({ 
            id: idCounter++, 
            ...member, 
            relationship: type 
        });
    }
    
    document.getElementById('family-name').value = '';
    document.getElementById('family-birth').value = '';
    document.getElementById('family-occupation').value = '';
    if (select) select.value = '';
    document.getElementById('family-custom-type').value = '';
    document.getElementById('family-custom-type-container').style.display = 'none';
    
    closeAddForm('family-form');
    renderAll();
}

function addEducationField() {
    var institution = document.getElementById('edu-institution').value.trim();
    var specialty = document.getElementById('edu-specialty').value.trim();
    var degree = document.getElementById('edu-degree').value.trim();
    var year = document.getElementById('edu-year').value.trim();
    if (!institution) { alert('Введите название!'); return; }
    DATA.education.higher.push({ id: idCounter++, institution: institution, specialty: specialty || '—', degree: degree || '—', yearEnd: year || '—' });
    document.getElementById('edu-institution').value = '';
    document.getElementById('edu-specialty').value = '';
    document.getElementById('edu-degree').value = '';
    document.getElementById('edu-year').value = '';
    closeAddForm('education-form');
    renderAll();
}

function addCourseField() {
    var name = document.getElementById('course-name').value.trim();
    var platform = document.getElementById('course-platform').value.trim();
    if (!name) { alert('Введите название курса!'); return; }
    DATA.education.courses.push({ id: idCounter++, name: name, platform: platform || '—', year: '', hours: '' });
    document.getElementById('course-name').value = '';
    document.getElementById('course-platform').value = '';
    closeAddForm('course-form');
    renderAll();
}

// ============================================
// ============ ФУНКЦИИ УДАЛЕНИЯ ============
// ============================================
function deletePassportAll() {
    if (confirm('Удалить все паспортные данные?')) {
        DATA.passport = {};
        renderAll();
    }
}

function deleteContactsAll() {
    if (confirm('Удалить все контакты?')) {
        DATA.contacts = {};
        renderAll();
    }
}

function deleteDatesAll() {
    if (confirm('Удалить все даты?')) {
        DATA.dates = {};
        renderAll();
    }
}

function deleteCustomTabAll(tabId) {
    if (confirm('Удалить все данные из вкладки "' + DATA.customTabs[tabId].name + '"?')) {
        if (DATA.customTabs[tabId]) {
            DATA.customTabs[tabId].data = {};
            renderAll();
        }
    }
}

function deleteExperience(id) {
    if (confirm('Удалить запись о работе?')) {
        DATA.career.experience = DATA.career.experience.filter(function(e) { return e.id !== id; });
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
        DATA.family.children = DATA.family.children.filter(function(c) { return c.id !== id; });
        renderAll();
    }
}

function deleteSibling(id) {
    if (confirm('Удалить брата/сестру?')) {
        DATA.family.siblings = DATA.family.siblings.filter(function(s) { return s.id !== id; });
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
        DATA.education.higher = DATA.education.higher.filter(function(item) { return item.id !== id; });
        renderAll();
    }
}

function deleteCourse(id) {
    if (confirm('Удалить курс?')) {
        DATA.education.courses = DATA.education.courses.filter(function(item) { return item.id !== id; });
        renderAll();
    }
}

function deleteCard(id) {
    if (confirm('Удалить?')) {
        var parts = id.split('_');
        if (parts[0] === 'custom') {
            var tabId = parts[1];
            var key = parts.slice(2).join('_');
            deleteCustomField(tabId, key);
        }
    }
}

function deleteCustomField(tabId, key) {
    if (confirm('Удалить поле "' + key + '"?')) {
        if (DATA.customTabs[tabId]) {
            delete DATA.customTabs[tabId].data[key];
            renderAll();
        }
    }
}

// ============================================
// ============ КАСТОМНЫЕ ВКЛАДКИ ============
// ============================================
function showAddTabForm() {
    var form = document.getElementById('newtab-form');
    if (form) {
        form.style.display = form.style.display === 'block' ? 'none' : 'block';
    }
}

function addNewTab() {
    var name = document.getElementById('new-tab-name').value.trim();
    if (!name) {
        alert('Введите название вкладки!');
        return;
    }

    var tabId = 'tab_' + (++tabCounter);
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
    var customFilterContainer = document.getElementById('customFilterButtons');
    var customDropdownContainer = document.getElementById('customDropdownItems');
    if (customFilterContainer) customFilterContainer.innerHTML = '';
    if (customDropdownContainer) customDropdownContainer.innerHTML = '';
    
    if (DATA.customTabs) {
        Object.keys(DATA.customTabs).forEach(function(tabId) {
            var tab = DATA.customTabs[tabId];
            addCustomFilterButton(tabId, tab.name);
            addCustomDropdownItem(tabId, tab.name);
        });
    }
}

function addCustomFilterButton(tabId, name) {
    var container = document.getElementById('customFilterButtons');
    if (!container) return;
    var btn = document.createElement('button');
    btn.className = 'filter-btn';
    btn.textContent = '📂 ' + name;
    btn.onclick = function() { filterCards('custom_' + tabId); };
    container.appendChild(btn);
}

function addCustomDropdownItem(tabId, name) {
    var container = document.getElementById('customDropdownItems');
    if (!container) return;
    var btn = document.createElement('button');
    btn.textContent = '📂 ' + name;
    btn.onclick = function() { 
        openAddForm('custom_' + tabId);
    };
    container.appendChild(btn);
}

// ============================================
// ============ ЭКСПОРТ / ИМПОРТ ============
// ============================================
function saveToFile() {
    var blob = new Blob([JSON.stringify(DATA, null, 2)], { type: 'application/json' });
    var url = URL.createObjectURL(blob);
    var a = document.createElement('a');
    a.href = url;
    a.download = 'profile_data.json';
    a.click();
    URL.revokeObjectURL(url);
}

function loadFromFile() {
    document.getElementById('fileInput').click();
}

function handleFileUpload(event) {
    var file = event.target.files[0];
    if (!file) return;
    var reader = new FileReader();
    reader.onload = function(e) {
        try {
            DATA = JSON.parse(e.target.result);
            var allIds = [];
            DATA.career.experience.forEach(function(exp) { allIds.push(exp.id); });
            DATA.family.children.forEach(function(c) { allIds.push(c.id); });
            DATA.family.siblings.forEach(function(s) { allIds.push(s.id); });
            DATA.education.higher.forEach(function(h) { allIds.push(h.id); });
            DATA.education.additional.forEach(function(a) { allIds.push(a.id); });
            DATA.education.courses.forEach(function(c) { allIds.push(c.id); });
            idCounter = allIds.length > 0 ? Math.max.apply(null, allIds) + 1 : 1;
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

window.addEventListener('beforeunload', function() {
    saveToStorage();
});
