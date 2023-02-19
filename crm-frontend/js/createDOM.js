import {removeClient, getClient, updateClient, postClient} from './api.js';
import {validateClientForm} from './app.js'

function shadow(){
    const shadowBox = document.getElementById('shadow-box');
    shadowBox.setAttribute('style', 'display: block;')
}

export function removeShadow(){
    const shadowBox = document.getElementById('shadow-box');
    shadowBox.setAttribute('style', 'display: none;')
}

function createContactItem(clients_contacts, type=null, value=null) {
    const contactsVarsList = ['Телефон', 'Vk', 'Facebook', 'Email', 'Другое']; 

    const newClientContact = document.createElement('li');
    newClientContact.classList.add('new-client-contacts__item');

    const newClientInput = document.createElement('input');
    newClientInput.setAttribute('value', 'Телефон')
    newClientInput.classList.add('new-client-contacts__input');
    newClientInput.setAttribute('list', 'contacts');
    newClientInput.setAttribute('name', 'contacts');

    const dataList = document.createElement('datalist');
    dataList.setAttribute('id', 'contacts')

    for (const i_contact of contactsVarsList) {
        const newOption = document.createElement('option');
        newOption.classList.add('contacts__element');
        newOption.value = i_contact;
        dataList.append(newOption);
    }

    const newClientValueInput = document.createElement('input');
    newClientValueInput.classList.add('new-client-contacts__input_alert');
    if(type && value) {
        newClientValueInput.value = value;
        newClientInput.value = type;
    }
    newClientValueInput.setAttribute('placeholder', 'Введите данные контакта');
    newClientValueInput.addEventListener('click', ()=>{
        if (newClientInput.value == 'Телефон'){
            const maskOptions = { // создаем объект параметров
                mask: '+{7}(000)000-00-00' // задаем единственный параметр mask
            }
            IMask(newClientValueInput, maskOptions)
        }
    })

    const newClientContactRemoveBtn = document.createElement('button');
    newClientContactRemoveBtn.classList.add('new-client-contacts__remove-btn');
    newClientContactRemoveBtn.setAttribute('id', 'new-client-contacts__remove-btn');
    tippy(newClientContactRemoveBtn, {
        content: "Удалить контакт",
    })

    newClientContactRemoveBtn.addEventListener('click', ()=> {
        clients_contacts.removeChild(newClientContact);

    });

    newClientContact.append(newClientInput);
    newClientContact.append(dataList);
    newClientContact.append(newClientValueInput);
    newClientContact.append(newClientContactRemoveBtn);

    clients_contacts.append(newClientContact);
};

export function addNewClientForm(){
    const newClientContainer = document.getElementById('new-client-id');
    newClientContainer.setAttribute('style', 'display:block;');
    shadow();

    const newContactBtn = document.getElementById('new-client-contacts__btn');
    const newClientsContacts = document.getElementById('contacts-list');
    const newClientContactErrors = document.getElementById('new-client-bottom__errors');


    function add_contact(){
        if (newClientsContacts.childNodes.length <= 10) {
            createContactItem(newClientsContacts);
        }else {
    
            newClientContactErrors.textContent = 'Ошибка: Вы не можете добавить более 10 контактов!';
            newClientContactErrors.setAttribute('style', 'display:block;')
        }
    }
    newContactBtn.addEventListener('click', add_contact);

    const saveClientBtn = document.getElementById('new-client-save-btn');

    function save_client(){
        const nameValue = document.getElementById('new-client__name');
        const surnameValue = document.getElementById('new-client__surname');
        const lastNameValue = document.getElementById('new-client__lastname');
        const contacts = document.getElementsByClassName('new-client-contacts__item');
        const errorsContainer = document.getElementById('new-client-bottom__errors');

        const client = validateClientForm(nameValue, surnameValue, lastNameValue, contacts, errorsContainer);
        if (client){
            newClientsContacts.innerHTML = '';
            postClient(client, [{button: saveClientBtn, action: save_client}, {button: newContactBtn, action: add_contact}]);
        };
    }

    saveClientBtn.addEventListener('click', save_client)

    const newClientExit = document.getElementById('new-client__exit-btn-id');
    const newClientCancel = document.getElementById('new-client-cancel-btn');
    [newClientExit, newClientCancel].forEach(function(elem) {
        elem.addEventListener('click', ()=> {
        newClientContainer.setAttribute('style', 'display:none;');
        newContactBtn.removeEventListener('click', add_contact);
        saveClientBtn.removeEventListener('click', save_client);
        newClientContactErrors.innerHTML = '';
        removeShadow();
        });
    });

};


export function addChangeClientForm(client){
    const changeClientContainer = document.getElementById('change-client-id');
    shadow();
    changeClientContainer.setAttribute('style', 'display:block;');

    const changeClientID = document.getElementById('change-client_ID');
    changeClientID.textContent = `ID: ${client.id}`

    const changeClientSurName = document.getElementById('change-client__surname');
    const changeClientName = document.getElementById('change-client__name');
    const changeClientLastName = document.getElementById('change-client__lastname');
    const changeClientErrors = document.getElementById('change-client-bottom__errors');

    changeClientName.value = client.name
    changeClientSurName.value = client.surname
    changeClientLastName.value = client.lastName

    const contactsChangeList = document.getElementById('change-contacts-list');


    for (const i_contact of client.contacts) {
        createContactItem(contactsChangeList, i_contact.type, i_contact.value)
    };

    const addContactBtn = document.getElementById('change-client-contacts__btn');


    function add_contact(){
        if (contactsChangeList.childNodes.length <= 10) {
            createContactItem(contactsChangeList);
        }else {
    
            changeClientErrors.textContent = 'Ошибка: Вы не можете добавить более 10 контактов!';
            changeClientErrors.setAttribute('style', 'display:block;')
        }
    }

    addContactBtn.addEventListener('click', add_contact);


    const confirmChangesBtn = document.getElementById('change-client-save-btn');

    function confirm_changes(){
        const contacts = document.getElementsByClassName('new-client-contacts__item');
        const client_valid = validateClientForm(changeClientName, changeClientSurName, changeClientLastName, contacts, changeClientErrors);
        if (client_valid) {
            contactsChangeList.innerHTML = '';
            updateClient(client_valid, client.id, [{button: confirmChangesBtn, action: confirm_changes}, 
                {button: addContactBtn, action: add_contact}, {button: removeClientBtn, action: remove_client}]);
        }
    }

    confirmChangesBtn.addEventListener('click', confirm_changes);

    const removeClientBtn = document.getElementById('change-client-del-btn');

    function remove_client(){
        confirmChangesBtn.removeEventListener('click', confirm_changes);
        changeClientContainer.setAttribute('style', 'display:none;');
        contactsChangeList.innerHTML = '';
        removeShadow();
        removeClient(client.id, removeClientBtn, remove_client);
    }
    removeClientBtn.addEventListener('click', remove_client);

    const changeClientExit = document.getElementById('change-client__exit-btn-id');

    changeClientExit.addEventListener('click', ()=>{
        addContactBtn.removeEventListener('click', add_contact);
        confirmChangesBtn.removeEventListener('click', confirm_changes);
        removeClientBtn.removeEventListener('click', remove_client);
        changeClientContainer.setAttribute('style', 'display:none;');
        contactsChangeList.innerHTML = '';
        changeClientErrors.innerHTML = '';
        removeShadow();
        
    })
}

function addDeleteClientForm(id){
    const removeClientContainer = document.getElementById('remove-client')
    shadow();
    removeClientContainer.setAttribute('style', 'display:block;')

    function remove_client(){
        removeClient(id, removeClientConfirm, remove_client);
    };

    const removeClientConfirm = document.getElementById('remove-client-del-btn');
    removeClientConfirm.addEventListener('click', remove_client)

    const removeClientExit = document.getElementById('remove-client__exit-btn');
    const removeClientCancel = document.getElementById('remove-client-cancel-btn');

    [removeClientExit, removeClientCancel].forEach(function(elem) {
        elem.addEventListener('click', ()=> {
        removeClientContainer.setAttribute('style', 'display:none;');
        removeClientConfirm.removeEventListener('click', remove_client);
        removeShadow();
        });
    });
}

export function createClientsTable(clients){
    const TBODY = document.getElementById('clients-table-body_id');
    TBODY.innerHTML = '';

    for (const client of clients) {
        const row = document.createElement('tr');
        row.classList.add('client_row')

        const ID = document.createElement('td');
        ID.classList.add('id_td')
        ID.textContent = client.id

        const name = document.createElement('td');
        name.classList.add('name_td')
        name.textContent = `${client.surname} ${client.name} ${client.lastName}`;

        const created_At = document.createElement('td');
        created_At.classList.add('created_td')
        const createdDate = new Date(client.createdAt); 
        const createdTime = document.createElement('span');
        createdTime.classList.add('client-time')
        createdTime.textContent =  `${createdDate.toLocaleTimeString().substring(0, 5)}`;
        created_At.textContent = `${createdDate.toLocaleDateString()}  `;
        created_At.append(createdTime);

        const updated_At = document.createElement('td');
        updated_At.classList.add('updated_td')
        const updatedDate = new Date(client.updatedAt);
        const updatedTime = document.createElement('span');
        updatedTime.classList.add('client-time')
        updatedTime.textContent =  `${updatedDate.toLocaleTimeString().substring(0, 5)}`;
        updated_At.textContent = `${updatedDate.toLocaleDateString()}  `;
        updated_At.append(updatedTime)


        const contacts = document.createElement('td');
        contacts.classList.add('contacts_td')
        contacts.setAttribute('style', 'max-width: 100px')
        const contactsList = document.createElement('ul');
        contactsList.classList.add('clients_contacts_list')

        for (const i_contact of client.contacts){
            const contactsItem = document.createElement('li');
            contactsItem.classList.add('contact');
            tippy(contactsItem, {
                content: `${i_contact.type}: ${i_contact.value}`,
                interactive: true,
              });
            switch (i_contact.type){
                case 'Телефон':
                    contactsItem.classList.add('phone_contact');
                    break
                case 'Vk':
                    contactsItem.classList.add('vk_contact');
                    break
                case 'Facebook':
                    contactsItem.classList.add('facebook_contact');
                    break
                case 'Email':
                    contactsItem.classList.add('email_contact');
                    break
                default:
                    contactsItem.classList.add('alert_contact');
                    break
            }

            contactsList.append(contactsItem);
        }

        contacts.append(contactsList);

        const actions = document.createElement('td');
        actions.setAttribute('style', 'padding-left: 30px;')
        const changeAction = document.createElement('button');
        changeAction.textContent = 'Изменить';
        changeAction.setAttribute('id', 'change-client-btn');
        
        tippy(changeAction, {
            content: `${window.location.href.split('#')[0]}#${client.id}`,
            interactive: true,
            maxWidth: 'none',
          });
        const deleteAction = document.createElement('button');
        deleteAction.textContent = 'Удалить';
        deleteAction.setAttribute('id', 'remove-client-btn');
        actions.append(changeAction, deleteAction);

        deleteAction.addEventListener('click', ()=> {
            addDeleteClientForm(client.id);
        });

        changeAction.addEventListener('click', ()=>{
            getClient(client.id);

        });

        row.append(ID, name, created_At, updated_At, contacts, actions);

        TBODY.append(row);
    };
};


export function serverErrors(newClientContactErrors, response){
    if (response.errors){
        for (const i_error of response.errors){
            newClientContactErrors.textContent = `Ошибка: ${i_error.message}`;
        }
    }else{
        newClientContactErrors.textContent = `Ошибка: Что-то пошло не так...`;
    }
    newClientContactErrors.setAttribute('style', 'display:block;')
}