import {addNewClientForm, createClientsTable} from './createDOM.js';
import {getClients, getClient} from './api.js';

document.addEventListener('DOMContentLoaded', ()=> {

    function createApp(){
        window.addEventListener('hashchange',() =>{
            getClient(location.hash.substring(1));

        });

        getClients();

        const addNewClientBtn = document.getElementById('add_new_client');
        
        addNewClientBtn.addEventListener('click', ()=> {
            addNewClientForm();
        });

        const searchClientInput = document.getElementById('search_input');
        searchClientInput.addEventListener('change', getClients);

    };

    createApp();
});

export function validateClientForm(nameValue, surnameValue, lastNameValue, contacts, errorsContainer){
    const contactsObject = [];

    if (!nameValue.value.trim() || !surnameValue.value.trim()){
        errorsContainer.setAttribute('style', 'display:block')
        errorsContainer.textContent = 'Имя и Фамилия обязательны для заполнения!'
        nameValue.setAttribute('style', 'border-bottom: 1px solid #F06A4D')
        surnameValue.setAttribute('style', 'border-bottom: 1px solid #F06A4D')

        nameValue.addEventListener('change', ()=> {
                nameValue.setAttribute('style', 'border-bottom: 1px solid #B0B0B0');
            })
        
        surnameValue.addEventListener('change', ()=> {
            surnameValue.setAttribute('style', 'border-bottom: 1px solid #B0B0B0');
        })


    } else {

        for (const i_contact of contacts) {
            const type = i_contact.childNodes[0].value;
            const value = i_contact.childNodes[2].value;

            contactsObject.push({'type': type, 'value': value});
            
        };
        
        const newClient = {name: nameValue.value.trim(), surname: surnameValue.value.trim(), lastName:lastNameValue.value.trim(), contacts:contactsObject};
        return newClient;
    };
}

export function sortedClients(clients){
    const items = clients.sort((a, b) => a.id - b.id);


    const idBtn = document.getElementById('id_sort');
    idBtn.addEventListener('click', sort_id)

    function sort_id(){
        idBtn.classList.toggle('id_down');
        if (idBtn.classList.contains('id_down')){
            const id_items = clients.sort((a, b) => b.id - a.id);
            createClientsTable(id_items);
        }else{
            const id_items = clients.sort((a, b) => a.id - b.id);
            createClientsTable(id_items);
        }
    }


    const nameBtn = document.getElementById('name_sort');
    nameBtn.addEventListener('click', ()=> {
        nameBtn.classList.toggle('name_up');
        if (nameBtn.classList.contains('name_up')){
            const name_items = clients.sort((a, b) => {
                const name1 = a.surname.toUpperCase();
                const name2 = b.surname.toUpperCase();
                if (name1 < name2) {
                    return -1;
                  }
                  if (name1 > name2) {
                    return 1;
                  }
                  return 0;
            })
            createClientsTable(name_items);
        }else{
            const name_items = clients.sort((a, b) => {
                const name1 = a.surname.toUpperCase();
                const name2 = b.surname.toUpperCase();
                if (name1 > name2) {
                    return -1;
                  }
                  if (name1 < name2) {
                    return 1;
                  }
                  return 0;
            })
            createClientsTable(name_items);
        }
    })

    const createdBtn = document.getElementById('created_btn');
    createdBtn.addEventListener('click', ()=> {
        createdBtn.classList.toggle('created_down');
        if (createdBtn.classList.contains('created_down')){
            const created_items = clients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            createClientsTable(created_items);
        }else{
            const created_items = clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            createClientsTable(created_items);
        }
    })

    const updatedBtn = document.getElementById('updated_btn');
    updatedBtn.addEventListener('click', ()=> {
        updatedBtn.classList.toggle('updated_down');
        if (updatedBtn.classList.contains('updated_down')){
            const updated_items = clients.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            createClientsTable(updated_items);
        }else{
            const updated_items = clients.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            createClientsTable(updated_items);
        }
    })

    createClientsTable(items);
};

let timeoutId = null;
export function changeDelay(clients) {

    clearTimeout(timeoutId);
    const searchInput = document.getElementById('search_input');
    function search() {

        function filterBySubstrOfName(client){
            const inputValue = searchInput.value;
            if (client.surname.includes(inputValue) || client.name.includes(inputValue) || client.lastName.includes(inputValue)) {
                return true;
                };
                return false;
        };
        const FilteredArray = clients.filter(filterBySubstrOfName);
        createClientsTable(FilteredArray);
    };

    timeoutId = setTimeout(search, 300);
};
