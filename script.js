// ===== Header scroll effect =====
const header = document.querySelector('.header');
window.addEventListener('scroll', () => {
  header.classList.toggle('scrolled', window.scrollY > 50);
});

// ===== Mobile menu =====
const burger = document.querySelector('.burger');
const nav = document.querySelector('.nav');
burger.addEventListener('click', () => {
  nav.classList.toggle('open');
  document.body.classList.toggle('no-scroll');
  const spans = burger.querySelectorAll('span');
  if (nav.classList.contains('open')) {
    spans[0].style.transform = 'rotate(45deg) translate(5px, 5px)';
    spans[1].style.opacity = '0';
    spans[2].style.transform = 'rotate(-45deg) translate(5px, -5px)';
  } else {
    spans[0].style.transform = '';
    spans[1].style.opacity = '';
    spans[2].style.transform = '';
  }
});
nav.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    nav.classList.remove('open');
    document.body.classList.remove('no-scroll');
    burger.querySelectorAll('span').forEach(s => { s.style.transform = ''; s.style.opacity = ''; });
  });
});

// ===== Scroll reveal =====
const revealElements = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver((entries) => {
  entries.forEach((entry, i) => {
    if (entry.isIntersecting) {
      setTimeout(() => entry.target.classList.add('visible'), i * 80);
      observer.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });
revealElements.forEach(el => observer.observe(el));

// ===== Counter animation =====
function animateCounter(el) {
  const target = parseInt(el.dataset.target);
  const suffix = el.dataset.suffix || '';
  const duration = 2000; // 2 seconds
  const frameRate = 30; // ms per frame
  const totalFrames = Math.round(duration / frameRate);
  let frame = 0;

  const interval = setInterval(() => {
    frame++;
    const progress = frame / totalFrames;
    // Simple ease-out effect
    const easeOutProgress = 1 - Math.pow(1 - progress, 3);
    let current = Math.round(target * easeOutProgress);

    if (frame >= totalFrames) {
      current = target;
      clearInterval(interval);
    }
    el.textContent = current + suffix;
  }, frameRate);
}
const counters = document.querySelectorAll('.counter');
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.5 });
counters.forEach(el => counterObserver.observe(el));

// ===== Phone input mask =====
const phoneInput = document.getElementById('phone');
if (phoneInput) {
  function formatPhone(digits) {
    // Format: +X XXX XXX XX XX
    let result = '+';
    if (digits.length > 0) result += digits.substring(0, 1);
    if (digits.length > 1) result += ' ' + digits.substring(1, 4);
    if (digits.length > 4) result += ' ' + digits.substring(4, 7);
    if (digits.length > 7) result += ' ' + digits.substring(7, 9);
    if (digits.length > 9) result += ' ' + digits.substring(9, 11);
    return result;
  }

  phoneInput.addEventListener('input', (e) => {
    // Extract only digits from input
    let digits = e.target.value.replace(/\D/g, '');

    // Limit to 11 digits max
    if (digits.length > 11) digits = digits.substring(0, 11);

    if (digits.length === 0) {
      e.target.value = '';
      return;
    }

    const formatted = formatPhone(digits);
    e.target.value = formatted;

    // Place cursor at end
    e.target.setSelectionRange(formatted.length, formatted.length);
  });

  // Block non-digit keys (allow navigation/control keys)
  phoneInput.addEventListener('keydown', (e) => {
    const allowedKeys = ['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab', 'Home', 'End'];
    if (allowedKeys.includes(e.key)) return;
    if (e.ctrlKey || e.metaKey) return; // allow Ctrl+C, Ctrl+V, etc.
    if (!/^\d$/.test(e.key)) {
      e.preventDefault();
    }
  });

  // Handle paste — strip non-digits
  phoneInput.addEventListener('paste', (e) => {
    e.preventDefault();
    const pasted = (e.clipboardData || window.clipboardData).getData('text');
    const digits = pasted.replace(/\D/g, '').substring(0, 11);
    if (digits.length > 0) {
      phoneInput.value = formatPhone(digits);
    }
  });
}

// ===== Form handling — send to WhatsApp =====
const form = document.getElementById('contact-form');
if (form) {
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const name = document.getElementById('name').value.trim();
    const phone = document.getElementById('phone').value.trim();
    const serviceSelect = document.getElementById('service-select');
    const service = serviceSelect.options[serviceSelect.selectedIndex].text;
    const message = document.getElementById('message').value.trim();

    // Build WhatsApp message
    let text = `Новая заявка с сайта:\n\n`;
    text += `👤 Имя: ${name}\n`;
    text += `📞 Телефон: ${phone}\n`;
    if (serviceSelect.value) {
      text += `🔧 Услуга: ${service}\n`;
    }
    if (message) {
      text += `💬 Сообщение: ${message}\n`;
    }

    const whatsappNumber = '77079208087'; // Номер получателя

    const apiUrl = 'https://7107.api.greenapi.com';
    const idInstance = '7107646294';
    const apiTokenInstance = 'b41f0d1414e941759d81c5c04c66e2465ec101ed6ea142e0a5';
    const url = `${apiUrl}/waInstance${idInstance}/sendMessage/${apiTokenInstance}`;

    const payload = {
      chatId: `${whatsappNumber}@c.us`,
      message: text
    };

    const btn = form.querySelector('.form-submit');
    const spinnerSvg = `<svg class="spin-icon" xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>`;
    const checkSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6 9 17l-5-5"/></svg>`;
    const errorSvg = `<svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>`;

    btn.innerHTML = `Отправка... ${spinnerSvg}`;
    btn.disabled = true;

    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    })
      .then(response => {
        if (response.ok) {
          btn.innerHTML = `Отправлено ${checkSvg}`;
          btn.style.background = 'linear-gradient(135deg, #10b981, #059669)';
          form.reset();
          // Reset custom select if exists
          const customTrigger = form.querySelector('.custom-select-trigger span');
          if (customTrigger && serviceSelect) {
            customTrigger.textContent = serviceSelect.options[0].text;
            customTrigger.parentElement.classList.remove('has-value');
            form.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
          }
        } else {
          throw new Error('Network response was not ok');
        }
      })
      .catch(error => {
        console.error('Error:', error);
        btn.innerHTML = `Ошибка ${errorSvg}`;
        btn.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
      })
      .finally(() => {
        setTimeout(() => {
          btn.innerHTML = 'Оставить заявку';
          btn.style.background = '';
          btn.disabled = false;
        }, 3000);
      });
  });
}

// ===== Custom Select Dropdown =====
const customSelects = document.querySelectorAll('select');
customSelects.forEach(select => {
  // Wrap select
  const wrapper = document.createElement('div');
  wrapper.className = 'custom-select-wrapper';
  select.parentNode.insertBefore(wrapper, select);
  wrapper.appendChild(select);
  select.style.display = 'none';

  // Create custom UI
  const customSelect = document.createElement('div');
  customSelect.className = 'custom-select';

  const trigger = document.createElement('div');
  trigger.className = 'custom-select-trigger';

  const triggerText = document.createElement('span');
  triggerText.textContent = select.options[select.selectedIndex].text;

  const arrow = document.createElement('div');
  arrow.className = 'arrow';

  trigger.appendChild(triggerText);
  trigger.appendChild(arrow);
  customSelect.appendChild(trigger);

  const optionsContainer = document.createElement('div');
  optionsContainer.className = 'custom-options';

  Array.from(select.options).forEach((option, index) => {
    const customOption = document.createElement('div');
    customOption.className = `custom-option ${select.selectedIndex === index ? 'selected' : ''}`;
    customOption.textContent = option.text;
    customOption.dataset.value = option.value;

    if (option.value === "") {
      customOption.classList.add('placeholder-option');
    }

    customOption.addEventListener('click', function (e) {
      e.stopPropagation();
      select.value = this.dataset.value;

      // trigger change event just in case
      select.dispatchEvent(new Event('change'));
      triggerText.textContent = this.textContent;

      if (this.dataset.value !== "") {
        trigger.classList.add('has-value');
      } else {
        trigger.classList.remove('has-value');
      }

      optionsContainer.querySelectorAll('.custom-option').forEach(opt => opt.classList.remove('selected'));
      this.classList.add('selected');
      customSelect.classList.remove('open');
    });

    optionsContainer.appendChild(customOption);
  });

  customSelect.appendChild(optionsContainer);
  wrapper.appendChild(customSelect);

  // Toggle open
  trigger.addEventListener('click', function (e) {
    e.stopPropagation();

    // Close other selects first
    document.querySelectorAll('.custom-select.open').forEach(openedSelect => {
      if (openedSelect !== customSelect) {
        openedSelect.classList.remove('open');
      }
    });

    customSelect.classList.toggle('open');
  });

  // Close on outside click
  document.addEventListener('click', function (e) {
    if (!wrapper.contains(e.target)) {
      customSelect.classList.remove('open');
    }
  });
});
