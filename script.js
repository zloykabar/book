// ============================================
// ДАННЫЕ (можно менять)
// ============================================
let DATA = {
    passport: {},
    career: {
        experience: [],
        skills: [],
        languages: []
    },
    family: {
        spouse: null,
        children: [],
        parents: { father: null, mother: null },
        siblings: []
    },
    education: {
        higher: [],
        additional: [],
        courses: []
    }
};

// ============================================
// ID для уникальности
// ============================================
let idCounter = 0;

// ============================================
// ЗАГРУЗКА ПРИ СТАРТЕ
// ============================================
window.onload = function() {
    // Попробуем загрузить сохранённые данные из localStorage
    const saved = localStorage.getItem('profileData');
    if (saved) {
        try {
            DATA = JSON.parse(saved);
        } catch(e) {}
    } else {
        // Если нет сохранённых - загружаем пример
        loadExampleData();
    }
    renderAll();
};

// ============================================
// ПРИМЕРНЫЕ ДАННЫЕ
// ============================================
function loadExampleData() {
    DATA = {
        passport: {
            'ФИО': 'Иванов Иван Иванович',
            'Дата рождения': '15.05.1990',
            'Место рождения': 'г. Москва, Россия',
            'Гражданство': 'Российская Федерация',
            'Пол': 'Мужской',
            'Серия и номер': '45 12 345678',
            'Кем выдан': 'Отделом УФМС России',
            'Дата выдачи': '20.06.2015',
            'Срок действия': '20.06.2025',
            'Регистрация': 'г. Москва, ул. Тверская, д. 10'
        },
        career: {
            experience: [
                { id: ++idCounter, period: '2020–н.в.', position: 'Senior Engineer', company: 'ТехноПро', responsibilities: 'Разработка архитектуры' },
                { id: ++idCounter, period: '2017–2020', position: 'Engineer', company: 'ИнноСистемы', responsibilities: 'Разработка приложений' }
            ],
            skills: ['JavaScript', 'React', 'Node.js', 'Python'],
            languages: ['Русский', 'Английский']
        },
        family: {
            spouse: { name: 'Иванова Мария', birthDate: '12.08.1992', occupation: 'Врач' },
            children: [
                { id: ++idCounter, name: 'Иванов Алексей', birthDate: '05.03.2018', gender: 'Мужской' },
                { id: ++idCounter, name: 'Иванова Анна', birthDate: '20.11.2021', gender: 'Женский' }
            ],
            parents: {
                father: { name: 'Иванов Иван', birthDate: '10.02.1965', occupation: 'Инженер' },
                mother: { name: 'Иванова Елена', birthDate: '25.07.1967', occupation: 'Учитель' }
            },
            siblings: [
                { id: ++idCounter, name: 'Петрова Ольга', birthDate: '18.12.1995', relationship: 'Сестра' }
            ]
        },
        education: {
            higher: [
                { id: ++idCounter, institution: 'МГТУ им. Баумана', faculty: 'Информатики', specialty: 'Прикладная математика', degree: 'Магистр', yearStart: 2007, yearEnd: 2013, gpa: 4.8 }
            ],
            additional: [
                { id: ++idCounter, name: 'Full Stack Web', institution: 'Coursera', year: 2016, certificate: 'Сертификат' }
            ],
            courses: [
                { id: ++idCounter, name: 'Machine Learning', platform: 'Coursera', year: 2019, hours: 120 }
            ]
        }
    };
}

// ============================================
// СОХРАНЕНИЕ В localStorage
// ============================================
function saveToStorage() {
    localStorage.setItem('profileData', JSON.stringify(DATA));
}

// ============================================
// ОТРИСОВКА ВСЕГО
// ============================================
function renderAll() {
    renderPassport();
    renderCareer();
    renderFamily();
    renderEducation();
    saveToStorage();
}

// ============================================
// ============ ПАСПОРТ ============
// ============================================
function renderPassport() {
    const container = document.getElementById('passport-data');
    const p = DATA.passport;
    const keys = Object.keys(p);
    
    if (keys.length === 0) {
        container.innerHTML = '<p style="color:#999; text-align:center; padding:20px;">Нет данных. Добавьте поле!</p>';
        return;
    }
    
    let html = '<div class="data-grid">';
    keys.forEach(key => {
        html += `
            <div class="data-item" data-key="${key}">
                <span class="label">${key}</span>
                <input class="value-input" value="${p[key]}" onchange="updatePassportField('${key}', this.value)" />
                <button onclick="deletePassportField('${key}')" style="background:#dc3545;color:white;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;">✕</button>
            </div>
        `;
    });
    html += '</div>';
    container.innerHTML = html;
}

function updatePassportField(key, value) {
    DATA.passport[key] = value;
    saveToStorage();
}

function deletePassportField(key) {
    if (confirm(`Удалить поле "${key}"?`)) {
        delete DATA.passport[key];
        renderPassport();
        saveToStorage();
    }
}

function showAddForm(type) {
    const formContainer = document.getElementById(type + '-form');
    if (formContainer.style.display === 'block') {
        formContainer.style.display = 'none';
        return;
    }
    
    let html = '';
    
    if (type === 'passport') {
        html = `
            <h4>Добавить поле в паспорт</h4>
            <div class="form-row">
                <input id="passport-key" placeholder="Название поля (например: Телефон)" />
                <input id="passport-value" placeholder="Значение" />
            </div>
            <div class="form-actions">
                <button class="save-btn" onclick="addPassportField()">✅ Добавить</button>
                <button class="cancel-btn" onclick="document.getElementById('passport-form').style.display='none'">❌ Отмена</button>
            </div>
        `;
    }
    
    else if (type === 'career') {
        html = `
            <h4>➕ Добавить место работы</h4>
            <input id="career-period" placeholder="Период (например: 2020–н.в.)" />
            <input id="career-position" placeholder="Должность" />
            <input id="career-company" placeholder="Компания" />
            <textarea id="career-responsibilities" placeholder="Обязанности" rows="2"></textarea>
            <div class="form-actions">
                <button class="save-btn" onclick="addCareerExperience()">✅ Добавить</button>
                <button class="cancel-btn" onclick="document.getElementById('career-form').style.display='none'">❌ Отмена</button>
            </div>
            <hr style="margin:15px 0;" />
            <h4>🏷️ Добавить навык</h4>
            <div style="display:flex; gap:10px;">
                <input id="career-skill" placeholder="Навык (например: Docker)" style="flex:1;" />
                <button class="save-btn" onclick="addCareerSkill()">➕</button>
            </div>
            <hr style="margin:15px 0;" />
            <h4>🌍 Добавить язык</h4>
            <div style="display:flex; gap:10px;">
                <input id="career-language" placeholder="Язык (например: Немецкий)" style="flex:1;" />
                <button class="save-btn" onclick="addCareerLanguage()">➕</button>
            </div>
        `;
    }
    
    else if (type === 'family') {
        html = `
            <h4>➕ Добавить члена семьи</h4>
            <div class="form-row">
                <input id="family-name" placeholder="ФИО" />
                <input id="family-birth" placeholder="Дата рождения" />
            </div>
            <input id="family-type" placeholder="Кто? (ребенок, брат, сестра, отец, мать)" />
            <input id="family-occupation" placeholder="Профессия (необязательно)" />
            <div class="form-actions">
                <button class="save-btn" onclick="addFamilyMember()">✅ Добавить</button>
                <button class="cancel-btn" onclick="document.getElementById('family-form').style.display='none'">❌ Отмена</button>
            </div>
        `;
    }
    
    else if (type === 'education') {
        html = `
            <h4>➕ Добавить образование</h4>
            <div class="form-row">
                <input id="edu-institution" placeholder="Учебное заведение" />
                <input id="edu-specialty" placeholder="Специальность" />
            </div>
            <div class="form-row">
                <input id="edu-degree" placeholder="Степень (Бакалавр/Магистр)" />
                <input id="edu-year" placeholder="Год окончания" />
            </div>
            <div class="form-actions">
                <button class="save-btn" onclick="addEducation()">✅ Добавить</button>
                <button class="cancel-btn" onclick="document.getElementById('education-form').style.display='none'">❌ Отмена</button>
            </div>
            <hr style="margin:15px 0;" />
            <h4>📚 Добавить курс</h4>
            <div class="form-row">
                <input id="edu-course-name" placeholder="Название курса" />
                <input id="edu-course-platform" placeholder="Платформа" />
            </div>
            <div class="form-actions">
                <button class="save-btn" onclick="addCourse()">✅ Добавить курс</button>
            </div>
        `;
    }
    
    formContainer.innerHTML = html;
    formContainer.style.display = 'block';
}

// ============================================
// ДОБАВЛЕНИЕ В ПАСПОРТ
// ============================================
function addPassportField() {
    const key = document.getElementById('passport-key').value.trim();
    const value = document.getElementById('passport-value').value.trim();
    if (!key) { alert('Введите название поля!'); return; }
    DATA.passport[key] = value || '—';
    document.getElementById('passport-form').style.display = 'none';
    renderPassport();
    saveToStorage();
}

// ============================================
// ============ КАРЬЕРА ============
// ============================================
function renderCareer() {
    const c = DATA.career;
    let html = '';
    
    // Опыт работы
    if (c.experience && c.experience.length > 0) {
        html += `<h3>📌 Опыт работы</h3>`;
        c.experience.forEach(exp => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteCareerExperience(${exp.id})">✕</button>
                    </div>
                    <h4>${exp.position}</h4>
                    <div class="sub">${exp.company} • ${exp.period}</div>
                    <p style="margin-top:6px;">${exp.responsibilities || ''}</p>
                </div>
            `;
        });
    }
    
    // Навыки
    if (c.skills && c.skills.length > 0) {
        html += `<h3>🛠 Навыки</h3><div>`;
        c.skills.forEach((skill, index) => {
            html += `<span class="skill-tag" onclick="deleteCareerSkill(${index})">${skill} ✕</span>`;
        });
        html += `</div>`;
    }
    
    // Языки
    if (c.languages && c.languages.length > 0) {
        html += `<h3 style="margin-top:20px;">🌍 Языки</h3><ul style="padding-left:20px;">`;
        c.languages.forEach((lang, index) => {
            html += `<li>${lang} <button onclick="deleteCareerLanguage(${index})" style="background:#dc3545;color:white;border:none;border-radius:4px;padding:2px 8px;cursor:pointer;margin-left:8px;">✕</button></li>`;
        });
        html += `</ul>`;
    }
    
    if (!html) {
        html = '<p style="color:#999; text-align:center; padding:20px;">Нет данных о карьере. Добавьте!</p>';
    }
    
    document.getElementById('career-data').innerHTML = html;
}

function addCareerExperience() {
    const period = document.getElementById('career-period').value.trim();
    const position = document.getElementById('career-position').value.trim();
    const company = document.getElementById('career-company').value.trim();
    const responsibilities = document.getElementById('career-responsibilities').value.trim();
    
    if (!position || !company) {
        alert('Заполните должность и компанию!');
        return;
    }
    
    DATA.career.experience.push({
        id: ++idCounter,
        period: period || '—',
        position: position,
        company: company,
        responsibilities: responsibilities || '—'
    });
    
    document.getElementById('career-form').style.display = 'none';
    renderCareer();
    saveToStorage();
}

function deleteCareerExperience(id) {
    if (confirm('Удалить запись о работе?')) {
        DATA.career.experience = DATA.career.experience.filter(exp => exp.id !== id);
        renderCareer();
        saveToStorage();
    }
}

function addCareerSkill() {
    const skill = document.getElementById('career-skill').value.trim();
    if (!skill) { alert('Введите навык!'); return; }
    DATA.career.skills.push(skill);
    document.getElementById('career-skill').value = '';
    renderCareer();
    saveToStorage();
}

function deleteCareerSkill(index) {
    DATA.career.skills.splice(index, 1);
    renderCareer();
    saveToStorage();
}

function addCareerLanguage() {
    const lang = document.getElementById('career-language').value.trim();
    if (!lang) { alert('Введите язык!'); return; }
    DATA.career.languages.push(lang);
    document.getElementById('career-language').value = '';
    renderCareer();
    saveToStorage();
}

function deleteCareerLanguage(index) {
    DATA.career.languages.splice(index, 1);
    renderCareer();
    saveToStorage();
}

// ============================================
// ============ СЕМЬЯ ============
// ============================================
function renderFamily() {
    const f = DATA.family;
    let html = '';
    
    // Супруг
    if (f.spouse) {
        html += `
            <div class="card">
                <div class="card-actions">
                    <button class="delete-btn" onclick="deleteSpouse()">✕</button>
                </div>
                <h4>💑 Супруг(а)</h4>
                <p><strong>${f.spouse.name}</strong> (${f.spouse.birthDate || '—'})<br />${f.spouse.occupation || ''}</p>
            </div>
        `;
    }
    
    // Дети
    if (f.children && f.children.length > 0) {
        html += `<h3>👶 Дети</h3>`;
        f.children.forEach(child => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteChild(${child.id})">✕</button>
                    </div>
                    <p><strong>${child.name}</strong> (${child.birthDate || '—'}) — ${child.gender || ''}</p>
                </div>
            `;
        });
    }
    
    // Родители
    if (f.parents.father || f.parents.mother) {
        html += `<h3>👨‍👩‍👦 Родители</h3>`;
        if (f.parents.father) {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteParent('father')">✕</button>
                    </div>
                    <p><strong>Отец:</strong> ${f.parents.father.name} (${f.parents.father.birthDate || '—'})<br />${f.parents.father.occupation || ''}</p>
                </div>
            `;
        }
        if (f.parents.mother) {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteParent('mother')">✕</button>
                    </div>
                    <p><strong>Мать:</strong> ${f.parents.mother.name} (${f.parents.mother.birthDate || '—'})<br />${f.parents.mother.occupation || ''}</p>
                </div>
            `;
        }
    }
    
    // Братья/сёстры
    if (f.siblings && f.siblings.length > 0) {
        html += `<h3>👫 Братья/Сёстры</h3>`;
        f.siblings.forEach(sib => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteSibling(${sib.id})">✕</button>
                    </div>
                    <p><strong>${sib.name}</strong> (${sib.birthDate || '—'}) — ${sib.relationship || ''}</p>
                </div>
            `;
        });
    }
    
    if (!html) {
        html = '<p style="color:#999; text-align:center; padding:20px;">Нет данных о семье. Добавьте!</p>';
    }
    
    document.getElementById('family-data').innerHTML = html;
}

function addFamilyMember() {
    const name = document.getElementById('family-name').value.trim();
    const birth = document.getElementById('family-birth').value.trim();
    const type = document.getElementById('family-type').value.trim().toLowerCase();
    const occupation = document.getElementById('family-occupation').value.trim();
    
    if (!name) { alert('Введите имя!'); return; }
    
    const member = { name, birthDate: birth || '—', occupation: occupation || '' };
    
    if (type === 'ребенок' || type === 'ребёнок' || type === 'child') {
        DATA.family.children.push({ id: ++idCounter, ...member, gender: '' });
    } else if (type === 'брат' || type === 'сестра' || type === 'sibling') {
        DATA.family.siblings.push({ id: ++idCounter, ...member, relationship: type });
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
    
    document.getElementById('family-form').style.display = 'none';
    renderFamily();
    saveToStorage();
}

function deleteChild(id) {
    if (confirm('Удалить ребенка?')) {
        DATA.family.children = DATA.family.children.filter(c => c.id !== id);
        renderFamily();
        saveToStorage();
    }
}

function deleteSibling(id) {
    if (confirm('Удалить брата/сестру?')) {
        DATA.family.siblings = DATA.family.siblings.filter(s => s.id !== id);
        renderFamily();
        saveToStorage();
    }
}

function deleteParent(role) {
    if (confirm(`Удалить ${role === 'father' ? 'отца' : 'мать'}?`)) {
        DATA.family.parents[role] = null;
        renderFamily();
        saveToStorage();
    }
}

function deleteSpouse() {
    if (confirm('Удалить супруга(у)?')) {
        DATA.family.spouse = null;
        renderFamily();
        saveToStorage();
    }
}

// ============================================
// ============ ОБРАЗОВАНИЕ ============
// ============================================
function renderEducation() {
    const e = DATA.education;
    let html = '';
    
    if (e.higher && e.higher.length > 0) {
        html += `<h3>🎓 Высшее образование</h3>`;
        e.higher.forEach(item => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteHigher(${item.id})">✕</button>
                    </div>
                    <h4>${item.institution}</h4>
                    <div class="sub">${item.faculty || ''}</div>
                    <div class="sub">${item.specialty || ''} — ${item.degree || ''} (${item.yearStart || ''}–${item.yearEnd || ''})</div>
                    ${item.gpa ? `<div class="sub">Средний балл: ${item.gpa}</div>` : ''}
                </div>
            `;
        });
    }
    
    if (e.additional && e.additional.length > 0) {
        html += `<h3>📚 Дополнительное образование</h3>`;
        e.additional.forEach(item => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteAdditional(${item.id})">✕</button>
                    </div>
                    <h4>${item.name}</h4>
                    <div class="sub">${item.institution || ''} (${item.year || ''})</div>
                    ${item.certificate ? `<div class="sub">${item.certificate}</div>` : ''}
                </div>
            `;
        });
    }
    
    if (e.courses && e.courses.length > 0) {
        html += `<h3>📖 Курсы</h3>`;
        e.courses.forEach(item => {
            html += `
                <div class="card">
                    <div class="card-actions">
                        <button class="delete-btn" onclick="deleteCourse(${item.id})">✕</button>
                    </div>
                    <h4>${item.name}</h4>
                    <div class="sub">${item.platform || ''} (${item.year || ''})${item.hours ? ` — ${item.hours} часов` : ''}</div>
                </div>
            `;
        });
    }
    
    if (!html) {
        html = '<p style="color:#999; text-align:center; padding:20px;">Нет данных об образовании. Добавьте!</p>';
    }
    
    document.getElementById('education-data').innerHTML = html;
}

function addEducation() {
    const institution = document.getElementById('edu-institution').value.trim();
    const specialty = document.getElementById('edu-specialty').value.trim();
    const degree = document.getElementById('edu-degree').value.trim();
    const year = document.getElementById('edu-year').value.trim();
    
    if (!institution) { alert('Введите название учебного заведения!'); return; }
    
    DATA.education.higher.push({
        id: ++idCounter,
        institution,
        faculty: '',
        specialty: specialty || '—',
        degree: degree || '—',
        yearStart: '',
        yearEnd: year || '—',
        gpa: ''
    });
    
    document.getElementById('education-form').style.display = 'none';
    renderEducation();
    saveToStorage();
}

function addCourse() {
    const name = document.getElementById('edu-course-name').value.trim();
    const platform = document.getElementById('edu-course-platform').value.trim();
    
    if (!name) { alert('Введите название курса!'); return; }
    
    DATA.education.courses.push({
        id: ++idCounter,
        name,
        platform: platform || '—',
        year: '',
        hours: ''
    });
    
    document.getElementById('edu-course-name').value = '';
    document.getElementById('edu-course-platform').value = '';
    renderEducation();
    saveToStorage();
}

function deleteHigher(id) {
    if (confirm('Удалить запись об образовании?')) {
        DATA.education.higher = DATA.education.higher.filter(item => item.id !== id);
        renderEducation();
        saveToStorage();
    }
}

function deleteAdditional(id) {
    if (confirm('Удалить запись?')) {
        DATA.education.additional = DATA.education.additional.filter(item => item.id !== id);
        renderEducation();
        saveToStorage();
    }
}

function deleteCourse(id) {
    if (confirm('Удалить курс?')) {
        DATA.education.courses = DATA.education.courses.filter(item => item.id !== id);
        renderEducation();
        saveToStorage();
    }
}

// ============================================
// ============ ВКЛАДКИ ============
// ============================================
function showTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    document.querySelectorAll('.tab-btn').forEach(btn => btn.classList.remove('active'));
    document.querySelectorAll('.tab-btn').forEach(btn => {
        const map = { 'passport': 'Паспорт', 'career': 'Карьера', 'family': 'Семья', 'education': 'Образование' };
        if (btn.textContent.includes(map[tabId])) btn.classList.add('active');
    });
    // Скрыть все формы
    document.querySelectorAll('.add-form').forEach(f => f.style.display = 'none');
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
            renderAll();
            alert('✅ Данные успешно загружены!');
        } catch(err) {
            alert('❌ Ошибка загрузки файла. Проверьте формат JSON.');
        }
    };
    reader.readAsText(file);
    event.target.value = '';
}

function resetAll() {
    if (confirm('🗑️ Удалить все данные? Это действие нельзя отменить!')) {
        if (confirm('Точно уверены?')) {
            DATA = { passport: {}, career: { experience: [], skills: [], languages: [] }, family: { spouse: null, children: [], parents: { father: null, mother: null }, siblings: [] }, education: { higher: [], additional: [], courses: [] } };
            renderAll();
            alert('✅ Все данные удалены');
        }
    }
}

// ============================================
// АВТОСОХРАНЕНИЕ ПРИ ЗАКРЫТИИ
// ============================================
window.addEventListener('beforeunload', function() {
    saveToStorage();
});
