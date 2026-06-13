/* ============================================================
   أصل المندي - Main JavaScript
   Interactions, Animations & Functionality
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Cart System ----
  let cart = [];
  
  window.toggleCart = function() {
    document.getElementById('cart-sidebar').classList.toggle('active');
    document.getElementById('cart-overlay').classList.toggle('active');
  };

  window.addToCart = function(id, name, price, image) {
    const existingItem = cart.find(item => item.id === id);
    if (existingItem) {
      existingItem.quantity += 1;
    } else {
      cart.push({ id, name, price, image, quantity: 1 });
    }
    
    // UI Effects
    const badge = document.getElementById('cart-badge');
    badge.classList.remove('cart-bounce');
    void badge.offsetWidth; // trigger reflow
    badge.classList.add('cart-bounce');
    
    updateCartUI();
  };

  window.changeQuantity = function(id, delta) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
      cart[itemIndex].quantity += delta;
      if (cart[itemIndex].quantity <= 0) {
        cart.splice(itemIndex, 1);
      }
      updateCartUI();
    }
  };

  window.updateCartUI = function() {
    const container = document.getElementById('cart-items-container');
    const badge = document.getElementById('cart-badge');
    const totalPriceEl = document.getElementById('cart-total-price');
    
    // Update Badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    badge.innerText = totalItems;
    
    // Update Total Price
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    totalPriceEl.innerText = totalPrice.toLocaleString() + ' دينار';
    
    // Render Items
    if (cart.length === 0) {
      container.innerHTML = '<p style="text-align:center; padding:20px; color:var(--text-muted);">السلة فارغة حالياً</p>';
      return;
    }
    
    container.innerHTML = cart.map(item => `
      <div class="cart-item">
        <img src="${item.image}" alt="${item.name}" class="cart-item-img">
        <div class="cart-item-details">
          <div class="cart-item-title">${item.name}</div>
          <div class="cart-item-price">${item.price.toLocaleString()} دينار</div>
        </div>
        <div class="cart-item-controls">
          <button class="qty-btn" onclick="changeQuantity('${item.id}', 1)">+</button>
          <span class="cart-item-qty">${item.quantity}</span>
          <button class="qty-btn" onclick="changeQuantity('${item.id}', -1)">-</button>
        </div>
      </div>
    `).join('');
  };

  window.getLocation = function() {
    const statusText = document.getElementById('location-status');
    const locationInput = document.getElementById('cart-customer-location');
    
    if (!navigator.geolocation) {
      statusText.textContent = "المتصفح الخاص بك لا يدعم تحديد الموقع.";
      statusText.style.color = "#e74c3c";
      return;
    }

    statusText.textContent = "⏳ جارٍ تحديد الموقع...";
    statusText.style.color = "var(--text-muted)";

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        const mapsLink = `https://maps.google.com/?q=${lat},${lng}`;
        locationInput.value = mapsLink;
        statusText.textContent = "✅ تم تحديد الموقع بنجاح!";
        statusText.style.color = "#2ecc71";
      },
      (error) => {
        statusText.textContent = "❌ تعذر تحديد الموقع. يرجى إدخال العنوان يدوياً.";
        statusText.style.color = "#e74c3c";
      }
    );
  };

  window.checkoutWhatsApp = function() {
    if (cart.length === 0) {
      alert("السلة فارغة! الرجاء إضافة وجبات قبل الطلب.");
      return;
    }

    const customerName = document.getElementById('cart-customer-name').value.trim();
    const customerLocation = document.getElementById('cart-customer-location').value.trim();

    if (!customerName || !customerLocation) {
      alert("الرجاء إدخال اسمك الكريم وعنوان التوصيل (أو تحديد الموقع).");
      return;
    }

    const WHATSAPP_NUMBER = '9647708039500'; // رقم الواتساب الخاص بالمطعم
    let message = `مرحباً، أريد طلب وجبات من أصل المندي:\n\n`;
    message += `👤 *الاسم:* ${customerName}\n`;
    message += `📍 *العنوان:* ${customerLocation}\n\n`;
    message += `🛒 *الطلبات:*\n`;
    
    cart.forEach(item => {
      message += `- ${item.quantity}x ${item.name} (${(item.price * item.quantity).toLocaleString()} دينار)\n`;
    });
    
    const totalPrice = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    message += `\n💰 *الإجمالي:* ${totalPrice.toLocaleString()} دينار`;
    
    const encodedMessage = encodeURIComponent(message);
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');
  };

  // ---- Particle System ----
  function createParticles() {
    const container = document.getElementById('particles');
    if (!container) return;
    const count = 20;
    for (let i = 0; i < count; i++) {
      const p = document.createElement('span');
      p.classList.add('particle');
      p.style.cssText = `
        left: ${Math.random() * 100}%;
        width: ${Math.random() * 4 + 2}px;
        height: ${Math.random() * 4 + 2}px;
        animation-duration: ${Math.random() * 8 + 6}s;
        animation-delay: ${Math.random() * 8}s;
        opacity: ${Math.random() * 0.5 + 0.2};
        background: ${Math.random() > 0.5 ? '#E8751A' : '#C9A84C'};
      `;
      container.appendChild(p);
    }
  }
  createParticles();

  // ---- Navbar Scroll Effect ----
  const navbar = document.getElementById('navbar');
  const navLinks = document.querySelectorAll('.nav-links a');

  function updateNavbar() {
    if (window.scrollY > 80) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  }

  // Active nav link on scroll
  function updateActiveLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    sections.forEach(section => {
      const sectionTop = section.offsetTop - 120;
      if (window.scrollY >= sectionTop) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  }

  window.addEventListener('scroll', () => {
    updateNavbar();
    updateActiveLink();
    revealOnScroll();
  }, { passive: true });

  updateNavbar();

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');

  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    mobileMenu.classList.toggle('open');
    document.body.style.overflow = mobileMenu.classList.contains('open') ? 'hidden' : '';
  });

  window.closeMobile = function() {
    hamburger.classList.remove('active');
    mobileMenu.classList.remove('open');
    document.body.style.overflow = '';
  };

  // Close mobile on outside click
  mobileMenu.addEventListener('click', (e) => {
    if (e.target === mobileMenu) closeMobile();
  });

  // ---- Scroll Reveal ----
  function revealOnScroll() {
    const reveals = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
    const windowHeight = window.innerHeight;

    reveals.forEach((el, i) => {
      const rect = el.getBoundingClientRect();
      if (rect.top < windowHeight - 80) {
        setTimeout(() => {
          el.classList.add('visible');
        }, i * 60);
      }
    });
  }

  // Initial check
  setTimeout(revealOnScroll, 100);

  // ---- Menu Filter Tabs ----
  const tabs = document.querySelectorAll('.menu-tab');
  const cards = document.querySelectorAll('.menu-card');

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const filter = tab.dataset.filter;

      // Update active tab
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      // Filter cards
      cards.forEach(card => {
        const category = card.dataset.category;
        if (filter === 'all' || category === filter) {
          card.style.display = '';
          setTimeout(() => {
            card.style.opacity = '1';
            card.style.transform = 'translateY(0)';
          }, 50);
        } else {
          card.style.opacity = '0';
          card.style.transform = 'translateY(20px)';
          setTimeout(() => { card.style.display = 'none'; }, 300);
        }
      });
    });
  });

  // Add hover glow to menu cards
  cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
      card.style.boxShadow = '0 20px 60px rgba(232, 117, 26, 0.25)';
    });
    card.addEventListener('mouseleave', () => {
      card.style.boxShadow = '';
    });
  });

  // ---- Add to order button (for static menu cards) ----
  document.querySelectorAll('.add-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();

      // Get menu card details to add to cart
      const card = btn.closest('.menu-card');
      if (card) {
        const titleEl = card.querySelector('h3');
        const priceEl = card.querySelector('.price');
        const imgEl = card.querySelector('.menu-card-img');
        
        if (titleEl && priceEl) {
          const name = titleEl.textContent.trim();
          // Extract numbers from price string e.g. "130,000 دينار" -> 130000
          const priceText = priceEl.textContent.replace(/[^\d]/g, '');
          const price = parseInt(priceText) || 0;
          const img = imgEl ? imgEl.getAttribute('src') : 'images/hero_mandi.png';
          // Use name as ID for static items
          const id = 'static-' + name.replace(/\s+/g, '-');
          
          window.addToCart(id, name, price, img);
        }
      }

      const originalText = btn.textContent;
      btn.textContent = '✓';
      btn.style.background = '#2ecc71';
      btn.style.borderColor = '#2ecc71';
      btn.style.color = 'white';
      btn.style.transform = 'rotate(0deg) scale(1.2)';
      setTimeout(() => {
        btn.textContent = originalText;
        btn.style.background = '';
        btn.style.borderColor = '';
        btn.style.color = '';
        btn.style.transform = '';
      }, 1500);
    });
  });

  // ---- Gallery Lightbox ----
  const galleryItems = document.querySelectorAll('.gallery-item');
  const lightbox = document.getElementById('lightbox');
  const lightboxImg = document.getElementById('lightboxImg');
  const lightboxClose = document.getElementById('lightboxClose');

  galleryItems.forEach(item => {
    item.addEventListener('click', () => {
      const src = item.dataset.src;
      const alt = item.querySelector('img').alt;
      lightboxImg.src = src;
      lightboxImg.alt = alt;
      lightbox.classList.add('active');
      document.body.style.overflow = 'hidden';
    });
  });

  function closeLightbox() {
    lightbox.classList.remove('active');
    document.body.style.overflow = '';
  }

  lightboxClose.addEventListener('click', closeLightbox);
  lightbox.addEventListener('click', (e) => {
    if (e.target === lightbox) closeLightbox();
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeLightbox();
  });

  // ---- Reservation Form ----
  // Set min date to today
  const dateInput = document.getElementById('resDate');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.min = today;
    dateInput.value = today;
  }

  window.submitReservation = function() {
    const name = document.getElementById('guestName').value.trim();
    const phone = document.getElementById('guestPhone').value.trim();
    const date = document.getElementById('resDate').value;
    const time = document.getElementById('resTime').value;
    const guests = document.getElementById('guests').value;
    const occasion = document.getElementById('occasion').value;
    const notes = document.getElementById('notes').value.trim();

    // Simple validation
    if (!name || !phone || !date || !time || !guests) {
      [
        { el: document.getElementById('guestName'), val: name },
        { el: document.getElementById('guestPhone'), val: phone },
        { el: document.getElementById('resDate'), val: date },
        { el: document.getElementById('resTime'), val: time },
        { el: document.getElementById('guests'), val: guests },
      ].forEach(({ el, val }) => {
        if (!val) {
          el.style.borderColor = '#e74c3c';
          el.style.boxShadow = '0 0 0 3px rgba(231, 76, 60, 0.15)';
          el.addEventListener('input', () => {
            el.style.borderColor = '';
            el.style.boxShadow = '';
          }, { once: true });
        }
      });
      return;
    }

    // Format occasion label
    const occasionLabels = {
      'birthday': '🎂 عيد ميلاد',
      'anniversary': '💍 ذكرى سنوية',
      'business': '💼 اجتماع عمل',
      'family': '👨‍👩‍👧‍👦 تجمع عائلي',
      'other': 'أخرى'
    };

    // Format date
    const dateObj = new Date(date);
    const formattedDate = dateObj.toLocaleDateString('ar-IQ', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });

    // Format time
    const [hours, minutes] = time.split(':');
    const h = parseInt(hours);
    const period = h >= 12 ? 'مساءً' : 'صباحاً';
    const formattedHour = ((h % 12) || 12);
    const formattedTime = `${formattedHour}:${minutes} ${period}`;

    // Build WhatsApp message
    const WHATSAPP_NUMBER = '9647708039500';
    let message = `مرحباً، أريد حجز طاولة في مطعم أصل المندي:\n\n`;
    message += `👤 *الاسم:* ${name}\n`;
    message += `📞 *رقم الجوال:* ${phone}\n`;
    message += `📅 *التاريخ:* ${formattedDate}\n`;
    message += `🕐 *الوقت:* ${formattedTime}\n`;
    message += `👥 *عدد الأشخاص:* ${guests}\n`;
    if (occasion && occasionLabels[occasion]) {
      message += `🎉 *المناسبة:* ${occasionLabels[occasion]}\n`;
    }
    if (notes) {
      message += `📝 *ملاحظات:* ${notes}\n`;
    }
    message += `\nشكراً جزيلاً!`;

    // Loading state
    const btn = document.getElementById('submitBtn');
    btn.textContent = '⏳ جارٍ الإرسال...';
    btn.disabled = true;

    setTimeout(() => {
      // Open WhatsApp
      const encodedMessage = encodeURIComponent(message);
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodedMessage}`, '_blank');

      // Show success UI
      document.getElementById('formContent').style.display = 'none';
      document.getElementById('formSuccess').style.display = 'block';

      // Reset button in background
      btn.textContent = '🎉 تأكيد الحجز';
      btn.disabled = false;
    }, 1000);
  };

  // ---- Testimonials Slider ----
  const track = document.getElementById('testimonialsTrack');
  const dots = document.querySelectorAll('.slider-dot');
  let currentSlide = 0;
  let autoSlideTimer;

  function getVisibleCards() {
    const width = window.innerWidth;
    if (width < 768) return 1;
    if (width < 1024) return 2;
    return 3;
  }

  function goToSlide(index) {
    const cards = track.querySelectorAll('.testimonial-card');
    const visible = getVisibleCards();
    const maxSlide = cards.length - visible;
    currentSlide = Math.max(0, Math.min(index, maxSlide));

    const cardWidth = cards[0].offsetWidth + 28; // + gap
    track.style.transform = `translateX(${currentSlide * cardWidth}px)`;

    dots.forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  dots.forEach((dot, i) => {
    dot.addEventListener('click', () => {
      clearInterval(autoSlideTimer);
      goToSlide(i);
      startAutoSlide();
    });
  });

  document.getElementById('nextSlide').addEventListener('click', () => {
    clearInterval(autoSlideTimer);
    const cards = track.querySelectorAll('.testimonial-card');
    const maxSlide = cards.length - getVisibleCards();
    goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
    startAutoSlide();
  });

  document.getElementById('prevSlide').addEventListener('click', () => {
    clearInterval(autoSlideTimer);
    const cards = track.querySelectorAll('.testimonial-card');
    const maxSlide = cards.length - getVisibleCards();
    goToSlide(currentSlide <= 0 ? maxSlide : currentSlide - 1);
    startAutoSlide();
  });

  function startAutoSlide() {
    autoSlideTimer = setInterval(() => {
      const cards = track.querySelectorAll('.testimonial-card');
      const maxSlide = cards.length - getVisibleCards();
      goToSlide(currentSlide >= maxSlide ? 0 : currentSlide + 1);
    }, 5000);
  }

  startAutoSlide();
  window.addEventListener('resize', () => goToSlide(currentSlide));

  // ---- Smooth scroll for all anchor links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Counter Animation ----
  function animateCounter(el, target, suffix = '') {
    const duration = 2000;
    const start = performance.now();
    const isFloat = target.toString().includes('.');

    function update(time) {
      const elapsed = time - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      const current = isFloat
        ? (eased * parseFloat(target)).toFixed(1)
        : Math.floor(eased * parseInt(target));
      el.textContent = `${current}${suffix}`;
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // Observe stat numbers
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const el = entry.target;
        const text = el.dataset.target;
        const suffix = el.dataset.suffix || '';
        animateCounter(el, text, suffix);
        statObserver.unobserve(el);
      }
    });
  }, { threshold: 0.5 });

  // ---- Cursor glow effect (desktop only) ----
  if (window.innerWidth > 768) {
    const glow = document.createElement('div');
    glow.style.cssText = `
      position: fixed;
      width: 300px;
      height: 300px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(232,117,26,0.08) 0%, transparent 70%);
      pointer-events: none;
      z-index: 9998;
      transform: translate(-50%, -50%);
      transition: opacity 0.3s ease;
    `;
    document.body.appendChild(glow);

    document.addEventListener('mousemove', (e) => {
      glow.style.left = e.clientX + 'px';
      glow.style.top = e.clientY + 'px';
    });

    document.addEventListener('mouseleave', () => { glow.style.opacity = '0'; });
    document.addEventListener('mouseenter', () => { glow.style.opacity = '1'; });
  }

  // ---- Initial page load animation ----
  document.body.style.opacity = '0';
  document.body.style.transition = 'opacity 0.5s ease';
  requestAnimationFrame(() => {
    document.body.style.opacity = '1';
  });

  // ---- Supabase Integration ----
  const SUPABASE_URL = 'https://giuhysnneywpyxpguqjw.supabase.co';
  const SUPABASE_KEY = 'sb_publishable_R21pW29PjhqmYuAuqk87_g_pCbqNIl8';
  
  // Initialize Supabase only if it exists in the window
  const supabase = window.supabase ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) : null;

  // Check initial auth state
  if (supabase) {
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        document.getElementById('login-section').style.display = 'none';
        document.getElementById('admin-panel').style.display = 'block';
      }
    });
  }

  window.loginAdmin = async function() {
    if (!supabase) return alert("Supabase is not initialized.");
    const email = document.getElementById('admin-email').value;
    const password = document.getElementById('admin-password').value;

    if (!email || !password) return alert("يرجى إدخال البريد الإلكتروني وكلمة المرور.");

    const { data, error } = await supabase.auth.signInWithPassword({ email, password });

    if (error) {
      alert("فشل تسجيل الدخول: " + error.message);
    } else {
      alert("مرحباً بك أيها المدير!");
      document.getElementById('login-section').style.display = 'none';
      document.getElementById('admin-panel').style.display = 'block';
      fetchMeals(); // Refresh to show delete buttons
    }
  };

  window.logoutAdmin = async function() {
    if (!supabase) return;
    await supabase.auth.signOut();
    document.getElementById('login-section').style.display = 'block';
    document.getElementById('admin-panel').style.display = 'none';
    fetchMeals(); // Refresh to hide delete buttons
  };

  window.addNewMeal = async function() {
    if (!supabase) return alert("Supabase is not initialized.");
    const name = document.getElementById('meal-name').value;
    const description = document.getElementById('meal-desc').value;
    const price = document.getElementById('meal-price').value;
    const category = document.getElementById('meal-category').value;
    const imageInput = document.getElementById('meal-image-file');
    
    if (!name || !price) return alert("يرجى إدخال اسم الوجبة والسعر على الأقل.");

    const btn = document.getElementById('addMealBtn');
    const originalText = btn.innerHTML;
    btn.disabled = true;
    
    let finalImageUrl = 'images/hero_mandi.png'; // Default image

    try {
      // 1. Upload Image if selected
      if (imageInput.files && imageInput.files.length > 0) {
        btn.innerHTML = '⏳ جارٍ رفع الصورة...';
        const file = imageInput.files[0];
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2)}_${Date.now()}.${fileExt}`;
        
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('meal-images')
          .upload(fileName, file);

        if (uploadError) throw new Error("تأكد من إعدادات الـ Storage في Supabase: " + uploadError.message);

        // Get public URL
        const { data: publicUrlData } = supabase.storage
          .from('meal-images')
          .getPublicUrl(fileName);
          
        finalImageUrl = publicUrlData.publicUrl;
      }

      // 2. Insert Meal into Database
      btn.innerHTML = '⏳ جارٍ حفظ البيانات...';
      const { data, error: dbError } = await supabase
        .from('meals')
        .insert([{ name, description, price: parseInt(price), category, image_url: finalImageUrl }]);

      if (dbError) throw new Error("خطأ أثناء حفظ الوجبة في قاعدة البيانات: " + dbError.message);

      alert("تمت إضافة الوجبة بنجاح!");
      
      // Clear form
      document.getElementById('meal-name').value = '';
      document.getElementById('meal-desc').value = '';
      document.getElementById('meal-price').value = '';
      imageInput.value = '';
      fetchMeals(); // Refresh the menu

    } catch (err) {
      alert(err.message);
    } finally {
      btn.innerHTML = originalText;
      btn.disabled = false;
    }
  };

  window.deleteMeal = async function(id) {
    if (!supabase) return;
    if (!confirm("هل أنت متأكد من حذف هذه الوجبة نهائياً؟")) return;
    
    const { error } = await supabase.from('meals').delete().eq('id', id);
    if (error) {
      alert("حدث خطأ أثناء الحذف: " + error.message);
    } else {
      fetchMeals(); // Refresh the menu
    }
  };

  window.fetchMeals = async function() {
    if (!supabase) return;
    
    // Check if we have placeholder keys
    if (SUPABASE_URL.includes('your-project-id')) {
      console.log('Supabase is using placeholder keys. Skipping dynamic fetch. Showing static items.');
      return;
    }

    // Check if admin is logged in
    const { data: sessionData } = await supabase.auth.getSession();
    const isAdmin = sessionData?.session !== null;

    const { data: meals, error } = await supabase
      .from('meals')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Error fetching meals:", error);
      return;
    }

    const menuGrid = document.getElementById('menuGrid');
    if (!menuGrid) return;

    // Clear existing static items
    menuGrid.innerHTML = '';

    if (!meals || meals.length === 0) {
      menuGrid.innerHTML = '<div style="grid-column:1/-1; text-align:center; padding:40px; color:var(--text-muted);">لا توجد وجبات حالياً في قاعدة البيانات. قم بإضافة وجبات من لوحة التحكم!</div>';
      return;
    }

    meals.forEach(meal => {
      const card = document.createElement('div');
      card.className = 'menu-card reveal visible';
      card.dataset.category = meal.category || 'mandi';
      
      // Parse tag and clean description
      let displayDesc = meal.description || '';
      let tag = '';
      const tagMatch = displayDesc.match(/\[تصنيف:(.*?)\]/);
      if (tagMatch) {
        tag = tagMatch[1];
        displayDesc = displayDesc.replace(/\[تصنيف:.*?\]/, '').trim();
      }

      let badgeHTML = '';
      if (tag) {
        let badgeClass = 'badge-default';
        if (tag === 'الأكثر شهرة') badgeClass = 'badge-popular';
        else if (tag === 'عائلية') badgeClass = 'badge-family';
        else if (tag === 'جديد') badgeClass = 'badge-new';
        else if (tag === 'عرض خاص') badgeClass = 'badge-special';
        else if (tag === 'حار') badgeClass = 'badge-spicy';
        
        badgeHTML = `<span class="menu-badge ${badgeClass}">${tag}</span>`;
      }
      
      let adminControls = '';
      if (isAdmin) {
        adminControls = `
          <button onclick="deleteMeal(${meal.id})" style="width:100%; margin-top:12px; background:rgba(231,76,60,0.1); color:#e74c3c; border:1px solid #e74c3c; border-radius:8px; padding:8px; font-family:var(--font-main); cursor:pointer; transition:0.3s;" onmouseover="this.style.background='#e74c3c'; this.style.color='white';" onmouseout="this.style.background='rgba(231,76,60,0.1)'; this.style.color='#e74c3c';">
            🗑️ حذف الوجبة
          </button>
        `;
      }

      card.innerHTML = `
        <div class="menu-card-img-wrap">
          <img src="${meal.image_url || 'images/hero_mandi.png'}" alt="${meal.name}" class="menu-card-img">
          ${badgeHTML}
        </div>
        <div class="menu-card-body">
          <h3>${meal.name}</h3>
          <p>${displayDesc}</p>
          <div class="menu-card-footer">
            <div class="price">${meal.price.toLocaleString()} <span>دينار</span></div>
            <button class="add-btn" title="إضافة للطلب" onclick="addToCart('${meal.id}', '${meal.name}', ${meal.price}, '${meal.image_url || 'images/hero_mandi.png'}'); this.innerHTML='✓'; this.style.background='#2ecc71'; this.style.color='white'; this.style.borderColor='#2ecc71'; setTimeout(()=> {this.innerHTML='+'; this.style.background=''; this.style.color=''; this.style.borderColor='';}, 1500)">+</button>
          </div>
          ${adminControls}
        </div>
      `;
      menuGrid.appendChild(card);
    });

    // Re-attach hover effects
    const cards = document.querySelectorAll('.menu-card');
    cards.forEach(card => {
      card.addEventListener('mouseenter', () => {
        card.style.boxShadow = '0 20px 60px rgba(232, 117, 26, 0.25)';
      });
      card.addEventListener('mouseleave', () => {
        card.style.boxShadow = '';
      });
    });
  };

  // Fetch meals initially
  fetchMeals();

  console.log('🍖 أصل المندي - تم تحميل الموقع بنجاح');
});
