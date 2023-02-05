import {AddChangeClientForm, ServerErrors} from './createDOM.js'
import {SortedClients, ChangeDelay} from './app.js'

export async function PostClient(NewClient){
    const response = await fetch('http://localhost:3000/api/clients', {
        method:'POST',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(NewClient)
    });

    if (Number(response.status) != 200 && Number(response.status) != 201) {
        const NewClientContactErrors = document.getElementById('new-client-bottom__errors');
        ServerErrors(NewClientContactErrors, response);
    }

};

export async function GetClients(search=null){
    const response = await fetch('http://localhost:3000/api/clients', {
        method: 'GET'
    });
    const data = await response.json();

    if (search){
        ChangeDelay(data);
    }else {
        SortedClients(data);
    }
}

export async function GetClient(id){
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method:'GET'
    })
    const data = await response.json();
    AddChangeClientForm(data);
}

export async function RemoveClient(id){
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method:'DELETE'
    })
}

export async function UpdateClient(client, id){
    const response = await fetch(`http://localhost:3000/api/clients/${id}`, {
        method:'PATCH',
        headers:{'Content-Type': 'application/json'},
        body: JSON.stringify(client)
    });

    if (Number(response.status) != 200 && Number(response.status) != 201) {
        const NewClientContactErrors = document.getElementById('change-client-bottom__errors');
        ServerErrors(NewClientContactErrors, response);
    }
}