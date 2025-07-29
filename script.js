// Navigation Toggle
const hamburger = document.querySelector('.hamburger');
const navMenu = document.querySelector('.nav-menu');

hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
});

// Close mobile menu when clicking on a link
document.querySelectorAll('.nav-link').forEach(n => n.addEventListener('click', () => {
    hamburger.classList.remove('active');
    navMenu.classList.remove('active');
}));

// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar background on scroll
window.addEventListener('scroll', () => {
    const navbar = document.querySelector('.navbar');
    if (window.scrollY > 100) {
        navbar.style.background = 'rgba(10, 10, 10, 0.98)';
    } else {
        navbar.style.background = 'rgba(10, 10, 10, 0.95)';
    }
});

// Initialize Three.js Scene for Hero Section
let scene, camera, renderer, particles;

function initThreeJS() {
    // Check if Three.js is loaded
    if (typeof THREE === 'undefined') {
        console.error('Three.js not loaded');
        return;
    }
    
    // Scene setup
    scene = new THREE.Scene();
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    const heroContainer = document.getElementById('hero3d');
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setClearColor(0x000000, 0);
    heroContainer.appendChild(renderer.domElement);

    // Create floating geometric shapes
    const geometries = [
        new THREE.BoxGeometry(1, 1, 1),
        new THREE.TetrahedronGeometry(1),
        new THREE.OctahedronGeometry(1),
        new THREE.IcosahedronGeometry(1)
    ];

    const materials = [
        new THREE.MeshBasicMaterial({ 
            color: 0x00D4FF, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.6 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x8B5CF6, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.6 
        }),
        new THREE.MeshBasicMaterial({ 
            color: 0x10B981, 
            wireframe: true, 
            transparent: true, 
            opacity: 0.6 
        })
    ];

    // Create multiple floating objects
    const objects = [];
    for (let i = 0; i < 15; i++) {
        const geometry = geometries[Math.floor(Math.random() * geometries.length)];
        const material = materials[Math.floor(Math.random() * materials.length)];
        const mesh = new THREE.Mesh(geometry, material);
        
        mesh.position.x = (Math.random() - 0.5) * 20;
        mesh.position.y = (Math.random() - 0.5) * 20;
        mesh.position.z = (Math.random() - 0.5) * 20;
        
        mesh.rotation.x = Math.random() * Math.PI;
        mesh.rotation.y = Math.random() * Math.PI;
        
        mesh.scale.setScalar(Math.random() * 0.5 + 0.5);
        
        scene.add(mesh);
        objects.push(mesh);
    }

    // Create particle system
    const particleCount = 1000;
    const positions = new Float32Array(particleCount * 3);
    const colors = new Float32Array(particleCount * 3);

    for (let i = 0; i < particleCount; i++) {
        positions[i * 3] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 1] = (Math.random() - 0.5) * 50;
        positions[i * 3 + 2] = (Math.random() - 0.5) * 50;

        const color = new THREE.Color();
        color.setHSL(Math.random() * 0.3 + 0.5, 0.7, 0.5);
        colors[i * 3] = color.r;
        colors[i * 3 + 1] = color.g;
        colors[i * 3 + 2] = color.b;
    }

    const particleGeometry = new THREE.BufferGeometry();
    particleGeometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
    particleGeometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

    const particleMaterial = new THREE.PointsMaterial({
        size: 2,
        vertexColors: true,
        transparent: true,
        opacity: 0.6
    });

    particles = new THREE.Points(particleGeometry, particleMaterial);
    scene.add(particles);

    camera.position.z = 15;

    // Animation loop
    function animate() {
        requestAnimationFrame(animate);

        // Rotate objects
        objects.forEach((obj, index) => {
            obj.rotation.x += 0.005 + index * 0.001;
            obj.rotation.y += 0.005 + index * 0.001;
            obj.position.y += Math.sin(Date.now() * 0.001 + index) * 0.01;
        });

        // Rotate particles
        particles.rotation.y += 0.002;
        particles.rotation.x += 0.001;

        renderer.render(scene, camera);
    }

    animate();
}

// Initialize Three.js when page loads
window.addEventListener('load', () => {
    // Add a small delay to ensure Three.js is fully loaded
    setTimeout(initThreeJS, 500);
});

// Fallback initialization
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(() => {
        if (!scene) {
            initThreeJS();
        }
    }, 1000);
});

// 3D Cursor Effect
function init3DCursor() {
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    const servicesSection = document.querySelector('.cursor-3d');
    
    document.addEventListener('mousemove', (e) => {
        const rect = servicesSection.getBoundingClientRect();
        const isInSection = e.clientY >= rect.top && e.clientY <= rect.bottom;
        
        if (isInSection) {
            cursor.style.left = e.clientX - 10 + 'px';
            cursor.style.top = e.clientY - 10 + 'px';
            cursor.style.opacity = '1';
            cursor.style.transform = 'scale(1)';
        } else {
            cursor.style.opacity = '0';
        }
    });

    // Add hover effects for service cards
    document.querySelectorAll('.service-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            cursor.style.transform = 'scale(1.5)';
            cursor.style.background = 'linear-gradient(45deg, #8B5CF6, #10B981)';
        });
        
        card.addEventListener('mouseleave', () => {
            cursor.style.transform = 'scale(1)';
            cursor.style.background = 'linear-gradient(45deg, #00D4FF, #8B5CF6)';
        });
    });
}

// Initialize 3D cursor
document.addEventListener('DOMContentLoaded', init3DCursor);

// Add 3D elements to other sections
function addFloatingElements() {
    // Add floating elements to portfolio section
    const portfolioSection = document.querySelector('.floating-shapes .container');
    if (portfolioSection) {
        for (let i = 0; i < 3; i++) {
            const floatingElement = document.createElement('div');
            floatingElement.style.cssText = `
                position: absolute;
                width: ${30 + Math.random() * 40}px;
                height: ${30 + Math.random() * 40}px;
                background: linear-gradient(45deg, rgba(0, 212, 255, 0.1), rgba(139, 92, 246, 0.1));
                border-radius: ${Math.random() > 0.5 ? '50%' : '0'};
                top: ${Math.random() * 80}%;
                left: ${Math.random() * 90}%;
                animation: float ${4 + Math.random() * 4}s ease-in-out infinite;
                pointer-events: none;
                z-index: 1;
            `;
            portfolioSection.appendChild(floatingElement);
        }
    }
}

// Initialize floating elements
window.addEventListener('load', addFloatingElements);

// Handle window resize
window.addEventListener('resize', () => {
    if (camera && renderer) {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    }
});

// Coding Animation
function initCodingAnimation() {
    const codeContainer = document.getElementById('codeAnimation');
    if (!codeContainer) return;

    const codeLines = [
        'const sectumsoft = {',
        '  mission: "Complete Software Solutions",',
        '  services: [',
        '    "Web Development",',
        '    "Mobile Apps",',
        '    "Digital Marketing",',
        '    "Advertisement",',
        '    "Social Media Management"',
        '  ],',
        '  team: "Freelance Collective",',
        '  quality: "Production Ready"',
        '};',
        '',
        'function buildAmazingProducts() {',
        '  return sectumsoft.services.map(service => {',
        '    return {',
        '      name: service,',
        '      quality: "Premium",',
        '      delivery: "On Time"',
        '    };',
        '  });',
        '}',
        '',
        'export default sectumsoft;'
    ];

    let currentLine = 0;
    let currentChar = 0;
    let isDeleting = false;

    function typeCode() {
        const currentCodeLine = codeLines[currentLine];
        
        if (!isDeleting && currentChar < currentCodeLine.length) {
            codeContainer.innerHTML += currentCodeLine.charAt(currentChar);
            currentChar++;
            setTimeout(typeCode, 50);
        } else if (isDeleting && currentChar > 0) {
            codeContainer.innerHTML = codeContainer.innerHTML.slice(0, -1);
            currentChar--;
            setTimeout(typeCode, 25);
        } else if (!isDeleting && currentChar === currentCodeLine.length) {
            if (currentLine < codeLines.length - 1) {
                codeContainer.innerHTML += '<br>';
                currentLine++;
                currentChar = 0;
                setTimeout(typeCode, 100);
            } else {
                setTimeout(() => {
                    isDeleting = true;
                    typeCode();
                }, 2000);
            }
        } else if (isDeleting && currentChar === 0) {
            if (currentLine > 0) {
                const lines = codeContainer.innerHTML.split('<br>');
                lines.pop();
                codeContainer.innerHTML = lines.join('<br>');
                currentLine--;
                currentChar = codeLines[currentLine].length;
                setTimeout(typeCode, 50);
            } else {
                isDeleting = false;
                setTimeout(typeCode, 1000);
            }
        }
    }

    typeCode();
}

// Initialize coding animation when the about section is in view
const aboutSection = document.getElementById('about');
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            initCodingAnimation();
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

if (aboutSection) {
    observer.observe(aboutSection);
}

// 3D Game Implementation
let gameScene, gameCamera, gameRenderer, gameCubes = [];
let gameSpeed = 1;
let cubeCount = 12;

function initGame() {
    const gameCanvas = document.getElementById('gameCanvas');
    if (!gameCanvas) return;

    // Scene setup
    gameScene = new THREE.Scene();
    gameCamera = new THREE.PerspectiveCamera(75, gameCanvas.offsetWidth / gameCanvas.offsetHeight, 0.1, 1000);
    gameRenderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    
    gameRenderer.setSize(gameCanvas.offsetWidth, gameCanvas.offsetHeight);
    gameRenderer.setClearColor(0x000000, 0);
    gameCanvas.appendChild(gameRenderer.domElement);

    // Create initial cubes
    createGameCubes();
    
    gameCamera.position.z = 15;

    // Mouse controls
    let mouseX = 0, mouseY = 0;
    let isMouseDown = false;

    gameCanvas.addEventListener('mousedown', () => isMouseDown = true);
    gameCanvas.addEventListener('mouseup', () => isMouseDown = false);
    gameCanvas.addEventListener('mousemove', (event) => {
        if (isMouseDown) {
            mouseX = (event.clientX / gameCanvas.offsetWidth) * 2 - 1;
            mouseY = -(event.clientY / gameCanvas.offsetHeight) * 2 + 1;
        }
    });

    // Zoom control
    gameCanvas.addEventListener('wheel', (event) => {
        gameCamera.position.z += event.deltaY * 0.01;
        gameCamera.position.z = Math.max(5, Math.min(30, gameCamera.position.z));
    });

    // Animation loop
    function animateGame() {
        requestAnimationFrame(animateGame);

        gameCubes.forEach((cube, index) => {
            cube.rotation.x += 0.01 * gameSpeed;
            cube.rotation.y += 0.01 * gameSpeed;
            cube.position.y += Math.sin(Date.now() * 0.001 + index) * 0.02;
            
            if (isMouseDown) {
                cube.rotation.x += mouseY * 0.05;
                cube.rotation.y += mouseX * 0.05;
            }
        });

        gameRenderer.render(gameScene, gameCamera);
    }

    animateGame();
}

function createGameCubes() {
    // Clear existing cubes
    gameCubes.forEach(cube => gameScene.remove(cube));
    gameCubes = [];

    const colors = [0x00D4FF, 0x8B5CF6, 0x10B981, 0xFF6B6B, 0xFFD93D, 0xFF8C42];
    
    for (let i = 0; i < cubeCount; i++) {
        const geometry = new THREE.BoxGeometry(1, 1, 1);
        const material = new THREE.MeshBasicMaterial({ 
            color: colors[i % colors.length],
            wireframe: Math.random() > 0.5,
            transparent: true,
            opacity: 0.8
        });
        
        const cube = new THREE.Mesh(geometry, material);
        
        cube.position.x = (Math.random() - 0.5) * 15;
        cube.position.y = (Math.random() - 0.5) * 15;
        cube.position.z = (Math.random() - 0.5) * 15;
        
        cube.rotation.x = Math.random() * Math.PI;
        cube.rotation.y = Math.random() * Math.PI;
        
        gameScene.add(cube);
        gameCubes.push(cube);
    }
    
    updateGameStats();
}

function addCube() {
    cubeCount++;
    createGameCubes();
}

function resetGame() {
    cubeCount = 12;
    gameSpeed = 1;
    createGameCubes();
}

function toggleSpeed() {
    gameSpeed = gameSpeed === 1 ? 3 : 1;
    updateGameStats();
}

function updateGameStats() {
    const cubeCountElement = document.getElementById('cubeCount');
    const rotationSpeedElement = document.getElementById('rotationSpeed');
    
    if (cubeCountElement) cubeCountElement.textContent = cubeCount;
    if (rotationSpeedElement) rotationSpeedElement.textContent = gameSpeed + 'x';
}

// Initialize game when page loads
window.addEventListener('load', () => {
    setTimeout(() => {
        if (typeof THREE !== 'undefined') {
            initGame();
        } else {
            // Retry after a longer delay
            setTimeout(initGame, 2000);
        }
    }, 1000);
});

// Service Card Interactions
document.querySelectorAll('.service-card').forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'translateY(-15px) rotateX(5deg)';
    });
    
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'translateY(0) rotateX(0deg)';
    });
});

// Portfolio Item Interactions
document.querySelectorAll('.portfolio-item').forEach(item => {
    item.addEventListener('mouseenter', () => {
        item.style.transform = 'translateY(-10px) scale(1.02)';
    });
    
    item.addEventListener('mouseleave', () => {
        item.style.transform = 'translateY(0) scale(1)';
    });
});

// Contact Form Handling
const contactForm = document.querySelector('.contact-form');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Get form data
        const formData = new FormData(contactForm);
        const data = Object.fromEntries(formData);
        
        // Show success message (in real implementation, you'd send to server)
        alert('Thank you for your message! We\'ll get back to you soon.');
        contactForm.reset();
    });
}

// Add scroll-triggered animations
function animateOnScroll() {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .team-member');
    
    elements.forEach(element => {
        const elementTop = element.getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < window.innerHeight - elementVisible) {
            element.style.opacity = '1';
            element.style.transform = 'translateY(0)';
        }
    });
}

// Initialize scroll animations
document.addEventListener('DOMContentLoaded', () => {
    const elements = document.querySelectorAll('.service-card, .portfolio-item, .team-member');
    elements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px)';
        element.style.transition = 'all 0.6s ease';
    });
});

window.addEventListener('scroll', animateOnScroll);

// Counter Animation for Stats
function animateCounters() {
    const counters = document.querySelectorAll('.stat-number');
    const speed = 200;

    counters.forEach(counter => {
        const updateCount = () => {
            const target = parseInt(counter.innerText.replace('+', '').replace('%', ''));
            const count = parseInt(counter.getAttribute('data-count') || 0);
            const inc = target / speed;

            if (count < target) {
                counter.setAttribute('data-count', count + inc);
                counter.innerText = Math.ceil(count + inc) + (counter.innerText.includes('%') ? '%' : counter.innerText.includes('+') ? '+' : '');
                setTimeout(updateCount, 10);
            } else {
                counter.innerText = target + (counter.innerText.includes('%') ? '%' : counter.innerText.includes('+') ? '+' : '');
            }
        };

        updateCount();
    });
}

// Trigger counter animation when stats section is visible
const statsSection = document.querySelector('.stats');
if (statsSection) {
    const statsObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                animateCounters();
                statsObserver.unobserve(entry.target);
            }
        });
    }, { threshold: 0.5 });

    statsObserver.observe(statsSection);
}

// Add parallax effect to hero section
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallaxElements = document.querySelectorAll('.hero-content');
    
    parallaxElements.forEach(element => {
        const speed = 0.5;
        element.style.transform = `translateY(${scrolled * speed}px)`;
    });
});

// Add loading animation
window.addEventListener('load', () => {
    document.body.classList.add('loaded');
    
    // Animate hero content
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroButtons = document.querySelector('.hero-buttons');
    
    if (heroTitle) {
        heroTitle.style.animation = 'fadeInUp 1s ease forwards';
    }
    if (heroSubtitle) {
        heroSubtitle.style.animation = 'fadeInUp 1s ease 0.3s forwards';
    }
    if (heroButtons) {
        heroButtons.style.animation = 'fadeInUp 1s ease 0.6s forwards';
    }
});

// Add CSS keyframes for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .hero-title,
    .hero-subtitle,
    .hero-buttons {
        opacity: 0;
    }
    
    .loaded .hero-title,
    .loaded .hero-subtitle,
    .loaded .hero-buttons {
        opacity: 1;
    }
`;
document.head.appendChild(style);