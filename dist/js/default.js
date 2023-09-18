// Your application goes here

// 1. Fetch Schema: A function to fetch the data from the endpoint https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d

let formSchema; // Declare formSchema at the top level

const fetchSchema = (url) => {
  let attempts = 0;

  return new Promise((resolve, reject) => {
    const fetchData = () => {
      attempts++;

      fetch(url)
        .then((response) => {
          if (!response.ok) {
            throw new Error('Network response failed');
          }
          return response.json(); // Parse the response as JSON
        })
        .then((jsonData) => {
          formSchema = jsonData; // Assign the fetched data to the global 'formSchema' variable
          resolve(formSchema); // Resolve the promise with the fetched data
        })
        .catch((error) => {
          if (attempts < 3) {
            console.error('Attempt', attempts, 'failed:', error);
            fetchData(); // Retry fetching data (recursive call)
          } else {
            reject(error); // Reject the promise if all attempts fail
          }
        });
    };

    fetchData(); // Start the initial fetch attempt
  });
};

async function createFormFields() {
  try {
    await fetchSchema('https://mocki.io/v1/84954ef5-462f-462a-b692-6531e75c220d');
    console.log('Fetched data:', formSchema); // Access the global 'formSchema' variable

    const formFieldsContainer = document.getElementById('form-fields');
    formSchema.forEach((field) => {
      const fieldElement = document.createElement('div');

      if (field.type === 'radio' && Array.isArray(field.options)) {
        // Generate radio buttons based on options
        const radioButtons = field.options
          .map((option) => `
            <input
              type="radio"
              id="${option.id}"
              name="${field.name}"
              value="${option.value}"
              ${field.required ? 'required' : ''}
            />
            <label for="${option.id}">${option.label}</label>
          `)
          .join('');

        fieldElement.innerHTML = `
          <fieldset>
            <legend>${field.legend}:</legend>
            ${radioButtons}
          </fieldset>
        `;
      } else {
        // Generate other types of fields
        fieldElement.innerHTML = `
          <label for="${field.id}">${field.label}:</label>
          <input
            type="${field.type}"
            id="${field.id}"
            name="${field.name}"
            placeholder="${field.label}"
            ${field.required ? 'required' : ''}
            ${field.pattern ? `pattern="${field.pattern}"` : ''}
          />
          <div class="error-message" id="${field.id}-error" style="display: none;"></div>
        `;
      }

      formFieldsContainer.appendChild(fieldElement);
    });
  } catch (error) {
    console.error('Failed to fetch data after 3 attempts:', error);
  }
}

// Call createFormFields() to initiate the process
createFormFields();

// Function to validate the form fields
function validateForm() {
  let isValid = true;
  formSchema.forEach((field) => {
    const inputElement = document.getElementById(field.id);
    const errorElement = document.getElementById(`${field.id}-error`);
    if (field.required && !inputElement.value.trim()) {
      errorElement.textContent = `${field.label} is required.`;
      errorElement.style.display = 'block';
      isValid = false;
    } else if (field.pattern) {
      const regex = new RegExp(field.pattern);
      if (!regex.test(inputElement.value)) {
        errorElement.textContent = `Invalid input format for ${field.label}.`;
        errorElement.style.display = 'block';
        isValid = false;
      } else {
        errorElement.style.display = 'none';
      }
    } else {
      errorElement.style.display = 'none';
    }
  });
  return isValid;
}

// Function to handle form submission
async function submitForm() {
  // Validate the form
  const isValid = validateForm();

  if (isValid) {
    // Prepare the form data as a specific JSON object
    const formData = [
      {
        name: 'nameFirst',
        value: document.querySelector('nameFirst').value,
      },
      {
        name: 'nameLast',
        value: document.querySelector('nameLast').value,
      },
      {
        name: 'contactPhone',
        value: document.querySelector('contactPhone').value,
      },
      {
        name: 'contactEmail',
        value: document.querySelector('contactEmail').value,
      },
      {
        name: 'contactPreferred',
        value: document.querySelector('input[name="contactPreferred"]:checked').value,
      },
    ];

    // Log formData to check if it contains data
    console.log('formData:', formData);

    // Define the POST request options
    const requestOptions = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(req.body), // Send formData as a single JSON object
    };

    // Send the POST request
    try {
      const response = await fetch('http://localhost:3000/submit-form', requestOptions);

      if (response.status === 200) {
        // Successful submission
        console.log('Form submitted successfully');
        const responseData = await response.json();
        console.log('Response Data:', responseData);
      } else {
        // Client-side error (404 in this case)
        console.log('Client-side error:', response.status);
      }
    } catch (error) {
      // Error handling for network or other issues
      console.error('Error submitting form:', error);
    }
  } else {
    // Form validation failed
    console.log('Form contains validation errors. Please correct them.');
  }
}
