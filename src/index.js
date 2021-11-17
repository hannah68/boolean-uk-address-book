const viewSection = document.querySelector(".view-section");
const contactsSection = document.querySelector(".contacts-section");

const state = {
  contacts: [],
  selectedContact: null
};

const serverURL = 'http://localhost:3000/';
const contactsURL = serverURL + 'contacts/';
const addressesURL = serverURL + 'addresses/';


// fetch edit contact infos========================================
const fetchEditContact = (SelectdPersonId,first,last,block,cityAddress,postCode,streetAddress) => {
  fetch(`${contactsURL}${SelectdPersonId}`, {
    method: 'PATCH',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify({ 
      "firstName": first,
      "lastName": last,
      "blockContact": block,
    })
  })
  .then(res => { 
    if ( res.ok ) {
      fetch(`${addressesURL}${SelectdPersonId}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ 
          "street": streetAddress,
          "city": cityAddress,
          "postCode": postCode
        })
      })
    }
  })
}

// listen to save  ===========================================
const listenToSaveForm = (form,firstName,lastName,block,city,postalCode,street) => {
  const SelectdPersonId = state.selectedContact.id;
  form.addEventListener('submit', e => {
    e.preventDefault();
    const first = firstName.value;
    const last = lastName.value;
    const blockContact = block.checked;
    const cityAddress = city.value;
    const postCode = postalCode.value;
    const streetAddress = street.value;

    fetchEditContact(SelectdPersonId,first,last,blockContact,cityAddress,postCode,streetAddress);
  })
}

// listen to delete button =======================================
const listenToDeleteButton = (deleteBtn) => {
  const SelectdPersonId = state.selectedContact.id;
  deleteBtn.addEventListener('click', e => {
    e.preventDefault();
    fetch(`${contactsURL}${SelectdPersonId}`, {
      method: 'DELETE'
    })
    .then(res => { 
      if ( res.ok ) {
        fetch(`${addressesURL}${SelectdPersonId}`, {
           method: 'DELETE'
        })
      }
    })
  })
}


// render edit form ===========================================
const renderEditForm = () => {
  viewSection.innerHTML = "";
  const form = document.createElement('form');
  form.className = "form-stack light-shadow center contact-form";
  viewSection.append(form);
  form.innerHTML = `
    <h1>Update Contact</h1>
    <label for="first-name-input">First Name:</label>
    <input id="first-name-input" name="first-name-input" type="text" />
    <label for="last-name-input">Last Name:</label>
    <input id="last-name-input" name="last-name-input" type="text" />
    <label for="street-input">Street:</label>
    <input id="street-input" name="street-input" type="text" />
    <label for="city-input">City:</label>
    <input id="city-input" name="city-input" type="text" />
    <label for="post-code-input">Post Code:</label>
    <input id="post-code-input" name="post-code-input" type="text" />
    <div class="checkbox-section">
      <input id="block-checkbox" name="block-checkbox" type="checkbox" />
      <label for="block-checkbox">Block</label>
    </div>
    <div class="actions-section">
      <button class="button blue" type="submit">Save</button>
      <button class="delete-button blue" type="button">Delete</button>
    </div>
  `;

  const deleteBtn = form.querySelector('.delete-button');
  const firstName = form.querySelector('#first-name-input');
  const lastName = form.querySelector('#last-name-input');
  const street = form.querySelector('#street-input');
  const city = form.querySelector('#city-input');
  const postalCode = form.querySelector('#post-code-input');
  const block = form.querySelector('#block-checkbox');
  
  firstName.value = state.selectedContact.firstName;
  lastName.value = state.selectedContact.lastName;
  street.value = state.selectedContact.address.street;
  city.value = state.selectedContact.address.city;
  postalCode.value = state.selectedContact.address.postCode;
  block.checked = state.selectedContact.blockContact;

  listenToSaveForm(form,firstName,lastName,block,city,postalCode,street);
  listenToDeleteButton(deleteBtn);
}


// fetch address info=====================================
const fetchAddressInfo = (city, postCode, street) => {
  fetch(`${addressesURL}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "street": street,
      "city": city,
      "postCode": postCode
    })
  })
}

// async function getContactsAndUpdateState(index){
//   if(index <0) {
//     index = 0;
//   }
//   const gettingContacts = await getContacts();
//   state.selectedContact = state.contacts[index];
//   renderContactView();
// }

// fetch contact info======================================
const fetchContactInfo = (firstName, lastName, blockContact, addressId) => {
  fetch(`${contactsURL}`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json'},
    body: JSON.stringify({
      "firstName": firstName,
      "lastName": lastName,
      "blockContact": blockContact,
      "addressId": addressId,
    })
  })
  .then(res => res.json())
  // There is a bug in liveserver: it refresh page after posting request
  // to avoid it, remove the list of contacts and then update state
  // .then(() => {
  //   const list = document.querySelector('.contacts-list');
  //   list.remove();
  //   getContactsAndUpdateState(state.contacts.length-1);
  // })
}


// get user input in form ===============================
const getUserInput = (form) => {
  const userNameInput = form.querySelector('#first-name-input');
  const lastNameInput = form.querySelector('#last-name-input');
  const streetInput = form.querySelector('#street-input');
  const cityInput = form.querySelector('#city-input');
  const postalCodeInput = form.querySelector('#post-code-input');
  const blockInput = form.querySelector('#block-checkbox');
  
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const firstName = userNameInput.value;
    const lastName = lastNameInput.value;
    const blockContact = blockInput.checked;
    const addressId = state.contacts.length + 1;
    const city = cityInput.value;
    const postCode = postalCodeInput.value;
    const street = streetInput.value;

    fetchContactInfo(firstName, lastName, blockContact, addressId);
    fetchAddressInfo(city, postCode, street)
  })
}

// render form ================================================
const renderNewContactForm = () => {
  viewSection.innerHTML = "";
  const form = document.createElement('form');
  form.className = "form-stack light-shadow center contact-form";
  viewSection.append(form);
  form.innerHTML = `
    <h1>Create Contact</h1>
    <label for="first-name-input">First Name:</label>
    <input id="first-name-input" name="first-name-input" type="text" />
    <label for="last-name-input">Last Name:</label>
    <input id="last-name-input" name="last-name-input" type="text" />
    <label for="street-input">Street:</label>
    <input id="street-input" name="street-input" type="text" />
    <label for="city-input">City:</label>
    <input id="city-input" name="city-input" type="text" />
    <label for="post-code-input">Post Code:</label>
    <input id="post-code-input" name="post-code-input" type="text" />
    <div class="checkbox-section">
      <input id="block-checkbox" name="block-checkbox" type="checkbox" />
      <label for="block-checkbox">Block</label>
    </div>
    <div class="actions-section">
      <button class="button blue" type="submit">Create</button>
    </div>
  `;
  getUserInput(form);
}

// listen to new contact button====================================
const listenNewContactButton = () =>{
  const btn = document.querySelector(".new-contact-btn");
  btn.addEventListener("click", function () {
    renderNewContactForm();
  });
}

// render address section ============================================
const renderAddressSection = (address) => {
  const containerEl = document.createElement("section");
  const headingEl = document.createElement("h2");
  headingEl.innerText = "Address";
  containerEl.append(headingEl);
  const streetText = document.createElement("p");
  streetText.innerText = address.street;
  containerEl.append(streetText);
  const cityText = document.createElement("p");
  cityText.innerText = address.city;
  containerEl.append(cityText);
  const postCodeText = document.createElement("p");
  postCodeText.innerText = address.postCode;
  containerEl.append(postCodeText);
  return containerEl;
}

// render contact view==============================================
const renderContactView = () =>{
  const contact = state.selectedContact;
  if (!contact) return;
  viewSection.innerHTML = "";
  const containerEl = document.createElement("article");
  containerEl.className = "center light-shadow address-card";
  const headingEl = document.createElement("h1");
  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;
  containerEl.append(headingEl);
  const addressSectionEl = renderAddressSection(contact.address);
  containerEl.append(addressSectionEl);
  viewSection.append(containerEl);
}

// render contact list item=========================================
const renderContactListItem = (contact) => {
  const listItemEl = document.createElement("li");
  const headingEl = document.createElement("h3");
  const fullName = `${contact.firstName} ${contact.lastName}`;
  headingEl.innerText = fullName;
  listItemEl.append(headingEl);
  const viewBtn = document.createElement("button");
  viewBtn.className = "button grey";
  viewBtn.innerText = "View";
  viewBtn.addEventListener("click", function () {
    state.selectedContact = contact;
    console.log('view: ', state);
    renderContactView();
  });

  listItemEl.append(viewBtn);
  const editBtn = document.createElement("button");
  editBtn.className = "button blue";
  editBtn.innerText = "Edit";
  editBtn.addEventListener("click", function () {
    state.selectedContact = contact;
    console.log('edit: ',state);
    renderEditForm();
  });
  listItemEl.append(editBtn);
  return listItemEl;
}

// render contact list======================================
const renderContactsList = () => {
  const listEl = document.createElement("ul");
  listEl.className = "contacts-list";
  for (let i = 0; i < state.contacts.length; i++) {
    const contact = state.contacts[i];
    const listItemEl = renderContactListItem(contact);
    listEl.append(listItemEl);
  }
  contactsSection.append(listEl);
}

// get contacts================================================
async function getContacts() {
  const response = await fetch("http://localhost:3000/contacts");
  const data = await response.json();
  state.contacts = data;
  console.log('first state: ', state);
  renderContactsList();
}

// function deletec(){
//    fetch("http://localhost:3000/addresses/8", {
//       method: 'DELETE'
//     })
// }

// deletec()

// init app==================================
const init = () => {
  listenNewContactButton();
  getContacts();
}

init();
