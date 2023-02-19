import {addChangeClientForm, serverErrors, removeShadow} from './createDOM.js'
import {sortedClients, changeDelay} from './app.js'

const SERVER_URL = 'http://localhost:3000/api/clients'

function response_status(response, res, errorsContainer, container, actions_array){
    if (Number(response.status) != 200 && Number(response.status) != 201) {
        serverErrors(errorsContainer, res);
    } else if (Number(response.status) == 200 || Number(response.status) == 201) {
        for (const i_action of actions_array){
            i_action.button.removeEventListener('click', i_action.action)
        }

        container.setAttribute('style', 'display:none;');
        removeShadow();
        getClients(null);
    }
}

export async function postClient(newClient, actions_array){
    const response = await fetch(SERVER_URL, {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(newClient)
    });
    const newClientContactErrors = document.getElementById('new-client-bottom__errors');
    const newClientContainer = document.getElementById('new-client-id');

    const res = await response.json();

    response_status(response, res, newClientContactErrors, newClientContainer, actions_array);
};

export async function getClients(search=null){
    const response = await fetch(SERVER_URL, {
        method: 'GET'
    });
    const data = await response.json();

    if (search){
        changeDelay(data);
    }else {
        sortedClients(data);
    }
}

export async function getClient(id){
    const response = await fetch(`${SERVER_URL}/${id}`, {
        method:'GET'
    })
    const data = await response.json();
    addChangeClientForm(data);
}

export async function removeClient(id, btn, action){
    const response = await fetch(`${SERVER_URL}/${id}`, {
        method:'DELETE'
    })
    const removeClientContainer = document.getElementById('remove-client');
    removeClientContainer.setAttribute('style', 'display:none;');
    btn.removeEventListener('click', action)
    removeShadow();
    getClients(null);
}

export async function updateClient(client, id, actions_array){
    const response = await fetch(`${SERVER_URL}/${id}`, {
        method:'PATCH',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    });

    const res = await response.json();

    const changeClientContactErrors = document.getElementById('change-client-bottom__errors');
    const changeClientContainer = document.getElementById('change-client-id');

    response_status(response, res, changeClientContactErrors, changeClientContainer, actions_array)
}
