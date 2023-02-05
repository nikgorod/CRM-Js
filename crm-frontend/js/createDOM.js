import {RemoveClient, GetClient, UpdateClient} from './api.js';
import {ValidateClientForm} from './app.js'

function Shadow(){
    const ShadowBox = document.getElementById('shadow-box');
    ShadowBox.setAttribute('style', 'display: block;')
}

function RemoveShadow(){
    const ShadowBox = document.getElementById('shadow-box');
    ShadowBox.setAttribute('style', 'display: none;')
}

function CreateContactItem(Clients_contacts, type=null, value=null) {
    const ContactsVarsList = ['Телефон', 'Vk', 'Facebook', 'Email', 'Другое']; 

    const NewClientContact = document.createElement('li');
    NewClientContact.classList.add('new-client-contacts__item');

    const NewClientInput = document.createElement('input');
    NewClientInput.classList.add('new-client-contacts__input');
    NewClientInput.setAttribute('list', 'contacts');
    NewClientInput.setAttribute('name', 'contacts');

    const DataList = document.createElement('datalist');
    DataList.setAttribute('id', 'contacts')

    for (const i_contact of ContactsVarsList) {
        const NewOption = document.createElement('option');
        NewOption.classList.add('contacts__element');
        NewOption.value = i_contact;

        DataList.append(NewOption);
    }

    const NewClientValueInput = document.createElement('input');
    NewClientValueInput.classList.add('new-client-contacts__input_alert');
    if(type && value) {
        NewClientValueInput.value = value;
        NewClientInput.value = type;
    }
    NewClientValueInput.setAttribute('placeholder', 'Введите данные контакта');
    NewClientValueInput.addEventListener('click', ()=>{
        if (NewClientInput.value == 'Телефон'){
            NewClientValueInput.setAttribute('id', 'phone')
        }
    })

    const NewClientContactRemoveBtn = document.createElement('button');
    NewClientContactRemoveBtn.classList.add('new-client-contacts__remove-btn');
    NewClientContactRemoveBtn.setAttribute('id', 'new-client-contacts__remove-btn');
    tippy(NewClientContactRemoveBtn, {
        content: "Удалить контакт",
    })

    NewClientContactRemoveBtn.addEventListener('click', ()=> {
        Clients_contacts.removeChild(NewClientContact);

    });

    NewClientContact.append(NewClientInput);
    NewClientContact.append(DataList);
    NewClientContact.append(NewClientValueInput);
    NewClientContact.append(NewClientContactRemoveBtn);

    Clients_contacts.append(NewClientContact);
};

export function AddNewClientForm(){
const NewClientContainer = document.getElementById('new-client-id');
    NewClientContainer.setAttribute('style', 'display:block;');
    Shadow();

    const NewClientExit = document.getElementById('new-client__exit-btn-id');
    const NewClientCancel = document.getElementById('new-client-cancel-btn');
    const ContactsList = document.getElementById('contacts-list');
    [NewClientExit, NewClientCancel].forEach(function(elem) {
        elem.addEventListener('click', ()=> {
        NewClientContainer.setAttribute('style', 'display:none;');
        RemoveShadow();
        ContactsList.innerHTML = "";
        });
    });

    const NewContactBtn = document.getElementById('new-client-contacts__btn');
    NewContactBtn.addEventListener('click', ()=> {
        const NewClientsContacts = document.getElementById('new-client-contacts__items');

        if (NewClientsContacts.childNodes.length <= 12) {
            CreateContactItem(NewClientsContacts);
        }else {
            const NewClientContactErrors = document.getElementById('new-client-bottom__errors');
            NewClientContactErrors.textContent = 'Ошибка: Вы не можете добавить более 10 контактов!';
            NewClientContactErrors.setAttribute('style', 'display:block;')
        }



    })
};


export function AddChangeClientForm(client){
    const ChangeClientContainer = document.getElementById('change-client-id');
    Shadow();
    ChangeClientContainer.setAttribute('style', 'display:block;');

    const ChangeClientExit = document.getElementById('change-client__exit-btn-id');

    ChangeClientExit.addEventListener('click', ()=>{
        ChangeClientContainer.setAttribute('style', 'display:none;');
        RemoveShadow();
        ContactsChangeList.innerHTML = '';
    })

    const ChangeClientID = document.getElementById('change-client_ID');
    ChangeClientID.textContent = `ID: ${client.id}`

    const ChangeClientSurName = document.getElementById('change-client__surname');
    const ChangeClientName = document.getElementById('change-client__name');
    const ChangeClientLastName = document.getElementById('change-client__lastname');
    const ChangeClientErrors = document.getElementById('change-client-bottom__errors');

    ChangeClientName.value = client.name
    ChangeClientSurName.value = client.surname
    ChangeClientLastName.value = client.lastName

    const AddContactBtn = document.getElementById('change-client-contacts__btn');
    const ContactsChangeList = document.getElementById('change-contacts-list');
    AddContactBtn.addEventListener('click', ()=>{
        CreateContactItem(ContactsChangeList);
    })

    for (const i_contact of client.contacts) {
        CreateContactItem(ContactsChangeList, i_contact.type, i_contact.value)
    };

    const ConfirmChangesBtn = document.getElementById('change-client-save-btn');
    ConfirmChangesBtn.addEventListener('click', ()=> {
        const Contacts = document.getElementsByClassName('new-client-contacts__item');
        const Client = ValidateClientForm(ChangeClientName, ChangeClientSurName, ChangeClientLastName, Contacts, ChangeClientErrors);
        if (Client) {
            UpdateClient(Client, client.id);
        }
    })

    const RemoveClientBtn = document.getElementById('change-client-del-btn');
    RemoveClientBtn.addEventListener('click', ()=>{
        RemoveClient(client.id);
    })
}

function AddDeleteClientForm(id){
    const RemoveClientContainer = document.getElementById('remove-client')
    Shadow();
    RemoveClientContainer.setAttribute('style', 'display:block;')

    const RemoveClientExit = document.getElementById('remove-client__exit-btn');
    const RemoveClientCancel = document.getElementById('remove-client-cancel-btn');

    [RemoveClientExit, RemoveClientCancel].forEach(function(elem) {
        elem.addEventListener('click', ()=> {
        RemoveClientContainer.setAttribute('style', 'display:none;');
        RemoveShadow();
        });
    });

    const RemoveClientConfirm = document.getElementById('remove-client-del-btn');
    RemoveClientConfirm.addEventListener('click', ()=>{
        RemoveClient(id)
    })
}

export function CreateClientsTable(clients){
    const TBODY = document.getElementById('clients-table-body_id');
    TBODY.innerHTML = '';

    for (const client of clients) {
        const row = document.createElement('tr');
        row.classList.add('client_row')

        const ID = document.createElement('td');
        ID.classList.add('id_td')
        ID.textContent = client.id

        const Name = document.createElement('td');
        Name.textContent = `${client.surname} ${client.name} ${client.lastName}`;

        const Created_At = document.createElement('td');
        const createdDate = new Date(client.createdAt); 
        const CreatedTime = document.createElement('span');
        CreatedTime.classList.add('client-time')
        CreatedTime.textContent =  `${createdDate.toLocaleTimeString().substring(0, 5)}`;
        Created_At.textContent = `${createdDate.toLocaleDateString()}  `;
        Created_At.append(CreatedTime);

        const Updated_At = document.createElement('td');
        const updatedDate = new Date(client.updatedAt);
        const UpdatedTime = document.createElement('span');
        UpdatedTime.classList.add('client-time')
        UpdatedTime.textContent =  `${updatedDate.toLocaleTimeString().substring(0, 5)}`;
        Updated_At.textContent = `${updatedDate.toLocaleDateString()}  `;
        Updated_At.append(UpdatedTime)


        const Contacts = document.createElement('td');
        Contacts.setAttribute('style', 'max-width: 100px')
        const ContactsList = document.createElement('ul');
        ContactsList.classList.add('clients_contacts_list')

        for (const i_contact of client.contacts){
            const ContactsItem = document.createElement('li');
            ContactsItem.classList.add('contact');
            tippy(ContactsItem, {
                content: `${i_contact.type}: ${i_contact.value}`,
                interactive: true,
              });
            switch (i_contact.type){
                case 'Телефон':
                    ContactsItem.classList.add('phone_contact');
                    break
                case 'Vk':
                    ContactsItem.classList.add('vk_contact');
                    break
                case 'Facebook':
                    ContactsItem.classList.add('facebook_contact');
                    break
                case 'Email':
                    ContactsItem.classList.add('email_contact');
                    break
                default:
                    ContactsItem.classList.add('alert_contact');
                    break
            }

            ContactsList.append(ContactsItem);
        }

        Contacts.append(ContactsList);

        const Actions = document.createElement('td');
        Actions.setAttribute('style', 'padding-left: 30px;')
        const ChangeAction = document.createElement('button');
        ChangeAction.textContent = 'Изменить';
        ChangeAction.setAttribute('id', 'change-client-btn');
        
        tippy(ChangeAction, {
            content: `${window.location.href.split('#')[0]}#${client.id}`,
            interactive: true,
            maxWidth: 'none',
          });
        const DeleteAction = document.createElement('button');
        DeleteAction.textContent = 'Удалить';
        DeleteAction.setAttribute('id', 'remove-client-btn');
        Actions.append(ChangeAction, DeleteAction);

        DeleteAction.addEventListener('click', ()=> {
            AddDeleteClientForm(client.id);
        });

        ChangeAction.addEventListener('click', ()=>{
            GetClient(client.id);

        });

        row.append(ID, Name, Created_At, Updated_At, Contacts, Actions);

        TBODY.append(row);
    };
};


export function ServerErrors(NewClientContactErrors, response){
    NewClientContactErrors.textContent = `Ошибка: ${response.status} ${response.statusText}`;
    NewClientContactErrors.setAttribute('style', 'display:block;')
}