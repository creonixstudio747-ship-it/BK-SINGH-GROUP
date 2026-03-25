        // Initialize Lucide icons
        lucide.createIcons();

        async function initClerk() {
            try {
                await window.Clerk.load({
                    appearance: {
                        variables: {
                            colorPrimary: '#9EFF76', 
                            colorBackground: '#1A1A1A',     
                            colorText: '#FFFFFF',
                            colorTextSecondary: '#A0A0A0',
                            colorInputBackground: '#0D0D0D',
                            colorInputText: '#FFFFFF',
                            colorDanger: '#ff4444',
                            borderRadius: '12px'
                        },
                        elements: {
                            cardBox: {
                                backgroundColor: 'rgba(13, 13, 13, 0.75)',
                                backdropFilter: 'blur(24px)',
                                border: '1px solid rgba(255, 255, 255, 0.08)',
                                boxShadow: '0 30px 60px rgba(0, 0, 0, 0.8)'
                            },
                            card: {
                                backgroundColor: 'transparent',
                                boxShadow: 'none',
                            },
                            headerTitle: { color: '#FFFFFF', fontSize: '1.5rem', fontWeight: '800' },
                            headerSubtitle: { color: '#A0A0A0' },
                            formFieldInput: { 
                                borderColor: 'rgba(255, 255, 255, 0.15)',
                                backgroundColor: '#0D0D0D',
                                boxShadow: 'none'
                            },
                            formButtonPrimary: { 
                                backgroundColor: '#9EFF76', 
                                color: '#0D0D0D', 
                                fontWeight: '700',
                                textTransform: 'uppercase'
                            }
                        }
                    }
                });

                const startBtn = document.getElementById('startJourneyBtn');
                const navLoginBtn = document.getElementById('navLoginBtn');
                
                // Profile Dropdown Setup
                const updateProfileUI = () => {
                    const user = window.Clerk.user;
                    if (!user) return;

                    if (startBtn) {
                        startBtn.innerHTML = 'Go to Dashboard <i data-lucide="arrow-right"></i>';
                        lucide.createIcons();
                    }
                    if (navLoginBtn) navLoginBtn.style.display = 'none'; // Hide login button

                    const customProfileContainer = document.getElementById('customProfileContainer');
                    if (customProfileContainer) {
                        customProfileContainer.style.display = 'block';
                        
                        // Populate Avatar & Name
                        document.getElementById('profileAvatar').src = user.imageUrl;
                        document.getElementById('profileFirstName').innerText = user.firstName || 'User';
                        document.getElementById('profileFullName').innerText = user.fullName || user.firstName || 'Verified Member';
                        
                        const primaryEmail = user.primaryEmailAddress ? user.primaryEmailAddress.emailAddress : '';
                        const primaryPhone = user.primaryPhoneNumber ? user.primaryPhoneNumber.phoneNumber : '';
                        document.getElementById('profileContact').innerText = primaryEmail || primaryPhone;

                        // Retrieve unsafeMetadata for grade
                        const gradeSelect = document.getElementById('gradeSelect');
                        if (user.unsafeMetadata && user.unsafeMetadata.grade) {
                            gradeSelect.value = user.unsafeMetadata.grade;
                        }

                        // Handle Grade Update
                        gradeSelect.addEventListener('change', async (e) => {
                            try {
                                gradeSelect.disabled = true;
                                await window.Clerk.user.update({
                                    unsafeMetadata: { ...window.Clerk.user.unsafeMetadata, grade: e.target.value }
                                });
                            } catch(err) {
                                console.error("Grade update failed:", err);
                            } finally {
                                gradeSelect.disabled = false;
                            }
                        });

                        // Dropdown Toggle
                        const profileToggleBtn = document.getElementById('profileToggleBtn');
                        const profileDropdown = document.getElementById('profileDropdown');
                        
                        profileToggleBtn.addEventListener('click', (e) => {
                            e.stopPropagation();
                            profileDropdown.classList.toggle('active');
                            profileToggleBtn.querySelector('.profile-chevron').classList.toggle('rotate');
                        });

                        // Close dropdown when clicking outside
                        document.addEventListener('click', (e) => {
                            if (!customProfileContainer.contains(e.target)) {
                                profileDropdown.classList.remove('active');
                                profileToggleBtn.querySelector('.profile-chevron').classList.remove('rotate');
                            }
                        });

                        // Logout Button
                        document.getElementById('logoutBtn').addEventListener('click', () => {
                            window.Clerk.signOut().then(() => { window.location.reload(); });
                        });
                    }
                };

                // Update UI if logged in
                if (window.Clerk.user) {
                    updateProfileUI();
                }

                // Attach click handlers
                const handleAuthClick = (e, metadata = null) => {
                    e.preventDefault();
                    if (window.Clerk.user) {
                        document.querySelector('.pricing').scrollIntoView({ behavior: 'smooth' });
                    } else {
                        // Open Custom Auth Modal instead of window.Clerk.openSignUp()
                        openAuthModal();
                    }
                };

                if (startBtn) startBtn.addEventListener('click', handleAuthClick);
                if (navLoginBtn) navLoginBtn.addEventListener('click', handleAuthClick);

                const tierBtns = document.querySelectorAll('.tier-signup-btn');
                tierBtns.forEach(btn => {
                    btn.addEventListener('click', (e) => {
                        handleAuthClick(e, btn.getAttribute('data-tier'));
                    });
                });

                // Mobile Menu Logic
                const mobileMenuBtn = document.getElementById('mobileMenuBtn');
                const mobileMenuClose = document.getElementById('mobileMenuClose');
                const mobileMenu = document.getElementById('mobileMenu');
                const mobileLoginBtn = document.getElementById('mobileLoginBtn');
                const mobileNavItems = document.querySelectorAll('.mobile-nav-item');

                const closeMobileMenu = () => {
                    mobileMenu.classList.remove('active');
                    document.body.style.overflow = '';
                };

                if (mobileMenuBtn) {
                    mobileMenuBtn.addEventListener('click', () => {
                        mobileMenu.classList.add('active');
                        document.body.style.overflow = 'hidden';
                    });
                }

                if (mobileMenuClose) {
                    mobileMenuClose.addEventListener('click', closeMobileMenu);
                }

                mobileNavItems.forEach(item => {
                    item.addEventListener('click', closeMobileMenu);
                });

                if (mobileLoginBtn) {
                    if (window.Clerk.user) {
                        mobileLoginBtn.style.display = 'none'; // Hide if logged in
                    } else {
                        mobileLoginBtn.addEventListener('click', (e) => {
                            closeMobileMenu();
                            handleAuthClick(e);
                        });
                    }
                }

                // --- CUSTOM AUTH MODAL LOGIC INJECTED HERE ---
                const customAuthModal = document.getElementById('customAuthModal');
                const authCloseBtn = document.getElementById('authCloseBtn');
                const authStateMethods = document.getElementById('authStateMethods');
                const authStateInput = document.getElementById('authStateInput');
                const authStateVerify = document.getElementById('authStateVerify');
                const authInputLabel = document.getElementById('authInputLabel');
                const authInputField = document.getElementById('authInputField');
                const authSubtitle = document.getElementById('authSubtitle');
                const authErrorBox = document.getElementById('authErrorBox');
                const authInputForm = document.getElementById('authInputForm');
                const authVerifyForm = document.getElementById('authVerifyForm');
                const btnSendCode = document.getElementById('btnSendCode');
                const btnVerifyOTP = document.getElementById('btnVerifyOTP');

                let currentAuthType = 'email'; // 'email' or 'phone'
                let isSignUpFlow = false;
                let pendingAction = null; // store the clerk attempt object

                const openAuthModal = () => {
                    customAuthModal.classList.add('active');
                    document.body.style.overflow = 'hidden';
                    resetAuthModal();
                };

                const closeAuthModal = () => {
                    customAuthModal.classList.remove('active');
                    document.body.style.overflow = '';
                };

                const resetAuthModal = () => {
                    authStateMethods.style.display = 'block';
                    authStateInput.style.display = 'none';
                    authStateVerify.style.display = 'none';
                    authSubtitle.innerText = 'Select your preferred authentication method.';
                    authErrorBox.style.display = 'none';
                    authInputField.value = '';
                    document.getElementById('authOtpField').value = '';
                };

                const showError = (msg) => {
                    authErrorBox.innerText = msg;
                    authErrorBox.style.display = 'block';
                };

                authCloseBtn.addEventListener('click', closeAuthModal);
                document.getElementById('btnBackToMethods').addEventListener('click', resetAuthModal);
                document.getElementById('btnBackToInput').addEventListener('click', () => {
                    authStateVerify.style.display = 'none';
                    authStateInput.style.display = 'block';
                    authErrorBox.style.display = 'none';
                    authSubtitle.innerText = currentAuthType === 'email' ? 'Enter your email address.' : 'Enter your phone number.';
                });

                // Social Logic
                document.getElementById('btnGoogle').addEventListener('click', async () => {
                    try {
                        await window.Clerk.client.signIn.authenticateWithRedirect({
                            strategy: 'oauth_google',
                            redirectUrl: window.location.href,
                            redirectUrlComplete: window.location.href
                        });
                    } catch(err) {
                        showError(err.errors ? err.errors[0].message : "Google Auth Failed.");
                    }
                });

                document.getElementById('btnFacebook').addEventListener('click', async () => {
                    try {
                        await window.Clerk.client.signIn.authenticateWithRedirect({
                            strategy: 'oauth_facebook',
                            redirectUrl: window.location.href,
                            redirectUrlComplete: window.location.href
                        });
                    } catch(err) {
                        showError(err.errors ? err.errors[0].message : "Facebook Auth Failed.");
                    }
                });

                // Setup Input
                const setupInputState = (type) => {
                    currentAuthType = type;
                    authStateMethods.style.display = 'none';
                    authStateInput.style.display = 'block';
                    authErrorBox.style.display = 'none';
                    if (type === 'email') {
                        authInputLabel.innerText = 'Email Address';
                        authInputField.placeholder = 'you@example.com';
                        authInputField.type = 'email';
                        authSubtitle.innerText = 'We will send a 6-digit code to your email.';
                    } else {
                        authInputLabel.innerText = 'Phone Number (with country code)';
                        authInputField.placeholder = '+91 9876543210';
                        authInputField.type = 'tel';
                        authSubtitle.innerText = 'We will send an SMS code to verify.';
                    }
                    authInputField.focus();
                };

                document.getElementById('btnEmail').addEventListener('click', () => setupInputState('email'));
                document.getElementById('btnPhone').addEventListener('click', () => setupInputState('phone'));

                // Send OTP logic
                authInputForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    authErrorBox.style.display = 'none';
                    btnSendCode.innerHTML = 'Sending...';
                    btnSendCode.disabled = true;

                    let identifier = authInputField.value.trim();
                    const strategy = currentAuthType === 'email' ? 'email_code' : 'phone_code';

                    // Automatically add +91 country code for Indian numbers if no country code is provided
                    if (currentAuthType === 'phone' && !identifier.startsWith('+')) {
                        identifier = '+91' + identifier;
                    }

                    try {
                        const signInAttempt = await window.Clerk.client.signIn.create({ identifier });
                        const factor = signInAttempt.supportedFirstFactors.find(f => f.strategy === strategy);
                        
                        if (!factor) { throw new Error("This verification method is not supported by your Clerk account settings."); }

                        await signInAttempt.prepareFirstFactor(factor);
                        
                        isSignUpFlow = false;
                        pendingAction = signInAttempt;

                        authStateInput.style.display = 'none';
                        authStateVerify.style.display = 'block';
                        authSubtitle.innerText = 'Enter the 6-digit code sent to you.';
                        document.getElementById('authOtpField').focus();

                    } catch (err) {
                        if (err.errors && err.errors[0].code === 'form_identifier_not_found') {
                            try {
                                const params = currentAuthType === 'email' 
                                    ? { emailAddress: identifier } 
                                    : { phoneNumber: identifier };

                                const signUpAttempt = await window.Clerk.client.signUp.create(params);
                                
                                if (currentAuthType === 'email') {
                                    await signUpAttempt.prepareEmailAddressVerification({ strategy: 'email_code' });
                                } else {
                                    await signUpAttempt.preparePhoneNumberVerification({ strategy: 'phone_code' });
                                }

                                isSignUpFlow = true;
                                pendingAction = signUpAttempt;

                                authStateInput.style.display = 'none';
                                authStateVerify.style.display = 'block';
                                authSubtitle.innerText = 'Enter the 6-digit code sent to you.';
                                document.getElementById('authOtpField').focus();
                            } catch (signUpErr) {
                                showError(signUpErr.errors ? signUpErr.errors[0].message : "Failed to prepare signup.");
                            }
                        } else {
                            showError(err.errors ? err.errors[0].message : "An error occurred.");
                        }
                    } finally {
                        btnSendCode.innerHTML = 'Send Verification Code <i data-lucide="arrow-right"></i>';
                        btnSendCode.disabled = false;
                        lucide.createIcons();
                    }
                });

                // Verify OTP Logic
                authVerifyForm.addEventListener('submit', async (e) => {
                    e.preventDefault();
                    authErrorBox.style.display = 'none';
                    btnVerifyOTP.innerText = 'Verifying...';
                    btnVerifyOTP.disabled = true;

                    const code = document.getElementById('authOtpField').value.trim();

                    try {
                        let finalStatus;
                        if (!isSignUpFlow) {
                            const attempt = await window.Clerk.client.signIn.attemptFirstFactor({
                                strategy: currentAuthType === 'email' ? 'email_code' : 'phone_code',
                                code
                            });
                            finalStatus = attempt;
                        } else {
                            const method = currentAuthType === 'email' ? 'attemptEmailAddressVerification' : 'attemptPhoneNumberVerification';
                            const attempt = await window.Clerk.client.signUp[method]({ code });
                            finalStatus = attempt;
                        }

                        if (finalStatus.status === 'complete') {
                            await window.Clerk.setActive({ session: finalStatus.createdSessionId });
                            closeAuthModal();
                            window.location.reload(); 
                        } else {
                            showError("Verification incomplete. Check Clerk Dashboard settings (e.g., missing required fields like Name).");
                        }
                    } catch (err) {
                        showError(err.errors ? err.errors[0].message : "Invalid code. Please try again.");
                    } finally {
                        btnVerifyOTP.innerText = 'Verify & Login';
                        btnVerifyOTP.disabled = false;
                    }
                });

            } catch (err) {
                console.error("Clerk Error:", err);
            }
        }

        // --- YOUTUBE FEED INTEGRATION ---
        document.addEventListener("DOMContentLoaded", () => {
            const YOUTUBE_API_KEY = "AIzaSyB06NFG9FtXNdtO_qOtR3AkGl24mj22cYQ";
            const CHANNEL_ID = "UCQ9Mr2KzICkZzoc6r5R-h3w";
            const MAX_RESULTS = 4;
            // Fetch 50 items so we have enough buffer to filter out shorts
            const SEARCH_API_URL = `https://www.googleapis.com/youtube/v3/search?key=${YOUTUBE_API_KEY}&channelId=${CHANNEL_ID}&part=snippet,id&order=date&maxResults=50&type=video`;

            const feedGrid = document.getElementById("youtubeFeedGrid");
            const ytModal = document.getElementById("youtubeModal");
            const ytCloseBtn = document.getElementById("ytCloseBtn");
            const ytIframeContainer = document.getElementById("ytIframeContainer");

            // Time Ago format function
            function timeSince(date) {
                const seconds = Math.floor((new Date() - new Date(date)) / 1000);
                let interval = seconds / 31536000;
                if (interval > 1) return Math.floor(interval) + " years";
                interval = seconds / 2592000;
                if (interval > 1) return Math.floor(interval) + " months";
                interval = seconds / 86400;
                if (interval > 1) return Math.floor(interval) + " days";
                interval = seconds / 3600;
                if (interval > 1) return Math.floor(interval) + " hours";
                interval = seconds / 60;
                if (interval > 1) return Math.floor(interval) + " minutes";
                return Math.floor(seconds) + " seconds";
            }
            
            // ISO 8601 Duration Parser
            function getDurationInSeconds(duration) {
                const match = duration.match(/PT(\d+H)?(\d+M)?(\d+S)?/);
                if (!match) return 0;
                const hours = (parseInt(match[1]) || 0);
                const minutes = (parseInt(match[2]) || 0);
                const seconds = (parseInt(match[3]) || 0);
                return (hours * 3600) + (minutes * 60) + seconds;
            }

            // Fetch Data
            fetch(SEARCH_API_URL)
                .then(response => response.json())
                .then(async data => {
                    if (data.items && data.items.length > 0) {
                        const videoIds = data.items.map(item => item.id.videoId).join(",");
                        const VIDEOS_API_URL = `https://www.googleapis.com/youtube/v3/videos?key=${YOUTUBE_API_KEY}&id=${videoIds}&part=contentDetails`;
                        
                        // Fetch the video details to get their durations
                        const vidRes = await fetch(VIDEOS_API_URL);
                        const vidData = await vidRes.json();
                        
                        const durationMap = {};
                        if (vidData.items) {
                            vidData.items.forEach(v => {
                                durationMap[v.id] = v.contentDetails.duration;
                            });
                        }

                        // Filter out Shorts (<= 60 seconds)
                        const longVideos = data.items.filter(item => {
                            const dur = durationMap[item.id.videoId];
                            if (!dur) return true; // Fallback play safe
                            return getDurationInSeconds(dur) > 61;
                        }).slice(0, 4); // Take latest 4 long-form videos

                        feedGrid.innerHTML = ""; // Clear loader
                        
                        if (longVideos.length > 0) {
                            longVideos.forEach(item => {
                                const videoId = item.id.videoId;
                                const title = item.snippet.title;
                                const publishedAt = item.snippet.publishedAt;
                                const thumbUrl = item.snippet.thumbnails.high.url;
                                
                                // Build Video Card
                                const card = document.createElement("div");
                                card.className = "video-card interactive";
                                card.innerHTML = `
                                    <div class="video-thumbnail-wrapper">
                                        <img src="${thumbUrl}" alt="Thumbnail for ${title}" loading="lazy" class="video-thumbnail">
                                        <div class="play-icon"><i data-lucide="play"></i></div>
                                    </div>
                                    <div class="video-meta">
                                        <h3 class="video-title">${title}</h3>
                                        <div class="video-time">Uploaded ${timeSince(publishedAt)} ago</div>
                                    </div>
                                `;
                                
                                // Click listener for Lightbox
                                card.addEventListener("click", () => {
                                    ytIframeContainer.innerHTML = `<iframe src="https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0&vq=hd1080" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen></iframe>`;
                                    ytModal.classList.add("active");
                                    document.body.style.overflow = "hidden"; // Prevent scrolling
                                });

                                feedGrid.appendChild(card);
                            });
                            // Re-initialize any new lucide icons
                            if (window.lucide) {
                                window.lucide.createIcons();
                            }
                        } else {
                            feedGrid.innerHTML = `<p style="grid-column: span 12; text-align: center; color: var(--text-secondary);">No long-form videos found.</p>`;
                        }
                    } else {
                        feedGrid.innerHTML = `<p style="grid-column: span 12; text-align: center; color: var(--text-secondary);">No videos found.</p>`;
                    }
                })
                .catch(error => {
                    console.error("Error fetching YouTube feed:", error);
                    feedGrid.innerHTML = `<p style="grid-column: span 12; text-align: center; color: #ff4444;">Failed to load videos.</p>`;
                });

            // Close Modal Logic
            const closeModal = () => {
                ytModal.classList.remove("active");
                ytIframeContainer.innerHTML = ""; // Destroy iframe to stop video playback
                document.body.style.overflow = ""; // Restore scrolling
            };

            ytCloseBtn.addEventListener("click", closeModal);
            ytModal.addEventListener("click", (e) => {
                if (e.target === ytModal) closeModal();
            });
        });

    <!-- Generic Resource Iframe Modal -->
    <div id="resourceModal" class="cyber-modal">
        <div class="cyber-modal-content glass-card" style="width: 95%; max-width: 1000px; padding: 1.5rem; height: 85vh; display: flex; flex-direction: column;">
            <button id="resourceCloseBtn" class="modal-close-btn" style="top: -15px; right: -15px; z-index: 100; background: #000;"><i data-lucide="x"></i></button>
            <div id="resourceIframeContainer" style="flex: 1; width: 100%; height: 100%; border-radius: 12px; overflow: hidden; position: relative;"></div>
        </div>
    </div>

    <!-- Expertise Details Modal -->
    <div id="expertiseModal" class="cyber-modal">
        <div class="cyber-modal-content glass-card">
            <button id="expCloseBtn" class="modal-close-btn"><i data-lucide="x"></i></button>
            <div class="exp-modal-header">
                <div class="exp-icon"><i data-lucide="award"></i></div>
                <h2 id="expModalTitle">Course Title</h2>
            </div>
            <div class="exp-features-container">
                <ul id="expFeaturesList" class="exp-features-list">
                    <!-- Fetched JS data here -->
                </ul>
            </div>
        </div>
    </div>

    <!-- EXPERTISE MODAL LOGIC -->
        const expData = {
            "9th": {
                title: "Class 9th Foundation",
                icon: "book",
                features: [
                    { icon: "brain-circuit", text: "Conceptual Clarity for Science & Math" },
                    { icon: "award", text: "Olympiad & NTSE Preparation" },
                    { icon: "file-check-2", text: "Weekly Foundation Tests" },
                    { icon: "users", text: "Parent-Teacher Progress Sync" }
                ]
            },
            "10th": {
                title: "Class 10th Board Mastery",
                icon: "book-open",
                features: [
                    { icon: "target", text: "Intensive Board Strategy Sessions" },
                    { icon: "history", text: "10-Year PYQ Analysis" },
                    { icon: "timer", text: "Subject-wise Mock Marathons" },
                    { icon: "pen-tool", text: "Time Management & Answer Writing Workshops" }
                ]
            },
            "11th": {
                title: "Class 11th Advanced Concepts",
                icon: "compass",
                features: [
                    { icon: "network", text: "Stream-specific Deep Dives (PCM/PCB/Commerce)" },
                    { icon: "rocket", text: "Foundation for JEE/NEET/CAT" },
                    { icon: "puzzle", text: "Advanced Problem Solving" },
                    { icon: "map", text: "Career Mapping" }
                ]
            },
            "12th": {
                title: "Class 12th Career & Board Excellence",
                icon: "graduation-cap",
                features: [
                    { icon: "crown", text: "Board Dominance Bootcamps" },
                    { icon: "swords", text: "Competitive Entrance Readiness" },
                    { icon: "briefcase", text: "Personality Development & Placement Support" },
                    { icon: "compass", text: "Final Career Counseling" }
                ]
            }
        };

        document.addEventListener("DOMContentLoaded", () => {
            const expCards = document.querySelectorAll('.module-card');
            const expModal = document.getElementById('expertiseModal');
            const expCloseBtn = document.getElementById('expCloseBtn');
            const expModalTitle = document.getElementById('expModalTitle');
            const expFeaturesList = document.getElementById('expFeaturesList');
            const expIconContainer = document.querySelector('.exp-icon');

            expCards.forEach(card => {
                card.addEventListener('click', () => {
                    const key = card.getAttribute('data-expertise');
                    if(!key || !expData[key]) return;
                    const data = expData[key];
                    
                    expModalTitle.innerText = data.title;
                    expIconContainer.innerHTML = `<i data-lucide="${data.icon}"></i>`;
                    expFeaturesList.innerHTML = data.features.map(f => `
                        <li><i data-lucide="${f.icon}"></i> <span>${f.text}</span></li>
                    `).join('');
                    
                    if (window.lucide) window.lucide.createIcons();
                    
                    expModal.classList.add('active');
                    document.body.style.overflow = "hidden";
                });
            });

            const closeExpModal = () => {
                expModal.classList.remove('active');
                document.body.style.overflow = "";
            };

            expCloseBtn.addEventListener('click', closeExpModal);
            expModal.addEventListener('click', (e) => {
                if (e.target === expModal) closeExpModal();
            });
        });

    <!-- AI Mentor Chatbot Widget -->
    <div id="aiChatWidget" class="ai-chat-widget">
        <!-- Floating Action Button -->
        <button id="aiFab" class="ai-fab">
            <div class="ai-fab-ring"></div>
            <i data-lucide="bot" class="ai-fab-icon"></i>
        </button>

        <!-- Chat Window -->
        <div id="aiChatWindow" class="ai-chat-window glass-card">
            <div class="ai-chat-header">
                <div class="ai-header-info">
                    <i data-lucide="bot" class="ai-header-icon"></i>
                    <div>
                        <h4>B.K. Singh AI Mentor</h4>
                        <span class="ai-status">Study Mode: ON</span>
                    </div>
                </div>
                <button id="aiCloseBtn" class="ai-close-btn"><i data-lucide="chevron-down"></i></button>
            </div>
            
            <div id="aiChatBody" class="ai-chat-body">
                <div class="ai-message ai-bot">
                    <div class="ai-bubble">Hello! I am your dedicated study partner. Ask me anything about your 9th-12th subjects or our latest course updates.</div>
                </div>
            </div>
            
            <div class="ai-chat-input-area">
                <input type="text" id="aiInput" placeholder="Ask about your syllabus..." autocomplete="off">
                <button id="aiSendBtn"><i data-lucide="send"></i></button>
            </div>
        </div>
    </div>

    <!-- HIERARCHICAL HUB LOGIC -->
        const hubState = { board: 'CBSE', level: 1, class: null, subject: null, subSubject: null, chapter: null };

        function renderHub() {
            // Manage Panel Visibility using CSS classes (translate3d)
            document.querySelectorAll('.hub-panel').forEach(p => {
                p.classList.remove('active', 'hidden-left', 'hidden-right');
                const pLevel = parseInt(p.id.replace('panelLevel', ''));
                if (pLevel === hubState.level) {
                    p.classList.add('active');
                } else if (pLevel < hubState.level) {
                    p.classList.add('hidden-left');
                } else {
                    p.classList.add('hidden-right');
                }
            });

            if (hubState.level === 1) renderClasses();
            if (hubState.level === 2) renderSubjects();
            if (hubState.level === 3) renderSubSubjects();
            if (hubState.level === 4) renderChapters();
            if (hubState.level === 5) renderActions();
            
            // Re-initialize Lucide Icons
            if(window.lucide) {
                setTimeout(() => lucide.createIcons(), 10);
            }
        }

        function renderClasses() {
            const grid = document.getElementById('classGrid');
            const classes = ["9th Class", "10th Class", "11th Class", "12th Class"];
            grid.innerHTML = classes.map(c => `
                <div class="hub-card" onclick="selectClass('${c}')">
                    <i data-lucide="graduation-cap"></i>
                    <span>${c}</span>
                </div>
            `).join('');
        }

        function selectClass(c) {
            hubState.class = c;
            hubState.level = 2;
            renderHub();
        }

        function renderSubjects() {
            const grid = document.getElementById('subjectGrid');
            document.getElementById('lblLevel2').innerText = `${hubState.board} > ${hubState.class}`;
            
            // Mock dynamic subjects based on Class and Board
            let subjects = [
                { name: "Mathematics", icon: "calculator" },
                { name: "Science", icon: "flask-conical" },
                { name: "English", icon: "book-open" },
                { name: "Social Science", icon: "globe-2" } // unique multi-subject icon
            ];
            if(hubState.class.includes("11") || hubState.class.includes("12")) {
                subjects = [
                    { name: "Physics", icon: "atom" },
                    { name: "Chemistry", icon: "flask-conical" },
                    { name: "Mathematics", icon: "calculator" },
                    { name: "Biology", icon: "dna" },
                    { name: "English", icon: "book-open" }
                ];
            }

            grid.innerHTML = subjects.map(s => `
                <div class="hub-card" onclick="selectSubject('${s.name}')">
                    <i data-lucide="${s.icon}"></i>
                    <span>${s.name}</span>
                </div>
            `).join('');
        }

        function selectSubject(s) {
            hubState.subject = s;
            if(s === "Social Science") {
                hubState.level = 3;
            } else {
                // Skip level 3 for regular subjects
                hubState.subSubject = null;
                hubState.level = 4;
            }
            renderHub();
        }

        function renderSubSubjects() {
            const grid = document.getElementById('subSubjectGrid');
            document.getElementById('lblLevel3').innerText = `${hubState.board} > ${hubState.class} > ${hubState.subject}`;
            
            const subSubjects = [
                { name: "History", icon: "landmark" },
                { name: "Geography", icon: "map" },
                { name: "Economics", icon: "trending-up" },
                { name: "Political Science (Civics)", icon: "landmark" }
            ];

            grid.innerHTML = subSubjects.map(s => `
                <div class="hub-card hub-card-small" onclick="selectSubSubject('${s.name}')">
                    <i data-lucide="${s.icon}"></i>
                    <span>${s.name}</span>
                </div>
            `).join('');
        }

        function selectSubSubject(ss) {
            hubState.subSubject = ss;
            hubState.level = 4;
            renderHub();
        }
        let hubDataStore = [];
        let isHubDataLoaded = false;
        let currentFilteredChapters = [];
        let currentChapterData = null;

        async function fetchHubData() {
            try {
                const res = await fetch("https://docs.google.com/spreadsheets/d/1ceVGbODWIbVfzKfY54SEfgj97bAbeKwtr41KRbl5RXk/export?format=csv");
                const text = await res.text();
                hubDataStore = parseCSV(text);
                isHubDataLoaded = true;
                if(hubState.level === 4) renderChapters(); // Re-render if hanging on loader
            } catch(err) {
                console.error("Failed to fetch sheet", err);
            }
        }

        function parseCSV(str) {
            const arr = [];
            let quote = false;
            let row = 0, col = 0, c = 0;
            for (; c < str.length; c++) {
                var cc = str[c], nc = str[c+1];
                arr[row] = arr[row] || [];
                arr[row][col] = arr[row][col] || '';
                if (cc == '"' && quote && nc == '"') { arr[row][col] += cc; ++c; continue; }
                if (cc == '"') { quote = !quote; continue; }
                if (cc == ',' && !quote) { ++col; continue; }
                if (cc == '\r' && nc == '\n' && !quote) { ++row; col = 0; ++c; continue; }
                if (cc == '\n' && !quote) { ++row; col = 0; continue; }
                if (cc == '\r' && !quote) { ++row; col = 0; continue; }
                arr[row][col] += cc;
            }
            return arr.slice(1).map(r => ({
                boards: (r[0]||'').trim().toUpperCase(),
                class: (r[1]||'').trim(),
                subject: (r[2]||'').trim().toUpperCase(),
                chapter: (r[3]||'').trim(),
                notes: (r[4]||'').trim(),
                quiz: (r[5]||'').trim(),
                lectures: (r[6]||'').trim(),
                pyq: (r[7]||'').trim(),
                extra: (r[8]||'').trim()
            })).filter(r => r.boards && r.class);
        }

        function renderChapters() {
            const list = document.getElementById('chapterList');
            const path = hubState.subSubject 
                ? `${hubState.board} > ${hubState.class} > Social Science > ${hubState.subSubject}`
                : `${hubState.board} > ${hubState.class} > ${hubState.subject}`;
            document.getElementById('lblLevel4').innerText = path;
            
            if(!isHubDataLoaded) {
                list.innerHTML = `<div class="hub-loader"><div class="pulse-circle"></div><span>Fetching Live Data...</span></div>`;
                return;
            }
            
            const filterBoard = hubState.board.toUpperCase().trim();
            const filterClass = hubState.class.replace('th Class', '').trim(); // e.g., "9"
            const targetSubject = hubState.subject === 'Social Science' ? hubState.subSubject : hubState.subject;
            let filterSubject = targetSubject.toUpperCase().trim();
            
            // Map UI subject names to Exact Sheet Subject names
            if (filterSubject === "MATHEMATICS") filterSubject = "MATHS";
            if (filterSubject === "POLITICAL SCIENCE (CIVICS)") filterSubject = "CIVICS";

            currentFilteredChapters = hubDataStore.filter(r => 
                r.boards === filterBoard && 
                r.class === filterClass && 
                r.subject === filterSubject
            );

            if(currentFilteredChapters.length === 0) {
                list.innerHTML = `<div style="text-align: center; color: var(--text-secondary); padding: 2rem;">No chapters available yet.</div>`;
            } else {
                list.innerHTML = currentFilteredChapters.map((ch, i) => `
                    <div class="hub-list-item" onclick="selectChapterObj(${i})">
                        <span><b>0${i+1}.</b> ${ch.chapter}</span>
                        <i data-lucide="chevron-right"></i>
                    </div>
                `).join('');
            }
            if(window.lucide) setTimeout(() => lucide.createIcons(), 10);
        }

        function selectChapterObj(idx) {
            currentChapterData = currentFilteredChapters[idx];
            hubState.chapter = currentChapterData.chapter;
            hubState.level = 5;
            renderHub();
        }

        function selectChapter(ch) {
            // Keep for backwards compatibility
            hubState.chapter = ch;
            hubState.level = 5;
            renderHub();
        }

        function goBackFromChapters() {
            if(hubState.subject === "Social Science") {
                hubState.level = 3;
            } else {
                hubState.level = 2;
            }
            renderHub();
        }

        function renderActions() {
            document.getElementById('lblLevel5').innerText = `${hubState.chapter}`;
            const grid = document.getElementById('actionGrid');
            
            if(!currentChapterData) return;
            grid.innerHTML = '';
            
            const actionsMap = [
                { key: 'notes', label: 'Notes', icon: 'file-text' },
                { key: 'pyq', label: 'Previous Year Questions', icon: 'history' },
                { key: 'lectures', label: 'Lectures', icon: 'video' },
                { key: 'quiz', label: 'Quiz', icon: 'help-circle' },
                { key: 'extra', label: 'Some Extra Tips', icon: 'zap' }
            ];
            
            let html = '';
            actionsMap.forEach(act => {
                const val = currentChapterData[act.key];
                if (val && val.trim() !== '') {
                    html += `
                        <div class="hub-card action-card" onclick="openResourceModal('${act.key}', '${encodeURIComponent(val)}')">
                            <i data-lucide="${act.icon}"></i>
                            <span>${act.label}</span>
                        </div>
                    `;
                }
            });

            if(html === '') {
                grid.innerHTML = `<div style="grid-column: span 5; text-align: center; color: var(--text-secondary); padding: 2rem;">Resources are being pushed soon.</div>`;
            } else {
                grid.innerHTML = html;
            }
            if(window.lucide) setTimeout(() => lucide.createIcons(), 10);
        }

        function goLevel(lvl) {
            hubState.level = lvl;
            renderHub();
        }

        document.querySelectorAll('.board-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.board-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                hubState.board = e.target.dataset.board;
                hubState.level = 1;
                renderHub();
            });
        });

        // Resource Modal Logic
        function openResourceModal(type, encodedVal) {
            const val = decodeURIComponent(encodedVal).trim();
            const modal = document.getElementById('resourceModal');
            const container = document.getElementById('resourceIframeContainer');
            
            // Check if string is a valid URL
            const isUrl = val.startsWith('http://') || val.startsWith('https://') || val.startsWith('www.');

            if (type === 'extra' || !isUrl) {
                // Render as text if it's 'extra tips' or just plain text (e.g. "Unfiled Notes" smart chips)
                const titleText = type === 'extra' ? 'Extra Tips' : 'Data Format Error';
                const iconName = type === 'extra' ? 'zap' : 'alert-triangle';
                
                container.innerHTML = `<div style="color: #fff; padding: 2.5rem; font-size: 1.15rem; line-height: 1.8; max-height: 80vh; overflow-y: auto; display: flex; flex-direction: column; align-items: center; justify-content: center; text-align: center; height: 100%;">
                    <i data-lucide="${iconName}" style="width: 48px; height: 48px; color: ${type === 'extra' ? 'var(--cyber-green)' : '#ff4444'}; margin-bottom: 1rem; opacity: 0.9;"></i>
                    <h3 style="color: ${type === 'extra' ? 'var(--cyber-green)' : '#ff4444'}; margin-bottom: 1rem; font-size: 1.5rem;">${titleText}</h3>
                    <p style="opacity: 0.9; max-width: 600px;">${val.replace(/\\n/g, '<br>')}</p>
                    ${type !== 'extra' ? `<p style="opacity: 0.6; font-size: 0.95rem; margin-top: 2rem; border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.5rem;">
                        <strong>B.K. Singh Admin Notice:</strong> The Google Sheet returned text instead of a URL. <br>
                        Please ensure you paste the full RAW URL (e.g., <code>https://drive.google.com/...</code>) in the cell.<br>
                        Do <b>NOT</b> use 'Smart Chips', Hyperlinks (Ctrl+K), or plain text.
                    </p>` : ''}
                </div>`;
            } else {
                let finalUrl = val;
                if(finalUrl.startsWith('www.')) finalUrl = 'https://' + finalUrl;
                
                // YouTube standard link
                if(finalUrl.includes('youtube.com/watch?v=')) {
                    finalUrl = finalUrl.replace('watch?v=', 'embed/');
                }
                // YouTube short link
                else if(finalUrl.includes('youtu.be/')) {
                    finalUrl = finalUrl.replace('youtu.be/', 'www.youtube.com/embed/');
                }
                
                // Google Drive standard link (View -> Preview for iframe support)
                if(finalUrl.includes('drive.google.com/file/d/') && finalUrl.includes('/view')) {
                    finalUrl = finalUrl.replace('/view', '/preview');
                }

                container.innerHTML = `<iframe src="${finalUrl}" width="100%" height="100%" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowfullscreen style="border-radius: 12px; min-height: 60vh; background: #000;"></iframe>`;
            }
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
            if(window.lucide) setTimeout(() => lucide.createIcons(), 10);
        }

        document.getElementById('resourceCloseBtn').addEventListener('click', () => {
            document.getElementById('resourceModal').classList.remove('active');
            document.getElementById('resourceIframeContainer').innerHTML = '';
            document.body.style.overflow = '';
        });

        document.getElementById('resourceModal').addEventListener('click', (e) => {
            if(e.target === document.getElementById('resourceModal')) {
                document.getElementById('resourceModal').classList.remove('active');
                document.getElementById('resourceIframeContainer').innerHTML = '';
                document.body.style.overflow = '';
            }
        });

        // ==========================================
        // AI Mentor Logic
        // ==========================================
        const aiFab = document.getElementById('aiFab');
        const aiChatWindow = document.getElementById('aiChatWindow');
        const aiCloseBtn = document.getElementById('aiCloseBtn');
        const aiInput = document.getElementById('aiInput');
        const aiSendBtn = document.getElementById('aiSendBtn');
        const aiChatBody = document.getElementById('aiChatBody');

        function toggleAiChat() {
            aiChatWindow.classList.toggle('active');
            if(aiChatWindow.classList.contains('active')) {
                setTimeout(() => aiInput.focus(), 300);
            }
        }

        aiFab.addEventListener('click', toggleAiChat);
        aiCloseBtn.addEventListener('click', toggleAiChat);

        function addAiMessage(text, sender) {
            const msgDiv = document.createElement('div');
            msgDiv.className = `ai-message ${sender === 'user' ? 'ai-user' : 'ai-bot'}`;
            msgDiv.innerHTML = `<div class="ai-bubble">${text}</div>`;
            aiChatBody.appendChild(msgDiv);
            aiChatBody.scrollTop = aiChatBody.scrollHeight;
        }

        function handleAiInteraction() {
            const text = aiInput.value.trim();
            if(!text) return;
            
            // Add User msg
            addAiMessage(text, 'user');
            aiInput.value = '';

        async function fetchAcademicAnswer(query) {
            try {
                // Remove common conversational words to isolate the core academic term using word boundaries
                let cleanQuery = query.toLowerCase().replace(/\b(what is|explain|define|tell me about|how does|what are|the|a)\b/gi, '').trim();
                // We keep 'law of' so that "law of force" searches for "law of force" explicitly if wanted, but "force" is better. Actually let Wikipedia handle it.
                if(!cleanQuery) cleanQuery = query;

                // Wikipedia Open Search API
                const searchRes = await fetch(`https://en.wikipedia.org/w/api.php?action=query&list=search&srsearch=${encodeURIComponent(cleanQuery)}&utf8=&format=json&origin=*`);
                const searchData = await searchRes.json();
                
                if(searchData.query && searchData.query.search.length > 0) {
                    // Get the exact title of the best match
                    const title = searchData.query.search[0].title;
                    // Fetch the summary via REST API
                    const pageRes = await fetch(`https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(title)}`);
                    const pageData = await pageRes.json();
                    
                    if(pageData.extract) {
                        return pageData.extract + `<br><br><small style="color:var(--cyber-green); opacity:0.8;"><i>Source: Global Academic Database</i></small>`;
                    }
                }
                return "That's an advanced concept! While I'm still learning to parse complex technical problems entirely, I recommend checking our detailed Lectures in the Learning Hub for deep-dive answers on this topic.";
            } catch (err) {
                 return "I'm having trouble connecting to my academic database right now. Please check your internet connection or try checking the Learning Hub!";
            }
        }

        // Guardrail logic / Academic Response Engine
        function handleAiInteraction() {
            const text = aiInput.value.trim();
            if(!text) return;
            
            // Add User msg
            addAiMessage(text, 'user');
            aiInput.value = '';

            const lText = text.toLowerCase();
            const forbidden = ['movie', 'game', 'gaming', 'play', 'song', 'dance', 'film', 'music', 'pubg', 'bgmi', 'free fire', 'youtube', 'joke'];
            
            let isForbidden = forbidden.some(k => lText.includes(k) && !lText.includes("documentary"));
            
            if(isForbidden) {
                setTimeout(() => addAiMessage("I am your B.K. Singh Classes Academic Mentor. Let's stay focused on your studies! How can I help you with your subjects today?", 'bot'), 600);
            } else if(lText.match(/\b(hi|hello|hey|start)\b/)) {
                setTimeout(() => addAiMessage("Hello! Ready to conquer your syllabus today?", 'bot'), 600);
            } else {
                // Show typing indicator
                const typingId = "typing-" + Date.now();
                setTimeout(() => {
                    const msgDiv = document.createElement('div');
                    msgDiv.id = typingId;
                    msgDiv.className = `ai-message ai-bot`;
                    msgDiv.innerHTML = `<div class="ai-bubble" style="opacity: 0.7;"><i>Researching concept...</i></div>`;
                    aiChatBody.appendChild(msgDiv);
                    aiChatBody.scrollTop = aiChatBody.scrollHeight;
                    
                    // Fetch real answer
                    fetchAcademicAnswer(text).then(answer => {
                        const tEl = document.getElementById(typingId);
                        if(tEl) tEl.remove();
                        addAiMessage(answer, 'bot');
                    });
                }, 400);
            }
        }

        aiSendBtn.addEventListener('click', handleAiInteraction);
        aiInput.addEventListener('keypress', (e) => {
            if(e.key === 'Enter') handleAiInteraction();
        });

        // Initialize App Hub
        document.addEventListener("DOMContentLoaded", () => {
            fetchHubData();
            renderHub();
        });
