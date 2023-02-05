import {AddNewClientForm, CreateClientsTable} from './createDOM.js';
import {PostClient, GetClients, GetClient} from './api.js';

document.addEventListener('DOMContentLoaded', ()=> {

    function CreateApp(){
        window.addEventListener('hashchange',() =>{
            GetClient(location.hash.substring(1));

        });

        GetClients();

        const AddNewClientBtn = document.getElementById('add_new_client');
        
        AddNewClientBtn.addEventListener('click', ()=> {
            AddNewClientForm();

            const SaveClientBtn = document.getElementById('new-client-save-btn');

            SaveClientBtn.addEventListener('click', ()=> {
                const NameValue = document.getElementById('new-client__name');
                const SurnameValue = document.getElementById('new-client__surname');
                const LastnameValue = document.getElementById('new-client__lastname');
                const Contacts = document.getElementsByClassName('new-client-contacts__item');
                const ErrorsContainer = document.getElementById('new-client-bottom__errors');

                const Client = ValidateClientForm(NameValue, SurnameValue, LastnameValue, Contacts, ErrorsContainer);
                if (Client){
                    PostClient(Client);
                };
                
                    
            });
        });

        const SearchClientInput = document.getElementById('search_input');
        SearchClientInput.addEventListener('change', GetClients);

    };

    CreateApp();
});

export function ValidateClientForm(NameValue, SurnameValue, LastnameValue, Contacts, ErrorsContainer){
    const ContactsObject = [];

    if (!NameValue.value.trim() || !SurnameValue.value.trim()){
        ErrorsContainer.setAttribute('style', 'display:block')
        ErrorsContainer.textContent = 'Имя и Фамилия обязательны для заполнения!'
        NameValue.setAttribute('style', 'border-bottom: 1px solid #F06A4D')
        SurnameValue.setAttribute('style', 'border-bottom: 1px solid #F06A4D')

        NameValue.addEventListener('change', ()=> {
                NameValue.setAttribute('style', 'border-bottom: 1px solid #B0B0B0');
            })
        
        SurnameValue.addEventListener('change', ()=> {
            SurnameValue.setAttribute('style', 'border-bottom: 1px solid #B0B0B0');
        })


    } else {

        for (const i_contact of Contacts) {
            const Type = i_contact.childNodes[0].value;
            const Value = i_contact.childNodes[2].value;

            ContactsObject.push({'type': Type, 'value': Value});
            
        };
        
        const NewClient = {name: NameValue.value.trim(), surname: SurnameValue.value.trim(), lastName:LastnameValue.value.trim(), contacts:ContactsObject};
        return NewClient;
    };
}

export function SortedClients(clients){
    const items = clients.sort((a, b) => a.id - b.id);

    const IDBtn = document.getElementById('id_sort');
    IDBtn.addEventListener('click', ()=> {
        IDBtn.classList.toggle('id_down');
        if (IDBtn.classList.contains('id_down')){
            const id_items = clients.sort((a, b) => b.id - a.id);
            CreateClientsTable(id_items);
        }else{
            const id_items = clients.sort((a, b) => a.id - b.id);
            CreateClientsTable(id_items);
        }
    })

    const NameBtn = document.getElementById('name_sort');
    NameBtn.addEventListener('click', ()=> {
        NameBtn.classList.toggle('name_up');
        if (NameBtn.classList.contains('name_up')){
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
            CreateClientsTable(name_items);
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
            CreateClientsTable(name_items);
        }
    })

    const CreatedBtn = document.getElementById('created_btn');
    CreatedBtn.addEventListener('click', ()=> {
        CreatedBtn.classList.toggle('created_down');
        if (CreatedBtn.classList.contains('created_down')){
            const created_items = clients.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
            CreateClientsTable(created_items);
        }else{
            const created_items = clients.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
            CreateClientsTable(created_items);
        }
    })

    const UpdatedBtn = document.getElementById('updated_btn');
    UpdatedBtn.addEventListener('click', ()=> {
        UpdatedBtn.classList.toggle('updated_down');
        if (UpdatedBtn.classList.contains('updated_down')){
            const updated_items = clients.sort((a, b) => new Date(a.updatedAt) - new Date(b.updatedAt));
            CreateClientsTable(updated_items);
        }else{
            const updated_items = clients.sort((a, b) => new Date(b.updatedAt) - new Date(a.updatedAt));
            CreateClientsTable(updated_items);
        }
    })

    CreateClientsTable(items);
};

let TimeoutId = null;
export function ChangeDelay(clients) {

    clearTimeout(TimeoutId);
    const SearchInput = document.getElementById('search_input');
    function Search() {

        function FilterBySubstrOfName(client){
            const InputValue = SearchInput.value;
            if (client.surname.includes(InputValue) || client.name.includes(InputValue) || client.lastName.includes(InputValue)) {
                return true;
                };
                return false;
        };
        const FilteredArray = clients.filter(FilterBySubstrOfName);
        CreateClientsTable(FilteredArray);
    };

    TimeoutId = setTimeout(Search, 300);
};
