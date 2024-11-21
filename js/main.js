/* ===================================================================
 * Monica 1.0.0 - Main JS
 *
 * ------------------------------------------------------------------- */

(function(html) {

    'use strict';

    const cfg = {

        // MailChimp URL
        mailChimpURL : 'https://facebook.us1.list-manage.com/subscribe/post?u=1abf75f6981256963a47d197a&amp;id=37c6d8f4d6' 

    };


   /* preloader
    * -------------------------------------------------- */
    const ssPreloader = function() {

        const siteBody = document.querySelector('body');
        const preloader = document.querySelector('#preloader');
        if (!preloader) return;

        html.classList.add('ss-preload');
        
        window.addEventListener('load', function() {
            html.classList.remove('ss-preload');
            html.classList.add('ss-loaded');
            
            preloader.addEventListener('transitionend', function afterTransition(e) {
                if (e.target.matches('#preloader'))  {
                    siteBody.classList.add('ss-show');
                    e.target.style.display = 'none';
                    preloader.removeEventListener(e.type, afterTransition);
                }
            });
        });

    }; // end ssPreloader


   /* mobile menu
    * ---------------------------------------------------- */ 
    const ssMobileMenu = function() {

        const toggleButton = document.querySelector('.s-header__menu-toggle');
        const mainNavWrap = document.querySelector('.s-header__nav');
        const siteBody = document.querySelector('body');

        if (!(toggleButton && mainNavWrap)) return;

        toggleButton.addEventListener('click', function(e) {
            e.preventDefault();
            toggleButton.classList.toggle('is-clicked');
            siteBody.classList.toggle('menu-is-open');
        });

        mainNavWrap.querySelectorAll('.s-header__nav a').forEach(function(link) {

            link.addEventListener("click", function(event) {

                // at 900px and below
                if (window.matchMedia('(max-width: 900px)').matches) {
                    toggleButton.classList.toggle('is-clicked');
                    siteBody.classList.toggle('menu-is-open');
                }
            });
        });

        window.addEventListener('resize', function() {

            // above 900px
            if (window.matchMedia('(min-width: 901px)').matches) {
                if (siteBody.classList.contains('menu-is-open')) siteBody.classList.remove('menu-is-open');
                if (toggleButton.classList.contains('is-clicked')) toggleButton.classList.remove('is-clicked');
            }
        });

    }; // end ssMobileMenu


   /* swiper
    * ------------------------------------------------------ */ 
    const ssSwiper = function() {

        const homeSliderSwiper = new Swiper('.home-slider', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 40
                },
                // when window width is > 1330px
                1331: {
                    slidesPerView: 3,
                    spaceBetween: 48
                },
                // when window width is > 1773px
                1774: {
                    slidesPerView: 4,
                    spaceBetween: 48
                }
            }
        });

        const pageSliderSwiper = new Swiper('.page-slider', {

            slidesPerView: 1,
            pagination: {
                el: '.swiper-pagination',
                clickable: true,
            },
            breakpoints: {
                // when window width is > 400px
                401: {
                    slidesPerView: 1,
                    spaceBetween: 20
                },
                // when window width is > 800px
                801: {
                    slidesPerView: 2,
                    spaceBetween: 40
                },
                // when window width is > 1240px
                1241: {
                    slidesPerView: 3,
                    spaceBetween: 48
                }
            }
        });

    }; // end ssSwiper


   /* mailchimp form
    * ---------------------------------------------------- */ 
    const ssMailChimpForm = function() {

        const mcForm = document.querySelector('#mc-form');

        if (!mcForm) return;

        // Add novalidate attribute
        mcForm.setAttribute('novalidate', true);

        // Field validation
        function hasError(field) {

            // Don't validate submits, buttons, file and reset inputs, and disabled fields
            if (field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') return;

            // Get validity
            let validity = field.validity;

            // If valid, return null
            if (validity.valid) return;

            // If field is required and empty
            if (validity.valueMissing) return 'Please enter an email address.';

            // If not the right type
            if (validity.typeMismatch) {
                if (field.type === 'email') return 'Please enter a valid email address.';
            }

            // If pattern doesn't match
            if (validity.patternMismatch) {

                // If pattern info is included, return custom error
                if (field.hasAttribute('title')) return field.getAttribute('title');

                // Otherwise, generic error
                return 'Please match the requested format.';
            }

            // If all else fails, return a generic catchall error
            return 'The value you entered for this field is invalid.';

        };

        // Show error message
        function showError(field, error) {

            // Get field id or name
            let id = field.id || field.name;
            if (!id) return;

            let errorMessage = field.form.querySelector('.mc-status');

            // Update error message
            errorMessage.classList.remove('success-message');
            errorMessage.classList.add('error-message');
            errorMessage.innerHTML = error;

        };

        // Display form status (callback function for JSONP)
        window.displayMailChimpStatus = function (data) {

            // Make sure the data is in the right format and that there's a status container
            if (!data.result || !data.msg || !mcStatus ) return;

            // Update our status message
            mcStatus.innerHTML = data.msg;

            // If error, add error class
            if (data.result === 'error') {
                mcStatus.classList.remove('success-message');
                mcStatus.classList.add('error-message');
                return;
            }

            // Otherwise, add success class
            mcStatus.classList.remove('error-message');
            mcStatus.classList.add('success-message');
        };

        // Submit the form 
        function submitMailChimpForm(form) {

            let url = cfg.mailChimpURL;
            let emailField = form.querySelector('#mce-EMAIL');
            let serialize = '&' + encodeURIComponent(emailField.name) + '=' + encodeURIComponent(emailField.value);

            if (url == '') return;

            url = url.replace('/post?u=', '/post-json?u=');
            url += serialize + '&c=displayMailChimpStatus';

            // Create script with url and callback (if specified)
            var ref = window.document.getElementsByTagName( 'script' )[ 0 ];
            var script = window.document.createElement( 'script' );
            script.src = url;

            // Create global variable for the status container
            window.mcStatus = form.querySelector('.mc-status');
            window.mcStatus.classList.remove('error-message', 'success-message')
            window.mcStatus.innerText = 'Submitting...';

            // Insert script tag into the DOM
            ref.parentNode.insertBefore( script, ref );

            // After the script is loaded (and executed), remove it
            script.onload = function () {
                this.remove();
            };

        };

        // Check email field on submit
        mcForm.addEventListener('submit', function (event) {

            event.preventDefault();

            let emailField = event.target.querySelector('#mce-EMAIL');
            let error = hasError(emailField);

            if (error) {
                showError(emailField, error);
                emailField.focus();
                return;
            }

            submitMailChimpForm(this);

        }, false);

    }; // end ssMailChimpForm


   /* alert boxes
    * ------------------------------------------------------ */
    const ssAlertBoxes = function() {

        const boxes = document.querySelectorAll('.alert-box');
  
        boxes.forEach(function(box){

            box.addEventListener('click', function(e) {
                if (e.target.matches('.alert-box__close')) {
                    e.stopPropagation();
                    e.target.parentElement.classList.add('hideit');

                    setTimeout(function() {
                        box.style.display = 'none';
                    }, 500)
                }
            });
        })

    }; // end ssAlertBoxes


    /* Back to Top
    * ------------------------------------------------------ */
    const ssBackToTop = function() {

        const pxShow = 900;
        const goTopButton = document.querySelector(".ss-go-top");

        if (!goTopButton) return;

        // Show or hide the button
        if (window.scrollY >= pxShow) goTopButton.classList.add("link-is-visible");

        window.addEventListener('scroll', function() {
            if (window.scrollY >= pxShow) {
                if(!goTopButton.classList.contains('link-is-visible')) goTopButton.classList.add("link-is-visible")
            } else {
                goTopButton.classList.remove("link-is-visible")
            }
        });

    }; // end ssBackToTop


   /* smoothscroll
    * ------------------------------------------------------ */
    const ssMoveTo = function() {

        const easeFunctions = {
            easeInQuad: function (t, b, c, d) {
                t /= d;
                return c * t * t + b;
            },
            easeOutQuad: function (t, b, c, d) {
                t /= d;
                return -c * t* (t - 2) + b;
            },
            easeInOutQuad: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t + b;
                t--;
                return -c/2 * (t*(t-2) - 1) + b;
            },
            easeInOutCubic: function (t, b, c, d) {
                t /= d/2;
                if (t < 1) return c/2*t*t*t + b;
                t -= 2;
                return c/2*(t*t*t + 2) + b;
            }
        }

        const triggers = document.querySelectorAll('.smoothscroll');
        
        const moveTo = new MoveTo({
            tolerance: 0,
            duration: 1200,
            easing: 'easeInOutCubic',
            container: window
        }, easeFunctions);

        triggers.forEach(function(trigger) {
            moveTo.registerTrigger(trigger);
        });

    }; // end ssMoveTo


   /* Initialize
    * ------------------------------------------------------ */
    (function ssInit() {

        ssPreloader();
        ssMobileMenu();
        ssSwiper();
        ssMailChimpForm();
        ssAlertBoxes();
        ssMoveTo();

    })();

})(document.documentElement);



















// function validateAndSendMail(){
//     const name= document.getElementById('name')
//     const email= document.getElementById('email')
//     const phone= document.getElementById('phone')
//     const message= document.getElementById('message')
//     const phoneRegex = /^(\+?\d{1,4}[\s\-]?)?(\(?\d{1,4}\)?[\s\-]?)?[\d\s\-]{7,15}$/;
    
//     const form = document.getElementById('form')
//     const errorElement =document.getElementById('error')
//     form.addEventListener('submit',(e) =>{
//         let messages = []
//         if(name.value === '' || name.value == null){
//             messages.push("name is required")
//         }
//         else if (/[0-9!@#$%^&*(),.?":{}|<>]/.test(name.value)) {
//             // Regex to check for numbers or special characters
//             messages.push("Name should not contain numbers or special characters");
//         }
    
//        if (email.value === '' || email.value == null) {
//         messages.push("Email is required");
//     } else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(email.value)) {
//         messages.push("Please enter a valid email address");
//     }
    
//     if (phone.value === '' || phone.value == null){
//         messages.push("Number  is required");
//     }
//     else if (!phoneRegex.test(phone.value)) {
//         messages.push("Please enter a valid phone number");
//     }
//     else {
//         // Strip out non-numeric characters (like spaces, dashes, and parentheses)
//         const cleanPhone = phone.value.replace(/\D/g, '');
        
//         // Check if the cleaned phone number has exactly 10 digits
//         if (cleanPhone.length !== 10) {
//             messages.push("Phone number must be exactly 10 digits");
//         }
//     }
    
    
//     if(send.value ===''){
//         messages.push("Write something");
//     }
//     // message box
    
    
    
    
    
//         if(messages.length > 0){
//             e.preventDefault()
//             errorElement.innerText = messages.join(',')
//         }
    
    
//         // else{
//         //     sendMail();
//         // }
    
//     })
    
// }


























// function sendMail() {
//     var params = {
//       name: document.getElementById("name").value,
//       email: document.getElementById("email").value,
//       phone:document.getElementById("phone").value,
//       message: document.getElementById("message").value,
//     };
  
//     const serviceID = "service_fe68hor";
//     const templateID = "template_r8fxngf";
  
//       emailjs.send(serviceID, templateID, params)
//       .then(res=>{
//           document.getElementById("name").value = "";
//           document.getElementById("email").value = "";
//           document.getElementById("phone").value="";
//           document.getElementById("message").value = "";
//           console.log(res);
//           alert("Your message sent successfully!!")
  
//       })
//       .catch(err=>console.log(err));
  
//   }









//   document.getElementById('contactForm').addEventListener('submit', function(event) {
//     event.preventDefault();

//     let isValid = true;

//     // Clear previous error messages
//     clearErrors();

//     // Validate fields
//     const fields = {
//         name: document.getElementById('name').value,
//         email: document.getElementById('email').value,
//         phone: document.getElementById('phone').value,
//         message: document.getElementById('message').value
//     };

//     const validationFunctions = {
//         name: value => value === '' ? 'Name is required.' : '',
//         email: value => value === '' ? 'Email is required.' : !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value) ? 'Please enter a valid email address.' : '',
//         phone: value => value === '' ? 'Phone number is required.' : !/^\d{10}$/.test(value) ? 'Please enter a valid 10-digit phone number.' : '',
//         message: value => value === '' ? 'Message is required.' : ''
//     };

//     for (const field in fields) {
//         const errorMessage = validationFunctions[field](fields[field]);
//         if (errorMessage) {
//             document.getElementById(`${field}Error`).textContent = errorMessage;
//             isValid = false;
//         }
//     }

//     if (isValid) {
//         alert('Form submitted successfully!');
//         // You can add code here to send the form data to the server
//     }
// });

// function clearErrors() {
//     const errorElements = document.querySelectorAll('.error');
//     errorElements.forEach(error => error.textContent = '');
// }





// Initialize EmailJS
emailjs.init("bvjBG8oMiuL-67J1P"); // Replace with your EmailJS Public Key

const form = document.getElementById("contactForm");

form.addEventListener("submit", (e) => {
  e.preventDefault();

  // Form fields
  const name = document.getElementById("name");
  const email = document.getElementById("email");
  const phone = document.getElementById("phone");
  const message = document.getElementById("message");

  // Error elements
  const nameError = document.getElementById("nameError");
  const emailError = document.getElementById("emailError");
  const phoneError = document.getElementById("phoneError");
  const messageError = document.getElementById("messageError");

  // Validation flags
  let isValid = true;

  // Clear previous errors
  nameError.textContent = "";
  emailError.textContent = "";
  phoneError.textContent = "";
  messageError.textContent = "";

  // Validate Name
  if (name.value.trim() === "") {
    nameError.textContent = "Name is required.";
    isValid = false;
  }

  // Validate Email
  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (email.value.trim() === "") {
    emailError.textContent = "Email is required.";
    isValid = false;
  } else if (!emailPattern.test(email.value)) {
    emailError.textContent = "Please enter a valid email address.";
    isValid = false;
  }

  // Validate Phone
  const phonePattern = /^[0-9]{10}$/;
  if (phone.value.trim() === "") {
    phoneError.textContent = "Phone number is required.";
    isValid = false;
  } else if (!phonePattern.test(phone.value)) {
    phoneError.textContent = "Please enter a valid 10-digit phone number.";
    isValid = false;
  }

  // Validate Message
  if (message.value.trim() === "") {
    messageError.textContent = "Message is required.";
    isValid = false;
  }

  // If form is valid, send the email
  if (isValid) {
    emailjs
      .send("service_fe68hor","template_6en57su", {
        name: name.value,
        email: email.value,
        phone: phone.value,
        message: message.value,
      })
      .then(() => {
        alert("Message sent successfully!");
        form.reset(); // Clear form fields
      })
      .catch((error) => {
        alert("Failed to send the message. Please try again.");
        console.error("EmailJS error:", error);
      });
  }
});
