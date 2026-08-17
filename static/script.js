/* =========================================================
   LIBRARY OF PHILOSOPHY — shared site behavior
   Loaded on every page. Handles:
   1. Mobile hamburger menu (open/close, closes on link click
      or on resize back to desktop width)
   2. Active nav-link highlighting for the current page
   3. A "back to top" button that appears after scrolling
   ========================================================= */

document.addEventListener('DOMContentLoaded', () => {

  /* ---------------------------------------------------------
     1. MOBILE MENU
     --------------------------------------------------------- */

  const menuToggle = document.querySelector('.menu-toggle');
  const navLinks = document.querySelector('.nav-links');

  if (menuToggle && navLinks) {

    const closeMenu = () => {
      navLinks.classList.remove('open');
      menuToggle.classList.remove('open');
      menuToggle.setAttribute('aria-expanded', 'false');
    };

    const toggleMenu = () => {
      const isOpen = navLinks.classList.toggle('open');
      menuToggle.classList.toggle('open', isOpen);
      menuToggle.setAttribute('aria-expanded', String(isOpen));
    };

    menuToggle.addEventListener('click', toggleMenu);

    // Close the menu after tapping any link in it
    navLinks.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', closeMenu);
    });

    // Close the menu automatically if the window is resized
    // back up to desktop width while it's open
    window.addEventListener('resize', () => {
      if (window.innerWidth > 860) {
        closeMenu();
      }
    });
  }

  /* ---------------------------------------------------------
     2. ACTIVE NAV LINK
     Highlights whichever nav/footer link matches the
     current page, so visitors can see where they are.
     --------------------------------------------------------- */

  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-links a, .footer-links a').forEach((link) => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    }
  });

  /* ---------------------------------------------------------
     3. BACK TO TOP BUTTON
     Created once here rather than pasted into every HTML
     file, so it stays in sync automatically across pages.
     --------------------------------------------------------- */

  const backToTop = document.createElement('button');
  backToTop.className = 'back-to-top';
  backToTop.setAttribute('aria-label', 'Back to top');
  backToTop.innerHTML = '&uarr;';
  document.body.appendChild(backToTop);

  window.addEventListener('scroll', () => {
    if (window.scrollY > 500) {
      backToTop.classList.add('visible');
    } else {
      backToTop.classList.remove('visible');
    }
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  /* ---------------------------------------------------------
     4. CONTACT FORM
     Only runs on contact.html (checks the form exists first).
     Validates required fields + email format, shows inline
     errors, then submits to Formspree via fetch() — this keeps
     visitors on the styled page instead of redirecting them to
     Formspree's default confirmation page.
     --------------------------------------------------------- */

  const contactForm = document.getElementById('contact-form');

  if (contactForm) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const submitBtn = contactForm.querySelector('.form-submit');
    const successMessage = contactForm.querySelector('.form-success');

    const showError = (group, message) => {
      group.classList.add('invalid');
      group.querySelector('.form-error').textContent = message;
    };

    const clearError = (group) => {
      group.classList.remove('invalid');
      group.querySelector('.form-error').textContent = '';
    };

    contactForm.addEventListener('submit', (event) => {
      event.preventDefault();

      let isValid = true;
      successMessage.classList.remove('visible', 'error');

      contactForm.querySelectorAll('.form-group').forEach((group) => {
        const field = group.querySelector('input, textarea');
        clearError(group);

        if (!field.value.trim()) {
          showError(group, 'This field is required.');
          isValid = false;
        } else if (field.type === 'email' && !emailPattern.test(field.value.trim())) {
          showError(group, 'Please enter a valid email address.');
          isValid = false;
        }
      }); 
       
      

      if (!isValid) {
        return;
      }

      submitBtn.disabled = true;
      submitBtn.textContent = 'Sending...';

      fetch(contactForm.action, {
        method: 'POST',
        body: new FormData(contactForm),
        headers: { Accept: 'application/json' },
      })
        .then((response) => {
          if (response.ok) {
            successMessage.textContent = "Thanks — your message has been sent. I'll get back to you soon.";
            successMessage.classList.add('visible');
            contactForm.reset();
          } else {
            return response.json().then((data) => {
              const errorText = data && data.errors
                ? data.errors.map((e) => e.message).join(', ')
                : 'Something went wrong — please try again or email directly.';
              successMessage.textContent = errorText;
              successMessage.classList.add('visible', 'error');
            });
          }
        })
        .catch(() => {
          successMessage.textContent = 'Network error — please check your connection and try again.';
          successMessage.classList.add('visible', 'error');
        })
        .finally(() => {
          submitBtn.disabled = false;
          submitBtn.textContent = 'Send Message';
        });
    });
  }

});

const sections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".category-nav a");

window.addEventListener("scroll", () => {

    let current = "";

    sections.forEach(section => {

        const sectionTop = section.offsetTop - 180;

        if (window.scrollY >= sectionTop) {
            current = section.getAttribute("id");
        }

    });


const newsletterForm = document.getElementById('newsletter-form');

if (newsletterForm) {
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  const submitBtn = newsletterForm.querySelector('.form-submit');
  const successMessage = newsletterForm.querySelector('.form-success');

  newsletterForm.addEventListener('submit', (event) => {
    event.preventDefault();

    const emailField = newsletterForm.querySelector('input[type="email"]');
    const group = emailField.closest('.form-group');
    const errorSpan = group.querySelector('.form-error');

    successMessage.classList.remove('visible', 'error');
    group.classList.remove('invalid');
    errorSpan.textContent = '';

    if (!emailField.value.trim() || !emailPattern.test(emailField.value.trim())) {
      group.classList.add('invalid');
      errorSpan.textContent = 'Please enter a valid email address.';
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = 'Subscribing...';

    fetch(newsletterForm.action, {
      method: 'POST',
      body: new FormData(newsletterForm),
      headers: { Accept: 'application/json' },
    })
      .then((response) => {
        if (response.ok) {
          successMessage.textContent = "Thanks — you're subscribed!";
          successMessage.classList.add('visible');
          newsletterForm.reset();
        } else {
          successMessage.textContent = 'Something went wrong — please try again.';
          successMessage.classList.add('visible', 'error');
        }
      })
      .catch(() => {
        successMessage.textContent = 'Network error — please check your connection and try again.';
        successMessage.classList.add('visible', 'error');
      })
      .finally(() => {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Subscribe';
      });
  });
}
    // Remove active highlight after leaving the last navigation section
    const lastSection = sections[sections.length - 1];

    if (lastSection) {

        const lastSectionBottom =
            lastSection.offsetTop + lastSection.offsetHeight;

        if (window.scrollY > lastSectionBottom - 180) {
            current = "";
        }

    }

    navLinks.forEach(link => {

        link.classList.remove("active");

        if (link.getAttribute("href") === "#" + current) {
            link.classList.add("active");
        }

    });

});

/* ================= SEARCH BAR ================= */

const searchToggle = document.querySelector(".search-toggle");
const searchBox = document.querySelector(".search-box");
const searchInput = document.querySelector("#site-search");

if (searchToggle && searchBox && searchInput) {

    searchToggle.addEventListener("click", () => {

        const isOpen = searchBox.classList.contains("active");

        if (isOpen) {

            searchBox.classList.remove("active");
            searchToggle.setAttribute("aria-expanded", "false");
            searchToggle.setAttribute("aria-label", "Open search");
            searchInput.value = "";

        } else {

            searchBox.classList.add("active");
            searchToggle.setAttribute("aria-expanded", "true");
            searchToggle.setAttribute("aria-label", "Close search");
            searchInput.focus();

        }

    });

}

/* ================= SITE SEARCH ================= */

const searchResults = document.querySelector("#search-results");

const searchData = [
   
    /* ================= MAIN PAGES ================= */

    {
        title: "Home",
        category: "Main Page",
        description: "Explore over 2,500 years of philosophy.",
        keywords: "home philosophy library",
        url: "index.html"
    },

    {
        title: "History of Philosophy",
        category: "History",
        description: "Explore the development of philosophy across different eras.",
        keywords: "history philosophy ancient medieval renaissance enlightenment modern contemporary",
        url: "history.html"
    },

    {
        title: "Thinkers",
        category: "Philosophers",
        description: "Discover philosophers and the ideas that shaped philosophy.",
        keywords: "thinkers philosophers great philosophers",
        url: "thinkers.html"
    },

    {
        title: "Branches of Philosophy",
        category: "Branches",
        description: "Explore the major branches and fields of philosophical thought.",
        keywords: "branches ethics metaphysics epistemology logic aesthetics political philosophy mind language science religion",
        url: "branches.html"
    },

    {
        title: "Schools of Philosophy",
        category: "Schools",
        description: "Explore major philosophical schools and traditions.",
        keywords: "schools stoicism epicureanism cynicism existentialism rationalism empiricism vedanta buddhism taoism confucianism",
        url: "schools.html"
    },

    {
        title: "Books",
        category: "Books",
        description: "Explore philosophical books and recommended reading.",
        keywords: "books philosophy reading philosophers texts",
        url: "books.html"
    },

    {
        title: "World Literature",
        category: "Literature",
        description: "Explore philosophy through world literature.",
        keywords: "literature novels poetry writers world literature philosophy",
        url: "world-literature.html"
    },

    {
        title: "Blog",
        category: "Blog",
        description: "Read articles and discussions about philosophy.",
        keywords: "blog articles philosophy ideas",
        url: "blog.html"
    },


    /* ================= ANCIENT GREEK ================= */

    {
        title: "Thales of Miletus",
        category: "Ancient Greek",
        description: "Early Greek philosopher associated with natural philosophy and the search for the fundamental substance of reality.",
        keywords: "thales thales of miletus greek philosophy first philosopher natural philosophy water geometry astronomy",
        url: "thinkers.html#thales"
    },

    {
        title: "Pythagoras",
        category: "Ancient Greek",
        description: "Greek philosopher and mathematician associated with Pythagoreanism, mathematics and harmony.",
        keywords: "pythagoras pythagorean pythagoreanism mathematics numbers harmony geometry",
        url: "thinkers.html#pythagoras"
    },

    {
        title: "Heraclitus",
        category: "Ancient Greek",
        description: "Pre-Socratic philosopher known for his philosophy of change, opposites and the Logos.",
        keywords: "heraclitus greek pre socratic change flux unity opposites logos river natural philosophy",
        url: "thinkers.html#heraclitus"
    },

    {
        title: "Democritus",
        category: "Ancient Greek",
        description: "Pre-Socratic philosopher associated with atomism and materialism.",
        keywords: "democritus atomism atoms materialism natural science greek philosophy",
        url: "thinkers.html#democritus"
    },

    {
        title: "Socrates",
        category: "Ancient Greek",
        description: "Greek philosopher known for questioning, ethics and the Socratic method.",
        keywords: "socrates socratic method critical thinking ethics self examination ancient greek moral philosophy",
        url: "thinkers.html#socrates"
    },

    {
        title: "Plato",
        category: "Ancient Greek",
        description: "Greek philosopher, founder of the Academy and author of The Republic.",
        keywords: "plato republic theory forms ideal state academy education platonism greek philosophy",
        url: "thinkers.html#plato"
    },

    {
        title: "Aristotle",
        category: "Ancient Greek",
        description: "Greek philosopher whose work covered logic, ethics, science, politics and the arts.",
        keywords: "aristotle virtue ethics formal logic biology science observation politics metaphysics peripatetic",
        url: "thinkers.html#aristotle"
    },

    {
        title: "Diogenes of Sinope",
        category: "Ancient Greek",
        description: "Cynic philosopher known for asceticism and criticism of social conventions.",
        keywords: "diogenes diogenes of sinope cynicism cynic minimalism virtue nature social conventions",
        url: "thinkers.html#diogenes"
    },


    /* ================= INDIAN ================= */

    {
        title: "Gautama Buddha",
        category: "Indian & Eastern",
        description: "Founder of Buddhism and teacher of the Four Noble Truths and Eightfold Path.",
        keywords: "buddha gautama buddhism buddhist four noble truths eightfold path meditation mindfulness nirvana india",
        url: "thinkers.html#gautama-buddha"
    },

    {
        title: "Mahavira",
        category: "Indian & Eastern",
        description: "Important figure in Jain philosophy associated with non-violence and spiritual liberation.",
        keywords: "mahavira jainism jain philosophy ahimsa non violence self control liberation india",
        url: "thinkers.html#mahavira"
    },

    {
        title: "Chanakya (Kautilya)",
        category: "Indian Philosophy",
        description: "Indian thinker associated with the Arthashastra, political philosophy, economics and statecraft.",
        keywords: "chanakya kautilya indian philosophy arthashastra political philosophy economics statecraft diplomacy india",
        url: "thinkers.html#chanakya"
    },

    {
        title: "Adi Shankaracharya",
        category: "Indian Philosophy",
        description: "Indian philosopher and teacher associated with Advaita Vedanta.",
        keywords: "shankara adi shankaracharya advaita vedanta vedanta upanishads brahma atman hindu philosophy india",
        url: "thinkers.html#adi-shankaracharya"
    },

    {
        title: "Nagarjuna",
        category: "Indian & Eastern",
        description: "Indian Buddhist philosopher associated with Madhyamaka and the philosophy of emptiness.",
        keywords: "nagarjuna madhyamaka buddhism buddhist emptiness sunyata middle way mahayana india",
        url: "thinkers.html#nagarjuna"
    },

    {
        title: "Jiddu Krishnamurti",
        category: "Indian Philosophy",
        description: "Modern Indian spiritual thinker known for self-awareness, freedom and questioning authority.",
        keywords: "jiddu krishnamurti krishnamurti self awareness freedom fear psychological conditioning spirituality india",
        url: "thinkers.html#jiddu-krishnamurti"
    },


    /* ================= CHINESE ================= */

    {
        title: "Confucius",
        category: "Chinese Philosophy",
        description: "Chinese philosopher associated with Confucianism, ethics, education and good governance.",
        keywords: "confucius confucianism chinese philosophy ethics morality education governance virtue filial piety china",
        url: "thinkers.html#confucius"
    },

    {
        title: "Lao Tzu",
        category: "Chinese Philosophy",
        description: "Chinese philosopher traditionally associated with Taoism and the Tao Te Ching.",
        keywords: "lao tzu laozi taoism daoism tao te ching wu wei nature harmony chinese philosophy china",
        url: "thinkers.html#lao-tzu"
    },

    {
        title: "Zhuangzi",
        category: "Chinese Philosophy",
        description: "Chinese philosopher associated with Taoist philosophy, freedom of thought and natural living.",
        keywords: "zhuangzi taoism daoism taoist freedom mind natural living parables chinese philosophy china",
        url: "thinkers.html#zhuangzi"
    },

    {
        title: "Mencius",
        category: "Chinese Philosophy",
        description: "Chinese Confucian philosopher known for his views on human nature and benevolent government.",
        keywords: "mencius confucianism confucian human nature good benevolent government moral education china",
        url: "thinkers.html#mencius"
    },


    /* ================= ENLIGHTENMENT & MODERN ================= */

    {
        title: "René Descartes",
        category: "Modern Philosophy",
        description: "French philosopher associated with rationalism, modern philosophy and mind-body dualism.",
        keywords: "descartes rene descartes rationalism modern philosophy mind body dualism cogito geometry epistemology",
        url: "thinkers.html#rene-descarte"
    },

    {
        title: "John Locke",
        category: "Enlightenment",
        description: "English Enlightenment philosopher associated with empiricism, natural rights and liberalism.",
        keywords: "john locke locke empiricism natural rights social contract liberalism enlightenment government",
        url: "thinkers.html#john-loche"
    },

    {
        title: "David Hume",
        category: "Enlightenment",
        description: "Scottish philosopher known for empiricism, skepticism and his theory of causation.",
        keywords: "david hume hume empiricism skepticism causation philosophy of mind experience enlightenment",
        url: "thinkers.html#david-hume"
    },

    {
        title: "Immanuel Kant",
        category: "Enlightenment",
        description: "German philosopher whose work transformed epistemology, metaphysics and moral philosophy.",
        keywords: "kant immanuel kant enlightenment epistemology metaphysics ethics categorical imperative critique pure reason moral philosophy",
        url: "thinkers.html#immanuel-kant"
    },

    {
        title: "Arthur Schopenhauer",
        category: "Modern Philosophy",
        description: "German philosopher known for pessimism, the will and The World as Will and Representation.",
        keywords: "schopenhauer pessimism will world representation ethics compassion existentialism indian philosophy",
        url: "thinkers.html#schopenhauer"
    },

    {
        title: "Karl Marx",
        category: "Modern Philosophy",
        description: "German philosopher and social theorist associated with historical materialism and class struggle.",
        keywords: "karl marx marx marxism communism capitalism class struggle historical materialism political philosophy economics",
        url: "thinkers.html#karl-marx"
    },

    {
        title: "Friedrich Nietzsche",
        category: "Modern Philosophy",
        description: "German philosopher known for his critique of morality, will to power and existential thought.",
        keywords: "nietzsche friedrich nietzsche will power ubermensch morality existentialism nihilism god dead philosophy",
        url: "thinkers.html#neitzsche"
    },

    {
        title: "Jean-Paul Sartre",
        category: "Contemporary Philosophy",
        description: "French philosopher associated with existentialism, freedom, responsibility and phenomenology.",
        keywords: "sartre jean paul sartre existentialism freedom responsibility phenomenology marxism existence",
        url: "thinkers.html#jean-paul"
    },

    {
        title: "Albert Camus",
        category: "Contemporary Philosophy",
        description: "French philosopher and writer associated with absurdism, revolt and freedom.",
        keywords: "camus albert camus absurdism myth sisyphus stranger revolt freedom existentialism",
        url: "thinkers.html#albert-kamus"
    },

    {
        title: "Bertrand Russell",
        category: "Contemporary Philosophy",
        description: "British philosopher and logician associated with analytic philosophy, logic and philosophy of language.",
        keywords: "bertrand russell russell analytic philosophy logic mathematical logic language pacifism",
        url: "thinkers.html#russell"
    },

    {
        title: "G. W. F. Hegel",
        category: "Modern Philosophy",
        description: "German idealist philosopher known for dialectics and the philosophy of history.",
        keywords: "hegel hegelian german idealism absolute idealism dialectical method philosophy history",
        url: "thinkers.html#hegel"
    },

    {
        title: "Baruch Spinoza",
        category: "Modern Philosophy",
        description: "Early modern philosopher associated with rationalism, monism and Ethics.",
        keywords: "spinoza baruch spinoza rationalism monism god nature ethics enlightenment",
        url: "thinkers.html#spinoza"
    },

    {
        title: "Simone de Beauvoir",
        category: "Contemporary Philosophy",
        description: "French existentialist philosopher associated with feminist philosophy and The Second Sex.",
        keywords: "simone de beauvoir feminist philosophy feminism existentialism second sex freedom otherness phenomenology",
        url: "thinkers.html#simone"
    },


    /* ================= ISLAMIC ================= */

    {
        title: "Al-Ghazali",
        category: "Islamic Philosophy",
        description: "Islamic philosopher, theologian and mystic known for his work on theology, ethics and Sufism.",
        keywords: "ghazali al ghazali islamic philosophy theology sufism ethics islam",
        url: "thinkers.html#al-ghazali"
    },

    {
        title: "Al-Farabi",
        category: "Islamic Philosophy",
        description: "Islamic philosopher associated with political philosophy, logic and metaphysics.",
        keywords: "farabi al farabi islamic philosophy political philosophy logic metaphysics neoplatonism aristotle",
        url: "thinkers.html#al-farabi"
    },

    {
        title: "Avicenna (Ibn Sina)",
        category: "Islamic Philosophy",
        description: "Persian polymath known for contributions to philosophy, medicine, metaphysics and psychology.",
        keywords: "avicenna ibn sina islamic philosophy metaphysics essence existence psychology medicine aristotle",
        url: "thinkers.html#avicenna"
    },

    {
        title: "Averroes (Ibn Rushd)",
        category: "Islamic Philosophy",
        description: "Andalusian philosopher known for his commentaries on Aristotle and defense of rational inquiry.",
        keywords: "averroes ibn rushd islamic philosophy aristotle rationalism faith reason law medicine political philosophy",
        url: "thinkers.html#averroes"
    },

    /* ================= SCHOOLS OF PHILOSOPHY ================= */

/* ---------- ANCIENT GREEK ---------- */

{
    title: "Stoicism",
    category: "Greek Philosophy",
    description: "A school of ancient Greek and Roman philosophy focused on virtue, reason, nature, and distinguishing what is within our control.",
    keywords: "stoicism stoic zeno seneca epictetus marcus aurelius virtue control nature ethics tranquility",
    url: "greek-schools.html#stoicism"
},

{
    title: "Epicureanism",
    category: "Greek Philosophy",
    description: "A school of ancient Greek philosophy centered on tranquility, friendship, modest living, and freedom from unnecessary fear.",
    keywords: "epicureanism epicurus garden ataraxia pleasure happiness friendship atoms death gods materialism",
    url: "greek-schools.html#epicureanism"
},

{
    title: "Cynicism",
    category: "Greek Philosophy",
    description: "An ancient Greek school emphasizing virtue, simplicity, self-sufficiency, and freedom from social conventions.",
    keywords: "cynicism cynic diogenes antisthenes asceticism nature simplicity freedom wealth social convention",
    url: "greek-schools.html#cynicism"
},

{
    title: "Skepticism",
    category: "Greek Philosophy",
    description: "An ancient philosophical tradition questioning whether certain knowledge is attainable and emphasizing suspension of judgment.",
    keywords: "skepticism pyrrhonism pyrrho doubt uncertainty epoche suspension judgment knowledge ataraxia",
    url: "greek-schools.html#skepticism"
},

{
    title: "Peripateticism",
    category: "Greek Philosophy",
    description: "The philosophical school founded by Aristotle at the Lyceum, emphasizing systematic inquiry, observation, logic, and natural philosophy.",
    keywords: "peripateticism aristotle lyceum aristotelianism observation logic biology physics metaphysics golden mean",
    url: "greek-schools.html#peripateticism"
},

{
    title: "Neoplatonism",
    category: "Greek Philosophy",
    description: "A philosophical tradition associated with Plotinus that describes reality as emanating from the transcendent One.",
    keywords: "neoplatonism plotinus plato one emanation soul intellect metaphysics porphyry",
    url: "greek-schools.html#neoplatonsim"
},

{
    title: "Atomism",
    category: "Greek Philosophy",
    description: "An ancient natural philosophy holding that physical reality consists of indivisible atoms moving through empty space.",
    keywords: "atomism atoms democritus leucippus epicurus materialism void matter physics natural philosophy",
    url: "greek-schools.html#atomism"
},

{
    title: "Sophism",
    category: "Greek Philosophy",
    description: "A movement of traveling teachers in ancient Greece associated with rhetoric, argumentation, practical education, and relativism.",
    keywords: "sophism sophists protagoras rhetoric relativism argumentation education democracy man measure all things",
    url: "greek-schools.html#sophsim"
},


/* ---------- INDIAN ---------- */

{
    title: "Buddhism",
    category: "Indian Philosophy",
    description: "An ancient Indian philosophical tradition centered on suffering, the Middle Way, mindfulness, and liberation.",
    keywords: "buddhism buddha gautama four noble truths eightfold path dukkha nirvana anatta impermanence",
    url: "indian-schools.html#buddhism"
},

{
    title: "Vedanta",
    category: "Indian Philosophy",
    description: "An orthodox Indian philosophical tradition exploring Brahman, Atman, reality, karma, and liberation.",
    keywords: "vedanta hindu philosophy brahman atman upanishads karma samsara moksha advaita dvaita",
    url: "indian-schools.html#vedanta"
},

{
    title: "Jainism",
    category: "Indian Philosophy",
    description: "An ancient Indian tradition emphasizing non-violence, asceticism, multiple perspectives, and liberation.",
    keywords: "jainism jain mahavira ahimsa non violence anekantavada karma soul liberation asceticism",
    url: "indian-schools.html#jainism"
},

{
    title: "Advaita Vedanta",
    category: "Indian Philosophy",
    description: "A non-dualistic school of Vedanta teaching the fundamental unity of Atman and Brahman.",
    keywords: "advaita advaita vedanta shankara shankaracharya non dualism brahman atman maya avidya jnana",
    url: "indian-schools.html#advaita-vedanta"
},

{
    title: "Zen Buddhism",
    category: "Indian Philosophy",
    description: "A Buddhist tradition emphasizing direct experience, meditation, mindfulness, and awakening.",
    keywords: "zen zen buddhism buddhism chan meditation zazen satori kensho koan mindfulness bodhidharma",
    url: "indian-schools.html#zen--buddhism"
},

{
    title: "Samkhya",
    category: "Indian Philosophy",
    description: "An ancient dualistic Indian school explaining reality through the distinction between consciousness and material nature.",
    keywords: "samkhya sankhya purusha prakriti gunas sattva rajas tamas dualism kapila consciousness matter",
    url: "indian-schools.html#samkhya"
},

{
    title: "Yoga",
    category: "Indian Philosophy",
    description: "A classical Indian philosophical school associated with Patanjali, meditation, discipline, and spiritual liberation.",
    keywords: "yoga patanjali yoga sutras ashtanga meditation samadhi dhyana pranayama moksha consciousness",
    url: "indian-schools.html#yoga"
},

{
    title: "Nyaya",
    category: "Indian Philosophy",
    description: "An Indian school of logic and epistemology focused on valid knowledge, reasoning, evidence, and debate.",
    keywords: "nyaya logic epistemology pramana inference perception reasoning debate knowledge gautama",
    url: "indian-schools.html#nyaya"
},

{
    title: "Vaisheshika",
    category: "Indian Philosophy",
    description: "An ancient Indian school of natural philosophy, metaphysics, categorization, and atomism.",
    keywords: "vaisheshika vaisesika kanada atomism atoms paramanu categories metaphysics natural philosophy",
    url: "indian-schools.html#vaisheshika"
},

{
    title: "Mimamsa",
    category: "Indian Philosophy",
    description: "An orthodox Indian school concerned with Vedic ritual, duty, interpretation, and the philosophy of language.",
    keywords: "mimamsa purva mimamsa jaimini vedas dharma ritual language hermeneutics apurva",
    url: "indian-schools.html#mimamsa"
},

{
    title: "Charvaka",
    category: "Indian Philosophy",
    description: "An ancient Indian materialist and skeptical school emphasizing direct perception and rejecting religious dogma.",
    keywords: "charvaka lokayata materialism skepticism empiricism perception atheism hedonism india",
    url: "indian-schools.html#charvaka"
},


/* ---------- CHINESE & JAPANESE ---------- */

{
    title: "Confucianism",
    category: "Chinese Philosophy",
    description: "A Chinese ethical and philosophical tradition emphasizing social harmony, moral cultivation, education, and filial piety.",
    keywords: "confucianism confucius mencius xunzi ren li xiao filial piety ethics education china",
    url: "chinese-japanese-schools.html#confucianism"
},

{
    title: "Taoism",
    category: "Chinese Philosophy",
    description: "A Chinese philosophical tradition centered on the Dao, naturalness, harmony, and effortless action.",
    keywords: "taoism daoism laozi lao tzu zhuangzi dao wu wei yin yang nature harmony china",
    url: "chinese-japanese-schools.html#taoism"
},

{
    title: "Legalism",
    category: "Chinese Philosophy",
    description: "A Chinese political philosophy emphasizing strict laws, centralized authority, rewards, and punishments.",
    keywords: "legalism fajia han feizi shang yang law government state china politics centralized power",
    url: "chinese-japanese-schools.html#legalism"
},

{
    title: "Mohism",
    category: "Chinese Philosophy",
    description: "A Chinese philosophical school founded by Mozi emphasizing universal love, meritocracy, and practical social benefit.",
    keywords: "mohism mozi jianai universal love utilitarianism meritocracy anti fatalism china",
    url: "chinese-japanese-schools.html#mohism"
},

{
    title: "Neo-Confucianism",
    category: "Chinese Philosophy",
    description: "A revival of Confucian thought integrating metaphysical ideas concerning Li, Qi, morality, and the cosmos.",
    keywords: "neo confucianism confucianism zhu xi wang yangming li qi chinese philosophy",
    url: "chinese-japanese-schools.html#neo-confucianism"
},

{
    title: "Kyoto School",
    category: "Japanese Philosophy",
    description: "A modern Japanese philosophical movement combining Western philosophy with Zen and Mahayana Buddhist thought.",
    keywords: "kyoto school nishida nishitani zen buddhism absolute nothingness japan hegel heidegger",
    url: "chinese-japanese-schools.html#kyoto-school"
},

{
    title: "Bushidō",
    category: "Japanese Philosophy",
    description: "The ethical code of the Japanese samurai emphasizing loyalty, honor, discipline, courage, and integrity.",
    keywords: "bushido samurai warrior honor loyalty courage discipline japan ethics",
    url: "chinese-japanese-schools.html#bushido"
},

{
    title: "Japanese Zen",
    category: "Japanese Philosophy",
    description: "A Japanese Zen tradition emphasizing meditation, mindfulness, direct awakening, and disciplined practice.",
    keywords: "japanese zen zen rinzai soto dogen eisai zazen satori kensho shikantaza japan",
    url: "chinese-japanese-schools.html#japanese-zen"
},


/* ---------- ISLAMIC ---------- */

{
    title: "Avicennism",
    category: "Islamic Philosophy",
    description: "The philosophical system of Ibn Sina combining Aristotelian logic, Neoplatonic metaphysics, and Islamic theology.",
    keywords: "avicennism avicenna ibn sina falsafa essence existence necessary existent metaphysics aristotle neoplatonism",
    url: "islamic-schools.html#avicennism"
},

{
    title: "Averroism",
    category: "Islamic Philosophy",
    description: "The philosophical tradition associated with Ibn Rushd and his defense of Aristotelian rationalism.",
    keywords: "averroism averroes ibn rushd aristotle rationalism reason religion philosophy islamic spain",
    url: "islamic-schools.html#averroism"
},

{
    title: "Illuminationism",
    category: "Islamic Philosophy",
    description: "Suhrawardi's philosophical school combining rational analysis with intuitive spiritual knowledge and a metaphysics of light.",
    keywords: "illuminationism sufi suhrawardi hikmat al ishraq light darkness knowledge presence islamic philosophy",
    url: "islamic-schools.html#illuminationism"
},

{
    title: "Sufism",
    category: "Islamic Philosophy",
    description: "The mystical tradition of Islam emphasizing spiritual purification, divine love, remembrance, and direct experience.",
    keywords: "sufism tasawwuf islamic mysticism rumi ibn arabi fana baqa dhikr divine love unity being",
    url: "islamic-schools.html#sufism"
},

{
    title: "Kalam",
    category: "Islamic Philosophy",
    description: "The Islamic tradition of speculative theology using dialectical reasoning to defend religious doctrines.",
    keywords: "kalam islamic theology mutakallimun ashari maturidi mutazila occasionalism theology reason",
    url: "islamic-schools.html#kalam"
},

{
    title: "Transcendent Theosophy",
    category: "Islamic Philosophy",
    description: "Mulla Sadra's synthesis of Avicennian philosophy, Illuminationism, Sufi thought, and Shi'ite theology.",
    keywords: "transcendent theosophy mulla sadra hikmat al muta aliyah existence asalat al wujud substantial motion islamic philosophy",
    url: "islamic-schools.html#transcendent-theosophy"
},


/* ---------- ENLIGHTENMENT ---------- */

{
    title: "Rationalism",
    category: "Enlightenment Philosophy",
    description: "An epistemological framework emphasizing reason, innate ideas, deduction, and a priori knowledge.",
    keywords: "rationalism descartes spinoza leibniz reason innate ideas deduction a priori knowledge",
    url: "enlightenment-schools.html#rationalism"
},

{
    title: "Empiricism",
    category: "Enlightenment Philosophy",
    description: "An epistemological tradition holding that knowledge develops through sensory experience and observation.",
    keywords: "empiricism locke hume berkeley tabula rasa experience senses induction a posteriori",
    url: "enlightenment-schools.html#empiricism"
},

{
    title: "Idealism",
    category: "Enlightenment Philosophy",
    description: "A philosophical movement emphasizing the role of mind, consciousness, and conceptual structures in reality.",
    keywords: "idealism kant hegel schopenhauer german idealism transcendental idealism absolute idealism mind",
    url: "enlightenment-schools.html#idealism"
},

{
    title: "Social Contract Theory",
    category: "Enlightenment Philosophy",
    description: "A political theory explaining political authority through an agreement among individuals.",
    keywords: "social contract hobbes locke rousseau state nature natural rights consent government general will",
    url: "enlightenment-schools.html#social-contact-theory"
},

{
    title: "Materialism",
    category: "Enlightenment Philosophy",
    description: "The philosophical position that reality is fundamentally physical or material.",
    keywords: "materialism physicalism matter atoms consciousness marx dialectical materialism lucretius",
    url: "enlightenment-schools.html#materialism"
},

{
    title: "Deism",
    category: "Enlightenment Philosophy",
    description: "An Enlightenment theological philosophy affirming a creator through reason and nature while rejecting revelation and miracles.",
    keywords: "deism deist god creator watchmaker reason enlightenment thomas paine jefferson miracles religion",
    url: "enlightenment-schools.html#deism"
},

{
    title: "Natural Law Theory",
    category: "Enlightenment Philosophy",
    description: "A philosophical theory holding that universal moral principles can be discovered through human reason and nature.",
    keywords: "natural law morality reason universal rights aquinas grotius locke ethics law human rights",
    url: "enlightenment-schools.html#natural-law-theory"
},

{
    title: "Pantheism",
    category: "Enlightenment Philosophy",
    description: "The view that God and nature or the universe are fundamentally identical.",
    keywords: "pantheism spinoza god nature monism deus sive natura determinism",
    url: "enlightenment-schools.html#pantheism"
},

{
    title: "Classical Liberalism",
    category: "Enlightenment Philosophy",
    description: "A political and economic philosophy emphasizing individual liberty, civil rights, limited government, and free markets.",
    keywords: "classical liberalism locke adam smith john stuart mill liberty rights free market capitalism government",
    url: "enlightenment-schools.html#classical-liberalism"
},

{
    title: "Deontology",
    category: "Enlightenment Philosophy",
    description: "An ethical theory that judges actions according to duties and moral rules rather than consequences.",
    keywords: "deontology kant duty categorical imperative ethics moral rules obligation consequences",
    url: "enlightenment-schools.html#deontology"
},


/* ---------- MODERN & CONTEMPORARY ---------- */

{
    title: "Existentialism",
    category: "Modern Philosophy",
    description: "A movement emphasizing individual existence, freedom, responsibility, choice, and the creation of meaning.",
    keywords: "existentialism sartre beauvoir camus kierkegaard freedom meaning existence essence authenticity angst",
    url: "modern-schools.html#existentialism"
},

{
    title: "Nihilism",
    category: "Modern Philosophy",
    description: "A philosophical position questioning objective meaning, purpose, value, and moral truth.",
    keywords: "nihilism nietzsche meaning purpose morality values death god existentialism",
    url: "modern-schools.html#nihilism"
},

{
    title: "Pragmatism",
    category: "Modern Philosophy",
    description: "A philosophical tradition evaluating ideas according to their practical consequences and usefulness.",
    keywords: "pragmatism peirce william james john dewey practical consequences instrumentalism truth fallibilism",
    url: "modern-schools.html#pragmatism"
},

{
    title: "Utilitarianism",
    category: "Modern Philosophy",
    description: "An ethical theory judging actions by their consequences and their ability to maximize overall happiness.",
    keywords: "utilitarianism bentham mill happiness pleasure pain consequentialism greatest happiness ethics",
    url: "modern-schools.html#utilitariansim"
},

{
    title: "Phenomenology",
    category: "Modern Philosophy",
    description: "A philosophical movement studying conscious experience and phenomena from the first-person perspective.",
    keywords: "phenomenology husserl heidegger merleau ponty consciousness experience intentionality epoche lifeworld",
    url: "modern-schools.html#phenomenology"
},

{
    title: "Analytic Philosophy",
    category: "Modern Philosophy",
    description: "A tradition emphasizing logical rigor, clarity, language, and conceptual analysis.",
    keywords: "analytic philosophy russell wittgenstein moore logic language linguistic turn logical atomism",
    url: "modern-schools.html#analytic-philosophy"
},

{
    title: "Marxism",
    category: "Modern Philosophy",
    description: "A philosophical, political, and economic framework centered on historical materialism and class struggle.",
    keywords: "marxism marx engels capitalism class struggle historical materialism dialectical materialism bourgeoisie proletariat",
    url: "modern-schools.html#marxism"
},

{
    title: "Absurdism",
    category: "Modern Philosophy",
    description: "A philosophical perspective examining the conflict between humanity's search for meaning and an indifferent universe.",
    keywords: "absurdism camus sisyphus absurd meaning revolt freedom passion existentialism",
    url: "modern-schools.html#absurdism"
},

{
    title: "Structuralism",
    category: "Modern Philosophy",
    description: "An intellectual movement analyzing human culture, language, and behavior through underlying structures.",
    keywords: "structuralism saussure levi strauss barthes language signs culture binary oppositions structures",
    url: "modern-schools.html#structuralism"
},

{
    title: "Postmodernism",
    category: "Modern Philosophy",
    description: "A movement skeptical of grand narratives, absolute truth, and claims of universal certainty.",
    keywords: "postmodernism lyotard foucault baudrillard metanarratives power knowledge hyperreality social construction",
    url: "modern-schools.html#psotmodernism"
},

{
    title: "Logical Positivism",
    category: "Modern Philosophy",
    description: "A philosophical movement emphasizing empirical verification and formal logical analysis.",
    keywords: "logical positivism logical empiricism vienna circle verification principle ayer carnap science metaphysics",
    url: "modern-schools.html#logical-positivism"
},

{
    title: "Critical Theory",
    category: "Modern Philosophy",
    description: "A philosophical framework critically examining systems of power, domination, ideology, and social structures.",
    keywords: "critical theory frankfurt school horkheimer adorno marcuse marxism ideology culture industry emancipation",
    url: "modern-schools.html#critical-theory"
},

];


if (searchInput && searchResults) {

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            searchResults.innerHTML = "";
            return;
        }

        const matches = searchData.filter(item => {

    return (
        item.title.toLowerCase().includes(query) ||
        item.category.toLowerCase().includes(query) ||
        item.description.toLowerCase().includes(query) ||
        (item.keywords && item.keywords.toLowerCase().includes(query))
    );

});

if (searchInput && searchResults) {

    searchInput.addEventListener("input", () => {

        const query = searchInput.value.trim().toLowerCase();

        if (!query) {
            searchResults.innerHTML = "";
            return;
        }

        const matches = searchData.filter(item => {

            return (
                item.title.toLowerCase().includes(query) ||
                item.category.toLowerCase().includes(query) ||
                item.description.toLowerCase().includes(query) ||
                (item.keywords && item.keywords.toLowerCase().includes(query))
            );

        });

        // Rank results by relevance
        matches.sort((a, b) => {

            const getScore = (item) => {

                const title = item.title.toLowerCase();
                const category = item.category.toLowerCase();
                const description = item.description.toLowerCase();
                const keywords = item.keywords
                    ? item.keywords.toLowerCase()
                    : "";

                // Exact title match
                if (title === query) return 100;

                // Title starts with the search
                if (title.startsWith(query)) return 90;

                // Search appears somewhere in title
                if (title.includes(query)) return 80;

                // Search appears in keywords
                if (keywords.includes(query)) return 60;

                // Search appears in category
                if (category.includes(query)) return 50;

                // Search appears in description
                if (description.includes(query)) return 20;

                return 0;
            };

            return getScore(b) - getScore(a);

        });

        if (matches.length === 0) {

            searchResults.innerHTML = `
                <div class="search-no-results">
                    No results found.
                </div>
            `;

            return;
        }

        searchResults.innerHTML = matches.map(item => `

            <a href="${item.url}" class="search-result">

                <strong>${item.title}</strong>

                <span class="search-result-category">
                    ${item.category}
                </span>

                <p>${item.description}</p>

            </a>

        `).join("");

    });

}

        if (matches.length === 0) {

            searchResults.innerHTML = `
                <div class="search-no-results">
                    No results found.
                </div>
            `;

            return;
        }

        searchResults.innerHTML = matches.map(item => `

            <a href="${item.url}" class="search-result">

                <strong>${item.title}</strong>

                <span class="search-result-category">
                    ${item.category}
                </span>

                <p>${item.description}</p>

            </a>

        `).join("");

    });

}

/* ================= LANGUAGE MENU ================= */

const languageToggle = document.querySelector(".language-toggle");
const languageBox = document.querySelector(".language-box");

if (languageToggle && languageBox) {

    languageToggle.addEventListener("click", () => {

        const isOpen = languageBox.classList.contains("active");

        if (isOpen) {

            languageBox.classList.remove("active");
            languageToggle.setAttribute("aria-expanded", "false");

        } else {

            languageBox.classList.add("active");
            languageToggle.setAttribute("aria-expanded", "true");

        }

    });

}

/* ================= GOOGLE TRANSLATION ================= */
/* ================= GOOGLE TRANSLATION ================= */

const languageOptions =
    document.querySelectorAll(".language-option");

const languageCurrent =
    document.querySelector(".language-current");


/* Language names shown in the button */

const languageNames = {
    en: "English",
    hi: "हिन्दी",
    es: "Español",
    fr: "Français",
    de: "Deutsch",
    ja: "日本語",
    ar: "العربية"
};


/* Show saved language */

const savedLanguage =
    localStorage.getItem("selectedLanguage") || "en";

if (languageCurrent) {
    languageCurrent.textContent =
        languageNames[savedLanguage] || "English";
}


/* Language selection */

languageOptions.forEach((option) => {

    option.addEventListener("click", () => {

        const targetLanguage =
            option.getAttribute("data-lang");


        /* ================= ENGLISH ================= */

        if (targetLanguage === "en") {

            /* Remove saved translated language */
            localStorage.removeItem("selectedLanguage");

            /*
             * If currently on a Google Translate page,
             * get the original page from the "u" parameter.
             */
            const params =
                new URLSearchParams(window.location.search);

            const originalPage =
                params.get("u");

            if (originalPage) {

                window.location.href =
                    decodeURIComponent(originalPage);

                return;
            }


            /*
             * Otherwise return to the original page
             * that was saved before translation.
             */
            const savedOriginalPage =
                localStorage.getItem("originalPage");

            if (savedOriginalPage) {

                window.location.href =
                    savedOriginalPage;

                return;
            }


            /* Fallback */
            window.location.href =
                "https://agnostickind.github.io/philosophy-website/";

            return;
        }


        /* ================= OTHER LANGUAGES ================= */

        const currentPage =
            window.location.href;


        /*
         * Save the original GitHub Pages URL
         * before sending the visitor to Google Translate.
         */
        if (window.location.protocol !== "file:") {

            localStorage.setItem(
                "originalPage",
                currentPage
            );

            localStorage.setItem(
                "selectedLanguage",
                targetLanguage
            );
        }


        /* Google Translate URL */

        const googleTranslateUrl =
            "https://translate.google.com/translate" +
            "?sl=auto" +
            "&tl=" + targetLanguage +
            "&u=" + encodeURIComponent(currentPage);


        window.location.href =
            googleTranslateUrl;

    });

});

/* =========================================
   READING & APPEARANCE SETTINGS
   ========================================= */

const appearanceToggle =
    document.getElementById("appearanceToggle");

const appearancePanel =
    document.getElementById("appearancePanel");

const appearanceClose =
    document.getElementById("appearanceClose");

const resetAppearance =
    document.getElementById("resetAppearance");


/* =========================================
   OPEN / CLOSE PANEL
   ========================================= */

function openAppearancePanel() {

    appearancePanel.classList.add("open");

    appearancePanel.setAttribute(
        "aria-hidden",
        "false"
    );

    appearanceToggle.setAttribute(
        "aria-expanded",
        "true"
    );
}


function closeAppearancePanel() {

    appearancePanel.classList.remove("open");

    appearancePanel.setAttribute(
        "aria-hidden",
        "true"
    );

    appearanceToggle.setAttribute(
        "aria-expanded",
        "false"
    );
}


/* Aa BUTTON */

appearanceToggle.addEventListener(
    "click",
    function (event) {

        event.stopPropagation();

        if (
            appearancePanel.classList.contains("open")
        ) {

            closeAppearancePanel();

        } else {

            openAppearancePanel();

        }

    }
);


/* CLOSE BUTTON */

appearanceClose.addEventListener(
    "click",
    function () {

        closeAppearancePanel();

    }
);


/* ESCAPE KEY */

document.addEventListener(
    "keydown",
    function (event) {

        if (event.key === "Escape") {

            closeAppearancePanel();

        }

    }
);


/* =========================================
   TEXT SIZE
   ========================================= */

const textSizeButtons =
    document.querySelectorAll(
        "[data-text-size]"
    );


textSizeButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const size =
                    button.dataset.textSize;

                let scale = 1;


                if (size === "small") {

                    scale = 0.9;

                }


                if (size === "large") {

                    scale = 1.1;

                }


                document.documentElement.style.setProperty(
                    "--reading-scale",
                    scale
                );


                setActiveButton(
                    textSizeButtons,
                    button
                );


                localStorage.setItem(
                    "appearance-text-size",
                    size
                );

            }
        );

    }
);


/* =========================================
   PAGE WIDTH
   ========================================= */

const widthButtons =
    document.querySelectorAll(
        "[data-page-width]"
    );


widthButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const width =
                    button.dataset.pageWidth;


                document.body.classList.remove(
                    "page-wide"
                );


                if (width === "wide") {

                    document.body.classList.add(
                        "page-wide"
                    );

                }


                setActiveButton(
                    widthButtons,
                    button
                );


                localStorage.setItem(
                    "appearance-page-width",
                    width
                );

            }
        );

    }
);


/* =========================================
   THEME
   ========================================= */

const themeButtons =
    document.querySelectorAll(
        "[data-theme]"
    );


themeButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const theme =
                    button.dataset.theme;


                document.body.classList.remove(
                    "theme-dark"
                );


                /* DARK */

                if (theme === "dark") {

                    document.body.classList.add(
                        "theme-dark"
                    );

                }


                /* AUTOMATIC */

                if (theme === "automatic") {

                    const prefersDark =
                        window.matchMedia(
                            "(prefers-color-scheme: dark)"
                        ).matches;


                    if (prefersDark) {

                        document.body.classList.add(
                            "theme-dark"
                        );

                    }

                }


                setActiveButton(
                    themeButtons,
                    button
                );


                localStorage.setItem(
                    "appearance-theme",
                    theme
                );

            }
        );

    }
);


/* =========================================
   READING SPACING
   ========================================= */

const spacingButtons =
    document.querySelectorAll(
        "[data-spacing]"
    );


spacingButtons.forEach(
    function (button) {

        button.addEventListener(
            "click",
            function () {

                const spacing =
                    button.dataset.spacing;


                document.body.classList.remove(
                    "spacing-comfortable"
                );


                if (
                    spacing === "comfortable"
                ) {

                    document.body.classList.add(
                        "spacing-comfortable"
                    );

                }


                setActiveButton(
                    spacingButtons,
                    button
                );


                localStorage.setItem(
                    "appearance-spacing",
                    spacing
                );

            }
        );

    }
);


/* =========================================
   ACTIVE BUTTON
   ========================================= */

function setActiveButton(
    buttons,
    selectedButton
) {

    buttons.forEach(
        function (button) {

            button.classList.remove(
                "active"
            );

        }
    );


    selectedButton.classList.add(
        "active"
    );

}


/* =========================================
   LOAD SAVED SETTINGS
   ========================================= */

function loadAppearanceSettings() {


    /* -----------------------------------------
       SAVED VALUES
       ----------------------------------------- */

    const savedTextSize =
        localStorage.getItem(
            "appearance-text-size"
        ) || "standard";


    const savedWidth =
        localStorage.getItem(
            "appearance-page-width"
        ) || "standard";


    const savedTheme =
        localStorage.getItem(
            "appearance-theme"
        ) || "light";


    const savedSpacing =
        localStorage.getItem(
            "appearance-spacing"
        ) || "standard";


    /* -----------------------------------------
       TEXT SIZE
       ----------------------------------------- */

    let savedScale = 1;


    if (savedTextSize === "small") {

        savedScale = 0.9;

    }


    if (savedTextSize === "large") {

        savedScale = 1.1;

    }


    document.documentElement.style.setProperty(
        "--reading-scale",
        savedScale
    );


    const savedTextButton =
        document.querySelector(
            `[data-text-size="${savedTextSize}"]`
        );


    if (savedTextButton) {

        setActiveButton(
            textSizeButtons,
            savedTextButton
        );

    }


    /* -----------------------------------------
       PAGE WIDTH
       ----------------------------------------- */

    document.body.classList.remove(
        "page-wide"
    );


    if (savedWidth === "wide") {

        document.body.classList.add(
            "page-wide"
        );

    }


    const savedWidthButton =
        document.querySelector(
            `[data-page-width="${savedWidth}"]`
        );


    if (savedWidthButton) {

        setActiveButton(
            widthButtons,
            savedWidthButton
        );

    }


    /* -----------------------------------------
       THEME
       ----------------------------------------- */

    document.body.classList.remove(
        "theme-dark"
    );


    if (savedTheme === "dark") {

        document.body.classList.add(
            "theme-dark"
        );

    }


    if (savedTheme === "automatic") {

        const prefersDark =
            window.matchMedia(
                "(prefers-color-scheme: dark)"
            ).matches;


        if (prefersDark) {

            document.body.classList.add(
                "theme-dark"
            );

        }

    }


    const savedThemeButton =
        document.querySelector(
            `[data-theme="${savedTheme}"]`
        );


    if (savedThemeButton) {

        setActiveButton(
            themeButtons,
            savedThemeButton
        );

    }


    /* -----------------------------------------
       READING SPACING
       ----------------------------------------- */

    document.body.classList.remove(
        "spacing-comfortable"
    );


    if (savedSpacing === "comfortable") {

        document.body.classList.add(
            "spacing-comfortable"
        );

    }


    const savedSpacingButton =
        document.querySelector(
            `[data-spacing="${savedSpacing}"]`
        );


    if (savedSpacingButton) {

        setActiveButton(
            spacingButtons,
            savedSpacingButton
        );

    }

}


/* =========================================
   RESET ALL SETTINGS
   ========================================= */

resetAppearance.addEventListener(
    "click",
    function () {


        /* Remove saved preferences */

        localStorage.removeItem(
            "appearance-text-size"
        );

        localStorage.removeItem(
            "appearance-page-width"
        );

        localStorage.removeItem(
            "appearance-theme"
        );

        localStorage.removeItem(
            "appearance-spacing"
        );


        /* Reset reading scale */

        document.documentElement.style.setProperty(
            "--reading-scale",
            1
        );


        /* Reset body classes */

        document.body.classList.remove(
            "page-wide",
            "theme-dark",
            "spacing-comfortable"
        );


        /* Reset buttons */

        document.querySelector(
            '[data-text-size="standard"]'
        ).click();


        document.querySelector(
            '[data-page-width="standard"]'
        ).click();


        document.querySelector(
            '[data-theme="light"]'
        ).click();


        document.querySelector(
            '[data-spacing="standard"]'
        ).click();

    }
);


/* =========================================
   START
   ========================================= */

loadAppearanceSettings();