// نظام إدارة التسجيلات
const enrollmentSystem = {
    enrolledCourses: JSON.parse(localStorage.getItem('enrolledCourses')) || [],
    
    // تسجيل في دورة
    enrollInCourse: function(courseId, courseTitle, coursePrice, instructor) {
        const alreadyEnrolled = this.enrolledCourses.some(course => course.id === courseId);
        
        if (!alreadyEnrolled) {
            const enrollment = {
                id: courseId,
                title: courseTitle,
                price: coursePrice,
                instructor: instructor,
                enrolledAt: new Date().toLocaleDateString('ar-EG')
            };
            
            this.enrolledCourses.push(enrollment);
            this.saveToLocalStorage();
            return true;
        }
        return false;
    },
    
    // الحصول على الكورسات المسجلة
    getEnrolledCourses: function() {
        return this.enrolledCourses;
    },
    
    // حفظ في localStorage
    saveToLocalStorage: function() {
        localStorage.setItem('enrolledCourses', JSON.stringify(this.enrolledCourses));
    },
    
    // إلغاء تسجيل دورة
    unenrollFromCourse: function(courseId) {
        this.enrolledCourses = this.enrolledCourses.filter(course => course.id !== courseId);
        this.saveToLocalStorage();
    }
};

// بيانات المدرسين والدورات
const teachersData = {
    "Jafar ataia": [
        { name: "HTML&CSS", price: "100$" },
        { name: "JavaScript", price: "100$" },
        { name: "UI/UX", price: "150$" }
    ],
    "Ahmad mohamad": [
        { name: "English", price: "200$" },
        { name: "Speaking English", price: "150$" }
    ],
    "ameer hassan": [
        { name: "Arabic", price: "150$" },
        { name: "Arabic calligraphy", price: "100$" }
    ],
    "maream ali": [
        { name: "Alamen", price: "150$" }
    ],
    "hala Ahmad": [
        { name: "Microsoft Office", price: "100$" }
    ],
    "alaa jaber": [
        { name: "AI", price: "200$" },
        { name: "AI (2)", price: "200$" }
    ],
    "Alaa ali": [
        { name: "ISO", price: "200$" }
    ]
};

// ========== نظام البحث ==========
// دالة البحث عن الكورسات
function searchCourses(searchTerm) {
    const allCourses = document.querySelectorAll('.box1');
    const results = [];
    
    allCourses.forEach(course => {
        const courseTitle = course.querySelector('.box1__title').textContent.toLowerCase();
        const courseDescription = course.querySelector('.box1__describtion').textContent.toLowerCase();
        const instructorName = course.querySelector('.box1__name').textContent.toLowerCase();
        
        if (courseTitle.includes(searchTerm) || 
            courseDescription.includes(searchTerm) || 
            instructorName.includes(searchTerm)) {
            results.push(course);
        }
    });
    
    return results;
}

// دالة عرض نتائج البحث
function displaySearchResults(results) {
    const container = document.querySelector('.container');
    const allCourses = document.querySelectorAll('.box1');
    
    // إخفاء جميع الكورسات أولاً
    allCourses.forEach(course => {
        course.style.display = 'none';
    });
    
    // إزالة رسالة لا توجد نتائج إذا كانت موجودة
    const existingNoResults = document.querySelector('.no-results');
    if (existingNoResults) {
        existingNoResults.remove();
    }
    
    // عرض نتائج البحث فقط
    results.forEach(course => {
        course.style.display = 'grid';
    });
    
    // إذا لم توجد نتائج
    if (results.length === 0) {
        // إضافة رسالة لا توجد نتائج
        const noResults = document.createElement('div');
        noResults.className = 'no-results';
        noResults.innerHTML = `
            <p>لا توجد نتائج بحث مطابقة</p>
            <p>جرب استخدام كلمات أخرى</p>
        `;
        container.appendChild(noResults);
    }
}

// البحث عند النقر أو الضغط على Enter
function performSearch(searchTerm) {
    const results = searchCourses(searchTerm);
    displaySearchResults(results);
}

// عرض جميع الكورسات
function showAllCourses() {
    const allCourses = document.querySelectorAll('.box1');
    const noResults = document.querySelector('.no-results');
    
    // إزالة رسالة لا توجد نتائج إذا كانت موجودة
    if (noResults) {
        noResults.remove();
    }
    
    // عرض جميع الكورسات
    allCourses.forEach(course => {
        course.style.display = 'grid';
    });
}

// إعداد وظيفة البحث
function setupSearchFunctionality() {
    const searchInput = document.querySelector('.header__input');
    const searchButton = document.querySelector('.header__searchimg');
    
    if (!searchInput || !searchButton) {
        console.error('❌ لم يتم العثور على عناصر البحث');
        return;
    }
    
    // البحث عند النقر على أيقونة البحث
    searchButton.addEventListener('click', function() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        performSearch(searchTerm);
    });
    
    // البحث عند الضغط على Enter
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            const searchTerm = searchInput.value.toLowerCase().trim();
            performSearch(searchTerm);
        }
    });
    
    // البحث أثناء الكتابة (بحث فوري)
    searchInput.addEventListener('input', function(e) {
        const searchTerm = e.target.value.toLowerCase().trim();
        if (searchTerm === '') {
            showAllCourses();
        } else {
            performSearch(searchTerm);
        }
    });
    
    console.log('✅ تم إعداد نظام البحث');
}

// ========== نظام المدرسين ==========
// إنشاء نافذة المدرسين
function createTeachersModal() {
    const modalHTML = `
        <div id="teachersModal" class="modal">
            <div class="modal-content">
                <span class="close-teachers">&times;</span>
                <h2>المدرسين والمواد</h2>
                <div id="teachersList" class="teachers-list"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', modalHTML);
    console.log('✅ تم إنشاء نافذة المدرسين');
}

// عرض قائمة المدرسين
function displayTeachers() {
    const teachersList = document.getElementById('teachersList');
    
    if (!teachersList) {
        console.error('❌ لم يتم العثور على قائمة المدرسين');
        return;
    }
    
    // تفريغ القائمة أولاً
    teachersList.innerHTML = '';
    
    Object.keys(teachersData).forEach(teacher => {
        const teacherItem = document.createElement('div');
        teacherItem.className = 'teacher-item';
        
        const coursesHTML = teachersData[teacher].map(course => 
            `<span class="course-badge">${course.name} - ${course.price}</span>`
        ).join('');
        
        teacherItem.innerHTML = `
            <h3>${teacher}</h3>
            <div class="teacher-courses">
                <strong>الدورات:</strong>
                <div class="courses-container">${coursesHTML}</div>
            </div>
        `;
        
        teachersList.appendChild(teacherItem);
    });
}

// فتح نافذة المدرسين
function openTeachersModal() {
    const modal = document.getElementById('teachersModal');
    if (modal) {
        displayTeachers();
        modal.style.display = 'block';
        console.log('✅ تم فتح نافذة المدرسين');
    }
}

// إغلاق نافذة المدرسين
function closeTeachersModal() {
    const modal = document.getElementById('teachersModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// إعداد أيقونة الشخص
function setupPersonIcon() {
    const personIcon = document.querySelector('.header__personimg');
    
    if (personIcon) {
        personIcon.style.cursor = 'pointer';
        personIcon.addEventListener('click', openTeachersModal);
        console.log('✅ تم إعداد أيقونة الشخص');
    } else {
        console.error('❌ لم يتم العثور على أيقونة الشخص');
    }
}

// ========== نظام الكورسات المسجلة ==========
// عرض الكورسات المسجلة
function displayEnrolledCourses() {
    const enrolledList = document.getElementById('enrolledList');
    const enrolledCourses = enrollmentSystem.getEnrolledCourses();
    
    if (!enrolledList) {
        console.error('❌ لم يتم العثور على قائمة الكورسات المسجلة');
        return;
    }
    
    // تفريغ القائمة أولاً
    enrolledList.innerHTML = '';
    
    if (enrolledCourses.length === 0) {
        enrolledList.innerHTML = `
            <div class="no-enrollments">
                <p>لم تسجل في أي دورة بعد</p>
                <p style="margin-top: 10px; font-size: 0.9em; color: #999;">انقر على زر "تسجيل" في أي دورة لإضافتها هنا</p>
            </div>
        `;
    } else {
        enrolledCourses.forEach(course => {
            const enrolledItem = document.createElement('div');
            enrolledItem.className = 'enrolled-item';
            enrolledItem.innerHTML = `
                <button class="unenroll-btn" data-course-id="${course.id}">إلغاء التسجيل</button>
                <div class="course-info">
                    <h3>${course.title}</h3>
                    <p><strong>المدرس:</strong> ${course.instructor}</p>
                    <p><strong>السعر:</strong> ${course.price}</p>
                    <p class="enrollment-date"><strong>تاريخ التسجيل:</strong> ${course.enrolledAt}</p>
                </div>
            `;
            enrolledList.appendChild(enrolledItem);
        });
        
        // إضافة event listeners لأزرار إلغاء التسجيل
        document.querySelectorAll('.unenroll-btn').forEach(button => {
            button.addEventListener('click', function() {
                const courseId = this.getAttribute('data-course-id');
                enrollmentSystem.unenrollFromCourse(courseId);
                displayEnrolledCourses(); // تحديث العرض
            });
        });
    }
}

// فتح نافذة الكورسات المسجلة
function openEnrolledModal() {
    const modal = document.getElementById('enrolledModal');
    if (modal) {
        displayEnrolledCourses();
        modal.style.display = 'block';
        console.log('✅ تم فتح نافذة الكورسات المسجلة');
    }
}

// إغلاق نافذة الكورسات المسجلة
function closeEnrolledModal() {
    const modal = document.getElementById('enrolledModal');
    if (modal) {
        modal.style.display = 'none';
    }
}

// إعداد أزرار التسجيل
function setupEnrollmentButtons() {
    const enrollButtons = document.querySelectorAll('.box1__enrol');
    console.log('عدد أزرار التسجيل:', enrollButtons.length);
    
    enrollButtons.forEach((button, index) => {
        button.addEventListener('click', function() {
            const courseElement = this.closest('.box1');
            if (courseElement) {
                const courseTitle = courseElement.querySelector('.box1__title').textContent;
                const coursePrice = courseElement.querySelector('.box1__price').textContent;
                const instructor = courseElement.querySelector('.box1__name').textContent;
                
                // تسجيل الدورة
                const enrolled = enrollmentSystem.enrollInCourse(index.toString(), courseTitle, coursePrice, instructor);
                
                if (enrolled) {
                    alert(`✅ تم تسجيلك في دورة "${courseTitle}" بنجاح!`);
                } else {
                    alert(`⚠️ أنت مسجل مسبقاً في دورة "${courseTitle}"`);
                }
            }
        });
    });
    
    console.log('✅ تم إعداد أزرار التسجيل');
}

// إعداد أيقونة الخيارات
function setupSelectIcon() {
    const selectIcon = document.querySelector('.header__selectimg');
    
    if (selectIcon) {
        selectIcon.style.cursor = 'pointer';
        selectIcon.addEventListener('click', openEnrolledModal);
        console.log('✅ تم إعداد أيقونة الخيارات');
    } else {
        console.error('❌ لم يتم العثور على أيقونة الخيارات');
        createAlternativeButton();
    }
}

// إنشاء زر بديل إذا لم توجد الأيقونة
function createAlternativeButton() {
    const headerRight = document.querySelector('.header__right');
    if (headerRight) {
        const enrollmentsButton = document.createElement('button');
        enrollmentsButton.textContent = 'كورساتي';
        enrollmentsButton.style.cssText = `
            background-color: #2d91e4;
            color: white;
            border: none;
            border-radius: 20px;
            padding: 10px 20px;
            cursor: pointer;
            font-size: 16px;
            margin-left: 10px;
        `;
        enrollmentsButton.addEventListener('click', openEnrolledModal);
        headerRight.appendChild(enrollmentsButton);
        console.log('✅ تم إنشاء الزر البديل');
    }
}

// ========== إعداد النوافذ المنبثقة ==========
// إنشاء النوافذ المنبثقة
function createModals() {
    // نافذة الكورسات المسجلة
    const enrolledModalHTML = `
        <div id="enrolledModal" class="modal">
            <div class="modal-content">
                <span class="close-enrolled">&times;</span>
                <h2>الكورسات المسجلة</h2>
                <div id="enrolledList" class="enrolled-list"></div>
            </div>
        </div>
    `;
    
    document.body.insertAdjacentHTML('beforeend', enrolledModalHTML);
    console.log('✅ تم إنشاء نافذة الكورسات المسجلة');
}

// إعداد event listeners للإغلاق
function setupModalCloseListeners() {
    // إغلاق نافذة المدرسين
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-teachers')) {
            closeTeachersModal();
        }
        if (e.target.id === 'teachersModal') {
            closeTeachersModal();
        }
    });
    
    // إغلاق نافذة الكورسات المسجلة
    document.addEventListener('click', function(e) {
        if (e.target.classList.contains('close-enrolled')) {
            closeEnrolledModal();
        }
        if (e.target.id === 'enrolledModal') {
            closeEnrolledModal();
        }
    });
    
    // إغلاق جميع النوافذ بالزر Escape
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Escape') {
            closeTeachersModal();
            closeEnrolledModal();
        }
    });
    
    console.log('✅ تم إعداد event listeners للإغلاق');
}

// ========== التهيئة الرئيسية ==========
// تهيئة النظام الرئيسية
function initializeSystem() {
    console.log('🚀 بدء تهيئة النظام...');
    
    try {
        // 1. إنشاء النوافذ المنبثقة
        createModals();
        createTeachersModal();
        
        // 2. إعداد نظام البحث
        setupSearchFunctionality();
        
        // 3. إعداد نظام المدرسين
        setupPersonIcon();
        
        // 4. إعداد نظام التسجيلات
        setupEnrollmentButtons();
        setupSelectIcon();
        
        // 5. إعداد event listeners للإغلاق
        setupModalCloseListeners();
        
        console.log('🎉 تم تهيئة جميع الأنظمة بنجاح!');
        console.log('📝 التعليمات:');
        console.log('   - اكتب في حقل البحث للبحث عن كورسات');
        console.log('   - انقر على أيقونة الشخص لرؤية المدرسين');
        console.log('   - انقر على أيقونة الخيارات لرؤية الكورسات المسجلة');
        console.log('   - انقر على زر "تسجيل" في أي دورة لتسجيلها');
        
    } catch (error) {
        console.error('❌ خطأ في تهيئة النظام:', error);
    }
}

// ========== بدء التشغيل ==========
// تشغيل النظام عندما يتم تحميل الصفحة
document.addEventListener('DOMContentLoaded', function() {
    console.log('📄 تم تحميل الصفحة، بدء التهيئة...');
    initializeSystem();
});

// تشغيل أيضاً إذا تم تحميل الصفحة مسبقاً
if (document.readyState === 'complete' || document.readyState === 'interactive') {
    console.log('🔄 الصفحة محملة مسبقاً، بدء التهيئة...');
    setTimeout(initializeSystem, 100);
}