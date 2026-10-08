document.addEventListener("DOMContentLoaded", function () {
        /* =========================================================
       SERVICE REQUEST → CONTACT FORM
    ========================================================= */

    const serviceRequestLinks =
        document.querySelectorAll(".service-request");

    const requirementSelect =
        document.getElementById("requirement");

    if (serviceRequestLinks.length && requirementSelect) {

        serviceRequestLinks.forEach(function (link) {

            link.addEventListener("click", function () {

                const selectedService =
                    link.getAttribute("data-service");

                if (selectedService) {

                    requirementSelect.value =
                        selectedService;

                }

            });

        });

    }

    /* =========================================================
       MOBILE NAVIGATION
    ========================================================= */

    const menuToggle = document.getElementById("menuToggle");
    const navMenu = document.getElementById("navMenu");

    if (menuToggle && navMenu) {

        menuToggle.addEventListener("click", function () {

            const isOpen = navMenu.classList.toggle("open");

            menuToggle.classList.toggle("active", isOpen);

            menuToggle.setAttribute(
                "aria-expanded",
                isOpen ? "true" : "false"
            );

            menuToggle.setAttribute(
                "aria-label",
                isOpen
                    ? "Close navigation menu"
                    : "Open navigation menu"
            );

            document.body.classList.toggle("menu-open", isOpen);
        });


        /* Close mobile menu after clicking a link */

        navMenu.querySelectorAll("a").forEach(function (link) {

            link.addEventListener("click", function () {

                navMenu.classList.remove("open");
                menuToggle.classList.remove("active");

                menuToggle.setAttribute(
                    "aria-expanded",
                    "false"
                );

                menuToggle.setAttribute(
                    "aria-label",
                    "Open navigation menu"
                );

                document.body.classList.remove("menu-open");
            });

        });

    }


    /* =========================================================
       SCROLL REVEAL
    ========================================================= */

    const revealElements = document.querySelectorAll(".reveal");

    if ("IntersectionObserver" in window) {

        const revealObserver = new IntersectionObserver(
            function (entries, observer) {

                entries.forEach(function (entry) {

                    if (entry.isIntersecting) {

                        entry.target.classList.add("visible");

                        observer.unobserve(entry.target);
                    }

                });

            },
            {
                threshold: 0.12
            }
        );


        revealElements.forEach(function (element) {
            revealObserver.observe(element);
        });

    } else {

        revealElements.forEach(function (element) {
            element.classList.add("visible");
        });

    }


   /* =========================================================
   ORDER STATUS
========================================================= */

const orderForm =
    document.getElementById("orderForm");

if (orderForm) {

    const orderInput =
        document.getElementById("orderId");

    const orderMessage =
        document.getElementById("orderMessage");

    const statusStep1 =
        document.getElementById("statusStep1");

    const statusStep2 =
        document.getElementById("statusStep2");

    const statusStep3 =
        document.getElementById("statusStep3");

    const statusConnector1 =
        document.getElementById("statusConnector1");

    const statusConnector2 =
        document.getElementById("statusConnector2");


    function resetOrderSteps() {

        statusStep1.classList.add("active");

        statusStep2.classList.remove("active");
        statusStep3.classList.remove("active");

        statusConnector1.classList.remove("active");
        statusConnector2.classList.remove("active");

        statusStep1.querySelector("span").textContent = "✓";
        statusStep2.querySelector("span").textContent = "2";
        statusStep3.querySelector("span").textContent = "3";
    }


    function updateOrderSteps(status) {

        resetOrderSteps();

        status = String(status || "")
            .trim()
            .toLowerCase();


        /* ORDER RECEIVED */

        if (
            status === "received" ||
            status === "order received" ||
            status === "pending"
        ) {
            return;
        }


        /* PROCESSING */

        if (
    status === "processing" ||
    status === "in progress" ||
    status === "work in progress" ||
    status === "in-process" ||
    status === "in process"
) {

            statusStep2.classList.add("active");
            statusConnector1.classList.add("active");

            statusStep2.querySelector("span").textContent = "✓";

            return;
        }


        /* COMPLETED */

        if (
            status === "completed" ||
            status === "complete" ||
            status === "delivered"
        ) {

            statusStep2.classList.add("active");
            statusStep3.classList.add("active");

            statusConnector1.classList.add("active");
            statusConnector2.classList.add("active");

            statusStep2.querySelector("span").textContent = "✓";
            statusStep3.querySelector("span").textContent = "✓";

            return;
        }
    }


    orderForm.addEventListener("submit", function (event) {

        event.preventDefault();


        const orderId =
            orderInput.value.trim();


        if (!orderId) {

            orderMessage.textContent =
                "Please enter your Order ID.";

            orderMessage.style.color =
                "#f87171";

            resetOrderSteps();

            return;
        }


        const submitButton =
            orderForm.querySelector(
                'button[type="submit"]'
            );


        const originalButtonText =
            submitButton.innerHTML;


        submitButton.disabled = true;

        submitButton.innerHTML =
            "Checking...";


        orderMessage.textContent =
            "Checking your order status...";

        orderMessage.style.color =
            "#94a3b8";


        const backendUrl =
            "https://script.google.com/macros/s/AKfycbzJnqykxCBmpKSYA9C1Vbm90pbUHfTA_BPZPOOHWlaVwBtMDrEkK16F3Jc8BJnTwpuQ8A/exec";


        const url =
            backendUrl +
            "?orderId=" +
            encodeURIComponent(orderId) +
            "&_=" +
            Date.now();


        fetch(url, {
            method: "GET",
            cache: "no-store"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to check order status."
                );

            }

            return response.json();

        })

        .then(function (result) {

            if (!result || !result.success) {

                throw new Error(
                    result && result.message
                        ? result.message
                        : "Order not found."
                );

            }


            const order =
                result.data ||
                result.order ||
                {};


            const status =
                order.status ||
                order.orderStatus ||
                order.paymentStatus ||
                "";


            updateOrderSteps(status);


            orderMessage.innerHTML =
                "Order ID: <strong>" +
                (order.orderId || orderId) +
                "</strong><br>" +

                "Customer Name: <strong>" +
                (order.customerName || "N/A") +
                "</strong><br>" +

                "Type: <strong>" +
                (order.type || "N/A") +
                "</strong><br>" +

                "Product / Service: <strong>" +
                (order.productServices || "N/A") +
                "</strong><br>" +

                "Payment: <strong>" +
                (order.payment || "N/A") +
                "</strong><br>" +

                "Status: <strong>" +
                (status || "N/A") +
                "</strong><br>" +

                "Progress: <strong>" +
                (order.progress || "N/A") +
                "</strong>";


            orderMessage.style.color =
                "#4ade80";

        })

        .catch(function (error) {

            console.error(
                "Order Status Error:",
                error
            );


            resetOrderSteps();


            orderMessage.textContent =
                error.message ||
                "Unable to check order status.";

            orderMessage.style.color =
                "#f87171";

        })

        .finally(function () {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonText;

        });

    });

}



document.addEventListener("click", function (event) {

    const button =
        event.target.closest(".enroll-btn");

    if (!button) {
        return;
    }

    

        const courseName =
            button.getAttribute("data-course");
            const courseId =
    button.getAttribute("data-course-id");


        const courseCard =
            button.closest(".course-card");

        const priceElement =
            courseCard.querySelector(".course-price");

        const coursePrice =
            priceElement
                ? Number(
                    priceElement.textContent
                        .replace(/[₹,\s]/g, "")
                  )
                : 0;


        if (!courseName || !coursePrice) {

            alert(
                "Course information is not available."
            );

            return;

        }


        const customerName = prompt(
    "Please enter your full name:"
);

if (!customerName || !customerName.trim()) {
    alert("Please enter your name to continue.");
    return;
}

const customerEmail = prompt(
    "Please enter your email address:"
);

if (!customerEmail || !customerEmail.trim()) {
    alert("Please enter your email address to continue.");
    return;
}

const confirmPayment = confirm(
    "Course: " + courseName +
    "\nAmount: ₹" + coursePrice +
    "\nName: " + customerName.trim() +
    "\n\nContinue to payment?"
);

if (!confirmPayment) {
    return;
}


        button.disabled = true;

        const originalText =
            button.innerHTML;

        button.innerHTML =
            "Please wait...";


        /*
         * BluePeak Apps Script Web App URL
         */
        const backendUrl =
            "https://script.google.com/macros/s/AKfycbzJnqykxCBmpKSYA9C1Vbm90pbUHfTA_BPZPOOHWlaVwBtMDrEkK16F3Jc8BJnTwpuQ8A/exec";


        /*
         * Create Razorpay Order
         */
        const url =
    backendUrl +
    "?action=createRazorpayOrder" +
    "&courseId=" +
    encodeURIComponent(courseId) +
    "&courseName=" +
    encodeURIComponent(courseName) +
    "&amount=" +
    encodeURIComponent(coursePrice) +
    "&customerName=" +
    encodeURIComponent(customerName.trim()) +
    "&customerEmail=" +
    encodeURIComponent(customerEmail.trim());


        fetch(url + "&_=" + Date.now(), {
    method: "GET",
    cache: "no-store"
})

            .then(function (response) {

                if (!response.ok) {

                    throw new Error(
                        "Backend request failed."
                    );

                }

                return response.json();

            })

            .then(function (result) {

                if (!result.success) {

                    throw new Error(
                        result.message ||
                        "Unable to create payment order."
                    );

                }


                /*
                 * Razorpay Checkout
                 */
                const options = {

                    key:
                        result.keyId,

                    amount:
                        result.amountInPaise,

                    currency:
                        result.currency,

                    name:
                        "BluePeak Solutions",

                    description:result.courseName,
                

                    order_id:
                        result.razorpayOrderId,

prefill: {
    name: customerName.trim(),
    email: customerEmail.trim()
},


                    handler:
                        function (paymentResponse) {

                            alert(
                                "Payment successful!\n\n" +
                                "Payment ID: " +
                                paymentResponse.razorpay_payment_id +
                                "\n\n" +
                                "Please wait while your course access is processed."
                            );

                        },


                    theme: {

                        color:
                            "#2563eb"

                    }

                };


                const razorpay =
                    new Razorpay(options);


                razorpay.open();


                razorpay.on(
                    "payment.failed",
                    function (response) {

                        alert(
                            "Payment failed.\n\n" +
                            (
                                response.error &&
                                response.error.description
                                    ? response.error.description
                                    : "Please try again."
                            )
                        );

                    }
                );


                button.disabled = false;

                button.innerHTML =
                    originalText;

            })

            .catch(function (error) {

                console.error(
                    "Payment Error:",
                    error
                );


                alert(
                    error.message ||
                    "Unable to start payment. Please try again."
                );


                button.disabled = false;

                button.innerHTML =
                    originalText;

            });

    });


// extra added
function updateCoursePrices(courses) {

    if (!Array.isArray(courses)) {
        return;
    }

    courses.forEach(function (course) {

        const card =
            document.querySelector(
                `.course-card[data-course-id="${course.courseId}"]`
            );

        if (!card) {
            return;
        }

        const priceElement =
            card.querySelector(".course-price");

        if (!priceElement) {
            return;
        }

        if (Number(course.price) > 0) {

            priceElement.textContent =
                "₹" +
                Number(course.price).toLocaleString("en-IN");

        }

    });

}
/* =========================================================
   LOAD COURSES FROM GOOGLE SHEET
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const coursesGrid =
        document.getElementById("coursesGrid");

    if (!coursesGrid) {
        return;
    }

    /*
     * BluePeak Courses API
     * Cloudflare Worker → Google Apps Script → Google Sheet
     */
    const coursesApiUrl =
        "https://bluepeak-courses-api.bluepeak-workservices.workers.dev/";

    fetch(coursesApiUrl, {
        cache: "no-store"
    })
        .then(function (response) {

            if (!response.ok) {
                throw new Error(
                    "Courses API request failed."
                );
            }

            return response.json();
        })

        .then(function (result) {

            if (!result || !result.success) {
                throw new Error(
                    (result && result.message)
                        ? result.message
                        : "Unable to load courses."
                );
            }

            console.log(
                "COURSES FROM SHEET:",
                result.courses
            );

            updateCoursePrices(result.courses);

        })

        .catch(function (error) {

            console.error(
                "Course Loading Error:",
                error
            );

        });

});


/* =========================================================
   COURSE ICON
   ========================================================= */

function getCourseIcon(courseId) {

    switch (courseId) {

        case "EXCEL":
            return "X";

        case "POWERPOINT":
            return "P";

        case "POWERBI":
            return "B";

        case "WORD":
            return "W";

        case "DATA_CLEANING":
            return "C";

        case "DATA_MANAGEMENT":
            return "D";

        default:
            return "✓";
    }

}

/* =========================================================
   CONTACT / ENQUIRY FORM
   ========================================================= */

document.addEventListener("DOMContentLoaded", function () {

    const contactForm =
        document.getElementById("contactForm");

    const contactMessage =
        document.getElementById("contactMessage");

    if (!contactForm || !contactMessage) {
        return;
    }

    contactForm.addEventListener("submit", function (event) {

        event.preventDefault();

        const name =
            document.getElementById("name").value.trim();

        const email =
            document.getElementById("email").value.trim();

        const phone =
            document.getElementById("phone").value.trim();

        const requirement =
            document.getElementById("requirement").value.trim();

        const message =
            document.getElementById("message").value.trim();

        if (!name || !email || !message) {

            contactMessage.textContent =
                "Please fill in all required fields.";

            contactMessage.style.color = "#f87171";

            return;
        }

        const submitButton =
            contactForm.querySelector(
                'button[type="submit"]'
            );

        const originalButtonText =
            submitButton.innerHTML;

        submitButton.disabled = true;

        submitButton.innerHTML =
            "Submitting...";

        contactMessage.textContent =
            "Submitting your enquiry...";

        contactMessage.style.color =
            "#94a3b8";


        const backendUrl =
            "https://script.google.com/macros/s/AKfycbzJnqykxCBmpKSYA9C1Vbm90pbUHfTA_BPZPOOHWlaVwBtMDrEkK16F3Jc8BJnTwpuQ8A/exec";


        const url =
            backendUrl +
            "?action=submitEnquiry" +
            "&name=" +
            encodeURIComponent(name) +
            "&email=" +
            encodeURIComponent(email) +
            "&phone=" +
            encodeURIComponent(phone) +
            "&requirement=" +
            encodeURIComponent(requirement) +
            "&message=" +
            encodeURIComponent(message);


        fetch(url + "&_=" + Date.now(), {
            method: "GET",
            cache: "no-store"
        })

        .then(function (response) {

            if (!response.ok) {

                throw new Error(
                    "Unable to submit enquiry."
                );

            }

            return response.json();

        })

        .then(function (result) {

            if (!result.success) {

                throw new Error(
                    result.message ||
                    "Enquiry submission failed."
                );

            }

            contactMessage.textContent =
                "Your enquiry has been submitted successfully.";

            contactMessage.style.color =
                "#4ade80";

            contactForm.reset();

        })

        .catch(function (error) {

            console.error(
                "Enquiry Error:",
                error
            );

            contactMessage.textContent =
                error.message ||
                "Unable to submit your enquiry. Please try again.";

            contactMessage.style.color =
                "#f87171";

        })

        .finally(function () {

            submitButton.disabled = false;

            submitButton.innerHTML =
                originalButtonText;

        });

    });

});
});

/* =========================
   LOGIN / SIGN UP TABS
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginTab = document.getElementById("loginTab");
    const signupTab = document.getElementById("signupTab");

    const loginForm = document.getElementById("loginForm");
    const signupForm = document.getElementById("signupForm");

    if (!loginTab || !signupTab || !loginForm || !signupForm) {
        return;
    }

    loginTab.addEventListener("click", function () {

        loginTab.classList.add("active");
        signupTab.classList.remove("active");

        loginForm.style.display = "block";
        signupForm.style.display = "none";

    });

    signupTab.addEventListener("click", function () {

        signupTab.classList.add("active");
        loginTab.classList.remove("active");

        signupForm.style.display = "block";
        loginForm.style.display = "none";

    });

});

/* =========================
   REAL SIGN UP
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const signupForm = document.getElementById("signupForm");

    if (!signupForm) return;

    const signupMessage = document.getElementById("signupMessage");

    const AUTH_API_URL =
        "https://script.google.com/macros/s/AKfycbxQMKkL5TlIl5LzGX5Wiep-IVeVeQsraI4k-DkfBiD7BntYX3diKkAJFnfJoDwl1WBVJg/exec";

    signupForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const fullName =
            document.getElementById("signupName").value.trim();

        const email =
            document.getElementById("signupEmail").value.trim();

        const password =
            document.getElementById("signupPassword").value;

        const confirmPassword =
            document.getElementById("signupConfirmPassword").value;

        if (password !== confirmPassword) {

            signupMessage.textContent =
                "Passwords do not match.";

            signupMessage.style.color = "#dc2626";

            return;
        }

        signupMessage.textContent =
            "Creating your account...";

        signupMessage.style.color = "#64748b";

        try {

            const response = await fetch(AUTH_API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "signup",
                    fullName: fullName,
                    email: email,
                    password: password
                })

            });

            const result = await response.json();

            if (!result.success) {

                signupMessage.textContent =
                    result.message || "Unable to create account.";

                signupMessage.style.color = "#dc2626";

                return;
            }

            signupMessage.textContent =
                "Account created successfully!";

            signupMessage.style.color = "#16a34a";

            signupForm.reset();

            console.log("NEW USER:", result.user);

        } catch (error) {

            console.error("Signup Error:", error);

            signupMessage.textContent =
                "Unable to connect to the account service.";

            signupMessage.style.color = "#dc2626";
        }

    });

});

/* =========================
   REAL LOGIN
========================= */

document.addEventListener("DOMContentLoaded", function () {

    const loginForm = document.getElementById("loginForm");

    if (!loginForm) return;

    const loginMessage = document.getElementById("loginMessage");

    const AUTH_API_URL =
        "https://script.google.com/macros/s/AKfycbxQMKkL5TlIl5LzGX5Wiep-IVeVeQsraI4k-DkfBiD7BntYX3diKkAJFnfJoDwl1WBVJg/exec";

    loginForm.addEventListener("submit", async function (event) {

        event.preventDefault();

        const email =
            document.getElementById("loginEmail").value.trim();

        const password =
            document.getElementById("loginPassword").value;

        if (!email || !password) {

            loginMessage.textContent =
                "Please enter your email and password.";

            loginMessage.style.color = "#dc2626";

            return;
        }

        loginMessage.textContent =
            "Signing you in...";

        loginMessage.style.color = "#64748b";

        try {

            const response = await fetch(AUTH_API_URL, {

                method: "POST",

                headers: {
                    "Content-Type": "text/plain;charset=utf-8"
                },

                body: JSON.stringify({
                    action: "login",
                    email: email,
                    password: password
                })

            });

            const result = await response.json();

            if (!result.success) {

                loginMessage.textContent =
                    result.message || "Login failed.";

                loginMessage.style.color = "#dc2626";

                return;
            }

            loginMessage.textContent =
    "Login successful!";
loginMessage.style.color = "#16a34a";

const authCard = document.querySelector(".auth-card");
const studentDashboard = document.getElementById("studentDashboard");
const authTabs = document.querySelector(".auth-tabs");
const loginForm = document.getElementById("loginForm");
const signupForm = document.getElementById("signupForm");

if (result.user) {

    document.getElementById("dashboardUserName").textContent =
        result.user.fullName || "Student";

    document.getElementById("dashboardUserEmail").textContent =
        result.user.email || "";

    if (studentDashboard) {
        studentDashboard.style.display = "block";
    }

    if (authTabs) {
        authTabs.style.display = "none";
    }

    if (loginForm) {
        loginForm.style.display = "none";
    }

    if (signupForm) {
        signupForm.style.display = "none";
    }

    if (loginMessage) {
        loginMessage.style.display = "none";
    }
}

console.log("LOGGED IN USER:", result.user);

        } catch (error) {

    console.error("Login Error:", error);

    loginMessage.textContent =
        "Login Error: " + (error.message || error);

    loginMessage.style.color = "#dc2626";
}

    });

});

document.addEventListener("DOMContentLoaded", function () {

    const dashboardLogout =
        document.getElementById("dashboardLogout");

    const studentDashboard =
        document.getElementById("studentDashboard");

    const authTabs =
        document.querySelector(".auth-tabs");

    const loginForm =
        document.getElementById("loginForm");

    const signupForm =
        document.getElementById("signupForm");

    const loginMessage =
        document.getElementById("loginMessage");


    if (!dashboardLogout) {
        console.error("Dashboard Logout button not found.");
        return;
    }


    dashboardLogout.addEventListener("click", function () {

        console.log("LOGOUT BUTTON CLICKED");


        // Hide dashboard
        if (studentDashboard) {
            studentDashboard.style.display = "none";
        }


        // Show Login / Sign Up tabs
        if (authTabs) {
            authTabs.style.display = "";
        }


        // Show login form
        if (loginForm) {
            loginForm.style.display = "";
            loginForm.reset();
        }


        // Hide signup form
        if (signupForm) {
            signupForm.style.display = "none";
            signupForm.reset();
        }


        // Clear login message
        if (loginMessage) {
            loginMessage.textContent = "";
            loginMessage.style.display = "";
        }


        // Make Login tab active
        const loginTab =
            document.getElementById("loginTab");

        const signupTab =
            document.getElementById("signupTab");


        if (loginTab) {
            loginTab.classList.add("active");
        }

        if (signupTab) {
            signupTab.classList.remove("active");
        }


        // Return to login area
        const loginSection =
            document.getElementById("login");

        if (loginSection) {

            loginSection.scrollIntoView({
                behavior: "smooth",
                block: "start"
            });

        }

    });

});