let hotelsDB = [];
let filteredHotels = [];

// Функция отрисовки карточек отелей
function renderHotels() {
    const list = document.getElementById('hotelList');
    const countEl = document.getElementById('hotelCount');
    list.innerHTML = '';
    countEl.innerText = filteredHotels.length;

    if (filteredHotels.length === 0) {
        list.innerHTML = `
            <div class="col-span-full py-24 text-center">
                <div class="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <i class="fa-solid fa-magnifying-glass text-2xl text-slate-400"></i>
                </div>
                <h4 class="text-xl font-bold">Ничего не найдено</h4>
                <p class="text-slate-500">Попробуйте изменить запрос или сбросить фильтры.</p>
                <button onclick="resetSearch()" class="mt-6 text-indigo-600 font-bold hover:underline">Показать все отели</button>
            </div>
        `;
        return;
    }

    filteredHotels.forEach(hotel => {
        const card = document.createElement('div');
        card.className = 'hotel-card bg-white rounded-[2rem] overflow-hidden flex flex-col group cursor-pointer';
        card.onclick = () => showDetails(hotel.id);
        
        card.innerHTML = `
            <div class="relative h-64 overflow-hidden">
                <img src="${hotel.image}" alt="${hotel.name}" class="w-full h-full object-cover group-hover:scale-110 transition duration-700">
                <div class="absolute top-4 left-4 flex flex-col gap-2">
                    ${hotel.tag ? `<span class="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider text-slate-800 shadow-sm">${hotel.tag}</span>` : ''}
                </div>
                <button class="absolute top-4 right-4 w-10 h-10 bg-white/20 backdrop-blur hover:bg-white text-white hover:text-rose-500 rounded-full flex items-center justify-center transition shadow-lg">
                    <i class="fa-regular fa-heart"></i>
                </button>
            </div>
            <div class="p-6 flex-1 flex flex-col">
                <div class="flex justify-between items-start mb-2">
                    <h4 class="text-lg font-bold text-slate-900 leading-tight group-hover:text-indigo-600 transition">${hotel.name}</h4>
                    <div class="flex items-center space-x-1 shrink-0 bg-indigo-50 text-indigo-700 px-2 py-1 rounded-lg">
                        <i class="fa-solid fa-star text-[10px]"></i>
                        <span class="text-xs font-bold">${hotel.rating}</span>
                    </div>
                </div>
                <p class="text-slate-400 text-sm flex items-center mb-6">
                    <i class="fa-solid fa-location-dot mr-1.5 text-xs"></i> ${hotel.city}
                </p>
                
                <div class="mt-auto flex items-end justify-between">
                    <div>
                        <span class="text-xs font-semibold text-slate-400 uppercase tracking-wide">от</span>
                        <div class="flex items-baseline">
                            <span class="text-2xl font-extrabold text-slate-900">${hotel.price.toLocaleString()}</span>
                            <span class="ml-1 text-slate-500 font-medium text-sm">KGS/ночь</span>
                        </div>
                    </div>
                    <div class="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center group-hover:bg-indigo-600 group-hover:text-white transition-colors duration-300">
                        <i class="fa-solid fa-arrow-right"></i>
                    </div>
                </div>
            </div>
        `;
        list.appendChild(card);
    });
}

// Поиск по названию и городу
function handleSearch() {
    const query = document.getElementById('searchInput').value.toLowerCase();
    filteredHotels = hotelsDB.filter(h => 
        h.name.toLowerCase().includes(query) || 
        h.city.toLowerCase().includes(query)
    );
    document.getElementById('resultsTitle').innerText = query ? `Поиск в "${query}"` : 'Популярные направления';
    renderHotels();
}

// Сортировка
function sortHotels() {
    const sortVal = document.getElementById('sortSelect').value;
    if (sortVal === 'price-low') filteredHotels.sort((a, b) => a.price - b.price);
    else if (sortVal === 'price-high') filteredHotels.sort((a, b) => b.price - a.price);
    else if (sortVal === 'rating') filteredHotels.sort((a, b) => b.rating - a.rating);
    else filteredHotels.sort((a, b) => b.reviews - a.reviews);
    renderHotels();
}

// Сброс фильтров
function resetSearch() {
    document.getElementById('searchInput').value = '';
    filteredHotels = [...hotelsDB];
    document.getElementById('resultsTitle').innerText = 'Популярные направления';
    renderHotels();
}

// Открытие модального окна с деталями
function showDetails(id) {
    const hotel = hotelsDB.find(h => h.id === id);
    const modal = document.getElementById('hotelModal');
    const content = document.getElementById('modalContent');
    
    content.innerHTML = `
        <button onclick="closeModal()" class="absolute top-6 right-6 z-10 w-12 h-12 bg-white/20 backdrop-blur hover:bg-white p-2 rounded-full shadow-xl transition-all">
            <i class="fa-solid fa-xmark text-xl"></i>
        </button>
        <div class="w-full md:w-1/2 h-72 md:h-auto overflow-hidden">
            <img src="${hotel.image}" class="w-full h-full object-cover" alt="${hotel.name}">
        </div>
        <div class="w-full md:w-1/2 p-8 md:p-12 overflow-y-auto custom-scrollbar flex flex-col bg-white">
            <div class="mb-8">
                <div class="flex items-center space-x-2 mb-4">
                    <span class="bg-indigo-600 text-white text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">${hotel.tag}</span>
                    <div class="flex text-yellow-400 text-[10px]">
                        <i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i><i class="fa-solid fa-star"></i>
                    </div>
                </div>
                <h2 class="text-4xl font-extrabold text-slate-900 mb-2">${hotel.name}</h2>
                <p class="text-slate-400 font-medium flex items-center">
                    <i class="fa-solid fa-location-dot mr-2"></i> ${hotel.city}, Кыргызстан
                </p>
            </div>

            <div class="flex items-center space-x-6 p-6 bg-slate-50 rounded-3xl mb-8">
                <div>
                    <div class="text-3xl font-black text-slate-900">${hotel.rating}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Рейтинг</div>
                </div>
                <div class="h-10 w-[1px] bg-slate-200"></div>
                <div>
                    <div class="text-xl font-bold text-slate-900">${hotel.reviews}</div>
                    <div class="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Отзывов</div>
                </div>
            </div>

            <div class="mb-10">
                <h4 class="text-sm font-bold text-slate-900 mb-3 uppercase tracking-widest">Об отеле</h4>
                <p class="text-slate-500 leading-relaxed">${hotel.description}</p>
            </div>

            <div class="mb-10">
                <h4 class="text-sm font-bold text-slate-900 mb-4 uppercase tracking-widest">Преимущества</h4>
                <div class="flex flex-wrap gap-3">
                    ${hotel.amenities.map(a => `
                        <div class="bg-white border border-slate-100 px-4 py-2.5 rounded-2xl text-xs font-semibold text-slate-700 flex items-center shadow-sm">
                            <div class="w-1.5 h-1.5 rounded-full bg-indigo-500 mr-2.5"></div> ${a}
                        </div>
                    `).join('')}
                </div>
            </div>

            <div class="mt-auto pt-8 border-t border-slate-100 flex flex-col sm:flex-row items-center justify-between gap-6">
                <div class="text-center sm:text-left">
                    <p class="text-xs font-bold text-slate-400 uppercase tracking-widest">Итоговая стоимость</p>
                    <span class="text-3xl font-black text-slate-900">${hotel.price.toLocaleString()} KGS</span>
                </div>
                <button onclick="bookHotel('${hotel.name}')" class="w-full sm:w-auto bg-indigo-600 hover:bg-slate-900 text-white px-10 py-5 rounded-[2rem] font-bold transition-all duration-300 shadow-xl shadow-indigo-100 active:scale-95">
                    Забронировать
                </button>
            </div>
        </div>
    `;

    modal.classList.remove('hidden');
    document.body.style.overflow = 'hidden';
}

// Закрытие модального окна
function closeModal() {
    document.getElementById('hotelModal').classList.add('hidden');
    document.body.style.overflow = 'auto';
}

// Логика бронирования
function bookHotel(name) {
    const overlay = document.createElement('div');
    overlay.className = 'fixed inset-0 z-[200] flex items-center justify-center bg-slate-900/90 backdrop-blur-xl p-6';
    overlay.innerHTML = `
        <div class="bg-white p-10 rounded-[3rem] max-w-sm w-full text-center shadow-2xl animate-fade-in">
            <div class="w-24 h-24 bg-emerald-50 text-emerald-500 rounded-full flex items-center justify-center mx-auto mb-8">
                <i class="fa-solid fa-circle-check text-5xl"></i>
            </div>
            <h3 class="text-3xl font-black mb-4 text-slate-900">Запрос принят!</h3>
            <p class="text-slate-500 mb-10">Мы проверяем наличие свободных мест в <b>${name}</b>. Наш менеджер перезвонит вам в течение 15 минут.</p>
            <button onclick="this.parentElement.parentElement.remove(); closeModal();" class="w-full bg-slate-900 hover:bg-indigo-600 text-white font-bold py-5 rounded-[2rem] transition-all">
                Прекрасно
            </button>
        </div>
    `;
    document.body.appendChild(overlay);
}

// Инициализация при загрузке страницы
window.onload = async () => {
    try {
        // Динамическое получение данных из hotels.json
        const response = await fetch('hotels.json');
        hotelsDB = await response.json();
        filteredHotels = [...hotelsDB];
        renderHotels();
    } catch (error) {
        console.error("Ошибка при загрузке базы данных отелей:", error);
    }
    
    // Слушатели событий ввода
    document.getElementById('searchInput').addEventListener('input', (e) => {
        if (e.target.value === '') resetSearch();
    });
    
    document.getElementById('searchInput').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') handleSearch();
    });
};